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
}

export default EventHandle