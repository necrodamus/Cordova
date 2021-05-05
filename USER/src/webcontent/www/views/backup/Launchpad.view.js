sap.ui.jsview("USER.views.Launchpad.Launchpad", {


    getControllerName: function () {
        return "USER.views.Launchpad.Launchpad";
    },

    createContent: function (oController) {
        var app = new sap.m.App();

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

                        new sap.m.Button({
                            width: "12rem", text: "Execute", type: "Emphasized",
                            press: [oController.onGetUserInfo, oController]
                        })
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
        app.addPage(page);
        return app;
    }
});