sap.ui.jsview("USER.views.Launchpad.App", {

    getControllerName: function () {
        return "USER.views.Launchpad.App";
    },

    createContent: function(oController) {
        var app = new sap.m.App();
      
        var page = new sap.m.Page({
          title:"Login Form",
          content:[
            new sap.m.VBox({
              fitContainer:true,
              justifyContent:"Center",
              alignItems:"Center",
              alignContent:"Center",
              items:[
                new sap.m.Input(this.createId("uid"),{placeholder:"User ID"}),
                new sap.m.Input(this.createId("pasw"),{placeholder:"Password", type:"Password"}),
                new sap.m.Button({width:"12rem",text:"Login",type:"Emphasized",
                                 press:[oController.onLoginTap,oController]})
              ]
            })
          ],
          footer:[
            new sap.m.Bar({
              contentLeft:[new sap.m.Text({text:"Global Tech"})],
              contentRight:[new sap.m.Text({text:"Sap Gateway Login"})]
            })
          ]
        });
      app.addPage(page);
        return app;
    }
});