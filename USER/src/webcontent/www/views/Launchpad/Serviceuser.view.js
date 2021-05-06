sap.ui.jsview("USER.views.Launchpad.Serviceuser", {


    getControllerName: function () {
        return "USER.views.Launchpad.Serviceuser";
    },



    createContent: function (oController) {

        var page = new sap.m.Page({
            title: "Get User Data",
            content: [
                new sap.m.VBox({
                    fitContainer: true,
                    justifyContent: "Center",
                    alignItems: "Center",
                    alignContent: "Center",
                    items: [
                        new sap.m.Input(this.createId("uidx"), { placeholder: "User ID" }),
                        new sap.m.HBox({
                            items:
                            [
                                new sap.m.Button({
                                    width: "12rem", text: "Execute Single", type: "Emphasized",
                                    press: [oController.onGetApp, oController]
                                }),
                                new sap.m.Text({ text: "________" }),
                                new sap.m.Button({
                                    width: "12rem", text: "Execute List", type: "Emphasized",
                                    press: [oController.onGetAppL, oController]
                                })
                            ]
                        }),

                        
                        new sap.m.VBox({
                            fitContainer: true,
                            justifyContent: "Center",
                            alignItems: "Center",
                            alignContent: "Center",
                            items: [
                        new sap.m.Text({ text: "Name " + "{UserModel>/Name}" }),
                        new sap.m.Text({ text: "Id " + "{UserModel>/Id}" }),
                    ]})
                    ]
                })
            ],
            footer: [
                new sap.m.Bar({
                    contentLeft: [new sap.m.Text({ text: "Global Tech" })],
                    contentMiddle: [new sap.m.Button({
                        width: "12rem", text: "Exit Apk", type: "Emphasized",
                        press: [oController.onExitApp, oController]
                    })],
                    contentRight: [new sap.m.Text({ text: "User Data Detail" })]
                })
            ]
        });

        return page;
    }
});