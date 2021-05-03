sap.ui.jsview("USER.views.Launchpad.Launchpad", {

    getControllerName: function () {
        return "USER.views.Launchpad.Launchpad";
    },

    createContent: function (oController) {
        var page = new sap.m.Page({
            id: "pageLp",
            headerContent: [
                sap.ui.jsview("USER.views.Header.Header")
            ]
        });

        var flexContainer = new sap.m.FlexBox({
            height: "85%",
            items: [

                new sap.m.FlexBox({
                    direction: sap.m.FlexDirection.Row,
                    items: [
                        new sap.m.Input({
                            enabled: true,
                            width: "100%",
                            id: "uid",                                                        
                            layoutData: new sap.m.FlexItemData({
                                styleClass: "workPermitNumberInputContainer"
                            })
                        }),
                        new sap.m.Input({
                            enabled: true,
                            width: "100%",
                            id: "pasw",                                                        
                            layoutData: new sap.m.FlexItemData({
                                styleClass: "workPermitNumberInputContainer"
                            })
                        }),
                        new sap.m.Button({
                            width: "100%",
                            id: "ButtonOKPL",
                            text: "{i18n>ConfirmChange}",
                            press: [oController.onLoginTap, oController],
                            enabled: "{LotoCodesModel>/ConfirmEnabled}",
                            layoutData: new sap.m.FlexItemData({
                                styleClass: "WorkPermitReturnContent"
                            })})
                        

                    ],
                    layoutData: new sap.m.FlexItemData({
                        growFactor: 5
                    })
                })
            ],



        }).addStyleClass("flexContainerClass");
        page.addContent(flexContainer);
        page.addStyleClass("lpBackgroundStyle");
        return page;
    }
});