sap.ui.controller("USER.views.Launchpad.Listusers", {
    _this: "",
    getViewName: function () {
        return this.getView().getId();

    },
    onAfterRendering: function () {
        var oModelo = new sap.ui.model.json.JSONModel();
        oModelo.setData({
            Items: []
        });
        this.getView().setModel(oModelo, "UsersModel");
        _this = this;
        this._loadModel();
    },

    onConfirm: function () { },

    onCancel: function () { },



    onExitApp: function () {
        ClearData.cache(function () {
            console.info('Successfully cleared app cache');
        }, function (err) {
            console.error('Error clearing app cache', err);
        });

        navigator.app.exitApp();
    },


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

        var fnCallback = function () {
            console.log("User Not Found");
        };

        MessageBoxHelper.showAlert("Error", "UserErrorNF", fnCallback, undefined, true);
        console.log(responseXml);
    },

    _readODataOnSuccess: function (oData) {
    

        var oModelo = new sap.ui.model.json.JSONModel();
        oModelo.setData({
            Items: []
        });
        _this.getView().setModel(oModelo, "UsersModel");
        var oModelData = oModelo.getData();
        for (const key in oData.results) {
            var user = {};
            user.nameid = oData.results[key].User_Id;
            user.name = oData.results[key].Company_Name;
            user.language = oData.results[key].Country;
            oModelData.Items.push(user);

        }

        oModelo.setData(oModelData);

    },


});