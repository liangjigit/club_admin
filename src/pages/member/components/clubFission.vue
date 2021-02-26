<template>
	<a-modal :width="800" v-model="clubFissionVisible" :title="'邀请好友参加活动'" cancelText="取消" okText="保存" :centered="true"
	 :keyboard="false" :maskClosable="false" :closable="false" :confirmLoading="loading" @ok="userActivitySubmit" @cancel="cancelCallback"
	 :destroyOnClose="true">
		<!-- <p>
				<a-alert message="用户参加社区活动并完成活动签到可获取礼包，礼包可包含积分和优惠券" banner />
			</p> -->
		<div class="title">基础设置</div>
		<div class="basic">
			<div>
				是否club展示：
				<a-switch checked-children="是" un-checked-children="否" v-model="isShowClub" />
			</div>
			<div>
				活动名称：
				<a-input placeholder="输入活动名称" :maxLength="50" style="width: 50%;" />
			</div>
			<div>
				活动时间：
				<div class="selectTime">
					<div>起始时间：
						<a-date-picker @change="onChangeStart" />
						<a-time-picker format="HH:mm" />
					</div>
					<div>结束时间：
						<a-date-picker @change="onChangeStart" />
						<a-time-picker format="HH:mm" />
					</div>
				</div>
			</div>
			<div>
				<a-form-model-item label="海报图片" extra="png/jpg格式，2M以内">
					<upload-file @uploadPic="uploadPic" :img="inviteForm.image" v-model="inviteForm.image"></upload-file>
				</a-form-model-item>
			</div>
		</div>
		<div class="title">奖励设置</div>

	</a-modal>
</template>

<script>
	export default {
		name: 'clubFission',
		props: {
			clubFissionVisible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isShowClub: true,
				loading: false,
			}
		},
		methods: {
			onChangeStart(date, dateString) {
				console.log(date, dateString);
			},
			userActivitySubmit() {},
			cancelCallback() {},
			uploadPic(option) {
				// this.inviteForm.image = option.imageUrl;
				console.log(option)
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
	.selectTime {
		padding-left: 20px;
	}
</style>
