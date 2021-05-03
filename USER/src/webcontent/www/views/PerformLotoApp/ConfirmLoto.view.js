sap.ui.jsview("LOTO.views.PerformLotoApp.ConfirmLoto", {
    getControllerName: function () {
        return "LOTO.views.PerformLotoApp.ConfirmLoto";
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
                                    id: "backBtnPL",
                                    press: jQuery.proxy(oController.toPerformLoto, oController),
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
                                    justifyContent: sap.m.FlexJustifyContent.Center,
                                    items: [
                                        new sap.m.VBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            justifyContent: sap.m.FlexJustifyContent.Start,
                                            items: [
                                                new sap.m.Image({
                                                    densityAware: false,
                                                    width: "95%",
                                                    src: {
                                                        parts: [{
                                                            path: "StatusCodeNew"
                                                        }],
                                                        formatter: function (sStatusCodeNew) {
                                                            if (sStatusCodeNew === "P0X") {
                                                                    return "img/red/unlock-big.svg";
                                                            } else {
                                                                    return "img/yellow/blocked-big.svg";
                                                            }
                                                        }
                                                    },
                                                    layoutData: new sap.m.FlexItemData({
                                                        styleClass: "performlotoleftimagecenter"
                                                    })
                                                })
                                            ]
                                        }),
                                        new sap.m.VBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            justifyContent: sap.m.FlexJustifyContent.Start,
                                            width: "100%",
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
                                                            id: "EIDCodePL",
                                                            value: "{LotoCodesModel>/EIDCode}",
                                                            liveChange: jQuery.proxy(oController.handleInputLiveChange, oController, LotoScanHelper.oInputsTypes.Code),
                                                            layoutData: new sap.m.FlexItemData({
                                                                styleClass: "workPermitNumberInputContainer"
                                                            })
                                                        }),
                                                        new sap.m.Image({
                                                            densityAware: false,
                                                            visible: true,
                                                            width: "95%",
                                                            src: "img/orange/camera_orange.svg",
                                                            densityAware: false,
                                                            press: jQuery.proxy(oController.handleScan_Edi, oController, LotoScanHelper.oInputsTypes.Code)
                                                        })
                                                    ]
                                                }).addStyleClass("WorkInputNumberContainer"),
                                                new sap.m.HBox({
                                                    alignItems: sap.m.FlexAlignItems.Center,
                                                    justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                                                }).addStyleClass("confirmSpaceBox"),
                                                oController.getTextFromViewFrame2(),
                                                new sap.m.HBox({
                                                    customData: [
                                                        new sap.ui.core.CustomData({
                                                            key: "InputEnabled",
                                                            value: {
                                                                parts: [
                                                                    {path: "LotoCodesModel>/LockoutDeviceCodeEnabled"}
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
                                                            enabled: "{LotoCodesModel>/LockoutDeviceCodeEnabled}",
                                                            width: "100%",
                                                            id: "LockoutDeviceCodePL",
                                                            value: "{LotoCodesModel>/LockoutDeviceCode}",
                                                            liveChange: jQuery.proxy(oController.handleInputLiveChange, oController, LotoScanHelper.oInputsTypes.LookOut),
                                                            layoutData: new sap.m.FlexItemData({
                                                                styleClass: "workPermitNumberInputContainer"
                                                            })
                                                        }),
                                                        new sap.m.Image({
                                                            densityAware: false,
                                                            visible: true,
                                                            width: "95%",
                                                            src: "img/orange/camera_orange.svg",
                                                            press: jQuery.proxy(oController.handleScan, oController, LotoScanHelper.oInputsTypes.LookOut)
                                                        })

                                                    ]
                                                }).addStyleClass("WorkInputNumberContainer")
                                            ]
                                        }).addStyleClass("WorkNumberContainer")
                                    ]
                                }).addStyleClass("WorkPermitReturnContent"),
                            new sap.m.Button({
                                width: "100%",
                                id: "ButtonOKPL",
                                text: "{i18n>ConfirmChange}",
                                press: [oController.handlePerformConfirm, oController],
                                enabled: "{LotoCodesModel>/ConfirmEnabled}",
                                layoutData: new sap.m.FlexItemData({
                                    styleClass: "WorkPermitReturnContent"
                                })
                            }).addStyleClass("CLButton")
                            ]
                        }).addStyleClass("ConfirmLotoContainer"),
                        new sap.m.VBox({
                            width: "20%",
                        })
                    ]
                })
            ]
        }).addStyleClass("pageStyleConfirmLoto")
    }
});