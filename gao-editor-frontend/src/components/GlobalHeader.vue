<template>
  <div id="globalHeader">
    <div v-if="!leftFolderstore.isCollspe">
      <MenuUnfoldOutlined class="icon"  @click="leftFolderstore.toggleIsCollspe" />
    </div>
    <div  v-else>
      <MenuFoldOutlined  class="icon" @click="leftFolderstore.toggleIsCollspe" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLeftFoldersStore } from '@/stores/leftFoldersStore';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

const leftFolderstore = useLeftFoldersStore()

</script>

<style scoped>
#globalHeader {
  width: 100%;
  height: 100%;
  padding: 0 8px;
  display: flex;
  align-items: center;
}
</style>
