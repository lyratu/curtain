<template>
  <van-popup round class="bgPopup" v-model="show" position="bottom" close-on-popstate @opened="opened"
    safe-area-inset-bottom @click-close-icon="close">
    <div class="popup-title">
      <span>选择背景</span>
      <van-icon name="cross" class="close" @click="close" />
    </div>
    <div class="imgSelect">
      <van-uploader v-model="imgList" :preview-full-image="false" @click-preview="setBg" />
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'BgPopup',
  props: {
    setCurtainBg: {
      type: Function,
    },
  },
  data() {
    return {
      show: false,
      imgList: [
        { url: require('../../../assets/bg/bg2.jpeg') },
        { url: require('../../../assets/bg/bg3.jpg') },
        { url: require('../../../assets/bg/rom1.png') },
        { url: require('../../../assets/bg/rom2.png') },],
    };
  },
  methods: {
    opened() { },
    close() {
      this.show = false;
    },
    setBg(file) {
      this.setCurtainBg(file?.content || file.url);
    },
  },
};
</script>

<style lang="less" scoped>
.bgPopup {
  box-sizing: border-box;
  padding: 1rem 1.25rem;

  .popup-title {
    font-size: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f5f5f5;

    span {
      margin-right: 1.5rem;
    }

    .close {
      float: right;
      font-weight: bold;
      padding: 0.3125rem;
      margin-top: -0.3125rem;
      font-size: 0.75rem;
      color: #b0b0b2;
      border-radius: 50%;
      background: #f6f5fa;
    }
  }

  .imgSelect {
    padding: 1rem;
  }
}
</style>
