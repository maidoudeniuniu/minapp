
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/detail/detail","pages/member/member","pages/cart/cart","pages/cart/order/order","pages/commonPages/commonPages","pages/commonPages/article","pages/productList/productList","pagesmember/user/tellogin/tel","pagesmember/user/login/login","pagesmember/user/referrer/referrer","pagesmember/address/list/address","pagesmember/address/add/add","pagesmember/address/edit/edit","pagesmember/order/order","pagesmember/order/detail/detail","pagesmember/order/logistics/logistics","pagesmember/order/refund/refund","pagesmember/order/refundDetail/refundDetail","pagesmember/order/applyrefund/applyrefund","pagesmember/my/money/money","pagesmember/my/money/earnings","pagesearnings/customerManagement/customerManagement"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"uView","navigationBarBackgroundColor":"#FFFFFF","backgroundColor":"#F8F8F8"},"tabBar":{"color":"#707184","selectedColor":"#26273A","borderStyle":"white","backgroundColor":"#ffffff","list":[{"pagePath":"pages/index/index","text":" ","iconPath":"static/index.png","selectedIconPath":"static/index-selected.png"},{"pagePath":"pages/cart/cart","iconPath":"static/cart.png","text":"购物车","selectedIconPath":"static/cart-select.png"},{"pagePath":"pages/member/member","iconPath":"static/center.png","text":"我的","selectedIconPath":"static/center-selected.png"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"熙选","compilerVersion":"3.1.22","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","navigationStyle":"custom","enablePullDownRefresh":true}},{"path":"/pages/detail/detail","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom"}},{"path":"/pages/member/member","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"会员中心"}},{"path":"/pages/cart/cart","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"购物车","enablePullDownRefresh":true}},{"path":"/pages/cart/order/order","meta":{},"window":{"navigationBarTitleText":"确认下单"}},{"path":"/pages/commonPages/commonPages","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/commonPages/article","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/productList/productList","meta":{},"window":{"navigationBarTitleText":"熙选商品","enablePullDownRefresh":false,"navigationBarBackgroundColor":"#FFFFFF"}},{"path":"/pagesmember/user/tellogin/tel","meta":{},"window":{"navigationBarTitleText":"","navigationBarBackgroundColor":"#FFFFFF"}},{"path":"/pagesmember/user/login/login","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom"}},{"path":"/pagesmember/user/referrer/referrer","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pagesmember/address/list/address","meta":{},"window":{"navigationBarTitleText":"收货地址","navigationBarBackgroundColor":"#FFFFFF"}},{"path":"/pagesmember/address/add/add","meta":{},"window":{"navigationBarTitleText":"新增收货地址"}},{"path":"/pagesmember/address/edit/edit","meta":{},"window":{"navigationBarTitleText":"编辑收货地址"}},{"path":"/pagesmember/order/order","meta":{},"window":{"navigationBarTitleText":"我的订单","enablePullDownRefresh":true}},{"path":"/pagesmember/order/detail/detail","meta":{},"window":{"navigationBarTitleText":"订单详情"}},{"path":"/pagesmember/order/logistics/logistics","meta":{},"window":{"navigationBarTitleText":"物流详情","navigationBarBackgroundColor":"#FFFFFF"}},{"path":"/pagesmember/order/refund/refund","meta":{},"window":{"navigationBarTitleText":"退款/售后"}},{"path":"/pagesmember/order/refundDetail/refundDetail","meta":{},"window":{"navigationBarTitleText":"退款详情"}},{"path":"/pagesmember/order/applyrefund/applyrefund","meta":{},"window":{"navigationBarTitleText":"申请退款"}},{"path":"/pagesmember/my/money/money","meta":{},"window":{"navigationBarTitleText":"我的资金"}},{"path":"/pagesmember/my/money/earnings","meta":{},"window":{"navigationBarTitleText":"我的收益"}},{"path":"/pagesearnings/customerManagement/customerManagement","meta":{},"window":{"navigationBarTitleText":"客户管理"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
