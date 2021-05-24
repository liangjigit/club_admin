<template>
	<div>
		<div class="functional-area" slot="actions">
			<a-form layout="inline" :form="search" @submit="searchSubmit">
				<a-form-item>
					<a-button type="primary" @click="$router.push({ path: '/cup/article/create' })">新增文章</a-button>
				</a-form-item>
				<a-form-item label="标题">
					<a-input placeholder="请输入标题" v-model="search.title" :allowClear="true" />
				</a-form-item>
				<a-form-item label="专家姓名">
					<a-select show-search :allowClear="true" :show-arrow="true" :not-found-content="'未找到'"
						:placeholder="'请输入专家名称'" :default-value="search.expertId" v-model="search.expertId"
						style="width: 200px">
						<a-select-option v-for="item in allExperts" :key="item.name" :value="item.id">
							{{ item.expertName }}
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="状态">
					<a-select :allowClear="true" placeholder="请选择状态" :default-value="search.status"
						v-model="search.status" style="width: 200px">
						<a-select-option :value="item.key" v-for="item in articleStatus" :key="item.value">
							{{ item.value }}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="创建时间">
					<a-range-picker v-model="search.createTime" :show-time="{ defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ] }" format="YYYY-MM-DD HH:mm:ss" :placeholder="['开始', '结束']" @ok="confirmCreateTime">
						<a-icon slot="suffixIcon" type="clock-circle" />
					</a-range-picker>
				</a-form-item>
				<a-form-item>
					<a-button type="primary" html-type="submit">
						查询
					</a-button>
				</a-form-item>
			</a-form>
		</div>
		<a-table :scroll="{ x: 1600 }" :columns="columns" :data-source="articles" bordered :pagination="false"
			:style="{ backgroundColor: '#ffffff' }" :rowKey="record => record.id"
			:loading="{ spinning: loading, delay: 500 }">
			<template slot="id" slot-scope="text">
				<a>{{ text }}</a>
			</template>
			<!-- 封面图 -->
			<template slot="img" slot-scope="text, record">
				<img :src="record.img" style="width:105px;height:165px" />
			</template>
			<template slot="startEndTime" slot-scope="text, record">
				<span v-if="record.startTime && record.endTime">
					{{ record.startTime }} ~ {{ record.endTime }}
				</span>
				<span v-else>-</span>
			</template>
			<!-- 标签 -->
			<template slot="tags" slot-scope="tags">
				<a-tag color="pink" v-for="tag in tags" :key="tag" style="margin-bottom:10px">
					{{ tag }}
				</a-tag>
			</template>
			<!-- 状态 -->
			<template slot="status" slot-scope="text, record">
				<span v-for="item in articleStatus" :key="item.value" v-show="item.key === record.status">
					{{ item.value }}
				</span>
			</template>
			<!-- 排序 -->
			<span slot="articleSort" slot-scope="text, record">
				<editable-cell :text="record.articleSort" @change="onCellChange(record.id, 'articleSort', $event)" />
			</span>
			<!-- 操作 -->
			<template slot="action" slot-scope="text, record">
				<span v-for="item in articleStatus" :key="item.value" v-show="item.key === record.status">
					<a @click="changeStatus(record.id, 'status', record.status)">
						{{ item.value == "下架" ? "上架" : "下架" }}
					</a>
				</span>
				<br />
				<span>
					<a @click="goTop(record.id)" :style="record.atTop ? 'color:rgb(232,232,232)': ''">
						置顶
					</a>
				</span>
				<br />
				<router-link :to="{ name: 'cupArticleDetail', params: { id: record.id } }">
					查看
				</router-link>
				<br />
				<router-link :to="{ name: 'cupArticlePoster', params: { id: record.id } }">
					分享
				</router-link>
				<br />
				<a :href="record.qrcodeUrl" :download="record.articleCode + '.png'">下载二维码</a>
				<br />
				<!-- 下架状态下显示编辑和删除 -->
				<span v-if="record.status == 0">
					<router-link :to="{ name: 'cupArticleEdit', params: { id: record.id } }">
						编辑
					</router-link>
					<br />
					<a-popconfirm v-if="articles.length" title="确定删除?" ok-text="删除" cancel-text="取消"
						@confirm="() => onDelete(record.id, 'deleteArticel')">
						<a href="javascript:;">删除</a>
					</a-popconfirm>
				</span>
			</template>
		</a-table>
		<!-- 分页器 -->
		<div style="margin-top:20px;textAlign:right">
			<a-pagination :default-current="1" v-model="pageNum" :total="totalSize" :pageSize.sync="pageSize"
				@change="getData" show-size-changer @showSizeChange="(current, pageSize) => getData(1, pageSize)"
				:show-total="total => `总计${total} 条数据`" />
		</div>
	</div>
</template>

<script>
	import EditableCell from "../../components/EditableCell";
	import {
		mapState,
		mapActions
	} from "vuex";
	import moment from "moment";
	const columns = [{
			dataIndex: "id",
			key: "id",
			title: "ID",
			width: 100
		},
		{
			dataIndex: "img",
			key: "img",
			title: "封面图",
			scopedSlots: {
				customRender: "img"
			},
			width: 150
		},
		{
			dataIndex: "title",
			key: "title",
			title: "标题",
			width: 300,
			scopedSlots: {
				customRender: "title"
			}
		},
		{
			dataIndex: "startTime",
			key: "startTime",
			title: "定时上下架时间",
			width: 200,
			scopedSlots: {
				customRender: "startEndTime"
			}
		},
		{
			dataIndex: "tags",
			key: "tags",
			title: "标签",
			scopedSlots: {
				customRender: "tags"
			},
			width: 190
		},
		{
			dataIndex: "expertName",
			key: "expertName",
			title: "专家姓名",
			width: 100
		},
		{
			dataIndex: "status",
			key: "status",
			title: "状态",
			width: 100,
			scopedSlots: {
				customRender: "status"
			}
		},
		{
			dataIndex: "createTime",
			key: "createTime",
			title: "创建时间"
		},
		{
			dataIndex: "articleSort",
			key: "articleSort",
			title: "排序",
			scopedSlots: {
				customRender: "articleSort"
			},
			width: 130
		},
		{
			title: "操作",
			key: "action",
			fixed: "right",
			width: 150,
			scopedSlots: {
				customRender: "action"
			}
		}
	];
	const ArticleStatus = [{
			key: 0,
			value: "下架"
		},
		{
			key: 1,
			value: "上架"
		}
	];
	export default {
		components: {
			EditableCell
		},
		data() {
			return {
				articleStatus: ArticleStatus,
				loading: false,
				columns, //表头
				// 列表搜索相关
				search: {
					title: "", // 名称
					expertId: undefined, // 专家ID，若设置为 ""||0 时select 组件不显示placeholder
					status: undefined, // 状态
					createTime: [] // 创建开始时间
				}
			};
		},
		computed: {
			...mapState("cupArticle", [
				"articles",
				"pageNum",
				"pageSize",
				"totalSize"
			]),
			...mapState("expert", ["allExperts"])
		},
		watch: {
			$route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
		},
		created() {
			this.init();
		},
		methods: {
			...mapActions("cupArticle", [
				"changeTop",
				"getArticles",
				"changeArticleStatus",
				"changeArticleSort",
				"deleteArticle"
			]),
			...mapActions("expert", ["getAllExperts"]),
			moment,
			// 初始化数据
			init() {
				if (this.$route.name != "cupArticleIndex") {
					return false;
				}
				this.getData(); // 获取列表数据
				this.getExpertsForSearch(""); // 获取所有专家
			},
			//置顶
			async goTop(articleId){
				const res = await this.changeTop({
					articleId
				})
				if(res.code == '200'){
					this.init()
				}
			},
			// 列表相关
			// 删除文章
			async onDelete(id, dataIndex) {
				this.$message.loading({
					content: "正在删除",
					key: dataIndex,
					duration: 2
				});
				const response = await this.deleteArticle({
					id
				});
				if (!response.code) return;
				if (response.code == 200) {
					await this.getData();
					this.$message.success({
						content: "删除成功",
						key: dataIndex,
						duration: 2
					});
				}
			},
			// 修改状态
			async changeStatus(id, dataIndex, value) {
				// console.log(id, dataIndex, value)
				this.$message.loading({
					content: "正在修改",
					key: dataIndex,
					duration: 2
				});
				const status = value == 1 ? 0 : 1;
				const response = await this.changeArticleStatus({
					status,
					id,
					dataIndex
				});
				if (!response.code) return;
				if (response.code == 200) {
					this.$message.success({
						content: "修改成功",
						key: dataIndex,
						duration: 2
					});
				}
			},
			// 修改排序
			async onCellChange(id, dataIndex, value) {
				this.$message.loading({
					content: "正在修改",
					key: dataIndex,
					duration: 2
				});
				const response = await this.changeArticleSort({
					articleSort: value,
					id,
					dataIndex
				});
				if (!response.code) return;
				if (response.code == 200) {
					await this.getData();
					this.$message.success({
						content: "修改成功",
						key: dataIndex,
						duration: 2
					});
				}
			},
			// 获取列表
			async getData(page, pageSize) {
				let {
					title,
					expertId,
					status,
					createTime
				} = this.search;
				// 格式化时间
				const [begin, end] = createTime;
				const startCreateTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
				const endCreateTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
				// 格式化状态
				// console.log(
				//   page,
				//   pageSize,
				//   title,
				//   expertId,
				//   status,
				//   startCreateTime,
				//   endCreateTime
				// );
				this.loading = true;
				const response = await this.getArticles({
					pageNum: page || this.pageNum,
					pageSize: pageSize || this.pageSize,
					title,
					status,
					expertId,
					startCreateTime,
					endCreateTime,
					type: 0 // 表示cup
				});
				response.data.list[0].atTop = true
				// console.log(response);
				this.loading = false;
				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getArticles",
						duration: 2
					});
				}
			},
			// 获取所有专家
			async getExpertsForSearch(expertName) {
				// console.log(expertName)
				const response = await this.getAllExperts({
					expertName,
					type: 1
				});
				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getAllExperts",
						duration: 2
					});
				}
			},
			// 搜索相关
			// 按创建时间搜索
			confirmCreateTime(value) {
				this.search.createTime = value;
				// console.log(this.search.createTime);
			},
			// 提交搜索
			searchSubmit(e) {
				// console.log(this.search);
				e.preventDefault();
				this.getData(1, this.pageSize);
			}
		}
	};
</script>
