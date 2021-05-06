sap.ui.jsview("USER.views.Launchpad.Listusers", {
    getControllerName: function () {
        return "USER.views.Launchpad.Listusers";
    },
    
        createContent: function (oController) {
            // Container of Users
            var oContainerUsers = new sap.m.FlexBox({
                items: {
                    path: "UsersModel>/Items",
                    template: new sap.m.VBox({
                        items: [
                            new sap.m.Text({
                                text: "{UsersModel>nameid}"
                            }),
                            new sap.m.Text({
                                text: "{UsersModel>name}"
                            }),
                            new sap.m.Text({
                                text: "{UsersModel>language}"
                            })
                        ]
                    })
                }
            });

            
            var page = new sap.m.Page({
                title: "Get User Data",
                content: [
                    oContainerUsers
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