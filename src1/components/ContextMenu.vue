<!-- 右键菜单 -->
<template>
  <div class="context__x">
    <div id="menu" class="menu-x" v-show="menuVisable" :style="menuPosition" @contextmenu.prevent="" ref="menu">
      <div @click="setStraighten">摆正</div>
      <div @click="setEdit">编辑</div>
      <div @click="setBack">置底</div>
      <div @click="setFront">置顶</div>
      <div @click="copyNode">复制</div>
      <div @click="pasteNode">粘贴</div>
      <div @click="delEl">删除</div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, nextTick } from 'vue'
// import { useStore } from 'vuex'
import { fabric } from 'fabric'
import select from '@/mixins/select'
import Edit from '@/plugin/editPolygon'

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
      activeEl: null,
      drawType: ''
    };
  },
  methods: {
    async canvasOnMouseDown(opt) {
      if (this.canvas.c.isDrawingMode) {
        this.menuVisable = false;
        return;
      }
      this.menuVisable = true;
      // 右键，且在元素上右键
      // button: 1-左键；2-中键；3-右键
      // 在画布上右键，target 为 null
      if (opt.button === 3 && !this.drawType) { //&& opt.target
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
        this.hiddenMenu();
      }
    },
    copyNode() {
      this.copy();
      this.hiddenMenu();
    },
    pasteNode() {
      this.paste();
      this.hiddenMenu();
    },
    setStraighten: function () {
      this.canvas.c.getActiveObjects().forEach((ele) => {
        // this.canvas.c.straightenObject(ele)
        this.canvas.c.fxStraightenObject(ele)
        this.hiddenMenu();
      })

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
      Edit(this.canvas.c);
      this.hiddenMenu()
      return;
    }
  }
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