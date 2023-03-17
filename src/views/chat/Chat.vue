<script>
const conversations = []
export default {
    data () {
        return {
            conversations: conversations
        }
    }
}

</script>

<template>
  <div style="width: 100%; height: 100%; display: flex" class="drawer">
    <a-menu style="width: 256px; height: 100%;" theme="dark" mode="inline">
      <a-menu-item key="新建会话">
        <template #icon>
          <PlusOutlined />
        </template>
        <span>New Chat</span>
      </a-menu-item>
      <a-menu-item :key="index" v-for="(conversation, index) in conversations">
        <template #icon>
          <MessageOutlined />
        </template>
        <router-link :to="conversation"> {{ conversation }} </router-link>
      </a-menu-item>
    </a-menu>
    <!-- <h3>没有看到你预期的内容？别担心，你的对话数据已经保存！请稍后再查看。</h3> -->
    <div style="flex-grow: 1">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
</style>
