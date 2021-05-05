sap.ui.jsview("USER.views.Header.Header", {

    getControllerName: function () {
        return "USER.views.Header.Header";
    },

    createContent: function (oController) {
        return new sap.m.Bar({

            contentRight: [
                //1 Logo
                new sap.m.Image({
                    densityAware: false,
                    src: "img/apps-titles/user-info.svg"
                }).addStyleClass("imgLogo").addStyleClass("noselect"),
                //2 User
                new sap.m.Label({
                    text: {
                        parts: [{ path: "LoggedUserData>/UserFullName" }],
                        formatter: function (username) {
                            if (username && username.length > 15)
                                username = username.substring(0, 45);
                            return username;
                        }
                    }
                }).addStyleClass("toolbarUserName").addStyleClass("noselect"),
                //3 Home
                new sap.m.Image({
                    densityAware: false,
                    src: "img/home.svg",
                    width: "50px",
                    press: [oController.confirmHome, oController]
                }),
                //4 Settings
                new sap.m.Image({
                    densityAware: false,
                    src: "img/blue/settings.svg",
                    width: "50px",
                    press: [oController.handleSettings, oController]
                }).addStyleClass("toolbarspace"),
            ],
            contentMiddle: [
                new sap.m.Text({
                    text: "{i18n>TitleUser}",
                    visible: oController.getTitleTextVisible()
                }).addStyleClass("noselect")
            ],
            contentLeft: [
                //1 Settings
                new sap.m.Image({
                    densityAware: false,
                    src: "img/blue/settings.svg",
                    width: "50px",
                    press: [oController.handleSettings, oController]
                }).addStyleClass("toolbarspace"),
                //2 Wifi
                new sap.m.Image({
                    src: "img/blue/wifi.svg",
                    densityAware: false,
                    width: "50px",
                }).addStyleClass("toolbarspace"),
                //3 Sync
                new sap.m.Image({
                    densityAware: false,
                    src: "img/blue/sync.svg",
                    width: "50px",
                    press: [oController.confirmRefresh, oController]
                }),
                //4 Log Off
                new sap.m.Image({
                    densityAware: false,
                    src: "img/blue/log-off.svg",
                    width: "50px",
                    press: [oController.confirmLogOut, oController]
                }),
                //5 User
                new sap.m.Label({
                    text: {
                        parts: [{ path: "LoggedUserData>/UserFullName" }],
                        formatter: function (username) {
                            if (username && username.length > 15)
                                username = username.substring(0, 45);
                            return username;
                        }
                    }
                }).addStyleClass("toolbarUserName").addStyleClass("noselect"),
                //6 Text Button
                oController.getImageFromView()

            ]
        }).addStyleClass('mainBar').addStyleClass("noselect");
    }

});