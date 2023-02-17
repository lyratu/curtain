<template>
  <div class="error">
    <div class="error-top">
      <span class="top-text">
        <van-icon name="wap-home" size="1.125rem" @click="home" />
        <span @click="home">首页</span>
      </span>
      <span class="top-text">系统错误</span>
      <van-button square class="btn" @click="back">确定</van-button>
    </div>
    <div class="error-content">
      <img class="error-img" :src="errorImg" />
      <div style="height: 1.875rem"></div>
      <span class="error-text">请联系管理员处理</span>
      <div style="height: 0.75rem"></div>
      <span class="error-text">TEL:{{ tel }}</span>
    </div>
  </div>
</template>
<script>
import { Images, Globals } from "../utils/myconfig.js";
export default {
  data() {
    return {
      tel: Globals.tel,
      errorImg: require("../" + Images.error),
    };
  },
  methods: {
    home() {
      window.AndroidWebView.finishActivity();
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../utils/mystyle.less";
.error {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;
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
  width: 5rem;
  height: 5rem;
}
.error-text {
  .theme-font-color;
  font-size: 1rem;
}
.error-top {
  width: 100%;
  height: 2.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.9375rem 0 0.9375rem;
  border-bottom: 0.0625rem solid #dedede;
  box-sizing: border-box;
}
.top-text {
  font-size: 0.875rem;
}
.btn {
  .theme-button;
  width: 3.5rem;
  height: 1.75rem;
  padding: 0 0.5rem 0 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.125rem;
}
</style>