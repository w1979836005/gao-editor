<template>
  <div id="LeftFolders">
    <FolderItem 
    v-for="item in folderListStroe.floderList" 
    :key="item.id" :item="item" 
    :level="0" 
    @toggle="folderListStroe.handleToggle" 
    :active-folder-id="folderListStroe.activeFloderId"
    @finish-edit="handleFinishEdit"/>
  </div>
</template>

<script lang="ts" setup>
import FolderItem from './FolderItem.vue'
import { useLeftFoldersStore } from '@/stores/leftFoldersStore.ts'

export interface FileItem {
  id: string | number
  name: string
  type: 'folder' | 'file'
  children?: FileItem[]
  isOpen?: boolean
  isEditing?: boolean
}


const folderListStroe = useLeftFoldersStore()

const handleFinishEdit = (id: number, name: string, callback: (result: { success: boolean; message?: string }) => void) => {
  const result = folderListStroe.finishAddFileItem(id, name)
  callback(result)
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
