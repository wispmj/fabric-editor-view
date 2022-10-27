import EventEmitter from 'events'
import options from '../plugin/options'
import renderCanvasImage from '../plugin/renderCanvasImage';

class EventHandle extends EventEmitter {
    options;
    isDragging = false;
    lastPosX = 0;
    lastPosY = 0;
    init(handler) {
        this.options = options
        this.handler = handler
        this.handler.on("selection:created", (e) => this._selected(e));
        this.handler.on("selection:updated", (e) => this._selected(e));
        this.handler.on("selection:cleared", (e) => this._selected(e));
        // 拖拽画布
        this.handler.on("mouse:down", (e) => this.mouseDown(e));
        this.handler.on("mouse:move", (e) => this.mouseMove(e));
        this.handler.on("mouse:up", (e) => this.mouseUp(e));
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

    mouseDown(opt) {
        var evt = opt.e;
        if (evt.altKey === true) {
            this.isDragging = true
            this.selection = false
            this.lastPosX = evt.clientX
            this.lastPosY = evt.clientY
        }
    }

    mouseMove(opt) {
        if (this.isDragging) {
            var e = opt.e;
            var vpt = this.handler.viewportTransform;
            vpt[4] += e.clientX - this.lastPosX
            vpt[5] += e.clientY - this.lastPosY
            this.handler.requestRenderAll()
            this.lastPosX = e.clientX
            this.lastPosY = e.clientY
            renderCanvasImage(this.handler, this.options, vpt[4], vpt[5])
        }
    }

    mouseUp() {
        this.handler.setViewportTransform(this.handler.viewportTransform)
        this.isDragging = false
        this.selection = true
    }
}

export default EventHandle