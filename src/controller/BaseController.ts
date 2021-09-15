import ResourceBundle from "sap/base/i18n/ResourceBundle";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import EventBus from "sap/ui/core/EventBus";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import AppComponent from "../Component";
import formatter from "../model/formatter";

let _fragments : any = [];

/**
 * @namespace com.myorg.myapp.controller
 */
export default class BaseController extends Controller {
    constructor() {
        // it's important to call the extend method here. It creates metadata that is used in UI5 apps via
        // the method getMetadata. Hence we also assign this method to the prototype of our class.
        const fnClass = Controller.extend("com.myorg.myapp.controller.BaseController", {});
        BaseController.prototype.getMetadata = fnClass.prototype.getMetadata;

        super("com.myorg.myapp.controller.BaseController");
    }

    formatter(): typeof formatter { 
        return formatter;
    }
    
    public onInit(): void { }

    public getOwnerAppComponent(): AppComponent {
        // this double cast is weired but is documented here: https://basarat.gitbooks.io/typescript/docs/types/type-assertion.html
        const comp = this.getOwnerComponent() as any as AppComponent;
        return comp;
    }

    /**
    * get the Router for this view
    *
    * @returns {*}
    * @memberof BaseController
    */
    getRouter(): any {
        return this.getOwnerAppComponent().getRouter();
    }

    /**
    * Method for navigation to specific view
    * @public
    * @param {string} psTarget Parameter containing the string for the target navigation
    * @param {Object.<string, string>} pmParameters? Parameters for navigation
    * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
    */
    navTo(psTarget: any, pmParameters?: any, pbReplace?: any) {
        this.getRouter().navTo(psTarget, pmParameters, pbReplace);
    }

    getEventBus(): EventBus {
        return this.getOwnerAppComponent().getEventBus();
    }

    getModel(sName?: string): JSONModel {
        return <JSONModel>this.getView().getModel(sName);
    }

    /**
     * Convenience method for setting the view model in every controller of the application.
     * @public
     * @param {sap.ui.model.Model} oModel the model instance
     * @param {string} sName the model name
     * @returns {sap.ui.mvc.View} the view instance
     */
    setModel(oModel: JSONModel, sName: string): View {
        return this.getView().setModel(oModel, sName);
    }

    async getResourceBundle(): Promise<ResourceBundle> {
        return await (<ResourceModel>this.getOwnerAppComponent().getModel("i18n")).getResourceBundle();
    }

    async i18n(sProperty: string) {
        return (await this.getResourceBundle()).getText(sProperty);
    }

    onNavBack(): void {
        const sPreviousHash = History.getInstance().getPreviousHash();

        if (sPreviousHash !== undefined) {
            window.history.back();
        } else {
            this.getRouter().navTo("RouteApp", {}, true /*no history*/);
        }
    }

    showBusyIndicator(): void {
        return BusyIndicator.show();
    }

    hideBusyIndicator(): void {
        return BusyIndicator.hide();
    }

    onNavigate(oEvent: Event) {
        //oEvent.preventDefault();
    }

    async openFragment(sName: string, model: JSONModel, updateModelAlways: boolean, callback: any, data: {}) {
        if (sName.indexOf(".") > 0) {
            var aViewName = sName.split(".");
            sName = sName.substr(sName.lastIndexOf(".") + 1);
        } else {
            aViewName = this.getView().getViewName().split(".");
        }
        aViewName.pop();
        var sViewPath = aViewName.join(".");
        if (sViewPath.toLowerCase().indexOf("fragment") > 0) {
            sViewPath += ".";
        } else {
            sViewPath += ".fragment.";
        }
        var id = this.getView().getId() + "-" + sName;
        if (!_fragments[id]) {
            //create controller
            var sControllerPath = sViewPath.replace("view", "controller");
            let controller: Controller;
            try {
                controller = await Controller.create({
                    name:sControllerPath + sName
                });
            } catch (ex) {
                controller = this;
            }
            _fragments[id] = {
                fragment: await Fragment.load({
                    id: id,
                    name: sViewPath + sName,
                    controller: controller
                }),
                controller: controller
            };
            if (model && !updateModelAlways) {
                _fragments[id].fragment.setModel(model);
            }
            this.getView().addDependent(_fragments[id].fragment);
        }
        var fragment = _fragments[id].fragment;
        if (model && updateModelAlways) {
            fragment.setModel(model);
        }
        if (_fragments[id].controller && _fragments[id].controller !== this) {
            _fragments[id].controller.onBeforeShow(this, fragment, callback, data);
        }
        setTimeout(function () {
            fragment.open();
        }, 100);
    }

    closeFragments() {
        for (var f in _fragments) {
            if (_fragments[f]["fragment"] && _fragments[f].fragment["isOpen"] && _fragments[f].fragment.isOpen()) {
                _fragments[f].fragment.close();
            }
        }
    }

    /*fnMetadataLoadingFailed() {
        var dialog = new Dialog({
            title: 'Error',
            type: 'Message',
            state: 'Error',
            content: new Text({
                text: 'Metadata loading failed. Please refresh you page.'
            }),
            beginButton: new Button({
                text: 'OK',
                press: function () {
                    dialog.close();
                }
            }),
            afterClose: function () {
                dialog.destroy();
            }
        });

        dialog.open();
    }*/

    /*updateModel: function (oModel, data, change) {
        if (change == "added") {
            oModel.getData().push(data);
        } else if (change == "modified") {
            var index = oModel.getData().map(function (data) {
                return data.id;
            }).indexOf(data.id);
            oModel.getData()[index] = data;
        } else if (change == "removed") {
            var index = oModel.getData().map(function (data) {
                return data.id;
            }).indexOf(data.id);
            oModel.getData().splice(index, 1);
        }
        oModel.refresh(true);
    }*/

    /*getFragmentControlById(parent, id) {
        var latest = this.getMetadata().getName().split(".")[this.getMetadata().getName().split(".").length - 1];
        return sap.ui.getCore().byId(parent.getView().getId() + "-" + latest + "--" + id);
    }*/
}