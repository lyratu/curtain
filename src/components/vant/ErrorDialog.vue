<template>
  <div>
    <van-dialog v-model="i_show" :show-confirm-button="false">
      <div class="error-top">
        <span class="top-text">系统错误</span>
        <van-icon name="cross" size="1rem" @click="close" />
      </div>
      <div class="error-content">
        <img class="error-img" :src="errorImg" />
        <div style="height: 1rem"></div>
        <span class="error-text">请联系管理员处理</span>
        <div style="height: 0.5rem"></div>
        <span class="error-text">TEL:{{ tel }}</span>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { Images, Globals } from "../../utils/myconfig.js";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      i_show: this.show,
      tel: Globals.tel,
      errorImg: require("../../" + Images.error),
    };
  },
  methods: {
    close() {
      this.i_show = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../utils/mystyle.less";
.van-dialog {
  width: 17.5rem;
  height: 13.625rem;
  display: flex;
  flex-direction: column;
}
.error-top {
  width: 100%;
  height: 2.625rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.9375rem 0 0.9375rem;
  border-bottom: 0.0625rem solid #dedede;
  box-sizing: border-box;
}
.error-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.error-img {
  width: 5.3125rem;
  height: 5.3125rem;
}
.top-text {
  font-size: 1rem;
}
.error-text {
  .theme-font-color;
  font-size: 1rem;
}
</style>