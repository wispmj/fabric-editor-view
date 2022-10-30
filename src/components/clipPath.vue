<!--
 * @Author: 王衡
 * @Date: 2022-10-16 23:03:55
 * @Description: 路径裁剪
-->

<template>
  <ButtonGroup size="small">
    <Button v-if="mSelectMode" @click="clipPath" icon="ios-scissor" size="small"></Button>
  </ButtonGroup>
</template>

<script>
import select from '@/mixins/select'
import options from '../plugin/options'

export default {
  name: 'clipPath',
  mixins: [select],
  data() {
    return {
      options,
      id: '',
    };
  },
  methods: {
    clipPath() {
      this.options.borderColor = color;
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
