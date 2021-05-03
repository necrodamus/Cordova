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
                        new sap.m.HBox({
                            id: "tileSync",
                            alignItems: sap.m.FlexAlignItems.Center,
                            justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                            layoutData: new sap.m.FlexItemData({
                                growFactor: 5,

                            }),
                            items: [
                                new sap.m.Text({
                                    id: "tileText",
                                    text: "{i18n>GetUserData}",
                                    textAlign: sap.ui.core.TextAlign.Center,
                                    layoutData: new sap.m.FlexItemData({
                                        styleClass: "launchpad-tile-title"
                                    })
                                }).addStyleClass("tileTitle")
                            ]
                        }).addStyleClass("tile").attachBrowserEvent("click", oController.toSync, oController),

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