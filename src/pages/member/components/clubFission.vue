<template>
	<a-modal :width="800" v-model="clubFissionVisible" :title="'邀请好友参加活动'" cancelText="取消" okText="保存" :centered="true"
	 :keyboard="false" :maskClosable="false" :closable="false" :confirmLoading="loading" @ok="verifyData" @cancel="cancelCallback"
	 :destroyOnClose="true">
		<a-form-model ref="ruleForm" :model="formData" :rules="rules">
			<div class="title">基础设置</div>
			<div class="basic">
				<div>
					是否club展示：
					<a-switch checked-children="是" un-checked-children="否" v-model="isShowClub" />
				</div>
				<a-form-model-item label="活动名称" ref="activeName" prop="activeName">
					<a-input placeholder="输入活动名称(限制50字符)" :maxLength="50" style="width: 50%;" v-model="formData.activeName" @blur="()=>{$refs.activeName.onFieldBlur()}" />
				</a-form-model-item>
				<div>
					活动时间：
					<a-form-model-item label="开始时间" required prop="startDate">
						<a-date-picker v-model="formData.startDate" :show-time="showTimeOptions" type="date" placeholder="选择开始时间" style="width: 50%;"
						 :allowClear="false" format="YYYY-MM-DD HH:mm:ss" @change="getStartTime" />
					</a-form-model-item>
					<a-form-model-item label="结束时间" required prop="endDate">
						<a-date-picker v-model="formData.endDate" :show-time="showTimeOptions" type="date" placeholder="选择结束时间" style="width: 50%;"
						 :allowClear="false" format="YYYY-MM-DD HH:mm:ss" @change="getEndTime" />
					</a-form-model-item>
				</div>
				<div>
					<a-form-model-item label="好友邀请卡片" extra="png/jpg格式，2M以内">
						<div>好友分享标题：
							<a-input placeholder="输入好友分享标题(限制20字符)" :maxLength="20" style="width: 30%;" v-model="friend.title" />
						</div>
						<upload-file @uploadPic="uploadFPic" :img="friend.image" v-model="friend.image"></upload-file>
					</a-form-model-item>
					<a-form-model-item label="朋友圈分享" extra="png/jpg格式，2M以内">
						<div>朋友圈分享标题：
							<a-input placeholder="输入朋友圈分享标题(限制20字符)" :maxLength="20" style="width: 30%;" v-model="friendC.title" />
						</div>
						<upload-file @uploadPic="uploadFCPic" :img="friendC.image" v-model="friendC.image"></upload-file>
					</a-form-model-item>
					<a-form-model-item label="活动主题页背景" extra="png/jpg格式，2M以内">
						<upload-file @uploadPic="uploadBPic" :img="activeBackImage" v-model="activeBackImage"></upload-file>
					</a-form-model-item>
				</div>
				<div>权益内容：
					<UEditor @input="getRule"></UEditor>
				</div>
			</div>
			<div class="title">奖励设置</div>
			<div class="award">
				<div class="award-set">新会员奖励:</div>
				<div class="award-set-detail">
					<div>
						<a-form-model-item label="奖励类型">
							<a-radio-group v-model="formData.newAward" @change="changeNewAward" v-if="formData.newCouponId == null">
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
							<p style="color: red;" v-if="formData.newTemplateList">{{formData.newTemplateList.couponName}}</p>
						</a-form-model-item>
					</div>
					<div v-if="formData.newCouponId == null">
					<div v-show="formData.newAward == 1 || formData.newAward == 3">
						<a-input :placeholder="formData.newAward == 1 ? '输入优惠券批次号' : '输入礼品卡批次号'" :maxLength="20" style="width: 30%;"
						 v-model="formData.newPCH" />
						<a-button type="primary" @click="addNewId" style="margin-left:10px">
							添加
						</a-button>
					</div>
					<div v-show="formData.newAward == 2">
						<a-input placeholder="输入积分" :maxLength="20" style="width: 30%;" v-model="formData.newJF" />
					</div>
					</div>
				</div>
			</div>
			<div class="award">
				<old-member ref="oldAward"></old-member>
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
		props: {
			clubFissionVisible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				formData: {
					activeName: '',
					startDate: '',
					endDate: '',
					newAward: null,
					awardLimit: '',
					content: '',
					newCouponId: null,
					newTemplateList: null,
					newPCH: '',
					newJF: '',
				},
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
			}
		},
		methods: {
			...mapActions("userActivity", ["getCouponTemplates"]),
			/**
			 * 验证提交的数据
			 */
			verifyData() {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						// alert('submit!');
						this.clubFissionSubmit()
					} else {
						// console.log('error submit!!');
						// this.clubFissionSubmit()
						this.$refs.oldAward.validate()
						return false;
					}
				});
			},
			/**
			 * 保存数据,处理参数
			 */
			clubFissionSubmit() {
				const _this = this
				const submitParam = {
					//club是否展示
					isShow: _this.isShowClub == true ? 1 : 0,
					//活动名称
					title: _this.formData.activeName,
					//活动时间
					startTime: _this.startTimeString,
					endTime: _this.endTimeString,
					//分享好友
					friendsTitle: _this.friend.title,
					friendsBg: _this.friend.image,
					//分享朋友圈
					posterTitle: _this.friendC.title,
					posterBg: _this.friendC.image,
					//活动主题背景
					themeBg: _this.activeBackImage,
					//权益内容
					content: _this.formData.content,
					newIsNewVip: 0,
					//被邀请人
					newRewardType: parseInt(_this.formData.newAward),
					newIntegral: _this.formData.newJF,
					newCouponId: _this.formData.newPCH,
					newTemplateList:_this.formData.newTemplateList,
					isNewVip:1,
					//邀请人
					activtyRewardList:[]
				}
				// console.log(_this.formData.newAward)
				// console.log(_this.friendC.title)
				console.log(submitParam)

			},
			/**
			 * @param {Object} moment
			 * @param {String} dateString
			 */
			getStartTime(moment, dateString) {
				this.startTimeString = dateString
			},
			getEndTime(moment, dateString) {
				this.endTimeString = dateString
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
				this.formData.newPCH = ''
				this.formData.newJF = ''
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
					const response = await this.getCouponTemplates({
						"templateCode": this.formData.newPCH
					});
					console.log(response)
					if (response.code != 200) {
						this.$message.error({
							content: response.msg,
						})
					} else {
						this.formData.newCouponId =	response.data[0].templateCode
						this.formData.newTemplateList = response.data[0]
					}
				}
			},


			cancelCallback() {},
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
