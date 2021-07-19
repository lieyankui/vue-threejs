export function _importView(path) {
    return () => import(`@/views/${path}.vue`);
}

export function _import(path) {
    return () => import(`@/${path}.vue`);
}