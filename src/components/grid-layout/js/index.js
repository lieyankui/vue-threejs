require.config({
  paths: {
    ObjUtil: "./modules/obj-util",
    DomUtil: "./modules/dom-util",
    GridDragBox: "./modules/grid-drag-box",
  },
});
require(["ObjUtil", "DomUtil", "GridDragBox"], function (
  ObjUtil,
  DomUtil,
  GridDragBox
) {
  //
  var gridContainer = document.querySelector(".grid-container");
  var gridDragBox = new GridDragBox({
    el: gridContainer,
    itemDatas: [
      { title: "标题1", content: "内容111111111111111111111111111111111" },
      { title: "标题2", content: "内容222222222222" },
      { title: "标题3", content: "内容3333333333333" },
      { title: "标题4", content: "内容444444444444444" },
      { title: "标题5", content: "内容555555555555555555" },
      { title: "标题6", content: "内容6666666666666666666666666666666" },
      { title: "标题7", content: "内容777777777" },
      { title: "标题1", content: "内容8888" },
      { title: "标题2", content: "内容9999999" },
      { title: "标题3", content: "内容aaaaaa" },
      { title: "标题4", content: "内容bbbbbbb" },
      { title: "标题5", content: "内容cccccccc" },
      { title: "标题6", content: "内容ddddddd" },
      { title: "标题7", content: "内容eeeeeee" },
    ],
  });
  console.log("gridDragBox", gridDragBox);
});
