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

      <!-- 名称或输入框 -->
      <template v-if="item.isEditing">
        <input 
          class="editInput"
          v-model="editName"
          @blur="handleBlur"
          @keyup.enter="handleEnter"
          @keyup.escape="handleCancel"
          ref="editInputRef"
          placeholder="输入名称"
        />
      </template>
      <template v-else>
        <span class="floderName">{{ item.name }}</span>
      </template>
    </div>

    <!-- 递归子项 -->
    <div v-if="item.type === 'folder' && item.isOpen && item.children">
      <FolderItem v-for="child in item.children"
       :key="child.id" :item="child" 
       :level="level + 1" 
       :active-folder-id="activeFolderId"
       @toggle="emit('toggle',$event)"
       @finish-edit="(id: number, name: string) => emit('finish-edit', id, name)"
        />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue'
import { RightOutlined ,FolderOutlined,FileOutlined } from '@ant-design/icons-vue'
import type { FileItem } from './LeftFolders.vue'

const props = defineProps<{
  item: FileItem
  level: number
  activeFolderId: null | number
}>()

const emit = defineEmits(['toggle', 'finish-edit'])

const editName = ref('')
const editInputRef = ref<HTMLInputElement | null>(null)

// 当进入编辑状态时，聚焦输入框
watch(() => props.item.isEditing, (newVal) => {
  if (newVal) {
    editName.value = ''
    nextTick(() => {
      editInputRef.value?.focus()
    })
  }
}, { immediate: true })

const handleClick = () => {
  if (!props.item.isEditing) {
    emit('toggle', props.item.id)
  }
}

const handleEnter = () => {
  // Enter键：确认输入
  emit('finish-edit', props.item.id as number, editName.value.trim() || '')
}

const handleBlur = () => {
  // 失去焦点：确认输入（无论是否有值）
  emit('finish-edit', props.item.id as number, editName.value.trim() || '')
}

const handleCancel = () => {
  // 取消编辑，移除临时项
  emit('finish-edit', props.item.id as number, '')
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

.editInput {
  flex: 1;
  height: 20px;
  font-size: 12px;
  line-height: 1.2;
  transform: translateY(-1px);
  padding: 0 4px;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  background-color: var(--color-bg-text-hover);
  outline: none;
}
</style>
