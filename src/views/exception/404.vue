<template>
  <Result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
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
  name: 'Exception404',
  components: { Button, Result },
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
