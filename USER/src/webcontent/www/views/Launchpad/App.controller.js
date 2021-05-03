sap.ui.controller("USER.views.Launchpad.Apps", {
	// implement an event handler in the Controller
	onLoginTap: function () {
		try {
			var uid = this.getView().byId("uid").getValue();
			var pasw = this.getView().byId("pasw").getValue();
			sap.m.MessageToast.show("User Id: " + uid + " Password: " + pasw);
		} catch (err) {
			var message = "Ihe error is = " + err;
			console.log(message);
			MessageBoxHelper.showAlert("Error", message);
		}
	}
});
