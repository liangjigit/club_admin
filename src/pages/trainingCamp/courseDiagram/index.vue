<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-button type="primary" @click="showCreateModal">新增分解图</a-button>
    </div>
    <a-table
      :scroll="{ x: 1300 }"
      :columns="columns"
      :data-source="diagrams"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <!-- 分解图 -->
      <template slot="explodedImg" slot-scope="text, record">
        <img :src="record.explodedImg" style="width:117px;height:65.5px" />
      </template>
      <!-- 状态 -->
      <template slot="status" slot-scope="text, record">
        <span
          v-for="item in diagramStatus"
          :key="item.key"
          v-show="item.key === record.status"
        >
          {{ item.value }}
        </span>
      </template>
      <!-- 排序 -->
      <span slot="sort" slot-scope="text, record">
        <editable-cell
          :text="text"
          @change="onCellChange(record.id, 'sort', $event)"
        />
      </span>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <span
          v-for="item in diagramStatus"
          :key="item.key"
          v-show="item.key === record.status"
        >
          <a @click="changeStatus(record.id, 'status', record.status)">{{
            item.value == "隐藏" ? "显示" : "隐藏"
          }}</a>
        </span>
        <!-- 隐藏状态下显示编辑和删除 -->
        <span v-if="record.status == 0">
          <a-divider type="vertical" />
          <a
            @click="
              showEditModal(
                record.id,
                'explodedExplain',
                record.explodedExplain,
                record.explodedImg
              )
            "
          >
            编辑
          </a>
          <a-popconfirm
            v-if="diagrams.length"
            title="确定删除?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="() => onDelete(record.id, 'deleteDiagram')"
          >
            <a-divider type="vertical" />
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
    <!-- 分页器 -->
    <div style="margin-top:20px;textAlign:right">
      <a-pagination
        :default-current="1"
        v-model="pageNum"
        :total="totalSize"
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
      :title="(isEdit ? '编辑' : '新增') + '分解图'"
      cancelText="取消"
      okText="确定"
      :centered="true"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      :confirmLoading="submitLoading"
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
          label="分解图"
          prop="img"
          extra="468*262px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadPic"
            :uploadText="'上传图片'"
            :img="form.img"
            :imgWidth="468 / 4"
            :imgHeight="262 / 4"
          ></upload-file>
        </a-form-model-item>
        <a-form-model-item
          ref="detail"
          label="分解图说明"
          prop="detail"
        >
          <a-textarea
            v-model="form.detail"
            placeholder="请输入分解图说明（100字以内）"
            :rows="4"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import uploadFile from "../../components/UploadFile";
import EditableCell from "../../components/EditableCell";
import { mapState, mapActions } from "vuex";
const columns = [
  {
    dataIndex: "id",
    title: "ID",
    width: 100
  },
  {
    dataIndex: "explodedImg",
    title: "分解图",
    scopedSlots: { customRender: "explodedImg" }
  },
  {
    dataIndex: "explodedExplain",
    title: "分解图说明"
  },
  {
    dataIndex: "status",
    title: "状态",
    scopedSlots: { customRender: "status" }
  },
  {
    dataIndex: "createTime",
    title: "创建时间"
  },
  {
    dataIndex: "sort",
    key: "sort",
    title: "排序",
    scopedSlots: { customRender: "sort" },
    width: 130
  },
  {
    dataIndex: "action",
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
];
const DiagramStatus = [
  { key: "", value: "所有" },
  { key: 0, value: "隐藏" },
  { key: 1, value: "显示" }
];
export default {
  components: {
    EditableCell,
    uploadFile
  },
  data() {
    return {
      diagramStatus: DiagramStatus,
      loading: false, // 列表数据加载
      columns, // 表头
      // 新增/编辑表单
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      //   新增/编辑分解图
      isEdit: false, // 是否是编辑分解图
      visible: false, //是否显示新增Modal
      submitLoading: false, // 正在提交表单
      // 新增/编辑分解图表单
      form: {
        img: "", // 分解图
        detail: "" //分解图说明
      },
      // 新增/编辑分解图表单校验
      rules: {
        img: {
          required: true,
          message: "请上传分解图",
          trigger: "change"
        },
        detail: [
          {
            required: true,
            message: "请输入分解图说明",
            trigger: "blur"
          },
          {
            max: 100,
            message: "100字以内",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("trainingCampCourseDiagram", [
      "diagrams",
      "pageNum",
      "totalSize",
      "pageSize",
      "courseId"
    ])
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions("trainingCampCourseDiagram", [
      "getDiagrams",
      "deleteDiagram",
      "changeDiagramSort",
      "changeDiagramStatus",
      "createDiagram",
      "editDiagram"
    ]),
    // 初始化数据
    init() {
      if (this.$route.name != "trainingCampCourseDiagramIndex") {
        return false;
      }
      this.getData(); // 获取列表数据
    },
    // 列表相关
    // 删除文章
    async onDelete(id, dataIndex) {
      this.$message.loading({
        content: "正在删除",
        key: dataIndex,
        duration: 2
      });
      const response = await this.deleteDiagram({ id });
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
        key: dataIndex
      });
      const status = value == 1 ? 0 : 1;
      const response = await this.changeDiagramStatus({
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
        key: dataIndex
      });
      const response = await this.changeDiagramSort({
        sort: value,
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
    // 获取列表数据
    async getData(page, pageSize) {
      const courseId = this.$route.params.id || 0;
      if (courseId == 0) {
        return false;
      }
      this.loading = true;
      const response = await this.getDiagrams({
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize,
        courseId: Number(courseId)
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getDiagrams",
          duration: 2
        });
      }
    },
    // 新增/编辑分解图相关
    // 提交新增/编辑表单
    createSubmit() {
      this.submitLoading = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let response = this.isEdit
            ? this.editForDiagram()
            : this.createForDiagram();
          // console.log(response)
          response
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success({
                  content: "操作成功",
                  key: "createDiagram",
                  duration: 2
                });
                this.cancelCreate();
              } else {
                this.$message.error({
                  content: res.msg,
                  key: "createDiagram",
                  duration: 2
                });
              }
              this.submitLoading = false;
            })
            .catch(() => {
              this.submitLoading = false;
            });

          // console.log(this.form);
        } else {
          //   console.log("error submit!!");
          this.submitLoading = false;
          return false;
        }
      });
    },
    // 编辑分解图
    editForDiagram() {
      const { img, detail, id } = this.form;
      return this.editDiagram({
        explodedImg: img,
        explodedExplain: detail,
        id
      });
    },
    // 新增分解图
    createForDiagram() {
      const { detail, img } = this.form;
      return this.createDiagram({
        explodedExplain: detail,
        explodedImg: img
      });
    },
    // 上传分享图片
    uploadPic(option) {
      this.form.img = option.imageUrl;
    },
    // 取消、隐藏新增/编辑Modal
    cancelCreate() {
      this.visible = false;
      this.submitLoading = false;
      this.form.detail = "";
      this.form.img = "";
    },
    // 显示编辑Modal
    showEditModal(id, dataIndex, detail, img) {
      console.log(id, dataIndex, detail, img);
      this.isEdit = true;
      this.form = { id, dataIndex, detail, img };
      this.visible = true;
    },
    // 显示新增/编辑Modal
    showCreateModal() {
      this.isEdit = false;
      this.form = { img: "", detail: "" };
      // this.form.state = true;
      this.visible = true;
    },
    // 搜索相关
    // 按创建时间搜索
    confirmCreateTime(value) {
      this.search.createTime = value;
      // console.log(this.search.createTime);
    },
    // 点击查询
    searchSubmit(e) {
      // console.log(this.search);
      e.preventDefault();
      this.getData();
    }
  }
};
</script>
