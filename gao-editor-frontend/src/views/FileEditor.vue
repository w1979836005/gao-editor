<template>
  <div id="fileEditor">
    <div class="editor-content" @dblclick="handleDblClick">
      <!-- 渲染态 / 编辑态 -->
      <template v-for="(group, gIndex) in groups" :key="gIndex">
        <!-- 编辑态：整个 group 一个 textarea -->
        <textarea
          v-if="group.editing"
          class="block-textarea"
          :value="group.mergedRaw"
          @input="(e: Event) => handleGroupInput(e, gIndex)"
          @blur="finishEditGroup(gIndex)"
          @keydown="(e: KeyboardEvent) => handleKeydown(e, gIndex)"
          :data-group-index="gIndex"
          spellcheck="false"
        ></textarea>

        <!-- 渲染态 -->
        <div
          v-else
          class="block-preview"
          v-html="renderGroupHtml(group.mergedRaw)"
        ></div>
      </template>

      <!-- 底部点击区 -->
      <div class="bottom-area" @click="handleBottomClick"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { useLeftFoldersStore } from '@/stores/leftFoldersStore'

// ========== 类型 ==========

interface Block {
  raw: string
  inCodeFence: boolean
}

interface Group {
  mergedRaw: string
  editing: boolean
  blockStartIndex: number
  blockCount: number
}

// ========== 状态 ==========

const route = useRoute()
const store = useLeftFoldersStore()
const fileId = computed(() => Number(route.params.id))

const blocks = reactive<Block[]>([])
const groups = reactive<Group[]>([])

// ========== 拆分 ==========

/** 拆分原始内容为 blocks */
const splitIntoBlocks = (content: string): Block[] => {
  if (!content) return []
  const lines = content.split('\n')
  const result: Block[] = []
  let current: string[] = []
  let inCodeFence = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isFence = line.trimStart().startsWith('```')

    if (isFence && !inCodeFence) {
      if (current.length > 0) {
        result.push({ raw: current.join('\n'), inCodeFence: false })
        current = []
      }
      inCodeFence = true
      current.push(line)
    } else if (isFence && inCodeFence) {
      current.push(line)
      result.push({ raw: current.join('\n'), inCodeFence: false })
      current = []
      inCodeFence = false
    } else if (inCodeFence) {
      current.push(line)
    } else if (line === '') {
      const nextLine = lines[i + 1]
      if (nextLine && nextLine.trimStart().startsWith('```')) {
        current.push(line)
      } else {
        if (current.length > 0) {
          result.push({ raw: current.join('\n'), inCodeFence: false })
          current = []
        }
        result.push({ raw: '', inCodeFence: false })
      }
    } else {
      current.push(line)
    }
  }
  if (current.length > 0) {
    result.push({ raw: current.join('\n'), inCodeFence: false })
  }
  return result
}

/** 判断文本是否有 ``` 开头（未闭合的代码块） */
const hasUnmatchedFence = (raw: string): boolean => {
  let inFence = false
  for (const line of raw.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence
    }
  }
  return inFence
}

/** 将 blocks 按代码块分组为 groups */
const buildGroups = () => {
  groups.length = 0
  let blockOffset = 0

  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]

    if (hasUnmatchedFence(block.raw)) {
      // 开始收集整个代码块（直到遇到有闭合 ``` 的 block）
      const collected = [block.raw]
      let j = i + 1
      while (j < blocks.length) {
        collected.push(blocks[j].raw)
        if (hasUnmatchedFence(collected.join('\n')) === false) {
          break
        }
        j++
      }
      groups.push({
        mergedRaw: collected.join('\n'),
        editing: false,
        blockStartIndex: blockOffset,
        blockCount: j - i + 1,
      })
      blockOffset += j - i + 1
      i = j + 1
    } else {
      groups.push({
        mergedRaw: block.raw,
        editing: false,
        blockStartIndex: blockOffset,
        blockCount: 1,
      })
      blockOffset++
      i++
    }
  }
}

// ========== 加载/同步 ==========

const loadContent = (content: string) => {
  blocks.length = 0
  blocks.push(...splitIntoBlocks(content))
  if (blocks.length === 0) {
    blocks.push({ raw: '', inCodeFence: false })
  }
  buildGroups()
}

const syncContent = () => {
  const content = blocks.map((b) => b.raw).join('\n')
  store.setFileContent(fileId.value, content)
}

onMounted(() => loadContent(store.getFileContent(fileId.value)))
watch(fileId, (newId) => loadContent(store.getFileContent(newId)))

// ========== 渲染 ==========

const renderGroupHtml = (raw: string): string => {
  if (!raw.trim()) return '<br/>'
  return marked.parse(raw, { breaks: true }) as string
}

// ========== 编辑 ==========

const finishEditGroup = (gIndex: number) => {
  const group = groups[gIndex]
  if (!group) return
  const editedRaw = group.mergedRaw

  // 用编辑后的内容替换原始 blocks
  const newBlockLines = editedRaw.split('\n')
  const newBlocks: Block[] = newBlockLines.map((line) => ({
    raw: line,
    inCodeFence: false,
  }))

  blocks.splice(group.blockStartIndex, group.blockCount, ...newBlocks)
  group.editing = false
  buildGroups()
  syncContent()
}

const focusTextarea = (gIndex: number) => {
  nextTick(() => {
    const el = document.querySelector<HTMLTextAreaElement>(
      `textarea[data-group-index="${gIndex}"]`
    )
    if (el) {
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
      autoResize(el)
    }
  })
}

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

// ========== 事件 ==========

const handleDblClick = (e: MouseEvent) => {
  // 通过点击位置找到对应的 group
  const target = e.target as HTMLElement
  const preview = target.closest('.block-preview')
  if (!preview) return

  const allPreviews = document.querySelectorAll('.block-preview')
  const idx = Array.from(allPreviews).indexOf(preview)
  if (idx < 0) return

  // 计算 group 索引（跳过正在编辑的 group）
  let gIdx = 0
  let renderedCount = 0
  for (let i = 0; i < groups.length; i++) {
    if (!groups[i].editing) {
      if (renderedCount === idx) {
        gIdx = i
        break
      }
      renderedCount++
    }
  }

  groups[gIdx].editing = true
  focusTextarea(gIdx)
}

const handleGroupInput = (e: Event, gIndex: number) => {
  const el = e.target as HTMLTextAreaElement
  groups[gIndex].mergedRaw = el.value
  autoResize(el)
}

const handleBottomClick = () => {
  // 在末尾追加新 block
  blocks.push({ raw: '', inCodeFence: false })
  buildGroups()
  syncContent()
  // 编辑最后一个 group
  const lastG = groups[groups.length - 1]
  if (lastG) {
    lastG.editing = true
    focusTextarea(groups.length - 1)
  }
}

const handleKeydown = (e: KeyboardEvent, gIndex: number) => {
  const el = e.target as HTMLTextAreaElement
  const group = groups[gIndex]

  if (e.key === 'Enter' && !e.shiftKey) {
    // 检查是否在代码块内
    if (hasUnmatchedFence(group.mergedRaw)) {
      const pos = el.selectionStart
      const textBefore = group.mergedRaw.slice(0, pos)
      const currentLine = textBefore.split('\n').pop() ?? ''

      if (currentLine.trim() === '') {
        // 空行回车 → 闭合代码块，退出编辑
        e.preventDefault()
        group.mergedRaw = group.mergedRaw.replace(/\n$/, '') + '\n```'
        finishEditGroup(gIndex)
      }
      // 非空行：让 textarea 自然换行
    } else {
      // 普通段落：回车拆分为新 group
      e.preventDefault()
      const pos = el.selectionStart
      const before = group.mergedRaw.slice(0, pos)
      const after = group.mergedRaw.slice(pos)
      group.mergedRaw = before

      // 先保存当前 group
      finishEditGroup(gIndex)

      // 在后面插入新 block
      const insertIdx = group.blockStartIndex + group.blockCount
      blocks.splice(insertIdx, 0, { raw: after, inCodeFence: false })
      buildGroups()
      syncContent()

      // 编辑新 group
      const newGIndex = gIndex + 1
      if (groups[newGIndex]) {
        groups[newGIndex].editing = true
        focusTextarea(newGIndex)
      }
    }
  }

  if (e.key === 'Backspace') {
    const pos = el.selectionStart
    if (pos === 0 && group.mergedRaw === '' && groups.length > 1) {
      e.preventDefault()
      const removedBlockCount = group.blockCount
      blocks.splice(group.blockStartIndex, removedBlockCount)
      buildGroups()
      syncContent()
      if (gIndex > 0) {
        groups[gIndex - 1].editing = true
        focusTextarea(gIndex - 1)
      }
    }
  }
}
</script>

<style scoped>
#fileEditor {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.editor-content {
  max-width: 800px;
  padding: 16px 32px;
}

/* 渲染态 */
.block-preview {
  font-family: var(--font-editor-sans);
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text);
  cursor: text;
  padding: 2px 0;
  border-radius: 4px;
  transition: background-color 0.15s;
}

.block-preview:hover {
  background-color: var(--color-bg-text-hover);
}

/* 编辑态 */
.block-textarea {
  width: 100%;
  min-height: 1.8em;
  padding: 2px 0;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  font-family: var(--font-editor-mono);
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text);
  background-color: transparent;
  tab-size: 2;
}

/* 底部点击区 */
.bottom-area {
  min-height: 200px;
  cursor: text;
}

/* ========== Markdown 渲染样式 ========== */

.editor-content :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 20px 0 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--color-border);
}

.editor-content :deep(h2) {
  font-size: 22px;
  font-weight: 600;
  margin: 16px 0 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border);
}

.editor-content :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  margin: 12px 0 4px;
}

.editor-content :deep(h4),
.editor-content :deep(h5),
.editor-content :deep(h6) {
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0 4px;
}

.editor-content :deep(p) {
  margin: 4px 0;
}

.editor-content :deep(code) {
  font-family: var(--font-editor-mono);
  background-color: var(--color-bg-text-hover);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.editor-content :deep(pre) {
  background-color: var(--color-bg-text-hover);
  padding: 14px 18px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.editor-content :deep(pre code) {
  background: none;
  padding: 0;
}

.editor-content :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: 14px;
  margin: 8px 0;
  color: var(--color-text-secondary);
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  padding-left: 24px;
  margin: 4px 0;
}

.editor-content :deep(li) {
  margin: 2px 0;
}

.editor-content :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
}

.editor-content :deep(a:hover) {
  text-decoration: underline;
}

.editor-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 12px 0;
}

.editor-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.editor-content :deep(th),
.editor-content :deep(td) {
  border: 1px solid var(--color-border);
  padding: 6px 10px;
  text-align: left;
}

.editor-content :deep(th) {
  background-color: var(--color-bg-text-hover);
  font-weight: 600;
}

.editor-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}
</style>
