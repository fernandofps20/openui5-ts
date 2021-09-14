import BaseController from "../BaseController";

/**
 * @namespace com.myorg.myapp.controller.fragment
 */
export default class AppController extends BaseController {
	parent: any;
	fragment: any;
	callback: any;
	i18n: any;
	onBeforeShow(parent: any, fragment: any, callback: any, data: any) {
		this.parent = parent;
		this.fragment = fragment;
		this.callback = callback;
		this.i18n = this.parent.getModel("i18n").getResourceBundle();
	}

	public onClose() {
		this.fragment.close();
	}
}