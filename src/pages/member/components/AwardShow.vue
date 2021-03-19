<template>
	<a-modal :width="800" v-model="awardShow" :title="'活动详细信息'" :centered="true" :keyboard="false" :maskClosable="false"
		:closable="true" :footer="null" @cancel="cancel" :destroyOnClose="true">
		<a-form-model ref="ruleForm">
			<div class="title">基础设置</div>
			<div class="basic" v-if="awardList != null">
				<div>
					是否club展示：
					<a-tag color="cyan">
						{{awardList.isShow == 1 ? '展示' : '不展示'}}
					</a-tag>
				</div>
				<div>
					活动标识：
					<a-tag color="cyan">
						{{awardList.activeType}}
					</a-tag>
				</div>
				<a-form-model-item label="活动名称">
					<a-tag color="cyan">
						{{awardList.title}}
					</a-tag>
				</a-form-model-item>
				<div>
					活动时间：
					<a-form-model-item label="开始时间">
						<a-tag color="cyan">
							{{awardList.startTime}}
						</a-tag>
					</a-form-model-item>
					<a-form-model-item label="结束时间">
						<a-tag color="cyan">
							{{awardList.endTime}}
						</a-tag>
					</a-form-model-item>
				</div>
				<div>
					<a-form-model-item label="好友邀请卡片" v-if="awardList.friendsTitle && awardList.friendsBg">
						<div v-if="awardList.friendsTitle != null">好友分享标题：
							<a-tag color="cyan">
								{{awardList.friendsTitle}}
							</a-tag>
						</div>
						<img v-if="awardList.friendsBg != null" :src="awardList.friendsBg" :width="320" alt="图片加载失败" />
					</a-form-model-item>
					<a-form-model-item label="活动主题页背景" v-if="awardList.themeBg != null">
						<img v-if="awardList.themeBg != null" :src="awardList.themeBg" :width="320" alt="图片加载失败" />
					</a-form-model-item>
				</div>
				<div>权益内容：
					<a-tag color="cyan">
						<div v-html="awardList.content"></div>
					</a-tag>
				</div>
			</div>
			<div class="title">奖励设置</div>
			<div class="award">
				<div class="award-set" v-if="awardList.newRewardType != 0">新会员奖励:</div>
				<div class="award-set-detail">
					<div>
						<div v-if="awardList.newRewardType == 1">
							<a-tag color="cyan">
								{{newCouponList[0].couponName}}
							</a-tag>
						</div>
						<div v-if="awardList.newRewardType == 2">
							<a-tag color="cyan">
								{{awardList.newIntegral}}积分
							</a-tag>
						</div>
						<div v-if="awardList.newRewardType == 3">
							<a-tag color="cyan">
								{{newCouponList[0].couponName}}
							</a-tag>
						</div>
					</div>
				</div>
				<div class="award-set">老会员奖励:</div>
				<div class="award-set-detail">
					<div v-if="oldCouponList[0]">
						<div v-if="oldCouponList[0].rewardType == 1">
							<a-tag color="cyan">
								{{oldListOn[0].couponName}}
							</a-tag>
						</div>
						<div v-if="oldCouponList[0].rewardType == 2">
							<a-tag color="cyan">
								{{oldCouponList[0].integral}}积分
							</a-tag>
						</div>
						<div v-if="oldCouponList[0].rewardType == 3">
							<a-tag color="cyan">
								{{oldListOn[0].couponName}}
							</a-tag>
						</div>
					</div>
					<div v-if="oldCouponList[1]">
						<div v-if="oldCouponList[1].rewardType == 1">
							<a-tag color="cyan">
								{{oldListTw[0].couponName}}
							</a-tag>
						</div>
						<div v-if="oldCouponList[1].rewardType == 2">
							<a-tag color="cyan">
								{{oldCouponList[1].integral}}积分
							</a-tag>
						</div>
						<div v-if="oldCouponList[1].rewardType == 3">
							<a-tag color="cyan">
								{{oldListTw[0].couponName}}
							</a-tag>
						</div>
					</div>
					<div v-if="oldCouponList[2]">
						<div v-if="oldCouponList[2].rewardType == 1">
							<a-tag color="cyan">
								{{oldListTh[0].couponName}}
							</a-tag>
						</div>
						<div v-if="oldCouponList[2].rewardType == 2">
							<a-tag color="cyan">
								{{oldCouponList[2].integral}}积分
							</a-tag>
						</div>
						<div v-if="oldCouponList[2].rewardType == 3">
							<a-tag color="cyan">
								{{oldListTh[0].couponName}}
							</a-tag>
						</div>
					</div>
				</div>
			</div>
		</a-form-model>
	</a-modal>
</template>

<script>
	export default {
		name: "awardShow",
		props: {
			awardList: {
				type: Object,
				default () {
					return null
				}
			}
		},
		data() {
			return {
				awardShow: true,
				newCouponList: null,
				oldCouponList:null,
				oldListOn:null,
				oldListTw:null,
				oldListTh:null,
			}
		},
		created() {
			this.newCouponList = JSON.parse(this.awardList.newCouponList)
			this.oldCouponList = this.awardList.activityRewardList.sort(function(a,b){
				return a.inviteCount - b.inviteCount
			})
			if(this.oldCouponList[0]) this.oldListOn = JSON.parse(this.oldCouponList[0].couponList) 
			if(this.oldCouponList[1]) this.oldListTw = JSON.parse(this.oldCouponList[1].couponList)
			if(this.oldCouponList[2]) this.oldListTh = JSON.parse(this.oldCouponList[2].couponList)
			// console.log(this.oldListOn)
		},
		methods: {
			//退出
			cancel() {
				this.$emit('cancel')
			},
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
