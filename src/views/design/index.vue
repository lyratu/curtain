<template>
  <div id="design">
    <div class="header">
      <!-- 左侧 -->
      <span>
        <!-- <van-icon name="wap-home" size="1.125rem" /> -->
        <!-- <span>首页</span> -->
        <span class="title">{{ name }}</span>
      </span>
      <!-- 中间 -->
      <span class="name">
        <span>
          {{ workName }}
        </span>
      </span>

      <!-- 右侧 -->
      <div class="rightBtn">
        <van-button v-if="step > 1" block class="Btn" @click="setStep">上一步</van-button>
        <van-button v-if="step < 4" block class="Btn" @click="setStep('next')">下一步</van-button>
        <!-- <van-button :loading="isSubmitting" v-else block class="Btn" @click="submit">发布</van-button> -->
      </div>
    </div>
    <div class="container">
      <!-- 侧边功能按钮 -->
      <div class="aside">
        <template v-for="(item, index) in menus">
          <div :key="index" class="menuItem" v-if="item.step == step && item.show" @click="actionFunc(item.method)">
            <img :src="item.icon" />
            <span>{{ item.name }}</span>
          </div>
        </template>
      </div>
      <!-- 窗帘视图 -->
      <div id="main" :style="{ 'background-image': `url('${curtainImg}')` }">
        <AreaDesign ref="areaDesign" v-show="areaDesignShow" :operate="setMenus" :Control="ControlShow" />
      </div>
    </div>
    <!-- 背景选择弹窗 -->
    <BgPopup ref="bgPopup" :setCurtainBg="setBg" />
    <!-- 素材选择弹窗 -->
    <MatPopup ref="matPopup" :setMatBg="setMatBg" />
  </div>
</template>

<script>
import BgPopup from "./components/bgPopup.vue";
import AreaDesign from "./components/AreaDesign.vue";
import MatPopup from "./components/MatPopup.vue";
import { Globals, Routes } from "../../utils/myconfig.js";
import { CommonApi } from "../../api/CommonApi.js";
import { base64ToFile } from "../../utils/commonTool";
// 导入截图插件
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { CurtainApi } from "@/api/CurtainApi";

export default {
  name: "Design",
  components: { BgPopup, AreaDesign, MatPopup },
  data() {
    return {
      step: 1,
      isSubmitting: false,
      workName: "窗帘预览编辑器",
      name: "背景操作页面",
      ControlShow: true,
      areaDesignShow: false,
      curtainImg: require("../../assets/bg/curtain.png"),
      menus: [
        {
          step: 1,
          name: "背景",
          method: "openBgPopup",
          icon: require("../../assets/icon/i-picture.png"),
        },
        {
          step: 2,
          name: "重新选区",
          method: "resetArea",
          icon: require("../../assets/icon/i-area.png"),
        },
        {
          step: 3,
          name: "选取遮挡物",
          method: "selMask",
          icon: require("../../assets/icon/i-area.png"),
        },
        {
          step: 3,
          name: "清空",
          method: "delPoint",
          icon: require("../../assets/icon/i-cle.png"),
        },
        {
          step: 3,
          name: "添加遮挡",
          method: "addMask",
          icon: require("../../assets/icon/i-mask.png"),
        },
        {
          step: 3,
          name: "删除遮挡",
          method: "delMask",
          icon: require("../../assets/icon/i-del.png"),
        },
        {
          step: 4,
          name: "素材",
          method: "openMatPopup",
          icon: require("../../assets/icon/i-assets.png"),
        },
        // {
        //   step: 4,
        //   name: "截图",
        //   method: "screenshot",
        //   icon: require("../../assets/icon/i-save.png"),
        // },
      ],
    };
  },
  computed: {
    getTypeName() {},
  },
  created() {
    this.initMenus();
  },
  mounted() {
    // [ ] 这里准备写编辑进入时的初始化,现在还缺少对于平面控制点的位置初始化
    this.initEditCurtain();
  },
  methods: {
    async initEditCurtain() {
      // this.curtainImg = emptyBackGround;
    },
    home() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "返回首页将不会保存当前操作\n是否仍要返回",
        })
        .then(() => {
          window.AndroidWebView.finishActivity();
        });
    },
    initMenus() {
      this.menus.forEach(e => {
        e["show"] = true;
      });
    },
    changeMenusItem(b2, b3, b4, b5) {
      console.log("changed");
      this.menus[2].show = b2;
      this.menus[3].show = b3;
      this.menus[4].show = b4;
      this.menus[5].show = b5;
    },
    //更改操作菜单
    setMenus(op) {
      switch (op) {
        case Globals.ops.selArea:
        case Globals.ops.delPoint:
        case Globals.ops.addMask:
        case Globals.ops.delMask:
        case Globals.ops.unselected:
          this.changeMenusItem(true, false, false, false);
          break;
        case Globals.ops.addPoint:
          this.changeMenusItem(false, true, false, false);
          break;
        case Globals.ops.selDown:
          this.changeMenusItem(false, true, true, false);
          break;
        case Globals.ops.selected:
          this.changeMenusItem(false, false, false, true);
          break;
        default:
          break;
      }
      this.$forceUpdate();
    },
    actionFunc(method) {
      this[method]();
    },
    /* 背景 */
    openBgPopup() {
      this.$refs.bgPopup.show = true;
    },
    /* 选区 */
    resetArea() {
      this.$refs.areaDesign.reset();
    },
    /* 遮挡 */
    selMask() {
      this.setMenus(Globals.ops.selArea);
      this.$refs.areaDesign.selMask();
    },
    delPoint() {
      this.setMenus(Globals.ops.delPoint);
      this.$refs.areaDesign.delPoint();
    },
    addMask() {
      this.setMenus(Globals.ops.addMask);
      this.$refs.areaDesign.addMask(this.curtainImg);
    },
    delMask() {
      this.setMenus(Globals.ops.delMask);
      this.$refs.areaDesign.delMask();
    },
    /* 设计 */
    openMatPopup() {
      this.$refs.matPopup.show = true;
    },
    openElePopup() {
      this.$refs.areaDesign.openElePopup();
    },
    showPrice() {
      this.$refs.areaDesign.openPricePopup();
    },
    getScreenshotImg() {
      let node = document.querySelector("#main");
      let { clientWidth: width } = node;
      let img = new Image();
      // 改变图片的src
      img.src = this.curtainImg;
      let scale = width / img.width;

      /* 苹果方案 */
      // domtoimage
      //   .toSvg(document.getElementById("main"), {
      //     height: img.height * scale,
      //     width: width,
      //   })
      //   .then((dataUrl) => {
      //     /* do something */
      //     CommonApi.uploadBase64({
      //       type: "svg",
      //       base_text: dataUrl.substring(dataUrl.indexOf(",") + 1),
      //     }).then(({ data }) => {
      //       var link = document.createElement("a");
      //       link.download = "截图.svg";
      //       link.href = data.data.fullurl;
      //       link.click();
      //       // console.log(data.data.fullurl);
      //     });
      //   });
      return new Promise((resolve, reject) => {
        /* 安卓方案 */
        domtoimage.toJpeg(document.getElementById("main"), { quality: 0.95 }).then(function (dataUrl) {
          let data = new FormData();
          data.append("file", base64ToFile(dataUrl, "jietu.jpeg"));
          CommonApi.upload(data).then(({ data }) => {
            // var link = document.createElement("a");
            // link.download = "截图.svg";
            // link.href = data.data.fullurl;
            // link.click();
            resolve(data.data.fullurl);
          });
        });
      });
    },
    // screenshot() {
    //   /* 交给安卓去下载截图 */
    //   this.getScreenshotImg().then(url => {
    //     window.AndroidWebView.saveImage(url);
    //   });
    // },
    /* 设置背景 */
    setBg(url) {
      this.curtainImg = url;
    },
    setMatBg(item) {
      this.$refs.areaDesign.setMatBg(item);
    },
    /* 设置步骤 */
    setStep(type) {
      this.setMenus(Globals.ops.selArea);
      if (type === "next") {
        this.step++;
      } else {
        if (this.step > 1) {
          this.step--;
        }
      }
      /* 设计区为默认显示 */
      this.areaDesignShow = true;
      /* 选区默认隐藏 */
      this.ControlShow = false;
      switch (this.step) {
        case 1:
          this.areaDesignShow = false;
          this.$refs.areaDesign.reset();
          return (this.name = "背景操作页面");
        case 2:
          this.ControlShow = true;
          this.$refs.areaDesign.canvas.clear();
          // 设置画布穿透
          document.querySelector(".canvas-container").style.pointerEvents = "none";
          // 设置没有进行遮挡物选区
          this.$refs.areaDesign.isSelecting = false;
          // 设置当前选区圆圈列表为空
          this.$refs.areaDesign.circleList = [];
          return (this.name = "选区操作页面");
        case 3:
          // 重置遮挡物操作区
          this.$refs.areaDesign.resetMask();
          // 清空已添加的窗户
          this.$refs.areaDesign.curtainList = [];
          this.$refs.areaDesign.showAlltMask();
          return (this.name = "遮挡物选取页面");
        case 4:
          this.$refs.areaDesign.isSelecting = false;
          // 清除未添加遮挡的选区
          this.$refs.areaDesign.clearNotMask();
          this.$refs.areaDesign.displayAlltMask();
          // 清除选区边框
          this.$refs.areaDesign.setNoneBorder();
          // 取消点击遮挡物选中事件
          this.$refs.areaDesign.canvas.off("mouse:up");
          // this.$refs.areaDesign.plane.off("touchmove");

          // 设置画布穿透
          document.querySelector(".canvas-container").style.pointerEvents = "none";
          return (this.name = "作品设计页面");
      }
    },
    /* 提交 */
    async submit() {
      let { transform, curtainList, canvas, quote_remark } = this.$refs.areaDesign;
      let countLength = 0;
      console.log("old", curtainList);
      curtainList.forEach(e => {
        if (e.material_type) e.type = 2;
        else e.type = 1;
        e.total_price = (e.ratio * e.length * e.price).toFixed(2);
        countLength += Number(e.length);
      });
      console.log("new", curtainList);
      let release_data = {
        transform,
        curtainList,
        canvas: canvas.toJSON(),
      };

      if (countLength == 0) {
        this.$toast("请输入报价");
      } else {
        if (!this.isSubmitting) {
          this.isSubmitting = true;
          let cover = await this.getScreenshotImg();
          let { data } = await CurtainApi.release({
            name: this.workName,
            cover,
            background: this.curtainImg,
            quote_remark,
            release_data,
          });
          console.log(release_data);
          this.$toast(data.msg);
          if (data.code === 1) {
            setTimeout(() => {
              window.AndroidWebView.finishActivity();
            }, 1000);
          }
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
#design {
  .container {
    display: flex;
    height: calc(100vh - 2.25rem);
  }
  .header {
    height: 2.25rem;
    padding: 0 0.9375rem;
    color: #333333;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 2.25rem;
    .title {
      margin-left: 1.0625rem;
      font-size: 0.75rem;
    }
    .name {
      left: 50%;
      font-weight: 600;
      position: absolute;
      transform: translate(-50%, 0);
      .workNameInput {
        width: 7.5rem;
        height: 1.75rem;
        background: none;
        outline: none;
        border: none;
        border-bottom: 1px solid #cecece;
        text-align: center;
      }
    }
    .rightBtn {
      height: 100%;
      float: right;
      display: flex;
      align-items: center;
      .Btn {
        padding: 0;
        margin: 0 0.25rem;
        width: 3.5rem;
        font-weight: 400;
        height: 1.75rem;
        color: #8c3202;
        position: relative;
        background: #ffda65;
        font-size: 0.875rem !important;
      }
    }
  }

  .aside {
    width: 3rem;
    padding-top: 1.5625rem;
    .menuItem {
      display: flex;
      width: 1.6rem;
      margin: 0 auto;
      margin-bottom: 1.25rem;
      color: #666666;
      font-size: 0.75rem;
      align-items: center;
      flex-direction: column;
      img {
        width: 1.25rem;
      }
    }
  }

  #main {
    height: 100%;
    width: 100%;
    padding: 0;
    overflow: hidden;
    position: relative;
    color: #333333;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    border-top: 1px solid #dedede;
    border-left: 1px solid #dedede;
  }
}
</style>
