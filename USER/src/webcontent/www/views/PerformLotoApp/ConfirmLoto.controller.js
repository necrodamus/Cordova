sap.ui.controller("LOTO.views.PerformLotoApp.ConfirmLoto", {
    _initialSorter: [],
    _oTable: null,
    _oModel: "",

    onInit: function () {
        this.setInitialFocus();
        window.click = 0;
    },

    setInitialFocus: function () {
        SetFocusHelper._focusInitSet(this, "EIDCodePL", "LockoutDeviceCodePL");
    },

    onAfterRendering: function () {
        HiddenIconHelper._iconReset(this);
        /*Reset Image Header*/
        RefreshImageHelper.imageReset(this);
        try {

            var path = this.getView().getBindingContext().sPath;
           
            var oPermitContext = sap.ui.getCore().byId("PerformLoto").getController()._oTable.getModel().getProperty(path);
            
            var bIsAlreadyBlocked = oPermitContext.StatusCode !== oPermitContext.StatusCodeNew;

            var sEIDCode = bIsAlreadyBlocked || this.isScan ? oPermitContext.PermitKey : "";

            var fnGetLookoutDeviceCode = function () {
                if (bIsAlreadyBlocked) {
                    if (UserHelper.getUserData()["LotoCode"] === "1")
                        return oPermitContext.PermitKeyRead;
                    else
                        return oPermitContext.LockoutDeviceCodeRead;
                }
                return "";
            };

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


                var sNewLook = "";
                if (fnGetLookoutDeviceCode().length >= 10) {
					if (UserHelper.getUserData()["LotoCode"] === "1"){
                    sNewLook = fnGetLookoutDeviceCode().substr(0, 10) + "A";}else{
					sNewLook = fnGetLookoutDeviceCode().substr(0, 10) + "D";	
					}
                } else {
                    sNewLook = fnGetLookoutDeviceCode();
                }

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
                if (oPermitContext.LockoutDeviceCodeRead !== "") {
                    bIsAlreadyBlocked == true;
                }else{
                    bIsAlreadyBlocked == false;
                }
                var sNewLook = oPermitContext.LockoutDeviceCodeRead;
                if (sNewLook !== "" && bIsAlreadyBlocked ) {
					if (UserHelper.getUserData()["LotoCode"] === "1"){
                    sNewLook = sNewLook.substr(0, 10) + "A";}else{
					sNewLook = sNewLook.substr(0, 10) + "D";	
					}
                } else {
                    sNewLook= "";
                }

                var oModel = new sap.ui.model.json.JSONModel({
                    EIDCode: oPermitContext.PermitKey,
                    EIDCodeValid: !bIsAlreadyBlocked,
                    EIDCodeIsScan: this.isScan,
                    EIDCodeEnabled: !bIsAlreadyBlocked,
                    LockoutDeviceCode: sNewLook,
                    LockoutDeviceCodeValid: !bIsAlreadyBlocked,
                    LockoutDeviceCodeEnabled: !bIsAlreadyBlocked,
                    LockoutDeviceCodeIsScan: !bIsAlreadyBlocked,
                    ConfirmEnabled: false,
                });
            }
            if (this.isScan) {
                oModel.setProperty("/EIDCodeIsScan", true);
            }
            this.getView().setModel(oModel, "LotoCodesModel");
        }
        catch (err) {
            window.onerror = function (e) {
                console.log('error', e);
                //don't return true
            };
            var message = "Ihe error is = " + err;
            console.log(message);
            MessageBoxHelper.showAlert("Error", message);
        }

        if (oModel.oData.EIDCode === ""){
                            setTimeout(function () {
                                var checkId = sap.ui.getCore().byId("EIDCodePL");
                                if ( checkId !== undefined)
                                sap.ui.getCore().byId("EIDCodePL").focus();
                            }, 1000);
        }
    },

    getTextPermitKey: function () {
        var sSelectText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("CodeSelected");
        return new sap.m.Label({text: sSelectText}).addStyleClass("labelTitleConfirmLotoPermitKey")

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


    getTextFromViewFrame1: function () {

        if (UserHelper.getUserData()["LotoCode"] === "1") {
            return new sap.m.Text({text: "{i18n>Permit}"}).addStyleClass("fontSizeConfirm")
        } else {
            return new sap.m.Text({text: "{i18n>EIDCode}"}).addStyleClass("fontSizeConfirm")
        }
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

    handleScan: function (sInputType, oEvent) {        
	  var oCodesModel = this.getView().getModel("LotoCodesModel");
      if (oCodesModel.getProperty("/LockoutDeviceCodeEnabled") !== false){
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
	
	handleScan_Edi: function (sInputType, oEvent) {        
	  var oCodesModel = this.getView().getModel("LotoCodesModel");
          if (oCodesModel.getProperty("/EIDCodeEnabled") !== false){
        	  oCodesModel.setProperty("/EIDCode", "");
              oCodesModel.setProperty("/LockoutDeviceCode", "");
        	  oCodesModel.setProperty("/LockoutDeviceCodeEnabled", false);
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
	

    handleInputLiveChange: function (sInputType, oEvent) {
//Validate Input Data
        ValidateCodeHelper._handleInputLiveChange(this,sInputType, oEvent);
    },

    toPerformLoto: function () {	
        window.click = window.click + 1;
            if (window.click === 1 ) {
            var vCheckBtn = sap.ui.getCore().byId("backBtnPL");
            if (vCheckBtn) vCheckBtn.setEnabled(false);
            setTimeout(function () {  

            var checkBack = sap.ui.getCore().byId("PerformLoto");      
            if (checkBack !== undefined) {
            var oTable = checkBack.getController()._oTable;
            var aItems = oTable.getContextByIndex(0).getModel().oData;

            for (var i = 0; i < aItems.length; i++) {
                aItems[i].PermitKey = aItems[i].PermitKey.substr(0, 10);
                aItems[i].PermitKeyRead = aItems[i].PermitKeyRead.substr(0, 10);
            }	 
            sap.ui.getCore().byId("PerformLoto").getController()._oTable.getModel().refresh();
            localStorage.setItem("SearchRead","");

            if (localStorage.getItem("BackAppPL") !== "X"){
                localStorage.setItem("App", "");
                localStorage.setItem("Selectkey", "");
                localStorage.setItem("BackAppPL", "X");
                localStorage.setItem("SearchFlagInput","");
                localStorage.setItem("SearchRead","");
                sap.ui.getCore().byId("inputSearchBox").setValue("");
                NavigationHelper.back("PerformLoto", true);
            }
            }
        }, 500);
    }
    },

    handlePerformConfirm: function () {
		var oCodesModel = this.getView().getModel("LotoCodesModel");
		if (oCodesModel.oData.ConfirmEnabled === true)
		this.doPerformConfirm();
    },

    doPerformConfirm: function () {

        var oCodesModel = this.getView().getModel("LotoCodesModel");
        
        var path = this.getView().getBindingContext().sPath;

        if (path === "X") {
           var path = localStorage.getItem("Selectkey"); 
        }    

        var  oWorkPermit = sap.ui.getCore().byId("PerformLoto").getController()._oTable.getModel().getProperty(path);
        localStorage.setItem("SearchRead","");
        HttpLotoOperationsHelper.confirmLotoOperation(
            oWorkPermit,
            oCodesModel,
            HttpLotoOperationsHelper._oLotoFunctions.Perform,
            jQuery.proxy(this._performLotoUpdateSuccess, this, oWorkPermit),
            jQuery.proxy(this._performLotoUpdateError, this)
        )
    },

    _performLotoUpdateSuccess: function (oWorkPermit) {
		
        var modelunlocked =  sap.ui.getCore().byId("PerformLoto").getModel("DeviceInformationModel");

        modelunlocked.oData.unlocked = modelunlocked.oData.unlocked - 1;
        modelunlocked.oData.locked = modelunlocked.oData.locked + 1;

        modelunlocked.refresh();
		
        localStorage.setItem("BackAppPL", "");
        var oCodesModel = this.getView().getModel("LotoCodesModel");
        oCodesModel.setData({
            EIDCode: "",
            EIDCodeValid: false,
            EIDCodeIsScan: false,
            LockoutDeviceCode: "",
            LockoutDeviceCodeValid: false,
            LockoutDeviceCodeEnabled: false,
            LockoutDeviceCodeIsScan: false
        });
        
		localStorage.setItem("SearchFlagInput","");
        localStorage.getItem("Selectkey","");
        NavigationHelper.back("PerformLoto", true);
        sap.ui.getCore().byId("inputSearchBox").setValue("");
		var sCTable = sap.ui.getCore().byId("PerformLoto").getController();
            if (sCTable !== undefined){
                    sCTable._oTable.getModel().refresh(true);
                    sCTable._oTable._updateBindingContexts(true);
            }

    },

    _performLotoUpdateError: function () {

        console.log("Error Update Loto !");
    }

});