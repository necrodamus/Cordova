var config = {
    getMode: function () {
        return "SMP";
    },

    getSMPContext: function () {
        return env.ctx;
    },

    getApplicationID: function() {
        return env.appID;
    },


    APPSEE_API__KEY: function() {
        return env.APPSEE_API__KEY;
    }
};