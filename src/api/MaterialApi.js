import { axios } from "@/utils/axios";

class MaterialApi {
  static url = {
    getType: "/api/common/accessoriesClassify",
    add: "/api/production/addAccessories",
    list: "/api/production/getAccessories",
    del: "/api/production/deleteAccessories",
  };
  static getMaterialType() {
    return axios({ url: this.url.getType, method: "post" });
  }
  static getMateria(params) {
    return axios({ url: this.url.list, method: "get", params: params });
  }
  static addMaterial(params) {
    return axios({ url: this.url.add, method: "post", params: params });
  }
  static delMaterial(data) {
    return axios({ url: this.url.del, method: "post", data: data });
  }
}

export { MaterialApi };
