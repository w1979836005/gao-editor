<template>
  <div id="globalHeader">
    <div class="left-section">
      <div v-if="!leftFolderstore.isCollspe">
        <MenuUnfoldOutlined class="icon" @click="leftFolderstore.toggleIsCollspe" />
      </div>
      <div v-else>
        <MenuFoldOutlined class="icon" @click="leftFolderstore.toggleIsCollspe" />
      </div>
      <!-- 文件名 -->
      <span v-if="currentFileName" class="file-name">
        <FileOutlined style="margin-right: 6px; font-size: 14px;" />
        {{ currentFileName }}
      </span>
    </div>
    <div class="right-section">
      <SearchOutlined class="icon" @click="handleSearch" />
      <ShareAltOutlined class="icon" @click="handleShare" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLeftFoldersStore } from '@/stores/leftFoldersStore'
import { MenuUnfoldOutlined, MenuFoldOutlined, SearchOutlined, ShareAltOutlined, FileOutlined } from '@ant-design/icons-vue'

const leftFolderstore = useLeftFoldersStore()
const route = useRoute()

// 当处于文件编辑页时，显示文件名
const currentFileName = computed(() => {
  if (route.name !== 'file-editor') return ''
  const id = Number(route.params.id)
  const item = leftFolderstore.findItemById(id)
  return item?.name ?? ''
})

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
  gap: 8px;
  min-width: 0;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
