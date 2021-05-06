sap.ui.controller("USER.views.List.Listusers", {

    onAfterRendering: function () {
        BusyDialogHelper.open("LoadingUsers");
        this._loadModel();
        app.activeController = this;
    },
    
    onExitApp: function () {
        ClearData.cache(function () {
            console.info('Successfully cleared app cache');
        }, function (err) {
            console.error('Error clearing app cache', err);
        });

        navigator.app.exitApp();
    },

    onConfirm: function () { },

    onCancel: function () { },

    _loadModel: function () {

        var serviceUrl = "http://200.49.143.28:7099/sap/opu/odata/sap/Z_SRV_GET_USER_DATA_SRV_01/";
        var getSingleUser = "*";
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

    _readODataOnSuccess: function (oData) {
        debugger;
        var extornoRequests = oData.results;
        var extornoRequestsJsonModel = new sap.ui.model.json.JSONModel();

        extornoRequestsJsonModel.setData({
            ExtornoRequests: extornoRequests
        });

        sap.ui.getCore().byId("Listusers").setModel(extornoRequestsJsonModel);
        BusyDialogHelper.close();

    },


});