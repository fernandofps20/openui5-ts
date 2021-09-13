import BusyIndicator from "sap/ui/core/BusyIndicator";
import EventBus from "sap/ui/core/EventBus";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import AppComponent from "../Component";

let _fragments : any;

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
        return AppComponent.getRouterFor(this);
    }

    getEventBus(): EventBus {
        return this.getOwnerComponent().getEventBus();
    }

    getModel(sName?: string): JSONModel {
        if (sName) {
            return <JSONModel>this.getView().getModel(sName);
        } else {
            return <JSONModel>this.getView().getModel();
        }
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

    getResourceBundle() {
        return (<ResourceModel>this.getOwnerAppComponent().getModel("i18n")).getResourceBundle();
    }

    onNavBack(): void {
        const sPreviousHash = History.getInstance().getPreviousHash();

        if (sPreviousHash !== undefined) {
            history.go(-1);
        } else {
            this.getRouter().navTo("master", {}, true /*no history*/);
        }
    }

    showBusyIndicator(): void {
        return BusyIndicator.show();
    }

    hideBusyIndicator(): void {
        return BusyIndicator.hide();
    }

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

    /*onNavigate(oEvent) {
        //oEvent.preventDefault();
    }*/

    /*i18n(sProperty: string) {
        return this.getResourceBundle().getText(sProperty);
    }*/

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

    openFragment(sName: string, model: JSONModel, updateModelAlways: any, callback: any, data: any) {
        if (sName.indexOf(".") > 0) {
            var aViewName = sName.split(".");
            sName = sName.substr(sName.lastIndexOf(".") + 1);
        } else { //current folder
            aViewName = this.getView().getViewName().split("."); // view.login.Login
        }
        aViewName.pop();
        var sViewPath = aViewName.join("."); // view.login
        if (sViewPath.toLowerCase().indexOf("fragments") > 0) {
            sViewPath += ".";
        } else {
            sViewPath += ".fragments.";
        }
        var id: string = this.getView().getId() + "-" + sName;
        if (_fragments[id] != undefined) {
            //create controller
            var sControllerPath = sViewPath.replace("view", "controller");
            try {
                var controller = Controller.extend(sControllerPath + sName);
            } catch (ex) {
                controller = this;
            }

            // _fragments[id] = {
            //     fragment: sap.ui.xmlfragment(
            //         id,
            //         sViewPath + sName,
            //         controller
            //     ),
            //     controller: controller
            // };



            _fragments[id] = {
                fragment: Fragment.load({
                    id: id,
                    name: sViewPath + sName,
                    controller: controller
                }),
                controller: controller
            };



            if (model && !updateModelAlways) {
                _fragments[id].fragment.setModel(model);
            }

            // version >= 1.20.x
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

    /*getFragmentControlById(parent, id) {
        var latest = this.getMetadata().getName().split(".")[this.getMetadata().getName().split(".").length - 1];
        return sap.ui.getCore().byId(parent.getView().getId() + "-" + latest + "--" + id);
    }*/
}