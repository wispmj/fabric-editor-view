<template>
  <Button v-if="mSelectMode" @click="del" icon="ios-trash" size="small"></Button>
</template>

<script>
import select from '@/mixins/select'

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
    };
  },
  methods:{
    del(){
      const activeObject = this.canvas.c.getActiveObjects();
      activeObject && activeObject.map(item => this.canvas.c.remove(item))
      this.canvas.c.requestRenderAll()
      this.canvas.c.discardActiveObject()
    },
  }
};
</script>

<style scoped lang="less">
</style>
