<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-04 00:21:58
 * @Description: 尺寸设置
-->

<template>
  <div>
    <Divider plain orientation="left">画布</Divider>
    <Form :label-width="40">
      <FormItem label="宽度" prop="name">
        <InputNumber :max="2000" :min="1" v-model="width" @on-change="setSize" size="small"></InputNumber>
      </FormItem>
      <FormItem label="高度" prop="name">
        <InputNumber :max="2000" :min="1" v-model="height" @on-change="setSize" size="small"></InputNumber>
      </FormItem>
      <FormItem label="网格" prop="grid">
        <Input type="checkBox" :value="grid" v-model="grid" @on-change="drawGrid" />
      </FormItem>
    </Form>
    <Divider plain orientation="left">预设尺寸</Divider>
    <ButtonGroup vertical>
      <Button v-for="(item, i) in presetSize" :key="i + 'presetSize'" size="small" style="text-align:left"
        @click="setSizeBy(item.width * item.scale, item.height * item.scale)">
        {{ item.label }}:{{ item.width }}x{{ item.height }}*{{ item.scale }}
      </Button>
    </ButtonGroup>
    <Divider plain orientation="left">背景网格</Divider>
  </div>
</template>

<script>
import { clone } from '@babel/types';
import { fabric } from 'fabric';
import options from '../plugin/options'

const presetConfigSize = [
  {
    label: '红书横版',
    width: 830,
    height: 545,
    scale: 1,
  },
  {
    label: '红书竖版',
    width: 900,
    height: 1200,
    scale: 0.5,
  },
  {
    label: '手机壁纸',
    width: 1080,
    height: 1920,
    scale: 0.4,
  },
]
export default {
  name: 'canvasSize',
  inject: ['canvas', 'fabric'],
  data() {
    return {
      options,
      grid: true,
      width: 830,
      height: 545,
      presetSize: [...presetConfigSize]
    };
  },
  created() {
    this.setSize()
    this.drawGrid();
  },
  mounted() {
    // this.grid = this.options.grid;
  },
  methods: {
    setSizeBy(width, height) {
      this.canvas.c.setWidth(width);
      this.canvas.c.setHeight(height);
      this.canvas.c.renderAll()
      this.width = width
      this.height = height
    },
    setSize() {
      this.canvas.c.setWidth(this.width);
      this.canvas.c.setHeight(this.height);
      this.canvas.c.renderAll()
    },
    drawGrid() {
      var imageCanvas = document.createElement("canvas");
      imageCanvas.width = this.canvas.c.width;
      imageCanvas.height = this.canvas.c.height;
      var context = imageCanvas.getContext("2d");

      if (!this.options.grid) {
        this.drawGrid2Img('');
        return;
      }
      context.globalAlpha = 0.5
      if (this.canvas.c.backgroundImage != null && this.canvas.c.backgroundImage.getSrc() !== null) {
        var bgImg = new Image();
        bgImg.src = this.canvas.c.backgroundImage.getSrc();
        context.drawImage(bgImg, 0, 0);
      }
      
      var currentCanvasWidth = this.canvas.c.width;
      var currentcanvasHeight = this.canvas.c.height;
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
      // 转化为背景图片
      const imgStr = imageCanvas.toDataURL("image/png");// target.cloneNode(true);
      this.drawGrid2Img(imgStr);
      imageCanvas.remove();
    },
    drawGrid2Img(imgStr) {
      var image = new Image();
      image.src = imgStr;
      image.onload = () => {
        // 可跨域设置
        const imgInstance = new this.fabric.Image(image, { crossOrigin: 'anonymous' });
        // 渲染背景
        this.canvas.c.setBackgroundImage(imgInstance, this.canvas.c.renderAll.bind(this.canvas.c), {
          scaleX: this.canvas.c.width / imgInstance.width,
          scaleY: this.canvas.c.width / imgInstance.width,
        });
        this.canvas.c.renderAll()
        this.canvas.c.requestRenderAll();
      }
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ivu-form-item {
  margin-bottom: 0;
}

/deep/ .ivu-divider-plain.ivu-divider-with-text-left {
  margin: 10px 0;
  font-weight: bold;
}
</style>
