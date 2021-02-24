import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login";
import setting from "./modules/setting";
import cupTag from "./modules/cup/tag";
import cupArticle from "./modules/cup/article";
import cupStatistics from "./modules/cup/statistics";
import cupCollect from "./modules/cup/collect";
import communityActivity from "./modules/community/activity";
import communityStatistic from "./modules/community/statistics";
import communitySignUp from "./modules/community/signUp";
import trainingCampCategory from "./modules/trainingCamp/category";
import trainingCampCourse from "./modules/trainingCamp/course";
import trainingCampCourseDiagram from "./modules/trainingCamp/courseDiagram";
import trainingCampEvaluation from "./modules/trainingCamp/evaluation";
import trainingCampStatistics from "./modules/trainingCamp/statistics";
import trainingCampJoin from "./modules/trainingCamp/join";
import expert from "./modules/expert";
import goods from "./modules/goods";
import banner from "./modules/content/banner";
import popup from "./modules/content/popup";
import poster from "./modules/content/poster";
import menu from "./modules/content/menu";
import userBenefits from "./modules/content/userBenefits";
import share from "./modules/content/share";
import member from "./modules/user/member";
import userActivity from "./modules/user/userActivity";
import userIntegralRule from "./modules/user/userIntegralRule";
import integralFlow from "./modules/user/integralFlow";
import coupon from "./modules/user/coupon";
import userBehavior from "./modules/userBehavior";
import page from "./modules/page";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login,
    setting,
    cupTag,
    cupArticle,
    cupStatistics,
    cupCollect,
    communityActivity,
    communityStatistic,
    communitySignUp,
    trainingCampCategory,
    trainingCampCourse,
    trainingCampCourseDiagram,
    trainingCampEvaluation,
    trainingCampStatistics,
    trainingCampJoin,
    expert,
    goods,
    banner,
    popup,
    poster,
    member,
    userActivity,
    userIntegralRule,
    integralFlow,
    coupon,
    menu,
    userBenefits,
    share,
    userBehavior,
    page
  }
});
