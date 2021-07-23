//合并json数据
var extend=function(des, src) {
    for (p in src) {
      des[p]=src[p];
    }
    return des;
}
//创建表格
function createTable(datas,params){
	var tableEle,titleRow;
	var defaultSetting={
		rowNum:datas&&datas.length?datas.length:0,
		colNum:0,
		colNameProperty:[]
	};
	
	defaultSetting=extend(defaultSetting,params);
	if(colNameProperty&&colNameProperty.length){
		
	}
	if(!datas||!datas.length){
		return;
	}
}
function mergeCell(datas,mergeAttrArr,colAttrArr){
	
}