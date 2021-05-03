sap.ui.jsview("LOTO.views.RemoveLotoApp.RemoveLoto", {
    getControllerName: function () {
        return "LOTO.views.RemoveLotoApp.RemoveLoto";
    },

  createContent: function (oController) {   
       //Instantiate the table
        var oTable = new sap.ui.table.Table({
            enableBusyIndicator : true,
            rowHeight:90,
            columnHeaderHeight:15,
            visibleRowCountMode:sap.ui.table.VisibleRowCountMode.Auto,
            selectionMode: sap.ui.table.SelectionMode.Single, 
            rowSelectionChange: [oController.handlePermitItemPress, oController],
            selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly
        }).addStyleClass("scrollAdd").addStyleClass("tablestyle");

        //Define the Table columns and the binding values

        var otemp = new sap.ui.commons.Image({width: "28px"}).bindProperty("src","StatusCodeNew", function(cellValue){
            if  (cellValue !== null )   {
                return "img/default/"+cellValue.toLowerCase()+".svg";
            } else {
               return "img/default/p2.svg"; 
            }                      
        });

        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: ""}),
            template: otemp,
            flexible: true,
            resizable: true,
            autoResizable: true,
            width : '6%',
            hAlign: sap.ui.core.HorizontalAlign.Center
        }));
    
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "{i18n>Status}"}).addStyleClass("sorterLinkClass"),
            template: new sap.ui.commons.TextView({text: "{StatusDescNew}"}).addStyleClass("normalFontPL"),
            sortProperty: "StatusDescNew",
            filterProperty: "StatusDescNew",
            flexible: false,
            resizable: false,
            autoResizable: false,
            width : '18%',
            hAlign: sap.ui.core.HorizontalAlign.Center
        }));

        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "{i18n>EIDCode}"}).addStyleClass("sorterLinkClass"),
            template: new sap.ui.commons.TextView({text: "{PermitKey}"}).addStyleClass("normalFontPL blackFontPL"),
            sortProperty: "PermitKey",
            filterProperty: "PermitKey",
            flexible: false,
            resizable: false,
            autoResizable: false,
            width : '14%',
            hAlign: sap.ui.core.HorizontalAlign.Center
        }));
        
      
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "{i18n>EIDDescription}"}).addStyleClass("sorterLinkClass"),
            template: new sap.ui.commons.TextView({text: "{PermitDesc}"}).addStyleClass("normalFontPL"),
            sortProperty: "PermitDesc",
            filterProperty: "PermitDesc",
            flexible: false,
            resizable: false,
            autoResizable: false,
            hAlign: sap.ui.core.HorizontalAlign.Center
        }));
      
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "{i18n>EIDZone}"}).addStyleClass("sorterLinkClass"),
            template: new sap.ui.commons.TextView({text: "{Zone}"}).addStyleClass("normalFontPL"),
            sortProperty: "Zone",
            filterProperty: "Zone",     
            flexible: false,
            resizable: false,
            autoResizable: false,
            hAlign: sap.ui.core.HorizontalAlign.Center
        }));
      
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "{i18n>EIDLocation}"}).addStyleClass("sorterLinkClass"),
            template: new sap.ui.commons.TextView({text: "{Location}"}).addStyleClass("normalFontPL"),
            sortProperty: "Location",
            filterProperty: "Location", 
            flexible: false,
            resizable: false,
            autoResizable: false,
            hAlign: sap.ui.core.HorizontalAlign.Center
        }));
      
        oTable.addColumn(new sap.ui.table.Column({      
            label: new sap.ui.commons.Label({text: "{i18n>Speciality}"}).addStyleClass("sorterLinkClass"),
            template: new sap.ui.commons.TextView({text: "{SpecialtyDes}"}).addStyleClass("normalFontPL"),
            sortProperty: "SpecialtyDes",
            filterProperty: "SpecialtyDes", 
            flexible: false,
            resizable: false,
            autoResizable: false,
            hAlign: sap.ui.core.HorizontalAlign.Center,
            width : '12%'
        }));


        if (UserHelper.getUserData()["LotoCode"] === "2") {
            oTable.addColumn(new sap.ui.table.Column({      
                label: new sap.ui.commons.Label({text: "{i18n>LockOutDeviceCode}"}).addStyleClass("sorterLinkClass"),
                template: new sap.ui.commons.TextView({text: "{LockoutDeviceCode}"}).addStyleClass("normalFontPL"),
                sortProperty: "LockoutDeviceCode",
                filterProperty: "LockoutDeviceCode", 
                flexible: false,
                resizable: false,
                autoResizable: false,
                hAlign: sap.ui.core.HorizontalAlign.Center,
                width : '14%'
            }));                        
        }


        oTable.addEventDelegate({
            onBeforeRendering:function(){
                   BusyDialogHelper.open("Loading")
            }
        });

    
        oController.setTable(oTable);
        return new sap.m.Page({
            headerContent: [
                sap.ui.jsview("LOTO.views.Header.Header")
            ],
            subHeader: new sap.m.Bar({
                contentLeft: [
                    new sap.m.Label({text: "{i18n>PendingDevicesToBeUnlocked}"}).addStyleClass("labelTitleConfirmLotoPermitKey"),
                    new sap.m.Label({text: "{DeviceInformationModel>/unlocked}"}).addStyleClass("boldFontPL")
                ],
                contentMiddle: [
                    new sap.m.Label({text: "{i18n>Review}"}).addStyleClass("labelTitleConfirmLotoPermitKey"),
                    new sap.m.Label({text: localStorage.RevisionCode}).addStyleClass("boldFontPL")
                ],
                contentRight: [
                    new sap.m.Label({text: "{i18n>TotalDevicesLocked}"}).addStyleClass("labelTitleConfirmLotoPermitKey"),
                    new sap.m.Label({text: "{DeviceInformationModel>/locked}"}).addStyleClass("boldFontPL"),
                ]
            }).addStyleClass("barHeaderLabelColorPL"),
            content: [
                new sap.m.HBox({
                    width: "100%",
                    items: [ oController.handleSearch() ]
                }),
                oTable
            ]
        }).addStyleClass("pageStylePerformLotoConfirm");
    }
});