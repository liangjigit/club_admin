<template>
	<div class="activityList">
		<a-table :columns="columns" :data-source="userIntegralRules" bordered :pagination="false" :style="{ backgroundColor: '#ffffff' }"
		 :rowKey="record => record.id">
			<!-- 状态 -->
			<template slot="status" slot-scope="text, record">
				<span v-if="record.status">启用
				</span>
				<span v-else>禁用
				</span>
			</template>


			<!-- 操作 -->
			<template slot="action" slot-scope="text, record">
				<span>
					<a @click="changeRuleStatus(record.type, 'status', record.status)">{{
		            record.status ? "禁用" : "启用"
		          }}</a>
				</span>

				<a-divider type="vertical" />
				<a @click="showConfigModal(record)">
					配置
				</a>
			</template>
		</a-table>
	</div>
</template>

<script>
	export default {
		name: 'activityList'
	}
</script>

<style>
</style>
