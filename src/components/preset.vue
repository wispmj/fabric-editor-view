<!--
 * @Author: 王衡
 * @Date: 2022-10-15 22:16:55
 * @Description: 元素绘制属性预设
-->

<template>
  <ButtonGroup size="small">
    <ColorPicker v-model="options.borderColor" @on-change="setThisColor" size="small" transfer />
    <ColorPicker v-model="options.fillColor" @on-change="setThisColor" size="small" transfer />
  </ButtonGroup>
</template>

<script>
import select from '@/mixins/select'
import options from '../plugin/options'

export default {
  name: 'PreSet',
  mixins: [select],
  data() {
    return {
      options,
      id: '',
    };
  },
  methods: {
    setBorderColor(color) {
      this.options.borderColor = color;
    },
    setFillColor() {
      this.options.fillColor = color;
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ivu-btn[disabled] {
  svg {
    opacity: 0.2;
  }
}
</style>
