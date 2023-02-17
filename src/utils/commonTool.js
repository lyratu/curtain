//图片转64做了压缩处理
export const imageToBase64 = (img, width, height, type) => {
    // Vue.prototype.$imageToBase64 = img => { //定义全局
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    const { width: originWidth, height: originHeight } = img
    // 最大尺寸限制
    const maxWidth = width == undefined ? img.width : width//820//window.screen.height
    const maxHeight = height == undefined ? img.height : height//1180//window.screen.width
    // 目标尺寸
    let targetWidth = originWidth
    let targetHeight = originHeight
    if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > 1) {
            // 宽图片
            targetWidth = maxWidth
            targetHeight = Math.round(maxWidth * (originHeight / originWidth))
        } else {
            // 高图片
            targetHeight = maxHeight
            targetWidth = Math.round(maxHeight * (originWidth / originHeight))
        }
    }
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    // var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL(type == undefined ? "image/webp" : type);
    return dataURL;
};

export const fileToImage = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()
        reader.onload = function (e) {
            img.src = e.target.result
        }
        reader.onerror = function (e) {
            reject(e)
        }
        reader.readAsDataURL(file)
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function (e) {
            reject(e)
        }
    })
}

export const fileTobase64 = (file) => {
    return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
            imgResult = reader.result;
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.onloadend = function () {
            resolve(imgResult);
        };
    });
};

export const base64ToFile = (urlData, fileName) => {
    let arr = urlData.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bytes = atob(arr[1]); // 解码base64
    let n = bytes.length;
    let ia = new Uint8Array(n);
    while (n--) {
        ia[n] = bytes.charCodeAt(n);
    }
    return new File([ia], fileName, { type: mime });
};

export const setImgName = (name) => {
    let str = name.substring(0, name.lastIndexOf(".") + 1);
    return str + "webp";
};

export const clearblankimg = (imgData, callback) => {
    var img = new Image(); //创建图片对象
    img.src = imgData;
    img.onload = function () {
        var c = document.createElement("canvas"); //创建处理画布对象
        var ctx = c.getContext("2d");
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0); //绘制
        var imgData = ctx.getImageData(0, 0, c.width, c.height).data; //读取图片数据
        var lOffset = c.width,
            rOffset = 0,
            tOffset = c.height,
            bOffset = 0;
        for (var i = 0; i < c.width; i++) {
            for (var j = 0; j < c.height; j++) {
                var pos = (i + c.width * j) * 4;
                if (
                    imgData[pos] == 255 ||
                    imgData[pos + 1] == 255 ||
                    imgData[pos + 2] == 255 ||
                    imgData[pos + 3] == 255
                ) {
                    bOffset = Math.max(j, bOffset); // 找到有色彩的最下端
                    rOffset = Math.max(i, rOffset); // 找到有色彩的最右端
                    tOffset = Math.min(j, tOffset); // 找到有色彩的最上端
                    lOffset = Math.min(i, lOffset); // 找到有色彩的最左端
                }
            }
        }
        lOffset++;
        rOffset++;
        tOffset++;
        bOffset++;
        var x = document.createElement("canvas"); //创建处理后画布对象
        x.width = rOffset - lOffset;
        x.height = bOffset - tOffset;
        var xx = x.getContext("2d");
        xx.drawImage(
            img,
            lOffset,
            tOffset,
            x.width,
            x.height,
            0,
            0,
            x.width,
            x.height
        ); //绘制
        callback(x.toDataURL("image/webp"))
        // console.log(x.toDataURL("image/webp")); //得到最终裁剪出来的base64
    };
};


