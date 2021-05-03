sap.ui.controller("LOTO.views.VerifyLotoApp.VerifyLotoConfirm", {
    _initialSorter: [],
    _oTable: null,
    _oModel: "",
    _oInputs: {
        Code: "EIDCode",
        LookOut: "LookOutDevice"
    },


    onInit: function () {
        window.click = 0;
        this.setInitialFocus();

    },

    setInitialFocus: function () {
        SetFocusHelper._focusInitSet(this, "EIDCodeVL", "LockoutDeviceCodeVL");
    },

    getTextFromViewFrame1: function () {
        if (UserHelper.getUserData()["LotoCode"] === "1") {
            return new sap.m.Text({text: "{i18n>Permit}"}).addStyleClass("fontSizeConfirm")
        } else {
            return new sap.m.Text({text: "{i18n>EIDCode}"}).addStyleClass("fontSizeConfirm")
        }
    },

    getTextPermitKey: function () {
        var sSelectText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("CodeSelected");
        return new sap.m.Label({
            text: sSelectText
        }).addStyleClass("labelTitleConfirmLotoPermitKey")
    },

    getTextRevision: function () {
        var sSelectText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Review");
        return new sap.m.Label({
            text: sSelectText
        }).addStyleClass("labelTitleConfirmLotoPermitKey")
    },

    getTextEstado: function () {
        var sSelectText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("StatusT");
        return new sap.m.Label({
            text: sSelectText
        }).addStyleClass("labelTitleConfirmLotoPermitKey")
    },

    getTextFromViewFrame2: function () {
        if (UserHelper.getUserData()["LotoCode"] === "1") {
            return new sap.m.Text({
                text: "{i18n>LockCode}"
            }).addStyleClass("fontSizeConfirm")
        } else {
            return new sap.m.Text({
                text: "{i18n>LockoutDeviceCodeE}"
            }).addStyleClass("fontSizeConfirm")
        }
    },

    onAfterRendering: function () {
        HiddenIconHelper._iconReset(this);
        /*Reset Image Header*/
        RefreshImageHelper.imageReset(this);
        var oPermitContext = this.getView().getBindingContext();
        var bIsAlreadyBlocked = oPermitContext.getProperty("StatusCode") !== oPermitContext.getProperty("StatusCodeNew");

        var sEIDCode = bIsAlreadyBlocked || this.isScan ? oPermitContext.getProperty("PermitKey") : "";

        var fnGetLookoutDeviceCode = function () {
            if (bIsAlreadyBlocked) {
                if (UserHelper.getUserData()["LotoCode"] === "1")
                    return oPermitContext.getProperty("PermitKeyRead");
                else
                    return oPermitContext.getProperty("LockoutDeviceCodeRead");
            }
            return "";
        };
        var sNewLook = "";
        if (localStorage.getItem("SearchRead") !== "X") {
            var sNewEID = "";
            if (sEIDCode.length >= 10) {
                if (UserHelper.getUserData()["LotoCode"] === "1"){
                sNewEID = sEIDCode.substr(0, 10) + "B";}else{
                    sNewEID = sEIDCode.substr(0, 10) + "A";
                    
                }   
            } else {
                sNewEID = sEIDCode;
            }
            if (fnGetLookoutDeviceCode().length >= 10) {
                if (UserHelper.getUserData()["LotoCode"] === "1"){
                sNewLook = fnGetLookoutDeviceCode().substr(0, 10) + "A";}else{
                    sNewLook = fnGetLookoutDeviceCode().substr(0, 10) + "D";
                }   
            } else {
                sNewLook = fnGetLookoutDeviceCode();
            }

            if (oPermitContext.getProperty("StatusCodeNew") !== "P3N") {
                var oModel = new sap.ui.model.json.JSONModel({
                    EIDCode: sNewEID,
                    EIDCodeValid: this.isScan === true && !bIsAlreadyBlocked,
                    EIDCodeIsScan: this.isScan === true && !bIsAlreadyBlocked,
                    EIDCodeEnabled: !bIsAlreadyBlocked,
                    LockoutDeviceCode: sNewLook,
                    LockoutDeviceCodeValid: false,
                    LockoutDeviceCodeEnabled: this.isScan === true && !bIsAlreadyBlocked,
                    LockoutDeviceCodeIsScan: false,
                    ConfirmEnabled: false
                });
            } else {
                var oModel = new sap.ui.model.json.JSONModel({
                    EIDCode: sNewEID,
                    EIDCodeValid: this.isScan === true && !bIsAlreadyBlocked,
                    EIDCodeIsScan: this.isScan === true && !bIsAlreadyBlocked,
                    EIDCodeEnabled: !bIsAlreadyBlocked,
                    LockoutDeviceCode: "",
                    LockoutDeviceCodeValid: false,
                    LockoutDeviceCodeEnabled: this.isScan === true && !bIsAlreadyBlocked,
                    LockoutDeviceCodeIsScan: false,
                    ConfirmEnabled: false
                });
            }
        } else {
            sNewLook = oPermitContext.getProperty("LockoutDeviceCodeRead");
            if (sNewLook.length >= 10 && bIsAlreadyBlocked) {
                if (UserHelper.getUserData()["LotoCode"] === "1"){
                sNewLook = oPermitContext.getProperty("LockoutDeviceCodeRead").substr(0, 10) + "A";
                }else{
                sNewLook = oPermitContext.getProperty("LockoutDeviceCodeRead").substr(0, 10) + "D"; 
                }
            } else {
                sNewLook = "";
            }
            var oModel = new sap.ui.model.json.JSONModel({
                EIDCode: oPermitContext.getProperty("PermitKey"),
                EIDCodeValid: !bIsAlreadyBlocked,
                EIDCodeIsScan: this.isScan,
                EIDCodeEnabled: !bIsAlreadyBlocked,
                LockoutDeviceCode: sNewLook,
                LockoutDeviceCodeValid: !bIsAlreadyBlocked,
                LockoutDeviceCodeEnabled: !bIsAlreadyBlocked,
                LockoutDeviceCodeIsScan: false,
                ConfirmEnabled: false
            });
            jQuery.sap.delayedCall(5, this, function () {
                sap.ui.getCore().byId("LockoutDeviceCodeVL").focus();
            });
        }
        this.getView().setModel(oModel, "LotoCodesModel");


        if (oModel.oData.EIDCode === ""){
                            setTimeout(function () {
                                var checkId = sap.ui.getCore().byId("EIDCodeVL");
                                if ( checkId !== undefined)
                                sap.ui.getCore().byId("EIDCodeVL").focus();
                            }, 1000);
        }
    },

    
    handleScan_Edi: function (sInputType, oEvent) {
        var oCodesModel = this.getView().getModel("LotoCodesModel");

        if (oCodesModel.getProperty("/EIDCodeEnabled") !== false && oCodesModel.getProperty("/EIDCodeEnabled") !== undefined){
       oCodesModel.setProperty("/LockoutDeviceCodeEnabled", false);
        oCodesModel.setProperty("/EIDCode", "");
        oCodesModel.setProperty("/LockoutDeviceCode", "");
            try {
                 LotoScanHelper.handleScan(
                    sInputType,
                    this.getView(),
                    ValidateCodeHelper._validateInputs,
                    true
                );
            }
            catch (err) {
                    var message = "Ihe error is = " + err;
                    console.log(message);
                    MessageBoxHelper.showAlert("Error", message);
            }
        }    
        
    },
    
    handleScan: function (sInputType, oEvent) {
        var oCodesModel = this.getView().getModel("LotoCodesModel");
        if (oCodesModel.getProperty("/LockoutDeviceCodeEnabled") !== false && oCodesModel.getProperty("/LockoutDeviceCodeEnabled") !== undefined){
            oCodesModel.setProperty("/LockoutDeviceCode", "");
            try {
            LotoScanHelper.handleScan(  sInputType,
                                        this.getView(),
                                        ValidateCodeHelper._validateInputs,
                                        true
                                        );
            }
            catch (err) {
                var message = "Ihe error is = " + err;
                console.log(message);
                MessageBoxHelper.showAlert("Error", message);
            }
        }    
    },

    handleInputLiveChange: function (sInputType, oEvent) {
//Validate Input Data
        ValidateCodeHelper._handleInputLiveChange(this, sInputType, oEvent);
    },

    toVerifyLoto: function () {
       window.click = window.click + 1;
        if (window.click === 1 ) {
    
            setTimeout(function () {   
                var checkTable = sap.ui.getCore().byId("VerifyLoto");
                if (checkTable !== undefined) {

                    sap.ui.getCore().byId("backBtnVL");
                    var vCheckBtn = sap.ui.getCore().byId("backBtnVL");
                    if (vCheckBtn) vCheckBtn.setEnabled(false);
                        var oTable = sap.ui.getCore().byId("VerifyLoto").getController()._oTable;
                        oTable.setBusy(false);
                        var aItems = oTable.getContextByIndex(0).getModel().oData;
                        for (var i = 0; i < aItems.length; i++) {
                             aItems[i].PermitKey = aItems[i].PermitKey.substr(0, 10);
                             aItems[i].PermitKeyRead = aItems[i].PermitKeyRead.substr(0, 10);
                        }      
                    sap.ui.getCore().byId("VerifyLoto").getModel("PermitsModel").refresh();
                    localStorage.setItem("StatusCodeNew", "");
                    localStorage.setItem("App", "");
                    localStorage.setItem("SearchFlagInput","");
                    localStorage.setItem("SearchRead","");
                    localStorage.setItem("Selectkey","");
                    sap.ui.getCore().byId("inputSearchBox").setValue("");
                    NavigationHelper.back("VerifyLoto", true);            
                }
            }, 500);
        }
    },

    handlePerformConfirm: function () {
    var oCodesModelC = this.getView().getModel("LotoCodesModel");
    if (oCodesModelC.oData.ConfirmEnabled === true) {
                
            var oCodesModel = this.getView();
            if (oCodesModel.getBindingContext().getProperty("StatusCode") !== 'P0X') {
                if (localStorage.Person_Number.toUpperCase() === oCodesModel.getBindingContext().getProperty("UserLock")) {
                    jQuery.sap.delayedCall(500, this, function () {
                        sap.ui.getCore().byId("LockoutDeviceCodeVL").focus();
                    });
                    MessageBoxHelper.showAlert("Error", "UserLock");
                } else {
                    this.doPerformConfirm();
                }
            } else {
                this.doPerformConfirm();
            }
        }
    },

    doPerformConfirm: function () {
        this._handleVerifyConfirmation(HttpLotoOperationsHelper._oLotoFunctions.VerifyValid);
        var oCodesModel = this.getView().getModel("LotoCodesModel");
        oCodesModel.setProperty("/LockoutDeviceCode", "");
        oCodesModel.setProperty("/EIDCode", "");
        oCodesModel.setProperty("/EIDCodeEnabled", true);
        sap.ui.getCore().byId("VerifyLoto").getController().getView().getModel("PermitsModel").refresh(true);
    },

    handlePerformNotConfirm: function () {
    var oCodesModelC = this.getView().getModel("LotoCodesModel");
    if (oCodesModelC.oData.EIDCodeValid === true) {     
            var oCodesModel = this.getView();
            if (oCodesModel.getBindingContext().getProperty("StatusCode") !== 'P0X') {
                if (localStorage.Person_Number.toUpperCase() === oCodesModel.getBindingContext().getProperty("UserLock")) {
                    jQuery.sap.delayedCall(500, this, function () {
                        sap.ui.getCore().byId("LockoutDeviceCodeVL").focus();
                    });
                    MessageBoxHelper.showAlert("Error", "UserLock");
                } else {
                    MessageBoxHelper.showConfirm("Confirmation", "DoYouWantToNotConfirmTheLock", jQuery.proxy(this.doPerformNotConfirm, this), function () {
                    });
                }
            } else {
                MessageBoxHelper.showConfirm("Confirmation", "DoYouWantToNotConfirmTheLock", jQuery.proxy(this.doPerformNotConfirm, this), function () {
                });
            }
    }           
    },

    doPerformNotConfirm: function () {
        var oCodesModel = this.getView().getModel("LotoCodesModel");
        oCodesModel.setProperty("/LockoutDeviceCode", "");
        ValidateCodeHelper._handleLookOutClear(oCodesModel);
        this._handleVerifyConfirmation(HttpLotoOperationsHelper._oLotoFunctions.VerifyInvalid);
        sap.ui.getCore().byId("VerifyLoto").getController().getView().getModel("PermitsModel").refresh(true);
    },

    _handleVerifyConfirmation: function (sVerifyCode) {
        var oWorkPermit = this.getView().getBindingContext().getObject();
        var oCodesModel = this.getView().getModel("LotoCodesModel");
        HttpLotoOperationsHelper.confirmLotoOperation(
            oWorkPermit,
            oCodesModel,
            sVerifyCode,
            jQuery.proxy(this._performLotoUpdateSuccess, this, oWorkPermit),
            jQuery.proxy(this._performLotoUpdateError, this)
        )
    },

    _performLotoUpdateSuccess: function (oWorkPermit) {
        var modelunlocked =  sap.ui.getCore().byId("VerifyLoto").getModel("DeviceInformationModel");

        modelunlocked.oData.unlocked = modelunlocked.oData.unlocked - 1;
        modelunlocked.oData.locked = modelunlocked.oData.locked + 1;

        modelunlocked.refresh();

        var oCodesModel = this.getView().getModel("LotoCodesModel");
        localStorage.setItem("BackAppVL", "");
        oCodesModel.setData({
            EIDCode: "",
            EIDCodeValid: false,
            EIDCodeIsScan: false,
            LockoutDeviceCode: "",
            LockoutDeviceCodeValid: false,
            LockoutDeviceCodeEnabled: false,
            LockoutDeviceCodeIsScan: false
        });
        localStorage.setItem("SearchRead","");
        localStorage.setItem("SearchFlagInput","");
        localStorage.setItem("Selectkey","");
        sap.ui.getCore().byId("inputSearchBox").setValue("");
        NavigationHelper.back("VerifyLoto", true);
    },

    _performLotoUpdateError: function () {
        localStorage.setItem("SearchFlagInput","");
        console.log("NO!!!!!!!");
    }

});
//# sourceURL=ms-appx-web://com.tenaris.loto/www/views/VerifyLotoApp/VerifyLotoConfirm.controller.js