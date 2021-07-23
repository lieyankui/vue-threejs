import FormData from "form-data";

//获取FormData对象
export function getFormData() {
  return new FormData();
}
//js对象转化为FormData对象
export function obj2FormData(obj) {
  if (obj && Object.keys(obj).length > 0) {
    let formData = new FormData();
    for (let key in obj) {
      formData.append(key, obj[key]);
    }
    return formData;
  } else {
    console.warn("参数对象为空");
  }
}
