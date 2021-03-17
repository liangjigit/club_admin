import {
	GETUSERACTIVITYS,
	GETUSERFIELDS,
	GETCOUPONTEMPLATES,
	GETUSERREGCONFIG,
	GETUSERINFOCONFIG,
	GETUSERINVITECONFIG,
	GETUSERACTIVITYCONFIG,
} from "../../mutations_type";
import request from "@/utils/request";

const state = {
	userActivitys: [],
	userFields: [],
	couponTemplates: [],
	userRegConfig: {},
	userInfoConfig: {},
	userInviteConfig: {},
	userActivityConfigs: [],
	activeConfig:''
};

const actions = {
	async getFissionAwardShow({
		commit
	},payload){
		console.log(commit)
		return (await request({
			url:'/content/admin/userBind/rewardList',
			method:'POST',
			data:payload
		})).data
	},
	async exportFriendFission({
		commit
	},payload){
		console.log(commit)
		return (await request({
			url:'/content/admin/userBind/recordDataExport',
			method:'POST',
			responseType: "arraybuffer",
			data:payload
		}))
	},
	async closeFriendFission({
		commit
	},payload){
		console.log(commit)
		return (await request({
			url:'/content/admin/userBind/edit',
			method:'POST',
			data:payload
		})).data
	},
	async getFriendFissionConfig({
		commit
	},payload){
		console.log(commit)
		return (await request({
			url:'/content/admin/userBind/list',
			method:'POST',
			data:payload
		})).data
	},
	async getCoupon({
		commit
	}, payload) {
		const response = (
			await request({
				url: `/user/admin/userCoupon/auth/getTemplate`,
				method: "POST",
				data: payload
			})
		).data;
		if (response.code == 200) {
			let couponTemplates = response.data;
			commit("GETCOUPONTEMPLATES", {
				couponTemplates
			});
		}
		return response;
	},
	async saveFriendFissionConfig({
		commit
	}, payload) {
		console.log(commit)
		return (await request({
			url: '/content/admin/userBind/saveUserBindConfig',
			method: 'POST',
			data: payload
		})).data
	},
	async saveUserActivityConfig({
		commit
	}, payload) {
		const response = (
			await request({
				url: `/user/admin/user-activity-config/auth/save`,
				method: "POST",
				data: payload
			})
		).data;
		if (response.code === 200) {
			commit("getUserActivitys", {});
		}
		return response;
	},
	async saveUserRegConfig({
		commit
	}, payload) {
		const response = (
			await request({
				url: `/user/admin/user-info-config/auth/save/userRegConfig`,
				method: "POST",
				data: payload
			})
		).data;
		if (response.code === 200) {
			commit("getUserActivitys", {});
		}
		return response;
	},
	async saveUserInfoConfig({
		commit
	}, payload) {
		const response = (
			await request({
				url: `/user/admin/user-info-config/auth/save/userInfoConfig`,
				method: "POST",
				data: payload
			})
		).data;
		if (response.code === 200) {
			commit("getUserActivitys", {});
		}
		return response;
	},
	async saveUserInviteConfig({
		commit
	}, payload) {
		const response = (
			await request({
				url: `/user/admin/user-invite-config/auth/save`,
				method: "POST",
				data: payload
			})
		).data;
		if (response.code === 200) {
			commit("getUserActivitys", {});
		}
		return response;
	},
	async getUserActivityConfig({
		commit
	}) {
		const response = (
			await request({
				url: `/user/admin/user-activity-config/auth/info`,
				method: "GET",
				data: {}
			})
		).data;
		if (response.code == 200) {
			let userActivityConfigs = response.data;
			commit("GETUSERACTIVITYCONFIG", {
				userActivityConfigs
			});
		}
		return response;
	},
	async getUserInviteConfig({
		commit
	}) {
		const response = (
			await request({
				url: `/user/admin/user-invite-config/auth/info`,
				method: "GET",
				data: {}
			})
		).data;
		if (response.code == 200) {
			let userInviteConfig = response.data;
			commit("GETUSERINVITECONFIG", {
				userInviteConfig
			});
		}
		return response;
	},
	async getUserRegConfig({
		commit
	}) {
		const response = (
			await request({
				url: `/user/admin/user-info-config/auth/userRegConfig`,
				method: "GET",
				data: {}
			})
		).data;
		if (response.code == 200) {
			let userRegConfig = response.data;
			commit("GETUSERREGCONFIG", {
				userRegConfig
			});
		}
		return response;
	},
	async getUserInfoConfig({
		commit
	}) {
		const response = (
			await request({
				url: `/user/admin/user-info-config/auth/userInfoConfig`,
				method: "GET",
				data: {}
			})
		).data;
		if (response.code == 200) {
			let userInfoConfig = response.data;
			commit("GETUSERINFOCONFIG", {
				userInfoConfig
			});
		}
		return response;
	},
	async getCouponTemplates({
		commit
	}, payload) {
		const response = (
			await request({
				url: `/user/admin/userCoupon/auth/template`,
				method: "POST",
				data: payload
			})
		).data;
		if (response.code == 200) {
			let couponTemplates = response.data;
			commit("GETCOUPONTEMPLATES", {
				couponTemplates
			});
		}
		return response;
	},
	async getUserActivitys({
		commit
	}) {
		const response = (
			await request({
				url: `/user/admin/user-activity/auth/list`,
				method: "GET",
				data: {}
			})
		).data;
		if (response.code == 200) {
			let userActivitys = response.data;
			commit("GETUSERACTIVITYS", {
				userActivitys
			});
		}
		return response;
	},
	// eslint-disable-next-line no-empty-pattern
	async changeUserActivityStatus({}, payload) {
		const {
			type,
			status
		} = payload;
		const response = (
			await request({
				url: `/user/admin/user-activity/auth/status?type=${type}&status=${status}`,
				method: "GET",
				data: {}
			})
		).data;
		return response;
	},
	async getUserFileds({
		commit
	}, payload) {
		const {
			type
		} = payload;
		const response = (
			await request({
				url: `/user/admin/user-info-config/auth/userFiledList?type=${type}`,
				method: "GET",
				data: {}
			})
		).data;
		if (response.code == 200) {
			let userFields = response.data;
			commit("GETUSERFIELDS", {
				userFields
			});
		}
		return response;
	}
};

const mutations = {
	// 获取列表
	[GETUSERACTIVITYCONFIG](state, payload) {
		state.userActivityConfigs = payload.userActivityConfigs;
	},
	[GETUSERACTIVITYS](state, payload) {
		state.userActivitys = payload.userActivitys;
	},
	[GETUSERFIELDS](state, payload) {
		state.userFields = payload.userFields;
	},
	[GETCOUPONTEMPLATES](state, payload) {
		state.couponTemplates = payload.couponTemplates;
	},
	[GETUSERREGCONFIG](state, payload) {
		state.userRegConfig = payload.userRegConfig;
	},
	[GETUSERINFOCONFIG](state, payload) {
		state.userInfoConfig = payload.userInfoConfig;
	},
	[GETUSERINVITECONFIG](state, payload) {
		state.userInviteConfig = payload.userInviteConfig;
	}
};

export default {
	namespaced: true,
	state,
	actions,
	mutations
};
