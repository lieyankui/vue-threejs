//在新窗口打开参数路由  并传入参数
/**
 *
 * @param {路由路径} path
 * @param {参数} query
 */
export function open(path, query) {
  query = query || {};
  let routeData = this.$router.resolve({
    path: path,
    query: query,
  });
  window.open(routeData.href, "_blank");
}
