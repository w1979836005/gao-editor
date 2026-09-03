<template>
  <div id="globalHeader">
    <div class="left-section">
      <div v-if="!leftFolderstore.isCollspe">
        <MenuUnfoldOutlined class="icon" @click="leftFolderstore.toggleIsCollspe" />
      </div>
      <div v-else>
        <MenuFoldOutlined class="icon" @click="leftFolderstore.toggleIsCollspe" />
      </div>
    </div>
    <div class="right-section">
      <SearchOutlined class="icon" @click="handleSearch" />
      <ShareAltOutlined class="icon" @click="handleShare" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLeftFoldersStore } from '@/stores/leftFoldersStore';
import { MenuUnfoldOutlined, MenuFoldOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons-vue'

const leftFolderstore = useLeftFoldersStore()

const handleSearch = () => {
  // TODO: 实现搜索功能
  console.log('搜索')
}

const handleShare = () => {
  // TODO: 实现分享功能
  console.log('分享')
}
</script>

<style scoped>
#globalHeader {
  width: 100%;
  height: 100%;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-section {
  display: flex;
  align-items: center;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
