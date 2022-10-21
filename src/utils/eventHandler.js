import EventEmitter from 'events'
import options from '../plugin/options'


class EventHandle extends EventEmitter {
    options
    init(handler) {
        this.options = options
        this.handler = handler
        this.handler.on("selection:created", (e) => this._selected(e));
        this.handler.on("selection:updated", (e) => this._selected(e));
        this.handler.on("selection:cleared", (e) => this._selected(e));
        this.handler.on("after:render", (e) => this._drawGrid());
    }

    // 暴露单选多选事件
    _selected(e) {
        const actives = this.handler.getActiveObjects()
        if (actives && actives.length === 1) {
            this.emit('selectOne', actives)
        } else if (actives && actives.length > 1) {
            this.mSelectMode = 'multiple'
            this.emit('selectMultiple', actives)
        } else {
            this.emit('selectCancel')
        }
    }

    _drawGrid() {
        var context = this.handler.getContext("2d");
        context.save();
        if (!this.options.grid) {
            //this.drawGrid2Img('');
            return;
        }
        context.globalAlpha = 0.5
        // if (this.handler.backgroundImage && this.handler.backgroundImage.getSrc() !== null) {
        //     var bgImg = new Image();
        //     bgImg.src = this.handler.backgroundImage.getSrc();
        //     context.drawImage(bgImg, 0, 0);
        // }

        var currentCanvasWidth = this.handler.width;
        var currentcanvasHeight = this.handler.height;
        var gridSize = this.options.gridSize;

        // Drawing vertical lines
        var x;
        for (x = 0; x <= currentCanvasWidth; x += gridSize) {
            context.moveTo(x + 0.5, 0);
            context.lineTo(x + 0.5, currentcanvasHeight);
        }

        // Drawing horizontal lines
        var y;
        for (y = 0; y <= currentcanvasHeight; y += gridSize) {
            context.moveTo(0, y + 0.5);
            context.lineTo(currentCanvasWidth, y + 0.5);
        }
        context.strokeStyle = this.options.gridColor;
        context.stroke();
        context.restore();
    }
    drawGrid2Img(imgStr) {
        var image = new Image();
        image.src = imgStr;
        image.onload = () => {
            // 可跨域设置
            const imgInstance = new this.fabric.Image(image, { crossOrigin: 'anonymous' });
            // 渲染背景
            this.handler.setBackgroundImage(imgInstance, this.handler.renderAll.bind(this.handler), {
                scaleX: this.handler.width / imgInstance.width,
                scaleY: this.handler.width / imgInstance.width,
            });
            this.handler.renderAll()
            this.handler.requestRenderAll();
        }
    }
}


export default EventHandle