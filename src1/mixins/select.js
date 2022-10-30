

export default {
  inject: ['canvas', 'fabric', 'event'],
  data() {
    return {
      mSelectMode: '', // one | multiple
      mSelectOneType: '', // i-text | group ...
      mSelectId: '', // 选择id
      mSelectIds: [], // 选择id
      _clipboardContent: '',
      semicircle: {}
    }
  },
  created() {
    this.event.on('selectOne', (e) => {
      this.mSelectMode = 'one'
      this.mSelectId = e[0].id
      this.mSelectOneType = e[0].type
      this.mSelectIds = e.map(item => item.id)
    })

    this.event.on('selectMultiple', (e) => {
      this.mSelectMode = 'multiple'
      this.mSelectId = ''
      this.mSelectIds = e.map(item => item.id)
    })

    this.event.on('selectCancel', () => {
      this.mSelectId = ''
      this.mSelectIds = []
      this.mSelectMode = ''
      this.mSelectOneType = ''
    })
    this.createSemicircle();
  },
 
  methods: {
    /**
     * @description: 保存data数据
     * @param {Object} data 房间详情数据
     */
    _mixinSelected({ event, selected }) {
      if (selected.length === 1) {
        const selectItem = selected[0]
        this.mSelectMode = 'one'
        this.mSelectOneType = selectItem.type
        this.mSelectId = [selectItem.id]
        this.mSelectActive = [selectItem]
      } else if (selected.length > 1) {
        this.mSelectMode = 'multiple'
        this.mSelectActive = selected
        this.mSelectId = selected.map(item => item.id)
      } else {
        this._mixinCancel()
      }
    },
    /**
     * @description: 保存data数据
     * @param {Object} data 房间详情数据
     */
    _mixinCancel(data) {
      this.mSelectMode = ''
      this.mSelectId = []
      this.mSelectActive = []
      this.mSelectOneType = ''
    },
    /**
     * @description: 复制到剪切板
     * @param {String} clipboardText 复制内容
     */
    _mixinClipboard(clipboardText) {
      this.$copyText(clipboardText).then(() => {
        this.$Message.success('复制成功')
      }, () => {
        this.$Message.error('复制失败')
      })
    },
    copy() {//复制
      this.canvas.c.getActiveObject().clone((cloned) => {//获取选中元素并存储到clone
        this._clipboardContent = cloned;//复制存储
      });
    },
    paste() {
      // clone again, so you can do multiple copies.
      let canvas = this.canvas.c;
      this._clipboardContent.clone((clonedObj) => {
        canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 20,
          top: clonedObj.top + 20,
          evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function (obj) {
            canvas.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        _clipboard.top += 20;
        _clipboard.left += 20;
        canvas.setActiveObject(clonedObj);
        this._clipboardContent = '';
        // canvas.requestRenderAll();
      });
    },
    createSemicircle() {
      this.semicircle = fabric.util.createClass(fabric.Object, {
        // 初始化
        initialize(options) {
          this.callSuper('initialize', options)
          this.width = 100
          this.height = 50
        },
        // 渲染
        _render(ctx) {
          ctx.strokeStyle = this.stroke || '#333' // 初始化描边颜色
          ctx.lineWidth = this.strokeWidth || 1 // 初始化描边宽度
          ctx.fillStyle = this.fill || '#333' // 初始化填充色
          ctx.beginPath() // 开始绘制路径
          ctx.arc(0, -25, 50, 0, 180 * Math.PI / 180) // 绘制半圆  
          ctx.arc(0, -25, 50, Math.PI, Math.PI);
  
          ctx.stroke() // 描边
          ctx.fill() // 填充
        }
      })
    }
  }
}
