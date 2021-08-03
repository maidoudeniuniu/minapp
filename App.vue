<script>
import { getValue } from '@/common/js/utils.js';
export default {
	onLaunch: function() {
		//console.log('App Launch')
	},
	onShow: function() {
		console.log('----每次进来都刷新token-----');
		let expTime = getValue('exp') || 0;
		let curTime = new Date().getTime();
		if (curTime - expTime > 7200000) {
			//每次进来都刷新token
			this.$Sub.refreshToken();
		}
	},
	onHide: function() {
		//console.log('App Hide')
	}
};
</script>

<style lang="scss">
@import './common/css/iconfont.css';
/*每个页面公共css */
@import 'uview-ui/index.scss';
@import './common/css/common.scss';

@font-face {
	font-family: 'DINM';
	src: url('~@/common/DIN/DIN-Medium.otf');
}
.DINM {
	font-family: 'DINM' !important;
}

@font-face {
	font-family: 'DINLight';
	src: url('~@/common/DIN/DIN-Light.otf');
}

.DINLight {
	font-family: 'DINLight' !important;
}

@font-face {
	font-family: 'DIN';
	src: url('~@/common/DIN/DIN-Regular.otf');
}
.DIN {
	font-family: 'DIN' !important;
}

.xx-base-btn {
	.u-hairline-border:after {
		border: #000 1px solid !important;
	}
	.u-default-hover {
		color: #26273a !important;
		border-color: #26273a !important;
		background-color: #26273a !important;
	}
	.u-btn--primary {
		background-color: #26273a !important;
		border-color: #26273a !important;
		font-weight: bold;
	}
	.u-primary-hover {
		background-color: #26273a !important;
		border-color: #26273a !important;
	}
}
</style>
