sap.ui.controller("LOTO.views.WorkorderApp.Workorder", {

    onInit: function() {
        if (localStorage.getItem("ClearWo") === "X") {

            localStorage.setItem("ClearWo", "");
        }
        this.setInitialFocus();
    },

    refreshWoData: function() {
        ReadHelper.read(OfflineService._getWOModel(),
            "WorkOrderSet",
            0,
            this.getInitialFilters(),
            $.proxy(this._readSuccess, this),
            $.proxy(this._readError, this)
        );
    },

    setInitialFocus: function() {
        this.getView().addEventDelegate({
            onAfterShow: function() {
                this.setFocusWo(0);
                ReadHelper.read(OfflineService._getWOModel(),
                    "WorkOrderSet",
                    0,
                    this.getInitialFilters(),
                    $.proxy(this._readSuccess, this),
                    $.proxy(this._readError, this)
                );
            },
        }, this);
    },

    getInitialFilters: function() {
        var sPlant = UserHelper.getUserData()['PlanningPlantID'];
        var sRevisionCode = localStorage.getItem('RevisionCode');
        var sLoc = localStorage.getItem('LocSelectCode');

        var aFilters = [
            new sap.ui.model.Filter("PlanningPlantID", sap.ui.model.FilterOperator.EQ, sPlant),
            new sap.ui.model.Filter("RevisionCode", sap.ui.model.FilterOperator.EQ, sRevisionCode)
        ];

        if (sLoc !== "")
            aFilters.push(new sap.ui.model.Filter("Location", sap.ui.model.FilterOperator.EQ, sLoc));

        return aFilters;
    },

    onAfterRendering: function() {
        HiddenIconHelper._iconReset(this);
        RefreshImageHelper.imageReset(this);
        BluetoothHelper.checkBluetooth();
    },


    _readSuccess: function(odata) {

        var unlockedDevices = odata.length;
        var lockedDevices = 0;

        if (localStorage.getItem("lockedDevicesWO") !== "") {
            lockedDevices = localStorage.getItem("lockedDevicesWO");
            unlockedDevices = localStorage.getItem("unlockedDevicesWO");
        }
        var woModel = new sap.ui.model.json.JSONModel({ "locked": lockedDevices, "unlocked": unlockedDevices });
        this.getView().setModel(woModel, "DeviceInformationModel");

        this.loadModel();
        BusyDialogHelper.close();

    },

    _readError: function(error) {
        BusyDialogHelper.close();
        console.log(error);
    },


    setFocusWo: function(time) {
        var fSWo = sap.ui.getCore().byId("idInputWo");

        if (fSWo !== undefined) {
            jQuery.sap.delayedCall(time, this, function() {
                fSWo.focus();
            });
        }
    },

    setFocusWo_X: function() {
        var fSWo = sap.ui.getCore().byId("idInputWo");

        if (fSWo !== undefined) {
            setTimeout(function() {
                fSWo.focus();
            }, 1000);
        }
    },

    loadModel: function() {
        this.getView().setModel(new sap.ui.model.json.JSONModel({ WorkOrder: "" }), "WorkOrderInputModel");
        this._loadModifiedWorkOrders();
        var oInputWorkOrderModel = this.getView().getModel("WorkOrderInputModel");
        oInputWorkOrderModel.setProperty("/StatusB", false);
    },

    handleBarcodeScan: function(oEvent) {

        BarcodeScannerHelper.scanCode(
            jQuery.proxy(this._onBarcodeReadSuccess, this),
            jQuery.proxy(this._onBarcodeReadError, this)
        );
    },

    workOrderInsert: function() {
        var fnSuccess = jQuery.proxy(this._workOrderUpdateSuccess, this);
        var fnError = jQuery.proxy(this._workOrderUpdateError, this);

        var oWorkOrderInputModel = this.getView().getModel("WorkOrderInputModel");
        var oWorkOrder = this.getView().getModel("WoToAdd").oData;
        HttpWoReturnHelper.updateWorkOrder(oWorkOrder, oWorkOrderInputModel, fnSuccess, fnError);
    },


    loadWorkOrderTableInformation: function(aData) {

        var focus = jQuery.proxy(this.setFocusWo_X, this);
        var oWorkOrderInputModel = this.getView().getModel("WorkOrderInputModel");
        if (aData.length > 0) {
            if (aData[0].Version !== this.getView().getModel("WorkOrderInputModel").getProperty("/Version")) {
                var oInputWorkOrderModel = this.getView().getModel("WorkOrderInputModel");
                if (oWorkOrderInputModel.getProperty("/IsScan") === "X") {
                    oWorkOrderInputModel.setProperty("/WorkOrder", "");
                }
                oInputWorkOrderModel.setProperty("/Version", "");
                oInputWorkOrderModel.setProperty("/StatusB", false);
                MessageBoxHelper.showAlert("Error", "VersionError", function() {
                    setTimeout(function() {
                        sap.ui.getCore().byId("idInputWo").focus()
                    }, 1000);
                });
            } else {
                if (aData.length === 1) {
                    var oWorkOrder = aData.pop();
                    var oModel = new sap.ui.model.json.JSONModel(oWorkOrder);
                    this.getView().setModel(oModel, "WoToAdd");
                    if (!oWorkOrder["@com.sap.vocabularies.Offline.v1.islocal"]) {
                        this.workOrderInsert();
                    } else {
                        //Blanqueo el modelo de input de WO
                        if (oWorkOrderInputModel !== undefined) {
                            oWorkOrderInputModel.setProperty("/WorkOrder", "");
                            oWorkOrderInputModel.setProperty("/IsScan", "");
                            this.setFocusWo(250);
                        }
                    }
                } else {
                    var oInputWorkOrderModel = this.getView().getModel("WorkOrderInputModel");
                    oInputWorkOrderModel.setProperty("/StatusB", false);
                    MessageBoxHelper.showAlert("Error", "OrderNumberIsNotRelatedToSelectedRevisionCode", function() {
                        setTimeout(function() {
                            sap.ui.getCore().byId("idInputWo").focus()
                        }, 1000);
                    });
                }
            }
        } else {
            var oInputWorkOrderModel = this.getView().getModel("WorkOrderInputModel");
            oInputWorkOrderModel.setProperty("/StatusB", false);
            //Blanqueo el modelo de input de WO
            if (oWorkOrderInputModel.getProperty("/IsScan") === "X") {
                oWorkOrderInputModel.setProperty("/IsScan", "");
                oWorkOrderInputModel.setProperty("/WorkOrder", "");
            }
            MessageBoxHelper.showAlert("Error", "OrderNumberIsNotRelatedToSelectedRevisionCode", function() {
                setTimeout(function() {
                    sap.ui.getCore().byId("idInputWo").focus()
                }, 1000);
            });
        }
    },

    _workOrderUpdateSuccess: function() {
        var oWorkOrderInputModel = this.getView().getModel("WorkOrderInputModel");

        //Blanqueo el modelo de input de WO
        oWorkOrderInputModel.setProperty("/WorkOrder", "");
        oWorkOrderInputModel.setProperty("/IsScan", "");

        this._loadModifiedWorkOrders();
        this.setFocusWo(250);


    },

    _workOrderUpdateError: function(oError) {
        console.log(oError);
    },

    loadWorkOrderTableInformationError: function(oError) {
        var focus = jQuery.proxy(this.setFocusWo_X, this);
        console.log(oError);
        MessageBoxHelper.showAlert("Error", "ErrorWO", focus);
        BusyDialogHelper.close();
    },

    getFiltersForWorkOrder: function() {
        var sPlant = UserHelper.getUserData()['PlanningPlantID'];
        var sRevisionCode = localStorage.getItem('RevisionCode');
        var sWorkOrderCode = this.getView().getModel("WorkOrderInputModel").getProperty("/WorkOrder");
        if (UserHelper.getUserData()["LotoCode"] === "1") {
            sWorkOrderCode = sWorkOrderCode.substr(2, 12);
            sWorkOrderCode = 'OR' + sWorkOrderCode;
        } else {
            if (sWorkOrderCode.length > 12) {
                sWorkOrderCode = sWorkOrderCode.substr(2, 12);
                sWorkOrderCode = 'OR' + sWorkOrderCode;
            } else {
                sWorkOrderCode = 'OR' + sWorkOrderCode;
            }

        }
        return [
            new sap.ui.model.Filter("PlanningPlantID", sap.ui.model.FilterOperator.EQ, sPlant),
            new sap.ui.model.Filter("RevisionCode", sap.ui.model.FilterOperator.EQ, sRevisionCode),
            new sap.ui.model.Filter("WorkOrderNum", sap.ui.model.FilterOperator.EQ, sWorkOrderCode)
        ];
    },

    _loadModifiedWorkOrders: function() {
        ReadHelper.read(
            OfflineService._getWOModel(),
            "WorkOrderSet?$filter=sap.islocal()",
            0,
            [],
            jQuery.proxy(this._readModifiedWorkOrdersSuccess, this),
            jQuery.proxy(this._readModifiedWorkOrdersError, this)
        );
    },

    _readModifiedWorkOrdersSuccess: function(aData, response) {

        var oWorkOrderInputModel = this.getView().getModel("WorkOrderInputModel");

        //Update Sum Locked and Unlocked
        var modelDevice = this.getView().getModel("DeviceInformationModel");
        var unlocked = parseInt(modelDevice.oData.unlocked);
        var locked = parseInt(modelDevice.oData.locked);

        if (aData.length !== 0) {

            modelWo = this.getView().getModel("ModifiedWorkOrdersModel");


            if (modelWo !== undefined) {
                var oDataWo = modelWo.oData;
                for (var i = 0; i < aData.length; i += 1) {
                    function searchWorkorder(wo) {
                        return wo.WorkOrderNum === aData[i].WorkOrderNum;
                    }
                    resultado = oDataWo.find(searchWorkorder);
                    if (resultado === undefined) {
                        locked = locked + 1;

                        unlocked = unlocked - 1;
                        var oModel = new sap.ui.model.json.JSONModel({ "locked": locked, "unlocked": unlocked });
                        localStorage.setItem("lockedDevicesWO", locked);
                        localStorage.setItem("unlockedDevicesWO", unlocked);
                        this.getView().setModel(oModel, "DeviceInformationModel");

                        oDataWo.push(aData[i]);
                    }
                }
                var oModel = new sap.ui.model.json.JSONModel(oDataWo.reverse());
            } else {
                var oModel = new sap.ui.model.json.JSONModel(aData);
            }
        } else {
            var oModel = new sap.ui.model.json.JSONModel(aData);
        }

        var dataModel = this.getView().getModel("ModifiedWorkOrdersModel");
        if (dataModel) {
            dataModel.setData(null);
            dataModel.updateBindings(true);
            this.getView().setModel(oModel, "ModifiedWorkOrdersModel");
            dataModel.updateBindings(true);
        } else {
            this.getView().setModel(oModel, "ModifiedWorkOrdersModel");
            oModel.updateBindings(true);
        }

        this.setFocusWo(250);
    },

    _readModifiedWorkOrdersError: function(oError) {
        var oInputWorkOrderModel = this.getView().getModel("WorkOrderInputModel");
        var focus = jQuery.proxy(this.setFocusWo_X, this);
        oInputWorkOrderModel.setProperty("/Version", "");
        console.log(oError);
        MessageBoxHelper.showAlert("Error", "ErrorWO", focus);
        BusyDialogHelper.close();
    },

    formatWo: function() {
        var sCeros = '0';
        var sWorkOrderCode = this.getView().getModel("WorkOrderInputModel").getProperty("/WorkOrder");
        return 'OR' + sCeros.repeat(12 - sWorkOrderCode.length) + sWorkOrderCode;
    },

    onConfirmAddWorkOrder: function() {
        this.doAddWorkOrder();
    },

    doAddWorkOrder: function() {
        var oOfflineModel = OfflineService._getWOModel();
        ReadHelper.read(oOfflineModel,
            "WorkOrderSet",
            0,
            this.getFiltersForWorkOrder(),
            jQuery.proxy(this.loadWorkOrderTableInformation, this),
            jQuery.proxy(this.loadWorkOrderTableInformationError, this)
        )
    },

    cleanWorkOrderReturn: function() {
        this.getView().getModel("WorkOrderInputModel").setProperty("/WorkOrder", "");
    },

    _onBarcodeReadSuccess: function(oResult) {
        var oBarcodeDecomposed = this._decomposeBarcodeComponents(oResult.text.toUpperCase());
        var oInputWorkOrderModel = this.getView().getModel("WorkOrderInputModel");
        oInputWorkOrderModel.setProperty("/StatusB", true);
        this._processBarcode(oBarcodeDecomposed);
        this.confirmWorkOrderReturn();
    },

    _onBarcodeReadError: function(sError) {
        console.log("Scanning failed: " + sError);
    },

    _decomposeBarcodeComponents: function(sText) {
        return {
            Environment: sText.substr(0, 3),
            TestStatus: sText.substr(3, 1),
            Version: sText.substr(4, 2),
            WorkOrderNumber: sText.substr(6)
        };
    },

    _processBarcode: function(oBarcodeDecomposed) {

        var oInputWorkOrderModel = this.getView().getModel("WorkOrderInputModel");
        if (UserHelper.getUserData()["SystemID"] === oBarcodeDecomposed["Environment"]) {
            oInputWorkOrderModel.setProperty("/WorkOrder", oBarcodeDecomposed["Version"] + oBarcodeDecomposed["WorkOrderNumber"]);
            oInputWorkOrderModel.setProperty("/Version", oBarcodeDecomposed["Version"]);
            oInputWorkOrderModel.setProperty("/IsScan", "X");
        } else {
            MessageBoxHelper.showAlert("Error", "TheWorkPermitScannedIsNotForTheProductionEnviroment", function() {
                oInputWorkOrderModel.setProperty("/WorkOrder", "");
                oInputWorkOrderModel.setProperty("/Version", "");
                oInputWorkOrderModel.setProperty("/IsScan", " ");
                setTimeout(function() {
                    sap.ui.getCore().byId("idInputWo").focus();
                }, 1000);
            });
        }
    },

    toLaunchpadView: function() {
        StoresHelper.checkCurrentyAppStoresEmpty(function(bEmptyStores) {
            var fnCallback = function() {
                localStorage.setItem("LaserScanner", "");
                NavigationHelper.setCurrentApp("Launchpad");
                NavigationHelper.back("Launchpad", true);
            };
            if (!bEmptyStores)
                MessageBoxHelper.showAlert("Information", "ChangesArePendingToBeSynchronized", fnCallback);
            else
                fnCallback();
        })
    },

    confirmWorkOrderReturn: function() {
        var checkWo = this.getView().getModel("WorkOrderInputModel");
        if (checkWo !== undefined) {
            var sWorkOrderReturnValue = this.getView().getModel("WorkOrderInputModel").getProperty("/WorkOrder");
            var bWorkOrderReturnValidate = this.getView().getModel("WorkOrderInputModel").getProperty("/StatusB");
            if (sWorkOrderReturnValue !== "" && bWorkOrderReturnValidate) {
                this.doAddWorkOrder();
            }
        }
    },

    handleWorkOrderLiveChange: function(oEvent) {
        var sValue = oEvent.getParameter("value").toUpperCase();
        var fScanner = "";
        var sScannerMax = "";
        var focus = jQuery.proxy(this.setFocusWo_X, this);
        var oInputWorkOrderModel = this.getView().getModel("WorkOrderInputModel");
        if (sValue.substr(0, 1) === "%") {
            fScanner = "X";
        } else {
            fScanner = "";
        }

        if (sValue.indexOf("%") >= 0 && sValue.substr(0, 1) !== "%") {
            oEvent.getSource().setValue(sValue.substr(sValue.indexOf("%"), sValue.length));
            sValue = sValue.substr(sValue.indexOf("%"), sValue.length);
        }

        if (sValue.substr(sValue.length - 1, sValue.length) === "$") {
            sScannerMax = "X";
        } else {
            sScannerMax = "";
        }

        if (fScanner === "X" && sScannerMax === "X") {
            sValue = sValue.replace("$", "");
            if (sValue.length === 19) {
                oInputWorkOrderModel.setProperty("/StatusB", false);
                if (sValue.substr(1, 3) !== UserHelper.getUserData()["SystemID"]) {
                    oInputWorkOrderModel.setProperty("/StatusB", false);
                    oInputWorkOrderModel.setProperty("/WorkOrder", "");
                    oInputWorkOrderModel.setProperty("/Version", "");
                    oInputWorkOrderModel.updateBindings(true);
                    MessageBoxHelper.showAlert("Error", "InvalidEnvironmentRead", focus);
                } else {
                    oInputWorkOrderModel.setProperty("/IsScan", "X");
                    oInputWorkOrderModel.setProperty("/WorkOrder", sValue.substr(5, 18));
                    oInputWorkOrderModel.setProperty("/Version", sValue.substr(5, 2));
                    oInputWorkOrderModel.setProperty("/StatusB", true);
                    this.confirmWorkOrderReturn();
                }
            } else {
                oInputWorkOrderModel.setProperty("/StatusB", false);
                oInputWorkOrderModel.setProperty("/WorkOrder", "");
                oInputWorkOrderModel.setProperty("/Version", "");
                oInputWorkOrderModel.updateBindings(true);
                MessageBoxHelper.showAlert("Error", "OrderNumberIsNotRelatedToSelectedRevisionCode", focus);
            }
        } else {
            oInputWorkOrderModel.setProperty("/WorkOrder", sValue.substr(0, 14));
            oInputWorkOrderModel.setProperty("/Version", sValue.substr(0, 2));
            oInputWorkOrderModel.setProperty("/StatusB", true);

            if (sValue.length >= 14 && fScanner === "X" && sScannerMax === "X") {
                oEvent.getSource().setValue("");
                MessageBoxHelper.showAlert("Error", "OrderNumberIsNotRelatedToSelectedRevisionCode", focus);
            } else {
                oInputWorkOrderModel.setProperty("/StatusB", false);
            }

            if (sValue.length === 14 && oInputWorkOrderModel.getProperty("/StatusB") === false) {
                oInputWorkOrderModel.setProperty("/StatusB", true);
            }
            oInputWorkOrderModel.setProperty("/IsScan", " ");
        }

    }
});
//# sourceURL=ms-appx-web://com.tenaris.loto/www/views/WorkorderApp/Workorder.controller.js