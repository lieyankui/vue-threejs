export const PAGE_TITLE = "vue-thhreejs"
export function setDocumentTitle (routerMeta) {
    const titleEle = document.querySelector("html head title")
    const title = (routerMeta && routerMeta.title) || PAGE_TITLE
    titleEle.innerHTML = title
}