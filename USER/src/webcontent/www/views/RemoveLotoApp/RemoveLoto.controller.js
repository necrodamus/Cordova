sap.ui.controller("LOTO.views.RemoveLotoApp.RemoveLoto", {
    _initialSorter: [],
    _oTable: null,

	onInit: function () {

        var _this = this;
        BusyDialogHelper.open("Loading");
        _this.getView().addEventDelegate({onAfterRendering: function () {                                       
            setTimeout(function () {                                             
            }, 0);
        }}, _this);

        _this._oTable.addEventDelegate({onAfterRendering: function () {
            var checkTable = _this._oTable.getModel();

            if ( checkTable !== undefined) {
                BusyDialogHelper.close();    
                var checkBox = sap.ui.getCore().byId("inputSearchBox");
                if  (checkBox !== undefined) {
                    sap.ui.getCore().byId("inputSearchBox").focus();                                                                                   
                }                                                
            }
        }});
	},
	
    onAfterRendering: function () {
        $('#RemoveLoto').closest('body')
                        .removeClass('body-performLoto-table body-VerifyLoto-table')
                        .addClass('body-removeLoto-table');
        HiddenIconHelper._iconReset(this);
        /*Reset Image Header*/
        RefreshImageHelper.imageReset(this);
        localStorage.setItem("SearchRead", "");
        BluetoothHelper.checkBluetooth();
        localStorage.setItem("App", "");
        if (localStorage.getItem("FilterInit") === "X") {
            this.loadDynamicColumns();
            this.tableFiltersModel();
            this.selectedFilterValuesModel();
            this.loadModel();
            localStorage.setItem("FilterInit", "");
        }
        var oModel = new sap.ui.model.json.JSONModel({
            EIDCodeSearch: "",
        });

        this.getView().setModel(oModel, "LotoCodesModel");
        if (localStorage.getItem("FilterInit") === "") {
            this.onComboSelection();
        }
    },

    onComboSelection: function () {
        var aFilters = [];
        this.getFilters(aFilters);
        var filter = this._oTable.getBinding("rows");
        if (filter !== undefined) {
            this._oTable.getBinding("rows").filter(aFilters);
            this._oTable.getBinding("rows").refresh(true);
        }
    },

    handleTxtFilter : function(oEvent) {
        var sQuery = oEvent ? oEvent.getParameter("query") : null;
        this._oTxtFilter = null;
        if (sQuery !== "" && sQuery !==  null) {
            SearchCodeHelper._onSearchConfirm(this, sQuery);
        }        
    },

    handleSearch: function () {
        return new sap.m.HBox({
            justifyContent: sap.m.FlexJustifyContent.End,
            alignItems: sap.m.FlexAlignItems.End,
            direction: sap.m.FlexDirection.Column,
            width: "auto",
            items: [
                    new sap.m.Toolbar({
                        content: [
                                  new sap.m.Label({
                                      text: "{i18n>SearchPermit}"
                                  }),
                                  new sap.m.SearchField({
                                      id: 'inputSearchBox',
                                      placeholder: '',
                                      showSearchButton: true,
                                      liveChange: [this.handleInputLiveChangeSearch, this],
                                      search: [this.handleTxtFilter, this],
                                      width: '20rem'
                                  }).addStyleClass("perTool"),
                                  new sap.m.Image({                                    
                                      visible:true,                                      
                                      width: "55px",
                                      src: "img/orange/camera_orange.svg",
                                      press: [this.handleScan, this]
                                  })

                                  ]}),
                                  ]
        }).addStyleClass("boxSearch")
    },


    onSearch: function () {
        SearchCodeHelper._onSearch(this);
    },

    onSearchConfirm: function () {
        SearchCodeHelper._onSearchConfirm(this);
    },


    handleInputLiveChangeSearch: function (oEvent) {
        SearchCodeHelper._handleInputLiveChangeSearch(oEvent,this,14);
    },

    getClassPerformScan: function () {
        if (UserHelper.getUserData()["LotoCode"] === "1") {
            return "FlexBoxScanAccessNew"
        } else {
            return "FlexBoxScanAccess"
        }
    },
    loadModel: function () {
        StatusHelper.loadStatuses(this.getView(), this.getInitialFilters());
    },

    getInitialFilters: function () {
        var sPlant = UserHelper.getUserData()['PlanningPlantID'];
        var sRevisionCode = localStorage.getItem('RevisionCode');

        return [
            new sap.ui.model.Filter("PlanningPlantID", sap.ui.model.FilterOperator.EQ, sPlant),
            new sap.ui.model.Filter("RevisionCode", sap.ui.model.FilterOperator.EQ, sRevisionCode),
            new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P6")
        ];

    },

    toLaunchpadView: function () {
        var farId = sap.ui.getCore().byId("facetFilter");
        if (farId) {
            farId.destroy();  
        } 
        StoresHelper.checkCurrentyAppStoresEmpty(function (bEmptyStores) {
            var fnCallback = function () {
                        NavigationHelper.setCurrentApp("Launchpad");
                        NavigationHelper.back("Launchpad", true);
            };
            if (!bEmptyStores)
                MessageBoxHelper.showAlert("Information", "ChangesArePendingToBeSynchronized", fnCallback);
            else
                fnCallback();
        });
    },

    selectedFilterValuesModel: function () {
        this.getView().setModel(new sap.ui.model.json.JSONModel(), "SelectedComboFilter");
    },

    tableFiltersModel: function () {
        this.getView().setModel(new sap.ui.model.json.JSONModel([]), "TableFilters");
    },


    handleScan: function () {
	    var oView = this.getView();
        var oCodesModel = oView.getModel("LotoCodesModel");
        oCodesModel.setProperty("/EIDCodeEnabled",true) ;
        localStorage.setItem("SearchFlagInputScan","X");
        sap.ui.getCore().byId("inputSearchBox").setValue("");

            LotoScanHelper.handleScan(
                LotoScanHelper.oInputsTypes.Code,
                this.getView(),
                undefined,
                false
            );
    },

    getFilters: function (aFilters) {
        var aFilterKeys = this.getView().getModel("SelectedComboFilter").getData();
        for (var key in aFilterKeys) {
            if (aFilterKeys[key])
                aFilters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, aFilterKeys[key]))
        }
    },

    removeDuplicates: function (oArray, key) {
        var nArray = [];
        var nObject = {};
        for (var i in oArray) nObject[oArray[i][key]] = oArray[i];
        for (i in nObject) nArray.push(nObject[i]);
        return nArray;
    },


    loadDynamicColumns: function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("utils/LotoOperations/TableColumns.json", '', false);
        this.getView().setModel(oModel, "ColumnStructureModel");
    },

    setTable: function (oTable) {
        this._oTable = oTable;
    },

    _toConfirmRemoveLoto: function (oContext, bIsScan) {
        var oModel = this.getView().getModel("PermitsModel");
        localStorage.setItem("FlagTextIdPermit", "X");
        localStorage.setItem("App", "C");
        NavigationHelper.to({
            pageId: 'LOTO.views.RemoveLotoApp.RemoveLotoConfirm',
            model: oModel,
            context: oContext,
            parameters: {
                isScan: bIsScan,
            }
        });
    },

    handlePermitItemPress: function (oEvent) {

        var idx = oEvent.getParameter('rowIndex');
        var cxt = this._oTable.getContextByIndex(idx);
        if (cxt !== null) {
            var path = cxt.sPath;
            var obj = this._oTable.getModel().getProperty(path);  
            localStorage.setItem("StatusCodeNew", obj.StatusCodeNew);
            localStorage.setItem("SelectPermitKey", obj.PermitKey);
            localStorage.setItem("SelectStatus", obj.StatusDescNew);
            this._toConfirmRemoveLoto(cxt, oEvent.getParameter("isScan"));
        }
    },

});