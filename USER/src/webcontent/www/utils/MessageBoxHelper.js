jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.declare("USER.utils.MessageBoxHelper");

MessageBoxHelper = {

    _messageBoxDialog: null,

    _close: function () {
        try {
        // Try to close
        var checkClose = this._messageBoxDialog;
        if (checkClose)
        var closeM = this._messageBoxDialog.close();
        var dialogId = "dialogFilters";
        var dialog = sap.ui.getCore().byId(dialogId);
        if (dialog)
            dialog.close();
        } catch (err) {
            console.log(err);
        }
    },

    _getTranslation: function (message) {
        var i18nModel = sap.ui.getCore().getModel("i18n");
        return i18nModel.getResourceBundle().getText(message);
    },

    showMessageToast: function (i18nMessage) {
        this._close();

        var m = this._getTranslation(i18nMessage);
        sap.m.MessageToast.show(m);
    },

    showAlert: function (i18nTitle, i18nMessage, successFunction, context, isRed) {
        this._close();

        var t = this._getTranslation(i18nTitle);
        var m = this._getTranslation(i18nMessage);

        if (successFunction === undefined) {
            successFunction = function () {
            }
        }
        if (context === undefined) {
            context = this;
        }
        
        var _dialogAlert = new sap.m.Dialog({
            type: sap.m.DialogType.Message
        }).addStyleClass("dialogCustom");


        if (isRed) {
            _dialogAlert.removeStyleClass("dialogCustom");
            _dialogAlert.addStyleClass("dialogError");
        } else {
            this.changeClassColor(_dialogAlert);
        }

        this._messageBoxDialog = _dialogAlert;
        var buText = this._getTranslation("Confirm");

        var buttonClose = new sap.m.Button({
            text: buText,
            press: function () {
                _dialogAlert.close();
                successFunction.apply(context);
                var bOx = sap.ui.getCore().byId("inputSearchBox");

                if (bOx) {
                    jQuery.sap.delayedCall(500, this, function () {
                        $(bOx).focus();
                    });
                }

                MessageBoxHelper._messageBoxDialog = null;
            },            
  
        });

          
        _dialogAlert.setTitle(t);
        _dialogAlert.attachAfterClose(function () {_dialogAlert.destroy();});
        _dialogAlert.addContent(new sap.m.Text({text: m}));
        _dialogAlert.addButton(buttonClose);
        _dialogAlert.open();

    },

	showProgress : function (i18nTitle, i18nMessage, onAccept, onDecline, context, bIsConnectionLostDialog) {
        this._close();

        var t = this._getTranslation(i18nTitle);
        var m = this._getTranslation(i18nMessage);

        if (onAccept === undefined || onAccept === null) {
            onAccept = function () {
            }
        }
        if (onDecline === undefined || onDecline === null) {
            onDecline = function () {
            }
        }
        if (context === undefined || context === null) {
            context = this;
        }

        var sDialogId = "dialogConfirm";
        var _dialogConfirm = sap.ui.getCore().byId(sDialogId);
        if (_dialogConfirm === undefined) {
            _dialogConfirm = new sap.m.Dialog({
                id: sDialogId,
                type: sap.m.DialogType.Message
            });
        } else {
            _dialogConfirm.destroyContent();
            _dialogConfirm.destroyButtons();
        }

        this.changeClassColor(_dialogConfirm);
        this._messageBoxDialog = _dialogConfirm;
   
    },
	
    showConfirm: function (i18nTitle, i18nMessage, onAccept, onDecline, context, bIsConnectionLostDialog) {
        this._close();

        var t = this._getTranslation(i18nTitle);
        var m = this._getTranslation(i18nMessage);

        if (onAccept === undefined || onAccept === null) {
            onAccept = function () {
            }
        }
        if (onDecline === undefined || onDecline === null) {
            onDecline = function () {
            }
        }
        if (context === undefined || context === null) {
            context = this;
        }
        var buOText = this._getTranslation("Confirm");

        var buttonAccept =  new sap.m.Button({
            text: buOText,
            press: function () {
                onAccept.apply(context);
                if (!bIsConnectionLostDialog) {
                    MessageBoxHelper._messageBoxDialog = null;
                    _dialogConfirm.close();
                }
            }
        }).addStyleClass("marginBL");

        var buCText = this._getTranslation("Cancel");
        var buttonDecline = new sap.m.Button({
            text: buCText,
            press: function () {
                onDecline.apply(context);
                MessageBoxHelper._messageBoxDialog = null;
                _dialogConfirm.close();
                BusyDialogHelper.close();
            }
        });

        var sDialogId = "dialogConfirm";
        var _dialogConfirm = sap.ui.getCore().byId(sDialogId);
        if (_dialogConfirm === undefined) {
            _dialogConfirm = new sap.m.Dialog({
                id: sDialogId,
                type: sap.m.DialogType.Message
            });
//            .addStyleClass("dialogCustom");
        } else {
            _dialogConfirm.destroyContent();
            _dialogConfirm.destroyButtons();
        }

        this.changeClassColor(_dialogConfirm);
        this._messageBoxDialog = _dialogConfirm;

        _dialogConfirm.setTitle(t);
        _dialogConfirm.addContent(new sap.m.Text({text: m}));
        _dialogConfirm.addButton(buttonAccept).addButton(buttonDecline);
        _dialogConfirm.open();
    },

    changeClassColor: function (_dialogConfirm) {

        _dialogConfirm.removeStyleClass("dialogCustom");
        _dialogConfirm.removeStyleClass("confirmPerform");
        _dialogConfirm.removeStyleClass("confirmVerify");
        _dialogConfirm.removeStyleClass("confirmWo");
        _dialogConfirm.removeStyleClass("confirmRemove");

        switch (NavigationHelper._sCurrentApp) {
            case "PL":
                _dialogConfirm.addStyleClass("confirmPerform");
                break;
            case "VL":
                _dialogConfirm.addStyleClass("confirmVerify");
                break;
            case "WO":
                _dialogConfirm.addStyleClass("confirmWo");
                break;
            case "RL":
                _dialogConfirm.addStyleClass("confirmRemove");
                break;
            case "Launchpad":
                _dialogConfirm.addStyleClass("dialogCustom");
                break;
        }
        return _dialogConfirm;
    },

    showDialogObject: function (i18nTitle, i18nMessage, onAccept, object, context, param) {
        this._close();

        var t = this._getTranslation(i18nTitle);
        var m = this._getTranslation(i18nMessage);

        if (onAccept === undefined) {
            onAccept = function () {
            }
        }
        if (context === undefined) {
            context = this;
        }

        var parameters = [];
        parameters.push(object);
        if (param != undefined)
            parameters.push(param);

        var buttonAccept = new sap.m.Button({
            press: function () {
                MessageBoxHelper._messageBoxDialog = null;
                //valida que no se ingresen urls ni dirrecciones de email
                if (NavigationHelper._sCurrentApp == 'RT' || NavigationHelper._sCurrentApp == 'MS')
                    if (MessageBoxHelper.validateInput(parameters)) {
                        MessageBoxHelper.showAlert("Alert", "UrlsAndEmailsNotAllowed");
                        return;
                    }

                onAccept.apply(context, [parameters]);
                _dialogConfirm.close();
            }
        }).addStyleClass("marginBL");
        var buCText = this._getTranslation("Cancel");
        var buttonDecline = new sap.m.Button({
            text: buCText,
            press: function () {
                MessageBoxHelper._messageBoxDialog = null;
                _dialogConfirm.close();
            }
        });

        var sDialogId = "dialogConfirm";
        var _dialogConfirm = sap.ui.getCore().byId(sDialogId);

        if (_dialogConfirm === undefined) {
            _dialogConfirm = new sap.m.Dialog({
                id: sDialogId,
                type: sap.m.DialogType.Message
            });
        }
        else {
            _dialogConfirm.destroyContent();
            _dialogConfirm.destroyButtons();
        }

        this.changeClassColor(_dialogConfirm);

        this._messageBoxDialog = _dialogConfirm;

        _dialogConfirm.setTitle(t);

        _dialogConfirm.addContent(new sap.m.Text({text: m})).addContent(object);
        _dialogConfirm.addButton(buttonAccept).addButton(buttonDecline);
        _dialogConfirm.open();
    },

    showError: function (i18nTitle, i18nMessage) {
        this._close();

        var t = this._getTranslation(i18nTitle);
        var m = this._getTranslation(i18nMessage);

        var sDialogId = "dialogConfirm";
        var _dialogConfirm = sap.ui.getCore().byId(sDialogId);
        if (_dialogConfirm === undefined) {
            _dialogConfirm = new sap.m.Dialog({
                id: sDialogId,
                type: sap.m.DialogType.Message
            }).addStyleClass("dialogCustom");
        }
        else {
            _dialogConfirm.destroyContent();
            _dialogConfirm.destroyButtons();
        }

        this.changeClassColor(_dialogConfirm);

        this._messageBoxDialog = _dialogConfirm;

        _dialogConfirm.setTitle(t);

        _dialogConfirm.addContent(new sap.m.Text({text: m}));
        _dialogConfirm.open();
    },

    showSelector: function (title, description, button1Title, button2Title, callback1, callback2) {
        this._close();

        var t = this._getTranslation(title);
        var m = this._getTranslation(description);

        var t1 = this._getTranslation(button1Title);
        var t2 = this._getTranslation(button2Title);

        if (callback1 === undefined) {
            callback1 = function () {
            }
        }
        if (callback2 === undefined) {
            callback2 = function () {
            }
        }

        var button1 = new sap.m.Button({
            iconDensityAware: false,
            text: t1,
            press: function () {
                callback1();
                _dialogConfirm.close();
            }
        });

        var button2 = new sap.m.Button({
            iconDensityAware: false,
            text: t2,
            press: function () {
                callback2();
                _dialogConfirm.close();
            }
        });

        var sDialogId = "dialogSelector";
        var _dialogConfirm = sap.ui.getCore().byId(sDialogId);
        if (_dialogConfirm === undefined) {
            _dialogConfirm = new sap.m.Dialog({
                id: sDialogId,
                type: sap.m.DialogType.Message
            }).addStyleClass("dialogCustom");
        }
        else {
            _dialogConfirm.destroyContent();
            _dialogConfirm.destroyButtons();
        }
        _dialogConfirm.setTitle(t);

        _dialogConfirm.addContent(new sap.m.Text({
            text: description
        }));

        _dialogConfirm.addButton(button1);
        _dialogConfirm.addButton(button2);
        _dialogConfirm.open();
    },

    showSelectorCustomText: function (i18nTitle, i18nMessage, buttonText1, buttonText2, firstFunction, secondFunction, context) {
        this._close();

        var t = this._getTranslation(i18nTitle);
        var m = this._getTranslation(i18nMessage);
        var t1 = this._getTranslation(buttonText1);
        var t2 = this._getTranslation(buttonText2);

        if (firstFunction === undefined) {
            firstFunction = function () {
            }
        }
        if (secondFunction === undefined) {
            secondFunction = function () {
            }
        }
        if (context === undefined) {
            context = this;
        }

        var _dialogAlert = new sap.m.Dialog({
            //id: sDialogId,
            type: sap.m.DialogType.Message
        }).addStyleClass("dialogCustom");

        this._messageBoxDialog = _dialogAlert;

        var button1 = new sap.m.Button({
            iconDensityAware: false,
            text: t1,
            press: function () {
                MessageBoxHelper._messageBoxDialog = null;
                _dialogAlert.close();
                firstFunction.apply(context);
            },
            afterClose: function () {
                _dialogAlert.destroy();
            }
        }).addStyleClass("marginBL");
        var button2 = new sap.m.Button({
            iconDensityAware: false,
            text: t2,
            press: function () {
                MessageBoxHelper._messageBoxDialog = null;
                _dialogAlert.close();
                secondFunction.apply(context);
            },
            afterClose: function () {
                _dialogAlert.destroy();
            }
        });

        _dialogAlert.setTitle(t);
        _dialogAlert.addContent(new sap.m.Text({text: m}));
        _dialogAlert.addButton(button1);
        _dialogAlert.addButton(button2);
        _dialogAlert.open();
    },

    validateInput: function (parameters) {
        if (parameters[0].mProperties.value && NavigationHelper._sCurrentApp == "RT") {
            str = parameters[0].mProperties.value;
            return (MessageBoxHelper.checkForEmail(str) || MessageBoxHelper.checkForUrl(str));
        }

        for (var o in parameters) {
            if (parameters[o].getMetadata().getName() == "sap.m.Input") {
                var str = parameters[o].getValue();
                return (MessageBoxHelper.checkForEmail(str) || MessageBoxHelper.checkForUrl(str));
            }
        }
    },

    checkForUrl: function (str) {
        var re = RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
        return re.test(str);
    },

    checkForEmail: function (str) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(str);
    },

    showDialogCustomContent: function (i18nTitle, oContent, oContext, fnConfirm, fnCancel, bTextButtons, i18nBtnConfirm, i18nBtnCancel, bShowBtnEdit, fnBtnEdit) {
        /**
         * bShowBtnEdit y fnBtnEdit
         * Son variables utilizadas solo para el popup de settings de impresión. Requerimiento pedido a ultimo momento.
         */


        this._close();

        var sTitle = this._getTranslation(i18nTitle);

        if (fnConfirm === undefined)
            fnConfirm = function () {
            };

        if (fnCancel === undefined)
            fnCancel = function () {
            };

        var oDialog = new sap.m.Dialog({
            type: sap.m.DialogType.Message,
            afterClose: function () {
                oDialog.destroyContent();
                oDialog.destroy();
            }
        }).addStyleClass("dialogCustom");

        this._messageBoxDialog = oDialog;

        var oBtnConfirm, oBtnCancel;
        if (bTextButtons) {
            oBtnConfirm = new sap.m.Button({
                densityAware: false,
                text: this._getTranslation(i18nBtnConfirm),
                press: function () {
                    MessageBoxHelper._messageBoxDialog = null;
                    fnConfirm.apply(oContext);
                    oDialog.close();
                }
            }).addStyleClass("marginBL");;

            oBtnCancel = new sap.m.Button({
                densityAware: false,
                text: this._getTranslation(i18nBtnCancel),
                press: function () {
                    MessageBoxHelper._messageBoxDialog = null;
                    fnCancel.apply(oContext);
                    oDialog.close();
                }
            });
            oDialog.addButton(oBtnCancel);
            oDialog.addButton(oBtnConfirm);
        } else {
            oBtnConfirm = new sap.m.Button({
                press: function () {
                    MessageBoxHelper._messageBoxDialog = null;
                    fnConfirm.apply(oContext);
                    oDialog.close();
                }
            }).addStyleClass("marginBL");;

            oBtnCancel = new sap.m.Button({
                press: function () {
                    MessageBoxHelper._messageBoxDialog = null;
                    fnCancel.apply(oContext);
                    oDialog.close();
                }
            });

            var oBtnEditPrintSettings = "";
            if (bShowBtnEdit) {
                oBtnEditPrintSettings = new sap.m.Button({
                    press: function () {
                        MessageBoxHelper._messageBoxDialog = null;
                        fnBtnEdit.apply(oContext);
                        oDialog.close();
                    }
                });
            }

            oDialog.addButton(oBtnEditPrintSettings);
            oDialog.addButton(oBtnConfirm);
            oDialog.addButton(oBtnCancel);
        }

        oDialog.setTitle(sTitle);
        oDialog.addContent(oContent);
        oDialog.open();
    }

};
