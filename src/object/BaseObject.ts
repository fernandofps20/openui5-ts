import Object from "sap/ui/base/Object";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.myorg.myapp.object
 */
export default class BaseObject extends Object {
    private model: JSONModel;
    constructor() {
        super();
    }

    getModel(): JSONModel {
        if (this.model === undefined) {
            this.model = new JSONModel(this, true);
            this.model.setData(this);
        }
        return this.model;
    }

    updateModel(bHardRefresh: any): void {
        if (this.model != undefined) {
            this.model.refresh(bHardRefresh ? true : false);
        }
    }

    getData(): {} {
        const req = jQuery.extend({}, this);
        delete req["model"];
        return req;
    }
}