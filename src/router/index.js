import Vue from "vue";
import Router from "vue-router";
import findLast from "lodash/findLast";
import { Modal } from "ant-design-vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const NotFound = () =>
  import(/* webpackChunkName: "exception" */ "@/pages/exception/404");
// const NotPermit = ()=> import(/* webpackChunkName: "exception" */ "@/pages/exception/403");
// const ServerError = ()=> import(/* webpackChunkName: "exception" */ "@/pages/exception/500");
const PageView = () =>
  import(/* webpackChunkName: "layouts" */ "@/layouts/PageView");
// const RouteView = ()=> import(/* webpackChunkName: "layouts" */ "@/layouts/RouteView");
const MenuView = () =>
  import(/* webpackChunkName: "layouts" */ "@/layouts/MenuView");
const Login = () =>
  import(/* webpackChunkName: "login" */ "@/pages/login/Login");
const EditPassword = () =>
  import(/* webpackChunkName: "EditPassword" */ "@/pages/editPassword/index");
const CupArticleIndex = () =>
  import(/* webpackChunkName: "cup" */ "@/pages/cup/article/index");
const CupArticleEdit = () =>
  import(/* webpackChunkName: "cup" */ "@/pages/cup/article/edit");
const CupArticleDetail = () =>
  import(/* webpackChunkName: "cup" */ "@/pages/cup/article/detail");
const CupArticlePoster = () =>
  import(/* webpackChunkName: "cup" */ "@/pages/cup/article/poster");
const CupTagIndex = () =>
  import(/* webpackChunkName: "cup" */ "@/pages/cup/tag/index");
const CupStatisticsIndex = () =>
  import(/* webpackChunkName: "cup" */ "@/pages/cup/statistics/index");
const CupStatisticsCollect = () =>
  import(/* webpackChunkName: "cup" */ "@/pages/cup/statistics/collect");
const CommunityActivityIndex = () =>
  import(
    /* webpackChunkName: "community" */ "@/pages/community/activity/index"
  );
const CommunityActivityEdit = () =>
  import(/* webpackChunkName: "community" */ "@/pages/community/activity/edit");
const CommunityActivityDetail = () =>
  import(
    /* webpackChunkName: "community" */ "@/pages/community/activity/detail"
  );
const CommunityActivityPoster = () =>
  import(
    /* webpackChunkName: "community" */ "@/pages/community/activity/poster"
  );
const CommunityStatisticsIndex = () =>
  import(
    /* webpackChunkName: "community" */ "@/pages/community/statistics/index"
  );
const CommunitySignUpIndex = () =>
  import(/* webpackChunkName: "community" */ "@/pages/community/signUp/index");
const BrartsArticleIndex = () =>
  import(/* webpackChunkName: "brarts" */ "@/pages/brarts/article/index");
const BrartsArticleEdit = () =>
  import(/* webpackChunkName: "brarts" */ "@/pages/brarts/article/edit");
const BrartsArticleDetail = () =>
  import(/* webpackChunkName: "brarts" */ "@/pages/brarts/article/detail");
const BrartsStatisticsIndex = () =>
  import(/* webpackChunkName: "brarts" */ "@/pages/brarts/statistics/index");
const BrartsStatisticsJoin = () =>
  import(/* webpackChunkName: "brarts" */ "@/pages/brarts/statistics/join");
const BrartsArticlePoster = () =>
  import(/* webpackChunkName: "brarts" */ "@/pages/brarts/article/poster");
const TrainingCampEvaluationIndex = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/evaluation/index"
  );
const TrainingCampCategoryIndex = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/category/index"
  );
const TrainingCampCourseIndex = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/course/index"
  );
const TrainingCampCourseDetail = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/course/detail"
  );
const TrainingCampCourseDiagramIndex = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/courseDiagram/index"
  );
const TrainingCampCourseEdit = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/course/edit"
  );
const TrainingCampCoursePoster = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/course/poster"
  );
const TrainingCampStatisticsIndex = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/statistics/index"
  );
const TrainingCampStatisticsJoin = () =>
  import(
    /* webpackChunkName: "trainingCamp" */ "@/pages/trainingCamp/statistics/join"
  );
const UserBenefits = () =>
  import(/* webpackChunkName: "content" */ "@/pages/content/userBenefits");
const Share = () =>
  import(/* webpackChunkName: "content" */ "@/pages/content/share");
const ExpertIndex = () =>
  import(/* webpackChunkName: "expert" */ "@/pages/expert/index");
const MentorIndex = () =>
  import(/* webpackChunkName: "expert" */ "@/pages/expert/mentor");
const GoodsIndex = () =>
  import(/* webpackChunkName: "goods" */ "@/pages/goods/index.vue");
const BannerIndex = () =>
  import(/* webpackChunkName: "content" */ "@/pages/content/banner/index");
const PopupIndex = () =>
  import(/* webpackChunkName: "content" */ "@/pages/content/popup/index");
const PosterIndex = () =>
  import(/* webpackChunkName: "content" */ "@/pages/content/poster/index");
const MenuIndex = () =>
  import(/* webpackChunkName: "content" */ "@/pages/content/home/menu");
const GoodsEdit = () =>
  import(/* webpackChunkName: "goods" */ "@/pages/goods/edit");
const MemberIndex = () =>
  import(/* webpackChunkName: "member" */ "@/pages/member/index");
const ActivityIndex = () =>
  import(/* webpackChunkName: "member" */ "@/pages/member/activity");
const IntegralRule = () =>
  import(/* webpackChunkName: "member" */ "@/pages/member/integralRule");
const IntegralFlow = () =>
  import(/* webpackChunkName: "member" */ "@/pages/member/integralFlow");
const Coupon = () =>
  import(/* webpackChunkName: "member" */ "@/pages/member/coupon");
const UserBehaviorIndex = () =>
  import(/* webpackChunkName: "userBehavior" */ "@/pages/userBehavior/index");

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      meta: {
        title: "登录页"
      },
      component: Login,
      invisible: true
    },
    {
      path: "/",
      component: MenuView,
      redirect: "/cup",
      meta: { requireAuth: true },
      children: [
        // {
        //   path: "/home",
        //   name: "home",
        //   meta: {
        //     title: "首页"
        //   },
        //   component: WorkPlace
        //   // icon: "home"
        // },
        {
          path: "/editPassword/index",
          name: "editPasswordIndex",
          meta: {
            title: "修改密码"
          },
          component: EditPassword,
          icon: "setting",
          invisible: false
        },
        {
          path: "/member",
          name: "member",
          meta: {
            title: "会员管理"
          },
          component: PageView,
          redirect: "/member/index",
          icon: "folder-open",
          children: [
            {
              path: "/member/index",
              name: "memberIndex",
              meta: {
                title: "会员管理"
              },
              component: MemberIndex,
              icon: "none"
            },
            {
              path: "/member/activity",
              name: "activityIndex",
              meta: {
                title: "会员活动"
              },
              component: ActivityIndex,
              icon: "none"
            },
            {
              path: "/member/integralRule",
              name: "IntegralRule",
              meta: {
                title: "积分规则"
              },
              component: IntegralRule,
              icon: "none"
            },
            {
              path: "/member/integralFlow",
              name: "IntegralFlow",
              meta: {
                title: "积分流水"
              },
              component: IntegralFlow,
              icon: "none"
            },
            {
              path: "/member/coupon",
              name: "Coupon",
              meta: {
                title: "优惠券统计"
              },
              component: Coupon,
              icon: "none"
            }
          ]
        },
        {
          path: "/cup",
          name: "cup",
          meta: {
            title: "CUP有料"
          },
          component: PageView,
          redirect: "/cup/article/index",
          icon: "folder-open",
          children: [
            {
              path: "/cup/article/index",
              name: "cupArticleIndex",
              meta: {
                title: "文章管理"
              },
              component: CupArticleIndex,
              icon: "none"
            },
            {
              path: "/cup/article/edit/:id",
              name: "cupArticleEdit",
              meta: {
                title: "编辑文章"
              },
              component: CupArticleEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/cup/article/detail/:id",
              name: "cupArticleDetail",
              meta: {
                title: "文章详情"
              },
              component: CupArticleDetail,
              icon: "none",
              invisible: true
            },
            {
              path: "/cup/article/create",
              name: "cupArticleCreate",
              meta: {
                title: "新增文章"
              },
              component: CupArticleEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/cup/tag/index",
              name: "cupTagIndex",
              meta: {
                title: "标签管理"
              },
              component: CupTagIndex,
              icon: "none"
            },
            {
              path: "/cup/statistics/index",
              name: "cupStatisticsIndex",
              meta: {
                title: "数据统计"
              },
              component: CupStatisticsIndex,
              icon: "none"
            },
            {
              path: "/cup/statistics/collect/:id",
              name: "cupStatisticsCollect",
              meta: {
                title: "收藏用户"
              },
              component: CupStatisticsCollect,
              icon: "none",
              invisible: true
            },
            {
              path: "/cup/article/poster/:id",
              name: "cupArticlePoster",
              meta: {
                title: "分享海报"
              },
              component: CupArticlePoster,
              icon: "none",
              invisible: true
            }
          ]
        },
        {
          path: "/community",
          name: "community",
          component: PageView,
          redirect: "/community/activity/index",
          icon: "folder-open",
          meta: {
            title: "社区活动"
          },
          children: [
            {
              path: "/community/activity/index",
              name: "communityActivityIndex",
              component: CommunityActivityIndex,
              icon: "none",
              meta: {
                title: "活动管理"
              }
            },
            {
              path: "/community/activityedit/:id",
              name: "communityActivityEdit",
              meta: {
                title: "编辑活动"
              },
              component: CommunityActivityEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/community/activity/detail/:id",
              name: "communityActivityDetail",
              meta: {
                title: "活动详情"
              },
              component: CommunityActivityDetail,
              icon: "none",
              invisible: true
            },
            {
              path: "/community/activity/create",
              name: "communityActivityCreate",
              meta: {
                title: "新增活动"
              },
              component: CommunityActivityEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/community/signUp/Index",
              name: "communitySignUpIndex",
              component: CommunitySignUpIndex,
              icon: "none",
              meta: {
                title: "报名管理"
              }
            },
            {
              path: "/community/statistics/index/:activityCode?",
              name: "communityStatisticsIndex",
              meta: {
                title: "数据统计"
              },
              component: CommunityStatisticsIndex,
              icon: "none"
            },
            {
              path: "/community/activity/poster/:id",
              name: "communityActivityPoster",
              meta: {
                title: "分享海报"
              },
              component: CommunityActivityPoster,
              icon: "none",
              invisible: true
            }
          ]
        },
        {
          path: "/brarts",
          name: "brarts",
          component: PageView,
          redirect: "/brarts/article/index",
          icon: "folder-open",
          meta: {
            title: "BRARTS"
          },
          children: [
            {
              path: "/brarts/article/index",
              name: "brartsArticleIndex",
              component: BrartsArticleIndex,
              icon: "none",
              meta: {
                title: "文章管理"
              }
            },
            {
              path: "/brarts/article/edit/:id",
              name: "brartsArticleEdit",
              meta: {
                title: "编辑文章"
              },
              component: BrartsArticleEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/brarts/article/detail/:id",
              name: "brartsArticleDetail",
              meta: {
                title: "文章详情"
              },
              component: BrartsArticleDetail,
              icon: "none",
              invisible: true
            },
            {
              path: "/brarts/article/create",
              name: "brartsArticleCreate",
              meta: {
                title: "新增文章"
              },
              component: BrartsArticleEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/brarts/statistics/index",
              name: "brartsStatisticsIndex",
              component: BrartsStatisticsIndex,
              icon: "none",
              meta: {
                title: "数据统计"
              }
            },
            {
              path: "/brarts/statistics/join/:id",
              name: "brartsStatisticsJoin",
              meta: {
                title: "打卡用户"
              },
              component: BrartsStatisticsJoin,
              icon: "none",
              invisible: true
            },
            {
              path: "/brarts/Article/poster/:id",
              name: "brartsArticlePoster",
              meta: {
                title: "分享海报"
              },
              component: BrartsArticlePoster,
              icon: "none",
              invisible: true
            }
          ]
        },
        {
          path: "/trainingCamp",
          name: "trainingCamp",
          component: PageView,
          meta: {
            title: "体态训练营"
          },
          redirect: "/trainingCamp/evaluation/index",
          icon: "folder-open",
          children: [
            {
              path: "/trainingCamp/evaluation/index",
              name: "trainingCampEvaluationIndex",
              meta: {
                title: "体态测评管理"
              },
              component: TrainingCampEvaluationIndex,
              icon: "none"
            },
            {
              path: "/trainingCamp/course/index",
              name: "trainingCampCourseIndex",
              meta: {
                title: "课程管理"
              },
              component: TrainingCampCourseIndex,
              icon: "none"
            },
            {
              path: "/trainingCamp/course/detail/:id",
              name: "trainingCampCourseDetail",
              meta: {
                title: "课程详情"
              },
              component: TrainingCampCourseDetail,
              icon: "none",
              invisible: true
            },
            {
              path: "/trainingCamp/courseDiagram/index/:id",
              name: "trainingCampCourseDiagramIndex",
              meta: {
                title: "课程分解图"
              },
              component: TrainingCampCourseDiagramIndex,
              icon: "none",
              invisible: true
            },
            {
              path: "/trainingCamp/course/edit/:id",
              name: "trainingCampCourseEdit",
              meta: {
                title: "课程编辑"
              },
              component: TrainingCampCourseEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/trainingCamp/course/create",
              name: "trainingCampCourseCreate",
              meta: {
                title: "新增课程"
              },
              component: TrainingCampCourseEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/trainingCamp/course/poster/:id",
              name: "trainingCampCoursePoster",
              meta: {
                title: "分享海报"
              },
              component: TrainingCampCoursePoster,
              icon: "none",
              invisible: true
            },
            {
              path: "/trainingCamp/category/index",
              name: "trainingCampCategoryIndex",
              meta: {
                title: "分类管理"
              },
              component: TrainingCampCategoryIndex,
              icon: "none"
            },
            {
              path: "/trainingCamp/statistics/index",
              name: "trainingCampStatisticsIndex",
              meta: {
                title: "数据统计"
              },
              component: TrainingCampStatisticsIndex,
              icon: "none"
            },
            {
              path: "/trainingCamp/statistics/join/:id",
              name: "trainingCampStatisticsJoin",
              meta: {
                title: "打卡用户"
              },
              component: TrainingCampStatisticsJoin,
              invisible: true,
              icon: "none"
            }
          ]
        },
        {
          path: "/goods",
          name: "goods",
          meta: {
            title: "产品管理"
          },
          component: PageView,
          redirect: "/goods/index",
          icon: "folder-open",
          children: [
            {
              path: "/goods/index",
              name: "goodsIndex",
              meta: {
                title: "产品管理"
              },
              component: GoodsIndex,
              icon: "none"
            },
            {
              path: "/goods/edit/:id",
              name: "goodsEdit",
              meta: {
                title: "编辑产品"
              },
              component: GoodsEdit,
              icon: "none",
              invisible: true
            },
            {
              path: "/goods/create",
              name: "goodsCreate",
              meta: {
                title: "新增产品"
              },
              component: GoodsEdit,
              icon: "none",
              invisible: true
            }
          ]
        },
        //,
        // {
        //   path: "/list",
        //   name: "体态训练营",
        //   component: QueryList,
        //   redirect: "/list/query",
        //   icon: "home",
        //   children: [
        //     {
        //       path: "/list/query",
        //       name: "体态测评",
        //       component: QueryList,
        //       icon: "home"
        //     },
        //     {
        //       path: "/list/query",
        //       name: "课程管理",
        //       component: QueryList,
        //       icon: "home"
        //     },
        //     {
        //       path: "/list/query",
        //       name: "分类管理",
        //       component: QueryList,
        //       icon: "home"
        //     }
        //   ]
        // }
        {
          path: "/content",
          name: "content",
          meta: {
            title: "内容管理"
          },
          component: PageView,
          redirect: "/content/banner/index",
          icon: "folder-open",
          children: [
            {
              path: "/content/banner/index",
              name: "bannerIndex",
              meta: {
                title: "广告位管理"
              },
              component: BannerIndex,
              icon: "none"
            },
            {
              path: "/content/popup/index",
              name: "popupIndex",
              meta: {
                title: "弹窗管理"
              },
              component: PopupIndex,
              icon: "none"
            },
            {
              path: "/content/poster/index",
              name: "posterIndex",
              meta: {
                title: "海报管理"
              },
              component: PosterIndex,
              icon: "none"
            },
            {
              path: "/content/home/menu",
              name: "menuIndex",
              meta: {
                title: "首页管理"
              },
              component: MenuIndex,
              icon: "none"
            },
            {
              path: "/content/userBenefits",
              name: "userBenefits",
              meta: {
                title: "用户权益介绍"
              },
              component: UserBenefits,
              icon: "none"
            },
            {
              path: "/content/share",
              name: "share",
              meta: {
                title: "分享管理"
              },
              component: Share,
              icon: "none"
            }
          ]
        },
        {
          path: "/expert",
          name: "expert",
          meta: {
            title: "专家/导师管理"
          },
          component: PageView,
          redirect: "/expert/index",
          icon: "folder-open",
          children: [
            {
              path: "/expert/index",
              name: "expertIndex",
              meta: {
                title: "专家管理"
              },
              component: ExpertIndex,
              icon: "none"
            },
            {
              path: "/expert/mentor",
              name: "mentorIndex",
              meta: {
                title: "导师管理"
              },
              component: MentorIndex,
              icon: "none"
            }
          ]
        },
        {
          path: "/userBehavior",
          name: "userBehavior",
          meta: {
            title: "互动统计"
          },
          component: PageView,
          redirect: "/userBehavior/index",
          icon: "folder-open",
          children: [
            {
              path: "/userBehavior/index",
              name: "userBehaviorIndex",
              meta: {
                title: "用户行为统计"
              },
              component: UserBehaviorIndex,
              icon: "none"
            }
          ]
        }
      ]
    },
    {
      path: "*",
      name: "404",
      icon: "none",
      component: NotFound
    }
  ]
});
router.beforeEach((to, from, next) => {
  Modal.destroyAll();
  if (to.path !== from.path) {
    NProgress.start();
  }
  const record = findLast(to.matched, record => record.meta.requireAuth);
  if (record && record.meta.requireAuth) {
    if (!sessionStorage["token"] && to.path !== "/login") {
      next({
        path: "/login"
      });
    } else {
      next();
    }
  } else {
    next();
  }
  NProgress.done();
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
