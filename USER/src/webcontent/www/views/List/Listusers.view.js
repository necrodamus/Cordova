sap.ui.jsview("USER.views.List.Listusers", {
    getControllerName: function () {
        return "USER.views.List.Listusers";
    },

    createContent: function (oController) {
        this.setDisplayBlock(true);


        var page = new sap.m.Page({
            title: "List Users USR03 Table",
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

        //table
        var table = new sap.m.Table({
            id: "tblETItems",
            inset: false,
            fixedLayout: false,
            enableBusyIndicator: true,
            noDataText: "No User List",
            columns: [
                new sap.m.Column({ header: new sap.m.Text({ text: "User ID" }) }),
                new sap.m.Column({ header: new sap.m.Text({ text: "Name" }) }),
                new sap.m.Column({ header: new sap.m.Text({ text: "Language" }) }),
            ]
        });
        var template = new sap.m.ColumnListItem({
            type: sap.m.ListType.Active,
            cells: [
                new sap.m.Text({ text: "{User_Id}" }),
                new sap.m.Text({ text: "{Company_Name}" }),
                new sap.m.Text({ text: "{Country}" })
            ]
        });
    
        table.bindItems("/ExtornoRequests", template);

        page.addContent(table);
        return page;
    }
});