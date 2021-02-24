<template>
  <div>
    <p><a-alert message="体态训练营导师管理" banner /></p>

    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item>
          <a-button type="primary" @click="showCreateModal">新增导师</a-button>
        </a-form-item>

        <a-form-item label="姓名">
          <a-input
            placeholder="请输入导师姓名"
            v-model="search.expertName"
            :allowClear="true"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">
            查询
          </a-button>
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
      <template slot="action" slot-scope="text, record">
        <span>
          <a @click="showEditModal(record)">
            编辑
          </a>
          <a-divider type="vertical" />
          <a-popconfirm
            v-if="list.length"
            title="确定删除?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="() => onDelete(record.id, 'deleteExpert')"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </span>
      </template>
      <template slot="image" slot-scope="text, record">
        <img :src="record.expertPhoto" style="width:80px" />
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

    <a-modal
      :width="600"
      v-model="visible"
      :title="(isEdit ? '编辑' : '新增') + '导师'"
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
          label="导师头像"
          prop="expertPhoto"
          extra="300*300px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadExpertPhoto"
            v-model="form.expertPhoto"
            :img="form.expertPhoto"
            :imgWidth="150"
            :imgHeight="150"
          ></upload-file>
        </a-form-model-item>
        <a-form-model-item ref="title" label="导师姓名" prop="expertName">
          <a-input v-model="form.expertName" />
        </a-form-model-item>
        <a-form-model-item ref="profile" label="导师简介" prop="profile">
          <a-textarea v-model="form.profile" rows="4" cols="20"></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import uploadFile from "../components/UploadFile";
import { mapActions, mapState } from "vuex";
const columns = [
  {
    dataIndex: "id",
    title: "ID"
  },
  {
    dataIndex: "expertPhoto",
    title: "头像",
    scopedSlots: { customRender: "image" }
  },
  {
    dataIndex: "expertName",
    title: "姓名"
  },
  {
    dataIndex: "profile",
    title: "简介"
  },
  {
    dataIndex: "createTime",
    key: "createTime",
    title: "创建时间"
  },
  {
    dataIndex: "action",
    title: "操作",
    scopedSlots: { customRender: "action" },
    width: 170
  }
];
export default {
  components: {
    uploadFile
  },
  data() {
    return {
      search: {
        expertName: ""
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      columns,
      isEdit: false,
      visible: false,
      loading: false,
      form: {
        id: "",
        expertPhoto: "",
        expertName: "",
        profile: ""
      },
      // 新增/编辑标签表单校验
      rules: {
        expertName: [
          {
            required: true,
            message: "请输入专家姓名",
            trigger: "blur"
          },
          {
            min: 1,
            max: 10,
            message: "10字以内",
            trigger: "blur"
          }
        ],
        expertPhoto: [
          {
            required: true,
            message: "请上传专家头像",
            trigger: "change"
          }
        ],
        profile: [
          {
            required: true,
            message: "请输入专家简介",
            trigger: "blur"
          },
          {
            min: 1,
            max: 200,
            message: "200字以内",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("expert", {
      list: state => state.experts,
      currentPage: state => state.expertPageNum,
      pageSize: state => state.expertPageSize,
      totalPages: state => state.expertTotalSize
    })
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("expert", [
      "getExperts",
      "changeExpertSort",
      "createExpert",
      "editExpert",
      "deleteExpert",
      "changeExpertStatus"
    ]),
    async onDelete(id, dataIndex) {
      this.$message.loading({
        content: "正在删除",
        key: dataIndex,
        duration: 2
      });
      const response = await this.deleteExpert({ id });
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
    async getData(page, pageSize) {
      const response = await this.getExperts({
        type: 0,
        expertName: this.search.expertName,
        pageNum: page || this.currentPage,
        pageSize: pageSize || this.pageSize
      });
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getExperts",
          duration: 2
        });
      }
    },
    showCreateModal() {
      this.form =  {
        id: "",
        expertPhoto: "",
        expertName: "",
        profile: ""
      };
      this.isEdit = false;
      this.visible = true;
    },
    // 修改排序
    async onCellChange(id, dataIndex, value) {
      this.$message.loading({
        content: "正在修改",
        key: dataIndex,
        duration: 2
      });
      const response = await this.changeExpertSort({
        expertSort: value,
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
    // 修改状态
    async changeStatus(id, dataIndex, value) {
      // console.log(id, dataIndex, value)
      this.$message.loading({
        content: "正在修改",
        key: dataIndex
      });
      const status = value == 1 ? 0 : 1;
      const response = await this.changeExpertStatus({
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
      this.getData();
    },
    // 显示编辑Modal
    showEditModal(value) {
      this.isEdit = true;

      this.form = {
        id: value.id,
        expertPhoto: value.expertPhoto,
        expertName: value.expertName,
        profile: value.profile
      };
      this.visible = true;
    },
    // 提交新增/编辑表单
    createSubmit() {
      this.loading = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let response = this.isEdit
            ? this.editForExpert()
            : this.createForExpert();
          // console.log(response)
          response
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success({
                  content: "操作成功",
                  key: "createExpert",
                  duration: 2
                });
                this.cancelCreate();
              } else {
                this.$message.error({
                  content: res.msg,
                  key: "createExpert",
                  duration: 2
                });
              }
              this.getData();
              this.loading = false;
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
    // 新增专家
    createForExpert() {
      const { name: dataIndex, expertName, expertPhoto, profile } = this.form;
      console.log(dataIndex);
      const type = 0;
      return this.createExpert({ type, expertName, expertPhoto, profile });
    },
    // 编辑专家
    editForExpert() {
      const { name: dataIndex, expertName, expertPhoto, profile } = this.form;
      console.log(dataIndex);
      const id = this.form.id;
      const type = 0;
      return this.editExpert({ id, type, expertName, expertPhoto, profile });
    },
    // 取消、隐藏新增/编辑Modal
    cancelCreate() {
      this.visible = false;
      this.loading = false;
      this.from = "";
    },
    //   上传专家头像
    uploadExpertPhoto(option) {
      this.form.expertPhoto = option.imageUrl;
    },
    // 点击查询
    searchSubmit(e) {
      e.preventDefault();
      this.getData(1, this.pageSize);
    }
  }
};
</script>
