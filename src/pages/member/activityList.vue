<template>
	<div class="activityList">
		<a-table :data-source="activeData" :columns="columns" bordered :pagination="pagination"
			:style="{ backgroundColor: '#ffffff'}" rowKey="activeId" :customRow="getAwardShow">
			<span slot="status" slot-scope="text">
				<span v-if="text == 0">未开启</span>
				<span v-if="text == 1">进行中</span>
				<span v-if="text == 2">已结束</span>
				<span v-if="text == 3">已关闭</span>
			</span>
			<template slot="action" slot-scope="text, record">
				<a-button type="link" @click="closeActivity(record)">
					关闭
				</a-button>
				<a-divider type="vertical" />
				<template v-if="record.status != 0">
					<a-button type="link" @click="exportExcel(record)" :loading="exportLoading">
						导出
					</a-button>
				</template>
				<template v-else>
					<a-button type="link" disabled>
						导出
					</a-button>
				</template>
			</template>
		</a-table>
		<award-show :awardList="awardList" @cancel="awardShow = false" v-if="awardShow"></award-show>
	</div>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	import {
		exportFile
	} from "@/utils/utils.js";
	import awardShow from './components/AwardShow.vue'
	export default {
		name: 'activityList',
		components: {
			awardShow
		},
		data() {
			return {
				columns: [{
						dataIndex: 'number',
						key: 'number',
						title: '序号',
						scopedSlots: {
							customRender: 'number'
						}
					},
					{
						dataIndex: 'activeId',
						key: 'activeId',
						title: '活动ID',
						scopedSlots: {
							customRender: 'activeId'
						}
					},
					{
						dataIndex: 'name',
						key: 'name',
						title: '名称',
						scopedSlots: {
							customRender: 'name'
						}
					},
					{
						dataIndex: 'status',
						key: 'status',
						title: '状态',
						scopedSlots: {
							customRender: 'status'
						}
					},
					// {
					// 	dataIndex: 'awardNumber',
					// 	key: 'awardNumber',
					// 	title: '剩余奖品数量',
					// 	scopedSlots: {
					// 		customRender: 'awardNumber'
					// 	}
					// },
					{
						dataIndex: 'isshow',
						key: 'isshow',
						title: '是否展示CLUB',
						scopedSlots: {
							customRender: 'isshow'
						}
					},
					{
						dataIndex: 'limit',
						key: 'limit',
						title: '是否限次',
						scopedSlots: {
							customRender: 'limit'
						}
					},
					{
						dataIndex: 'time',
						key: 'time',
						title: '时间',
						scopedSlots: {
							customRender: 'time'
						}
					},
					{
						dataIndex: 'action',
						key: 'action',
						title: '操作',
						scopedSlots: {
							customRender: 'action'
						}
					},
				],
				initData: {},
				activeData: [],
				exportLoading: false,
				awardList: [],
				awardShow: false,
				pagination: {
					pageSize: 10,
					total:0,
					showTotal:total => `总计${total}条数据`,
					showSizeChanger:true
				}
			}
		},
		created() {
			this.getConfig(1, 1000)
		},
		methods: {
			...mapActions('userActivity', ['getFriendFissionConfig', 'closeFriendFission', 'exportFriendFission',
				'getFissionAwardShow'
			]),
			getAwardShow(record) {
				return {
					on: {
						dblclick: async () => {
							const response = await this.getFissionAwardShow({
								id: record.activeId
							})
							if (response.code == 200) {
								console.log(response)
								this.$set(this, 'awardList', response.data)
								this.awardShow = true
							}
						}
					}
				}
			},
			//获得活动列表
			async getConfig(pageNum, pageSize) {
				const res = await this.getFriendFissionConfig({
					pageNum,
					pageSize
				})
				console.log(res)
				if (res.code == 200) {
					this.initData = res.data
					this.activeData = res.data.list.map((item, index) => {
						return {
							number: index + 1,
							activeId: item.id,
							name: item.title,
							status: item.activeStatus,
							limit: item.timeLimit == 1 ? '限次' : '不限次',
							isshow: item.isShow == 0 ? '不展示' : '展示',
							time: `${item.startTime.slice(0,-3)}--${item.endTime.slice(0,-3)}`
						}
					})
					this.pagination.total = this.activeData.length
					console.log(this.activeData)
				}
			},
			//关闭正在进行的活动
			async closeActivity(record) {
				const {
					activeId
				} = record
				const response = await this.closeFriendFission({
					id: activeId,
					activeStatus: 3
				})
				if (response.code == 200) {
					this.getConfig(1, 100)
				}
			},
			//导出excel
			async exportExcel(record) {
				this.exportLoading = true;
				this.$message.loading({
					content: "正在导出",
					key: "exportStatistics",
					duration: 2
				});
				// console.log(record)
				let {
					activeId
				} = record;
				let response = await this.exportFriendFission({
					activeId
				});
				const fileName = response.headers['content-disposition'].slice(20, -5)
				exportFile(response.data, fileName);
				this.exportLoading = false;
			},
		}
	}
</script>

<style>
</style>
