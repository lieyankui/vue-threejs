export function _import(path) {
    return () => import(`@/views/${path}.vue`)
}