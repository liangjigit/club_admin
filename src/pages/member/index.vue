<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search">
        <a-form-item label="用户手机号">
          <a-input
            placeholder="用户手机号"
            v-model="search.phone"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="微信昵称">
          <a-input
            placeholder="微信昵称"
            v-model="search.nickname"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input
            placeholder="姓名"
            v-model="search.realname"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="性别">
          <a-select
            :allowClear="true"
            placeholder="请选择"
            :default-value="search.gender"
            v-model="search.gender"
            style="width: 100px"
          >
            <a-select-option :value="1" :key="1">男</a-select-option>
            <a-select-option :value="2" :key="2">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="会员卡号">
          <a-input
            placeholder="会员卡号"
            v-model="search.memberNo"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="ERP新用户">
          <a-select
            :allowClear="true"
            placeholder="请选择"
            :default-value="search.newUser"
            v-model="search.newUser"
            style="width: 100px"
          >
            <a-select-option :value="1" :key="1">是</a-select-option>
            <a-select-option :value="0" :key="0">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="创建时间">
          <a-range-picker
            v-model="search.createTime"
            :show-time="{ defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ] }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始', '结束']"
            @ok="confirmCreateTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="searchSubmit"  :loading="loading">
            查询
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="exportData" :loading="exportLoading">
            导出用户表
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="exportUserGuideData"
            :loading="userGuideExportLoading"
          >
            导出导购关系表
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :scroll="{ x: 1600 }"
      :columns="columns"
      :data-source="members"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <!-- 新用户 -->
      <template slot="newUserSlot" slot-scope="text, record">
        <span
          v-for="item in newUser"
          :key="item.value"
          v-show="item.key === record.newUser"
        >
          {{ item.value }}
        </span>
      </template>

      <template slot="genderSlot" slot-scope="text, record">
        <span
          v-for="item in gender"
          :key="item.value"
          v-show="item.key === record.gender"
        >
          {{ item.value }}
        </span>
      </template>

      <template slot="famliySlot" slot-scope="text, record">
        <span>
          <a @click="showUserSpouse(record)">
            我的TA </a
          ><br />
          <a @click="showUserBaby(record)">
            我的宝贝
          </a>
        </span>
      </template>
      <template slot="actionSlot" slot-scope="text, record">
        <span>
          <a @click="showUserIntegral(record)">
            积分信息 </a
          ><br />
          <a @click="showGuide(record)">
            导购关系
          </a>
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
    <a-modal :width="600" v-model="visible" :title="'我的TA'" :footer="null">
      <a-form-item
        label="姓名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userSpouse.realname || "-" }}</span>
      </a-form-item>
      <a-form-item
        label="性别"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span v-if="userSpouse.gender == 1">男</span>
        <span v-else-if="userSpouse.gender == 2">女</span>
        <span v-else>-</span>
      </a-form-item>
      <a-form-item
        label="手机号"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userSpouse.phone || "-" }}</span>
      </a-form-item>
      <a-form-item
        label="生日"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userSpouse.birthday || "-" }}</span>
      </a-form-item>
      <a-form-item
        label="文胸尺码"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userSpouse.braSize || "-" }}</span>
      </a-form-item>
      <a-form-item
        label="内裤尺码"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userSpouse.briefsSize || "-" }}</span>
      </a-form-item>
    </a-modal>

    <a-modal
      :width="600"
      v-model="babyVisible"
      :title="'我的宝贝'"
      :footer="null"
    >
      <span v-if="this.userBabyLength > 0">
        <span v-for="(item, index) in userBaby" :key="index">
          <div>
            <p style="margin-left: 96px; font-weight: bold">
              宝贝{{ item.babyIndex }}
            </p>
            <a-form-item
              label="姓名"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 16 }"
            >
              <span>{{ item.realname || "-" }}</span>
            </a-form-item>
            <a-form-item
              label="性别"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 16 }"
            >
              <span v-if="item.gender == 1">男</span>
              <span v-else-if="item.gender == 2">女</span>
              <span v-else>-</span>
            </a-form-item>

            <a-form-item
              label="生日"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 16 }"
            >
              <span>{{ item.birthday || "-" }}</span>
            </a-form-item>
            <a-form-item
              label="身高"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 16 }"
            >
              <span>{{ item.stature || "-" }}</span>
            </a-form-item>
          </div>
        </span>
      </span>
      <span v-else>
        <div>
          <a-form-item
                  label="姓名"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 16 }"
          >
            <span> - </span>
          </a-form-item>
          <a-form-item
                  label="性别"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 16 }"
          >
             <span> - </span>
          </a-form-item>

          <a-form-item
                  label="生日"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 16 }"
          >
            <span> - </span>
          </a-form-item>
          <a-form-item
                  label="身高"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 16 }"
          >
            <span> - </span>
          </a-form-item>
        </div>
      </span>
    </a-modal>

    <a-modal
      :width="600"
      v-model="integralVisible"
      :title="'积分信息'"
      :footer="null"
    >
      <a-form-item
        label="注册"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userIntegral.reg || 0 }}</span>
      </a-form-item>

      <a-form-item
        label="每日签到"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userIntegral.signIn || 0 }}</span>
      </a-form-item>
      <a-form-item
        label="阅读CUP有料"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userIntegral.cup || 0 }}</span>
      </a-form-item>
      <a-form-item
        label="体态训练营打卡"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userIntegral.trainingCamp || 0 }}</span>
      </a-form-item>
      <a-form-item
        label="参加活动"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userIntegral.activities || 0 }}</span>
      </a-form-item>
      <a-form-item
        label="完善信息"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userIntegral.information || 0 }}</span>
      </a-form-item>
      <a-form-item
        label="邀请好友"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userIntegral.invite || 0 }}</span>
      </a-form-item>
    </a-modal>

    <a-modal
      :width="600"
      v-model="guideVisible"
      :title="'导购关系'"
      :footer="null"
    >
      <a-form-item
        label="导购编号"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userGuide.guideId || "-" }}</span>
      </a-form-item>

      <a-form-item
        label="门店编码"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userGuide.erpcode || "-" }}</span>
      </a-form-item>
      <a-form-item
        label="绑定时间"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <span>{{ userGuide.createTime || "-" }}</span>
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { exportFile } from "@/utils/utils.js";
import moment from "moment";
const columns = [
  {
    dataIndex: "id",
    title: "ID",
    width: 60
  },
  {
    dataIndex: "phone",
    title: "用户手机号",
    width: 140
  },
  {
    dataIndex: "nickname",
    title: "微信昵称"
  },
  {
    dataIndex: "newUser",
    title: "ERP新用户",
    scopedSlots: { customRender: "newUserSlot" }
  },
  {
    dataIndex: "regSource",
    title: "来源"
  },
  {
    dataIndex: "realname",
    title: "姓名"
  },
  {
    dataIndex: "gender",
    title: "性别",
    scopedSlots: { customRender: "genderSlot" }
  },
  {
    dataIndex: "birthday",
    title: "生日",
    width: 120
  },
  {
    dataIndex: "membershipTime",
    title: "入会时间",
    width: 160
  },
  {
    dataIndex: "city",
    title: "所在城市"
  },
  {
    dataIndex: "career",
    title: "职业"
  },
  {
    dataIndex: "curriculumPreference",
    title: "课程偏好"
  },

  {
    dataIndex: "braSize",
    title: "尺码"
  },
  {
    dataIndex: "memberNo",
    title: "会员卡号"
  },
  {
    dataIndex: "currentIntegral",
    title: "当前积分"
  },
  {
    dataIndex: "createTime",
    title: "创建时间",
    width: 160
  },
  {
    dataIndex: "famliy",
    title: "家庭成员",
    fixed: "right",
    scopedSlots: { customRender: "famliySlot" },
    width: 100
  },
  {
    dataIndex: "action",
    title: "操作",
    fixed: "right",
    scopedSlots: { customRender: "actionSlot" },
    width: 100
  }
];
const NewUser = [
  { key: 1, value: "是" },
  { key: 0, value: "否" }
];
const Gender = [
  { key: 1, value: "男" },
  { key: 2, value: "女" }
];
export default {
  data() {
    return {
      columns,
      loading: false,
      exportLoading: false,
      userGuideExportLoading: false,
      visible: false,
      babyVisible: false,
      integralVisible: false,
      guideVisible: false,
      newUser: NewUser,
      gender: Gender,
      userBabyLength: 0,
      // 列表搜索相关
      search: {
        phone: "", //手机号
        nickname: "",
        realname: "",
        gender: undefined,
        memberNo: "",
        newUser: undefined,
        createTime: [] // 创建开始时间
      }
    };
  },
  computed: {
    ...mapState("member", [
      "members",
      "pageNum",
      "pageSize",
      "totalSize",
      "userSpouse",
      "userBaby",
      "userIntegral",
      "userGuide"
    ])
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("member", [
      "getMembers",
      "getUserSpouse",
      "getUserBaby",
      "getUserIntegral",
      "exportMember",
      "getUserGuide",
      "exportUserGuide"
    ]),
    moment,
    async getData(page, pageSize) {
      let {
        phone,
        nickname,
        realname,
        gender,
        memberNo,
        newUser,
        createTime
      } = this.search;
      // 格式化时间
      const [begin, end] = createTime;
      const startCreateTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
      const endCreateTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
      const response = await this.getMembers({
        phone,
        nickname,
        realname,
        gender,
        memberNo,
        newUser,
        startCreateTime,
        endCreateTime,
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize
      });
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getMembers",
          duration: 2
        });
      }
    },
    async exportData() {
      this.exportLoading = true;
      this.$message.loading({
        content: "正在导出",
        key: "exportMember",
        duration: 2
      });
      let {
        phone,
        nickname,
        realname,
        gender,
        memberNo,
        newUser,
        createTime
      } = this.search;
      // 格式化时间
      const [begin, end] = createTime;
      const startCreateTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
      const endCreateTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
      const response = await this.exportMember({
        phone,
        nickname,
        realname,
        gender,
        memberNo,
        newUser,
        startCreateTime,
        endCreateTime
      });
      exportFile(response, "会员表", "exportMember");
      this.exportLoading = false;
    },
    async exportUserGuideData() {
      this.userGuideExportLoading = true;
      this.$message.loading({
        content: "正在导出",
        key: "exportUserGuide",
        duration: 2
      });
      let {
        phone,
        nickname,
        realname,
        gender,
        memberNo,
        newUser,
        createTime
      } = this.search;
      // 格式化时间
      const [begin, end] = createTime;
      const startCreateTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
      const endCreateTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
      const response = await this.exportUserGuide({
        phone,
        nickname,
        realname,
        gender,
        memberNo,
        newUser,
        startCreateTime,
        endCreateTime
      });
      exportFile(response, "导购关系表", "exportUserGuide");
      this.userGuideExportLoading = false;
    },
    // 按创建时间搜索
    confirmCreateTime(value) {
      this.search.createTime = value;
    },
    // 提交搜索
    searchSubmit(e) {
      e.preventDefault();
      this.getData(1, this.pageSize);
    },
    async showUserSpouse(value) {
      this.visible = true;
      const response = await this.getUserSpouse({ userId: value.id });
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getUserSpouse",
          duration: 2
        });
      }
    },
    async showUserIntegral(value) {
      this.integralVisible = true;
      const response = await this.getUserIntegral({ userId: value.id });
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getUserIntegral",
          duration: 2
        });
      }
    },
    async showUserBaby(value) {
      const response = await this.getUserBaby({ userId: value.id });
      if (response.code != 200) {
        this.userBabyLength = 0;
        this.$message.error({
          content: response.msg,
          key: "getUserBaby",
          duration: 2
        });
      } else {
        this.userBabyLength = response.data.length;
        this.babyVisible = true;
      }
    },
    async showGuide(value) {
      this.guideVisible = true;
      const response = await this.getUserGuide({ userId: value.id });
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getUserGuide",
          duration: 2
        });
      }
    }
  }
};
</script>

<style scoped></style>
