<template>
  <Result status="403" title="403" sub-title="Sorry, you don't have access to this page.">
    <template #extra>
      <Button type="primary" @click="toHome">
        Back Home
      </Button>
    </template>
  </Result>
</template>

<script>
import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
import Result from 'ant-design-vue/lib/result'
import 'ant-design-vue/lib/result/style/css'
export default {
  name: 'Exception403',
  components: { Button, Result },
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
