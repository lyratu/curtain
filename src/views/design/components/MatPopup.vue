<template>
  <van-popup round class="bgPopup" v-model="show" position="bottom" close-on-popstate @opened="opened" safe-area-inset-bottom @click-close-icon="close">
    <div class="popup-title">
      <div>
        <span>添加窗帘</span>
      </div>
    </div>
    <div class="matSelect">
      <div class="title">
        <span>素材</span>
      </div>
      <div class="list" ref="scrollX">
        <van-uploader v-model="imgList" :preview-full-image="false" @click-preview="setMat" />
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: "MatPopup",
  props: {
    setMatBg: {
      type: Function,
    },
  },
  data() {
    return {
      show: false,
      imgList: [],
      // 品名
      productList: [],
      // 风格
      styletList: [],
      // 场所
      sceneList: [],
      // 窗帘列表
    };
  },
  mounted() {},
  methods: {
    close() {
      this.show = false;
    },
    add() {
      this.$router.push("/curtain");
    },
    setMat(item) {
      console.log(item);
      this.setMatBg(item);
    },
    review(item) {},
    getCurtain() {},
    /* 接口请求数据 */
    opened() {},
  },
};
</script>

<style lang="less" scoped>
.bgPopup {
  box-sizing: border-box;
  padding: 1rem 1.25rem;
  .popup-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f5f5f5;
    span {
      margin-right: 1.5rem;
    }
    .right {
      display: flex;
      align-items: center;
      .search {
        padding: 0;
        margin-right: 1.5625rem;
        .van-search__content {
          border-radius: 1.125rem;
        }
        /deep/ .van-field {
          width: 11.25rem;
          height: 2rem;
        }
        /deep/ .van-field__control {
          font-size: 0.875rem;
        }
        /deep/ .van-icon {
          font-size: 0.875rem;
        }
      }
      .close {
        vertical-align: middle;
        font-weight: bold;
        padding: 0.3125rem;
        margin-top: -0.3125rem;
        font-size: 0.75rem;
        color: #b0b0b2;
        border-radius: 50%;
        background: #f6f5fa;
      }
      .dropMenu {
        width: 6.25rem;
        /deep/ .van-dropdown-menu__bar {
          height: 0;
        }
        /deep/ .van-dropdown-menu {
          height: 1.375rem;
        }
        /deep/ .van-dropdown-menu__item {
          height: 1.375rem;
          width: 0px;
          pointer-events: all;
        }
        /deep/ .van-dropdown-menu__title {
          font-size: 1rem !important;
          line-height: 1.375rem;
        }
      }
    }
  }
  // [x] 不用上传图片了
  .matSelect {
    .title {
      display: flex;
      justify-content: space-between;
      margin: 0.625rem 0;
      color: #333333;
      font-size: 1rem;
      .switch {
        font-size: 0.625rem;
        label {
          margin-right: 0.375rem;
          vertical-align: top;
        }
      }
    }
    .list {
      display: flex;
      align-items: top;
      overflow-x: auto;
      .add {
        height: 5rem;
        width: 5rem;
        flex-shrink: 0;
        color: #b0b0b2;
        text-align: center;
        line-height: 5rem;
        font-size: 2.5rem;
        background: #f6f5fa;
        border-radius: 0.125rem;
      }
      .item {
        width: 5rem;
        display: flex;
        position: relative;

        text-align: center;
        margin: 0 0.625rem;
        flex-direction: column;
        img {
          height: 5rem;
          border-radius: 0.125rem;
        }
        span {
          font-size: 0.625rem;
          color: #b0b0b2;
        }
        .delIco {
          color: #ffda65;
          font-size: 0.75rem;
          top: 0.125rem;
          right: 0.125rem;
          position: absolute;
        }
      }
    }
  }
  .select {
    color: #333333;
    white-space: nowrap;
    padding: 0.625rem 0;
    border-bottom: 1px solid #f5f5f5;
    .title {
      vertical-align: middle;
      font-size: 1rem;
      margin-right: 1.25rem;
    }
    .item {
      margin-right: 0.75rem;
      font-weight: 400;
      font-size: 0.75rem;
      color: #b0b0af;
      border-radius: 1.5rem;
      padding: 0.25rem 0.75rem;
      background: #f5f5f5;
    }
    .selected {
      color: #8c3202 !important;
      background: #ffda65 !important;
    }
  }
}
</style>
