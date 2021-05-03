jQuery.sap.declare("USER.services.UserService");

LocationLotoService = {

    loadModel: function () {

        if (InternetConnectionHelper.checkConnectionOnline()) {
            return this._loadModel();
        } else {
            MessageBoxHelper.showAlert("Error", "InternetRequired", undefined, undefined, true);
            BusyDialogHelper.close();
        }

    },

    _loadModel: function () {

//        var serviceUrl = ProxyHelper.getUrl("sap/opu/odata/sap/Z_SRV_GET_USER_DATA_SRV_01");
var serviceUrl = "http://200.49.143.28:7099/sap/opu/odata/sap/Z_SRV_GET_USER_DATA_SRV_01/";
        let userId = JSON.parse(localStorage.getItem('UserData')).PlanningPlantID;
        var urlsrv = "/UserdetailSet?$filter=User_Id_Input eq  '" + userId + "'";
        var sUrl;
        sUrl = serviceUrl + urlsrv;
        var oHeaders = {};


        var request = {
            headers: oHeaders,
            requestUri: sUrl,
            method: "GET"
        };
         var passwordd = $("#passwordd").val();
                var userid = $("#userid").val();

        request.user = userid ;
        request.password = passwordd ;

        OData.read(request, this._readODataOnSuccess, this._readODataOnError);
    },

    _readODataOnSuccess: function (oData) {

        var jsonModel = new sap.ui.model.json.JSONModel();
        jsonModel.setSizeLimit(10000);
        jsonModel.setData({
            Data: oData.results
        });

        localStorage.setItem("UserData", JSON.stringify(oData.results));
        var modelUserData = new sap.ui.model.json.JSONModel(JSON.parse(localStorage.getItem('UserData')));
        sap.ui.getCore().getComponent("Component").setModel(modelUserData, "UserData");

    },

    _readODataOnError: function (oError) {
       // Parse mensaje de error de R3
        var responseXml = oError.message;		
		var dialogId = "dialogFilters";
        var dialog = sap.ui.getCore().byId(dialogId);
		dialog.close();
		var fnCallback = function () {
              dialog.close();
            };
			
        MessageBoxHelper.showAlert("Error", "HTTP Request Failed" , fnCallback, undefined, true);
        console.log(responseXml);
    }
};


