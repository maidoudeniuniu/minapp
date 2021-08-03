import http from '@/http/index.js';
import signRequest from '@/http/signHttp.js';
import httpUrl from '@/http/config.js';

// 获取用户信息
export const getUserInfoRequest = params => signRequest.GET(USERSERVICE+'/user/getUserInfo',params,true)

// 图片上传
export const fileUpload = params => httpUrl.baseUrl + '/file/upload'

