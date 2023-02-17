class Images {
    static error = 'assets/error.png'
    static add_curtain = 'assets/add/add_curtain.png';
    static unadd_curtain = 'assets/add/unadd_curtain.png';
    static add_material = 'assets/add/add_accessories.png';
    static unadd_material = 'assets/add/unadd_accessories.png';
}

class Routes {
    static init = '/'
    static add = 'add';
    static material = 'material';
    static curtain = 'curtain';
    static upload = 'upload';
    static design = 'design';
}

class Globals {
    static tel = '13523432314';
    static ops = {
        selArea: 0,//开始选区
        addPoint: 1,//开始选点
        delPoint: 2,//清空选点
        selDown: 3,//完成选区
        addMask: 4,//添加选区
        delMask: 5,//删除选区
        selected: 6,//选择区域
        unselected: 7,//取消选择
    }
}

class Storages {
    static lasterRouter = 'lasterRouter';
    static materialSwitch = 'materialSwitch';
    static materialSave = 'materialSave';
    static materialImgSave = 'materialImgSave';
    static CurtainSave = 'curtainSave';
    static uploadSave = 'uploadSave';
}

class Storage {
    static setSession(key, value) {
        try {
            window.sessionStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }
    static getSession(key) {
        return window.sessionStorage.getItem(key);
    }
    static removeSessionItem(key) {
        window.sessionStorage.removeItem(key);
    }
    static clearSession() {
        window.sessionStorage.clear();
    }
    /////////////////////////////////////////////////////
    static setLocal(key, value) {
        try {
            window.localStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }
    static getLocal(key) {
        return window.localStorage.getItem(key);
    }
    static removeLocalItem(key) {
        window.localStorage.removeItem(key);
    }
    static clearLocal() {
        window.localStorage.clear();
    }
}

export { Images, Routes, Storages, Storage, Globals };