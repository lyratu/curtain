const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 配置窗户素材图片跨域
  // devServer: {
  //   proxy: {
  //     "/uploads": {
  //       target: "https://curtain.kaigekeji.com/uploads",
  //       pathRewrite: {
  //         "^/uploads": "/",
  //       },
  //     },
  //   },
  // },
});
