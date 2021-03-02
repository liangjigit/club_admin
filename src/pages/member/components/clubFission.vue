<template>
	<a-modal :width="800" v-model="clubFissionVisible" :title="'邀请好友参加活动'" cancelText="取消" okText="保存" :centered="true"
	 :keyboard="false" :maskClosable="false" :closable="false" :confirmLoading="loading" @ok="clubFissionSubmit" @cancel="cancelCallback"
	 :destroyOnClose="true">
		<a-form-model :model="formData" :rules="rules">
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
						 :allowClear="false" format="YYYY-MM-DD HH:mm"/>
					</a-form-model-item>
					<a-form-model-item label="结束时间" required prop="endDate">
						<a-date-picker v-model="formData.endDate" :show-time="showTimeOptions" type="date" placeholder="选择结束时间" style="width: 50%;"
						 :allowClear="false" format="YYYY-MM-DD HH:mm"/>
					</a-form-model-item>
				</div>
				<div>
					<a-form-model-item label="好友邀请卡片" extra="png/jpg格式，2M以内">
						<div>好友分享标题：
							<a-input placeholder="输入好友分享标题(限制20字符)" :maxLength="20" style="width: 30%;" v-model="friend.title" />
						</div>
						<upload-file @uploadPic="uploadPic" :img="friend.image" v-model="friend.image"></upload-file>
					</a-form-model-item>
					<a-form-model-item label="朋友圈分享" extra="png/jpg格式，2M以内">
						<div>朋友圈分享标题：
							<a-input placeholder="输入朋友圈分享标题(限制20字符)" :maxLength="20" style="width: 30%;" v-model="friendC.title" />
						</div>
						<upload-file @uploadPic="uploadPic" :img="friendC.image" v-model="friendC.image"></upload-file>
					</a-form-model-item>
					<a-form-model-item label="活动主题页背景" extra="png/jpg格式，2M以内">
						<upload-file @uploadPic="uploadPic" :img="activeBackImage" v-model="activeBackImage"></upload-file>
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
						<a-form-model-item label="奖励名称" ref="newAwardName" prop="newAwardName">
							<a-input placeholder="输入奖励名称(限制10字符)" :maxLength="10" style="width: 30%;" v-model="formData.newAwardName" @blur="()=>{$refs.newAwardName.onFieldBlur()}" />
						</a-form-model-item>
					</div>
					<a-form-model-item label="新会员奖励图片" extra="png/jpg格式，2M以内">
						<upload-file @uploadPic="uploadPic" :img="inviteForm.image" v-model="inviteForm.image"></upload-file>
					</a-form-model-item>
					<div>奖励类型：
						<a-radio-group v-model="awardValue" @change="changeAward">
							<a-radio :value="1">
								积分
							</a-radio>
							<a-radio :value="2">
								优惠券/礼品卡
							</a-radio>
						</a-radio-group>
					</div>
					<div v-show="awardValue == 1">
						<a-input placeholder="输入积分" :maxLength="50" style="width: 50%;" />
					</div>
					<div v-show="awardValue == 2">
						<a-input placeholder="输入批次号" :maxLength="50" style="width: 50%;" />
					</div>
				</div>
				<div class="award-set">老会员奖励</div>
				<div class="award-set-detail">
					奖励领取是否限次：
					<a-switch checked-children="限次" un-checked-children="不限次" v-model="isShowClub" />
				</div>
				<div class="award-set-detail" v-if="awardOne">
					<div>
						奖励名称：
						<a-input placeholder="输入奖励名称" :maxLength="50" style="width: 20%;" />
					</div>
					<a-form-model-item label="新会员奖励图片" extra="png/jpg格式，2M以内">
						<upload-file @uploadPic="uploadPic" :img="inviteForm.image" v-model="inviteForm.image"></upload-file>
					</a-form-model-item>
					<div>人数：
						<a-input placeholder="输入人数" :maxLength="50" style="width: 20%;" />
					</div>
					<div>奖励类型：
						<a-radio-group v-model="awardOneValue" @change="changeAward">
							<a-radio :value="1">
								积分
							</a-radio>
							<a-radio :value="2">
								卡券
							</a-radio>
						</a-radio-group>
					</div>
					<div v-show="awardOneValue == 1">
						<a-input placeholder="输入积分" :maxLength="50" style="width: 50%;" />
						&nbsp;&nbsp;
						<a-icon type="plus-circle" @click="awardTwo = true" />
					</div>
					<div v-show="awardOneValue == 2">
						<a-input placeholder="输入批次号" :maxLength="50" style="width: 50%;" />
						&nbsp;&nbsp;
						<a-icon type="plus-circle" @click="awardTwo = true" />
					</div>
				</div>
				<div class="award-set-detail" v-if="awardOne && awardTwo">
					<div>
						奖励名称：
						<a-input placeholder="输入奖励名称" :maxLength="50" style="width: 20%;" />
					</div>
					<a-form-model-item label="新会员奖励图片" extra="png/jpg格式，2M以内">
						<upload-file @uploadPic="uploadPic" :img="inviteForm.image" v-model="inviteForm.image"></upload-file>
					</a-form-model-item>
					<div>人数：
						<a-input placeholder="输入人数" :maxLength="50" style="width: 20%;" />
					</div>
					<div>奖励类型：
						<a-radio-group v-model="awardTwoValue" @change="changeAward">
							<a-radio :value="1">
								积分
							</a-radio>
							<a-radio :value="2">
								卡券
							</a-radio>
						</a-radio-group>
					</div>
					<div v-show="awardTwoValue == 1">
						<a-input placeholder="输入积分" :maxLength="50" style="width: 50%;" />
						&nbsp;&nbsp;
						<a-icon type="plus-circle" @click="awardThree = true" />
					</div>
					<div v-show="awardTwoValue == 2">
						<a-input placeholder="输入批次号" :maxLength="50" style="width: 50%;" />
						&nbsp;&nbsp;
						<a-icon type="plus-circle" @click="awardThree = true" />
					</div>
				</div>
				<div class="award-set-detail" v-if="awardOne && awardTwo && awardThree">
					<div>
						奖励名称：
						<a-input placeholder="输入奖励名称" :maxLength="50" style="width: 20%;" />
					</div>
					<a-form-model-item label="新会员奖励图片" extra="png/jpg格式，2M以内">
						<upload-file @uploadPic="uploadPic" :img="inviteForm.image" v-model="inviteForm.image"></upload-file>
					</a-form-model-item>
					<div>人数：
						<a-input placeholder="输入人数" :maxLength="50" style="width: 20%;" />
					</div>
					<div>奖励类型：
						<a-radio-group v-model="awardThreeValue" @change="changeAward">
							<a-radio :value="1">
								积分
							</a-radio>
							<a-radio :value="2">
								卡券
							</a-radio>
						</a-radio-group>
					</div>
					<div v-show="awardThreeValue == 1">
						<a-input placeholder="输入积分" :maxLength="50" style="width: 50%;" />
					</div>
					<div v-show="awardThreeValue == 2">
						<a-input placeholder="输入批次号" :maxLength="50" style="width: 50%;" />
					</div>
				</div>
			</div>
		</a-form-model>
	</a-modal>
</template>

<script>
	import uploadFile from "../../components/UploadFile"
	import UEditor from "../../components/UEditor.vue"
	export default {
		name: 'clubFission',
		components: {
			uploadFile,
			UEditor
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
					newAwardName:''
				},
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
					newAwardName: [{
						required: true,
						message: '请输入奖励名称',
						trigger: 'blur'
					}],
				},
				isShowClub: true,
				showTimeOptions:{
					format:"HH:mm"
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
				inviteForm: {
					image: ''
				},
				awardValue: 1,
				awardOneValue: 1,
				awardTwoValue: 1,
				awardThreeValue: 1,
				awardOne: true,
				awardTwo: false,
				awardThree: false,
				rulesA: {
					required: true,
					message: 'Please input Activity name',
					trigger: 'blur'
				},


			}
		},
		methods: {
			/**
			 * @param {Object} option
			 * 上传图片
			 */
			uploadPic(option) {
				// this.inviteForm.image = option.imageUrl;
				console.log(option)
			},
			/**
			 * @param {Object} content
			 * 获取权益内容
			 */
			getRule(content) {
				console.log(content)
			},
			/**
			 * 保存数据,处理参数
			 */
			clubFissionSubmit() {
				const _this = this
				const submitParam = {
					//club是否展示
					a: 0,
					//活动名称
					title: _this.activeTitle,
					//活动时间
					time: _this.activeTime,
				}
				console.log(this.activeTime)
				//club是否展示
				_this.isShowClub == true ? submitParam.a = 0 : submitParam.a = 1

			},
			cancelCallback() {},

			changeAward() {},
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
