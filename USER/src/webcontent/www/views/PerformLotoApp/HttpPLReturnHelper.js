jQuery.sap.declare("LOTO.views.PerformLotoApp.HttpPLReturnHelper");

HttpPLReturnHelper = {
    updateWorkOrder: function (oWorkOrder, oWorkOrderInputModel, fnSuccess, fnError) {
        this._updateWorkOrderObject(oWorkOrder, oWorkOrderInputModel);

        OfflineService.getModel().update(
            this._getEntityKey(oWorkOrder),
            oWorkOrder,
            {
                success: fnSuccess,
                error: fnError
            }
        );
    },

    _updateWorkOrderObject: function (oWorkOrder, oWorkOrderInputModel) {
        oWorkOrder["ProcessType"] = oWorkOrderInputModel.getProperty("/IsScan");
        oWorkOrder["SyncID"] = UserHelper.getUserData()['SyncID'];
        oWorkOrder["StatusCodeNew"] = this._getStatusCodeNew(oWorkOrder);
    },

    _getStatusCodeNew: function (oWorkOrder) {
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

    _getEntityKey: function (oWorkOrder) {
        //aqui va lo del storesconfing de definingrequest
        return "/WorkOrderSet(PlanningPlantID='" + oWorkOrder["PlanningPlantID"] + "',RevisionCode='" + oWorkOrder["RevisionCode"] + "',WorkOrderNum='" + oWorkOrder["WorkOrderNum"] + "')";
    }
};