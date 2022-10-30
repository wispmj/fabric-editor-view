import { fabric } from "fabric";

export class ActiveNode {
  private _fActiveObject: any;

  constructor(activeObject: any) {
    this._fActiveObject = activeObject;
  }

  forEachObject(callback, context){
    this._fActiveObject.forEachObject(callback, context);
  }
}