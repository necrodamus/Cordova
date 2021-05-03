sap.ui.controller("LOTO.views.RemoveLotoApp.RemoveLotoConfirm", {
    _initialSorter: [],
    _oTable: null,
    _oModel: "",

    onInit: function () {
        this.setInitialFocus();
        window.click = 0;
    },

    setInitialFocus: function () {
        SetFocusHelper._focusInitSet(this, "EIDCodeRL", "ButtonOKRL");
    },


    getTextFromViewFrame1: function () {
		sHeaderOut = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("EIDCodeRM");
																				
        return new sap.m.Text({text: sHeaderOut}).addStyleClass("fontSizeConfirm");
    },

    onAfterRendering: function () {		
        HiddenIconHelper._iconReset(this);
        /*Reset Image Header*/
        RefreshImageHelper.imageReset(this);
        var oPermitContext = this.getView().getBindingContext();
        var bIsAlreadyBlocked = oPermitContext.getProperty("StatusCode") !== oPermitContext.getProperty("StatusCodeNew");

        var sEIDCode = bIsAlreadyBlocked || this.isScan ? oPermitContext.getProperty("PermitKey") : "";

        var bCheckConfirm = false;
        bCheckConfirm = (this.isScan === true && bIsAlreadyBlocked === false) ? true : bCheckConfirm;

        var sNewEID = "";
        if (localStorage.getItem("SearchRead") !== "X") {
            if (sEIDCode.length >= 10) {			
                sNewEID = sEIDCode.substr(0, 10) + "A";
            } else{
                sNewEID = sEIDCode;
            }

            var oModel = new sap.ui.model.json.JSONModel({
                EIDCode: sNewEID,
                EIDCodeValid: this.isScan === true && !bIsAlreadyBlocked,
                EIDCodeIsScan: this.isScan === true && !bIsAlreadyBlocked,
                EIDCodeEnabled: !bIsAlreadyBlocked,
                ConfirmEnabled: bCheckConfirm,
            });
        } else {
            if (localStorage.SearchFlagInputScan === "X" ) this.isScan = true;

            var bIsAlreadyBlocked = oPermitContext.getProperty("StatusCode") !== oPermitContext.getProperty("StatusCodeNew");
            var oModel = new sap.ui.model.json.JSONModel({
                EIDCode: oPermitContext.getProperty("PermitKey"),
                EIDCodeValid: !bIsAlreadyBlocked,
                EIDCodeIsScan: this.isScan,
                EIDCodeEnabled: !bIsAlreadyBlocked,
                ConfirmEnabled: !bIsAlreadyBlocked,
            });
        }
        this.getView().setModel(oModel, "LotoCodesModel");
        /*Reset Image Header*/
        ;

        jQuery.sap.delayedCall(500, this, function () {
            sap.ui.getCore().byId("EIDCodeRL").focus();
        });

    },


    handleScan: function (sInputType, oEvent) {

		var oCodesModel = this.getView().getModel("LotoCodesModel");
        if (oCodesModel.getProperty("/EIDCodeEnabled") !== false){
            oCodesModel.setProperty("/EIDCode", "");
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
        ValidateCodeHelper._handleInputLiveChange(this, sInputType, oEvent);
    },


    toRemoveLoto: function () {
        window.click = window.click + 1;
            if (window.click === 1 ) {
            var vCheckBtn = sap.ui.getCore().byId("backBtnRL");
            if (vCheckBtn) vCheckBtn.setEnabled(false);
            setTimeout(function () {  

            var checkBack = sap.ui.getCore().byId("RemoveLoto");      
            if (checkBack !== undefined) {
            var oTable = checkBack.getController()._oTable;
            var aItems = oTable.getContextByIndex(0).getModel().oData;

            for (var i = 0; i < aItems.length; i++) {
                aItems[i].PermitKey = aItems[i].PermitKey.substr(0, 10);
                aItems[i].PermitKeyRead = aItems[i].PermitKeyRead.substr(0, 10);
            }    
            sap.ui.getCore().byId("RemoveLoto").getController()._oTable.getModel().refresh();
            localStorage.setItem("SearchRead","");           
                localStorage.setItem("App", "");
                localStorage.setItem("Selectkey", "");
                localStorage.setItem("SearchFlagInput","");
                localStorage.setItem("SearchRead","");
                sap.ui.getCore().byId("inputSearchBox").setValue("");
                NavigationHelper.back("RemoveLoto", true)           
            }
        }, 500);
    }        
    },

    doRemoveLotoOperation: function () {
        var oWorkPermit = this.getView().getBindingContext().getObject();
        var oCodesModel = this.getView().getModel("LotoCodesModel");
        
        HttpLotoOperationsHelper.confirmLotoOperation(
            oWorkPermit,
            oCodesModel,
            HttpLotoOperationsHelper._oLotoFunctions.Remove,
            jQuery.proxy(this._removeLotoUpdateSuccess, this, oWorkPermit),
            jQuery.proxy(this._removeLotoUpdateError, this)
        )
    },


    handleRemoveLotoConfirm: function () {
		var oCodesModel = this.getView().getModel("LotoCodesModel");
		if (oCodesModel.oData.ConfirmEnabled === true)
		this.doRemoveLotoOperation();
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
    _removeLotoUpdateSuccess: function (oWorkPermit) {
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

        var modelunlocked =  sap.ui.getCore().byId("RemoveLoto").getModel("DeviceInformationModel");

        modelunlocked.oData.unlocked = modelunlocked.oData.unlocked - 1;
        modelunlocked.oData.locked = modelunlocked.oData.locked + 1;

        modelunlocked.refresh();

        sap.ui.getCore().byId("RemoveLoto").getModel("PermitsModel").refresh();
        sap.ui.getCore().byId("inputSearchBox").setValue("");
        NavigationHelper.back("RemoveLoto", true);
    },

    _removeLotoUpdateError: function () {
        console.log("Error en el Update del Modelo Remove Loto !!!!!!!");
    }

});