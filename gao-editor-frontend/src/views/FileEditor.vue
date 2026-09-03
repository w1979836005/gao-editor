<template>
  <div id="fileEditor" @click="handleAreaClick">
    <div
      v-for="(block, index) in blocks"
      :key="block.id"
      class="block"
      @click.stop
    >
      <!-- 编辑态 -->
      <textarea
        v-if="block.editing"
        class="block-textarea"
        v-model="block.raw"
        @input="handleInput(index)"
        @blur="renderBlock(index)"
        @keydown="handleKeydown($event, index)"
        :data-index="index"
        spellcheck="false"
      ></textarea>

      <!-- 渲染态 -->
      <div
        v-else
        class="block-preview"
        v-html="renderBlockHtml(block.raw)"
        @dblclick="editBlock(index)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { useLeftFoldersStore } from '@/stores/leftFoldersStore'

interface Block {
  id: number
  raw: string
  editing: boolean
}

const route = useRoute()
const store = useLeftFoldersStore()
const fileId = computed(() => Number(route.params.id))

const blocks = reactive<Block[]>([])
let blockIdCounter = 0

// ---------- 内容加载 ----------

/** 按行拆分，代码块保持完整，空行保留 */
const splitIntoBlocks = (content: string): string[] => {
  if (!content) return []
  const lines = content.split('\n')
  const parts: string[] = []
  let current: string[] = []
  let inCodeFence = false

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      if (!inCodeFence) {
        // 进入代码块：先把之前的普通行保存
        if (current.length > 0) {
          parts.push(...current)
          current = []
        }
        inCodeFence = true
        current.push(line)
      } else {
        // 结束代码块
        current.push(line)
        parts.push(current.join('\n'))
        current = []
        inCodeFence = false
      }
    } else if (inCodeFence) {
      current.push(line)
    } else {
      // 普通行（含空行）：每行独立一个 block
      parts.push(line)
    }
  }
  // 剩余内容（未闭合的代码块等）
  if (current.length > 0) {
    parts.push(current.join('\n'))
  }
  return parts
}

const loadContent = (content: string) => {
  blocks.length = 0
  blockIdCounter = 0

  const parts = splitIntoBlocks(content)
  if (parts.length === 0) {
    blocks.push({ id: blockIdCounter++, raw: '', editing: true })
    return
  }

  for (const part of parts) {
    blocks.push({
      id: blockIdCounter++,
      raw: part,
      editing: false,
    })
  }
}

onMounted(() => loadContent(store.getFileContent(fileId.value)))
watch(fileId, (newId) => loadContent(store.getFileContent(newId)))

// ---------- 同步到 store ----------

const syncContent = () => {
  const content = blocks.map((b) => b.raw).join('\n')
  store.setFileContent(fileId.value, content)
}

// ---------- 渲染 ----------

const renderBlockHtml = (raw: string): string => {
  if (!raw.trim()) return '<br/>'
  return marked(raw, { breaks: true }) as string
}

// ---------- 编辑态切换 ----------

const focusTextarea = (index: number) => {
  nextTick(() => {
    const el = document.querySelector<HTMLTextAreaElement>(
      `textarea[data-index="${index}"]`
    )
    if (el) {
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
      autoResize(el)
    }
  })
}

const editBlock = (index: number) => {
  const block = blocks[index]
  if (!block) return
  block.editing = true
  focusTextarea(index)
}

const renderBlock = (index: number) => {
  const block = blocks[index]
  if (!block) return
  block.editing = false
}

// ---------- 点击空白区域 ----------

const handleAreaClick = () => {
  // 如果最后一行已经是编辑态，直接聚焦
  const lastIdx = blocks.length - 1
  if (lastIdx >= 0 && blocks[lastIdx]?.editing) {
    focusTextarea(lastIdx)
    return
  }
  // 否则在末尾追加一个新的空编辑行
  blocks.push({ id: blockIdCounter++, raw: '', editing: true })
  focusTextarea(blocks.length - 1)
}

// ---------- 自动调高 ----------

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

// ---------- 事件 ----------

const handleInput = (index: number) => {
  syncContent()
  // 自动调高
  const el = document.querySelector<HTMLTextAreaElement>(
    `textarea[data-index="${index}"]`
  )
  if (el) autoResize(el)
}

/** 判断当前 block 是否是代码块（包含 ``` 标记） */
const isCodeBlock = (raw: string): boolean => {
  const lines = raw.split('\n')
  let inFence = false
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence
    }
  }
  return inFence // true = 有开头没结尾，说明整个 block 是一个代码块
}

const handleKeydown = (e: KeyboardEvent, index: number) => {
  const el = e.target as HTMLTextAreaElement
  const block = blocks[index]

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()

    if (block && isCodeBlock(block.raw)) {
      // 代码块内：插入换行，保持在同一个 block
      const pos = el.selectionStart
      const before = block.raw.slice(0, pos)
      const after = block.raw.slice(pos)
      block.raw = before + '\n' + after
      syncContent()
      nextTick(() => {
        el.setSelectionRange(pos + 1, pos + 1)
        autoResize(el)
      })
    } else {
      // 普通段落：在光标位置拆分
      const pos = el.selectionStart
      const before = block.raw.slice(0, pos)
      const after = block.raw.slice(pos)
      block.raw = before
      block.editing = false
      blocks.splice(index + 1, 0, {
        id: blockIdCounter++,
        raw: after,
        editing: true,
      })
      syncContent()
      focusTextarea(index + 1)
    }
  }

  if (e.key === 'Backspace' && !el.value && blocks.length > 1) {
    e.preventDefault()
    blocks.splice(index, 1)
    syncContent()
    editBlock(Math.max(0, index - 1))
  }

  if (e.key === 'ArrowUp') {
    const pos = el.selectionStart
    if (pos === 0 && index > 0) {
      e.preventDefault()
      renderBlock(index)
      editBlock(index - 1)
    }
  }

  if (e.key === 'ArrowDown') {
    const pos = el.selectionStart
    if (pos === el.value.length && index < blocks.length - 1) {
      e.preventDefault()
      renderBlock(index)
      editBlock(index + 1)
    }
  }
}
</script>

<style scoped>
#fileEditor {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 16px 32px;
  cursor: text;
}

.block {
  max-width: 800px;
  min-height: 1.8em;
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

/* ========== Markdown 渲染样式 ========== */

.block-preview :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 20px 0 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--color-border);
}

.block-preview :deep(h2) {
  font-size: 22px;
  font-weight: 600;
  margin: 16px 0 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border);
}

.block-preview :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  margin: 12px 0 4px;
}

.block-preview :deep(h4),
.block-preview :deep(h5),
.block-preview :deep(h6) {
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0 4px;
}

.block-preview :deep(p) {
  margin: 0;
}

.block-preview :deep(code) {
  font-family: var(--font-editor-mono);
  background-color: var(--color-bg-text-hover);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.block-preview :deep(pre) {
  background-color: var(--color-bg-text-hover);
  padding: 14px 18px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 4px 0;
}

.block-preview :deep(pre code) {
  background: none;
  padding: 0;
}

.block-preview :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: 14px;
  margin: 4px 0;
  color: var(--color-text-secondary);
}

.block-preview :deep(ul),
.block-preview :deep(ol) {
  padding-left: 24px;
  margin: 4px 0;
}

.block-preview :deep(li) {
  margin: 2px 0;
}

.block-preview :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
}

.block-preview :deep(a:hover) {
  text-decoration: underline;
}

.block-preview :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 12px 0;
}

.block-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.block-preview :deep(th),
.block-preview :deep(td) {
  border: 1px solid var(--color-border);
  padding: 6px 10px;
  text-align: left;
}

.block-preview :deep(th) {
  background-color: var(--color-bg-text-hover);
  font-weight: 600;
}

.block-preview :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}
</style>
