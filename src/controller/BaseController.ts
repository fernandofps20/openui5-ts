import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import AppComponent from "../Component";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class BaseController extends Controller {
    private model: JSONModel;

    constructor() {
        // it's important to call the extend method here. It creates metadata that is used in UI5 apps via
        // the method getMetadata. Hence we also assign this method to the prototype of our class.
        let fnClass = Controller.extend("com.myorg.myapp.controller.BaseController", {});
        BaseController.prototype.getMetadata = fnClass.prototype.getMetadata;

        super("com.myorg.myapp.controller.BaseController");
    }
    public onInit(): void {

    }
    public getOwnerAppComponent(): AppComponent {
        // this double cast is weired but is documented here: https://basarat.gitbooks.io/typescript/docs/types/type-assertion.html
        let comp = this.getOwnerComponent() as any as AppComponent;
        return comp;
    }

    /**
         * get the Router for this view
         *
         * @returns {*}
         * @memberof BaseController
         */
    getRouter(): any {
        return AppComponent.getRouterFor(this);
    }

    getModel(sName?: string): JSONModel {
        if(sName) {
            return <JSONModel>this.getView().getModel(sName);
        } else {
            return <JSONModel>this.getView().getModel();
        }
    }

    getResourceBundle()/*: {getText(value: string): string, setText(value: string): void} */{
        return (<ResourceModel>this.getOwnerAppComponent().getModel("i18n")).getResourceBundle();
    }

    onNavBack(): void {
        var oHistory, sPreviousHash;

        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            this.getRouter().navTo("RouteMain", {}, true /*no history*/);
        }
    }
}