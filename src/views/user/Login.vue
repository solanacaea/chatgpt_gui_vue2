<template>
  <div class="main">
    <Form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <Alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="alertMsg" />
      <FormItem>
        <Input
          size="large"
          type="text"
          placeholder="用户名"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '请输入帐户名或邮箱地址' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
          ]"
        >
          <Icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </Input>
      </FormItem>
      <FormItem>
        <Password
          size="large"
          placeholder="密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码！' }], validateTrigger: 'blur'}
          ]"
        >
          <Icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </Password>
      </FormItem>
      <FormItem style="margin-top:24px">
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >登录</Button>
        <!-- <router-link class="login-button" :to="{ name: 'change' }">修改密码</router-link> -->
      </FormItem>
      <!-- <FormItem style="margin-top:24px">
        <router-link class="login-button" :to="{ name: 'change' }">修改密码</router-link>
      </FormItem> -->
    </Form>
    <div style="display: flex; color: red;">
      <div>
        &emsp; Moss账号已停用，请尝试使用专属账号登录 <br/>
        &emsp;&emsp; - 账号：姓名拼音或者UM拼音部分，不区分大小写<br/>
        &emsp;&emsp; - 初始密码：123456 <br/>
        &emsp; 首次登录会强制修改密码，修改后可正常使用。 <br/>
        &emsp; 若未开通，请联系管理员申请专属账号。
      </div>
    </div>
    <!-- <Textarea placeholder="临时窗口，调试展示获取企微传递参数query" :rows="1" v-model="question1"></Textarea> -->
    <!-- <Textarea placeholder="临时窗口，调试展示获取企微传递参数params" :rows="1" v-model="question2"></Textarea> -->

  </div>
</template>

<script>
// import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
// import { getSmsCaptcha, get2step } from '@/api/login'
import router from '../../router'

import Form from 'ant-design-vue/lib/form'
import 'ant-design-vue/lib/form/style/css'
import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
import Icon from 'ant-design-vue/lib/icon'
import 'ant-design-vue/lib/icon/style/css'
import Alert from 'ant-design-vue/lib/alert'
import 'ant-design-vue/lib/alert/style/css'
import Input from 'ant-design-vue/lib/input'
import 'ant-design-vue/lib/input/style/css'
import { ACCESS_TOKEN, ACCESS_TOKEN_USER, ACCESS_TOKEN_TEMP } from '@/store/mutation-types'
import storage from 'store'

const FormItem = Form.Item
const Password = Input.Password
const Textarea = Input.Textarea
export default {
  components: {
    // TwoStepCaptcha
    Form, FormItem, Button, Icon, Password, Input, Alert, Textarea
  },
  data () {
    return {
      // question1: this.$route.query.query1,
      // question2: this.$route.params.param1,
      alertMsg: "账户或密码错误", 
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created () {
    // get2step({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          // console.log('login form', values)
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = values.password
          Login(loginParams)
            .then((res) => this.loginSuccess(res, loginParams))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile }).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
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
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res, params) {
      storage.set(ACCESS_TOKEN_USER, params.username)
      storage.set(ACCESS_TOKEN_TEMP, `${res.tokenType} ${res.accessToken}`, new Date().getTime() + 24 * 60 * 60 * 1000)
      if (res.message === 'expired') {
        // param: { username: params.username }
        storage.set(ACCESS_TOKEN_TEMP, `${res.tokenType} ${res.accessToken}`, new Date().getTime() + 24 * 60 * 60 * 1000)
        this.$router.push({ path: '/change' })
        return
      } else if (res.message == 'moss_expired') {
        this.alertMsg = 'Moss账号已停用'
        this.isLoginError = true
        return
      }
      this.$router.push({ path: '/chat' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      // this.$notification.error({
      //   message: '错误',
      //   description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
      //   duration: 4
      // })
    }
  }
}

</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
