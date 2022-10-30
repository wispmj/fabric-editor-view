import { Canvas } from "./canvas";

export enum AlignmentMode {
  left,
  right,
  horizontal_center,
  top,
  bottom,
  vertical_center,
}

export class Alignment {
  private _canvas: Canvas;
  private _fcanvas: fabric.Canvas;

  constructor(canvas: Canvas) {
    this._canvas = canvas;
    this._fcanvas = canvas.getfc();
  }

  /**
   *  非多选时，禁止组合对齐操作
   **/
  getCanSetAlignment() {
    //TODO:
    // return this.mSelectMode !== 'multiple'
  }

  /**
   * 设置选择节点的对齐方式
   * @param alignment 对齐方式
   */
  setAlignment(alignment: string) {
    const activeObject = this._fcanvas.getActiveObject();
    if (activeObject && activeObject.type === "activeSelection") {
      switch (alignment) {
        case "left":
          this.leftAlign(activeObject);
          break;
        case "right":
          this.rightAlign(activeObject);
          break;
        case "horizontal-center":
          this.horizontal_center(activeObject);
          break;
        case "top":
          this.topAlign(activeObject);
          break;
        case "bottom":
          this.bottomAlign(activeObject);
          break;
        case "vertical-center":
          this.vertical_center(activeObject);
          break;
        default:
          break;
      }
    }
  }

  setAlignmentE(alignment: AlignmentMode) {
    const activeObject = this._fcanvas.getActiveObject();
    if (activeObject && activeObject.type === "activeSelection") {
      switch (alignment) {
        case AlignmentMode.left:
          this.leftAlign(activeObject);
          break;
        case AlignmentMode.right:
          this.rightAlign(activeObject);
          break;
        case AlignmentMode.horizontal_center:
          this.horizontal_center(activeObject);
          break;
        case AlignmentMode.top:
          this.topAlign(activeObject);
          break;
        case AlignmentMode.bottom:
          this.bottomAlign(activeObject);
          break;
        case AlignmentMode.vertical_center:
          this.vertical_center(activeObject);
          break;
        default:
          break;
      }
    }
  }

  // 左对齐
  leftAlign(activeObject) {
    const activeObjectLeft = -(activeObject.width / 2);
    activeObject.forEachObject((item) => {
      item.set({
        left: activeObjectLeft,
      });
      item.setCoords();
      this._fcanvas.renderAll();
    });
  }

  // 右对齐
  rightAlign(activeObject) {
    const activeObjectLeft = activeObject.width / 2;
    activeObject.forEachObject((item) => {
      item.set({
        left: activeObjectLeft - item.width * item.scaleX,
      });
      item.setCoords();
      this._fcanvas.renderAll();
    });
  }

  // 水平居中对齐
  horizontal_center(activeObject) {
    activeObject.forEachObject((item) => {
      item.set({
        left: 0 - (item.width * item.scaleX) / 2,
      });
      item.setCoords();
      this._fcanvas.renderAll();
    });
  }

  // 顶部对齐
  topAlign(activeObject) {
    const activeObjectTop = -(activeObject.height / 2);
    activeObject.forEachObject((item) => {
      item.set({
        top: activeObjectTop,
      });
      item.setCoords();
      this._fcanvas.renderAll();
    });
  }
  // 底部对齐
  bottomAlign(activeObject) {
    const activeObjectTop = activeObject.height / 2;
    activeObject.forEachObject((item) => {
      item.set({
        top: activeObjectTop - item.height * item.scaleY,
      });
      item.setCoords();
      this._fcanvas.renderAll();
    });
  }

  // 垂直居中对齐
  vertical_center(activeObject) {
    activeObject.forEachObject((item) => {
      item.set({
        top: 0 - (item.height * item.scaleY) / 2,
      });
      item.setCoords();
      this._fcanvas.renderAll();
    });
  }
}
