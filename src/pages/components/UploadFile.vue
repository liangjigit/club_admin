<template>
	<div class="clearfix" style="position:relative">
		<a-upload name="file" list-type="picture-card" class="avatar-uploader" :show-upload-list="false" action="/content/file/upload-oss-image"
		 :before-upload="beforeUpload" @change="handleChange" :accept="accept">
			<img v-if="(img || file) && fileType == 'image'" :src="img || file" :width="imgWidth" :height="imgHeight" alt="图片加载失败"
			 title="点击重新上传" />
			<!-- <div v-else-if="file && fileType == 'video'">
      <a-icon type="video-camera" />
      <div class="ant-upload-text">
        已上传
      </div>
    </div> -->
			<video :src="file" v-else-if="file && fileType == 'video'" width="300" controls></video>
			<div v-else>
				<a-icon :type="loading ? 'loading' : 'plus'" />
				<div class="ant-upload-text">
					{{ uploadText || "上传图片" }}
				</div>
			</div>
			<a-button v-if="img || file" @click.stop="remove" type="danger" size="small" style="position: absolute;width: 50px;right: 0;top: 0;">
				移除
			</a-button>
		</a-upload>
	</div>
</template>
<script>
	// function getBase64(img, callback) {
	//   const reader = new FileReader();
	//   reader.addEventListener("load", () => callback(reader.result));
	//   reader.readAsDataURL(img);
	// }
	import {
		notification
	} from "ant-design-vue";
	export default {
		props: {
			uploadText: String,
			img: String,
			imgWidth: {
				type: Number,
				default: 320
			},
			imgHeight: Number,
			file: String,
			accept: {
				type: String,
				default: ".jpg, .jpeg, .png"
			},
			fileType: {
				type: String,
				default: "image"
			} // 文件类型
		},
		data() {
			return {
				previewVisible: false, //是否显示预览
				loading: false
				// imageUrl: ""
			};
		},
		methods: {
			// 移除
			remove() {
				this.$emit("uploadPic", {
					imageUrl: ""
				});
			},
			// 上传
			handleChange(info) {
				switch (info.file.status) {
					case "uploading":
						this.loading = true;
						break;
					case "done":
						this.loading = false;
						// eslint-disable-next-line no-case-declarations
						const {
							response
						} = info.file; // 请求返回的数据
						if (response.code == 200) {
							// this.imageUrl = response.data;
							this.$emit("uploadPic", {
								imageUrl: response.data
							});
							this.$message.success({
								content: "上传成功！",
								key: "uploadPic",
								duration: 2
							});
						} else {
							this.$message.error({
								content: response.msg || "上传发生错误" + response.code,
								key: "uploadPic",
								duration: 2
							});
						}
						break;
					case "error":
						this.loading = false;
						// eslint-disable-next-line no-case-declarations
						const {
							response: {
								status,
								errMsg: statusText
							}
						} = info.file;
						// 错误消息提示
						notification.error({
							// eslint-disable-next-line no-unused-vars
							message: h => ( <
								div >
								请求错误 < span style = "color: red" > {
									status
								} < /span> < /
								div >
							),
							description: statusText
						});
						break;
					default:
						break;
				}
			},
			beforeUpload(file) {
				this.$message.success({
					content: "上传中",
					key: "uploadfile",
					duration: 2
				});
				let isValidate = true;
				const isVideo =
					file.type === "video/mp4" ||
					file.type === "video/3gp" ||
					file.type === "video/m3u8";

				const isJpgOrPng =
					file.type === "image/jpeg" ||
					file.type === "image/png" ||
					file.type === "image/jpg";

				const fileType = isVideo ? "video" : isJpgOrPng ? "image" : "other";
				// const isLt20M = file.size / 1024 / 1024 < 20;
				// let isLt300kb = file.size / 1024 < 300;
				// if (!isLt20M || !isLt300kb) {
				let err = "";
				switch (fileType) {
					case "video":
						// eslint-disable-next-line no-case-declarations
						const isLt20M = file.size / 1024 / 1024 < 20;
						if (!isLt20M) {
							err = "视频大于 20M";
							isValidate = false;
						}
						break;
					case "image":
						// eslint-disable-next-line no-case-declarations
						let isLt300kb = file.size / 1024 < 1024 * 2;
						if (!isLt300kb) {
							err = "图片大于 2M";
							isValidate = false;
						}
						break;
					default:
						err =
							"非法格式！视频仅支持 mp4 或 3gp 或 m3u8 格式；图片仅支持 jpeg 或 png 或 jpg 格式";
						isValidate = false;
						break;
				}
				if (!isValidate) {
					this.$message.error({
						content: err,
						key: "uploadfile",
						duration: 2
					});
				}
				// }
				return isValidate;
			}
		}
	};
</script>
<style>
	.avatar-uploader>.ant-upload {
		width: 128px;
		height: 128px;
	}

	.ant-upload-select-picture-card i {
		font-size: 32px;
		color: #999;
	}

	.ant-upload-select-picture-card .ant-upload-text {
		margin-top: 8px;
		color: #666;
	}

	.ant-upload.ant-upload-select-picture-card>.ant-upload {
		position: relative;
	}
</style>
