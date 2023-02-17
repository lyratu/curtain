import { axios } from "@/utils/axios";

class CommonApi {
  static url = {
    upload: "/api/common/upload",
  };
  static upload(data) {
    return axios({ url: this.url.upload, method: "post", data: data });
  }
  static uploadBase64(data) {
    return axios({
      url: "/api/common/baseFileUpload",
      method: "post",
      // headers: {
      //   "Content-Type": "image/svg+xml",
      // },
      data: data,
    });
  }
}

export { CommonApi };
