sap.ui.controller("LOTO.views.VerifyLotoApp.VerifyLoto", {

    _initialSorter: [],
    _oTable: null,

    setTable: function (oTable) {
        this._oTable = oTable;
    },

    onInit: function () {
        window.value = "";
        window.colum = "";
        window.checkFilter = "";
        this.clearFilter();
        var _this = this;
        BusyDialogHelper.open("Loading");


        _this._oTable.addEventDelegate({onAfterRendering: function () {
         var checkTable = _this._oTable.getModel();


            if ( checkTable !== undefined) {
                BusyDialogHelper.close();   
                          
                var checkBox = sap.ui.getCore().byId("inputSearchBox");
                if  (checkBox !== undefined) {
                    sap.ui.getCore().byId("inputSearchBox").focus();                                                                                   
                    var t = sap.ui.getCore().byId("VerifyLoto").getController()._oTable;

                    t.detachFilter(function(oEvent) {
                        _this.makeFilters();
                    });

                    t.attachFilter(function(oEvent) {
                        _this.makeFilters();
                    });
                }                                               
            }
        }
        });



    },

    makeFilters: function(){
        setTimeout(function () {   
            var t = sap.ui.getCore().byId("VerifyLoto").getController()._oTable;
            var xFilters = [];
            var sWitch = sap.ui.getCore().byId("switchEditPositionVL");

            if (sWitch.getState() === false) {
               xFilters.push(new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P2"));
            }else{
                xFilters.push(new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P2"));
                xFilters.push(new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P0X"));
            }

            var filterSet = t.getBinding("rows").aFilters;
       
                for (var i = 0; i < filterSet.length; i++) {                    
                    xFilters.push(new sap.ui.model.Filter(filterSet[i].sPath, filterSet[i].sOperator, filterSet[i].oValue1));
                }

            t.getBinding("rows").filter(xFilters);                         
            t.getBinding("rows").refresh(true);
            var v = sap.ui.getCore().byId("VerifyLoto").getController();
//            v.makeSumRows();
        }, 50);
    },

    clearFilter : function(){

        var table = sap.ui.getCore().byId("VerifyLoto").getController()._oTable;
        if (table !== undefined) {
            var iColCounter = 0;
            table.clearSelection();
            var iTotalCols = table.getColumns().length;
            var oListBinding = table.getBinding();
            if (oListBinding) {
                oListBinding.aSorters = null;
                oListBinding.aFilters = null;
            }

        }
    },

    clearAllFilters : function() {
        this.clearFilter();
        this.handleTxtFilter();
        this._filter();
    },

    _filter : function() {
        sap.ui.getCore().byId("inputSearchBox").setValue("");
    },

    handleTxtFilter : function(oEvent) {
        var sQuery = oEvent ? oEvent.getParameter("query") : null;
        this._oTxtFilter = null;
        if (sQuery !== "") {
            SearchCodeHelper._onSearchConfirm(this, sQuery);
        }        
    },


    formatAvailableToObjectState : function(bAvailable) {
        return bAvailable ? "Success" : "Error";
    },


    onAfterRendering: function () {
        $('#VerifyLoto').closest('body')
                        .removeClass('body-removeLoto-table body-performLoto-table')
                        .addClass('body-VerifyLoto-table');
        HiddenIconHelper._iconReset(this);
        /*Reset Image Header*/
        RefreshImageHelper.imageReset(this);
        
        if (UserHelper.getUserData()["LotoCode"] === "2") {
            sap.ui.getCore().byId("switchDisplay").addStyleClass("LOTODisNone");
            sap.ui.getCore().byId("labelDisplay").addStyleClass("LOTODisNone");
        }

        localStorage.setItem("SearchRead", "");
        BluetoothHelper.checkBluetooth();
        if (localStorage.getItem("FilterInit") === "X") {           
            this.loadDynamicColumns();
            this.tableFiltersModel();
            this.selectedFilterValuesModel();
            this.loadModel();
            var oModel = new sap.ui.model.json.JSONModel({
                EIDCodeSearch: "",
            });
            this.getView().setModel(oModel, "LotoCodesModel");
            localStorage.setItem("FilterInit", "");
        }
        /*Reset Image Header*/
        localStorage.setItem("FlagSum", "X");       

    },


    loadModel: function () {
        StatusHelper.loadStatuses(this.getView(), this.getInitialFilters());
    },

    loadDynamicColumns: function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("utils/LotoOperations/TableColumns.json", '', false);
        this.getView().setModel(oModel, "ColumnStructureModel");
    },

    tableFiltersModel: function () {
        var oModel = new sap.ui.model.json.JSONModel([]);
        oModel.setSizeLimit(app.modelsLimit);
        this.getView().setModel(new sap.ui.model.json.JSONModel([]), "TableFilters");
    },

    selectedFilterValuesModel: function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setSizeLimit(app.modelsLimit);
        this.getView().setModel(oModel, "SelectedComboFilter");
    },

    getInitialFilters: function () {
        var sPlant = UserHelper.getUserData()['PlanningPlantID'];
        var sRevisionCode = localStorage.getItem('RevisionCode');

        return [
                new sap.ui.model.Filter("PlanningPlantID", sap.ui.model.FilterOperator.EQ, sPlant),
                new sap.ui.model.Filter("RevisionCode", sap.ui.model.FilterOperator.EQ, sRevisionCode),
                new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P3"),
                new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P3N"),
                new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P2"),
                new sap.ui.model.Filter("StatusCode", sap.ui.model.FilterOperator.EQ, "P0X")
                ];
    },
    getClassPerformScan: function ( ) {
        if (UserHelper.getUserData()["LotoCode"] === "1"){
            return "FlexBoxScanAccessNew"
        }else {
            return "FlexBoxScanAccess"
        }
    },

    clearFilterSwitch: function() {
      table = sap.ui.getCore().byId("VerifyLoto").getController()._oTable;
      
      if (table !== undefined) {
          var iColCounter = 0;
          table.clearSelection();
          var iTotalCols = table.getColumns().length;
          var oListBinding = table.getBinding();
          if (oListBinding) {
              oListBinding.aSorters = null;
              oListBinding.aFilters = null;
          }
          table.getModel().refresh(true);
          for ( iColCounter = 0; iColCounter < iTotalCols; iColCounter++) {
              table.getColumns()[iColCounter].setSorted(false);
              table.getColumns()[iColCounter].setFilterValue("");
              table.getColumns()[iColCounter].setFiltered(false);
          }
      }
    },

    onSwitchSelection: function (oControlEvent,aFilters) {
        this.clearFilterSwitch();
        var xFilters = [];
        var key = "StatusCode";         
        localStorage.setItem("FlagSum", "X");

        var idesde = 0;
        var aStatus = [];

        if (oControlEvent === true) {
            aStatus = ["P0X", "P2"];
        } else {
            aStatus = ["P2"];
        }

        for (var i = 0 ; i < aStatus.length; i++) {
            xFilters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, aStatus[i]));
        };


        var filterSet = this._oTable.getBinding("rows").aFilters;  
        if (filterSet) {        
            for (var i = 0; i < filterSet.length; i++) {
                if (filterSet[i].sPath !== "StatusCode")
                        xFilters.push(new sap.ui.model.Filter(filterSet[i].sPath, filterSet[i].sOperator, filterSet[i].oValue1));
            }

       }
       
       this._oTable.getBinding("rows").filter(xFilters);            
       this._oTable.getBinding("rows").refresh(true);
       localStorage.setItem("BackAppVL", "");
       this.makeSumRows();
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

    getFilters: function (aFilters) {
        var aFilterKeys = this.getView().getModel("SelectedComboFilter").getData();
        for (var key in aFilterKeys) {
            if (aFilterKeys[key])
                aFilters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, aFilterKeys[key]))
        }
    },

    makeSumRows: function () {
        var unlockedDevices = 0;
        var lockedDevices = 0;
        var _this = sap.ui.getCore().byId("VerifyLoto").getController();
        var oTable = sap.ui.getCore().byId("VerifyLoto").getController()._oTable;
        var aItems = sap.ui.getCore().byId("VerifyLoto").getController()._oTable.getBinding('rows').getContexts();


        for (var i = 0; i < aItems.length; i++) {
            var sPath = aItems[i].sPath;
            if ( aItems[i] !== undefined ) {
                var oPermitContext = oTable.getModel().getProperty(sPath);

                if (oPermitContext.StatusCode === oPermitContext.StatusCodeNew) {
                    unlockedDevices += 1;
                }
                if (oPermitContext.StatusCode !== oPermitContext.StatusCodeNew) {
                    lockedDevices += 1;
                }

            }
        }

        var oModel = new sap.ui.model.json.JSONModel({"locked": lockedDevices, "unlocked": unlockedDevices});
        _this.getView().setModel(oModel, "DeviceInformationModel");
        m = _this.getView().getModel("DeviceInformationModel");
        m.updateBindings(true);
    },

    removeDuplicates: function (oArray, key) {
        var nArray = [];
        var nObject = {};
        for (var i in oArray) nObject[oArray[i][key]] = oArray[i];
        for (i in nObject) nArray.push(nObject[i]);
        return nArray;
    },

    toLaunchpadView: function () {
        localStorage.setItem("VerifyLotoInit", "");
        StoresHelper.checkCurrentyAppStoresEmpty(function (bEmptyStores) {
            var fnCallback = function () {

                localStorage.setItem("App", "");
                localStorage.setItem("BackAppVL", "");
                NavigationHelper.setCurrentApp("Launchpad");
                NavigationHelper.back("Launchpad", true);
            };
            if (!bEmptyStores)
                MessageBoxHelper.showAlert("Information", "ChangesArePendingToBeSynchronized", fnCallback);
            else
                fnCallback();
        })
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
            this._toConfirmVerifyLoto(cxt, oEvent.getParameter("isScan"));
        }
    },


    _toConfirmVerifyLoto: function (oContext, bIsScan) {
        var oModel = this.getView().getModel("PermitsModel");
        localStorage.setItem("FlagTextIdPermit", "X");
        localStorage.setItem("BackAppVL", "");
        localStorage.setItem("App", "C");        
        NavigationHelper.to({
            pageId: 'LOTO.views.VerifyLotoApp.VerifyLotoConfirm',
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
        
    }
});
//# sourceURL=ms-appx-web://com.tenaris.loto/www/views/VerifyLotoApp/VerifyLoto.controller.js