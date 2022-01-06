//获取参数元素 x轴和y轴的位置
export function getXAndYByDom(dom) {
    let left = dom.offsetLeft
    let top = dom.offsetTop
    let translate = getTransformSize(dom)
    if (translate) {
        left += translate.x
        top += translate.y
    }
    let pNode = dom.offsetParent
    if (pNode) {
        let xyInfo = getXAndYByDom(pNode)
        left += xyInfo.left
        top += xyInfo.top
    }
    return { left: left, top: top }
}
//获取元素在x和y方向移动的距离
export function getTransformSize(dom) {
    let transform = window.getComputedStyle ?
        getComputedStyle(dom, null)['transform'] :
        dom.currentStyle[transform]
    if (transform) {
        transform.trim()
        let index = transform.indexOf('matrix(')
        let endIndex = transform.indexOf(')')
        if (index !== -1) {
            index += 7
            transform = transform.slice(index, endIndex)
            let arr = transform.split(',')
            let translate = {}
            arr.forEach((item, index) => {
                if (index == 4) {
                    item = parseFloat(item)
                    translate.x = item
                } else if (index == 5) {
                    item = parseFloat(item)
                    translate.y = item
                }
            })
            return translate
        }
    } else {
        return null
    }
}
//获取元素样式
export function getStyle(obj, name) {
    //获取属性可以通过.，也可以通过中括号，这里.不适合，中括号才适合
    //正常浏览器的方式，具有getComputedStyle方法
    //getComputedStyle(obj, null)[name]
    //要加window，否则是个变量，到时候会报错
    // if (window.getComputedStyle) {
    //   return getComputedStyle(obj, null)[name]
    // } else {
    //   //IE浏览器，具有currentStyle方法
    //   return obj.currentStyle[name]
    // }
    //第二种方式可以通过三元运算符
    if (!name) {
        return window.getComputedStyle ?
            getComputedStyle(obj, null) :
            obj.currentStyle
    }
    return window.getComputedStyle ?
        getComputedStyle(obj, null)[name] :
        obj.currentStyle[name]
}
