<template>
	<div class="activityList">
		<a-table :data-source="activeData" :columns="columns" bordered :pagination="false"
			:style="{ backgroundColor: '#ffffff' }">
			<span slot="customTitle">
				序号
			</span>
			<span slot="tags" slot-scope="tags">
				<a-tag v-for="tag in tags" :key="tag"
					:color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
					{{ tag.toUpperCase() }}
				</a-tag>
			</span>
			<span slot="action" slot-scope="text, record">
				<a>Invite 一 {{ record.name }}</a>
				<a-divider type="vertical" />
				<a>Delete</a>
				<a-divider type="vertical" />
				<a class="ant-dropdown-link"> More actions
					<a-icon type="down" />
				</a>
			</span>

			<!-- 状态 -->
			<!-- <template slot="status" slot-scope="text, record">
				<span v-if="record.status">启用
				</span>
				<span v-else>禁用
				</span>
			</template> -->
			<!-- 操作 -->
			<!-- <template slot="action" slot-scope="text, record">
				<span>
					<a @click="changeRuleStatus(record.type, 'status', record.status)">{{
		            record.status ? "禁用" : "启用"
		          }}</a>
				</span>

				<a-divider type="vertical" />
				<a @click="showConfigModal(record)">
					配置
				</a>
			</template> -->
		</a-table>
	</div>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	export default {
		name: 'activityList',
		data() {
			return {
				columns: [{
						dataIndex: 'number',
						title: '序号',
					},
					{
						dataIndex: 'activeId',
						title: '活动ID',
					},
					{
						dataIndex: 'name',
						title: '名称',
					},
					{
						dataIndex: 'status',
						title: '状态',
					},
					{
						dataIndex: 'awardNumber',
						title: '剩余奖品数量',
					},
					{
						dataIndex: 'time',
						title: '时间',
					},
				],
				initData:{},
				activeData: [],
			}
		},
		created() {
			this.getConfig(1, 10)
		},
		methods: {
			...mapActions('userActivity', ['getFriendFissionConfig']),
			async getConfig(pageNum, pageSize) {
				const res = await this.getFriendFissionConfig({
					pageNum,
					pageSize
				})
				if(res.code == 200){
					this.initData = res.data
					this.activeData = res.data.list.map((item,index)=>{
						return {
							number:index+1,
							activeId:item.id,
							name:item.title,
							status:item.activeStatus,
							awardNumber:item.timeLimit,
							time:`${item.startTime.slice(0,-3)}--${item.endTime.slice(0,-3)}`
						}
					})
					console.log(this.activeData)
				}
			}
		}
	}
</script>

<style>
</style>
