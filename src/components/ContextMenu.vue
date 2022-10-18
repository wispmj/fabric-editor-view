<!-- 右键菜单 -->
<template>
  <div class="context__x">
    <div id="menu" class="menu-x" v-show="menuVisable" :style="menuPosition" @contextmenu.prevent="" ref="menu">
      <div>什么都不做</div>
      <div @click="setEdit">编辑线条</div>
      <div @click="setBack">置底</div>
      <div @click="setFront">置顶</div>
      <div @click="delEl">删除</div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, nextTick } from 'vue'
// import { useStore } from 'vuex'
import { fabric } from 'fabric'
import select from '@/mixins/select'

// const store = useStore()

const menu = ref(null) // 画布元素
export default {
  name: 'ContextMenu',
  mixins: [select],
  data() {
    return {
      menu: null,
      menuVisable: false,
      menuPosition: '',
      activeEl: null
    };
  },
  methods: {
    async canvasOnMouseDown(opt) {
      // 右键，且在元素上右键
      // button: 1-左键；2-中键；3-右键
      // 在画布上右键，target 为 null
      if (opt.button === 3 && opt.target) {
        // 获取当前元素
        this.activeEl = opt.target

        // 显示菜单
        this.menuVisable = true

        await nextTick()
        // 设置右键菜单位置
        // 1. 获取菜单组件的宽高
        const menuWidth = this.$refs.menu.offsetWidth
        const menuHeight = this.$refs.menu.offsetHeight

        // 当前鼠标位置
        let pointX = opt.pointer.x
        let pointY = opt.pointer.y

        if (canvas.width - pointX <= menuWidth) {
          pointX -= menuWidth
        }
        if (canvas.height - pointY <= menuHeight) {
          pointY -= menuHeight
        }

        this.menuPosition = `
        left: ${pointX}px;
        top: ${pointY}px;
      `
      } else {
        this.hiddenMenu()
      }
    },

    hiddenMenu() {
      this.menuVisable = false
      this.activeEl = null
    },
    // 置底
    setBack() {
      this.canvas.c.getActiveObjects().forEach((ele) => {
        this.canvas.c.sendToBack(ele)
      })
      this.hiddenMenu();
    },
    // 置顶
    setFront() {
      this.canvas.c.getActiveObjects().forEach((ele) => {
        this.canvas.c.bringToFront(ele)
      })
      this.hiddenMenu();
    },
    // 删除
    delEl() {
      const activeObject = this.canvas.c.getActiveObjects();
      activeObject && activeObject.map(item => this.canvas.c.remove(item))
      this.canvas.c.requestRenderAll()
      this.hiddenMenu()
    },
    // 编辑线条
    setEdit() {
      var poly = this.canvas.c.getObjects()[0];
      this.canvas.c.setActiveObject(poly);
      poly.edit = !poly.edit;
      if (poly.edit) {
        var lastControl = poly.points.length - 1;
        poly.cornerStyle = 'circle';
        poly.cornerColor = 'rgba(0,0,255,0.5)';
        poly.controls = poly.points.reduce((acc, point, index) => {
          acc['p' + index] = new fabric.Control({
            positionHandler: this.polygonPositionHandler,
            actionHandler: this.anchorWrapper(index > 0 ? index - 1 : lastControl, this.actionHandler),
            actionName: 'modifyPolygon',
            pointIndex: index
          });
          return acc;
        }, {});
      } else {
        poly.cornerColor = 'blue';
        poly.cornerStyle = 'rect';
        poly.controls = fabric.Object.prototype.controls;
      }
      poly.hasBorders = !poly.edit;
      this.canvas.c.requestRenderAll();
    },
    polygonPositionHandler(dim, finalMatrix, fabricObject) {
      var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
        y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
      return fabric.util.transformPoint(
        { x: x, y: y },
        fabric.util.multiplyTransformMatrices(
          fabricObject.canvas.viewportTransform,
          fabricObject.calcTransformMatrix()
        )
      );
    },
    anchorWrapper(anchorIndex, fn) {
      return function (eventData, transform, x, y) {
        var fabricObject = transform.target,
          absolutePoint = fabric.util.transformPoint({
            x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
            y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
          }, fabricObject.calcTransformMatrix()),
          actionPerformed = fn(eventData, transform, x, y),
          newDim = fabricObject._setPositionDimensions({}),
          polygonBaseSize = this.getObjectSizeWithStroke(fabricObject),
          newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
          newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
      }
    },
    actionHandler(eventData, transform, x, y) {
      var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
        polygonBaseSize = this.getObjectSizeWithStroke(polygon),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
          x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
          y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
        };
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      return true;
    },
    getObjectSizeWithStroke(object) {
      var stroke = new fabric.Point(
        object.strokeUniform ? 1 / object.scaleX : 1,
        object.strokeUniform ? 1 / object.scaleY : 1
      ).multiply(object.strokeWidth);
      return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
    }
  },
}


// 按下鼠标
</script>

<style>
.context__x {
  /* position: relative; */
}

.menu-x {
  width: 200px;
  position: absolute;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.menu-x>div {
  box-sizing: border-box;
  padding: 4px 8px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.menu-x>div:hover {
  background-color: antiquewhite;
}

.menu-x>div:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.menu-x>div:last-child {
  border-bottom: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>