<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item>
          <a-button type="primary" @click="showCreateModal">新增标签</a-button>
        </a-form-item>
        <a-form-item label="标签名称">
          <a-input
            placeholder="请输入标签名称"
            v-model="search.name"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="显示状态">
          <a-select
            :allowClear="true"
            placeholder="请选择状态"
            :default-value="search.status"
            v-model="search.status"
            style="width: 200px"
          >
            <a-select-option
              :value="item.key"
              v-for="item in tagStatus"
              :key="item.key"
              >{{ item.value }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :scroll="{ x: 1000 }"
      :columns="columns"
      :data-source="list"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <!-- 状态 -->
      <template slot="status" slot-scope="text, record">
        <span
          v-for="item in tagStatus"
          :key="item.key"
          v-show="item.key === record.status"
        >
          {{ item.value }}
        </span>
      </template>
      <!-- 排序 -->
      <span slot="tagsSort" slot-scope="text, record">
        <editable-cell
          :text="text"
          @change="onCellChange(record.id, 'tagsSort', $event)"
        />
      </span>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <span
          v-for="item in tagStatus"
          :key="item.key"
          v-show="item.key === record.status"
        >
          <a @click="changeStatus(record.id, 'status', record.status)">{{
            item.value == "隐藏" ? "显示" : "隐藏"
          }}</a>
        </span>
        <span v-show="!Boolean(record.status)">
          <a-divider type="vertical" />
          <a @click="showEditModal(record.id, 'tagsName', record.tagsName)">
            编辑
          </a>
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
      :title="(isEdit ? '编辑' : '新增') + '标签'"
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
        <a-form-model-item ref="name" label="标签名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入标签名称，10字以内" />
        </a-form-model-item>
        <!-- <a-form-model-item label="显示状态" prop="state">
          <a-switch v-model="form.state" />
        </a-form-model-item> -->
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import EditableCell from "../../components/EditableCell";
import { mapState, mapActions } from "vuex";
const columns = [
  {
    dataIndex: "id",
    title: "ID"
  },
  {
    dataIndex: "tagsName",
    title: "标签名称"
  },
  {
    dataIndex: "createTime",
    title: "创建时间"
  },
  {
    dataIndex: "tagsSort",
    title: "排序",
    scopedSlots: { customRender: "tagsSort" },
    width: 200
  },
  {
    dataIndex: "status",
    title: "状态",
    scopedSlots: { customRender: "status" }
  },
  {
    dataIndex: "action",
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
];
const TagStatus = [
  { key: 0, value: "隐藏" },
  { key: 1, value: "显示" }
];
export default {
  components: {
    EditableCell
  },
  data() {
    return {
      tagStatus: TagStatus,
      loading: false, // 数据加载中
      //查询
      search: {
        name: "", // 名称
        status: undefined // 状态
      },
      columns, // 表头
      // 新增/编辑表单
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      //   新增/编辑标签
      isEdit: false, // 是否是编辑标签
      visible: false, //是否显示新增Modal
      submitLoading: false, // 正在提交表单
      // 新增/编辑标签表单
      form: {
        name: "" //标签名称,
        // state: true // 标签状态
      },
      // 新增/编辑标签表单校验
      rules: {
        name: [
          {
            required: true,
            message: "请输入标签名称，10 字以内",
            trigger: "blur"
          },
          {
            min: 1,
            max: 10,
            message: "标签名称十个字以内",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("cupTag", {
      list: state => state.tags,
      currentPage: state => state.tagsPageNum,
      pageSize: state => state.tagsPageSize,
      totalPages: state => state.tagsTotalSize
    })
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("cupTag", [
      "getTags",
      "changeTagSort",
      "changeTagStatus",
      "createTag",
      "editTag"
    ]),
    // 列表相关
    // 修改状态
    async changeStatus(id, dataIndex, value) {
      // console.log(id, dataIndex, value)
      this.$message.loading({
        content: "正在修改",
        key: dataIndex
      });
      const status = value == 1 ? 0 : 1;
      const response = await this.changeTagStatus({
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
      const response = await this.changeTagSort({
        tagsSort: value,
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
      this.loading = true;
      const response = await this.getTags({
        pageNum: page || this.currentPage,
        pageSize: pageSize || this.pageSize,
        status: this.search.status,
        tagsName: this.search.name
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getTags",
          duration: 2
        });
      }
    },
    // 新增/编辑标签相关
    // 提交新增/编辑表单
    createSubmit() {
      this.submitLoading = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let response = this.isEdit ? this.editForTag() : this.createForTag();
          // console.log(response)
          response
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success({
                  content: "操作成功",
                  key: "createTag",
                  duration: 2
                });
                this.cancelCreate();
              } else {
                this.$message.error({
                  content: res.msg,
                  key: "createTag",
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
    // 编辑标签
    editForTag() {
      const { name: tagName, id, dataIndex } = this.form;
      return this.editTag({ tagName, id, dataIndex });
    },
    // 新增标签
    createForTag() {
      return this.createTag({ tagName: this.form.name });
    },
    // 取消、隐藏新增/编辑Modal
    cancelCreate() {
      this.visible = false;
      this.submitLoading = false;
      this.form.name = "";
      // this.form.state = true;
    },
    // 显示编辑Modal
    showEditModal(id, dataIndex, value) {
      // console.log(id, dataIndex, value)
      this.isEdit = true;
      this.form.name = value;
      this.form.id = id;
      this.form.dataIndex = dataIndex;
      // this.form.state = false;
      this.visible = true;
    },
    // 显示新增/编辑Modal
    showCreateModal() {
      this.isEdit = false;
      this.form = { name: "" };
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
      this.getData(1, this.pageSize);
    }
  }
};
</script>
