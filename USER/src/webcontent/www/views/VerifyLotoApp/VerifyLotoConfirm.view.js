sap.ui.jsview("LOTO.views.VerifyLotoApp.VerifyLotoConfirm", {
    getControllerName: function () {
        return "LOTO.views.VerifyLotoApp.VerifyLotoConfirm";
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
                                    id: "backBtnVL",
                                    press: jQuery.proxy(oController.toVerifyLoto, oController),
                                }).addStyleClass("triangulo")
                            ]
                        }).addStyleClass("backposVL"),
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
                                                    width: "95%",
                                                    src: {
                                                        parts: [
                                                            {path: "StatusCodeNew"}
                                                        ],
                                                        formatter: function (sStatusCodeNew) {
                                                            var sStatusCodeNew = localStorage.getItem("StatusCodeNew");
                                                            switch (sStatusCodeNew) {
                                                                case "P0X":
                                                                        return "img/red/unlock-big.svg";
                                                                case "P3":
                                                                        return "img/green/blocked-big.svg";
                                                                case "P3N":
                                                                        return "img/red/blocked-big.svg";
                                                                //P2
                                                                default:
                                                                        return "img/yellow/blocked-big.svg";

                                                            }
                                                        }
                                                    },
                                                    layoutData: new sap.m.FlexItemData({
                                                        styleClass: "verifylotoleftimagecenter"
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
                                                                    { path: "LotoCodesModel>/EIDCodeEnabled" }
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
                                                            id : "EIDCodeVL",
                                                            value: "{LotoCodesModel>/EIDCode}",
                                                            liveChange: jQuery.proxy(oController.handleInputLiveChange, oController, oController._oInputs.Code),
                                                            layoutData: new sap.m.FlexItemData({
                                                                styleClass: "workPermitNumberInputContainer"
                                                            })
                                                        }),
                                                        new sap.m.Image({
                                                            visible: true,
                                                            width: "95%",
                                                            src: "img/orange/camera_orange.svg",
                                                            densityAware: false,
                                                            press: jQuery.proxy(oController.handleScan_Edi, oController, oController._oInputs.Code)
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
                                                                    { path: "LotoCodesModel>/LockoutDeviceCodeEnabled" }
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
                                                            id : "LockoutDeviceCodeVL",
                                                            value: "{LotoCodesModel>/LockoutDeviceCode}",
                                                            liveChange: jQuery.proxy(oController.handleInputLiveChange, oController, oController._oInputs.LookOut),
                                                            layoutData: new sap.m.FlexItemData({
                                                                styleClass: "workPermitNumberInputContainer"
                                                            })
                                                        }),
                                                        new sap.m.Image({
                                                            visible: true,
                                                            width: "95%",
                                                            src: "img/orange/camera_orange.svg",
                                                            densityAware: false,
                                                            press: jQuery.proxy(oController.handleScan, oController, oController._oInputs.LookOut)
                                                        })
                                                    ]
                                                }).addStyleClass("WorkInputNumberContainer")
                                            ]
                                        }).addStyleClass("WorkNumberContainer")
                                    ]
                                }).addStyleClass("WorkPermitReturnContent"),
                                new sap.m.HBox({
                                    alignItems: sap.m.FlexAlignItems.Center,
                                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                                    items: [
                                        new sap.m.Button({
                                            id: "ButtonOKVL",
                                            width: "100%",
                                            text: "{i18n>ConfirmLock}",
                                            press: [oController.handlePerformConfirm, oController],
                                            enabled: "{LotoCodesModel>/ConfirmEnabled}",
                                            layoutData: new sap.m.FlexItemData({
                                                styleClass: "WorkPermitReturnContent"
                                            })
                                        }).addStyleClass("CLButtonOk"),
                                        new sap.m.VBox({
                                            width: "5%",
                                        }),
                                        new sap.m.Button({
                                            id: "ButtonNOKVL",
                                            width: "100%",
                                            text: "{i18n>LockNotConfirmed}",
                                            press: [oController.handlePerformNotConfirm, oController],
                                            enabled: "{LotoCodesModel>/EIDCodeValid}",
                                            layoutData: new sap.m.FlexItemData({
                                                styleClass: "WorkPermitReturnContent"
                                            })
                                        }).addStyleClass("CLButton")
                                    ]
                                }).addStyleClass("WorkPermitReturnContent")
                            ]
                        }).addStyleClass("VerifyLotoConfirmContainer"),
                        new sap.m.VBox({
                            width: "20%",
                        })
                    ]
                })
            ]
        }).addStyleClass("pageStyleConfirmLoto");
    }
});