<template>
	<vue-ueditor-wrap v-model="cont" :config="uEditConfig" @input="input" :destroy="true"></vue-ueditor-wrap>
</template>

<script>
	import VueUeditorWrap from "vue-ueditor-wrap";
	const uEditConfig = {
		toolbars: [
			[
				// 'undo', //撤销
				// 'bold', //加粗
				// 'indent', //首行缩进
				// 'italic', //斜体
				// 'underline', //下划线
				// 'strikethrough', //删除线
				// 'subscript', //下标
				// 'fontborder', //字符边框
				// 'superscript', //上标
				// 'formatmatch', //格式刷
				// 'fontfamily', //字体
				'source',//源码
				'fullscreen',//全屏
				'fontsize', //字号
				'justifyleft', //居左对齐
				'justifycenter', //居中对齐
				'justifyright', //居右对齐
				'justifyjustify', //两端对齐
				'insertorderedlist', //有序列表
				'insertunorderedlist', //无序列表
				// 'lineheight',//行间距
			]
		],
		'fontfamily': [{
				label: '',
				name: 'songti',
				val: '宋体,SimSun'
			},
			// { label:'仿宋',name:'fangsong',val:'仿宋,FangSong'},
			// { label:'仿宋_GB2312',name:'fangsong',val:'仿宋_GB2312,FangSong'},
			// { label:'',name:'kaiti',val:'楷体,楷体_GB2312, SimKai'},
			// { label:'',name:'yahei',val:'微软雅黑,Microsoft YaHei'},
			// { label:'',name:'heiti',val:'黑体, SimHei'},
			// { label:'',name:'lishu',val:'隶书, SimLi'},
			// { label:'',name:'andaleMono',val:'andale mono'},
			// { label:'',name:'arial',val:'arial, helvetica,sans-serif'},
			// { label:'',name:'arialBlack',val:'arial black,avant garde'},
			// { label:'',name:'comicSansMs',val:'comic sans ms'},
			// { label:'',name:'impact',val:'impact,chicago'},
			// { label:'',name:'timesNewRoman',val:'times new roman'}
		],
		// 编辑器不自动被内容撑高
		autoHeightEnabled: false,
		//启用自动保存
		enableAutoSave: false,
		// 初始容器高度
		initialFrameHeight: 500,
		// 初始容器宽度
		initialFrameWidth: "100%",
		// 上传文件接口
		serverUrl: "https://clubtest.aimer.com.cn/content/file/ueditor/config",
		// UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
		UEDITOR_HOME_URL: "/ueditor/"
	};
	export default {
		components: {
			VueUeditorWrap
		},
		props: {
			content: String
		},
		data() {
			return {
				uEditConfig,
				contentData: ""
			};
		},
		computed: {
			cont: {
				get: function() {
					return this.content;
				},
				set: function(value) {
					this.contentData = value; // 编辑器内容
				}
			}
		},
		methods: {
			input() {
				this.$emit("input", {
					content: this.contentData
				});
			}
		}
	};
</script>

<style>
	/* ueditor 样式修复 */
	.edui-default .edui-button-body {
		height: 20px;
	}

	.edui-default .edui-toolbar .edui-combox .edui-combox-body {
		height: 22px;
	}

	.edui-default .edui-box {
		height: 22px;
	}

	.edui-editor div {
		display: flex;
		flex-wrap: wrap;
	}
</style>
