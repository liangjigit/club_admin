<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline">
        <a-form-item>
          <a-button type="primary" @click="showCreateModal"
            >新增广告位</a-button
          >
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
          v-for="item in bannerStatus"
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
        <span>{{ record.startTime }}</span> <br />
        ~ <br /><span>{{ record.endTime }}</span>
      </template>
      <template slot="displayPage" slot-scope="text, record">
        <span
          v-for="item in allPages"
          :key="item.id"
          v-show="item.id === record.displayPage"
        >
          {{ item.pageName }}
        </span>
      </template>
      <span slot="bannerSort" slot-scope="text, record">
        <editable-cell
          :text="Number(text)"
          @change="onCellChange(record.id, 'bannerSort', $event)"
        />
      </span>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <span
          v-for="item in bannerStatus"
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
            v-if="list.length"
            title="确定删除?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="() => onDelete(record.id, 'deleteBanner')"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </span>
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
      :title="(isEdit ? '编辑' : '新增') + '广告位'"
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
        <a-form-model-item ref="title" label="广告位标题" prop="title">
          <a-input
            v-model="form.title"
            placeholder="请输入广告位标题，30字以内"
            style="width:70%; margin-right:6px"
          />
          <a-switch v-model="form.titleDisplay" />
          显示
        </a-form-model-item>
        <a-form-model-item
          label="广告位图片"
          prop="image"
          extra="690*300px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadBannerImg"
            v-model="form.image"
            :img="form.image"
            :imgWidth="345"
            :imgHeight="150"
          ></upload-file>
        </a-form-model-item>
        <a-form-model-item label="展示位置" prop="displayPage">
          <a-select
            placeholder="选择展示位置"
            :default-value="form.displayPage"
            v-model="form.displayPage"
          >
            <a-select-option
              :value="1"
              :key="1"
            >
              首页
            </a-select-option>
          </a-select>
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
        <a-form-model-item label="上下架时间" prop="validTime">
          <a-range-picker
            v-model="form.validTime"
            :show-time="{ defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ] }"
            format="YYYY-MM-DD HH:mm:00"
            :placeholder="['上架时间', '下架时间']"
            @ok="confirmValidTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import EditableCell from "../../components/EditableCell";
import uploadFile from "../../components/UploadFile";
import moment from "moment";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import { mapState, mapActions } from "vuex";

const columns = [
  {
    dataIndex: "id",
    title: "ID"
  },
  {
    dataIndex: "image",
    title: "广告位图片",
    scopedSlots: { customRender: "image" }
  },
  {
    dataIndex: "title",
    title: "广告位标题"
  },
  {
    dataIndex: "displayPage",
    title: "展示位置",
    scopedSlots: { customRender: "displayPage" }
  },
  {
    dataIndex: "url",
    title: "跳转到",
    scopedSlots: { customRender: "linkType" },
    width: 180
  },
  {
    dataIndex: "time",
    title: "定时上下架时间",
    scopedSlots: { customRender: "time" },
    width: 210
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
    dataIndex: "bannerSort",
    title: "排序",
    scopedSlots: { customRender: "bannerSort" },
    width: 100
  },
  {
    dataIndex: "action",
    title: "操作",
    scopedSlots: { customRender: "action" },
    width: 170
  }
];
const BannerStatus = [
  { key: 0, value: "下架" },
  { key: 1, value: "上架" }
];

export default {
  components: {
    EditableCell,
    uploadFile
  },
  data() {
    return {
      locale,
      bannerStatus: BannerStatus,
      columns, // 表头
      // 新增/编辑表单
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      //   新增/编辑标签
      isEdit: false, // 是否是编辑标签
      visible: false, //是否显示新增Modal
      loading: false, // 正在提交表单
      // 新增/编辑标签表单
      form: {
        id: "",
        title: "",
        image: "",
        titleDisplay: false,
        displayPage: undefined,
        linkType: "",
        validTime: [],
        url: "",
        miniappId: "",
      },
      // 新增/编辑标签表单校验
      rules: {
        title: [
          {
            required: true,
            message: "请输入广告位标题，30字以内",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "广告位标题30个字以内",
            trigger: "blur"
          }
        ],
        image: [
          {
            required: true,
            message: "请上传广告位图片",
            trigger: "change"
          }
        ],
        displayPage: [
          {
            required: true,
            message: "请选择展示页面",
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
    ...mapState("banner", {
      list: state => state.bannerList,
      currentPage: state => state.bannerPageNum,
      pageSize: state => state.bannerPageSize,
      totalPages: state => state.bannerTotalSize
    }),
    ...mapState("page", ["allPages"])
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions("banner", [
      "getBanner",
      "createBanner",
      "editBanner",
      "changeBannerStatus",
      "changeBannerSort",
      "bannerDelete"
    ]),
    ...mapActions("page", ["getPages"]),
    moment,
    init() {
      this.getAllPages();
      this.getData();
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
    // 获取列表数据
    async getData(page, pageSize) {
      const response = await this.getBanner({
        pageNum: page || this.currentPage,
        pageSize: pageSize || this.pageSize
      });
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getBanner",
          duration: 2
        });
      }
    },
    // 删除
    async onDelete(id, dataIndex) {
      // console.log(id, dataIndex, value)
      this.$message.loading({
        content: "正在修改",
        key: dataIndex
      });
      const response = await this.bannerDelete({
        id
      });
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
        key: dataIndex
      });
      const status = value == 1 ? 0 : 1;
      const response = await this.changeBannerStatus({
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
    // 修改排序
    async onCellChange(id, dataIndex, value) {
      this.$message.loading({
        content: "正在修改",
        key: dataIndex
      });
      const response = await this.changeBannerSort({
        bannerSort: value,
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
            ? this.editForBanner()
            : this.createForBanner();
          // console.log(response)
          response
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success({
                  content: "操作成功",
                  key: "createBanner",
                  duration: 2
                });
                this.cancelCreate();
              } else {
                this.$message.error({
                  content: res.msg,
                  key: "createBanner",
                  duration: 2
                });
              }
              this.loading = false;
              this.getData();
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          //   console.log("error submit!!");
          this.loading = false;
          return false;
        }
      });
    },
    // 新增广告位
    createForBanner() {
      const {
        name: dataIndex,
        title,
        titleDisplay,
        image,
        displayPage,
        linkType,
        pageUrl,
        url,
        miniappId,
        miniappUrl
      } = this.form;
      console.log(dataIndex);
      const startTime = Number(
        moment(this.form.validTime[0])
          .valueOf()
          .toFixed(0)
      );
      const endTime = Number(
        moment(this.form.validTime[1])
          .valueOf()
          .toFixed(0)
      );
      return this.createBanner({
        title,
        titleDisplay,
        image,
        displayPage,
        linkType,
        pageUrl,
        url,
        miniappId,
        miniappUrl,
        startTime,
        endTime
      });
    },
    // 编辑广告位
    editForBanner() {
      const {
        name: dataIndex,
        title,
        titleDisplay,
        image,
        displayPage,
        linkType,
        pageUrl,
        url,
        miniappId,
        miniappUrl
      } = this.form;
      console.log(dataIndex);

      const id = this.form.id;
      let startTime = null;
      let endTime = null;
      if (this.form.validTime.length > 0) {
        startTime = Number(
          moment(this.form.validTime[0])
            .valueOf()
            .toFixed(0)
        );
        endTime = Number(
          moment(this.form.validTime[1])
            .valueOf()
            .toFixed(0)
        );
      }
      return this.editBanner({
        id,
        title,
        titleDisplay,
        image,
        displayPage,
        linkType,
        pageUrl,
        url,
        miniappId,
        miniappUrl,
        startTime,
        endTime
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
      let startTime = null;
      let endTime = null;
      if (value.startTime != null) {
        startTime = moment(value.startTime).format("YYYY-MM-DD HH:mm");
      }
      if (value.endTime != null) {
        endTime = moment(value.endTime).format("YYYY-MM-DD HH:mm");
      }
      console.log(startTime);
      this.form = {
        id: value.id,
        title: value.title,
        image: value.image,
        titleDisplay: value.titleDisplay,
        displayPage: value.displayPage,
        linkType: value.linkType,
        pageUrl: value.pageUrl,
        validTime: [startTime, endTime],
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
        title: "",
        titleDisplay: false,
        image: "",
        displayPage: undefined,
        linkType: 1,
        validTime: [],
        url: "",
        pageUrl: "",
        miniappId: "",
        miniappUrl: ""
      };
      this.visible = true;
    },
    //  上下架时间
    confirmValidTime(value) {
      this.form.validTime = value;
      console.log(this.form.validTime);
    },
    //   上传产品图片
    uploadBannerImg(option) {
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
