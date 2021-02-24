<template>
    <div>

        <a-table
                :columns="columns"
                :data-source="userIntegralRules"
                bordered
                :pagination="false"
                :style="{ backgroundColor: '#ffffff' }"
                :rowKey="record => record.id"
                >
            <!-- 状态 -->
            <template slot="status" slot-scope="text, record">
            <span v-if="record.status">启用
            </span>
            <span v-else >禁用
            </span>
            </template>


            <!-- 操作 -->
            <template slot="action" slot-scope="text, record">
            <span>
                <a @click="changeRuleStatus(record.type, 'status', record.status)">{{
                    record.status ? "禁用" : "启用"
                  }}</a>
            </span>

                <a-divider type="vertical" />
                <a @click="showConfigModal(record)">
                    配置
                </a>
            </template>
        </a-table>

        <a-modal
                :width="500"
                v-model="signUpVisible"
                :title="'每日签到'"
                cancelText="取消"
                okText="保存"
                :centered="true"
                :keyboard="false"
                :maskClosable="false"
                :closable="false"
                :confirmLoading="loading"
                @ok="signUpSave()"
                :destroyOnClose="true"

        >
            <a-form-model ref="ruleForm" :model="signUpForm" :rules="rules">
                <p>
                    <span style="display: inline-block; margin-top:9px;margin-left: 80px;">连续签到1 ~ 6天 每天可获得</span>
                    <a-form-model-item  prop="signUpIntegral1" style="display: inline-block;">
                        <a-input-number :precision="0" v-model="signUpForm.signUpIntegral1" style="width:70px; margin-left:6px; margin-right: 6px;" />
                    </a-form-model-item>
                    <span>积分</span>
                </p>
                <p>
                    <span style="display: inline-block; margin-top:9px;margin-left:126px;">7 ~ 12天 每天可获得</span>
                    <a-form-model-item  prop="signUpIntegral2" style="display: inline-block;">
                       <a-input-number :precision="0" v-model="signUpForm.signUpIntegral2" style="width:70px; margin-left:6px; margin-right: 6px;" />
                    </a-form-model-item>
                    <span>积分</span>
                </p>
                <p>
                    <span style="display: inline-block; margin-top:9px;margin-left:114px;">13 ~ 18 天 每天可获得</span>
                    <a-form-model-item  prop="signUpIntegral3" style="display: inline-block">
                        <a-input-number :precision="0" v-model="signUpForm.signUpIntegral3" style="width:70px; margin-left:6px; margin-right: 6px;" />
                    </a-form-model-item>
                    <span>积分</span>
                </p>
                <p>
                    <span style="display: inline-block; margin-top:9px;margin-left:114px;">19 ~ 24 天 每天可获得</span>
                    <a-form-model-item  prop="signUpIntegral4" style="display: inline-block">
                        <a-input-number :precision="0" v-model="signUpForm.signUpIntegral4" style="width:70px; margin-left:6px; margin-right: 6px;" />
                    </a-form-model-item>
                    <span>积分</span>
                </p>
                <p>
                    <span style="display: inline-block; margin-top:9px;margin-left:110px;">25天及以上 每天可获得</span>
                    <a-form-model-item  prop="signUpIntegral5" style="display: inline-block">
                        <a-input-number :precision="0" v-model="signUpForm.signUpIntegral5" style="width:70px; margin-left:6px; margin-right: 6px;" />
                    </a-form-model-item>
                    <span>积分</span>
                </p>
            </a-form-model>

        </a-modal>

        <a-modal
                :width="600"
                v-model="cupVisible"
                :title="'阅读CUP有料内容'"
                cancelText="取消"
                okText="保存"
                :centered="true"
                :keyboard="false"
                :maskClosable="false"
                :closable="false"
                :confirmLoading="loading"
                @ok="cupSave()"
                :destroyOnClose="true"
        >
            <a-form-model ref="cupRuleForm" :model="cupForm" :rules="cupRules">
                阅读1篇CUP有料内容，可获得
                <a-form-model-item prop="cupIntegral" style="display: inline-block; margin-top: -10px">
                    <a-input v-model="cupForm.cupIntegral" style="width:50px; margin-left:6px; margin-right: 6px;" />
                </a-form-model-item>积分，
                <a-form-model-item prop="cupDayNum" style="display: inline-block; margin-top: -10px">
                    每天可获得<a-input v-model="cupForm.cupDayNum" style="width:50px; margin-left:6px; margin-right: 6px;" />次
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <a-modal
                :width="600"
                v-model="trainVisible"
                :title="'参加体态训练营'"
                cancelText="取消"
                okText="保存"
                :centered="true"
                :keyboard="false"
                :maskClosable="false"
                :closable="false"
                :confirmLoading="loading"
                @ok="trainSave()"
                :destroyOnClose="true"
        >
            <a-form-model ref="trainRuleForm" :model="trainForm" :rules="trainRules">
                参加体态训练营并完成打卡，可获得
                <a-form-model-item prop="trainIntegral" style="display: inline-block; margin-top: -10px">
                    <a-input  v-model="trainForm.trainIntegral" style="width:50px; margin-left:6px; margin-right: 6px;" />
                </a-form-model-item>积分，
                <a-form-model-item prop="trainDayNum" style="display: inline-block; margin-top: -10px">
                    每天可获得<a-input v-model="trainForm.trainDayNum" style="width:50px; margin-left:6px; margin-right: 6px;" />次
                </a-form-model-item>
            </a-form-model>
        </a-modal>

    </div>
</template>

<script>
  import {mapActions, mapState} from "vuex";
  const columns = [
    {
      dataIndex: "id",
      title: "ID"
    },
    {
      dataIndex: "ruleName",
      title: "规则"
    },
    {
      dataIndex: "status",
      title: "状态",
      scopedSlots: { customRender: "status" }
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
    data() {
      return {
        columns, // 表头
        // 新增/编辑表单
        labelCol: {span: 4},
        wrapperCol: {span: 14},
        //   新增/编辑标签
        isEdit: false, // 是否是编辑标签
        trainVisible: false, //是否显示新增Modal
        cupVisible: false,
        signUpVisible: false,
        trainForm: {
          trainIntegral: "",
          trainDayNum: ""
        },
        cupForm: {
            cupIntegral: "",
            cupDayNum: ""
        },
        signUpForm:{
          signUpIntegral1: "",
          signUpIntegral2: "",
          signUpIntegral3: "",
          signUpIntegral4: "",
          signUpIntegral5: ""
        },
        loading: false, // 正在提交表单
        // 新增/编辑标签表单
        form: {
          id: ""
        },
        trainRules: {
          trainIntegral: [
            {
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
          trainDayNum: [
            {
              pattern: /^[1-9]\d*$/,
              required: false,
              message: "请输入大于0的整数",
              trigger: ["blur", "change"]
            }
          ]
        },
        cupRules: {
          cupIntegral: [
            {
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
          cupDayNum: [
            {
              pattern: /^[1-9]\d*$/,
              required: false,
              message: "请输入大于0的整数",
              trigger: ["blur", "change"]
            }
          ]
        },
        rules: {
          signUpIntegral1: [
            {
              required: true,
              message: "请输入积分",
              trigger: "blur"
            },
            {
              pattern: /^[1-9]\d*$/,
              required: false,
              message: "请输入大于0的整数",
              trigger: ["blur", "change"]
            }
          ],
          signUpIntegral2: [
            {
              required: true,
              message: "请输入积分",
              trigger: "blur"
            },
            {
              pattern: /^[1-9]\d*$/,
              required: false,
              message: "请输入大于0的整数",
              trigger: ["blur", "change"]
            }
          ],
          signUpIntegral3: [
            {
              required: true,
              message: "请输入积分",
              trigger: "blur"
            },
            {
              pattern: /^[1-9]\d*$/,
              required: false,
              message: "请输入大于0的整数",
              trigger: ["blur", "change"]
            }
          ],
          signUpIntegral4: [
            {
              required: true,
              message: "请输入积分",
              trigger: "blur"
            },
            {
              pattern: /^[1-9]\d*$/,
              required: false,
              message: "请输入大于0的整数",
              trigger: ["blur", "change"]
            }
          ],
          signUpIntegral5: [
            {
              required: true,
              message: "请输入积分",
              trigger: "blur"
            },
            {
              pattern: /^[1-9]\d*$/,
              required: false,
              message: "请输入大于0的整数",
              trigger: ["blur", "change"]
            }
          ]
        }
      };
    },
    computed: {
      ...mapState("userIntegralRule", [
        "userIntegralRules"
      ])
    },
    created() {
      this.getData();
    },
    methods: {
      ...mapActions("userIntegralRule", ["getUserIntegralRules", "changeIntegralRuleStatus", "saveTrainAndCupSave", "saveSignInRule"]),
      // 获取列表数据
      async getData() {
        const response = await this.getUserIntegralRules();
        if (response.code != 200) {
          this.$message.success({
            content: response.msg,
            key: "getUserIntegralRules",
            duration: 2
          });
        }
      },
      async cupRuleSave() {
        const response = await this.saveTrainAndCupSave({ type:2, integral: this.cupForm.cupIntegral, dayNum: this.cupForm.cupDayNum});
        if (response.code == 200) {
          this.$message.success({
            content: "修改成功",
            duration: 2
          });
          this.cupVisible = false;
          this.getData();
        }
      },
      cupSave() {
        this.$refs.cupRuleForm.validate(valid => {
          if (valid) {
            this.cupRuleSave();
          }
        });
      },
      async trainRuleSave() {
        const response = await this.saveTrainAndCupSave({
          type: 3,
          integral: this.trainForm.trainIntegral,
          dayNum: this.trainForm.trainDayNum
        });
        if (response.code == 200) {
          this.$message.success({
            content: "修改成功",
            duration: 2
          });
          this.trainVisible = false;
          this.getData();
        }
      },
      async trainSave() {
        this.$refs.trainRuleForm.validate(valid => {
          if (valid) {
            this.trainRuleSave();
          }
        });
      },
      signUpSave() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.saveSignUpRule();
          }
        });
      },
      async saveSignUpRule() {
        let signUp = [
          {
            "minDay": 1,
            "maxDay": 6,
            "integral": this.signUpForm.signUpIntegral1
          },
          {
            "minDay": 7,
            "maxDay": 12,
            "integral": this.signUpForm.signUpIntegral2
          },
          {
            "minDay": 13,
            "maxDay": 18,
            "integral": this.signUpForm.signUpIntegral3
          },
          {
            "minDay": 19,
            "maxDay": 24,
            "integral": this.signUpForm.signUpIntegral4
          },
          {
            "minDay": 25,
            "integral": this.signUpForm.signUpIntegral5
          },
        ];
        const response = await this.saveSignInRule(signUp);
        if (response.code == 200) {
          this.$message.success({
            content: "修改成功",
            duration: 2
          });
          this.signUpVisible = false;
          this.getData();
        }
      },
      showConfigModal(item) {
        if(item.type == 1) {
          let ruleConfig = JSON.parse(item.ruleConfig);
          this.signUpForm.signUpIntegral1 = ruleConfig[0].integral;
          this.signUpForm.signUpIntegral2 = ruleConfig[1].integral;
          this.signUpForm.signUpIntegral3 = ruleConfig[2].integral;
          this.signUpForm.signUpIntegral4 = ruleConfig[3].integral;
          this.signUpForm.signUpIntegral5 = ruleConfig[4].integral;
          this.signUpVisible = true;
        } else if(item.type == 2) {
          let ruleConfig = JSON.parse(item.ruleConfig);
          this.cupForm.cupIntegral = ruleConfig.integral;
          if (ruleConfig.dayNum > 0) {
            this.cupForm.cupDayNum = ruleConfig.dayNum;
          }
          this.cupVisible = true;
        } else if(item.type == 3) {
          let ruleConfig = JSON.parse(item.ruleConfig);
          this.trainForm.trainIntegral = ruleConfig.integral;
          if (ruleConfig.dayNum > 0) {
            this.trainForm.trainDayNum = ruleConfig.dayNum;
          }
          this.trainVisible = true;
        }
      },
      // 修改状态
      async changeRuleStatus(type, dataIndex, value) {
        const status = value == true ? 0 : 1;
        const response = await this.changeIntegralRuleStatus({
          status,
          type,
          dataIndex
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

      },
    }
  };
</script>
<style>
    .ant-form-explain{
        text-align: right;
    }
</style>
