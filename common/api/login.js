
import http from '@/http/index.js';
import signRequest from '@/http/signHttp.js';

// 获取openid
export const accountToken = params => http('post','/account/token',params)
 
 // 获取code
 export const accountCode = params => http('post','/account/code',params)


//获取openID 
 export const accountAuthGetUserID = params => http('post','/account/auth/getUserId',params)
 
 
 
 
