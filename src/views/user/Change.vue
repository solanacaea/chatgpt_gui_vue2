<template>
  <div class="main">
    <h3><span>密码修改</span></h3>
    <!-- <span class="title">密码修改</span> -->
    <Form id="formRegister" ref="formRegister" class="change-layout-login" :form="form">
      <Alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="errorMsg"/>
        <FormItem>
            <Input size="large" type="text" placeholder="用户名" v-model="username" :disabled="usernameDisable">
            <Icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </Input>
        </FormItem>

        <FormItem>
            <Password id="pwd1" size="large" placeholder="请输入新密码" v-model="pwd1">
                <Icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </Password>
        </FormItem>

        <FormItem>
            <Password id="pwd2" size="large" placeholder="请确认新密码" v-model="pwd2">
                <Icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </Password>
        </FormItem>

        <FormItem style="margin-top:24px">
            <Button size="large" type="primary" htmlType="submit" class="login-button" :loading="registerBtn"
                @click.stop.prevent="handleSubmit" :disabled="registerBtn">修改
            </Button>
            <br/>
            <router-link class="login" :to="{ name: 'login' }">返回登录</router-link>
            <br/>
            <router-link class="login" :to="{ name: 'chat' }">返回会话</router-link>

        </FormItem>
    </Form>
  </div>
</template>

<script>
import { change } from '@/api/login'
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
import Select from 'ant-design-vue/lib/select'
import 'ant-design-vue/lib/select/style/css'
import Progress from 'ant-design-vue/lib/progress'
import 'ant-design-vue/lib/progress/style/css'
import Alert from 'ant-design-vue/lib/alert'
import 'ant-design-vue/lib/alert/style/css'
import { ACCESS_TOKEN, ACCESS_TOKEN_USER, ACCESS_TOKEN_TEMP } from '@/store/mutation-types'
import storage from 'store'

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
        Alert, Input, Password, Form, FormItem, Button, Row, Col, Icon, Select, Option, Group, Progress
    },
    mixins: [deviceMixin],
    data() {
        let tokenUser = storage.get(ACCESS_TOKEN_USER)
        if (tokenUser == undefined) {
            tokenUser = this.$route.query.username
        }
        return {
            usernameDisable: true,
            errorMsg: '',
            // username: this.$route.query.username,
            username: tokenUser,
            pwd1: '',
            pwd2: '',
            isLoginError: false,
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
        passwordLevelClass() {
            return levelClass[this.state.passwordLevel]
        },
        passwordLevelName() {
            return levelNames[this.state.passwordLevel]
        },
        passwordLevelColor() {
            return levelColor[this.state.passwordLevel]
        }
    },
    methods: {
        handlePasswordLevel(rule, value, callback) {
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
                callback(new Error('user.password.strength.msg'))
            }
            this.state.passwordLevel = this.state.level
            this.state.percent = this.state.level * 33

            callback()
        },

        handlePasswordCheck(rule, value, callback) {
            const password = this.form.getFieldValue('password')
            // console.log('value', value)
            if (value === undefined) {
                callback(new Error('user.password.required'))
            }
            if (value && password && value.trim() !== password.trim()) {
                callback(new Error('user.password.twice.msg'))
            }
            callback()
        },

        handlePhoneCheck(rule, value, callback) {
            console.log('handlePhoneCheck, rule:', rule)
            console.log('handlePhoneCheck, value', value)
            console.log('handlePhoneCheck, callback', callback)

            callback()
        },

        handlePasswordInputClick() {
            if (!this.isMobile) {
                this.state.passwordLevelChecked = true
                return
            }
            this.state.passwordLevelChecked = false
        },

        handleSubmit() {
            const { form: { validateFields }, state, $router } = this
            validateFields({ force: true }, (err, values) => {
                if (!err) {
                    // console.log('pwd1', this.pwd1)
                    if (this.pwd1.length < 6) {
                        this.errorMsg = '密码长度不能少于6位'
                        this.isLoginError = true
                        return
                    } else if (this.pwd1 != this.pwd2) {
                        this.errorMsg = '两次密码不一致'
                        this.isLoginError = true
                        return
                    } else if (this.pwd1 == '123456') {
                        this.errorMsg = '请修改密码'
                        this.isLoginError = true
                        return
                    }
                    this.isLoginError = false
                    state.passwordLevelChecked = false
                    storage.set(ACCESS_TOKEN, storage.get(ACCESS_TOKEN_TEMP))
                    change({
                        username: this.username, password: this.pwd1
                    }).then((res) => this.changeSuccess(res, this.username))
                        .catch(err => this.requestFailed(err))
                    // $router.push({ name: 'registerResult', params: { ...values } })
                }
            })
        },
        changeSuccess(res, username) {
            // console.log('res', res)
            this.$notification.success({
                message: '成功',
                description: '修改成功，即将进入聊天页面...'
            })
            storage.set(ACCESS_TOKEN, `${res.tokenType} ${res.accessToken}`, new Date().getTime() + 24 * 60 * 60 * 1000)
            storage.set(ACCESS_TOKEN_USER, username)
            this.$router.push({ path: '/chat' })
            this.registerBtn = false
        },
        requestFailed (err) {
            // this.$notification['error']({
            //     message: '错误',
            //     description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
            //     duration: 4
            // })

            this.registerBtn = false
            this.errorMsg = '请求出现错误，请稍后再试'
            this.isLoginError = true
        }
    },
    watch: {
        'state.passwordLevel'(val) {
            console.log(val)
        }
    }
}
</script>

<style lang="less" scoped>
.main-change {
    top: 20px;
    left: 20px;
}

.change-layout-login {
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

    .change-login-other {
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
