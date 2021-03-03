<template>
	<div class="old-member">
		<div class="award-set">老会员奖励</div>
		<div class="award-set-detail">
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
			<div>
				奖励名称：
				<a-input placeholder="输入奖励名称" :maxLength="10" style="width: 20%;" v-model="oldInvite.nameOn" />
			</div>
			<div>
				邀请人数：
				<a-input placeholder="输入邀请人数" :maxLength="5" style="width: 20%;" v-model="oldInvite.peopleOn" />
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
				<p style="color: red;" v-if="templateList">{{templateList.couponName}}</p>
			</div>
			<div v-show="oldInvite.typeOn == 1 || oldInvite.typeOn == 3">
				<a-input :placeholder="oldInvite.typeOn == 1 ? '输入优惠券批次号' : '输入礼品卡批次号'" :maxLength="20" style="width: 30%;"  v-model="oldPCH"/>
				<a-button type="primary" @click="addNewId" style="margin-left:10px">
					添加
				</a-button>
			</div>
			<div v-show="oldInvite.typeOn == 2">
				<a-input placeholder="输入积分" :maxLength="20" style="width: 30%;" v-model="oldJF"/>
			</div>
			<a-form-model-item label="老会员奖励图片" extra="png/jpg格式，2M以内">
				<upload-file @uploadPic="uploadPicOn" :img="oldInvite.imageOn" v-model="oldInvite.imageOn"></upload-file>
			</a-form-model-item>
			<div>
				<a-button type="primary" @click="awardTwo = true" style="margin-bottom: 5px;">
					增加奖励
				</a-button>
			</div>
		</div>
		
		<!-- <div class="award-set-detail" style="border: 1px solid #3A87AD;" v-if="awardOne && awardTwo">
			<div>
				奖励名称：
				<a-input placeholder="输入奖励名称" :maxLength="10" style="width: 20%;" v-model="formData.oldInvite.nameOn" />
			</div>
			<div>人数：
				<a-input placeholder="输入人数" :maxLength="5" style="width: 20%;" v-model="formData.oldInvite.peopleOn" />
			</div>
			<div>奖励类型：
				<a-radio-group v-model="formData.oldInvite.typeOn">
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
			</div>
			<div v-show="formData.oldInvite.typeOn == 1 || formData.oldInvite.typeOn == 3">
				<a-input :placeholder="formData.oldInvite.typeOn == 1 ? '输入优惠券批次号' : '输入礼品卡批次号'" :maxLength="20" style="width: 30%;" />
				<a-button type="primary" @click="addNewId" style="margin-left:10px">
					添加
				</a-button>
			</div>
			<div v-show="formData.oldInvite.typeOn == 2">
				<a-input placeholder="输入积分" :maxLength="20" style="width: 30%;" />
			</div>
			<a-form-model-item label="老会员奖励图片" extra="png/jpg格式，2M以内">
				<upload-file @uploadPic="uploadPicOn" :img="formData.oldInvite.imageOn" v-model="formData.oldInvite.imageOn"></upload-file>
			</a-form-model-item>
			<div>
				<a-button type="primary" @click="awardThree = true" style="margin-bottom: 5px;">
					增加奖励
				</a-button>
			</div>
		</div>
		
		<div class="award-set-detail" style="border: 1px solid #3A87AD;" v-if="awardOne && awardTwo && awardThree">
			<div>
				奖励名称：
				<a-input placeholder="输入奖励名称" :maxLength="10" style="width: 20%;" v-model="formData.oldInvite.nameOn" />
			</div>
			<div>人数：
				<a-input placeholder="输入人数" :maxLength="5" style="width: 20%;" v-model="formData.oldInvite.peopleOn" />
			</div>
			<div>奖励类型：
				<a-radio-group v-model="formData.oldInvite.typeOn">
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
			</div>
			<div v-show="formData.oldInvite.typeOn == 1 || formData.oldInvite.typeOn == 3">
				<a-input :placeholder="formData.oldInvite.typeOn == 1 ? '输入优惠券批次号' : '输入礼品卡批次号'" :maxLength="20" style="width: 30%;" />
				<a-button type="primary" @click="addNewId" style="margin-left:10px">
					添加
				</a-button>
			</div>
			<div v-show="formData.oldInvite.typeOn == 2">
				<a-input placeholder="输入积分" :maxLength="20" style="width: 30%;" />
			</div>
			<a-form-model-item label="老会员奖励图片" extra="png/jpg格式，2M以内">
				<upload-file @uploadPic="uploadPicOn" :img="formData.oldInvite.imageOn" v-model="formData.oldInvite.imageOn"></upload-file>
			</a-form-model-item>
		</div> -->
	</div>
</template>

<script>
	import {mapActions} from 'vuex'
	import uploadFile from "../../components/UploadFile"
	export default{
		name:"oldMember",
		components: {
			uploadFile,
		},
		data(){
			return{
				awardOne: true,
				awardTwo: false,
				awardThree: false,
				awardLimit:'',
				couponId:null,
				templateList:null,
				oldJF:'',
				oldPCH:'',
				oldInvite:{
					imageOn: '',
					imageTw: '',
					imageTh: '',
					nameOn: '',
					nameTw: '',
					nameTh: '',
					peopleOn: '',
					peopleTw: '',
					peopleTh: '',
					typeOn: '',
					typeTw: '',
					typeTh: ''
				}
			}
		},
		methods:{
			...mapActions("userActivity", ["getCouponTemplates"]),
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
						this.couponId =	response.data[0].templateCode
						this.templateList = response.data[0]
					}
				}
			},
			/**
			 * 验证老用户奖励方法
			 */
			validate(){
				const _this = this
				const paramOn = {
					//奖品名称
					prizeName:_this.oldInvite.nameOn,
					//邀请人数
					inviteCount:_this.oldInvite.peopleOn,
					//奖励类型
					rewardType:_this.oldInvite.typeOn,
					//积分
					integral:_this.oldJF,
					//优惠券礼品卡id
					couponId:_this.couponId,
					templateList:_this.templateList,
					prizeImg:_this.oldInvite.imageOn
				}
				console.log(Object.values(paramOn))
			}
		},
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
