import MessageBox from "sap/m/MessageBox";
import AppComponent from "../Component";
import BaseController from "./BaseController";
import formatter from "../model/formatter";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class AppController extends BaseController {
	formatter: typeof formatter;
	public onInit() : void {
		// apply content density mode to root view
		this.getView().addStyleClass((this.getOwnerAppComponent() as AppComponent).getContentDensityClass());
	}

	public sayHello() : void {
		MessageBox.show("Hello World!");
	}
}