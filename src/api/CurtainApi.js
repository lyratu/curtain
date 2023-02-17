import { axios } from "@/utils/axios";

class CurtainApi {
  static url = {
    getName: "/api/common/materialProduct",
    getStyle: "/api/common/materialStyle",
    getScene: "/api/common/materialScenes",
    add: "/api/production/addMaterial",
    get: "/api/production/getMaterial",
    del: "/api/production/deleteMaterial",
    release: "/api/production/release",
    detail: "/api/production/workDetails",
    friends: "/api/production/getFriends",
  };
  static getCurtainName() {
    return axios({ url: this.url.getName, method: "post" });
  }
  static getCurtainStyle() {
    return axios({ url: this.url.getStyle, method: "post" });
  }
  static getCurtainScene() {
    return axios({ url: this.url.getScene, method: "post" });
  }
  static addCurtain(data) {
    return axios({ url: this.url.add, method: "post", data: data });
  }
  static getCurtain(params) {
    return axios({ url: this.url.get, method: "get", params: params });
  }
  static delCurtain(data) {
    return axios({ url: this.url.del, method: "post", data: data });
  }
  static release(data) {
    return axios({ url: this.url.release, method: "post", data: data });
  }
  static getDetail(params) {
    return axios({ url: this.url.detail, method: "get", params: params });
  }
  static getFriends(params) {
    return axios({ url: this.url.friends, method: "get", params: params });
  }
}

export { CurtainApi };
