<template>
  <ButtonGroup size="small">
    <Button @click="big"><svg t="1650853919128" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="1271" width="14" height="14">
        <path
          d="M970.837333 919.850667l-205.696-205.653334A382.421333 382.421333 0 0 0 853.333333 469.333333a384 384 0 0 0-384-384 384 384 0 0 0-384 384 384 384 0 0 0 384 384 382.421333 382.421333 0 0 0 244.906667-88.192l205.653333 205.653334a36.053333 36.053333 0 0 0 50.986667 0 36.266667 36.266667 0 0 0-0.042667-50.944z m-380.117333-162.986667c-38.4 16.256-79.189333 24.448-121.386667 24.448a311.296 311.296 0 0 1-220.586666-91.392A311.296 311.296 0 0 1 157.312 469.333333 311.296 311.296 0 0 1 248.746667 248.746667 311.296 311.296 0 0 1 469.333333 157.354667a311.296 311.296 0 0 1 220.586667 91.392A311.296 311.296 0 0 1 781.354667 469.333333a311.296 311.296 0 0 1-91.392 220.586667 310.186667 310.186667 0 0 1-99.242667 66.901333z"
          fill="#595959" p-id="1272"></path>
        <path
          d="M652.672 431.829333h-147.84V292.010667a35.968 35.968 0 1 0-71.978667 0v139.818666H292.010667a35.968 35.968 0 1 0 0 72.021334h140.8v140.8a35.968 35.968 0 1 0 72.021333 0v-140.8h147.84a35.968 35.968 0 1 0 0-72.021334z"
          fill="#595959" p-id="1273"></path>
      </svg></Button>
    <Button @click="small"><svg t="1650853934351" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="1470" width="14" height="14">
        <path
          d="M970.837333 919.850667l-205.696-205.653334A382.421333 382.421333 0 0 0 853.333333 469.333333a384 384 0 0 0-384-384 384 384 0 0 0-384 384 384 384 0 0 0 384 384 382.421333 382.421333 0 0 0 244.906667-88.192l205.653333 205.653334a36.053333 36.053333 0 0 0 50.986667 0 36.266667 36.266667 0 0 0-0.042667-50.944z m-380.117333-162.986667c-38.4 16.256-79.189333 24.448-121.386667 24.448a311.296 311.296 0 0 1-220.586666-91.392A311.296 311.296 0 0 1 157.312 469.333333 311.296 311.296 0 0 1 248.746667 248.746667 311.296 311.296 0 0 1 469.333333 157.354667a311.296 311.296 0 0 1 220.586667 91.392A311.296 311.296 0 0 1 781.354667 469.333333a311.296 311.296 0 0 1-91.392 220.586667 310.186667 310.186667 0 0 1-99.242667 66.901333z"
          fill="#595959" p-id="1471"></path>
        <path
          d="M652.672 431.829333H292.010667a35.968 35.968 0 1 0 0 72.021334h360.661333a35.968 35.968 0 1 0 0-72.021334z"
          fill="#595959" p-id="1472"></path>
      </svg></Button>
    <Button @click="rSet">1:1</Button>
  </ButtonGroup>
</template>

<script>
import select from '@/mixins/select'
import options from '../plugin/options'

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      options,
      zoom: 0,
    };
  },
  computed: {
    unShow() {
      return (this.mSelectMode === 'one' && this.mSelectOneType === 'group')
    },
    createShow() {
      return (this.mSelectMode === 'multiple')
    },
  },
  mounted() {
    this.$nextTick(() => {
      this._drawGrid();
    })
  },
  methods: {
    rSet() {
      this.canvas.c.zoomToPoint(
        new this.fabric.Point(0, 0),
        1,
      )
      this.zoom = `${Math.round(100)}%`
    },
    big() {
      let zoomRatio = this.canvas.c.getZoom();
      zoomRatio += 0.05;
      this.canvas.c.zoomToPoint(
        new this.fabric.Point(0, 0),
        zoomRatio,
      )
      this.zoom = `${Math.round(zoomRatio * 100)}%`
      this._drawGrid();
    },
    small() {
      let zoomRatio = this.canvas.c.getZoom();
      zoomRatio -= 0.05;
      this.canvas.c.zoomToPoint(
        new this.fabric.Point(0, 0),
        zoomRatio,
      )
      this.zoom = `${Math.round(zoomRatio * 100)}%`
      this._drawGrid();
    },
    _drawGrid() {
      var currentCanvasWidth = this.canvas.c.width / this.canvas.c.getZoom();
      var currentcanvasHeight = this.canvas.c.height / this.canvas.c.getZoom();
      // 创建画布作为 网格和背景图片
      var bgCanvas = document.createElement("canvas");
      bgCanvas.width = currentCanvasWidth;
      bgCanvas.height = currentCanvasWidth;
      var context = bgCanvas.getContext("2d");
      // 网格线颜色
      context.strokeStyle = this.options.gridColor;
      context.clearRect(0, 0, currentCanvasWidth, currentcanvasHeight);
      if (!this.options.grid) {
        return;
      }
      // 背景
      if (this.canvas.c.backgroundImage && this.canvas.c.backgroundImage.getSrc() !== null) {
        bgCanvas.style.background = url(this.canvas.c.backgroundImage.getSrc())
      }

      var gridSize = this.options.gridSize * this.canvas.c.getZoom();

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
      context.stroke();
      this.drawGrid2Img(bgCanvas)
    },
    // canvas to image
    drawGrid2Img(bgCanvas) {
      var imgStr = bgCanvas.toDataURL("image/png")
      const imgEl = document.createElement('img');
      imgEl.src = imgStr;
      imgEl.onload = () => {
        this.canvas.c.setBackgroundImage(imgEl.src, this.canvas.c.renderAll.bind(this.canvas.c), {
          left: 0,
          top: 0
        });
        imgEl.remove()
        bgCanvas.remove()
      }
    }
  }
};
</script>
<style scoped lang="less">

</style>
