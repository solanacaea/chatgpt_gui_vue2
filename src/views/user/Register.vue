<template>
  <div class="main user-layout-register">
    <h3><span>{{ $t('user.register.register') }}</span></h3>
    <Form ref="formRegister" :form="form" id="formRegister">
      <FormItem>
        <Input
          size="large"
          type="text"
          :placeholder="$t('user.register.email.placeholder')"
          v-decorator="['email', {rules: [{ required: true, type: 'email', message: $t('user.email.required') }], validateTrigger: ['change', 'blur']}]"
        ></Input>
      </FormItem>

      <Popover
        placement="rightTop"
        :trigger="['focus']"
        :getPopupContainer="(trigger) => trigger.parentElement"
        v-model="state.passwordLevelChecked">
        <template slot="content">
          <div :style="{ width: '240px' }" >
            <div :class="['user-register', passwordLevelClass]">{{ $t(passwordLevelName) }}</div>
            <Progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
            <div style="margin-top: 10px;">
              <span>{{ $t('user.register.password.popover-message') }}
              </span>
            </div>
          </div>
        </template>
        <FormItem>
          <Password
            size="large"
            @click="handlePasswordInputClick"
            :placeholder="$t('user.register.password.placeholder')"
            v-decorator="['password', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          ></Password>
        </FormItem>
      </Popover>

      <FormItem>
        <Password
          size="large"
          :placeholder="$t('user.register.confirm-password.placeholder')"
          v-decorator="['password2', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        ></Password>
      </FormItem>

      <FormItem>
        <Input size="large" :placeholder="$t('user.login.mobile.placeholder')" v-decorator="['mobile', {rules: [{ required: true, message: $t('user.phone-number.required'), pattern: /^1[3456789]\d{9}$/ }, { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }]">
          <Select slot="addonBefore" size="large" defaultValue="+86">
            <Option value="+86">+86</Option>
            <Option value="+87">+87</Option>
          </Select>
        </Input>
      </FormItem>
      <!--<Group size="large" compact>
            <Select style="width: 20%" size="large" defaultValue="+86">
              <Option value="+86">+86</Option>
              <Option value="+87">+87</Option>
            </Select>
            <Input style="width: 80%" size="large" placeholder="11 位手机号"></Input>
          </Group>-->

      <Row :gutter="16">
        <Col class="gutter-row" :span="16">
          <FormItem>
            <Input size="large" type="text" :placeholder="$t('user.login.mobile.verification-code.placeholder')" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
              <Icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </Input>
          </FormItem>
        </Col>
        <Col class="gutter-row" :span="8">
          <Button
            class="getCaptcha"
            size="large"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && $t('user.register.get-verification-code')||(state.time+' s')"></Button>
        </Col>
      </Row>

      <FormItem>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          class="register-button"
          :loading="registerBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="registerBtn">{{ $t('user.register.register') }}
        </Button>
        <router-link class="login" :to="{ name: 'login' }">{{ $t('user.register.sign-in') }}</router-link>
      </FormItem>

    </Form>
  </div>
</template>

<script>
import { getSmsCaptcha } from '@/api/login'
import { deviceMixin } from '@/store/device-mixin'
import { scorePassword } from '@/utils/util'

import Form from 'ant-design-vue/lib/form'
import 'ant-design-vue/lib/form/style/css'
import Input from 'ant-design-vue/lib/input'
import 'ant-design-vue/lib/input/style/css'
import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
import Icon from 'ant-design-vue/lib/icon'
import 'ant-design-vue/lib/icon/style/css'
import Row from 'ant-design-vue/lib/row'
import 'ant-design-vue/lib/row/style/css'
import Col from 'ant-design-vue/lib/col'
import 'ant-design-vue/lib/col/style/css'
import Popover from 'ant-design-vue/lib/popover'
import 'ant-design-vue/lib/popover/style/css'
import Select from 'ant-design-vue/lib/select'
import 'ant-design-vue/lib/select/style/css'
import Progress from 'ant-design-vue/lib/progress'
import 'ant-design-vue/lib/progress/style/css'


const FormItem = Form.Item
const Password = Input.Password
const Group = Input.Group
const Option = Select.Option
const levelNames = {
  0: 'user.password.strength.short',
  1: 'user.password.strength.low',
  2: 'user.password.strength.medium',
  3: 'user.password.strength.strong'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'Register',
  components: {
    Input, Password, Form, FormItem, Button, Row, Col, Icon, Popover, Select, Option, Group, Progress
  },
  mixins: [deviceMixin],
  data () {
    return {
      form: this.$form.createForm(this),

      state: {
        time: 60,
        level: 0,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      registerBtn: false
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    handlePasswordLevel (rule, value, callback) {
      if (!value) {
       return callback()
      }
      console.log('scorePassword ; ', scorePassword(value))
      if (value.length >= 6) {
        if (scorePassword(value) >= 30) {
          this.state.level = 1
        }
        if (scorePassword(value) >= 60) {
        this.state.level = 2
        }
        if (scorePassword(value) >= 80) {
        this.state.level = 3
        }
      } else {
        this.state.level = 0
        callback(new Error(this.$t('user.password.strength.msg')))
      }
      this.state.passwordLevel = this.state.level
      this.state.percent = this.state.level * 33

      callback()
    },

    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      // console.log('value', value)
      if (value === undefined) {
        callback(new Error(this.$t('user.password.required')))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error(this.$t('user.password.twice.msg')))
      }
      callback()
    },

    handlePhoneCheck (rule, value, callback) {
      console.log('handlePhoneCheck, rule:', rule)
      console.log('handlePhoneCheck, value', value)
      console.log('handlePhoneCheck, callback', callback)

      callback()
    },

    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    handleSubmit () {
      const { form: { validateFields }, state, $router } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          state.passwordLevelChecked = false
          $router.push({ name: 'registerResult', params: { ...values } })
        }
      })
    },

    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state, $message, $notification } = this

      validateFields(['mobile'], { force: true },
        (err, values) => {
          if (!err) {
            state.smsSendBtn = true

            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)

            const hide = $message.loading('验证码发送中..', 0)

            getSmsCaptcha({ mobile: values.mobile }).then(res => {
              setTimeout(hide, 2500)
              $notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8
              })
            }).catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
          }
        }
      )
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.registerBtn = false
    }
  },
  watch: {
    'state.passwordLevel' (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less">
  .user-register {

    &.error {
      color: #ff0000;
    }

    &.warning {
      color: #ff7e05;
    }

    &.success {
      color: #52c41a;
    }

  }

  .user-layout-register {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
</style>
<style lang="less" scoped>
  .user-layout-register {

    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .register-button {
      width: 50%;
    }

    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>
