import signRequest from '@/http/signHttp.js';
import http from '@/http/index.js';

// 商品列表
export const goodsList = params => signRequest.GET('/goods/list', params, true)

// 商品详情
export const goodsGet = params => signRequest.GET('/goods/get', params)

//添加商品到购物车
export const cartAdd = params => signRequest.POST('/cart/add', params)

//从购物车中删除
export const cartDelete = params => signRequest.POST('/cart/delete', params)

//清空购物车
export const cartEmpty = params => signRequest.POST('/cart/empty', params)

//获取购物车历史信息
export const cartList = params => signRequest.GET('/cart/list', params, true)

//去结算
export const ordersCompute = params => signRequest.POST('/orders/compute', params)

//提交订单
export const ordersSubmit = params => signRequest.POST('/orders/submit', params)


//获取指定商品的规格信息（价格、限购、库存）
export const goodsSku = params => signRequest.GET('/goods/sku/get', params)

