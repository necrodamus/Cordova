var appID = config.getApplicationID();

var app = {
    mode: config.getMode(),
    appId: appID,
    context: "",
    applicationContext: null,
    online: navigator.onLine,
    timerID: null,
    activeController: null,
    store: null,
    oComponent: null,
    loadingStartTime: new Date(),
    modelsLimit: 10000,
    sLanguage: sap.ui.getCore().getConfiguration().getLanguage().substr(0, 2),

    initialize: function () {
        this.bindEvents();
    },

    rfidSuccessEvent: function (data) {
        if (app.activeController != null) {
            this.activeController.handleDeviceConnect(data);
        }
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('online', app.deviceOnline, false);
        document.addEventListener('offline', app.deviceOffline, false);
        document.addEventListener("backbutton", app.onBackButton, false);
        document.addEventListener("pause", app.onPause, false);
        document.addEventListener("resume", app.onResume, false);
    },

    /***************************************** ready *******************************************/
    onDeviceReady: function () {

        AndroidFullScreen.immersiveMode();

        app.receivedEvent('deviceready');
    },

    /***************************************** back *******************************************/
    onBackButton: function () {
        NavigationHelper.back("Launchpad", true);
    },



    onSettingsOk: function () {
        NavigationHelper.back(this._backView);
    },

    receivedEvent: function (id) {
        app.login();
    },

    initWebContent: function (callback) {
        new sap.ui.core.ComponentContainer({
            component: this.oComponent
        }).placeAt("content");

        if (callback)
            callback();
    },

    /***************************************** log in  *******************************************/
    login: function () {
        var self = this;
        Fullscreen.on();
        
        app.appId = appID;


        self.oComponent = sap.ui.getCore().createComponent({
            id: "Component",
            name: "USER",
            height: "100%"
        });

        app.initApp();

    },


    getOs: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows/i.test(userAgent)) {
            return "Windows";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    },

    exitApp: function (bLogout) {
        var fnCloseApp = function () {
            // En IE localStorage.removeItem se ejecuta de forma asincronica.
            setTimeout(function () {

                var sGetOs = app.getOs();

                if (sGetOs == "Android") {
                    var success = function (status) {
                        console.log('Message: ', status);
                    }

                    var error = function (status) {
                        console.log('Error: ', status);
                    }


                    window.ClearData.cache(success, error);
                    navigator.app.exitApp();
                } else {
                    window.close();
                }
            }, 300);

        };

        var fnRemoveLocalData = function () {
            localStorage.removeItem('Person_Number');
            localStorage.removeItem('RevisionCode');
            localStorage.removeItem('UserData');
            localStorage.removeItem('App');
        };

        if (bLogout) {

            if (InternetConnectionHelper.checkConnectionOnline()) {
                sap.Logon.core.deleteRegistration(function () {
                    fnRemoveLocalData();
                    fnCloseApp();
                }, function () {
                    MessageBoxHelper.showAlert("Error", "Error trying to log out")
                });
            } else {
                fnRemoveLocalData();
                fnCloseApp();
            }



        } else
            fnCloseApp();
    },

    initApp: function () {
        var _this = this;

        var fnSuccess = function () {
            $('#loading').hide();
            localStorage.setItem("openFull", "X");

            new sap.ui.core.ComponentContainer({
                component: _this.oComponent
            }).placeAt("content");
        };

        fnSuccess();
    },

    setViewLaunchpad: function () {
        var viewApp = sap.ui.getCore().byId('app');
        var oLaunchad = sap.ui.jsview("Launchpad", "LOTO.views.Launchpad.Launchpad");
        viewApp.addPage(oLaunchad);
    },

    deviceOnline: function () {
        console.log("device online");
        app.online = true;

        cordova.getAppVersion.getVersionNumber().then(function (versionNumber) {
            localStorage.setItem("vm", versionNumber);
        });

        var imageId = app.getImageId();

        if (navigator.connection.type !== "none") {
            if (sap.ui.getCore().byId(localStorage.getItem(imageId)) !== undefined)
                sap.ui.getCore().byId(localStorage.getItem(imageId)).setSrc("img/blue/wifi.svg");
        } else {
            sap.ui.getCore().byId(localStorage.getItem(imageId)).setSrc("img/blue/wifi_no.svg");
        }
    },

    getImageId: function () {
        let nav = "Launchpad";
        switch (nav) {
            case "Launchpad":
                return "Image11";
                break;
            default:
                return "Image2";
                break;
        }
    },

    deviceOffline: function () {
        console.log("device offline");
        app.online = false;
        var sModelView = "";
        var imageId = app.getImageId();

        if (navigator.connection.type === "none" && sap.ui.getCore().byId(localStorage.getItem(imageId)) !== undefined)
            sap.ui.getCore().byId(localStorage.getItem(imageId)).setSrc("img/blue/wifi_no.svg");

    },

    onResume: function () {
        console.log("device resume");
    },

    onPause: function () {
        MessageBoxHelper._close();
        localStorage.setItem("App", "");
    },

    loadModel: function () {

        if (InternetConnectionHelper.checkConnectionOnline()) {
            return this._loadModel();
        } else {
            MessageBoxHelper.showAlert("Error", "InternetRequired", undefined, undefined, true);
            BusyDialogHelper.close();
        }

    },

    _loadModel: function () {


        var serviceUrl = "http://200.49.143.28:7099/sap/opu/odata/sap/Z_SRV_GET_USER_DATA_SRV_01/";
        sUrl = serviceUrl;
        var oHeaders = {};


        var request = {
            headers: oHeaders,
            requestUri: sUrl,
            method: "GET"
        };

        var passwordd = document.getElementById("psw").value;
        var userid = document.getElementById("usrname").value;

        request.user = userid;
        request.password = passwordd;

        OData.read(request, this._readODataOnSuccess, this._readODataOnError);
    },

    _readODataOnSuccess: function (oData) {

        app.appId = appID;


        self.oComponent = sap.ui.getCore().createComponent({
            id: "Component",
            name: "USER",
            height: "100%"
        });


        var jsonModel = new sap.ui.model.json.JSONModel();
        jsonModel.setSizeLimit(10000);
        jsonModel.setData({
            Data: oData.results
        });

        localStorage.setItem("UserData", JSON.stringify(oData.results));
        var modelUserData = new sap.ui.model.json.JSONModel(JSON.parse(localStorage.getItem('UserData')));
        sap.ui.getCore().getComponent("Component").setModel(modelUserData, "UserData");

        navigator.app.exitApp();




    },

    _readODataOnError: function (oError) {
        // Parse mensaje de error de R3

        var responseXml = oError.message;

        MessageBoxHelper.showAlert("Error", responseXml);
    }



};

app.initialize();