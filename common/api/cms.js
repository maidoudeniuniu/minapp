import request from '@/http/cmsHttp.js'

//首页cms
export const cmsPages = id => request('get', '/caas/pages/' + id, {}, true)

//通用cms
export const cmsarticles = id => request('get', '/caas/articles/' + id, {}, true)
