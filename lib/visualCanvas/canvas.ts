import { fabric } from "fabric";
import { Alignment } from "./alignment";

  /**
   *
   */
  export class Canvas {
    private _fcanvas: fabric.Canvas;
    private _allNodes: [];

    id: string;
    name: string;
    width: number;
    height: number;
    backGroundColor;
    backGroundImage;
    traceImage;
    dragFor: string;
    isDragDrawing: boolean;
    presetFill;
    presetStroke;

    showGrid: boolean;


    private alignment:Alignment


    constructor(containerId: string) {
      this._fcanvas = new fabric.Canvas(containerId);
      this.alignment = new Alignment(this);
    }

    static createNewCanvas(containerId: string) {
      return new Canvas(containerId);
    }

    setSize(width: number, height: number) {
      this.width = width;
      this.height = height;
      this._fcanvas.setWidth(width);
      this._fcanvas.setHeight(height);
    }

    renderAll() {
      this._fcanvas.renderAll();
    }

    requestRenderAll() {
      this._fcanvas.requestRenderAll();
    }

    getActiveObjects(){
      var s = this._fcanvas.getActiveObject();
      return this._fcanvas.getActiveObjects();
    }

    getActiveObject(){
      return this._fcanvas.getActiveObject();
    }

    getfc(){
      return this._fcanvas;
    }


    setAlignment(alignment){
      this.alignment.setAlignment(alignment);
    }
  }
