<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline">
        <a-form-item>
          <a-button type="primary" @click="showCreateModal">新增弹窗</a-button>
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
      <template slot="time" slot-scope="text, record">
        <span>{{ record.startTime }}</span> ~ <span>{{ record.endTime }}</span>
      </template>
      <template slot="linkType" slot-scope="text, record">
        <span v-if="record.linkType == 1">
          {{ record.pageUrl }}
        </span>
        <span v-if="record.linkType == 2">
          {{ record.url }}
        </span>
        <span v-if="record.linkType == 3">
          {{ record.miniappUrl }}
        </span>
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
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="() => onDelete(record.id, 'deletePopup')"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
    <!-- 分页器 -->
    <div style="margin-top:20px;textAlign:right">
      <a-pagination
        :default-current="1"
        v-model="currentPage"
        :total="totalPages"
        :pageSize="pageSize"
        @change="getData"
        show-size-changer
        @showSizeChange="(current, pageSize) => getData(1, pageSize)"
        :show-total="total => `总计${total} 条数据`"
      />
    </div>
    <!-- 新增/编辑标题Modal -->
    <a-modal
      :width="600"
      v-model="visible"
      :title="(isEdit ? '编辑' : '新增') + '弹窗'"
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
          label="弹窗图片"
          prop="image"
          extra="560*700px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadPopupImg"
            v-model="form.image"
            :img="form.image"
            :imgWidth="280"
            :imgHeight="350"
          >
          </upload-file>
        </a-form-model-item>

        <a-form-model-item label="跳转到" prop="linkType">
          <a-radio-group v-model="form.linkType"
                         name="linkType"
          >
            <a-radio :value="1">小程序页面</a-radio>
            <a-radio :value="2">外部地址</a-radio>
            <a-radio :value="3">其他小程序</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item style="margin-left:90px; margin-top:-20px" v-if="form.linkType == 1" prop="pageUrl">
          <a-input
                  v-model="form.pageUrl"
                  placeholder="输入跳转小程序页面"
          />
        </a-form-model-item>
        <a-form-model-item style="margin-left:90px; margin-top:-20px" v-if="form.linkType == 2" prop="url">
          <a-input v-model="form.url" placeholder="输入跳转链接"  v-if="form.linkType == 2" />
        </a-form-model-item>
        <a-form-model-item style="margin-left:90px; margin-top:-20px" v-if="form.linkType == 3" prop="miniappId">
          <a-input v-model="form.miniappId" placeholder="输入目标小程序AppId" v-if="form.linkType == 3" />
        </a-form-model-item>
        <a-form-model-item style="margin-left:90px; margin-top:-20px" v-if="form.linkType == 3" prop="miniappUrl">
          <a-input v-model="form.miniappUrl" placeholder="输入跳转小程序的页面地址" v-if="form.linkType == 3" />
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
    title: "弹窗图片",
    scopedSlots: { customRender: "image" }
  },
  {
    dataIndex: "url",
    title: "跳转到",
    scopedSlots: { customRender: "linkType" }
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
const DisplayPage = [
  { key: 1, value: "首页" },
  { key: 2, value: "BRARTS" },
  { key: 3, value: "社区活动" },
  { key: 4, value: "体态训练营" },
  { key: 5, value: "我的CLUB" }
];
export default {
  components: {
    uploadFile
  },
  data() {
    return {
      locale,
      popupStatus: PopupStatus,
      displayPage: DisplayPage,
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
        image: "",
        linkType: "",
        pageUrl: "",
        url: "",
        miniappId: "",
        miniappUrl: ""
      },
      // 新增/编辑标签表单校验
      rules: {
        image: [
          {
            required: true,
            message: "请上传弹窗图片",
            trigger: "change"
          }
        ],
        linkType: [
          {
            required: true,
            message: "请选择跳转页面"
          }
        ],
        pageUrl: [
          {
            required: true,
            message: "请填写小程序页面地址"
          }
        ],
        url: [
          {
            required: true,
            message: "请填写外部地址"
          }
        ],
        miniappId: [
          {
            required: true,
            message: "请填写小程序appid"
          }
        ],
        miniappUrl: [
          {
            required: true,
            message: "请填写小程序页面地址"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("popup", {
      list: state => state.popupList,
      currentPage: state => state.popupPageNum,
      pageSize: state => state.popupPageSize,
      totalPages: state => state.popupTotalSize
    }),
    ...mapState("page", ["allPages"])
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions("popup", [
      "getPopup",
      "createPopup",
      "editPopup",
      "changePopupStatus",
      "deletePopup"
    ]),
    ...mapActions("page", ["getPages"]),
    init() {
      this.getAllPages();
      this.getData();
    },
    // 获取列表数据
    async getData(page, pageSize) {
      const response = await this.getPopup({
        pageNum: page || this.currentPage,
        pageSize: pageSize || this.pageSize
      });
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getPopup",
          duration: 2
        });
      }
    },
    // 获取小程序页面
    async getAllPages() {
      const response = await this.getPages();
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getPages",
          duration: 2
        });
      }
    },
    // 修改状态
    async changeStatus(id, dataIndex, value) {
      // console.log(id, dataIndex, value)
      this.$message.loading({
        content: "正在修改",
        key: dataIndex
      });
      const status = value == 1 ? 0 : 1;
      const response = await this.changePopupStatus({
        status,
        id,
        dataIndex
      });
      if (response.code == 200) {
        await this.getData();
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
      if (this.form.linkType == 1) {
        this.$refs.ruleForm.rules.url.required = false;
        this.$refs.ruleForm.rules.miniappId.required = false;
        this.$refs.ruleForm.rules.miniappUrl.required = false;
      } else if (this.form.linkType == 2) {
        this.$refs.ruleForm.rules.pageUrl.required = false;
        this.$refs.ruleForm.rules.miniappId.required = false;
        this.$refs.ruleForm.rules.miniappUrl.required = false;
      } else if (this.form.linkType == 3) {
        this.$refs.ruleForm.rules.url.required = false;
        this.$refs.ruleForm.rules.miniappId.required = false;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let response = this.isEdit
            ? this.editForPopup()
            : this.createForPopup();
          response
            .then(res => {
              if (res.code == 200) {
                this.$message.success({
                  content: "操作成功",
                  key: "createPopup",
                  duration: 2
                });
                this.getData();
                this.cancelCreate();
              } else {
                this.$message.error({
                  content: res.msg,
                  key: "createPopup",
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
    // 新增弹窗
    createForPopup() {
      const {
        name: dataIndex,
        title,
        image,
        linkType,
        pageUrl,
        url,
        miniappId,
        miniappUrl
      } = this.form;
      console.log(dataIndex);
      return this.createPopup({
        title,
        image,
        linkType,
        pageUrl,
        url,
        miniappId,
        miniappUrl
      });
    },
    // 编辑弹窗
    editForPopup() {
      const {
        name: dataIndex,
        title,
        image,
        linkType,
        pageUrl,
        url,
        miniappId,
        miniappUrl
      } = this.form;
      console.log(dataIndex);
      const id = this.form.id;
      return this.editPopup({
        id,
        title,
        image,
        linkType,
        pageUrl,
        url,
        miniappId,
        miniappUrl
      });
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
        image: value.image,
        linkType: value.linkType,
        pageUrl: value.pageUrl,
        url: value.url,
        miniappId: value.miniappId,
        miniappUrl: value.miniappUrl
      };
      this.visible = true;
    },
    // 显示新增/编辑Modal
    showCreateModal() {
      this.isEdit = false;
      this.form = {
        id: "",
        image: "",
        linkType: 1,
        pageUrl: "",
        url: "",
        miniappId: "",
        miniappUrl: ""
      };
      this.visible = true;
    },
    //   上传产品图片
    uploadPopupImg(option) {
      this.form.image = option.imageUrl;
    },
    async onDelete(id, dataIndex) {
      this.$message.loading({
        content: "正在删除",
        key: dataIndex,
        duration: 2
      });
      const response = await this.deletePopup({ id });
      if (!response.code) return;
      if (response.code == 200) {
        await this.getData();
        this.$message.success({
          content: "删除成功",
          key: dataIndex,
          duration: 2
        });
      }
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
