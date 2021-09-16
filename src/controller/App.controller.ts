import MessageBox from "sap/m/MessageBox";
import AppComponent from "../Component";
import BaseController from "./BaseController";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class AppController extends BaseController {
	public onInit() : void {
		// apply content density mode to root view
		this.getView().addStyleClass((this.getOwnerAppComponent() as AppComponent).getContentDensityClass());
	}

	public sayHello() : void {
		MessageBox.show("Hello World!");
	}

	public onOpenFragment() : void {
		this.openFragment(
			"Fragment",
			null,
			true,
			"this.function",
			{}
		);
	}
	public onNextView() : void {
		this.navTo("RouteNextView");
	}

	public onShowBusyIndicator(): void {
		const that = this;
		this.showBusyIndicator();
		setTimeout(function () {
            that.hideBusyIndicator();
        }, 5000);
	}
}