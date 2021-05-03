jQuery.sap.declare("USER.utils.ProxyHelper");
ProxyHelper = {
    _proxyPrefix: "proxy/http/",
    getUrl: function (sServiceUrl) {
        var sHttpPrefix = env.ctx.https ? "https" : "http";
        if ((sServiceUrl) && (sServiceUrl.length > 0) && (sServiceUrl[0] == '/')) {
            switch (window.location.hostname) {
                case "com.tenaris.loto":
                    sServiceUrl = sHttpPrefix+"://" + env.ctx.gatewayHost + ":" + env.ctx.gatewayPort + sServiceUrl;
                    break;
                case "localhost":
                    sServiceUrl = this._proxyPrefix + env.ctx.gatewayHost + ":" + env.ctx.gatewayPort + sServiceUrl;
                    sServiceUrl = sServiceUrl.replace("//", "/");
                    break;
                default:
                    sServiceUrl = sHttpPrefix+"://" + env.ctx.gatewayHost + ":" + env.ctx.gatewayPort + sServiceUrl;
            }
        }
        else {
        }
        return sServiceUrl;
    }	
};