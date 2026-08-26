<template>
  <div id="folderItem">
    <!-- 当前行-->
    <div 
    :class="['folderNode',{ 'active': activeFolderId === item.id }]" 
    :style="{ paddingLeft: `${level * 16 + 12}px` }" @click="handleClick">
      <!-- 是否有箭头-->
      <span v-if="item.type === 'folder'" class="arrowContainer">
        <RightOutlined :class="['arrowIcon', 'icon', { isOpen: item.isOpen }]" />
      </span>
      <span v-else class="arrowPlaceholder"></span>

      <!-- 图标 -->
      <template v-if="item.type === 'folder'">
        <FolderOutlined class="icon" />
      </template>
      
      <template v-else>
        <FileOutlined class="icon" />
      </template>

      <!-- 名称 -->
      <span class="floderName">{{ item.name }}</span>
    </div>

    <!-- 递归子项 -->
    <div v-if="item.type === 'folder' && item.isOpen && item.children">
      <FolderItem v-for="child in item.children"
       :key="child.id" :item="child" 
       :level="level + 1" 
       :active-folder-id="activeFolderId"
       @toggle="emit('toggle',$event)"
        />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RightOutlined ,FolderOutlined,FileOutlined } from '@ant-design/icons-vue'
import type { FileItem } from './LeftFolders.vue'

const props = defineProps<{
  item: FileItem
  level: number
  activeFolderId: null | number
}>()

const emit = defineEmits(['toggle'])

const handleClick = () => {
  // if (props.item.type === 'folder') {
  //   //交给父组件更新
  //   emit('toggle', props.item.id)
  // } else {
  //   console.log('点击了文件')
  // }
      emit('toggle', props.item.id)

}
</script>

<style scoped>
.folderNode {
  width: 100%;
  height: 28px;
  border-bottom: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 16px;
}

.folderNode.active {
  background-color: var(--color-bg-text-hover);
  border: 1px solid var(--color-primary);
}

.folderNode:hover {
  background-color: var(--color-bg-text-hover);
}

.arrowContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  margin-right: 6px;
}

.arrowIcon {
  font-size: 12px;
  color: var(--color-icon);
}

.arrowIcon.isOpen {
  transform: rotate(90deg);
}

.arrowPlaceholder {
  width: 16px;
  margin-right: 6px;
  display: inline-block;
}

.floderName {
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  line-height: 1.2;
  transform: translateY(-1px);
}
</style>