<template>
  <div>
    <div class="functional-area" slot="actions" v-if="list.size > 0">
      <a-form layout="inline">
        <a-form-item>
          <a-button type="primary" @click="showCreateModal">新增海报</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :columns="columns"
      :data-source="list"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :locale="{
        filterConfirm: '确定',
        filterReset: '重置',
        emptyText: '暂无数据'
      }"
    >
      <!-- 状态 -->
      <template slot="status" slot-scope="text, record">
        <span
          v-for="item in popupStatus"
          :key="item.key"
          v-show="item.key === record.status"
        >
          {{ item.value }}
        </span>
      </template>
      <template slot="image" slot-scope="text, record">
        <img :src="record.image" style="width:80px" />
      </template>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <span
          v-for="item in popupStatus"
          :key="item.key"
          v-show="item.key === record.status"
        >
          <a @click="changeStatus(record.id, 'status', record.status)">{{
            item.value == "下架" ? "上架" : "下架"
          }}</a>
        </span>
        <span v-if="record.status == 0">
          <a-divider type="vertical" />
          <a @click="showEditModal(record)">
            编辑
          </a>
        </span>
      </template>
    </a-table>
    <!-- 新增/编辑标题Modal -->
    <a-modal
      :width="600"
      v-model="visible"
      :title="(isEdit ? '编辑' : '新增') + '海报'"
      cancelText="取消"
      okText="确定"
      :centered="true"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      :confirmLoading="loading"
      @ok="createSubmit"
      @cancel="cancelCreate"
      :destroyOnClose="true"
    >
      <a-form-model
        ref="ruleForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="form"
        :rules="rules"
      >
        <a-form-model-item
          label="海报图片"
          prop="image"
          extra="png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadPosterImg"
            :uploadText="'上传图片'"
            :img="form.image"
            :imgWidth="375"
          >
          </upload-file>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import uploadFile from "../../components/UploadFile";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import { mapState, mapActions } from "vuex";
const columns = [
  {
    dataIndex: "id",
    title: "ID"
  },
  {
    dataIndex: "image",
    title: "海报图片",
    scopedSlots: { customRender: "image" }
  },
  {
    dataIndex: "status",
    title: "状态",
    scopedSlots: { customRender: "status" }
  },
  {
    dataIndex: "createTime",
    key: "createTime",
    title: "创建时间"
  },
  {
    dataIndex: "clickCount",
    key: "clickCount",
    title: "点击次数"
  },
  {
    dataIndex: "clickUserCount",
    key: "clickUserCount",
    title: "点击人数"
  },
  {
    dataIndex: "action",
    title: "操作",
    scopedSlots: { customRender: "action" },
    width: 170
  }
];
const PopupStatus = [
  { key: 0, value: "下架" },
  { key: 1, value: "上架" }
];
export default {
  components: {
    uploadFile
  },
  data() {
    return {
      locale,
      popupStatus: PopupStatus,
      columns, // 表头
      // 新增/编辑表单
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      //   新增/编辑标签
      isEdit: false, // 是否是编辑标签
      visible: false, //是否显示新增Modal
      loading: false, // 正在提交表单
      // 新增/编辑标签表单
      form: {
        id: "",
        title: "",
        image: ""
      },
      // 新增/编辑标签表单校验
      rules: {
        image: [
          {
            required: true,
            message: "请上传弹窗图片",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("poster", {
      list: state => state.posterList
    })
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("poster", [
      "getPoster",
      "createPoster",
      "editPoster",
      "changePosterStatus"
    ]),
    // 获取列表数据
    async getData() {
      const response = await this.getPoster({
        type: 0
      });
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getPoster",
          duration: 2
        });
      }
    },
    // 修改状态
    async changeStatus(id, dataIndex, value) {
      this.$message.loading({
        content: "正在修改",
        key: dataIndex
      });
      const status = value == 1 ? 0 : 1;
      const response = await this.changePosterStatus({
        status,
        id,
        dataIndex
      });
      if (response.code == 200) {
        this.$message.success({
          content: "修改成功",
          key: dataIndex,
          duration: 2
        });
      }
    },
    // 提交新增/编辑表单
    createSubmit() {
      this.loading = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let response = this.isEdit
            ? this.editForPoster()
            : this.createForPoster();
          response
            .then(res => {
              if (res.code == 200) {
                this.$message.success({
                  content: "操作成功",
                  key: "createPoster",
                  duration: 2
                });
                this.getData();
                this.cancelCreate();
              } else {
                this.$message.error({
                  content: res.msg,
                  key: "createPoster",
                  duration: 2
                });
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    // 新增海报
    createForPoster() {
      const { name: dataIndex, image } = this.form;
      console.log(dataIndex);
      const type = 0;
      return this.createPoster({ type, image });
    },
    // 编辑海报
    editForPoster() {
      const { name: dataIndex, image } = this.form;
      console.log(dataIndex);
      const id = this.form.id;
      const type = 0;
      return this.editPoster({ id, image, type });
    },
    // 取消、隐藏新增/编辑Modal
    cancelCreate() {
      this.visible = false;
      this.loading = false;
      this.from = "";
    },
    // 显示编辑Modal
    showEditModal(value) {
      this.isEdit = true;
      this.form = {
        id: value.id,
        image: value.image
      };
      this.visible = true;
    },
    // 显示新增/编辑Modal
    showCreateModal() {
      this.isEdit = false;
      this.form = {
        id: "",
        image: ""
      };
      this.visible = true;
    },
    //   上传产品图片
    uploadPosterImg(option) {
      this.form.image = option.imageUrl;
    }
  }
};
</script>

<style>
.functional-area {
  padding: 10px;
  background-color: #ffffff;
}
</style>
