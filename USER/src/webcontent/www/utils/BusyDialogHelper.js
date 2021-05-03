jQuery.sap.declare("LOTO.utils.BusyDialogHelper");

BusyDialogHelper = {

    _busyDialog: null,

    _getBusyDialog: function () {
        if (!this._busyDialog)
            this._busyDialog = new sap.m.BusyDialog();
        return this._busyDialog;
    },

    _getTranslation: function(message) {
        var i18nModel = sap.ui.getCore().getModel("i18n");
        return i18nModel.getResourceBundle().getText(message);
    },

	close_bar: function(){
		var busy = sap.ui.getCore().byId("busyDialogT");
		
		if (busy && busy !== undefined) {
			busy.close();
			busy.destroy();
		}
		
	},

	open_bar: function(i18nTitle, i18nMessage) {	
        
        var m = this._getTranslation(i18nMessage);		
        var busyDialog = new sap.m.BusyDialog({
            id: "busyDialogT",			
            customIcon: "img/bartimeBig.gif",
            customIconRotationSpeed: 0,
            customIconWidth: "90%",
            customIconHeight: "90%"
        });	
        
		busyDialog.setText(m);
        busyDialog.addStyleClass("busyBar");
        busyDialog.open();
    },
		
    open: function(i18nTitle, i18nMessage) {
        var t = (i18nMessage) ? i18nTitle : this._getTranslation('Loading');
        var m = (i18nMessage) ? i18nMessage : i18nTitle;
        m = this._getTranslation(m);
        var busyDialog = this._getBusyDialog();	
        busyDialog.setTitle(t);
		busyDialog.setText(m);
        busyDialog.addStyleClass("busyDialogLoading");
        busyDialog.open();
    },

    close: function() {
        this._getBusyDialog().close();
    },

    title: function() {
        var busyDialog = this._getBusyDialog();
        return busyDialog.getTitle();
    },

    text: function() {
        var busyDialog = this._getBusyDialog();
        return busyDialog.getText();
    },

    changeText: function(i18nTitle, i18nMessage){
        var t = (i18nMessage) ? i18nTitle : this._getTranslation('Loading');
        var m = (i18nMessage) ? i18nMessage : i18nTitle;
        m = this._getTranslation(m);
        busyDialog.setTitle(t);
        busyDialog.setText(m);
    }
};