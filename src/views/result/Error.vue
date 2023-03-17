<template>
  <a-card :bordered="false">
    <a-result status="error" :title="result.title" :sub-title="result.description">
      <template #extra>
        <a-button type="primary" >{{ $t('result.fail.error.btn-text') }}</a-button>
      </template>
      <div class="desc">
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 16px">
          {{ $t('result.fail.error.hint-title') }}
        </div>
        <div style="margin-bottom: 16px">
          <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          {{ $t('result.fail.error.hint-text1') }}
          <a style="margin-left: 16px">{{ $t('result.fail.error.hint-btn1') }} <a-icon type="right" /></a>
        </div>
        <div>
          <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          {{ $t('result.fail.error.hint-text2') }}
          <a style="margin-left: 16px">{{ $t('result.fail.error.hint-btn2') }} <a-icon type="right" /></a>
        </div>
      </div>
    </a-result>
  </a-card>
</template>

<script>
import Icon from 'ant-design-vue/lib/icon'
import Button from 'ant-design-vue/lib/button'
import Card from 'ant-design-vue/lib/card'
import Result from 'ant-design-vue/lib/result'

export default {
  name: 'Error',
  components: {Icon, Button, Card, Result},
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
