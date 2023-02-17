<template>
  <div>
    <van-button class="inner-button" :icon="icon" round @click="onTap">
      {{ text }}
    </van-button>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "返回",
    },
    icon: {
      type: String,
      default: "arrow-left",
    },
    onTap: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../utils/mystyle.less";
.inner-button {
  .theme-button;
  width: 100%;
  height: 100%;
  padding: 0 0.5rem 0 0.5rem;
  font-size: .875rem;
  // .theme-no-ripple;
}
</style>