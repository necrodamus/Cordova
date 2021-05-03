jQuery.sap.declare("LOTO.utils.i18nTranslationHelper");

i18nTranslationHelper = {
    
    getTranslation: function(i18nMessage) {
        var i18nModel = sap.ui.getCore().byId("App").getModel("i18n");
        var translation = i18nModel.getResourceBundle().getText(i18nMessage);
        if (translation)
            return translation;
        return i18nMessage;
    }
    
};
