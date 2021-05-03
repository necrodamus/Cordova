
sap.ui.controller("LOTO.views.PerformLotoApp.PerformLoto", {
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



    handleTxtFilter : function(oEvent) {
        var sQuery = oEvent ? oEvent.getParameter("query") : null;
        this._oTxtFilter = null;
        if (sQuery !== "" && sQuery !==  null) {
            SearchCodeHelper._onSearchConfirm(this, sQuery);
        }        
    },


    formatAvailableToObjectState : function(bAvailable) {
        return bAvailable ? "Success" : "Error";
    },


    onAfterRendering: function () {
        $('#PerformLoto').closest('body')
                         .removeClass('body-removeLoto-table body-VerifyLoto-table')
                         .addClass('body-performLoto-table');
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

    loadModel: function () {
        StatusHelper.loadStatuses(this.getView(), this.getInitialFilters());    
    },

    getInitialFilters: function () {
        var sPlant = UserHelper.getUserData()['PlanningPlantID'];
        var sRevisionCode = localStorage.getItem('RevisionCode');

        return [
                new sap.ui.model.Filter("PlanningPlantID", sap.ui.model.FilterOperator.EQ, sPlant),
                new sap.ui.model.Filter("RevisionCode", sap.ui.model.FilterOperator.EQ, sRevisionCode),
                new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P0X")
                ];

    },

    toLaunchpadView: function () {
        var farId = sap.ui.getCore().byId("facetFilter");
        if (farId) {
            farId.destroy();  
        } 
        StoresHelper.checkCurrentyAppStoresEmpty(function (bEmptyStores) {
            var fnCallback = function () {                   
                localStorage.setItem("BackAppPL", "");
                localStorage.setItem("App", "");
                NavigationHelper.setCurrentApp("Launchpad");
                NavigationHelper.back("Launchpad", true);                    
            };
            if (!bEmptyStores)
                MessageBoxHelper.showAlert("Information", "ChangesArePendingToBeSynchronized", fnCallback);
            else
                fnCallback();
        })



    },

    selectedFilterValuesModel: function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setSizeLimit(app.modelsLimit);
        this.getView().setModel(oModel, "SelectedComboFilter");

    },

    tableFiltersModel: function () {
        var oModel = new sap.ui.model.json.JSONModel([]);
        oModel.setSizeLimit(app.modelsLimit);
        this.getView().setModel(new sap.ui.model.json.JSONModel([]), "TableFilters");
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

    sorterIsApplied: function (oSorter) {
        for (var i = 0; i < this._initialSorter.length; i++) {
            if (this._initialSorter[i].sPath !== oSorter.sPath)
                return true;
            else return false;
        }
    },

    getClassPerformScan: function ( ) {
        if (UserHelper.getUserData()["LotoCode"] === "1"){
            return "FlexBoxScanAccessNew"
        }else {
            return "FlexBoxScanAccess"
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

    loadDynamicColumns: function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("utils/LotoOperations/TableColumns.json", '', false);
        this.getView().setModel(oModel, "ColumnStructureModel");
    },

    setTable: function (oTable) {
        this._oTable = oTable;
    },

    _toConfirmLoto: function (oContext, bIsScan) {
        var oModel = this.getView().getModel("PermitsModel");
        localStorage.setItem("App", "C");
        localStorage.setItem("BackAppPL", "");
        localStorage.setItem("PermitKey", "C");
        var checkBox = sap.ui.getCore().byId("inputSearchBox");
        if  (checkBox !== undefined) {
            checkBox.setValue("");                                                                            
        }                             
        NavigationHelper.to({
            pageId: 'LOTO.views.PerformLotoApp.ConfirmLoto',
            model: oModel,
            context: oContext,
            parameters: {
                isScan: bIsScan
            }
        });
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
                                      visible: true,                                      
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
        SearchCodeHelper._handleInputLiveChangeSearch(oEvent,this,16);
    },

    handlePermitItemPress: function (oEvent) {
              
        var idx = oEvent.getParameter('rowIndex');
        var cxt = this._oTable.getContextByIndex(idx);
        if (cxt !== null) {
            var path = cxt.sPath;
            var obj = this._oTable.getModel().getProperty(path);  

            localStorage.setItem("SelectPermitKey", obj.PermitKey);
            localStorage.setItem("SelectStatus", obj.StatusDescNew);
            this._toConfirmLoto(cxt, oEvent.getParameter("isScan"));
        }
    },

});

//# sourceURL=ms-appx-web://com.tenaris.loto/www/views/PerformLotoApp/PerformLoto.controller.js