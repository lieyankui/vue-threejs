import router from './index'
import { setDocumentTitle } from '@/utils/page-common'

router.router.beforeEach((to, from, next) => {
    console.log('from: ', from);
    console.log('to: ', to);
    setDocumentTitle(to.meta)
    /* must call `next` */
    next()
});