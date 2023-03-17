export function saveAsImg(canvas, fileName) {
    console.log("Object.prototype.toString.call(canvas)", Object.prototype.toString.call(canvas));
    if (Object.prototype.toString.call(canvas) === "[object String]") {
        canvas = document.querySelector(canvas);
        if (!canvas) throw Error("Can't find element by first arguments 'canvas'");
    }
    fileName = fileName || (new Date().getTime() + '_img');
    const imgUrl = toDataUrl(canvas);
    const dlLink = document.createElement("a");
    dlLink.download = fileName;
    dlLink.href = imgUrl;
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}

export function toDataUrl(canvas, type = 'MIME_TYPE') {
    return canvas.toDataURL(type);
}

export function setOpacity(canvas, opacity = 0.5) {
    if (canvas && canvas.getContext) {
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, width, height);
        for (var i = 0 , len = imgData.data.length ; i < len ; i += 4 ) {
            imgData.data[i + 3] = imgData.data[i + 3] * opacity;
        }
        ctx.putImageData(imgData , width , height);
    } else {
        return null;
    }
}
