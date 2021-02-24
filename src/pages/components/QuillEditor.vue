<template>
  <div>
    <quill-editor
      class="editor"
      ref="myTextEditor"
      v-model="editorContent"
      :options="editorOption"
      @change="onEditorChange($event)"
      @ready="ready($event)"
    >
    </quill-editor>
    <a-upload
      class="ant-my-uploader"
      style="display:none"
      action="/content/file/upload-oss-image"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <a-button> <a-icon type="upload" />Upload </a-button>
    </a-upload>
    <div>
      剩余可输入
      <span :style="{ color: 5000 - innerText.length < 0 ? 'red' : 'black' }">{{
        5000 - innerText.length
      }}</span>
      字
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Quill from "quill";
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);
// 自定义文字大小
let fontSizeStyle = Quill.import("attributors/style/size");
fontSizeStyle.whitelist = [
  "10px",
  "11px",
  "12px",
  "13px",
  "14px",
  "15px",
  "16px",
  "17px",
  "18px",
  "19px",
  "20px",
  "21px",
  "22px",
  "23px",
  "24px",
  "25px",
  "26px"
];
Quill.register(fontSizeStyle, true);
import { lineHeightStyle } from "@/utils/lineheight";
//工具菜单栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  // [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ size: fontSizeStyle.whitelist }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  [{ lineheight: ["initial", "1", "1.5", "1.75", "2", "3", "4", "5"] }], // 对齐方式
  ["clean"], // 清除文本格式
  ["link", "image", "video"] // 链接、图片、视频
];
export default {
  components: {
    quillEditor
  },
  props: {
    content: String
  },
  data() {
    return {
      innerText: "",
      editorContent: null,
      editorOption: {
        placeholder: "请在这里输入", //提示
        readyOnly: false, //是否只读
        theme: "snow", //主题 snow/bubble
        syntax: true, //语法检测
        modules: {
          imageResize: {
            //添加
            displayStyles: {
              //添加
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"] //添加
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value) {
                if (value) {
                  console.log(value);
                  // 触发input框选择图片文件
                  document.querySelector(".ant-my-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
              lineheight: function(value) {
                if (value) {
                  this.quill.format("lineHeight", value);
                } else {
                  console.log(value);
                }
              }
            }
          }
        }
      },
      loading: false
    };
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quillEditor;
    }
  },
  mounted() {
    // Quill.register({ "formats/line-height": LineHeight }, true);
  },
  watch: {
    content: {
      handler: function(val) {
        this.editorContent = val;
      },
      immediate: true
    }
  },
  methods: {
    ready() {
      Quill.register({ "formats/lineHeight": lineHeightStyle }, true);
    },
    onEditorChange(editor) {
      // this.editorContent = editor.html;
      this.innerText = editor.text.replace(/[\r\n]$/g, "");
      this.$emit("onChange", {
        
        content: editor.html,
        textLength: this.innerText.length
      });
    },
    // 上传图片
    uploadSuccess(val) {
      let quill = this.$refs.myTextEditor.quill;
      // 获取光标所在位置
      let length = quill.getSelection().index;
      // 插入图片  res.url为服务器返回的图片地址
      quill.insertEmbed(length, "image", val);
      // 调整光标到最后
      quill.setSelection(length + 1);
    },
    handleChange(info) {
      switch (info.file.status) {
        case "uploading":
          this.loading = true;
          break;
        case "done":
          this.loading = false;
          // eslint-disable-next-line no-case-declarations
          const { response } = info.file; // 请求返回的数据
          if (response.code == 200) {
            this.uploadSuccess(response.data);
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
          // 错误消息提示
          this.$message.error({
            content: "网络错误请稍后再试",
            key: "uploadPic",
            duration: 2
          });
          break;
        default:
          break;
      }
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        this.$message.success({
          content: "上传中",
          key: "uploadPic",
          duration: 2
        });
        const isJpgOrPng =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/jpg";
        if (!isJpgOrPng) {
          this.$message.error("图片仅支持 jpeg 或 png 或 jpg 格式");
          return reject(false);
        }
        // const isLt300kb = file.size / 1024 < 300;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("图片大于 2M");
          return reject(false);
        }
        return resolve(true);
      });
    }
  }
};
</script>

<style>
.editor {
  line-height: normal !important;
  /* height: 400px; */
  background-color: #ffffff;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}
.ql-snow .ql-tooltip a.ql-action::after {
  content: "编辑";
}
.ql-snow .ql-tooltip a.ql-remove::before {
  content: "移除";
}
.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}
.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
/* 编辑器内部出现滚动条 */
.ql-container {
  /* overflow-y: auto; */
  height: 400px !important;
}
/*滚动条整体样式*/
.ql-container ::-webkit-scrollbar {
  width: 10px; /*竖向滚动条的宽度*/
  height: 10px; /*横向滚动条的高度*/
}
.ql-container ::-webkit-scrollbar-thumb {
  /*滚动条里面的小方块*/
  background: #666666;
  border-radius: 5px;
}
.ql-container ::-webkit-scrollbar-track {
  /*滚动条轨道的样式*/
  background: #ccc;
  border-radius: 5px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="11px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="11px"]::before {
  content: "11px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
  content: "12px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="13px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="13px"]::before {
  content: "13px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="15px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="15px"]::before {
  content: "15px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
  content: "16px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="17px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="17px"]::before {
  content: "17px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="19px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="19px"]::before {
  content: "19px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  content: "20px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="21px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="21px"]::before {
  content: "21px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="22px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="22px"]::before {
  content: "22px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="23px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="23px"]::before {
  content: "23px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  content: "24px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="25px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="25px"]::before {
  content: "25px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="26px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="26px"]::before {
  content: "26px";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label::before{
  content: "行高";
}
.ql-snow
  .ql-picker.ql-lineheight
  .ql-picker-item[data-value="initial"]::before {
  content: "默认";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1"]::before {
  content: "1";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1.5"]::before {
  content: "1.5";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1.75"]::before {
  content: "1.75";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="2"]::before {
  content: "2";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="3"]::before {
  content: "3";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="4"]::before {
  content: "4";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="5"]::before {
  content: "5";
}
.ql-snow .ql-picker.ql-lineheight {
  width: 70px;
}
</style>
