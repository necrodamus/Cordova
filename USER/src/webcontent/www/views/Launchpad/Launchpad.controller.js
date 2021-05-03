sap.ui.controller("USER.views.Launchpad.Launchpad", {
    myVar: "",
    getViewName: function () {
        return this.getView().getId();
    },

    onInit: function () { },

    navToSelectRv: function (event) {
        var rvSel = event.getSource().getSelectedKey();
        console.log(rvSel);

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
