<template>
  <Card :bordered="false">
    <Result status="error" :title="result.title" :sub-title="result.description">
      <template #extra>
        <Button type="primary" >{{ $t('result.fail.error.btn-text') }}</Button>
      </template>
      <div class="desc">
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 16px">
          {{ $t('result.fail.error.hint-title') }}
        </div>
        <div style="margin-bottom: 16px">
          <Icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          {{ $t('result.fail.error.hint-text1') }}
          <a style="margin-left: 16px">{{ $t('result.fail.error.hint-btn1') }} <Icon type="right" /></a>
        </div>
        <div>
          <Icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          {{ $t('result.fail.error.hint-text2') }}
          <a style="margin-left: 16px">{{ $t('result.fail.error.hint-btn2') }} <Icon type="right" /></a>
        </div>
      </div>
    </Result>
  </Card>
</template>

<script>
import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
import Card from 'ant-design-vue/lib/card'
import 'ant-design-vue/lib/card/style/css'
import Result from 'ant-design-vue/lib/result'
import 'ant-design-vue/lib/result/style/css'
import Icon from 'ant-design-vue/lib/icon'
import 'ant-design-vue/lib/icon/style/css'

export default {
  name: 'Error',
  components: { Result, Card, Button, Icon },
  computed: {
    result () {
      return {
      title: this.$t('result.fail.error.title'),
      description: this.$t('result.fail.error.description')
      }
    }
  }
}
</script>
