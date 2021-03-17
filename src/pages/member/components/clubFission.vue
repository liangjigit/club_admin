<template>
	<a-modal :width="800" v-model="clubFissionVisible" :title="'邀请好友参加活动'" cancelText="取消" okText="保存" :centered="true"
		:keyboard="false" :maskClosable="false" :closable="false" :confirmLoading="loading" @ok="verifyData"
		@cancel="cancelCallback" :destroyOnClose="true">
		<a-form-model ref="ruleForm" :model="formData" :rules="rules">
			<div class="title">基础设置</div>
			<div class="basic">
				<div>
					是否club展示：
					<a-switch checked-children="是" un-checked-children="否" v-model="isShowClub" />
				</div>
				<div>
					活动标识：
					<a-select default-value="FL" style="width: 10%" @change="changeSelect">
						<a-select-option value="FL">
							FL
						</a-select-option>
					</a-select>
				</div>
				<a-form-model-item label="活动名称" ref="activeName" prop="activeName">
					<a-input placeholder="输入活动名称(限制50字符)" :maxLength="50" style="width: 50%;"
						v-model="formData.activeName" @blur="()=>{$refs.activeName.onFieldBlur()}" />
				</a-form-model-item>
				<div>
					活动时间：
					<a-form-model-item label="开始时间" required prop="startDate">
						<a-date-picker v-model="formData.startDate" :show-time="showTimeOptions" type="date"
							placeholder="选择开始时间" style="width: 50%;" :allowClear="false" format="YYYY-MM-DD HH:mm:ss"
							@change="getStartTime" />
					</a-form-model-item>
					<a-form-model-item label="结束时间" required prop="endDate">
						<a-date-picker v-model="formData.endDate" :show-time="showTimeOptions" type="date"
							placeholder="选择结束时间" style="width: 50%;" :allowClear="false" format="YYYY-MM-DD HH:mm:ss"
							@change="getEndTime" />
					</a-form-model-item>
				</div>
				<div>
					<a-form-model-item label="好友邀请卡片" extra="png/jpg格式，2M以内">
						<div>好友分享标题：
							<a-input placeholder="输入好友分享标题(限制20字符)" :maxLength="20" style="width: 30%;"
								v-model="friend.title" />
						</div>
						<upload-file @uploadPic="uploadFPic" :img="friend.image" v-model="friend.image"></upload-file>
					</a-form-model-item>
					<a-form-model-item label="朋友圈分享" extra="png/jpg格式，2M以内">
						<div>朋友圈分享标题：
							<a-input placeholder="输入朋友圈分享标题(限制20字符)" :maxLength="20" style="width: 30%;"
								v-model="friendC.title" />
						</div>
						<upload-file @uploadPic="uploadFCPic" :img="friendC.image" v-model="friendC.image">
						</upload-file>
					</a-form-model-item>
					<a-form-model-item label="活动主题页背景" extra="png/jpg格式，2M以内">
						<upload-file @uploadPic="uploadBPic" :img="activeBackImage" v-model="activeBackImage">
						</upload-file>
					</a-form-model-item>
				</div>
				<div><span style="color: red;margin-right: 5px;">*</span>权益内容：
					<UEditor @input="getRule"></UEditor>
				</div>
			</div>
			<div class="title">奖励设置</div>
			<div class="award">
				<div class="award-set">新会员奖励:</div>
				<div class="award-set-detail">
					<div>
						<a-form-model-item label="奖励类型">
							<a-radio-group v-model="formData.newAward" @change="changeNewAward"
								v-if="formData.newCouponId == null">
								<a-radio value="0">
									无
								</a-radio>
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
								<p style="color: red;" v-if="formData.newTemplateList">
									{{formData.newTemplateList.couponName}}
									<a-button type="primary" @click="removeNewId" style="margin-left:10px">
										移除
									</a-button>
								</p>
							</div>
						</a-form-model-item>
					</div>
					<div v-if="formData.newCouponId == null">
						<div v-show="formData.newAward == 1 || formData.newAward == 3">
							<a-input :placeholder="formData.newAward == 1 ? '输入优惠券批次号' : '输入礼品卡批次号'" :maxLength="20"
								style="width: 30%;" v-model="formData.newPCH" />
							<a-button type="primary" @click="addNewId" style="margin-left:10px">
								添加
							</a-button>
							<p style="color: red;margin-top: 5px;" v-show="warnPCH">
								请添加{{formData.newAward == 1 ? '优惠券' : '礼品卡'}}</p>
						</div>
						<div v-show="formData.newAward == 2">
							<a-input placeholder="输入积分" :maxLength="20" style="width: 30%;" v-model="formData.newJF"
								@blur="checkJF" />
							<p style="color: red;margin-top: 5px;" v-show="warnJF">请填写积分</p>
						</div>
					</div>
				</div>
			</div>
			<div class="award">
				<old-member ref="oldAward" @getOldData="getOldData" @getLimit="getLimit"></old-member>
			</div>
			<div class="award" v-if="theOldTwo">
				<old-member ref="oldAwardTwo" :isShowMore="false" :oldLevel="2" @getOldData="getOldData"
					@getLimit="getLimit">
				</old-member>
			</div>
			<div class="award" v-if="theOldThree">
				<old-member ref="oldAwardThree" :isShowMore="false" :oldLevel="3" @getOldData="getOldData"
					@getLimit="getLimit">
				</old-member>
			</div>
			<div v-if="!theOldThree">
				<a-button type="primary" @click="addOldAward" style="margin-top: 10px;">
					增加奖励
				</a-button>
			</div>
		</a-form-model>
	</a-modal>
</template>

<script>
	import uploadFile from "../../components/UploadFile"
	import UEditor from "../../components/UEditor.vue"
	import oldMember from "./oldMember.vue"
	import {
		mapActions
	} from 'vuex'
	export default {
		name: 'clubFission',
		components: {
			uploadFile,
			UEditor,
			oldMember
		},
		// props: {
		// 	clubFissionVisible: {
		// 		type: Boolean,
		// 		default: false
		// 	}
		// },
		data() {
			return {
				clubFissionVisible: true,
				formData: {
					activeName: '',
					startDate: '',
					endDate: '',
					newAward: '0',
					awardLimit: '',
					content: '',
					newCouponId: null,
					newTemplateList: null,
					newPCH: '',
					newJF: '',
					activeType: 'FL',
				},
				warnPCH: false,
				warnJF: false,
				startTimeString: '',
				endTimeString: '',
				rules: {
					activeName: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
					startDate: [{
						required: true,
						message: '请选择开始时间',
						trigger: 'change'
					}],
					endDate: [{
						required: true,
						message: '请选择结束时间',
						trigger: 'change'
					}],
				},
				isShowClub: true,
				showTimeOptions: {
					format: "HH:mm:ss"
				},
				friend: {
					title: '',
					image: ''
				},
				friendC: {
					title: '',
					image: ''
				},
				activeBackImage: '',
				loading: false,
				isRemove: false,
				oldAwardData: [],
				timeLimit: 1,
				theOldTwo: false,
				theOldThree: false,
				startNumber: 0,
				endNumber: 0,
			}
		},
		created() {
			// const res = this.getFriendFissionConfig({
			// 	pageNum:"1",
			// 	pageSize:"10"
			// })
			// const a = "[{\"couponAmount\":999,\"couponName\":\"分裂活动新用户优惠券啊\",\"couponNum\":1,\"instructions\":\"\",\"subheading\":\"副标题-分裂活动新用户优惠券啊\",\"templateCode\":\"JT20210305000001\"}]";
			// let res =JSON.parse(a)
			// console.log(res)
		},
		methods: {
			...mapActions("userActivity", ["getCoupon", "saveFriendFissionConfig", "getFriendFissionConfig"]),
			changeSelect(value) {
				console.log(value)
				this.formData.activeType = value
			},
			getLimit(n) {
				this.timeLimit = n
			},
			checkJF() {
				if (this.formData.newJF.length == 0) return
				this.warnJF = false
			},
			/**
			 * 验证提交的数据
			 */
			verifyData() {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						console.log('submit')
						if (this.formData.content == '') {
							this.$message.error({
								content: "权益内容不能为空！",
							})
							return false
						}
						this.validateNew()
					} else {
						console.log('error submit!!');
						this.$message.error({
							content: "有必填项未填写，请检查",
						})
						return false;
					}
				});
			},
			/**
			 * 验证新会员奖励
			 */
			validateNew() {
				// console.log(this.formData.newAward)
				if (this.formData.newAward == '2') {
					if (this.formData.newJF == '') {
						this.warnJF = true
						this.$message.error({
							content: "请添加新会员积分",
						})
					} else {
						this.$refs.oldAward.validate()
						// if(this.theOldTwo == true) this.$refs.oldAwardTwo.validate()
						// if(this.theOldThree == true) this.$refs.oldAwardThree.validate()
					}
				} else if (this.formData.newAward == '1' || this.formData.newAward == '3') {
					if (this.isRemove == false) {
						this.warnPCH = true
						this.$message.error({
							content: this.formData.newAward == '1' ? '请添加优惠券' : "请添加礼品卡",
						})
					} else {
						this.$refs.oldAward.validate()
					}
				} else {
					this.$refs.oldAward.validate()
				}
			},
			/**
			 * 保存数据,处理参数
			 */
			async clubFissionSubmit() {
				const _this = this
				const submitParam = {
					//club是否展示
					isShow: _this.isShowClub == true ? 1 : 0,
					//活动标识
					activeType: _this.formData.activeType,
					//活动名称
					title: _this.formData.activeName,
					//活动时间
					startTime: _this.startTimeString,
					endTime: _this.endTimeString,
					//分享好友
					friendsTitle: _this.friend.title || null,
					friendsBg: _this.friend.image || null,
					//分享朋友圈
					posterTitle: _this.friendC.title || null,
					posterBg: _this.friendC.image || null,
					//活动主题背景
					themeBg: _this.activeBackImage || null,
					//权益内容
					content: _this.formData.content || null,
					newIsNewVip: 0,
					//被邀请人（新会员）（一张券）
					newRewardType: parseInt(_this.formData.newAward),
					newIntegral: _this.formData.newJF || null,
					newCouponId: _this.formData.newTemplateList == null ? null : _this.formData.newTemplateList
						.templateCode,
					newCouponList: [],
					//老会员奖励数组
					timeLimit: _this.timeLimit,
					activityRewardList: _this.oldAwardData
				}
				if (_this.formData.newTemplateList == null) {
					submitParam.newCouponList = []
				} else {
					submitParam.newCouponList.length = 0
					submitParam.newCouponList.push(_this.formData.newTemplateList)
				}
				console.log(JSON.stringify(submitParam, null, 2))
				const response = await _this.saveFriendFissionConfig(JSON.stringify(submitParam, null, 2))
				if (response.code == 200) {
					this.$message.success("保存成功");
					this.cancelCallback()
				} else if (response.code == 'fail') {
					this.$message.error({
						content: response.msg,
					})
				}
			},
			/**
			 * @param {Object} moment
			 * @param {String} dateString
			 */
			getStartTime(moment, dateString) {
				this.startNumber = moment._d.getTime()
				const nowTime = +new Date()
				if (this.startNumber < nowTime) {
					this.$message.error({
						content: "活动开始时间不能小于当前时间",
					})
					this.startTimeString = ''
					this.startNumber = 0
					this.formData.startDate = ''
					return false
				}
				this.startTimeString = dateString
				this.validateTime('start')
			},
			getEndTime(moment, dateString) {
				this.endNumber = moment._d.getTime()
				const nowTime = +new Date()
				if (this.endNumber < nowTime) {
					this.$message.error({
						content: "活动结束时间不能小于当前时间",
					})
					this.endTimeString = ''
					this.endNumber = 0
					this.formData.endDate = ''
					return false
				}
				this.endTimeString = dateString
				this.validateTime('end')
			},
			validateTime(type) {
				if (this.startTimeString == '' || this.endTimeString == '') return
				if (this.endNumber < this.startNumber) {
					this.$message.error({
						content: "活动开始时间不能大于活动结束时间",
					})
					if (type == 'start') {
						this.startTimeString = ''
						this.startNumber = 0
						this.formData.startDate = ''
					} else {
						this.endTimeString = ''
						this.endNumber = 0
						this.formData.endDate = ''
					}
				}
			},
			/**
			 * 上传分享好友，朋友圈，背景
			 */
			uploadFPic(url) {
				this.friend.image = url.imageUrl
			},
			uploadFCPic(url) {
				this.friendC.image = url.imageUrl
			},
			uploadBPic(url) {
				this.activeBackImage = url.imageUrl
			},
			/**
			 * @param {Object} content
			 * 获取权益内容
			 */
			getRule(content) {
				this.formData.content = content.content || ''
			},
			/**
			 * 新用户奖励切换触发
			 */
			changeNewAward() {
				this.formData.newJF = ''
				this.formData.newPCH = ''
				this.formData.newCouponId = null
				this.formData.newTemplateList = null
				this.warnJF = false
				this.warnPCH = false
			},
			/**
			 * 添加新会员优惠券，礼品卡
			 */
			async addNewId() {
				if (this.formData.newPCH == null || this.formData.newPCH == '') {
					this.$message.error({
						content: "请输入批次号",
					})
				} else {
					const response = await this.getCoupon({
						"templateCode": this.formData.newPCH
					});
					console.log(response)
					if (response.code != 200) {
						this.$message.error({
							content: response.msg,
						})
					} else {
						if (this.formData.newAward == 1) {
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
						this.formData.newCouponId = response.data[0].templateCode
						this.formData.newTemplateList = response.data[0]
						this.isRemove = true
						this.warnPCH = false
					}
				}
			},
			/**
			 * 删除新会员优惠券，礼品卡
			 */
			removeNewId() {
				this.changeNewAward()
				this.formData.newAward = '0'
				this.isRemove = false
			},
			/**
			 * data Object
			 * 获取老奖励数据
			 */
			getOldData(data, level) {
				if (level == 1) this.oldAwardData.length = 0
				this.oldAwardData.push(data)
				if (this.theOldTwo == true && level == 1) {
					this.$refs.oldAwardTwo.validate()
					return
				}
				if (this.theOldThree == true && level == 2) {
					this.$refs.oldAwardThree.validate()
					return
				}
				this.clubFissionSubmit()
			},
			/**
			 * 添加新的老会员奖励
			 */
			addOldAward() {
				if (this.theOldTwo == false) {
					this.theOldTwo = true
				} else {
					this.theOldThree = true
				}
			},
			/**
			 * 退出
			 */
			cancelCallback() {
				this.$emit('cancel')
			},
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
