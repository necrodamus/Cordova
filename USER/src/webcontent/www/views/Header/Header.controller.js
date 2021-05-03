sap.ui.controller("USER.views.Header.Header", {
    myVar: "",
    onAfterRendering: function () {
        var sDiv = this.getView().getContent()[0]._$LeftBar[0];
        var sContentDiv = $(sDiv).html();

        var sDivR = this.getView().getContent()[0]._$RightBar[0];
        var sContentDivR = $(sDivR).html();

        var sIid1 = $(sContentDiv)[0].id;
        var sIid2 = $(sContentDiv)[1].id;
        var sIid3 = $(sContentDiv)[2].id;
        var sIid4 = $(sContentDiv)[3].id;
        var sIid5 = $(sContentDiv)[4].id;
        var sIid6 = $(sContentDiv)[5].id;

        var sIid7 = $(sContentDivR)[0].id;
        var sIid8 = $(sContentDivR)[1].id;
        var sIid9 = $(sContentDivR)[2].id;
        var sIid10 = $(sContentDivR)[3].id;

        localStorage.setItem("Image1", sIid1);
        localStorage.setItem("Image3", sIid3);
        localStorage.setItem("Image4", sIid4);
        localStorage.setItem("Image5", sIid5);
        localStorage.setItem("Image6", sIid6);

        localStorage.setItem("Image7", sIid7);
        localStorage.setItem("Image8", sIid8);
        localStorage.setItem("Image9", sIid9);
        localStorage.setItem("Image10", sIid10);


        var sModelView = "";
        var iImageId = "";
        switch (NavigationHelper._sCurrentApp) {
            case "Launchpad":
                iImageId = "Image11";
                localStorage.setItem("Image11", sIid2);
                localStorage.setItem("Image2", sIid2);
                break;
            default:
                iImageId = "Image2";
                localStorage.setItem("Image2", sIid2);
                break;
        }

        if (navigator.connection.type !== "none") {
            if (sap.ui.getCore().byId(localStorage.getItem(iImageId)) !== undefined)
                sap.ui.getCore().byId(localStorage.getItem(iImageId)).setSrc("img/blue/wifi.svg");
        } else {
            sap.ui.getCore().byId(localStorage.getItem(iImageId)).setSrc("img/blue/wifi_no.svg");
        }
        sap.ui.getCore().byId(localStorage.getItem(iImageId)).removeStyleClass("LOTODisNone");
    },

    getImageFromView: function () {
        var sViewValue = NavigationHelper._sCurrentApp;
        switch (sViewValue) {
            default:
                return new sap.m.Image({
                    src: "img/apps-titles/tenaris.svg"
                }).addStyleClass("imgLogo").addStyleClass("noselect");
                break;
        }
    },

    getImageSyncVisible: function () {
        var sViewValue = localStorage.App;
        switch (sViewValue) {
            case "":
                return new sap.m.Image({
                    //                    densityAware: false,
                    src: "img/blue/sync.svg",
                    width: "35px",
                    press: [this.confirmRefresh, this]
                });
                break;
            default:
                break;
        }
    },

    getTitleTextVisible: function () {
        return NavigationHelper._sCurrentApp === "Launchpad";
    },

    getSettingsActionSheet: function () {
        if (!this._actionSheet) {
            var sGetOs = StoresHelper.getOs();

            if (sGetOs == "Android") {
                var sVersionApk = localStorage.getItem("vm");

            } else {
                var sVersionApk =
                    Windows.ApplicationModel.Package.current.id.version.major + '.' +
                    Windows.ApplicationModel.Package.current.id.version.minor + '.' +
                    Windows.ApplicationModel.Package.current.id.version.build;

            }

            sVersionApk = env.environment + " " + sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Version") + " " + sVersionApk;

            this._actionSheet = new sap.m.ActionSheet({
                placement: sap.m.PlacementType.Bottom,
                buttons: [
                    new sap.m.Button({
                        icon: "img/white/About.svg",
                        text: sVersionApk,
                        width: "45px",
                        iconFirst: false,
                        textDirection: sap.ui.core.TextDirection.LTR
                    }).addStyleClass('actionSheetButtons'),
                ]
            });
        }
        return this._actionSheet;
    },

    handleSettings: function (oEvent) {
        var oButton = oEvent.getSource();
        var actionSheet = this.getSettingsActionSheet();

        if (actionSheet.isOpen())
            actionSheet.close();
        else
            actionSheet.openBy(oButton);
    },


    _Clear_Combo: function () {
        localStorage.clear();
    },

    confirmRefresh: function (oEvent) {


    },

    handleRefresh: function () {
        SyncroHelper.handleRefresh(this);
    },

    getImageHomeView: function () {
        var sViewValue = NavigationHelper._sCurrentApp;
        switch (sViewValue) {
            case "Launchpad":
                return new sap.m.Image({
                    //                    densityAware: false,
                    src: "img/blue/log-off.svg",
                    width: "35px",
                    press: [this.confirmLogOut, this]
                });
                break;
            default:
                return new sap.m.Image({
                    //                    densityAware: false,
                    src: "img/home.svg",
                    width: "35px",
                    press: [this.confirmHome, this]
                });
                break;
        }
    },

    confirmHome: function () {
        try {
            localStorage.setItem("Selectkey", "");
            localStorage.setItem("idColum", "");
            var sViewValue = NavigationHelper._sCurrentApp;
            localStorage.setItem("App", "");
            NavigationHelper.setCurrentApp("Launchpad");
            NavigationHelper.back("Launchpad", true);


        } catch (e) {
            console.log("Error Home", e);
        }
    },

    confirmLogOut: function () {

        MessageBoxHelper.showConfirm(
            "Confirmation",
            "ConfirmLogOut",
            function () {
                localStorage.clear();
                app.exitApp(true);
            }, // Accept
            function () {
                BusyDialogHelper.close()
            } // Decline
        );


    }
});
