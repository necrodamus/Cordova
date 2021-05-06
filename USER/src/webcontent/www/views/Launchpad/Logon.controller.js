sap.ui.controller("USER.views.Launchpad.Logon", {
    
    // implement an event handler in the Controller
    onInit: function () {
        sap.ui.core.BusyIndicator.hide();
        let constructor = sap.ui.getCore().byId("App");

        let fusr = constructor.byId("uid");
        if (fusr)
            fusr.focus();
        
    },

    onBeforeRendering: function() {

    },

    onLoginTap: function () {
        try {

            var uid = this.getView().byId("uid").getValue();
            var pasw = this.getView().byId("pasw").getValue();
            if (uid !== "" && pasw !== "") {
                localStorage.setItem("User", uid);
                localStorage.setItem("Password", pasw);
                this._checkOdataRest(uid, pasw);
            }


        } catch (err) {
            var message = "Ihe error is = " + err;
            console.log(message);
            MessageBoxHelper.showAlert("Error", message);
        }
    },



    _checkOdataRest: function (user, pass) {
        var sUrl = "http://200.49.143.28:7099/sap/opu/odata/sap/Z_SRV_GET_USER_DATA_SRV_01";

        var oModel = new sap.ui.model.odata.ODataModel(sUrl, true, user, pass);

        sap.ui.core.BusyIndicator.show(0);// shows a busy indicator while loading the data

        oModel.read(

            "/", // the path : would put "/" or "" if it doesn't work

            null, // context : null by default

            [], // urlParameters : empty array as we don't need any here

            true, // asynchronous request : true

            function (oData, response) { // onSuccess function called when everything is ok

                // handle your data here and don't forget the hide the busyIndicator
                alert("We are Through"); //Just to check that the OData request was sucessful
                sap.ui.core.BusyIndicator.hide();

                var oModel = new sap.ui.model.json.JSONModel();

                oModel.setData({
                    User: localStorage.getItem("User"),
                    UserName: localStorage.getItem("Password")
                });

                sap.ui.getCore().getComponent("Component").setModel(oModel, "userLogin");

                var oController = sap.ui.getCore().byId("App").getController();

                if (InternetConnectionHelper.checkConnectionOnline())
                    setTimeout(function () {
                   
                        NavigationHelper.setCurrentApp("SU");
                        NavigationHelper.to({
                            pageId: "USER.views.Launchpad.Serviceuser"
                        });
                    
                    }, 50);
                else
                    MessageBoxHelper.showAlert("Error", "NavToReturnsNoConnection")


            },

            function (oError) { // onError function called when there was an error

                // Here you can handle the error you got, for example, you can show a dialog with the error msg
              
                let constructor = sap.ui.getCore().byId("App");
                constructor.byId("uid").setValue("");
                constructor.byId("pasw").setValue("");
                jQuery.sap.require("sap.ui.commons.MessageBox");

                sap.ui.commons.MessageBox.show(

                    oError.message,

                    sap.ui.commons.MessageBox.Icon.ERROR,

                    "User Control "

                );

                // Finally hide the busyIndicator

                sap.ui.core.BusyIndicator.hide();

            }

        );
    },

    readODataOnError: function () {

        var fnCallback = function () {
            console.log("Error in user/password");
        };

        MessageBoxHelper.showAlert("Error", "UserError", fnCallback, undefined, true);
        console.log(responseXml);
    },

    _readODataOnError: function (oError) {
        // Parse mensaje de error de R3
        var responseXml = oError.message;
        let controller = sap.ui.getCore().byId("Logon");
        
        controller.byId("uid").setValue("");
        controller.byId("pasw").setValue("");
        var fnCallback = function () {
            console.log("Error in user/password");
        };

        MessageBoxHelper.showAlert("Error", "UserError", fnCallback, undefined, true);
        console.log(responseXml);
    }
});
