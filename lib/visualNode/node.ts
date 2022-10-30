import { fabric } from "fabric";

export class Node {
  private _fnode: fabric.Object;

  constructor(fobj: fabric.Object) {
    this._fnode = fobj;
  }

  set(kvMap): Node {
    this._fnode.set(kvMap);
    return this;
  }
}
