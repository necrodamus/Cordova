jQuery.sap.declare("USER.utils.InternetConnectionHelper");

InternetConnectionHelper = {

    checkConnectionOnline: function()
    {
        var networkState = navigator.connection.type;

        return networkState != Connection.NONE;
    }
};
