<template>
    <div>
        <a-tabs defaultActiveKey="0" @change="handleMenuChange">
            <a-tab-pane tab="导航管理" key="0"></a-tab-pane>
            <a-tab-pane tab="橱窗管理" key="1"></a-tab-pane>
            <a-tab-pane tab="单图管理" key="2"></a-tab-pane>
        </a-tabs>
        <a-table v-if="this.type != 2" :columns="columns"
                 :data-source="menuList"
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
            <template slot="image" slot-scope="text, record">
                <img :src="record.image" style="width:80px" />
            </template>
            <template slot="linkType" slot-scope="text, record">
                <span  v-if="record.linkType == 1">
                    <span v-for="item in displayPage"
                          :key="item.key"
                          v-show="item.key === record.pageUrl">
                        {{ item.value }}
                    </span>
                </span>
                <span  v-if="record.linkType == 2">
                    {{ record.url }}
                </span>
                <span  v-if="record.linkType == 3">
                    {{ record.miniappUrl }}
                </span>
            </template>

            <!-- 操作 -->
            <template slot="action" slot-scope="text, record">

                <span>
                    <a @click="showEditModal(record)">
                    编辑
                    </a>
                </span>
            </template>
        </a-table>

        <a-table v-if="this.type == 2" :columns="columns"
                :data-source="imageList"
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
                    v-for="item in menuStatus"
                    :key="item.key"
                    v-show="item.key === record.status">
                {{ item.value }}
            </span>
            </template>
            <template slot="image" slot-scope="text, record">
                <img :src="record.image" style="width:80px" />
            </template>
            <template slot="linkType" slot-scope="text, record">
                <span  v-if="record.linkType == 1">
                    <span v-for="item in displayPage"
                          :key="item.key"
                          v-show="item.key === record.pageUrl">
                        {{ item.value }}
                    </span>
                </span>
                <span  v-if="record.linkType == 2">
                    {{ record.url }}
                </span>
                <span  v-if="record.linkType == 3">
                    {{ record.miniappUrl }}
                </span>
            </template>

            <!-- 操作 -->
            <template slot="action" slot-scope="text, record">
                <span
                    v-for="item in menuStatus"
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
                :title="(isEdit ? '编辑' : '新增') + (type == 1 ? '橱窗' : '导航')"
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

                <a-form-model-item v-if="type == 0 || type == 1" ref="title" :label="(type == 1 ? '橱窗' : '导航') + '名称'" prop="menuName">
                    <a-input v-model="form.menuName" placeholder="4个字内" />
                </a-form-model-item>
                <a-form-model-item :label="(type == 1 ? '橱窗' : '导航') + '图片'" prop="image" v-if="type == 0 || type == 1">
                    <upload-file
                            @uploadPic="uploadMenuImg"
                            :img="form.image"
                            v-model="form.image"
                    > </upload-file>
                </a-form-model-item>
                <a-form-model-item label="图片" prop="image" v-if="type == 2">
                    <upload-file
                            @uploadPic="uploadMenuImg"
                            :img="form.image"
                            v-model="form.image"
                            :imgWidth="345"
                            :imgHeight="150"
                    > </upload-file>
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

  const MenuStatus = [
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
        menuStatus: MenuStatus,
        menuName : '导航',
        // 新增/编辑表单
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        //   新增/编辑标签
        isEdit: false, // 是否是编辑标签
        visible: false, //是否显示新增Modal
        loading: false, // 正在提交表单
        type: 0,
        columns: [],
        columnsType0 : [
          {
            dataIndex: "id",
            title: "ID"
          },
          {
            dataIndex: "image",
            title: "导航图片",
            scopedSlots: { customRender: "image" }
          },
          {
            dataIndex: "menuName",
            title: "导航名称"
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
        ],
        columnsType1 : [
          {
            dataIndex: "id",
            title: "ID"
          },
          {
            dataIndex: "image",
            title: "橱窗图片",
            scopedSlots: { customRender: "image" }
          },
          {
            dataIndex: "menuName",
            title: "橱窗名称"
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
        ],
        columnsType2 : [
          {
            dataIndex: "id",
            title: "ID"
          },
          {
            dataIndex: "image",
            title: "图片",
            scopedSlots: { customRender: "image" }
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
        ],
        // 新增/编辑表单
        form: {
          id: "",
          menuName: "",
          image: "",
          linkType: "",
          pageUrl: undefined,
          url: "",
          miniappId: "",
          miniappUrl: "",
        },
        // 新增/编辑标签表单校验
        rules: {
          menuName: [
            {
              required: true,
              message: "请填写导航名称",
              trigger: "blur"
            },
            {
              min: 1,
              max: 4,
              message: "4字以内",
              trigger: "blur"
            }
          ],
          image: [
            {
              required: true,
              message: "请上传图片",
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
      ...mapState("menu", {
        menuList: state => state.menuList
      }),
      ...mapState("poster", {
        imageList: state => state.posterList
      }),
      ...mapState("page", ["allPages"]),
    },
    created() {
      this.columns = this.columnsType0;
      this.init();
    },
    methods: {
      ...mapActions("menu", ["getMenu", "editMenu", "changeMenuStatus"]),
      ...mapActions("poster", ["getPoster", "createPoster", "editPoster", "changePosterStatus"]),
      ...mapActions("page", ["getPages"]),
      ...mapActions("poster", ["changePosterStatus"]),

      init() {
        this.getAllPages();
        this.getData();
      },
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
      async getData() {
        if(this.type == 0 || this.type == 1) {
          const response = await this.getMenu({
            type: this.type
          });
          if (response.code != 200) {
            this.$message.success({
              content: response.msg,
              key: "getMenu",
              duration: 2
            });
          }
        } else {
          const response = await this.getPoster({
            type: 1
          });
          if (response.code != 200) {
            this.$message.success({
              content: response.msg,
              key: "getPoster",
              duration: 2
            });
          }
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
            let response = this.editForMenu();
            response.then(res => {
              if (res.code == 200) {
                this.$message.success({
                  content: "操作成功",
                  key: "createMenu",
                  duration: 2
                });
                this.getData();
                this.cancelCreate();
              } else {
                this.$message.error({
                  content: res.msg,
                  key: "createMenu",
                  duration: 2
                });
              }
              this.loading = false;
            }).catch(() => {
              this.loading = false;
            });
          } else {
            this.loading = false;
            return false;
          }
        });
      },
      // 编辑
      editForMenu() {
        if(this.type == 0 || this.type == 1) {
          const {name: dataIndex, image, menuName, linkType, pageUrl, url, miniappId, miniappUrl} = this.form;
          console.log(dataIndex);
          const id = this.form.id;
          return this.editMenu({id, image, menuName, linkType, pageUrl, url, miniappId, miniappUrl});
        } else {
          const {name: dataIndex, image, linkType, pageUrl, url, miniappId, miniappUrl} = this.form;
          console.log(dataIndex);
          const id = this.form.id;
          const type = 1;
          return this.editPoster({id, type, image, linkType, pageUrl, url, miniappId, miniappUrl});
        }
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
          menuName: value.menuName,
          linkType: value.linkType,
          pageUrl: value.pageUrl,
          url: value.url,
          miniappId: value.miniappId,
          miniappUrl: value.miniappUrl,
        };
        console.log(this.form)
        this.visible = true;
      },
      // 上传图片
      uploadMenuImg(option) {
        this.form.image = option.imageUrl;
        console.log(this.form.image)
      },
      handleMenuChange(value) {
        this.type = value;
        if(value == 0) {
          this.columns = this.columnsType0;
        } else if (value == 1) {
          this.columns = this.columnsType1;
        } else if (value == 2){
          this.columns = this.columnsType2;
        }
        this.getData();
      }
    }
  }
</script>

<style>
    .functional-area {
        padding: 10px;
        background-color: #ffffff;
    }
</style>

