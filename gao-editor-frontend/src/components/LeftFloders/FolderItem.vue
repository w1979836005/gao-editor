<template>
  <div id="folderItem">
    <!-- 当前行-->
    <div
    :class="[
      'folderNode',
      { 'active': activeFolderId === item.id },
      { 'drag-over': isDragOver },
      { 'dragging': isDragging }
    ]"
    :style="{ paddingLeft: `${level * 16 + 12}px` }"
    :draggable="!item.isEditing"
    @click="handleClick"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop="handleDrop">
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
          :class="['editInput', { 'editInputError': hasError }]"
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
       @finish-edit="(id: number, name: string, callback: (result: { success: boolean; message?: string }) => void) => emit('finish-edit', id, name, callback)"
       @move-item="(sourceId: number, targetId: number) => emit('move-item', sourceId, targetId)"
        />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RightOutlined ,FolderOutlined,FileOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FileItem } from './LeftFolders.vue'

const router = useRouter()

const props = defineProps<{
  item: FileItem
  level: number
  activeFolderId: null | number
}>()

const emit = defineEmits<{
  toggle: [id: string | number]
  'finish-edit': [id: number, name: string, callback: (result: { success: boolean; message?: string }) => void]
  'move-item': [sourceId: number, targetId: number]
}>()

const editName = ref('')
const editInputRef = ref<HTMLInputElement | null>(null)
const hasError = ref(false)
const isDragOver = ref(false)
const isDragging = ref(false)
let dragOverTimer: ReturnType<typeof setTimeout> | null = null

// 当进入编辑状态时，聚焦输入框
watch(() => props.item.isEditing, (newVal) => {
  if (newVal) {
    editName.value = ''
    hasError.value = false
    nextTick(() => {
      editInputRef.value?.focus()
    })
  }
}, { immediate: true })

const handleClick = () => {
  if (!props.item.isEditing) {
    emit('toggle', props.item.id)
    // 点击文件时跳转到编辑页
    if (props.item.type === 'file') {
      router.push({ name: 'file-editor', params: { id: props.item.id } })
    }
  }
}

const handleFinishEdit = () => {
  const name = editName.value.trim() || ''
  emit('finish-edit', props.item.id as number, name, (result) => {
    if (!result.success && result.message) {
      // 重名，使用 ant-design-vue 的 message 显示错误
      hasError.value = true
      message.error(result.message)
      nextTick(() => {
        editInputRef.value?.focus()
        editInputRef.value?.select()
      })
    } else {
      hasError.value = false
    }
  })
}

const handleEnter = () => {
  // Enter键：确认输入
  handleFinishEdit()
}

const handleBlur = () => {
  // 失去焦点：确认输入（无论是否有值）
  handleFinishEdit()
}

const handleCancel = () => {
  // 取消编辑，移除临时项
  emit('finish-edit', props.item.id as number, '', () => {})
}

// ============ 拖拽处理 ============

const handleDragStart = (e: DragEvent) => {
  if (props.item.isEditing) {
    e.preventDefault()
    return
  }

  isDragging.value = true

  // 设置拖拽数据
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('text/plain', String(props.item.id))

  // 设置拖拽预览图（可选）
  const target = e.target as HTMLElement
  if (target) {
    target.style.opacity = '0.5'
  }
}

const handleDragEnd = (e: DragEvent) => {
  isDragging.value = false

  // 恢复透明度
  const target = e.target as HTMLElement
  if (target) {
    target.style.opacity = '1'
  }
}

const handleDragOver = (e: DragEvent) => {
  // 只有文件夹才能接收
  if (props.item.type !== 'folder') {
    return
  }

  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
}

const handleDragEnter = (e: DragEvent) => {
  // 只有文件夹才能接收
  if (props.item.type !== 'folder') {
    return
  }

  e.preventDefault()

  // 清除之前的定时器
  if (dragOverTimer) {
    clearTimeout(dragOverTimer)
    dragOverTimer = null
  }

  isDragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  console.log(e)
  // 只有文件夹才能接收
  if (props.item.type !== 'folder') {
    return
  }

  // 使用延时处理，避免子元素触发时闪烁
  dragOverTimer = setTimeout(() => {
    isDragOver.value = false
  }, 50)
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()

  isDragOver.value = false

  // 只有文件夹才能接收
  if (props.item.type !== 'folder') {
    return
  }

  // 获取拖拽的源ID
  const sourceId = Number(e.dataTransfer!.getData('text/plain'))
  if (!sourceId || sourceId === props.item.id) {
    return
  }

  // 触发移动事件
  emit('move-item', sourceId, props.item.id as number)
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

.editInputError {
  border-color: var(--color-error, #ff4d4f);
}

/* 拖拽样式 */
.folderNode.dragging {
  opacity: 0.5;
}

.folderNode.drag-over {
  background-color: var(--color-primary-bg, #e6f7ff) !important;
  border: 2px dashed var(--color-primary) !important;
  border-radius: 4px;
}

.folderNode[draggable="true"] {
  cursor: grab;
}

.folderNode[draggable="true"]:active {
  cursor: grabbing;
}
</style>
