import { fabric } from 'fabric';

function semicircle() {
  return fabric.util.createClass(fabric.Object, {
    // 初始化
    initialize(options) {
      this.callSuper('initialize', options)
      this.width = options.width
      this.height = options.height
    },
    // 渲染
    _render(ctx) {
      ctx.strokeStyle = this.stroke // 初始化描边颜色
      ctx.lineWidth = this.strokeWidth || 1 // 初始化描边宽度
      ctx.fillStyle = this.fill // 初始化填充色
      ctx.beginPath() // 开始绘制路径
      ctx.ellipse(0, -this.height / 2, this.width / 2, this.height, 0, 0, Math.PI) // 绘制半圆  
      ctx.stroke() // 描边
      ctx.fill() // 填充
    }
  })
}
export default semicircle;
