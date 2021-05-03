jQuery.sap.declare("LOTO.views.WorkorderApp.HttpWoReturnHelper");

HttpWoReturnHelper = {
    updateWorkOrder: function(oWorkOrder, oWorkOrderInputModel, fnSuccess, fnError) {

        var woInput = sap.ui.getCore().byId("Workorder").getModel("WorkOrderInputModel").getProperty("/WorkOrder");
        var veInput = sap.ui.getCore().byId("Workorder").getModel("WorkOrderInputModel").getProperty("/Version");
        var dataWo = sap.ui.getCore().byId("Workorder").getModel("ModifiedWorkOrdersModel");
        var addWo = true;
   

            for (var i = 0; i < dataWo.oData.length; i += 1) {
                if (dataWo.oData[i].WorkOrderNum.substr(2,12) === woInput.substr(2,12) &&
                    dataWo.oData[i].Version === veInput ) {
                    addWo = false;
                }

            }



        if (addWo === true) {
            this._updateWorkOrderObject(oWorkOrder, oWorkOrderInputModel);

            OfflineService.getModel().update(
                this._getEntityKey(oWorkOrder),
                oWorkOrder, {
                    success: fnSuccess,
                    error: fnError
                }
            );
        } else  {
            sap.ui.getCore().byId("Workorder").getModel("WorkOrderInputModel").setProperty("/WorkOrder","");
            sap.ui.getCore().byId("Workorder").getModel("WorkOrderInputModel").setProperty("/Version","");
        }
    },

    _updateWorkOrderObject: function(oWorkOrder, oWorkOrderInputModel) {

        var dUpdateProcesDate = new Date();
        dUpdateProcesDate = new Date(dUpdateProcesDate.getTime() - (dUpdateProcesDate.getTimezoneOffset() * 60000)).toISOString();
        var newTime = "PT" + dUpdateProcesDate.substr(11, 2) + "H" + dUpdateProcesDate.substr(14, 2) + "M" + dUpdateProcesDate.substr(17, 2) + "S";
        var iScan = sap.ui.getCore().byId("Workorder").getModel("WorkOrderInputModel").getProperty("/IsScan");

        if (iScan === "X") {
            oWorkOrder["ProcessType"] = "S";
        } else {
            oWorkOrder["ProcessType"] = "W";
        }
        oWorkOrder["SyncID"] = UserHelper.getUserData()['SyncID'];
        oWorkOrder["StatusCodeNew"] = this._getStatusCodeNew(oWorkOrder);
        oWorkOrder["OpDate"] = dUpdateProcesDate.substr(0, 19);
        oWorkOrder["OpTime"] = newTime;
        var timeZone = this.getTimeZone();
        oWorkOrder["OpTzone"] = timeZone;
    },

    getTimeZone: function() {

        var dUpdateProcesDateT = new Date();
        var timeZoneCalc = dUpdateProcesDateT.getTimezoneOffset();
        var numberE = Math.trunc(timeZoneCalc / 60);
        var numberD = Math.round((timeZoneCalc / 60 - parseInt(timeZoneCalc / 60)) * 10);
        if (numberD > 0) {
            numberD = "3";
        } else {
            numberD = "";
        }
        var sdUpdateProcesDateT = dUpdateProcesDateT.toString().indexOf("-");
        var timeZoneFormat = "";
        if (numberE.length > 2) {
            if (sdUpdateProcesDateT > 0) {
                timeZoneFormat = 'UT' + "-" + numberE;
            } else {
                timeZoneFormat = 'UTC' + numberE;
            }
        } else {
            if (sdUpdateProcesDateT > 0) {
                timeZoneFormat = 'UTC' + "-" + numberE + numberD;
            } else {
                timeZoneFormat = 'UTC' + numberE + numberD;
            }
        }

        return timeZoneFormat;
    },

    _getStatusCodeNew: function(oWorkOrder) {
        switch (oWorkOrder["StatusCode"]) {
            case "O4":
                return "O5";
            case "O4X":
                return "O5X";
            case "O4Y":
                return "O5Y";
            default:
                return oWorkOrder["StatusCodeNew"];
        }
    },

    _getEntityKey: function(oWorkOrder) {
        return "/WorkOrderSet(PlanningPlantID='" + oWorkOrder["PlanningPlantID"] + "',RevisionCode='" + oWorkOrder["RevisionCode"] + "',WorkOrderNum='" + oWorkOrder["WorkOrderNum"] + "')";
    }
};