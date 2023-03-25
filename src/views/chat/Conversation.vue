<script>
import request from '@/utils/request'

import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
import Card from 'ant-design-vue/lib/card'
import 'ant-design-vue/lib/card/style/css'
import Input from 'ant-design-vue/lib/input'
import 'ant-design-vue/lib/input/style/css'

const TextArea = Input.TextArea

const questions = []
const sendBtnDisable = false
export default {
    components: { Button, Card, TextArea },
    data () {
        return {
            questions: [{question: '', reply: "Hi~我是小安，很高兴为您服务，有问题尽管问我吧～", isLoading: false},
            // {question: '我的问题是111', isLoading: false}
            ],  //[ {question:,msgId:,reply:,isLoading:}]
            question: '',
            sendBtnDisable: false,
            conversationId: this.fCreaetGuid(),
            maxContextLength: 300
        }
    },
    methods: {
        ask(parameter) {
          // console.log("send param: " + JSON.stringify(parameter))
            return request({
                url: '/ask',
                method: 'post',
                data: parameter
            })
        },
        sendQuestion () {
            if (this.question.trim() == '') {
              this.question = ''
              return
            }

            this.sendBtnDisable = true;
            var msgId = this.fCreaetGuid();
            // var conversationId = this.fCreaetGuid();
            this.questions.push({
                    question: this.question,
                    msgId:msgId,
                    isLoading:true,
                    reply: '请求中，请稍后...'
                })
            this.question4server = this.question
            this.question = ''
            // div.scrollTop = div.scrollHeight
            
            if (this.questions.length > 5) {
              this.startPos = this.questions.length - 5
              this.last5 = this.questions.slice(this.startPos)
            } else {
              this.last5 = this.questions
            }
            
            this.q_context = []
            this.last5.forEach((item, index)=>{
              if (item.question != '' & item.reply != '请求中，请稍后...') {
                if (item.question.length > this.maxContextLength) {
                  this.lastReq = item.question.slice(0, this.maxContextLength)
                } else {
                  this.lastReq = item.question
                }
                if (item.reply.length > this.maxContextLength) {
                  this.lastResp = item.reply.slice(0, this.maxContextLength)
                } else {
                  this.lastResp = item.reply
                }

                this.q_context.push({
                  role: "user",
                  content: this.lastReq
                }, {
                  role: "assistant",
                  content: this.lastResp
                })
              }
            })

            this.askParam = { 
              question: this.question4server, 
              msgId: msgId, 
              conversationId: this.conversationId,
              questionType: 'chatWithContext',
              context: this.q_context
            }
            console.log(this.askParam)
            setTimeout(()=>{
              this.fScrollBottom();
            },0)
            this.ask(this.askParam).then((result) => { 
                // const last = this.questions[this.questions.length - 1]
                // last.reply = result.message
                this.questions.forEach((item)=>{
                  if(item.msgId==result.msgId){
                      const answer1 = result.message.replace('\n\n', '');
                      //const answer2 = answer1.replace(/\n\n/g, '<br/>');
                      item.reply = answer1.replace(/\n/g, '<br/>');
                      item.isLoading = false;
                      setTimeout(()=>{
                        this.fScrollBottom();
                      },0)
                      
                      return;
                  }
                })
                this.sendBtnDisable = false
            }).catch(error => {
              this.questions.forEach((item)=>{
                  if(item.msgId==this.askParam.msgId){
                    item.reply = "暂时无法回答，请稍后再试。";
                    item.isLoading = false;
                  }
              })
              this.sendBtnDisable = false
            })
        },
        fScrollBottom:function(){
          // console.log("scrollHeight",document.getElementById("dialog-zone").scrollHeight);
          document.getElementById("dialog-zone").scrollTo(0,document.getElementById("dialog-zone").scrollHeight);
        },
         //表示全局唯一标识符 (GUID)。
         fCreaetGuid: function () {
            var arr = "";
            var i = 32;
            while (i--) {
                arr += Math.floor(Math.random() * 16.0).toString(30);
            }
            arr = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
            arr = arr.replace(/,/g, "");
            return arr;
        },
        getQuestion(q) {
          this.question = q;
        },
    }
}
</script>

<template>
  <div style="height: 100%; width: 100%; padding: 10px; overflow-y: auto;">
    <div id="dialog-contaniner" style="display:flex; flex-direction: column; height: 100%;">
      <div id="dialog-zone" style="flex-grow: 1; overflow-y: auto;">
        <div :key="index" v-for="(q, index) in questions">
          <!-- Question -->
          <Card v-if="q.question" class="shadow">
            <div>
              <div style="display: flex;">
                <span class="ant-avatar">
                  <img src="~@/assets/anonym1.png">
                </span>
                <div class="mx-3 my-auto">我</div>
              </div>
              <div @click="getQuestion(q.question)" class="my-3 message">{{ q.question }}</div>
            </div>
          </Card>

          <!-- Reply -->
          <Card class="shadow my-3 answer-zone">
            <div>
              <div style="display: flex;">
                <span class="ant-avatar">
                  <img src="~@/assets/xa-chat.jpeg">
                </span>
                <div class="mx-3 my-auto">小安</div>
              </div>
              <div v-if="q.isLoading"><img class="loading-img" src="https://m.stg.pingan.com/static/ai/robot/webapp-static/images/loading.gif" alt=""></div>
              <div v-else class="my-3 message"  v-html= "q.reply"> </div>
              <!-- <div v-else class="my-3 message" >{{q.reply}}</div> -->

            </div>
          </Card>

        </div>

      </div>
      <div style="display: flex">
        <TextArea placeholder="提问内容" :rows="2" v-model="question"></TextArea>
        <Button class="my-btn" v-bind:disabled="sendBtnDisable" type="primary" @click="sendQuestion">
          发送
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.my-btn {
    margin-top: 10px;
    margin-left: 8px;
}
.answer-zone{
  background:#ededed
}
.loading-img{
  width:50px;
  margin-left:44px
}
.my-3 {
    margin-top: 12px;
    margin-bottom: 12px;
}

.my-auto {
    margin-top: auto;
    margin-bottom: auto;
}

.mx-3 {
    margin-left: 12px;
    margin-right: 12px;
}

.shadow {
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}

.message {
    margin-left: 44px;
}

.ant-avatar {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: #000000d9;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: tnum;
    position: relative;
    display: inline-block;
    overflow: hidden;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    vertical-align: middle;
    background: #ccc;
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 20%;
}

</style>
