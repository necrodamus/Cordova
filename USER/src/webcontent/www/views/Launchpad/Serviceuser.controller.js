sap.ui.controller("USER.views.Launchpad.Serviceuser", {
    that: this,
    getViewName: function () {
        return this.getView().getId();
    },

    onInit: function () { },

    navToSelectRv: function (event) {
        var rvSel = event.getSource().getSelectedKey();
        console.log(rvSel);

    },


    loadModel: function () {

        if (InternetConnectionHelper.checkConnectionOnline()) {
            return this._loadModel();
        } else {
            MessageBoxHelper.showAlert("Error", "InternetRequired", undefined, undefined, true);
            BusyDialogHelper.close();
        }

    },

    onGetApp: function () {
        this.loadModel();
    },


    _loadModel: function () {

        var serviceUrl = "http://200.49.143.28:7099/sap/opu/odata/sap/Z_SRV_GET_USER_DATA_SRV_01/";
        var getSingleUser = this.getView().byId("uidx").getValue();
        var urlsrv = "UserdetailSet?$filter=User_Id_Input eq  '" + getSingleUser + "'";
        let sUrl, oHeaders = {};;
        sUrl = serviceUrl + urlsrv;

        var request = {
            headers: oHeaders,
            requestUri: sUrl,
            method: "GET"
        };

        request.user = localStorage.getItem("User");
        request.password = localStorage.getItem("Password");

        OData.read(request, this._readODataOnSuccess, this._readODataOnError);

    },

    _readODataOnSuccess: function (oData) {
        let controller = sap.ui.getCore().byId("Serviceuser");

        let getSingleUser = controller.byId("uidx").getValue();


        var oModel = new sap.ui.model.json.JSONModel({
            Id: getSingleUser,
            Name: oData.results[0].Company_Name
        });

        controller.setModel(oModel, "UserModel");
    },


    onExitApp: function () {
        ClearData.cache(function () {
            console.info('Successfully cleared app cache');
        }, function (err) {
            console.error('Error clearing app cache', err);
        });

        navigator.app.exitApp();
    },

    onBeforeRendering: function () {
    },

    onAfterRendering: function () {

        var dialogD = sap.ui.getCore().byId("dialogFiltersS");
        if (dialogD) {
            dialogD.destroy();
        }

    },

    _readODataOnError: function (oError) {
        // Parse mensaje de error de R3
        var responseXml = oError.message;
        let controller = sap.ui.getCore().byId("Serviceuser");
        var fnCallback = function () {
            console.log("User Not Found");
        };
        controller.byId("uidx").setValue("");
        MessageBoxHelper.showAlert("Error", "UserErrorNF", fnCallback, undefined, true);
        console.log(responseXml);
    },

    _getTranslation: function (message) {
        var i18nModel = sap.ui.getCore().getModel("i18n");
        return i18nModel.getResourceBundle().getText(message);
    },



    toSync: function (oEvent) {
        var fnCallback = jQuery.proxy(this.handleRefresh, this);

        var checkE = sap.ui.getCore().byId('tileSync').hasStyleClass("tileEnabled");

        if (checkE === true) {

            if (InternetConnectionHelper.checkConnectionOnline()) {
                MessageBoxHelper.showConfirm("Confirmation", "DoYouWantToProceedWithTheSyncronization", fnCallback);
            } else {
                MessageBoxHelper.showAlert("Error", "InternetRequired", undefined, undefined, true);
                BusyDialogHelper.close();
            }

        }

    },

});
