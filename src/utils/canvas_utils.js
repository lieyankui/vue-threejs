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
