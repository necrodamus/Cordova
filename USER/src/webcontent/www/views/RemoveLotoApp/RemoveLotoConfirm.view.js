sap.ui.jsview("LOTO.views.RemoveLotoApp.RemoveLotoConfirm", {
    getControllerName: function () {
        return "LOTO.views.RemoveLotoApp.RemoveLotoConfirm";
    },
    createContent: function (oController) {
        return new sap.m.Page({
            headerContent: [
                sap.ui.jsview("LOTO.views.Header.Header")
            ],
            subHeader:[
                new sap.m.Bar({
                    contentLeft: [
                        oController.getTextPermitKey(),
                        new sap.m.Label({text: localStorage.getItem("SelectPermitKey").substr(0, 10)}).addStyleClass("boldFontPL")
                    ],
                    contentMiddle: [
                        oController.getTextRevision(),
                        new sap.m.Label({text: localStorage.getItem("RevisionCode")}).addStyleClass("boldFontPL")
                    ],
                    contentRight: [
                        oController.getTextEstado(),
                        new sap.m.Label({text: localStorage.getItem("SelectStatus")}).addStyleClass("boldFontPL")
                    ]
                }).addStyleClass("barHeaderLabelColorPL")
            ],
            content: [
                new sap.m.HBox({
                    items: [
                        new sap.m.VBox({
                            width: "20%",
                            justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                            alignItems: sap.m.FlexAlignItems.Begin,
                            items: [
                                new sap.m.Link({
                                    id: "backBtnRL",
                                    press: jQuery.proxy(oController.toRemoveLoto, oController),
                                }).addStyleClass("triangulo")
                            ]
                        }).addStyleClass("backpos"),
                        new sap.m.VBox({
                            width: "60%",
                            justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.HBox({
                                    alignItems: sap.m.FlexAlignItems.Center,
                                    items: [
                                        new sap.m.VBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            justifyContent: sap.m.FlexJustifyContent.Start,
                                            items: [
                                                new sap.m.Image({
                                                    densityAware: false,
                                                    width: "80%",
                                                    src: {
                                                        parts: [{
                                                            path: "StatusCodeNew"
                                                        }],
                                                        formatter: function (sStatusCodeNew) {
                                                            if (sStatusCodeNew === "P0X") {
                                                                    return "img/red/unlock-big.svg";
                                                            }
                                                            if (sStatusCodeNew === "P0") {
                                                                    return "img/red/unlock-big.svg";
                                                            }
                                                            else {
                                                                    return "img/green/blocked-big.svg";
                                                            }
                                                        }
                                                    },
                                                    layoutData: new sap.m.FlexItemData({
                                                        styleClass: "removelotoleftimagecenter"
                                                    })
                                                })
                                            ]
                                        }),
                                        new sap.m.VBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            justifyContent: sap.m.FlexJustifyContent.Start,
                                            items: [
                                                oController.getTextFromViewFrame1(),
                                                new sap.m.HBox({
                                                    customData: [
                                                        new sap.ui.core.CustomData({
                                                            key: "InputEnabled",
                                                            value: {
                                                                parts: [
                                                                    {path: "LotoCodesModel>/EIDCodeEnabled"}
                                                                ],
                                                                formatter: function (bCodeEnabled) {
                                                                    return bCodeEnabled ? "enabled" : "disabled";
                                                                }
                                                            },
                                                            writeToDom: true
                                                        })
                                                    ],
                                                    alignItems: sap.m.FlexAlignItems.Center,
                                                    justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                                                    items: [
                                                        new sap.m.Input({
                                                            enabled: "{LotoCodesModel>/EIDCodeEnabled}",
                                                            width: "100%",
                                                            id : "EIDCodeRL",
                                                            value: "{LotoCodesModel>/EIDCode}",
                                                            liveChange: jQuery.proxy(oController.handleInputLiveChange, oController, LotoScanHelper.oInputsTypes.Code),
                                                            layoutData: new sap.m.FlexItemData({
                                                                styleClass: "workPermitNumberInputContainer"
                                                            })
                                                        }),
                                                        new sap.m.Image({
                                                            width: "95%",   
                                                            src: "img/orange/camera_orange.svg",
                                                            visible: true,
                                                            densityAware: false,
                                                            press: jQuery.proxy(oController.handleScan, oController, LotoScanHelper.oInputsTypes.Code)
                                                        })
                                                    ]
                                                }).addStyleClass("WorkInputNumberContainer"),
                                                new sap.m.HBox({
                                                    alignItems: sap.m.FlexAlignItems.Center,
                                                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                                                    items: [
                                                        new sap.m.Button({
                                                            width: "100%",
                                                            id: "ButtonOKRL",
                                                            text: "{i18n>Unlock}",
                                                            press: [oController.handleRemoveLotoConfirm, oController],
                                                            enabled: "{LotoCodesModel>/ConfirmEnabled}",
                                                            layoutData: new sap.m.FlexItemData({
                                                                styleClass: "WorkPermitReturnContent"
                                                            })
                                                        }).addStyleClass("CLButton")
                                                    ]
                                                }).addStyleClass("WorkPermitReturnContent")
                                            ]
                                        }).addStyleClass("WorkNumberContainer"),
                                    ]
                                }).addStyleClass("WorkPermitReturnContent")
                            ]
                        }).addStyleClass("ConfirmLotoContainer"),
                        new sap.m.VBox({
                            width: "20%",
                        })
                    ]
                })
            ]
        }).addStyleClass("pageStyleRemoveLotoConfirm");
    }
});