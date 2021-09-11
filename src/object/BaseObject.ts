import Object from "sap/ui/base/Object";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.myorg.myapp.object
 */
export default class AppController extends Object {
    constructor(data: any) {
        super();
        /*if (data) {
            for (var field in data) {
                switch (typeof (data[field])) {
                    case "object":
                        this[field] = data[field]["results"];
                        break;
                    default:
                        this[field] = data[field];
                }
            }
        }*/
    }

    /*getModel(): JSONModel {
        if (!this.model) {
            this.model = new JSONModel(this, true);
            this.model.setData(this);
        }
        return this.model;
    }*/

    /*updateModel(bHardRefresh): void {
        if (this.model) {
            this.model.refresh(bHardRefresh ? true : false);
        }
    }*/

    /*getData() {
        var req = jQuery.extend({}, this);
        delete req["model"];
        return req;
    }*/
}