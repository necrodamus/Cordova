jQuery.sap.require("LOTO.views.WorkorderApp.HttpWoReturnHelper");
sap.ui.jsview("LOTO.views.WorkorderApp.Workorder", {
    getControllerName: function () {
        return "LOTO.views.WorkorderApp.Workorder";
    },

    createContent: function (oController) {
        return new sap.m.Page({
            headerContent: [
                sap.ui.jsview("LOTO.views.Header.Header")
            ],
            subHeader: new sap.m.Bar({
                contentLeft: [
                    new sap.m.Label({text: "{i18n>PendingWo}"}).addStyleClass("normalFontPL"),
                    new sap.m.Label({text: "{DeviceInformationModel>/unlocked}"}).addStyleClass("boldFontPL")
                ],
                contentMiddle: [
                    new sap.m.Label({text: "{i18n>Review}"}).addStyleClass("normalFontPL"),
                    new sap.m.Label({text: localStorage.RevisionCode}).addStyleClass("boldFontPL")
                ],
                contentRight: [
                    new sap.m.Label({text: "{i18n>FinishedWo}"}).addStyleClass("normalFontPL"),
                    new sap.m.Label({text: "{DeviceInformationModel>/locked}"}).addStyleClass("boldFontPL")
                ]
            }).addStyleClass("barHeaderLabelColorPL"),
            content: [
                new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                    items: [
                        new sap.m.HBox({
                            justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                            items: [
                                new sap.m.Image({
                                    densityAware: false,
                                    width: "64%",
                                    src: "img/white/work-permit-confirm.svg",
                                    layoutData: new sap.m.FlexItemData({
                                        styleClass: "workPermitImageContainer"
                                    })
                                }),
                                new sap.m.VBox({
                                    justifyContent: sap.m.FlexJustifyContent.Start,
                                    items: [
                                        new sap.m.Text({
                                            text: "{i18n>WorkPermitCode}"
                                        }).addStyleClass("workOrderText"),
                                        new sap.m.HBox({
                                            justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                                            items: [
                                                new sap.m.Input({
                                                    width: "100%",
                                                    id: "idInputWo",
                                                    value: "{WorkOrderInputModel>/WorkOrder}",
                                                    liveChange: [oController.handleWorkOrderLiveChange, oController],
                                                    layoutData: new sap.m.FlexItemData({
                                                        styleClass: "workPermitNumberInputContainer"
                                                    })
                                                }),
                                                new sap.m.Image({
                                                    width: "95%",                                                    
                                                    visible: true,
                                                    src: "img/blue/camera_light_blue.svg",
                                                    densityAware: false,
                                                    press: [oController.handleBarcodeScan, oController]
                                                }).addStyleClass("WorkInputNumberContainer")
                                            ]
                                        }).addStyleClass("WorkInputNumberContainer"),
                                        new sap.m.Button({
                                            width: "100%",
                                            text: "{i18n>ReturnWorkPermit}",
                                            press: [oController.confirmWorkOrderReturn, oController],
                                                enabled: {
                                                 parts: [
                                                     {path: "WorkOrderInputModel>/StatusB"}
                                                 ],
                                                formatter: function (statusB) {
                                                    return statusB;
                                                 }
                                            }
                                        }).addStyleClass("workPermitButtonConfirm")
                                    ]
                                }).addStyleClass("WorkNumberContainer")
                            ]
                        }).addStyleClass("WorkPermitReturnContent"),
                        new sap.m.ScrollContainer({
                            vertical : false,
                            horizontal : false,
                            width : "37rem",
//                            height : "400px",
                            content:new sap.m.List({
                                width: "95%",
                                headerText: "{i18n>WorkPermitReturnedReadyToSync}",
                                items: {
                                    path: "ModifiedWorkOrdersModel>/",
                                    template: new sap.m.CustomListItem({                           
                                        content: new sap.m.HBox({
                                            justifyContent: sap.m.FlexJustifyContent.SpaceAround,
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [
                                                new sap.m.Image({
                                                    width: "80%",
                                                    src: "img/blue/work-permit-confirm.svg"
                                                }).addStyleClass("workPermitListImage"),
                                                new sap.m.Text({
                                                    text: {
                                                        parts: [
                                                            {path: "ModifiedWorkOrdersModel>WorkOrderNum"}, 
                                                            {path: "ModifiedWorkOrdersModel>Version"}
                                                        ],
                                                        formatter: function (sWorkOrder, version) {
                                                            return version + sWorkOrder.substr(2);
                                                        }
                                                    },
                                                    layoutData: new sap.m.FlexItemData({
                                                        styleClass: "workPermitListTextContainer"
                                                    })
                                                })
                                            ]
                                        })
                                    })     
                                },
                                layoutData: new sap.m.FlexItemData({
                                    styleClass: "WorkPermitReturnContent"
                                })
                            }) 
                        }).addStyleClass("WorkOrderListText"),
                    ]
                }).addStyleClass("workPermitContainer")

            ]
        }).addStyleClass("pageStyleWo");
    }
});
//# sourceURL=ms-appx-web://com.tenaris.loto/www/views/WorkorderApp/Workorder.view.js