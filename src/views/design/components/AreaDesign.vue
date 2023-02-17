<template>
  <div>
    <div class="container">
      <!-- 控制对象 -->
      <div ref="plane" id="plane">
        <template v-for="(item, index) in curtainList">
          <template v-if="!item.isEle">
            <img
              v-dragX="0"
              :key="index + 'left'"
              class="doubleImgLeft"
              :src="$baseURL + item.first_resource_image"
              v-if="item.material_type == 1"
            />
            <img
              v-dragX="1"
              :key="index + 'Right'"
              class="doubleImgRight"
              :src="$baseURL + item.second_resource_image"
              v-if="item.material_type == 1"
            />
            <img
              :key="index"
              v-dragY="1"
              class="imgToHalfBottom"
              :src="$baseURL + item.first_resource_image"
              v-else-if="item.material_type == 2"
            />
            <img
              :key="index"
              v-dragY="0"
              class="imgToBottom"
              :src="$baseURL + item.first_resource_image"
              v-else-if="item.material_type == 3"
            />
            <img
              :key="index"
              class="fullImg"
              :src="$baseURL + item.first_resource_image"
              v-else-if="item.material_type == 4"
            />
          </template>
        </template>
      </div>
      <!-- 控制点 -->
      <span v-show="Control">
        <div class="tr"></div>
        <div class="tr"></div>
        <div class="tr"></div>
        <div class="tr"></div>
      </span>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { Globals } from "../../../utils/myconfig.js";
export default {
  name: "AreaDesign",
  props: {
    operate: {
      type: Function,
      default: null,
    },
    Control: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      maskId: 0,
      plane: null,
      canvas: null,
      /* 响应式比例 */
      fontScale: null,
      transform: null,
      /* 当前选区圆圈列表 */
      circleList: [],
      /* 遮挡物选区中 */
      isSelecting: false,
      /* 当前选中的遮挡物 */
      currentMask: null,
      /* 已添加窗帘列表 */
      curtainList: [],
      /* 备注 */
      quote_remark: "",
    };
  },
  // 自定义指令
  directives: {
    dragX: {
      // 指令的定义
      inserted(el, binding) {
        let value = binding.value;
        let parentWidth = el.parentNode.offsetWidth;
        let firstPoint = { x: null, y: null };
        /* 上一次的宽度、上一次的left */
        let preWidth = null,
          preLeft = null;
        el.addEventListener("touchstart", (e) => {
          let { clientX: x, clientY: y } = e.targetTouches[0];
          firstPoint = { x, y };
          preWidth = el.width;
          preLeft = el.offsetLeft;
        });
        el.addEventListener("touchmove", (e) => {
          // 阻止页面默认滚动
          e.preventDefault();
          let { clientX: x } = e.targetTouches[0];
          let offsetX = value == 0 ? firstPoint.x - x : -firstPoint.x + x;
          if (preWidth - offsetX < parentWidth / 2 && preWidth - offsetX > 10) {
            el.style.left = value == 0 ? "" : offsetX + preLeft + "px";
            el.style.width = preWidth - offsetX + "px";
          }
        });
      },
    },
    dragY: {
      inserted(el, binding) {
        let value = binding.value;
        let parentHeight =
          value == 0
            ? el.parentNode.offsetHeight
            : el.parentNode.offsetHeight / 2;
        let firstPoint = { x: null, y: null };
        /* 上一次的高度 */
        let preHeight = null;
        el.addEventListener("touchstart", (e) => {
          let { clientX: x, clientY: y } = e.targetTouches[0];
          firstPoint = { x, y };
          preHeight = el.height;
        });
        el.addEventListener("touchmove", (e) => {
          // 阻止页面默认滚动
          e.preventDefault();
          let { clientY: y } = e.targetTouches[0];
          let offsetY = firstPoint.y - y;
          if (preHeight - offsetY < parentHeight && preHeight - offsetY > 10) {
            el.style.height = preHeight - offsetY + "px";
          }
        });
      },
    },
  },
  mounted() {
    this.plane = this.$refs.plane;
    this.initArea();
    this.initFabric();
  },
  /* [ ]
    左右：布帘、窗纱  ---能左右拉伸，区域为中间
    上半：帘头    ---能上下拉伸，区域为高度的一半
    整体可上下拉伸：柔纱帘  --- 能上下拉伸，区域为整个高度
    整体不可拉伸：百叶窗
  */
  methods: {
    /* 设置窗帘图片 */
    setMatBg(item) {
      item.length = 0;
      this.curtainList.push(item);
      this.$toast("添加成功！");
    },
    /* 清空窗帘图片 */
    clearMatBg() {
      let content = this.plane;
      while (content.hasChildNodes()) {
        content.removeChild(content.firstChild);
      }
    },
    /* 重置遮挡物操作区 */
    resetMask() {
      let plane = this.plane;
      plane.style.border = "1px dashed #07c160";
      plane.style.backgroundImage = "";
      /* fabric画布可以点击 */
      document.querySelector(".canvas-container").style.pointerEvents = "auto";
      this.canvas.off("mouse:down");
      this.clearSelectMask();
      this.clearMatBg();
      this.openMaskSelect();
    },
    /* 设置选区以及遮挡选区边框透明 */
    setNoneBorder() {
      this.plane.style.border = "none";
      this.canvas.getObjects().forEach((e) => {
        if (e.type.substring(0, 5) == "tmask") {
          e.set("stroke", "");
        }
      });
      this.canvas.renderAll();
    },
    /* 添加遮挡 */
    addMask(url) {
      /* 添加完遮挡启动选择高亮 */
      this.openMaskSelect();
      this.isSelecting = false;
      this.maskId++;
      let points = [];
      if (this.circleList.length > 0) {
        this.circleList.forEach((element) => {
          if (!element.stroke) {
            points.push({ x: element.left, y: element.top });
          }
        });
        let { offsetHeight: height, offsetWidth: width } =
          document.querySelector("#main");
        // points = [{ x: width, y: 0 }, { x: 0, y: 0 }, { x: 0, y: height }, { x: width, y: height }]
        let polygon = new fabric.Polygon(points, {
          objectCaching: false,
          selectable: false,
          // stroke: "#1482f9",
          strokeDashArray: [5, 5],
          strokeWidth: 1,
          type: "mask" + this.maskId,
        });
        let t_polygon = new fabric.Polygon(points, {
          objectCaching: false,
          selectable: false,
          stroke: "#1482f9",
          strokeDashArray: [5, 5],
          strokeWidth: 1,
          type: "tmask" + this.maskId,
        });
        fabric.util.loadImage(
          url,
          (img) => {
            let w = height / img.height,
              h = width / img.width;
            let scale = w > h ? h : w;
            // [x]偏移量响应式有差距--已解决
            let pLeft =
                w > h
                  ? -polygon.left - 1
                  : -polygon.left + (width - img.width * scale) / 2 - 1,
              pTop =
                w > h
                  ? -polygon.top + (height - img.height * scale) / 2 - 1
                  : -polygon.top - 1;
            console.log(pLeft, pTop, height);
            const pattern = new fabric.Pattern({
              source: img,
              patternTransform: [scale, 0, 0, scale, pLeft, pTop],
              repeat: "no-repeat",
            });
            polygon.set("fill", pattern);
            t_polygon.set("fill", "rgba(0, 0, 0, 0.5)");
            this.canvas.add(polygon);
            this.canvas.add(t_polygon);
            this.clearNotMask();
          },
          this,
          {
            crossOrigin: "anonymous",
          }
        );
      }
      this.circleList = [];
    },
    /* 删除遮挡物 */
    delMask() {
      this.canvas.getObjects().forEach((e) => {
        if (
          e.type.substring(0, 4) == "mask" &&
          e.type.substring(4) == this.currentMask.type.substring(5)
        ) {
          this.canvas.remove(e);
          this.canvas.remove(this.currentMask);
        }
      });
    },
    /* 清除遮挡物选择状态 */
    clearSelectMask() {
      this.canvas.getObjects().forEach((e) => {
        if (e.type.substring(0, 5) == "tmask") {
          e.set("stroke", "#1482f9");
        }
      });
      this.canvas.renderAll();
    },
    /* 启动遮挡物选择 */
    openMaskSelect() {
      // 鼠标抬起
      this.canvas.on("mouse:up", (e) => {
        var p = e.target;
        if (p && p.type.substring(0, 5) == "tmask") {
          this.clearSelectMask();
          this.currentMask = p;
          p.set("stroke", "#ffda65");
          this.operate(Globals.ops.selected);
        } else if (p == null) {
          this.currentMask ? this.currentMask.set("stroke", "#1482f9") : "";
          this.currentMask = null;
          this.operate(Globals.ops.unselected);
        }
        this.canvas.renderAll();
      });
    },
    /* 删除非遮挡物多边形的元素 */
    clearNotMask() {
      let arr = this.canvas.getObjects().filter((e) => {
        return (
          e.type.substring(0, 4) != "mask" && e.type.substring(0, 5) != "tmask"
        );
      });
      this.canvas.remove(...arr);
    },
    //显示tmask
    showAlltMask() {
      this.canvas.getObjects().forEach((e) => {
        if (e.type.substring(0, 5) == "tmask") {
          e.set("fill", "rgba(0, 0, 0, 0.5)");
        }
      });
      this.canvas.renderAll();
    },
    //不显示tmask
    displayAlltMask() {
      this.canvas.getObjects().forEach((e) => {
        if (e.type.substring(0, 5) == "tmask") {
          e.set("fill", "rgba(0, 0, 0, 0)");
        }
      });
    },
    // fabric画圆
    makeCircle(left, top, line1, line2) {
      var c = new fabric.Circle({
        left: left,
        top: top,
        originX: "center",
        originY: "center",
        radius: 6 * this.fontScale,
        fill: "rgba(255, 0, 0, 0.5)", //"rgba(0,170,255,0.3)",
      });
      c.hasControls = c.hasBorders = false;
      c.line1 = line1;
      c.line2 = line2;
      return c;
    },

    // fabric画线
    makeLine(coords) {
      return new fabric.Line(coords, {
        stroke: "#FF0000", //"#1482f9",
        strokeDashArray: [5, 5],
        strokeWidth: 1 * this.fontScale,
        selectable: false,
        evented: false,
      });
    },
    /* 删除选择遮挡点 */
    delPoint() {
      this.circleList = [];
      this.isSelecting = false;
      this.canvas.off("mouse:down");
      this.clearNotMask();
      this.openMaskSelect();
    },
    /* 开始选择遮挡区 */
    selMask() {
      if (!this.isSelecting) {
        /* 开始选区时不能点击高亮其他区 及清除高亮状态 */
        this.canvas.off("mouse:up");
        this.clearSelectMask();
        this.isSelecting = true;
        // 上一个圆圈
        let preCircle = null;
        // 第一个圆圈
        let firstCircle = null;
        // 圆圈列表
        let circleList = [];
        // 鼠标按下
        this.canvas.on("mouse:down", (e) => {
          let { target, pointer } = e;
          if (!target) {
            let line1 = null,
              line2 = null;
            if (firstCircle) {
              line1 = this.makeLine([
                preCircle.left,
                preCircle.top,
                pointer.x,
                pointer.y,
              ]);
              this.canvas.add(line1);
              preCircle.line2 = line1;
              preCircle = this.makeCircle(pointer.x, pointer.y, line1, line2);
            } else {
              preCircle = this.makeCircle(pointer.x, pointer.y, line1, line2);
              firstCircle = preCircle;
              this.operate(Globals.ops.addPoint);
            }
            this.canvas.add(preCircle);
            circleList.push(preCircle);
          } else {
            if (circleList.length > 2 && target == firstCircle) {
              circleList.forEach((e) => {
                e.line1 && e.line1.set({ stroke: "#07c160" });
                e.line2 && e.line2.set({ stroke: "#07c160" });
                e.set({
                  fill: "rgba( 7, 193, 96, 0.5)",
                });
              });
              let line1 = this.makeLine([
                preCircle.left,
                preCircle.top,
                pointer.x,
                pointer.y,
              ]);
              line1.set({ stroke: "#07c160" });
              this.canvas.add(line1);
              preCircle.line2 = line1;
              firstCircle.line1 = line1;
              this.canvas.off("mouse:down");
              this.circleList = circleList;
              this.operate(Globals.ops.selDown);
            }
          }
        });

        // 物体移动
        this.canvas.on("object:moving", (e) => {
          var p = e.target;
          p.line1 && p.line1.set({ x2: p.left, y2: p.top });
          p.line2 && p.line2.set({ x1: p.left, y1: p.top });
          this.canvas.renderAll();
        });
        // 提示用户操作
        this.$toast({ message: "请点击中间区域选区", position: "top" });
      }
    },

    /* 重置选区 */
    reset() {
      this.fontScale =
        document.documentElement.style.fontSize.split("px")[0] / 16;
      this.transform["topLeft"] = { x: 0, y: 0 };
      this.transform["topRight"] = { x: 200 * this.fontScale, y: 0 };
      this.transform["bottomLeft"] = { x: 0, y: 200 * this.fontScale };
      this.transform["bottomRight"] = {
        x: 200 * this.fontScale,
        y: 200 * this.fontScale,
      };
      this.transform.update();

      // 初始化4个控制点
      let data = [];
      for (let i = 0; i < 4; i++) {
        data.push({ X: 0, Y: 0 });
      }
      data[0].X = this.transform.topLeft.x;
      data[0].Y = this.transform.topLeft.y;
      data[1].X = this.transform.topRight.x;
      data[1].Y = this.transform.topRight.y;
      data[2].X = this.transform.bottomLeft.x;
      data[2].Y = this.transform.bottomLeft.y;
      data[3].X = this.transform.bottomRight.x;
      data[3].Y = this.transform.bottomRight.y;
      let tr = document.querySelectorAll(".tr");
      tr.forEach((e, index) => {
        // 初始化位置
        e.style.left = data[index].X - 18 * this.fontScale + "px";
        e.style.top = data[index].Y - 18 * this.fontScale + "px";
      });
    },

    /* 初始化fabric */
    initFabric() {
      let { offsetHeight: height, offsetWidth: width } =
        document.querySelector("#main");
      this.canvas = new fabric.Canvas("canvas", {
        width,
        height,
        selection: false,
      });
      //
      document.querySelector(".canvas-container").style.pointerEvents = "none";
    },
    /* 初始化选区 */
    initArea(transform) {
      this.fontScale =
        document.documentElement.style.fontSize.split("px")[0] / 16;
      var IMG_WIDTH = 200 * this.fontScale;
      var IMG_HEIGHT = 200 * this.fontScale;
      const plane = this.plane;
      if (!transform) {
        this.transform = new PerspectiveTransform(
          plane,
          IMG_WIDTH,
          IMG_HEIGHT,
          false
        );
      } else {
        this.transform = transform;
      }
      // 初始化4个控制点
      let data = [];
      for (let i = 0; i < 4; i++) {
        data.push({ X: 0, Y: 0 });
      }
      data[0].X = this.transform.topLeft.x;
      data[0].Y = this.transform.topLeft.y;
      data[1].X = this.transform.topRight.x;
      data[1].Y = this.transform.topRight.y;
      data[2].X = this.transform.bottomLeft.x;
      data[2].Y = this.transform.bottomLeft.y;
      data[3].X = this.transform.bottomRight.x;
      data[3].Y = this.transform.bottomRight.y;

      let tr = document.querySelectorAll(".tr");
      tr.forEach((e, index) => {
        // 初始化位置
        e.style.left = data[index].X - 18 * this.fontScale + "px";
        e.style.top = data[index].Y - 18 * this.fontScale + "px";

        e.addEventListener("touchstart", function (event) {
          let ev = event.targetTouches[0];
          data[index].X = ev.clientX - e.offsetLeft;
          data[index].Y = ev.clientY - e.offsetTop;
        });

        e.addEventListener("touchmove", (event) => {
          // 阻止默认触碰移动事件
          event.preventDefault();
          let evx = event.targetTouches[0].clientX;
          let evy = event.targetTouches[0].clientY;
          let _w = window.screen.width;
          let _h = window.screen.height;
          if (evx > _w - 10 * this.fontScale) evx = _w - 10 * this.fontScale;
          if (evx < 54 * this.fontScale) evx = 54 * this.fontScale;
          if (evy > _h - 10 * this.fontScale) evy = _h - 10 * this.fontScale;
          if (evy < 46 * this.fontScale) evy = 46 * this.fontScale;
          var l = evx - data[index].X;
          var t = evy - data[index].Y;
          e.style.left = l + "px";
          e.style.top = t + "px";
          switch (index) {
            case 0:
              this.transform.topLeft.x = l + 18 * this.fontScale;
              this.transform.topLeft.y = t + 18 * this.fontScale;
              break;
            case 1:
              this.transform.topRight.x = l + 18 * this.fontScale;
              this.transform.topRight.y = t + 18 * this.fontScale;
              break;
            case 2:
              this.transform.bottomLeft.x = l + 18 * this.fontScale;
              this.transform.bottomLeft.y = t + 18 * this.fontScale;
              break;
            case 3:
              this.transform.bottomRight.x = l + 18 * this.fontScale;
              this.transform.bottomRight.y = t + 18 * this.fontScale;
          }

          this.transform.update();
        });
        e.addEventListener("touchend", () => {
          // console.log(transform);
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
#canvas {
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  position: absolute;
}
.container {
  left: 50%;
  top: 50%;
  // pointer-events: painted;
  width: 12.5rem;
  height: 12.5rem;
  position: absolute;
  transform: translate(-50%, -50%);
  .tr {
    width: 1.125rem;
    height: 1.125rem;
    padding: 0.625rem;
    position: fixed;
  }
  .tr::after {
    content: "";
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 50%;
    position: absolute;
    box-sizing: border-box;
    background-color: rgba(0, 170, 255, 0.5);
  }

  #plane {
    width: 12.5rem;
    height: 12.5rem;
    position: absolute;
    border: 0.0625rem dashed #07c160;
    // background-color: rgba(7, 193, 96, 0.1);
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .doubleImgLeft,
    .doubleImgRight {
      height: 100%;
      width: 2.5rem;
      position: absolute;
    }
    .doubleImgLeft {
      left: 0;
    }
    .doubleImgRight {
      left: 10rem;
    }
    .imgToBottom,
    .imgToHalfBottom {
      left: 0;
      width: 100%;
      height: 2.5rem;
      position: absolute;
    }
    .imgToBottom {
      height: 2.5rem;
    }
    .imgToHalfBottom {
      height: 1.25rem;
    }
    .fullImg {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
