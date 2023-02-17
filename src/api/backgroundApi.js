import { axios } from "@/utils/axios";

class backgroundApi {
  static url = {
    add: "/api/production/addBackground",
    get: "/api/production/getBackground",
    del: "/api/production/deleteBackground",
  };
  static add(data) {
    return axios({ url: this.url.add, method: "post", data: data });
  }
  static get(params) {
    return axios({ url: this.url.get, method: "get", params: params });
  }
  static del(data) {
    return axios({ url: this.url.del, method: "post", data: data });
  }
}

export { backgroundApi };
