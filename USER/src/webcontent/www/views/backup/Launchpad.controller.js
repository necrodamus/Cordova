
sap.ui.controller("USER.views.Launchpad.Launchpad", {

    getViewName: function () {
        return this.getView().getId();
    },

    onInit: function () { },

    navToSelectRv: function (event) {
        var rvSel = event.getSource().getSelectedKey();
        console.log(rvSel);

    },


    loadModel: function (user, pass) {

        if (InternetConnectionHelper.checkConnectionOnline()) {
            return this._loadModel(user, pass);
        } else {
            MessageBoxHelper.showAlert("Error", "InternetRequired", undefined, undefined, true);
            BusyDialogHelper.close();
        }

    },

    OnGetUserInfo: function () {
        loadModel(localStorage.getItem("User"), localStorage.getItem(pasw));
    },


    _loadModel: function (user, pass) {

        var serviceUrl = "http://200.49.143.28:7099/sap/opu/odata/sap/Z_SRV_GET_USER_DATA_SRV_01/";
        var getSingleUser = this.getView().byId("uidx").getValue();
        var urlsrv = "/UserdetailSet?$filter=User_Id_Input eq  '" + getSingleUser + "'";
        let sUrl, oHeaders = {};;
        sUrl = serviceUrl;

        var request = {
            headers: oHeaders,
            requestUri: sUrl,
            method: "GET"
        };

        request.user = user;
        request.password = pass;

        OData.read(request, this._readODataOnSuccess, this._readODataOnError);

    },

    _readODataOnSuccess: function (oData) {
        if (oData.results) {
            jsonModel = new sap.ui.model.json.JSONModel();

            jsonModel.setSizeLimit(10000);
            jsonModel.setData({
                Data: oData.results
            });
            NavigationHelper.setCurrentApp("Launchpad");

        } else {
            let cThis = sap.ui.getCore().getControl("App");
            cThis.readODataOnError();
        }
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
        NavigationHelper.setCurrentApp("Launchpad");
        if (!sap.ui.getCore().byId('Launchpad')) {
            var oLaunchad = sap.ui.jsview("Launchpad", "USER.views.Launchpad.Launchpad");
            var viewApp = sap.ui.getCore().byId('app');
            viewApp.addPage(oLaunchad);
        }
    },

    onAfterRendering: function () {

        var dialogD = sap.ui.getCore().byId("dialogFiltersS");
        if (dialogD) {
            dialogD.destroy();
        }

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
