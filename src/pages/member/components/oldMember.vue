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
		<div class="award-set-detail" style="border: 1px solid #3A87AD;padding-top: 10px;border-radius: 10px;" v-if="awardOne">
			<p style="color: red;display: flex;justify-content: space-between;align-items: center;">
				<span>*奖励所有设置均为必填项</span>
				<a-icon type="close-circle" style="margin-right: 15px;font-size: 20px;cursor: pointer;"
					v-if="oldLevel == 2 && !isCloseB" @click="deleteOld" />
				<a-icon type="close-circle" style="margin-right: 15px;font-size: 20px;cursor: pointer;"
					v-if="oldLevel == 3 && isCloseB" @click="deleteOld" />
			</p>
			<div>
				奖励名称：
				<a-input placeholder="输入奖励名称" :maxLength="10" style="width: 20%;" v-model="oldInvite.nameOn"
					@blur="blurValidate(1)" />
				<p style="color: red;" v-show="warn.warnName">请输入奖励名称</p>
			</div>
			<div>
				邀请人数：
				<a-input placeholder="输入邀请人数" :maxLength="2" style="width: 20%;" v-model="oldInvite.peopleOn"
					@blur="blurValidate(2)" />
				<p style="color: red;" v-show="warn.warnPeople">请输入邀请人数</p>
			</div>
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
					<a-input placeholder="输入积分" :maxLength="2" style="width: 30%;" v-model="oldJF"
						@blur="blurValidate(3)" />
					<p style="color: red;margin-top: 5px;" v-show="warn.warnJF">请输入积分</p>
				</div>
				<div v-show="oldInvite.typeOn == 1 || oldInvite.typeOn == 3">
					<a-input :placeholder="oldInvite.typeOn == 1 ? '输入优惠券批次号' : '输入礼品卡批次号'" :maxLength="20"
						style="width: 30%;" v-model="oldPCH" @blur="blurValidate(3)" />
					<a-button type="primary" @click="addNewId" style="margin-left:10px">
						添加
					</a-button>
					<p style="color: red;margin-top: 5px;" v-show="warn.warnPCH">
						{{oldInvite.typeOn == 1 ? '请添加优惠券' : '请添加礼品卡'}}
					</p>
				</div>
			</div>
			<a-form-model-item label="礼品卡图片" extra="图片比例1:1,png/jpg格式,2M以内" v-if="oldInvite.typeOn == 3">
				<upload-file @uploadPic="uploadPicOn" :img="oldInvite.imageOn" v-model="oldInvite.imageOn" v-if="oldLevel == 1">
				</upload-file>
				<upload-file @uploadPic="uploadPicTw" :img="oldInvite.imageTw" v-model="oldInvite.imageTw" v-if="oldLevel == 2">
				</upload-file>
				<upload-file @uploadPic="uploadPicTh" :img="oldInvite.imageTh" v-model="oldInvite.imageTh" v-if="oldLevel == 3">
				</upload-file>
				<p style="color: red;" v-show="warn.warnImg">请上传礼品卡图片</p>
			</a-form-model-item>
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
		props: {
			isShowMore: {
				type: Boolean,
				default: true
			},
			oldLevel: {
				type: Number,
				default: 1
			},
			isCloseB: {
				type: Boolean,
				default: false
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
		created() {
			// console.log(this.oldLevel,this.isCloseB)
		},
		methods: {
			...mapActions("userActivity", ["getCoupon"]),
			deleteOld() {
				this.$emit('deleteOld', this.oldLevel)
			},
			/**
			 * 验证老用户奖励方法
			 */
			validate() {
				if (this.oldInvite.nameOn == '') this.warn.warnName = true
				if (this.oldInvite.peopleOn == '') this.warn.warnPeople = true
				if (this.oldInvite.typeOn == 3){
					if(this.oldLevel == 1 && this.oldInvite.imageOn == '') this.warn.warnImg = true
					if(this.oldLevel == 2 && this.oldInvite.imageTw == '') this.warn.warnImg = true
					if(this.oldLevel == 3 && this.oldInvite.imageTh == '') this.warn.warnImg = true
				} 
				//判断奖励类型是否添加
				if (this.oldInvite.typeOn == '2') {
					if (this.oldJF == '') this.warn.warnJF = true
				} else if (this.oldInvite.typeOn == '1' || this.oldInvite.typeOn == '3') {
					if (this.isRemove == false) this.warn.warnPCH = true
				}
				//有验证不通过则不能提交
				console.log(this.oldLevel)
				// console.log(this.warn.warnName,this.warn.warnPeople,this.warn.warnImg,this.warn.warnJF,this.warn.warnPCH)
				if (!this.warn.warnName && !this.warn.warnPeople && !this.warn.warnImg && !this.warn.warnJF && !this.warn
					.warnPCH) {
					console.log('通过了')
					this.addAward()
				} else {
					this.$message.error({
						content: '老会员奖励有必填项未填写，请检查',
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
				this.warn.warnImg = false
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
					const response = await this.getCoupon({
						"templateCode": this.oldPCH
					});
					console.log(response)
					if (response.code != 200) {
						this.$message.error({
							content: response.msg,
						})
					} else {
						if (this.oldInvite.typeOn == 1) {
							//此时优惠券
							if (response.data[0].couponTypeCode != 'DJQ') {
								this.$message.error({
									content: '请输入优惠券批次号',
								})
								return false
							}
						} else {
							if (response.data[0].couponTypeCode != 'LPQ') {
								this.$message.error({
									content: '请输入礼品卡批次号',
								})
								return false
							}
						}
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
							if (this.isRemove == false && this.oldPCH == '') {
								this.warn.warnPCH = true
							} else {
								this.warn.warnPCH = false
							}
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
					prizeName: _this.oldInvite.nameOn.toString(),
					//邀请人数
					inviteCount: parseInt(_this.oldInvite.peopleOn),
					prizeImg: null,
					//奖励类型
					rewardType: parseInt(_this.oldInvite.typeOn),
					//积分
					integral: _this.oldJF == '' ? null : parseInt(_this.oldJF),
					//优惠券礼品卡id
					couponId: _this.couponId == null ? null : _this.couponId,
					couponList: []
				}
				if (_this.templateList != null) paramOn.couponList.push(_this.templateList)
				if (_this.oldLevel == 1) _this.oldInvite.imageOn == '' ? (paramOn.prizeImg = null) : (paramOn.prizeImg =
					_this.oldInvite.imageOn)
				if (_this.oldLevel == 2) _this.oldInvite.imageTw == '' ? (paramOn.prizeImg = null) : (paramOn.prizeImg =
					_this.oldInvite.imageTw)
				if (_this.oldLevel == 3) _this.oldInvite.imageTh == '' ? (paramOn.prizeImg = null) : (paramOn.prizeImg =
					_this.oldInvite.imageTh)
				this.$emit('getOldData', paramOn, this.oldLevel)
			},
		},
		computed: {
			imageOnWarn() {
				return this.oldInvite.imageOn
			},
			imageTwWarn() {
				return this.oldInvite.imageTw
			},
			imageThWarn() {
				return this.oldInvite.imageTh
			}
		},
		watch: {
			imageOnWarn(v) {
				if (v != '') this.warn.warnImg = false
			},
			imageTwWarn(v) {
				if (v != '') this.warn.warnImg = false
			},
			imageThWarn(v) {
				if (v != '') this.warn.warnImg = false
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
