<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item>
          <a-button
            type="primary"
            @click="$router.push({ path: '/trainingCamp/course/create' })"
            >新增课程</a-button
          >
        </a-form-item>
        <a-form-item label="标题">
          <a-input
            placeholder="请输入标题"
            v-model="search.title"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="分类">
          <a-select
            show-search
            :allowClear="true"
            :show-arrow="true"
            :not-found-content="'未找到'"
            :placeholder="'请输入分类'"
            :default-value="search.classify"
            v-model="search.classify"
            style="width: 200px"
          >
            <a-select-option
              v-for="item in allCategories"
              :key="item.categoryName"
              :value="item.categoryName"
            >
              {{ item.categoryName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            :allowClear="true"
            placeholder="请选择状态"
            :default-value="search.status"
            v-model="search.status"
            style="width: 200px"
          >
            <a-select-option
              :value="item.key"
              v-for="item in courseStatus"
              :key="item.value"
              >{{ item.value }}</a-select-option
            >
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
          <a-button type="primary" html-type="submit">
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :scroll="{ x: 1300 }"
      :columns="columns"
      :data-source="courses"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <template slot="id" slot-scope="text">
        <a>{{ text }}</a>
      </template>
      <!-- 封面图 -->
      <template slot="img" slot-scope="text, record">
        <img :src="record.img" style="width:108px;height:144px" />
      </template>
      <template slot="verticalVideo" slot-scope="text, record">
        {{ Boolean(record.verticalVideo) ? "是" : "否" }}
      </template>
      <!-- 标签 -->
      <template slot="tags" slot-scope="tags">
        <a-tag
          color="pink"
          v-for="tag in tags"
          :key="tag"
          style="margin-bottom:10px"
        >
          {{ tag }}
        </a-tag>
      </template>
      <!-- 状态 -->
      <template slot="status" slot-scope="text, record">
        <span
          v-for="item in courseStatus"
          :key="item.value"
          v-show="item.key === record.status"
        >
          {{ item.value }}
        </span>
      </template>
      <!-- 排序 -->
      <span slot="courseSort" slot-scope="text, record">
        <editable-cell
          :text="record.courseSort"
          @change="onCellChange(record.id, 'courseSort', $event)"
        />
      </span>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <span
          v-for="item in courseStatus"
          :key="item.value"
          v-show="item.key === record.status"
        >
          <a @click="changeStatus(record.id, 'status', record.status)">
            {{ item.value == "下架" ? "上架" : "下架" }}
          </a>
          <a-divider type="vertical" />
        </span>
        <br />

        <router-link
          :to="{ name: 'trainingCampCourseDetail', params: { id: record.id } }"
        >
          查看
        </router-link>
        <br />
        <router-link
          :to="{ name: 'trainingCampCoursePoster', params: { id: record.id } }"
        >
          分享
        </router-link>
        <br />
        <!-- 下架状态下显示编辑和删除 -->
        <span v-if="record.status == 0">
          <router-link
            :to="{ name: 'trainingCampCourseEdit', params: { id: record.id } }"
          >
            编辑
          </router-link>
          <br />
          <a-popconfirm
            v-if="courses.length"
            title="确定删除?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="() => onDelete(record.id, 'deleteCourse')"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
          <br />
        </span>
         <a :href="record.qrcodeUrl" :download="record.courseCode + '.png'"
          >下载二维码</a
        >
        <br />
        <router-link
          :to="{
            name: 'trainingCampCourseDiagramIndex',
            params: { id: record.id }
          }"
        >
          分解图
        </router-link>
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
  </div>
</template>

<script>
import EditableCell from "../../components/EditableCell";
import { mapState, mapActions } from "vuex";
import moment from "moment";
const columns = [
  {
    dataIndex: "id",
    key: "id",
    title: "ID",
    width: 100
  },
  {
    dataIndex: "img",
    key: "img",
    title: "封面图",
    scopedSlots: { customRender: "img" },
    width: 140
  },
  {
    dataIndex: "title",
    key: "title",
    title: "标题",
    width: 300
  },
  {
    dataIndex: "classify",
    key: "classify",
    title: "分类",
    scopedSlots: { customRender: "classify" },
    width: 140
  },
  {
    dataIndex: "verticalVideo",
    key: "verticalVideo",
    title: "竖视频",
    scopedSlots: { customRender: "verticalVideo" },
    width: 140
  },
  {
    dataIndex: "status",
    key: "status",
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "status" }
  },
  {
    dataIndex: "createTime",
    key: "createTime",
    title: "创建时间"
  },
  {
    dataIndex: "courseSort",
    key: "courseSort",
    title: "排序",
    scopedSlots: { customRender: "courseSort" },
    width: 130
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 150,
    scopedSlots: { customRender: "action" }
  }
];
const CourseStatus = [
  { key: 0, value: "下架" },
  { key: 1, value: "上架" }
];
export default {
  components: {
    EditableCell
  },
  data() {
    return {
      courseStatus: CourseStatus,
      loading: false,
      columns, //表头
      // 列表搜索相关
      search: {
        title: "", // 标题
        classify: undefined, // 专家ID，若设置为 ""||0 时select 组件不显示placeholder
        status: undefined, // 状态
        createTime: [] // 创建开始时间
      }
    };
  },
  computed: {
    ...mapState("trainingCampCourse", [
      "courses",
      "pageNum",
      "pageSize",
      "totalSize"
    ]),
    ...mapState("trainingCampCategory", ["allCategories"])
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions("trainingCampCourse", [
      "getCourses",
      "changeCourseStatus",
      "changeCourseSort",
      "deleteCourse"
    ]),
    ...mapActions("trainingCampCategory", ["getAllCategories"]),
    moment,
    // 初始化数据
    init() {
      if (this.$route.name != "trainingCampCourseIndex") {
        return false;
      }
      this.getData(); // 获取列表数据
      this.getCategoriesForSearch(""); // 获取所有专家
    },
    // 列表相关
    // 删除文章
    async onDelete(id, dataIndex) {
      this.$message.loading({
        content: "正在删除",
        key: dataIndex,
        duration: 2
      });
      const response = await this.deleteCourse({ id });
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
        key: dataIndex,
        duration: 2
      });
      const status = value == 1 ? 0 : 1;
      const response = await this.changeCourseStatus({
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
        key: dataIndex,
        duration: 2
      });
      console.log(value);
      const response = await this.changeCourseSort({
        courseSort: value,
        id,
        dataIndex
      });
      if (!response.code) return;
      if (response.code == 200) {
        await this.getData(); // 获取列表数据
        this.$message.success({
          content: "修改成功",
          key: dataIndex,
          duration: 2
        });
      }
    },
    // 获取列表
    async getData(page, pageSize) {
      this.loading = true;
      let { title, classify, status, createTime } = this.search;
      // 格式化时间
      const [begin, end] = createTime;
      const startTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
      const endTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
      // 格式化状态
      // console.log(
      //   page,
      //   pageSize,
      //   title,
      //   expertId,
      //   status,
      //   startCreateTime,
      //   endCreateTime
      // );
      const response = await this.getCourses({
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize,
        title,
        status,
        classify,
        startTime,
        endTime
      });
      // console.log(response);
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getCourses",
          duration: 2
        });
      }
    },
    // 获取所有分类
    async getCategoriesForSearch(categoryName) {
      // console.log(categoryName)
      const response = await this.getAllCategories({ categoryName });
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getAllCategories",
          duration: 2
        });
      }
    },
    // 搜索相关
    // 按创建时间搜索
    confirmCreateTime(value) {
      this.search.createTime = value;
      // console.log(this.search.createTime);
    },
    // 提交搜索
    searchSubmit(e) {
      // console.log(this.search);
      e.preventDefault();
      this.getData(1, this.pageSize);
    }
  }
};
</script>
