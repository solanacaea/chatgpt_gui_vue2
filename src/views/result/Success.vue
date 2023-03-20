<template>
  <Card :bordered="false">
    <Result status="success" :title="result.title" :sub-title="result.description">
      <template #extra>
        <Button type="primary">{{ $t('result.success.btn-return') }}</Button>
        <Button style="margin-left: 8px">{{ $t('result.success.btn-project') }}</Button>
        <Button style="margin-left: 8px">{{ $t('result.success.btn-print') }}</Button>
      </template>
      <div class="content">
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 20px;">{{ $t('result.success.operate-title') }}</div>
        <Row style="margin-bottom: 16px">
          <Col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
            <span style="color: rgba(0, 0, 0, 0.85)">{{ $t('result.success.operate-id') }}：</span>
            20180724089
          </Col>
          <Col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
            <span style="color: rgba(0, 0, 0, 0.85)">{{ $t('result.success.principal') }}：</span>
            曲丽丽是谁？
          </Col>
          <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <span style="color: rgba(0, 0, 0, 0.85)">{{ $t('result.success.operate-time') }}：</span>
            2016-12-12 ~ 2017-12-12
          </Col>
        </Row>
        <Steps :current="1" :direction="isMobile && directionType.vertical || directionType.horizontal" progressDot>
          <Step :title="$t('result.success.step1-title')">
            <span style="font-size: 14px" slot="title">{{ $t('result.success.step1-title') }}</span>
            <template slot="description">
              <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;text-align: left;" slot="description" >
                <div style="margin: 8px 0 4px">
                  曲丽丽
                  <Icon style="margin-left: 8px" type="dingding-o" />
                </div>
                <div>2016-12-12 12:32</div>
              </div>
            </template>
          </Step>
          <Step :title="$t('result.success.step2-title')">
            <span style="font-size: 14px" slot="title">{{ $t('result.success.step2-title') }}</span>
            <template slot="description">
              <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;text-align: left;" slot="description" >
                <div style="margin: 8px 0 4px">
                  周毛毛
                  <Icon style="margin-left: 8px; color: #00A0E9" type="dingding-o" />
                </div>
                <div><a href="">催一下</a></div>
              </div>
            </template>
          </Step>
          <Step :title="$t('result.success.step3-title')">
            <span style="font-size: 14px" slot="title">{{ $t('result.success.step3-title') }}</span>
          </Step>
          <Step :title="$t('result.success.step4-title')" >
            <span style="font-size: 14px" slot="title">{{ $t('result.success.step4-title') }}</span>
          </Step>
        </Steps>
      </div>
    </Result>
  </Card>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
import Result from 'ant-design-vue/lib/result'
import 'ant-design-vue/lib/result/style/css'
import Card from 'ant-design-vue/lib/card'
import 'ant-design-vue/lib/card/style/css'
import Steps from 'ant-design-vue/lib/steps'
import 'ant-design-vue/lib/steps/style/css'
import Row from 'ant-design-vue/lib/row'
import 'ant-design-vue/lib/row/style/css'
import Col from 'ant-design-vue/lib/col'
import 'ant-design-vue/lib/col/style/css'
import Icon from 'ant-design-vue/lib/icon'
import 'ant-design-vue/lib/icon/style/css'

const Step = Steps.Step;


const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export default {
  name: 'Success',
  mixins: [baseMixin],
  components: { Button, Result, Card, Steps, Row, Col, Icon, Step },
  data () {
    this.directionType = directionType
    return {
      // title: this.$t('result.success.title'),
      // description: this.$t('result.success.description')
    }
  },
  computed: {
    result () {
      return {
      title: this.$t('result.success.title'),
      description: this.$t('result.success.description')
      }
    }
  }
}
</script>
