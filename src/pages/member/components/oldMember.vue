<template>
	<div class="old-member">
		<div class="award-set" v-if="isShowMore">老会员奖励</div>
		<div class="award-set-detail" v-if="isShowMore">
			<a-form-model-item label="奖励领取是否限次">
				<a-radio-group v-model="awardLimit">
					<a-radio value="1">
						限次
					</a-radio>
					<a-radio value="2">
						不限次
					</a-radio>
				</a-radio-group>
			</a-form-model-item>
		</div>
		<div class="award-set-detail" style="border: 1px solid #3A87AD;" v-if="awardOne">
			<p style="color: red;margin-top: 10px;">*奖励所有设置均为必填项</p>
			<div>
				奖励名称：
				<a-input placeholder="输入奖励名称" :maxLength="10" style="width: 20%;" v-model="oldInvite.nameOn"
					@blur="blurValidate(1)" />
				<p style="color: red;" v-show="warn.warnName">请输入奖励名称</p>
			</div>
			<div>
				邀请人数：
				<a-input placeholder="输入邀请人数" :maxLength="5" style="width: 20%;" v-model="oldInvite.peopleOn"
					@blur="blurValidate(2)" />
				<p style="color: red;" v-show="warn.warnPeople">请输入邀请人数</p>
			</div>
			<a-form-model-item label="老会员奖励图片" extra="png/jpg格式，2M以内">
				<upload-file @uploadPic="uploadPicOn" :img="oldInvite.imageOn" v-model="oldInvite.imageOn">
				</upload-file>
				<p style="color: red;" v-show="warn.warnImg">请上传奖励图片</p>
			</a-form-model-item>
			<div>奖励类型：
				<a-radio-group v-model="oldInvite.typeOn" @change="changeOldAward" v-if="couponId == null">
					<a-radio value="1">
						优惠券
					</a-radio>
					<a-radio value="2">
						积分
					</a-radio>
					<a-radio value="3">
						礼品卡
					</a-radio>
				</a-radio-group>
				<div v-if="isRemove">
					<p style="color: red;" v-if="templateList">{{templateList.couponName}}
						<a-button type="primary" @click="removeNewId" style="margin-left:10px">
							移除
						</a-button>
					</p>
				</div>
			</div>
			<div v-if="couponId == null" style="margin-bottom: 10px;">
				<div v-show="oldInvite.typeOn == 2">
					<a-input placeholder="输入积分" :maxLength="20" style="width: 30%;" v-model="oldJF"
						@blur="blurValidate(3)" />
					<p style="color: red;margin-top: 5px;" v-show="warn.warnJF">请输入积分</p>
				</div>
				<div v-show="oldInvite.typeOn == 1 || oldInvite.typeOn == 3">
					<a-input :placeholder="oldInvite.typeOn == 1 ? '输入优惠券批次号' : '输入礼品卡批次号'" :maxLength="20"
						style="width: 30%;" v-model="oldPCH" @blur="blurValidate(3)" />
					<a-button type="primary" @click="addNewId" style="margin-left:10px">
						添加
					</a-button>
					<p style="color: red;margin-top: 5px;" v-show="warn.warnPCH">{{oldInvite.typeOn == 1 ? '请输入优惠券批次号' : '请输入礼品卡批次号'}}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	import uploadFile from "../../components/UploadFile"
	export default {
		name: "oldMember",
		components: {
			uploadFile,
		},
		props:{
			isShowMore:{
				type:Boolean,
				default:true
			},
			oldLevel:{
				type:Number,
				default:1
			}
		},
		data() {
			return {
				isRemove: false,
				awardOne: true,
				awardTwo: false,
				awardThree: false,
				awardLimit: '1',
				couponId: null,
				templateList: null,
				oldJF: '',
				oldPCH: '',
				oldInvite: {
					imageOn: '',
					imageTw: '',
					imageTh: '',
					nameOn: '',
					nameTw: '',
					nameTh: '',
					peopleOn: '',
					peopleTw: '',
					peopleTh: '',
					typeOn: '1',
					typeTw: '1',
					typeTh: '1'
				},
				warn: {
					warnName: false,
					warnPeople: false,
					warnImg: false,
					warnJF: false,
					warnPCH: false
				}
			}
		},
		methods: {
			...mapActions("userActivity", ["getCouponTemplates"]),
			/**
			 * 验证老用户奖励方法
			 */
			validate() {
				if (this.oldInvite.nameOn == '') this.warn.warnName = true
				if (this.oldInvite.peopleOn == '') this.warn.warnPeople = true
				if (this.oldInvite.imageOn == '') this.warn.warnImg = true
				//判断奖励类型是否添加
				if (this.oldInvite.typeOn == '2') {
					if (this.oldJF == '') this.warn.warnJF = true
				} else if (this.oldInvite.typeOn == '1' || this.oldInvite.typeOn == '3') {
					if (this.isRemove == false) this.warn.warnPCH = true
				}
				//有验证不通过则不能提交
				// console.log(this.warn.warnName,this.warn.warnPeople,this.warn.warnImg,this.warn.warnJF,this.warn.warnPCH)
				if (!this.warn.warnName && !this.warn.warnPeople && !this.warn.warnImg && !this.warn.warnJF && !this.warn.warnPCH) {
					console.log('通过了')
					this.addAward()
				} else {
					this.$message.error({
						content: '有必填项未填写，请检查',
					})
				}
			},
			/**
			 * @param {Object} option
			 * 上传图片
			 */
			uploadPicOn(option) {
				this.oldInvite.imageOn = option.imageUrl;
			},
			uploadPicTw(option) {
				this.oldInvite.imageTw = option.imageUrl;
			},
			uploadPicTh(option) {
				this.oldInvite.imageTh = option.imageUrl;
			},
			/**
			 * 老用户奖励切换触发
			 */
			changeOldAward() {
				this.oldPCH = ''
				this.oldJF = ''
				this.warn.warnJF = false
				this.warn.warnPCH = false
			},
			/**
			 * 添加新会员优惠券，礼品卡
			 */
			async addNewId() {
				if (this.oldPCH == null || this.oldPCH == '') {
					this.$message.error({
						content: "请输入批次号",
					})
				} else {
					const response = await this.getCouponTemplates({
						"templateCode": this.oldPCH
					});
					console.log(response)
					if (response.code != 200) {
						this.$message.error({
							content: response.msg,
						})
					} else {
						this.couponId = response.data[0].templateCode
						this.templateList = response.data[0]
						this.isRemove = true
						this.warn.warnPCH = false
					}
				}
			},
			/**
			 * 移除选定的优惠券，礼品卡
			 */
			removeNewId() {
				this.templateList = null
				this.oldInvite.typeOn = '1'
				this.couponId = null
				this.isRemove = false
				this.oldJF = ''
				this.oldPCH = ''
			},
			/**
			 * 失去焦点验证
			 */
			blurValidate(type) {
				switch (type) {
					case 1:
						if (this.oldInvite.nameOn == '' || this.oldInvite.nameOn == null) {
							this.warn.warnName = true
						} else {
							this.warn.warnName = false
						}
						break;
					case 2:
						if (this.oldInvite.peopleOn == '' || this.oldInvite.peopleOn == null) {
							this.warn.warnPeople = true
						} else {
							this.warn.warnPeople = false
						}
						break;
					case 3:
						if (this.oldInvite.typeOn == '1' || this.oldInvite.typeOn == '3') {
							if (this.isRemove == false) this.warn.warnPCH = true
						} else {
							if (this.oldJF == '' || this.oldJF == null) {
								this.warn.warnJF = true
							} else {
								this.warn.warnJF = false
							}
						}
				}
			},
			/**
			 * 增加奖励，需要验证
			 */
			addAward() {
				const _this = this
				const paramOn = {
					isNewVip: 1,
					//奖品名称
					prizeName: _this.oldInvite.nameOn,
					//邀请人数
					inviteCount: parseInt(_this.oldInvite.peopleOn),
					prizeImg: _this.oldInvite.imageOn,
					//奖励类型
					rewardType: parseInt(_this.oldInvite.typeOn),
					//积分
					integral: _this.oldJF == '' ? null : parseInt(_this.oldJF),
					//优惠券礼品卡id
					couponId: _this.couponId == null ? null : _this.couponId ,
					couponList: _this.templateList == null ? [] : _this.templateList
				}
				this.$emit('getOldData', paramOn,this.oldLevel)
			},
		},
		computed: {
			imageWarn() {
				return this.oldInvite.imageOn
			}
		},
		watch: {
			imageWarn() {
				if (this.oldInvite.imageOn == '') {
					this.warn.warnImg = true
				} else {
					this.warn.warnImg = false
				}
			},
			awardLimit(n) {
				this.$emit('getLimit', parseInt(n))
			}
		}
	}
</script>

<style scoped>
	div {
		margin-top: 10px;
	}

	.title {
		margin-bottom: 10px;
		font-size: initial;
		font-weight: bolder;
	}

	.basic,
	.selectTime,
	.award .award-set {
		padding-left: 20px;
	}

	.award-set-detail {
		padding-left: 40px;
	}
</style>
