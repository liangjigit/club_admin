<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item label="用户手机号">
          <a-input
            placeholder="请输入用户手机号"
            v-model="search.phone"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="测评时间">
          <a-range-picker
            v-model="search.time"
            :show-time="{ defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ] }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始', '结束']"
            @ok="confirmTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :scroll="{ x: 1300 }"
      :columns="columns"
      :data-source="evaluations"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <template slot="id" slot-scope="text">
        <a>{{ text }}</a>
      </template>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <span>
          <a @click="showReport(record.phone, record.evaluationTime, record.id)"
            >查看报告</a
          >
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
      :title="'分析报告'"
      :footer="null"
      :closable="true"
    >
      <div class="page">
        <div class="bg-red"></div>
        <div class="abs bg">
          <div
            class="abs userinfo flex flex-direction justify-center align-center"
          >
            <div class="name">{{ nickname }}</div>
            <div class="avatar">
              <img :src="avatarUrl" mode="aspectFill" />
            </div>
          </div>
          <div
            class="result flex-direction flex justify-center justify-between"
          >
            <div class="box flex justify-between align-center">
              <div class="count flex justify-center">
                <span
                  class="align-self-baseline text-red-bold margin-right-sm"
                  >{{ score }}</span
                >
                <span class="align-self-baseline text-red-xs-o">分</span>
              </div>
              <div class="text flex-direction flex text-black flex-sub">
                <span style="margin-bottom: 8px;">您的美胸得分</span>
                <span
                  >超过了全国<span class="text-red-xs">{{ rank }}</span
                  >的仙女</span
                >
              </div>
            </div>
            <div class="line"></div>
            <div class="box flex justify-between align-center">
              <div class="count flex justify-center">
                <span class="text-red-bold">{{ cup }}</span>
              </div>
              <div class="text text-black flex-sub">
                <span>建议内衣尺码</span>
                <span class="text-df">{{ underBust }}{{ cup }}</span>
              </div>
            </div>
          </div>
          <div class="report flex flex-direction align-center justify-center">
            <span class="bg-text">ANALYSIS</span>
            <div class="title">
              胸部健康分析
              <a-icon @click="toggleATip" type="question-circle" />
            </div>
            <div class="tip" v-show="showATip">
              根据测试，结合【爱慕人体工学研究院】的数据研究
            </div>
            <div
              class="item flex-direction flex margin-bottom"
              v-for="(item, index) in list"
              :key="index"
            >
              <div class="item-title flex align-end justify-center">
                {{ item.analysisPre }}
                <span class="text-black-lg">{{ item.type }}</span>
                {{ item.analysisAfter }}
              </div>
              <div class="flex item-content align-center">
                <img :src="item.analysisImage" alt="" class="left-img" />
                <div class="text">{{ item.analysis }}</div>
              </div>
            </div>
          </div>
          <div class="report flex flex-direction align-center justify-center">
            <span class="bg-text">ADVICE</span>
            <div class="title">
              美胸健康建议
              <a-icon @click="toggleSTip" type="question-circle" />
            </div>
            <div class="tip" v-show="showSTip">
              针对您的胸部状况，结合【爱慕】品牌20多年的中国女性胸部健康及美学研究成果，给您提供以下建议
            </div>
            <div
              class="item flex-direction flex margin-bottom"
              v-for="(item, index) in list"
              :key="index"
            >
              <div
                class="flex  justify-center"
                :class="{
                  'item-title align-end': item.type == '很完美',
                  'item-title-lg flex-direction align-center':
                    item.type != '很完美'
                }"
              >
                <span class="flex align-end">
                  <span>{{ item.suggestPre }} </span>
                  <span
                    class="text-black-lg"
                    style="padding:0 0.5px"
                    v-if="item.type != '很完美'"
                  >
                    {{ item.type }}</span
                  >{{ item.suggestAfter }}
                </span>
                <span class="advice" v-if="item.type != '很完美'"
                  >我们建议</span
                >
              </div>
              <div
                class="flex flex-direction align-center item-content"
                style="padding: 0;"
              >
                <img :src="item.suggestImage" alt="" class="top-img" />
                <div class="text" style="padding:0 25px 25px;">
                  {{ item.suggest }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";
const columns = [
  {
    dataIndex: "id",
    key: "id",
    title: "ID"
  },
  {
    dataIndex: "phone",
    key: "phone",
    title: "手机号",
    width: 150
  },
  {
    dataIndex: "evaluationTime",
    key: "evaluationTime",
    title: "测评时间",
    width: 200
  },
  {
    dataIndex: "age",
    key: "age",
    title: "年龄段（岁）"
  },
  {
    dataIndex: "birth",
    key: "birth",
    title: "生育情况"
  },
  {
    dataIndex: "height",
    key: "height",
    title: "身高（cm）"
  },
  {
    dataIndex: "weight",
    key: "weight",
    title: "体重（kg）"
  },
  {
    dataIndex: "afterBirth",
    key: "afterBirth",
    title: "生育后状态"
  },
  {
    dataIndex: "step",
    key: "step",
    title: "闭眼原地踏步状态"
  },
  {
    dataIndex: "chestExpect",
    key: "chestExpect",
    title: "胸部改善期望"
  },
  {
    dataIndex: "underBust",
    key: "underBust",
    title: "下胸围（cm）"
  },
  {
    dataIndex: "nippleToUnderBreast",
    key: "nippleToUnderBreast",
    title: "乳点到乳下距离（cm）"
  },
  {
    dataIndex: "nippleSpacing",
    key: "nippleSpacing",
    title: "乳点距离（cm）"
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 150,
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      list: [],
      underBust: "",
      score: "",
      rank: "",
      cup: "",
      nickname: "",
      avatarUrl: "",
      showATip: false,
      showSTip: false,
      visible: false,
      loading: false,
      columns, //表头
      // 搜索相关
      search: {
        phone: "", // 用户手机号
        time: [] // 测评时间
      }
    };
  },
  computed: {
    ...mapState("trainingCampEvaluation", [
      "evaluations",
      "pageNum",
      "pageSize",
      "totalSize"
    ])
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions("trainingCampEvaluation", ["getEvaluations", "getReport"]),
    moment,
    // 初始化数据
    init() {
      if (this.$route.name != "trainingCampEvaluationIndex") {
        return false;
      }
      this.getData(); // 获取列表数据
    },
    // 获取列表
    async getData(page, pageSize) {
      this.loading = true;
      let { phone, time } = this.search;
      // 格式化时间
      const [begin, end] = time;
      const startTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
      const endTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
      // 格式化状态
      // console.log(
      //   page,
      //   pageSize,
      //   title,
      //   expertId,
      //   startCreateTime,
      //   endCreateTime
      // );
      const response = await this.getEvaluations({
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize,
        phone,
        startTime,
        endTime
      });
      // console.log(response);
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getEvaluations",
          duration: 2
        });
      }
    },
    // 搜索相关
    // 按创建时间搜索
    confirmTime(value) {
      this.search.time = value;
      // console.log(this.search.createTime);
    },
    // 提交搜索
    searchSubmit(e) {
      // console.log(this.search);
      e.preventDefault();
      this.getData(1, this.pageSize);
    },
    toggleATip() {
      this.showATip = !this.showATip;
    },
    toggleSTip() {
      this.showSTip = !this.showSTip;
    },
    // 获取分析报告
    async showReport(phone, date, postureId) {
      let response = await this.getReport({
        date: date.split(" ")[0],
        postureId,
        showCourse: false // 是否显示推荐课程
      });
      if (!response.code) return;
      if (response.code == 200) {
        let {
          underBust,
          score,
          rank,
          nickname,
          cup,
          avatarUrl,
          analysisAndSuggest
        } = response.data;
        let list = analysisAndSuggest.map(item => {
          const { problem } = item;
          item = { ...item, ...this.getDiffContent(problem) };
          return item;
        });
        this.underBust = underBust;
        this.score = score;
        this.rank = rank;
        this.cup = cup;
        this.list = list;
        this.nickname = nickname;
        this.avatarUrl = avatarUrl;
      } else {
        this.$message.error({
          content: response.msg,
          key: "getReport",
          duration: 2
        });
      }

      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    // 显示文字
    getDiffContent(problem, course) {
      course = course || "爱慕美胸操";
      let analysisImage = "";
      let analysisPre = "";
      let analysisAfter = "";
      let analysisCourse = "";
      let suggestImage = "";
      let suggestPre = "";
      let suggestAfter = "";
      let type = problem;
      switch (problem) {
        case "副乳":
          analysisImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136413956";
          suggestImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136431380";
          analysisCourse = `但不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，会在一定程度上缓解这种困扰。`;
          analysisPre = "您可能出现了";
          analysisAfter = "的迹象";
          suggestPre = "针对您胸部的";
          suggestAfter = "现象";
          break;
        case "下垂":
          analysisImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136453866";
          suggestImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136468374";
          analysisCourse = `但不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，会在一定程度上缓解这种困扰。`;
          analysisPre = "您的胸部可能出现了";
          analysisAfter = "的迹象";
          suggestPre = "针对您胸部的";
          suggestAfter = "现象";
          break;
        case "外扩":
          analysisImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136490092";
          suggestImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136510046";
          analysisCourse = `但您不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，会在一定程度上缓解这种困扰。`;
          analysisPre = "您的胸部出现了";
          analysisAfter = "的趋势";
          suggestPre = "针对您胸部的";
          suggestAfter = "趋势";
          break;
        case "贫乳":
          analysisImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136526402";
          suggestImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136541199";
          analysisCourse = `但不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，会在一定程度上缓解这种困扰。另外，您也不必刻意追求丰满胸部，自信的女人即使平胸也很美！`;
          analysisPre = "您可能有";
          analysisAfter = "的困扰";
          suggestPre = "针对您的";
          suggestAfter = "困扰";
          break;
        case "骨盆前倾":
          analysisImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136564777";
          suggestImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136580607";
          analysisCourse = "";
          analysisPre = "您可能出现";
          analysisAfter = "的迹象";
          suggestPre = "针对您的";
          suggestAfter = "";
          break;
        case "您的胸型是纺锤型":
          analysisImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136649806";
          suggestImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136663054";
          analysisCourse = `但不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，就不会出现下垂情况。`;
          analysisPre = "您的胸型是";
          analysisAfter = "";
          suggestPre = "针对您的";
          suggestAfter = "胸型";
          type = "纺锤型";
          break;
        case "您的胸型很完美":
          analysisImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136678869";
          suggestImage =
            "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136695047";
          analysisCourse = `但是也不可以松懈，坚持练习专业的【${course}】，更有助于保持完美胸型哦！`;
          analysisPre = "您的胸型";
          analysisAfter = "";
          suggestPre = "完美胸型";
          suggestAfter = "，也有建议~";
          type = "很完美";
          break;
        default:
          break;
      }
      return {
        type,
        course,
        analysisImage,
        analysisPre,
        analysisAfter,
        analysisCourse,
        suggestImage,
        suggestPre,
        suggestAfter
      };
    }
  }
};
</script>
<style scoped>
.report {
  position: relative;
}
.report .bg-text {
  font-size: 44px;
  color: #ffffff;
  font-weight: 600;
  position: absolute;
  top: 10px;
  z-index: 1;
}
.page {
  width: 100%;
  height: 737px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f9f9f9;
}
.bg-red {
  width: 750px;
  height: 750px;
  border-radius: 100%;
  background: linear-gradient(
    -50deg,
    rgba(213, 27, 71, 1),
    rgba(244, 50, 96, 1)
  );
  box-shadow: 0 7.5px 20px 0 rgba(98, 0, 23, 0.16);
  position: absolute;
  top: 50%;
  margin-top: -750px;
  left: 50%;
  margin-left: -375px;
}
.abs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.abs.bg {
  width: 100%;
  height: 100%;
  padding-top: 200px;
}
.abs.userinfo {
  height: 280px;
  width: 100%;
}
.name {
  font-size: 22px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin-bottom: 20px;
}
.avatar {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 1);
  border: 2px solid rgba(255, 255, 255, 1);
  border-radius: 50%;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
}
.result {
  width: 80%;
  height: 242px;
  background: rgba(255, 255, 255, 1);
  margin: 0 auto;
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0px 10px 30px 0px rgba(0, 15, 41, 0.12);
}
.result .line {
  width: 100%;
  height: 1px;
  background-color: rgba(204, 204, 204, 1);
}
.result text {
  line-height: 1;
}
.count {
  width: 50%;
}
.text-red-bold {
  font-size: 50px;
  font-weight: 600;
  color: #ec2c5a;
}
.text-red-xs-o {
  font-size: 14px;
  font-weight: 500;
  color: #ec2c5a;
  opacity: 0.6;
}
.text-red-xs {
  color: #ec2c5a;
  font-size: 13px;
  font-weight: 400;
}
.text-black {
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 400;
}
.text-df {
  font-size: 14px;
  font-weight: 400;
  color: #ec2c5a;
}
.text-black-lg {
  font-size: 20px;
  font-weight: bold;
}
.title {
  z-index: 2;
  font-size: 23px;
  font-weight: 600;
  color: #ec2c5a;
  margin: 47px auto 20px auto;
}
.title img {
  width: 15px;
  height: 15px;
  margin-left: 5px;
}
.tip {
  margin-bottom: 10px;
  color: #999;
  width: 80%;
  font-size: 13px;
  font-weight: 300;
  text-align: center;
}
.item {
  width: 90%;
  border-radius: 15px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0px 10px 30px 0px rgba(0, 15, 41, 0.12);
}
.item .item-title {
  background: rgba(236, 44, 90, 1);
  min-height: 60px;
  padding-bottom: 16px;
  width: 100%;
  color: #ffffff;
  letter-spacing: 1px;
  font-size: 16px;
}
.item .item-title-lg {
  background: rgba(236, 44, 90, 1);
  min-height: 79px;
  padding-bottom: 12px;
  width: 100%;
  color: #ffffff;
  letter-spacing: 1px;
  font-size: 16px;
}
.item .item-title-lg .advice {
  margin-top: 13px;
  line-height: 1;
}
.item .item-title .text-black-lg {
  margin: 0 5px;
}
.item .item-content {
  padding: 25px;
  width: 100%;
}
.item .item-content .left-img {
  width: 100px;
  display: block;
  margin-right: 20px;
}
.item .item-content .top-img {
  height: 137px;
}
.item .item-content .text {
  flex-wrap: wrap;
  line-height: 22px;
  font-size: 16px;
  font-weight: 300;
  flex: 1;
  color: #333;
}
.flex {
  display: flex;
  display: -webkit-flex;
}
.flex-direction {
  flex-direction: column;
}
.flex-sub {
  flex: 1;
}
.align-center {
  align-items: center;
}
.align-end {
  align-items: flex-end;
}
.align-self-end {
  align-self: flex-end;
}
.align-self-baseline {
  align-self: baseline;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.align-self-end {
  align-self: flex-end;
}
.align-self-baseline {
  align-self: baseline;
}
.margin-bottom {
  margin-bottom: 30px;
}
.margin-right-sm {
  margin-right: 10px;
}
</style>
