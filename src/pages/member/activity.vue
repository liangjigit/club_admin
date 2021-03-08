<template>
	<!-- 列表 -->
	<a-row :gutter="16">
		<a-col v-for="(item, index) in userActivitys" :key="index" class="gutter-row" :xl="12" :lg="12" :md="12" style="margin-bottom: 20px">
			<a-card hoverable style="text-align: center">
				<p>{{ item.name }}</p>
				<p>{{ item.description }}</p>
				<template slot="actions" class="ant-card-actions">
					<a-button v-if="item.status === false" type="primary" icon="edit" @click="changeStatus(item, true)">
						启用
					</a-button>
					<a-button v-if="item.type != 5 && item.status === true" type="close" icon="close-circle" @click="changeStatus(item, false)">
						禁用
					</a-button>
					<a-button v-if="item.status === true" type="primary" icon="edit" @click="openModal(item)">
						配置
					</a-button>
				</template>
			</a-card>
		</a-col>
		
		
		<a-modal :width="820" v-model="regVisible" :title="'新人礼'" cancelText="取消" okText="保存" :centered="true" :keyboard="false"
		 :maskClosable="false" :closable="false" :confirmLoading="loading" @ok="regSubmit" @cancel="cancelCallback"
		 :destroyOnClose="true">
			<p>
				<a-alert message="新用户授权手机号注册小程序并完善信息可获得礼包，礼包可包含积分和优惠券" banner />
			</p>
			<a-form-model ref="regForm" :label-col="labelCol" :wrapper-col="regWrapperCol" :model="regForm" :rules="regRules">
				<div class="form_item">
					<span class="form_label">设置信息项：</span>
					<a-select v-model="field" placeholder="请选择" style="width:200px">
						<a-select-option :value="item.id" :key="item.id" v-for="item in userFieldList">
							{{ item.fieldName }}
						</a-select-option>
					</a-select>
					<a-button type="primary" @click="addFields()" style="margin-left:10px">添加</a-button>
					<ul class="field_list">
						<li v-for="(item, index) in regForm.fieldList" :key="index">
							<div style="width:60px; text-align: right; display: inline-block; margin-right:16px">
								{{item.fieldName}}
							</div>
							<a-radio-group name="isRequired" :defaultValue="item.isRequired">
								<a-radio :value="1" @click="addOption(item, 1)">必填</a-radio>
								<a-radio :value="0" @click="addOption(item, 0)">选填</a-radio>
							</a-radio-group>
							<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteFields(item, 'reg', index)">
								<a href="javascript:;">删除</a>
							</a-popconfirm>
						</li>
					</ul>
				</div>
				<div class="form_item">
					<span class="form_label">设置礼包内容：</span>
					<a-checkbox v-model="regForm.isIntegral" :value="1">积分</a-checkbox>
					<p v-if="regForm.isIntegral" class="form_gift">
						<span class="form_span">每个用户可获得</span>
						<a-form-model-item prop="integral" class="inline">
							<a-input v-model="regForm.integral" style="margin:0 6px; width: 100px" />
						</a-form-model-item>
						<span class="form_span">积分</span>
					</p>
				</div>
				<div class="form_item">
					<span class="form_label"></span>
					<a-checkbox v-model="regForm.isCoupon" :value="1">优惠券</a-checkbox>
					<p v-if="regForm.isCoupon" class="form_gift">
						每个用户可获得
						<a-input placeholder="优惠券ID" v-model="templateCode" style="width:200px; margin-left:6px; margin-right: 6px;" />
						<a-button type="primary" @click="searchCouponTemplate('reg')" style="margin-left:10px">添加
						</a-button>
						<ul class="coupon_list">
							<li v-for="(item,index) in regForm.templateList" :key="index">
								<span class="form_span">{{ item.couponName }}</span>
								<a-form-model-item :prop="'templateList.' + index +'.couponNum'" :rules="regRules.couponNum" class="inline">
									<a-input v-model="item.couponNum" style="margin:0 6px; width: 100px;" />
								</a-form-model-item>
								<span class="form_span">张</span>
								<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteCoupon('reg', index)">
									<a href="javascript:;">删除</a>
								</a-popconfirm>
							</li>
						</ul>
					</p>
				</div>
			</a-form-model>
		</a-modal>


		<a-modal :width="880" v-model="userInfoVisible" :title="'完善信息有礼'" cancelText="取消" okText="保存" :centered="true"
		 :keyboard="false" :maskClosable="false" :closable="false" :confirmLoading="loading" @ok="userInfoSubmit" @cancel="cancelCallback"
		 :destroyOnClose="true">
			<p>
				<a-alert message="用户完善个人信息可获得礼包，礼包可包含积分和优惠券" banner />
			</p>
			<a-form-model ref="userInfoForm" :label-col="labelCol" :wrapper-col="regWrapperCol" :model="userInfoForm" :rules="userInfoRules">
				<div class="form_item">
					<span class="form_label">我的信息：</span>
					<a-switch v-model="userInfoForm.userInfoConfig.status" />
				</div>
				<div v-if="userInfoForm.userInfoConfig.status">
					<div class="form_item" style="margin-left:160px;">
						<span class="form_label">设置信息项：</span>
						<a-select :allowClear="true" v-model="userInfoField" placeholder="请选择" style="width:200px">
							<a-select-option :value="item.id" :key="item.id" v-for="item in userInfoFieldList">
								{{item.fieldName}}
							</a-select-option>
						</a-select>
						<a-button type="primary" @click="addUserInfoFields()" style="margin-left:10px">添加
						</a-button>
						<ul class="field_list">
							<li v-for="(item,index) in userInfoForm.userInfoConfig.fieldList" :key="index">
								<div style="width:70px; text-align: right; display: inline-block; margin-right:16px">
									{{item.fieldName}}
								</div>
								<a-radio-group name="isRequired" :defaultValue="item.isRequired">
									<a-radio :value="1" @click="addUserInfoOption(item, 1)">必填</a-radio>
									<a-radio :value="0" @click="addUserInfoOption(item, 0)">选填</a-radio>
								</a-radio-group>
								<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteFields(item, 'userInfo', index)">
									<a href="javascript:;">删除</a>
								</a-popconfirm>
							</li>
						</ul>
					</div>
					<div class="form_item">
						<span class="form_label" style="margin-left: 70px;">设置礼包内容：</span>
						<a-checkbox v-model="userInfoForm.userInfoConfig.isIntegral" :value="1">积分</a-checkbox>
						<p v-if="userInfoForm.userInfoConfig.isIntegral">
							<span class="form_span" style="margin-left: 180px">每个用户可获得</span>
							<a-form-model-item :prop="'userInfoConfig.integral'" :rules="userInfoRules.integral" class="inline">
								<a-input v-model="userInfoForm.userInfoConfig.integral" style="margin:0 6px; width: 100px" />
							</a-form-model-item>
							<span class="form_span">积分</span>
						</p>
					</div>
					<div class="form_item">
						<span class="form_label" style="margin-left: 70px"></span>
						<a-checkbox v-model="userInfoForm.userInfoConfig.isCoupon" :value="1">优惠券</a-checkbox>
						<p v-if="userInfoForm.userInfoConfig.isCoupon">
							<span class="form_span" style="margin-left: 180px">每个用户可获得</span>
							<a-input placeholder="优惠券ID" v-model="userInfoTemplateCode" style="width:200px; margin-left:6px; margin-right: 6px;" />
							<a-button type="primary" @click="searchCouponTemplate('userInfo')" style="margin-left:10px" v-if="userInfoForm.userInfoConfig.templateList.length < 1">添加
							</a-button>
							<ul class="coupon_list" style="margin-left: 180px">
								<li v-for="(item,index) in userInfoForm.userInfoConfig.templateList" :key="index">
									<span class="form_span">{{ item.couponName }}</span>
									<a-form-model-item :prop="'userInfoConfig.templateList.' + index +'.couponNum'" :rules="userInfoRules.couponNum"
									 class="inline">
										<a-input v-model="item.couponNum" style="margin:0 6px; width: 100px;" />
									</a-form-model-item>
									<span class="form_span">张</span>
									<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteCoupon('userInfo', index)">
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</li>
							</ul>
						</p>
					</div>
				</div>
				<div class="form_item">
					<span class="form_label">我的TA：</span>
					<a-switch v-model="userInfoForm.userSpouseConfig.status" />
				</div>
				<div v-if="userInfoForm.userSpouseConfig.status">
					<div class="form_item" style="margin-left:160px;">
						<span class="form_label">设置信息项：</span>
						<a-select :allowClear="true" v-model="userSpouseField" placeholder="请选择" style="width:200px">
							<a-select-option :value="item.id" :key="item.id" v-for="item in userSpouseFieldList">
								{{item.fieldName}}
							</a-select-option>
						</a-select>
						<a-button type="primary" @click="addUserSpouseFields()" style="margin-left:10px">添加</a-button>
						<ul class="field_list">
							<li v-for="(item,index) in userInfoForm.userSpouseConfig.fieldList" :key="index">
								<div style="width:70px; text-align: right; display: inline-block; margin-right:16px">
									{{item.fieldName}}
								</div>
								<a-radio-group name="isRequired" :defaultValue="item.isRequired">
									<a-radio :value="1" @click="addUserSpouseOption(item, 1)">必填</a-radio>
									<a-radio :value="0" @click="addUserSpouseOption(item, 0)">选填</a-radio>
								</a-radio-group>
								<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteFields(item, 'userSpouse', index)">
									<a href="javascript:;">删除</a>
								</a-popconfirm>
							</li>
						</ul>
					</div>
					<div class="form_item">
						<span class="form_label" style="margin-left: 70px;">设置礼包内容：</span>
						<a-checkbox v-model="userInfoForm.userSpouseConfig.isIntegral" :value="1">积分</a-checkbox>
						<p v-if="userInfoForm.userSpouseConfig.isIntegral">
							<span class="form_span" style="margin-left: 180px">每个用户可获得</span>
							<a-form-model-item :prop="'userSpouseConfig.integral'" :rules="userInfoRules.integral" class="inline">
								<a-input v-model="userInfoForm.userSpouseConfig.integral" style="margin:0 6px; width: 100px" />
							</a-form-model-item>
							<span class="form_span">积分</span>
						</p>
					</div>
					<div class="form_item">
						<span class="form_label" style="margin-left: 70px"></span>
						<a-checkbox v-model="userInfoForm.userSpouseConfig.isCoupon" :value="1">优惠券</a-checkbox>
						<p v-if="userInfoForm.userSpouseConfig.isCoupon">
							<span class="form_span" style="margin-left: 180px">每个用户可获得</span>
							<a-input placeholder="优惠券ID" v-model="userSpouseTemplateCode" style="width:200px; margin-left:6px; margin-right: 6px;" />
							<a-button type="primary" @click="searchCouponTemplate('userSpouse')" style="margin-left:10px" v-if="userInfoForm.userSpouseConfig.templateList.length < 1">添加
							</a-button>
							<ul class="coupon_list" style="margin-left: 180px">
								<li v-for="(item,index) in userInfoForm.userSpouseConfig.templateList" :key="index">
									<span class="form_span">{{ item.couponName }}</span>
									<a-form-model-item :prop="'userSpouseConfig.templateList.' + index +'.couponNum'" :rules="userInfoRules.couponNum"
									 class="inline">
										<a-input v-model="item.couponNum" style="margin:0 6px; width: 100px;" />
									</a-form-model-item>
									<span class="form_span">张</span>
									<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteCoupon('userSpouse', index)">
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</li>
							</ul>
						</p>
					</div>
				</div>
				<div class="form_item">
					<span class="form_label">我的宝贝：</span>
					<a-switch v-model="userInfoForm.userBabyConfig.status" />
				</div>
				<div v-if="userInfoForm.userBabyConfig.status">
					<div class="form_item" style="margin-left:160px;">
						<span class="form_label">设置信息项：</span>
						<a-select :allowClear="true" v-model="userBabyField" placeholder="请选择" style="width:200px">
							<a-select-option :value="item.id" :key="item.id" v-for="item in userBabyFieldList">
								{{item.fieldName}}
							</a-select-option>
						</a-select>
						<a-button type="primary" @click="addUserBabyFields()" style="margin-left:10px">添加</a-button>
						<ul class="field_list">
							<li v-for="(item,index) in userInfoForm.userBabyConfig.fieldList" :key="index">
								<div style="width:50px; text-align: right; display: inline-block; margin-right:16px">
									{{item.fieldName}}
								</div>
								<a-radio-group name="isRequired" :defaultValue="item.isRequired">
									<a-radio :value="1" @click="addUserBabyOption(item, 1)">必填</a-radio>
									<a-radio :value="0" @click="addUserBabyOption(item, 0)">选填</a-radio>
								</a-radio-group>
								<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteFields(item, 'userBaby', index)">
									<a href="javascript:;">删除</a>
								</a-popconfirm>
							</li>
						</ul>
					</div>
					<div class="form_item">
						<span class="form_label" style="margin-left: 70px;">设置礼包内容：</span>
						<a-checkbox v-model="userInfoForm.userBabyConfig.isIntegral" :value="1">积分</a-checkbox>
						<p v-if="userInfoForm.userBabyConfig.isIntegral">
							<span class="form_span" style="margin-left: 180px">每个用户可获得</span>
							<a-form-model-item :prop="'userBabyConfig.integral'" :rules="userInfoRules.integral" class="inline">
								<a-input v-model="userInfoForm.userBabyConfig.integral" style="margin:0 6px; width: 100px" />
							</a-form-model-item>
							<span class="form_span">积分</span>
						</p>
					</div>
					<div class="form_item">
						<span class="form_label" style="margin-left: 70px"></span>
						<a-checkbox v-model="userInfoForm.userBabyConfig.isCoupon" :value="1">优惠券</a-checkbox>
						<p v-if="userInfoForm.userBabyConfig.isCoupon">
							<span class="form_span" style="margin-left: 180px">每个用户可获得</span>
							<a-input placeholder="优惠券ID" v-model="userBabyTemplateCode" style="width:200px; margin-left:6px; margin-right: 6px;" />
							<a-button type="primary" @click="searchCouponTemplate('userBaby')" style="margin-left:10px" v-if="userInfoForm.userBabyConfig.templateList.length < 1">添加
							</a-button>
							<ul class="coupon_list" style="margin-left: 180px">
								<li v-for="(item,index) in userInfoForm.userBabyConfig.templateList" :key="index">
									<span class="form_span">{{ item.couponName }}</span>
									<a-form-model-item :prop="'userBabyConfig.templateList.' + index +'.couponNum'" :rules="userInfoRules.couponNum"
									 class="inline">
										<a-input v-model="item.couponNum" style="margin:0 6px; width: 100px;" />
									</a-form-model-item>
									<span class="form_span">张</span>
									<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteCoupon('userBaby', index)">
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</li>
							</ul>
						</p>
					</div>
					<div class="form_item">
						<span class="form_label" style="margin-left: 50px; width: 130px">允许新增多个宝贝：</span>
						<a-switch v-model="userInfoForm.userBabyConfig.isAddBaby" />
					</div>
					<a-form-model-item v-if="userInfoForm.userBabyConfig.isAddBaby" style="margin-left: 270px;margin-top:20px">
						<a-textarea v-model="userInfoForm.userBabyConfig.addBabyDesc" rows="4" cols="4" placeholder="新增宝贝说明"></a-textarea>
					</a-form-model-item>
				</div>
			</a-form-model>
		</a-modal>


		<a-modal :width="800" v-model="inviteVisible" :title="'邀请好友有礼'" cancelText="取消" okText="保存" :centered="true"
		 :keyboard="false" :maskClosable="false" :closable="false" :confirmLoading="loading" @ok="userInviteSubmit" @cancel="cancelCallback"
		 :destroyOnClose="true">
			<p>
				<a-alert message="用户邀请好友注册club小程序可获取礼包，礼包可包含积分和优惠券" banner />
			</p>
			<a-form-model ref="inviteForm" :label-col="labelCol" :wrapper-col="wrapperCol" :model="inviteForm" :rules="inviteRules">
				<a-form-model-item style="margin-left: 100px;">
					<div>
						<a-checkbox v-model="inviteForm.isIntegral" :value="1">积分</a-checkbox>
						<p v-if="inviteForm.isIntegral">
							<span class="form_span" style="margin-top: 0">每个用户可获得</span>
							<a-form-model-item prop="integral" class="inline">
								<a-input v-model="inviteForm.integral" style="margin:0 6px; width: 100px" />
							</a-form-model-item>
							<span class="form_span" style="margin-top: 0">积分</span>
						</p>
					</div>
					<div>
						<a-checkbox v-model="inviteForm.isCoupon" :value="1">优惠券</a-checkbox>
						<p v-if="inviteForm.isCoupon">
							每个用户可获得
							<a-input placeholder="优惠券ID" v-model="inviteTemplateCode" style="width:200px; margin-left:6px; margin-right: 6px;" />
							<a-button type="primary" @click="searchCouponTemplate('invite')" style="margin-left:10px">
								添加
							</a-button>
							<ul class="coupon_list">
								<li v-for="(item,index) in inviteForm.templateList" :key="index">
									<span class="form_span">{{ item.couponName }}</span>
									<a-form-model-item :prop="'templateList.' + index +'.couponNum'" :rules="inviteRules.couponNum" class="inline">
										<a-input v-model="item.couponNum" style="margin:0 6px; width: 100px;" />
									</a-form-model-item>
									<span class="form_span">张</span>
									<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteCoupon('invite', index)">
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</li>
							</ul>
						</p>
					</div>
				</a-form-model-item>
				<a-form-model-item label="海报图片" extra="png/jpg格式，2M以内">
					<upload-file @uploadPic="uploadPic" :img="inviteForm.image" v-model="inviteForm.image"></upload-file>
				</a-form-model-item>
			</a-form-model>
		</a-modal>


		<a-modal :width="800" v-model="userActivityVisible" :title="'参加社区活动有礼'" cancelText="取消" okText="保存" :centered="true"
		 :keyboard="false" :maskClosable="false" :closable="false" :confirmLoading="loading" @ok="userActivitySubmit" @cancel="cancelCallback"
		 :destroyOnClose="true">
			<p>
				<a-alert message="用户参加社区活动并完成活动签到可获取礼包，礼包可包含积分和优惠券" banner />
			</p>
			<a-form-model ref="userActivityForm" :label-col="labelCol" :wrapper-col="wrapperColActivity" :model="userActivityForm"
			 :rules="userActivityRules">
				<a-form-model-item style="margin-left: 100px; border-bottom: 1px dotted #cccccc" v-for="(item2, index2) in userActivityConfigs"
				 :key="index2">
					<div>
						参加
						<a-select :allowClear="true" v-model="item2.activityId" placeholder="请选择" style="width:200px">
							<a-select-option :value="item.id" :key="item.id" :class="item.disabled?'hidden':''" v-for="item in optionActivity"
							 :default-value="item2.activityId">
								{{item.title}}
							</a-select-option>
						</a-select>
						可获得
						<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteActivity(index2)">
							<a href="javascript:;" style="margin-left: 100px">删除这条规则</a>
						</a-popconfirm>
					</div>
					<div>
						<a-checkbox v-model="item2.isIntegral" :value="1">积分</a-checkbox>
						<p v-if="item2.isIntegral">
							每个用户可获得
							<a-input v-model="item2.integral" style="width:50px; margin-left:6px; margin-right: 6px;" />
							积分
						</p>
					</div>
					<div>
						<a-checkbox v-model="item2.isCoupon" :value="1">优惠券</a-checkbox>
						<p v-if="item2.isCoupon">
							每个用户可获得
							<a-input placeholder="优惠券ID" v-model="activityTemplateCode[index2]" style="width:200px; margin-left:6px; margin-right: 6px;" />
							<a-button type="primary" @click="addActivityCoupon(activityTemplateCode, index2)" style="margin-left:10px">
								添加
							</a-button>
							<ul>
								<li v-for="(item, index) in item2.templateList" :key="index">
									{{ item.couponName }}
									<a-input-number :min="1" :precision="0" v-model="item.couponNum" style="width:50px; margin-left:6px; margin-right: 6px;" />
									张
									<a-popconfirm title="确定删除?" ok-text="删除" cancel-text="取消" @confirm="() => onDeleteActivityCoupon(index, index2)">
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</li>
							</ul>
						</p>
					</div>
				</a-form-model-item>
				<div style="margin-left:100px">
					<a-button type="primary" icon="edit" @click="addActivtyRule()">
						添加一条规则
					</a-button>
				</div>
			</a-form-model>
		</a-modal>
		
		<club-fission @cancel="clubFissionVisible = false" v-if="clubFissionVisible"></club-fission>
	</a-row>


</template>

<script>
	import clubFission from './components/clubFission.vue'
	import uploadFile from "../components/UploadFile";
	import {
		mapActions,
		mapState
	} from "vuex";

	export default {
		components: {
			uploadFile,
			clubFission
		},
		data() {
			return {
				labelCol: {
					span: 6
				},
				wrapperCol: {
					span: 16
				},
				regWrapperCol: {
					span: 20
				},
				wrapperColActivity: {
					span: 18
				},
				regVisible: false,
				userInfoVisible: false,
				inviteVisible: false,
				userActivityVisible: false,
				clubFissionVisible:false,
				loading: false,
				field: undefined,
				userInfoField: undefined,
				userBabyField: undefined,
				userSpouseField: undefined,
				userFieldList: [],
				userInfoFieldList: [],
				userBabyFieldList: [],
				userSpouseFieldList: [],
				activityList: [],
				ruleForm: [],
				templateCode: "",
				userSpouseTemplateCode: "",
				userInfoTemplateCode: "",
				userBabyTemplateCode: "",
				inviteTemplateCode: "",
				activityTemplateCode: [],
				image: "",
				regForm: {
					isIntegral: false,
					integral: "",
					isCoupon: false,
					templateList: [],
					fieldList: []
				},
				userActivityForm: {
					activityId: "",
					integral: "",
					isCoupon: false,
					isIntegral: false,
					templateList: []
				},
				inviteForm: {
					image: "",
					isIntegral: false,
					integral: "",
					isCoupon: false,
					templateList: [],
				},
				userInfoForm: {
					userInfoConfig: {
						fieldList: [],
						integral: "",
						isCoupon: false,
						templateList: [],
						isIntegral: false,
						status: false
					},
					userBabyConfig: {
						fieldList: [],
						integral: "",
						isCoupon: false,
						templateList: [],
						isIntegral: false,
						status: false,
						isAddBaby: false,
						addBabyDesc: ""
					},
					userSpouseConfig: {
						fieldList: [],
						integral: "",
						isCoupon: false,
						templateList: [],
						isIntegral: false,
						status: false
					}
				},
				regRules: {
					userField: [{
						required: true,
						message: "至少选择一个字段",
						trigger: "blur"
					}],
					integral: [{
							required: true,
							message: "请输入积分",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]\d*$/,
							required: false,
							message: "输入大于0整数",
							trigger: ["blur", "change"]
						}
					],
					couponNum: [{
							required: true,
							message: "输入张数",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]\d*$/,
							required: false,
							message: "输入大于0整数",
							trigger: ["blur", "change"]
						}
					]
				},
				userInfoRules: {
					userField: [{
						required: true,
						message: "至少选择一个字段",
						trigger: "blur"
					}],
					integral: [{
							required: true,
							message: "请输入积分",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]\d*$/,
							required: false,
							message: "输入大于0整数",
							trigger: ["blur", "change"]
						}
					],
					couponNum: [{
							required: true,
							message: "输入张数",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]\d*$/,
							required: false,
							message: "输入大于0整数",
							trigger: ["blur", "change"]
						}
					]
				},
				inviteRules: {
					integral: [{
							required: true,
							message: "请输入积分",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]\d*$/,
							required: false,
							message: "输入大于0整数",
							trigger: ["blur", "change"]
						}
					],
					couponNum: [{
							required: true,
							message: "输入张数",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]\d*$/,
							required: false,
							message: "输入大于0整数",
							trigger: ["blur", "change"]
						}
					]
				},
				userActivityRules: {
					integral: [{
							required: true,
							message: "请输入积分",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]\d*$/,
							required: false,
							message: "输入大于0整数",
							trigger: ["blur", "change"]
						}
					],
					couponNum: [{
							required: true,
							message: "输入张数",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]\d*$/,
							required: false,
							message: "输入大于0整数",
							trigger: ["blur", "change"]
						}
					]
				}
			};
		},
		computed: {
			...mapState("userActivity",
				[
					"userActivitys",
					"userFields",
					"couponTemplates",
					"userRegConfig",
					"userInfoConfig",
					"userInviteConfig",
					"userActivityConfigs"
				]
			),
			...mapActions("communityActivity", ["allActivities"]),
			optionActivity() {
				let list = []
				let activityIds = []
				for (var i = 0; i < this.userActivityConfigs.length; i++) {
					var activityId = this.userActivityConfigs[i].activityId
					activityIds.push(activityId)
				}
				list = this.activityList.map((item) => {
					item.disabled = activityIds.includes(item.id)
					return item
				})
				console.log(list)
				return list
			}
		},
		created() {
			this.getData();
			this.getFieldList();
			this.getUserInfoFieldList();
			this.getUserSpouseFieldList();
			this.getUserBabyFieldList();
		},

		methods: {
			...mapActions("userActivity", [
				"getUserActivitys",
				"changeUserActivityStatus",
				"getUserFileds",
				"getCouponTemplates",
				"saveUserRegConfig",
				"getUserRegConfig",
				"getUserInfoConfig",
				"saveUserInfoConfig",
				"getUserInviteConfig",
				"saveUserInviteConfig",
				"getUserActivityConfig",
				"saveUserActivityConfig"
			]),
			...mapActions("communityActivity", ["getAllActivity"]),
			
			cancelCallback() {
				this.templateCode = ""
				this.userSpouseTemplateCode = ""
				this.userInfoTemplateCode = ""
				this.userBabyTemplateCode = ""
				this.inviteTemplateCode = ""
				this.activityTemplateCode = []
			},
			async searchCouponTemplate(value) {
				if (value == 'reg') {
					if (this.templateCode == null || this.templateCode == '') {
						this.$message.error({
							content: "请输入优惠券ID",
						})
					} else {
						const response = await this.getCouponTemplates({
							"templateCode": this.templateCode
						});
						if (response.code != 200) {
							this.$message.error({
								content: response.msg,
							})
						} else {
							if (response.code != 200) {
								this.$message.error({
									content: response.msg,
								})
							} else {
								response.data.forEach((item) => {
									this.regForm.templateList.push(item);
								});
								this.templateCode = '';
							}
						}
					}
				} else if (value == 'userInfo') {
					if (this.userInfoTemplateCode == null || this.userInfoTemplateCode == '') {
						this.$message.error({
							content: "请输入优惠券ID",
						})
					} else {
						const response = await this.getCouponTemplates({
							"templateCode": this.userInfoTemplateCode
						});
						if (response.code != 200) {
							this.$message.error({
								content: response.msg,
							})
						} else {
							response.data.forEach((item) => {
								this.userInfoForm.userInfoConfig.templateList.push(item);
							});
							this.userInfoTemplateCode = '';
						}
					}
				} else if (value == 'userSpouse') {
					if (this.userSpouseTemplateCode == null || this.userSpouseTemplateCode == '') {
						this.$message.error({
							content: "请输入优惠券ID",
						})
					} else {
						const response = await this.getCouponTemplates({
							"templateCode": this.userSpouseTemplateCode
						});
						if (response.code != 200) {
							this.$message.error({
								content: response.msg,
							})
						} else {
							response.data.forEach((item) => {
								this.userInfoForm.userSpouseConfig.templateList.push(item);
							});
							this.userSpouseTemplateCode = '';
						}
					}
				} else if (value == 'userBaby') {
					if (this.userBabyTemplateCode == null || this.userBabyTemplateCode == '') {
						this.$message.error({
							content: "请输入优惠券ID",
						})
					} else {
						const response = await this.getCouponTemplates({
							"templateCode": this.userBabyTemplateCode
						});
						if (response.code != 200) {
							this.$message.error({
								content: response.msg,
							})
						} else {
							response.data.forEach((item) => {
								this.userInfoForm.userBabyConfig.templateList.push(item);
							});
							this.userBabyTemplateCode = '';
						}
					}
				} else if (value == 'invite') {
					if (this.inviteTemplateCode == null || this.inviteTemplateCode == '') {
						this.$message.error({
							content: "请输入优惠券ID",
						})
					} else {
						const response = await this.getCouponTemplates({
							"templateCode": this.inviteTemplateCode
						});
						if (response.code != 200) {
							this.$message.error({
								content: response.msg,
							})
						} else {
							response.data.forEach((item) => {
								this.inviteForm.templateList.push(item);
							});
							this.inviteTemplateCode = '';
						}
					}
				}
			},
			onDeleteCoupon(value, index) {
				if (value == 'reg') {
					this.regForm.templateList.splice(index, 1);
				} else if (value == 'invite') {
					this.inviteForm.templateList.splice(index, 1);
				} else if (value == 'userInfo') {
					this.userInfoForm.userInfoConfig.templateList.splice(index, 1);
				} else if (value == 'userSpouse') {
					this.userInfoForm.userSpouseConfig.templateList.splice(index, 1);
				} else if (value == 'userBaby') {
					this.userInfoForm.userBabyConfig.templateList.splice(index, 1);
				}
			},
			onDeleteActivity(index) {
				this.userActivityConfigs.splice(index, 1);
			},
			addActivtyRule() {
				this.userActivityConfigs.push(this.userActivityForm);
			},
			onDeleteActivityCoupon(index, index2) {
				this.userActivityConfigs[index2].templateList.splice(index, 1);
			},
			async addActivityCoupon(activityTemplateCode, index) {
				if (activityTemplateCode[index] == null || activityTemplateCode[index] == '') {
					this.$message.error({
						content: "请输入优惠券ID",
					})
				} else {
					const response = await this.getCouponTemplates({
						"templateCode": activityTemplateCode[index]
					});
					if (response.code != 200) {
						this.$message.error({
							content: response.msg,
						})
					} else {
						this.activityTemplateCode[index] = "";
						response.data.forEach((item) => {
							this.userActivityConfigs[index].templateList.push(item);
						});
					}
				}
			},
			onDeleteFields(item, value, index) {
				if (value == 'reg') {
					this.regForm.fieldList.splice(index, 1);
					this.userFieldList.push(item);
				} else if (value == 'userInfo') {
					this.userInfoForm.userInfoConfig.fieldList.splice(index, 1);
					this.userInfoFieldList.push(item);
				} else if (value == 'userSpouse') {
					this.userInfoForm.userSpouseConfig.fieldList.splice(index, 1);
					this.userSpouseFieldList.push(item);
				} else if (value == 'userBaby') {
					this.userInfoForm.userBabyConfig.fieldList.splice(index, 1);
					this.userBabyFieldList.push(item);
				}
			},
			addFields() {
				this.userFieldList.forEach((item, index) => {
					if (item.id == this.field) {
						this.regForm.fieldList.push({
							id: item.id,
							field: item.field,
							fieldName: item.fieldName,
							isRequired: 1
						});
						this.userFieldList.splice(index, 1);
						this.field = undefined;
					}
				});
			},
			addUserInfoFields() {
				this.userInfoFieldList.forEach((item, index) => {
					if (item.id == this.userInfoField) {
						this.userInfoForm.userInfoConfig.fieldList.push({
							id: item.id,
							field: item.field,
							fieldName: item.fieldName,
							isRequired: 1
						});
						this.userInfoFieldList.splice(index, 1);
						this.userInfoField = undefined;
					}
				});
			},
			addUserSpouseFields() {
				this.userSpouseFieldList.forEach((item, index) => {
					if (item.id == this.userSpouseField) {
						this.userInfoForm.userSpouseConfig.fieldList.push({
							id: item.id,
							field: item.field,
							fieldName: item.fieldName,
							isRequired: 1
						});
						this.userSpouseFieldList.splice(index, 1);
						this.userSpouseField = undefined;
					}
				});
			},
			addUserBabyFields() {
				this.userBabyFieldList.forEach((item, index) => {
					if (item.id == this.userBabyField) {
						this.userInfoForm.userBabyConfig.fieldList.push({
							id: item.id,
							field: item.field,
							fieldName: item.fieldName,
							isRequired: 1
						});
						this.userBabyFieldList.splice(index, 1);
						this.userBabyField = undefined;
					}
				});
			},
			addUserInfoOption(item, value) {
				this.userInfoForm.userInfoConfig.fieldList.forEach(function(fieldItem) {
					if (item.id == fieldItem.id) {
						fieldItem.isRequired = value;
					}
				});
			},
			addUserSpouseOption(item, value) {
				this.userInfoForm.userSpouseConfig.fieldList.forEach(function(fieldItem) {
					if (item.id == fieldItem.id) {
						fieldItem.isRequired = value;
					}
				});
			},
			addUserBabyOption(item, value) {
				this.userInfoForm.userBabyConfig.fieldList.forEach(function(fieldItem) {
					if (item.id == fieldItem.id) {
						fieldItem.isRequired = value;
					}
				});
			},
			addOption(item, value) {
				this.regForm.fieldList.forEach(function(fieldItem) {
					if (item.id == fieldItem.id) {
						fieldItem.isRequired = value;
					}
				});
			},
			async userActivitySubmit() {
				let pattern = /^[1-9]\d*$/;
				let flag = true;
				this.userActivityConfigs.forEach(item => {
					//console.log(item);
					if (item.isIntegral) {
						if (item.integral == null) {
							flag = false;
							this.$message.error({
								content: "请输入积分",
							})
						} else if (!pattern.test(item.integral)) {
							flag = false;
							this.$message.error({
								content: "请输入大于0的积分",
							})
						}
					}
					if (item.isCoupon) {
						if (item.templateList.length <= 0) {
							flag = false;
							this.$message.error({
								content: "请选择优惠券",
							});
						} else if (flag) {
							item.templateList.forEach((item) => {
								if (!pattern.test(item.couponNum)) {
									flag = false;
									this.$message.error({
										content: "请输入正确的优惠券张数",
									})
								}
							});
						}
					}
				});
				//flag = false;
				if (flag) {
					const response = await this.saveUserActivityConfig(this.userActivityConfigs);
					if (!response.code) return;
					if (response.code != 200) {
						this.$message.error({
							content: response.msg,
							key: "getUserActivitys",
							duration: 2
						});
					} else {
						this.$message.success("保存成功");
					}
					this.userActivityVisible = false;
					this.getData();
				}
			},
			userInviteSubmit() {
				this.$refs.inviteForm.validate(valid => {
					if (valid) {
						if (this.inviteForm.isCoupon && this.inviteForm.templateList.length <= 0) {
							this.$message.error({
								content: "请选择优惠券",
							});
						} else {
							this.saveUserInviteSubmit();
						}
					}
				});
			},
			async saveUserInviteSubmit() {
				const response = await this.saveUserInviteConfig(this.inviteForm);
				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getUserActivitys",
						duration: 2
					});
				} else {
					this.$message.success("保存成功");
				}
				this.inviteVisible = false;
				this.getData();
			},
			userInfoSubmit() {
				this.$refs.userInfoForm.validate(valid => {
					if (valid) {
						if (this.userInfoForm.userInfoConfig.fieldList.length <= 0) {
							this.$message.error({
								content: "【我的信息】至少一个设置信息项",
							});
						} else if (this.userInfoForm.userInfoConfig.isCoupon && this.userInfoForm.userInfoConfig.templateList.length <=
							0) {
							this.$message.error({
								content: "【我的信息】请选择优惠券",
							});
						} else if (this.userInfoForm.userSpouseConfig.fieldList.length <= 0) {
							this.$message.error({
								content: "【我的TA】至少一个设置信息项",
							});
						} else if (this.userInfoForm.userSpouseConfig.isCoupon && this.userInfoForm.userSpouseConfig.templateList.length <=
							0) {
							this.$message.error({
								content: "【我的TA】请选择优惠券",
							});
						} else if (this.userInfoForm.userBabyConfig.fieldList.length <= 0) {
							this.$message.error({
								content: "【我的宝贝】至少一个设置信息项",
							});
						} else if (this.userInfoForm.userBabyConfig.isCoupon && this.userInfoForm.userBabyConfig.templateList.length <=
							0) {
							this.$message.error({
								content: "【我的宝贝】请选择优惠券",
							});
						} else {
							this.saveUserInfoSubmit();
						}
					}
				});
			},
			async saveUserInfoSubmit() {
				const response = await this.saveUserInfoConfig(this.userInfoForm);
				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getUserActivitys",
						duration: 2
					});
				} else {
					this.$message.success("保存成功");
				}
				this.userInfoVisible = false;
				this.getData();
				this.userInfoField = undefined;
				this.userSpouseField = undefined;
				this.userBabyField = undefined;
			},
			async saveRegSubmit() {
				const response = await this.saveUserRegConfig(this.regForm);
				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getUserFileds",
						duration: 2
					});
				} else {
					this.$message.success("保存成功");
				}
				this.regVisible = false;
				this.field = undefined;
			},
			regSubmit() {
				this.$refs.regForm.validate(valid => {
					if (valid) {
						if (this.regForm.fieldList.length <= 0) {
							this.$message.error({
								content: "至少一个设置信息项",
							});
						} else {
							this.saveRegSubmit();
						}
					}
				});
			},
			async getData() {
				const response = await this.getUserActivitys();
				if (response.code != 200) {
					this.$message.success({
						content: response.msg,
						key: "getUserActivitys",
						duration: 2
					});
				}
			},
			async getUserInfoFieldList() {
				const type = 1;
				const response = await this.getUserFileds({
					type
				});
				this.userInfoFieldList = [...response.data];
				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getUserFileds",
						duration: 2
					});
				}
			},
			async getUserSpouseFieldList() {
				const type = 2;
				const response = await this.getUserFileds({
					type
				});
				this.userSpouseFieldList = [...response.data];
				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getUserFileds",
						duration: 2
					});
				}
			},
			async getUserBabyFieldList() {
				const type = 3;
				const response = await this.getUserFileds({
					type
				});
				this.userBabyFieldList = [...response.data];
				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getUserFileds",
						duration: 2
					});
				}
			},
			async getFieldList() {
				const type = 4;
				let response = await this.getUserFileds({
					type
				});
				this.userFieldList = [...response.data];

				if (!response.code) return;
				if (response.code != 200) {
					this.$message.error({
						content: response.msg,
						key: "getUserFileds",
						duration: 2
					});
				}
			},
			async openModal(value) {
				if (value.type == 1) {
					const response = await this.getUserRegConfig();
					this.regForm = response.data;

					if (response.data.integral <= 0) {
						this.regForm.integral = null;
					}
					if (this.regForm.fieldList == null) {
						this.regForm.fieldList = [];
					} else {
						this.regForm.fieldList.forEach((item) => {
							this.userFieldList.forEach((item2, index) => {
								if (item.field == item2.field) {
									this.userFieldList.splice(index, 1);
								}
							});
						});
					}
					//console.log(this.regForm);
					this.field = undefined;
					this.regVisible = true;
				} else if (value.type == 2) {
					const response = await this.getUserInfoConfig();
					this.userInfoForm = response.data;
					if (this.userInfoForm.userInfoConfig.fieldList == null) {
						this.userInfoForm.userInfoConfig.fieldList = [];
					} else {
						this.userInfoForm.userInfoConfig.fieldList.forEach((item) => {
							this.userInfoFieldList.forEach((item2, index) => {
								if (item.field == item2.field) {
									this.userInfoFieldList.splice(index, 1);
								}
							});
						});
					}
					if (this.userInfoForm.userInfoConfig.templateList == null) {
						this.userInfoForm.userInfoConfig.templateList = [];
					}
					if (this.userInfoForm.userSpouseConfig.fieldList == null) {
						this.userInfoForm.userSpouseConfig.fieldList = [];
					} else {
						this.userInfoForm.userSpouseConfig.fieldList.forEach((item) => {
							this.userSpouseFieldList.forEach((item2, index) => {
								if (item.field == item2.field) {
									this.userSpouseFieldList.splice(index, 1);
								}
							});
						});
					}
					if (this.userInfoForm.userSpouseConfig.templateList == null) {
						this.userInfoForm.userSpouseConfig.templateList = [];
					}
					if (response.data.userBabyConfig.isAddBaby == 1) {
						this.userInfoForm.userBabyConfig.isAddBaby = true;
					}
					if (this.userInfoForm.userBabyConfig.fieldList == null) {
						this.userInfoForm.userBabyConfig.fieldList = [];
					} else {
						this.userInfoForm.userBabyConfig.fieldList.forEach((item) => {
							this.userBabyFieldList.forEach((item2, index) => {
								if (item.field == item2.field) {
									this.userBabyFieldList.splice(index, 1);
								}
							});
						});
					}
					if (this.userInfoForm.userBabyConfig.templateList == null) {
						this.userInfoForm.userBabyConfig.templateList = [];
					}
					this.userInfoVisible = true;
				} else if (value.type == 3) {
					const response = await this.getUserInviteConfig();
					this.inviteForm = response.data;
					this.inviteVisible = true;
				} else if (value.type == 4) {
					const response = await this.getAllActivity();
					this.activityList = response.data;
					const activtiyResponse = await this.getUserActivityConfig();
					console.log(activtiyResponse.data)
					this.userActivityVisible = true;
				}else if (value.type == 5) {
					this.clubFissionVisible = true;
				}
			},
			uploadPic(option) {
				this.inviteForm.image = option.imageUrl;
			},
			// 修改状态
			async changeStatus(value, status) {
				// console.log(id, dataIndex, value)
				const dataIndex = value.id;
				const type = value.type;
				this.$message.loading({
					content: "正在修改",
					key: dataIndex
				});
				const response = await this.changeUserActivityStatus({
					type,
					status
				});
				if (!response.code) return;
				if (response.code == 200) {
					await this.getData();
					this.$message.success({
						content: status ? "启用成功" : "禁用成功",
						key: dataIndex,
						duration: 2
					});
				}
			}
		}
	}
</script>

<style>
	.form_item {
		margin-left: 92px;
		margin-top: 20px;
	}

	.inline {
		display: inline-block;
	}

	.form_label {
		width: 110px;
		text-align: right;
		display: inline-block;
	}

	.form_span {
		display: inline-block;
		margin-top: 10px
	}

	.form_gift {
		margin-left: 110px;
		margin-top: 20px;
	}

	.field_list {
		padding: 0;
		margin: 12px 0;
	}

	.field_list li {
		list-style: none;
		line-height: 34px;
		margin-left: 100px;
	}

	.coupon_list {
		padding: 0;
		margin: 10px 0 0 10px;
	}

	.coupon_list li {
		list-style: none;
		line-height: 20px;
	}

	.coupon_list li a {
		margin-left: 10px;
	}

	.hidden {
		display: none
	}
</style>
