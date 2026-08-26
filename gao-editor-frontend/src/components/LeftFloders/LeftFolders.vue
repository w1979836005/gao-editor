<template>
  <div id="LeftFolders">
    <FolderItem v-for="item in floderList" :key="item.id" :item="item" :level="0" @toggle="handleToggle" />
  </div>
</template>

<script lang="ts" setup>
import { FolderOutlined, FileOutlined } from '@ant-design/icons-vue'
import { ref, type Component } from 'vue'
import FolderItem from './FolderItem.vue'

export interface FileItem {
  id: string | number
  name: string
  icon: Component
  type: 'folder' | 'file'
  children?: FileItem[]
  isOpen?: boolean
}

const handleToggle = (id: string | number) => {
  const toggleItem = (items: FileItem[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item && item.id === id) {
        // 使用splice触发响应式更新
        items.splice(i, 1, { ...item, isOpen: !item.isOpen })
        return true
      }
      if (item && item.children && toggleItem(item.children)) {
        return true
      }
    }
    return false
  }
  toggleItem(floderList.value)
}

const floderList = ref<FileItem[]>([
  {
    id: 1,
    name: 'src',
    icon: FolderOutlined,
    type: 'folder',
    isOpen: false,
    children: [
      {
        id: 11,
        name: 'components',
        icon: FolderOutlined,
        type: 'folder',
        isOpen: false,
        children: [{ id: 111, name: 'Button.vue', icon: FileOutlined, type: 'file' }],
      },
      { id: 12, name: 'App.vue', icon: FileOutlined, type: 'file' },
    ],
  },
  { id: 2, name: 'package.json', icon: FileOutlined, type: 'file' },
])
</script>

<style scoped>
#LeftFolders {
  width: 100%;
  height: calc(100vh - 80px);
  overflow-y: auto;
}
</style>
