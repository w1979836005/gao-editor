<template>
  <div id="LeftFolders">
   <template v-if="folderListStroe.floderList && folderListStroe.floderList.length > 0">
     <FolderItem
    v-for="item in folderListStroe.floderList"
    :key="item.id" :item="item"
    :level="0"
    @toggle="folderListStroe.handleToggle"
    :active-folder-id="folderListStroe.activeFloderId"
    @finish-edit="handleFinishEdit"
    @cancel-edit="folderListStroe.cancelEditFileItem"
    @move-item="handleMoveItem"/>
   </template>

   <template v-else>
    <div class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
      </svg>
      <h3 class="empty-title">暂无文件夹</h3>
      <p class="empty-desc">点击上方按钮或拖拽文件到此处开始</p>
    </div>
   </template>
  </div>
</template>

<script lang="ts" setup>
import FolderItem from './FolderItem.vue'
import { useLeftFoldersStore } from '@/stores/leftFoldersStore.ts'
import { message } from 'ant-design-vue'

export interface FileItem {
  id: string | number
  name: string
  type: 'folder' | 'file'
  children?: FileItem[]
  isOpen?: boolean
  isEditing?: boolean
  editMode?: 'add' | 'rename'
}


const folderListStroe = useLeftFoldersStore()

const handleFinishEdit = (id: number, name: string, callback: (result: { success: boolean; message?: string }) => void) => {
  const result = folderListStroe.finishEditFileItem(id, name)
  callback(result)
}

const handleMoveItem = (sourceId: number, targetId: number) => {
  const result = folderListStroe.moveItem(sourceId, targetId)
  if (!result.success && result.message) {
    message.error(result.message)
  } else {
    message.success('移动成功')
  }
}

</script>

<style scoped>
#LeftFolders {
  width: 100%;
  height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 8px;
}
</style>
