<template>
  <ButtonGroup size="small">
    <!-- 后退 -->
    <Button @click="undo" :disabled="!list.length">
      <Icon type="ios-undo" />{{list.length}}
    </Button>
    <!-- 重做 -->
    <Button @click="redo" :disabled="!redoList.length">
      <Icon type="ios-redo" />{{redoList.length}}
    </Button>
  </ButtonGroup>
</template>

<script>
import select from '@/mixins/select'

const maxStep = 1100

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      index: 0,
      redoList: [],
      list: [],
      currentObjectStr: '',
      lastObjectStr: ''
    };
  },
  created() {
    // 有更新时记录进度
    // 绘制节点过程中 原子操作，结束才触发，（更改属性不触发）
    // mouseup触发 判断前面保存情况 修改属性不触发 错误
    // after:render 加绘制原子操作 select mixin加是否绘制变量控制 鼠标不能move状态 错误
    this.canvas.c.on({
      'object:removed': this.savemouseup,
      'object:added': this.savemouseup,
      'object:modified': this.savemouseup,
      'selection:updated': this.savemouseup,
      // 'mouse:up': this.savemouseup,
      // 'after:render': this.savemouseup,
    });
  },
  methods: {
    // 保存记录
    save() {
      const data = this.canvas.c.toJSON(['id', 'tagName'])
      if (this.list.length > maxStep) {
        this.list.shift()
      }
      this.list.push(data)
    },
    savemouseup(e) {
      var active = this.canvas.c.getActiveObject();
      if (active && (active.isMoving || active.activeOn === 'down')) {
        return;
      }
      const data = this.canvas.c.toJSON(['id', 'tagName'])
      if (this.list.length) {
        this.currentObjectStr = JSON.stringify(data);
        if (this.currentObjectStr !== this.lastObjectStr) {
          this.list.push(data)
        }
        this.lastObjectStr = this.currentObjectStr;
      } else {
        this.list.push(data)
        this.lastObjectStr = JSON.stringify(data);
      }
    },
    // 后退
    undo() {
      if (this.list.length) {
        const item = this.list.pop()
        this.redoList.push(item)
        this.renderCanvas(item)
      }
    },
    // 重做
    redo() {
      if (this.redoList.length) {
        const item = this.redoList.pop()
        this.list.push(item)
        this.renderCanvas(item)
      }
    },
    // 根据数据渲染
    renderCanvas(data) {
      this.canvas.c.clear();
      this.canvas.c.loadFromJSON(data, this.canvas.c.renderAll.bind(this.canvas.c));
      this.canvas.c.requestRenderAll();
    }
  }
};
</script>

<style scoped lang="less">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }
}
</style>