jQuery.sap.require("sap.m.NavContainer");
jQuery.sap.declare("USER.utils.NavigationHelper");

NavigationHelper = {

    _appId: "app",
    _app: null,
    //Para guardar las vistas que estan siendo utilizadas actualmente
    _actualViews: [],
    //Para guardar la aplicacion en ejecucion
    _sCurrentApp: '',
    _aAvailableApps: ['Example','Launchpad','WO','VL','PL','RL'],

    _init: function () {
        // Funciones para hacer un navigation to de izquierda a derecha.
        // Código slide de UI5 con clases modificadas. (Original: https://github.com/SAP/openui5/blob/master/src/sap.m/src/sap/m/NavContainer.js#LC1202)

        sap.m.NavContainer.autoFocus = "f";

        sap.m.NavContainer.transitions['slideReverse'] = {
            to: function (oFromPage, oToPage, fCallback) {
                oFromPage.addStyleClass("sapMNavItemCenter");

                window.setTimeout(function () {
                    oToPage.addStyleClass("sapMNavItemLeft");
                    oToPage.removeStyleClass("sapMNavItemHidden");

                    window.setTimeout(function () {
                        var bOneTransitionFinished = false;
                        var bTransitionEndPending = true;
                        var fAfterTransition = null;
                        fAfterTransition = function () {
                            jQuery(this).unbind("webkitTransitionEnd transitionend");
                            if (!bOneTransitionFinished) {
                                bOneTransitionFinished = true;
                            } else {
                                bTransitionEndPending = false;
                                oToPage.removeStyleClass("sapMNavItemSliding").removeStyleClass("sapMNavItemCenter");
                                oFromPage.removeStyleClass("sapMNavItemSliding").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemRight");

                                fCallback();
                            }
                        };

                        oFromPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
                        oToPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
                        oToPage.addStyleClass("sapMNavItemSliding").addStyleClass("sapMNavItemCenter").removeStyleClass("sapMNavItemLeft");
                        oFromPage.addStyleClass("sapMNavItemSliding").removeStyleClass("sapMNavItemCenter").addStyleClass("sapMNavItemRight");

                        window.setTimeout(function () {
                            if (bTransitionEndPending) {
                                bOneTransitionFinished = true;
                                fAfterTransition.apply(oFromPage.$().add(oToPage.$()));
                            }
                        }, 400);

                    }, 60);

                }, 0);
            },

            back: function (oFromPage, oToPage, fCallback) {
                oToPage.addStyleClass("sapMNavItemRight");
                oToPage.removeStyleClass("sapMNavItemHidden");
                oFromPage.addStyleClass("sapMNavItemCenter");

                window.setTimeout(function () {
                    var bOneTransitionFinished = false;
                    var bTransitionEndPending = true;
                    var fAfterTransition = null;
                    fAfterTransition = function () {
                        jQuery(this).unbind("webkitTransitionEnd transitionend");
                        if (!bOneTransitionFinished) {
                            bOneTransitionFinished = true;
                        } else {
                            bTransitionEndPending = false;
                            oToPage.removeStyleClass("sapMNavItemSliding").removeStyleClass("sapMNavItemCenter");
                            oFromPage.removeStyleClass("sapMNavItemSliding").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemLeft");
                            fCallback();
                        }
                    };

                    oFromPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
                    oToPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);

                    if (sap.ui.Device.browser.webkit) {
                        window.setTimeout(function () {
                            oToPage.$().css("box-shadow", "0em 1px 0em rgba(128, 128, 1280, 0.1)");
                            window.setTimeout(function () {
                                oToPage.$().css("box-shadow", "");
                            }, 50);
                        }, 0);
                    }

                    oToPage.addStyleClass("sapMNavItemSliding").addStyleClass("sapMNavItemCenter").removeStyleClass("sapMNavItemRight");
                    oFromPage.addStyleClass("sapMNavItemSliding").removeStyleClass("sapMNavItemCenter").addStyleClass("sapMNavItemLeft");

                    window.setTimeout(function () {
                        if (bTransitionEndPending) {
                            bOneTransitionFinished = true;
                            fAfterTransition.apply(oFromPage.$().add(oToPage.$()));
                        }
                    }, 400);

                }, 100);
            }
        };
    },

    _getApp: function () {
        if (!this._app)
            this._app = sap.ui.getCore().byId(this._appId);
        return this._app;
    },

    _views: [],

    _pageIsMaster: function (pageId) {
        return (pageId.match(/Master$/) != null);
    },

    _getPageName: function (pageId) {
        var pageParts = pageId.split(".");
        return pageParts[pageParts.length - 1];
    },

    _getPageInstance: function (pageId, pageName) {

        var isMaster = this._pageIsMaster(pageId);
        //verifica si ya instancio esa pagina
        var view = this._views[pageName];
        if (!view) {
            //creates view
            view = sap.ui.jsview(pageName, pageId);
            this._views[pageName] = view;
            this._getApp().addPage(view, isMaster);
        }
        return view;
    },

    /**
     * options:
     *     pageId,
     *     ? context,
     *     ? model,
     *     ? transitionName
     * */
    to: function (options) {
        try {
            var pageName = this._getPageName(options.pageId);

            //gets view
            var view = this._getPageInstance(options.pageId, pageName);

            // Seteo el active controller para poder usarlo luego desde cualquier parte de la aplicación.
            app.activeController = view.getController();

            //modelo
            if (options.model)
                view.setModel(options.model);

            //contexto
            if (options.context)
                view.setBindingContext(options.context);

            if (options.parameters) {
                for (var parameter in options.parameters) {
                    view.getController()[parameter] = options.parameters[parameter];
                }
            }

            //navigates
            this._getApp().to(pageName, options.transitionName);
        } catch(e) {
            console.log("NavigationHelper, colud not navigate to view", e);
        }
    },

    destroyPage: function (pageId) {
        try {
            var view = this._views[pageId];
        if (view !== undefined) {
            view.destroy();
            delete this._views[pageId];
            }
        } catch(e) {
            console.log("NavigationHelper, could not destroy page", e);
        }
    },

    destroyRecursiveContent: function (oElement) {
        try {
            var oElementContent = oElement.getAggregation("content");
            if (oElementContent) {
                for (var index in oElementContent) {
                    this.destroyRecursiveContent(oElementContent[index]);
                }
            }
            oElement.destroy();
        } catch (e) {
            console.log("NavigationHelper.destroyRecursiveContent", e);
        }
    },

    destroyAllViews: function () {
        //Se utiliza un timeout de 0, ya que funciona como una especie de "pausa" a la ejecución.
        //Primero termina de ejecutar el resto del código y luego esta porción de código.
        //Por esto el proceso es transparente para el usuario y no ve la pantalla celeste por un segundo.
        setTimeout(
            function () {
                for (var x in NavigationHelper._views) {
                    NavigationHelper.destroyPage(x);
                }
            },
            0
        );
    },

    back: function (pageName, destroy, navHome) {
        try {
            var currentPageId = this._getApp().getCurrentPage().getId();

            // Seteo el active controller para poder usarlo luego desde cualquier parte de la aplicación.
            var view = this._views[pageName];
            if (view)
                app.activeController = view.getController();

            this._getApp().backToPage(pageName);

            if (pageName == "RackTallyTransports")
                BusyDialogHelper.open("Loading", "LoadingRackTally");

            //Para los casos en que la navegacion vaya a la home destruyo todas las views salvo la home
            if (pageName === "Launchpad") 
                NavigationHelper.destroyAllViews();

            if (destroy)
                setTimeout(
                    function () {
promesa = new Promise(
 function(resolve, reject) {
    NavigationHelper.destroyPage(currentPageId);
    resolve("Delete");
 }
);
promesa.then(function(result) {

                                 jQuery.sap.delayedCall(300, null, function() {
                                      var checkFocus = "";
                            checkFocus = sap.ui.getCore().byId("inputSearchBox");                              
                        if ( checkFocus !== undefined ) {                           
                        sap.ui.getCore().byId("inputSearchBox").focus();  
                        }
                        })
}, function(err) {
  console.log(err); // Error: "Hubo un fallo"
}).then(
    function(value) {     
});


                        NavigationHelper.destroyPage(currentPageId);
  
                    },
                    500
                );
        } catch (e) {
            console.log("NavigationHelper, could not navigate back", e);
            BusyDialogHelper.close();
        }
    },

    setMasterDetail: function () {

    },

    /**
     * Setea la aplicación que está siendo usada en este momento.
     * Esto sirve para controlar comportamientos especiales para cada aplicación.
     * @param sCurrentApp
     */
    setCurrentApp: function (sCurrentApp) {
        if (this.checkAvailableApp(sCurrentApp))
            this._sCurrentApp = sCurrentApp;
    },

    /**
     * Devuelve true si la aplicación pasada por parámetro es válida.
     * @param sApp
     * @returns {boolean}
     */
    checkAvailableApp: function (sApp) {
        var bReturn = this._aAvailableApps.indexOf(sApp) != -1;
        if (!bReturn)
            console.log('App mal seteada');
        return bReturn;
    },

    /**
     * Devuelve true si el usuario esta en una aplicacion habilitada para búsqueda online de tubos.
     * Si la app es Pipe Relocation, devuelve true solo si esta operando SIN instrucción.
     * @returns {boolean}
     */
    currentAppEnabledForOnlineSearches: function () {
        switch (NavigationHelper._sCurrentApp) {
            case "MS":
            case "SC":
            case "RP":
            case "PM":
                return true;
            case "PR":
                var oController = sap.ui.getCore().byId("ChangeLocationMain").getController();
                return !oController._withInstruction;
                break;
            default:
                return false;
        }
    }
};

NavigationHelper._init();
