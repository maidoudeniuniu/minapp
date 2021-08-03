import http from '@/http/index.js';
import signRequest from '@/http/signHttp.js';

//获取用户㤈
export const accountInfo = params => http('get', '/account/info', params)
//地址列表
export const accountAddressList = (params) => http('get', '/account/address/list', params, true)
//地址详情
export const accountAddressGet = params => http('get', '/account/address/get', params)
//保存地址
export const accountAddressSaveNew = (params, type = "new") => http('post', '/account/address/save/' + type, params)
//订单
export const ordersList = params => http('get', '/orders/list', params, true)
//删除订单
export const ordersDelete = params => http('get', '/orders/delete', params)
//取消订单
export const ordersCancel = params => http('get', '/orders/cancel', params)
//确认收货
export const confirmReceipt = params => http('get', '/orders/receipt', params, true)


//订单详情
export const ordersDetails = params => http('get', '/orders/details', params)
//支付
export const Pay = params => http('post', '/pay', params)
//我的资产
export const accountAssetget = params => http('get', '/mine/account/profits/recently', params)
//按指年月获取个人收益详细列表信息
export const monthlyProfits = params => http('get', '/mine/account/profits/monthly', params, true)
//按指定年度获取个人收益月信息列表
export const yearlyProfits = params => http('get', '/mine/account/profits/yearly', params, true)
//获取指定用户信息
export const accountUser = params => signRequest.GET('/account/user', params)
//获取用户等级和账号详细信息
export const mineAccountInfo = params => http('get', '/mine/account', params, true)

//物流详情
export const expressDetail = params => http('get', '/orders/express/track', params, true)

//获取当前登录用户的客户列表
export const customerList = params => http('get', '/mine/children', params, true)

//退款/售后列表
export const refundGoodsList = params => http('post', '/refund/list', params, true)

//退款详情
export const refundDetails = params => http('post', '/refund/details', params, true)

//申请退款
export const refundApply = params => http('post', '/refund/apply', params, true)
