<template>
  <div id="fileEditor">
    <div class="workspace">
      <EditorContent v-if="editor" :editor="editor" class="tiptap-content" />
      <aside v-if="headings.length" class="outline-pane">
        <button
          v-for="heading in headings"
          :key="heading.id"
          class="outline-item"
          :class="[`level-${heading.level}`, { active: activeHeading === heading.index }]"
          type="button"
          @click="jumpToHeading(heading.index)"
        >
          {{ heading.text }}
        </button>
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { Markdown } from '@tiptap/markdown'
import { useLeftFoldersStore } from '@/stores/leftFoldersStore'

const route = useRoute()
const store = useLeftFoldersStore()
const fileId = computed(() => Number(route.params.id))
const lowlight = createLowlight(all)
const activeHeading = ref<number | null>(null)
function enhanceCodeBlocks(root: HTMLElement) {
  root.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.code-copy-button')) return
    const button = document.createElement('button')
    button.className = 'code-copy-button'
    button.type = 'button'
    button.contentEditable = 'false'
    button.textContent = '复制'
    button.addEventListener('mousedown', (event) => event.preventDefault())
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(pre.querySelector('code')?.textContent || '')
      button.textContent = '已复制'
      window.setTimeout(() => {
        button.textContent = '复制'
      }, 1200)
    })
    pre.appendChild(button)
  })
}
const editor = useEditor({
  extensions: [
    StarterKit.configure({ codeBlock: false }),
    Link.configure({ openOnClick: false }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    CodeBlockLowlight.configure({ lowlight }),
    Markdown,
  ],
  content: store.getFileContent(fileId.value),
  contentType: 'markdown',
  editable: true,
  autofocus: true,
  onCreate: ({ editor: instance }) => nextTick(() => enhanceCodeBlocks(instance.view.dom)),
  onUpdate: ({ editor: instance }) => {
    store.setFileContent(fileId.value, instance.getMarkdown())
    nextTick(() => enhanceCodeBlocks(instance.view.dom))
  },
})

const headings = computed(() =>
  store
    .getFileContent(fileId.value)
    .split('\n')
    .flatMap((line, index) => {
      const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line)
      return match
        ? [
            {
              id: `heading-${index}`,
              text: match[2].replace(/[*_`~]/g, '').trim(),
              level: match[1].length,
              index,
            },
          ]
        : []
    }),
)
watch(headings, () => nextTick(updateActiveHeading), { deep: true })

watch(fileId, (id) =>
  editor.value?.commands.setContent(store.getFileContent(id), { contentType: 'markdown' }),
)
const jumpToHeading = (index: number) => {
  activeHeading.value = index
  const nodes = editor.value?.view.dom.querySelectorAll('h1,h2,h3,h4,h5,h6')
  nodes?.[headings.value.findIndex((heading) => heading.index === index)]?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
const updateActiveHeading = () => {
  const nodes = editor.value?.view.dom.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6')
  if (!nodes?.length) return
  const container = scrollContainer || editor.value?.view.dom
  // 到达文档底部时，最后一个标题应保持 active，即使它无法继续滚动到顶部阈值。
  if (container && container.scrollHeight - container.scrollTop - container.clientHeight <= 12) {
    activeHeading.value = headings.value[headings.value.length - 1]?.index ?? null
    return
  }
  const containerTop = container?.getBoundingClientRect().top ?? 0
  let current = 0
  nodes.forEach((node, index) => {
    if (node.getBoundingClientRect().top - containerTop <= 90) current = index
  })
  activeHeading.value = headings.value[current]?.index ?? null
}
let scrollContainer: HTMLElement | null = null
let editorScrollLayer: HTMLElement | null = null
watch(editor, (instance) => {
  if (!instance) return
  nextTick(() => {
    enhanceCodeBlocks(instance.view.dom)
    scrollContainer = instance.view.dom.closest('.tiptap-content') as HTMLElement | null
    editorScrollLayer = instance.view.dom
    scrollContainer?.addEventListener('scroll', updateActiveHeading, { passive: true })
    editorScrollLayer.addEventListener('scroll', updateActiveHeading, { passive: true })
    updateActiveHeading()
  })
})
onMounted(() => {
  // EditorContent 组件挂载后再兜底绑定一次，兼容不同 Tiptap 版本的滚动层结构。
  window.setTimeout(() => {
    const root = document.querySelector<HTMLElement>('.tiptap-content')
    if (root && root !== scrollContainer) {
      scrollContainer = root
      root.addEventListener('scroll', updateActiveHeading, { passive: true, capture: true })
      updateActiveHeading()
    }
  }, 0)
})
onBeforeUnmount(() => {
  scrollContainer?.removeEventListener('scroll', updateActiveHeading, true)
  editorScrollLayer?.removeEventListener('scroll', updateActiveHeading)
})
onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
#fileEditor {
  height: 100%;
  background: var(--color-bg);
  color: var(--color-text);
}
.workspace {
  display: flex;
  height: 100%;
  min-height: 0;
}
.tiptap-content {
  min-width: 0;
  flex: 1;
  height: 100%;
  overflow-y: auto;
}
.tiptap-content :deep(.tiptap) {
  max-width: 920px;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  margin: 0 auto;
  padding: 32px 48px 120px;
  outline: none;
  text-align: left;
  font: 15px/1.8 var(--font-editor-sans);
}
.tiptap-content :deep(.tiptap > *) {
  margin: 0.6em 0;
}
.tiptap-content :deep(.tiptap > p:first-child:last-child) {
  margin: 0;
}
.tiptap-content :deep(.tiptap h1),
.tiptap-content :deep(.tiptap h2),
.tiptap-content :deep(.tiptap h3) {
  line-height: 1.35;
  scroll-margin-top: 20px;
}
.tiptap-content :deep(.tiptap h1) {
  font-size: 30px;
}
.tiptap-content :deep(.tiptap h2) {
  font-size: 23px;
}
.tiptap-content :deep(.tiptap h3) {
  font-size: 19px;
}
.tiptap-content :deep(.tiptap blockquote) {
  border-left: 3px solid var(--color-primary);
  padding-left: 16px;
  color: var(--color-text-secondary);
}
.tiptap-content :deep(.tiptap pre) {
  padding: 16px;
  border-radius: 8px;
  background: #f6f8fa;
  overflow-x: auto;
}
.tiptap-content :deep(.tiptap code) {
  border-radius: 4px;
  background: var(--color-bg-text-hover);
  padding: 2px 5px;
}
.tiptap-content :deep(.tiptap pre code) {
  padding: 0;
  background: transparent;
}
.tiptap-content :deep(.tiptap a) {
  color: var(--color-primary);
}
.tiptap-content :deep(.tiptap table) {
  border-collapse: collapse;
  width: 100%;
}
.tiptap-content :deep(.tiptap th),
.tiptap-content :deep(.tiptap td) {
  border: 1px solid var(--color-border);
  padding: 7px 10px;
}
.outline-pane {
  width: 190px;
  flex: 0 0 190px;
  padding: 28px 14px;
  overflow-y: auto;
  border-left: 1px solid var(--color-border);
}
.outline-item {
  display: block;
  width: 100%;
  margin: 2px 0;
  padding: 6px 10px;
  border: 0;
  border-left: 2px solid transparent;
  border-radius: 0 5px 5px 0;
  color: var(--color-text-secondary);
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.outline-item:hover {
  color: var(--color-primary);
  background: var(--color-bg-text-hover);
  border-left-color: var(--color-primary);
}
.outline-item.level-2 {
  padding-left: 20px;
}
.outline-item.level-3,
.outline-item.level-4,
.outline-item.level-5,
.outline-item.level-6 {
  padding-left: 30px;
}
.tiptap-content :deep(.tiptap a:hover) {
  color: var(--color-primary-hover, #1677ff);
  text-decoration: underline;
}
.tiptap-content :deep(.tiptap pre) {
  position: relative;
}
.tiptap-content :deep(.code-copy-button) {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 9px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  cursor: pointer;
  font-size: 12px;
}
.tiptap-content :deep(.code-copy-button:hover) {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.tiptap-content :deep(.hljs-keyword),
.tiptap-content :deep(.hljs-selector-tag),
.tiptap-content :deep(.hljs-built_in) {
  color: #8b5cf6;
}
.tiptap-content :deep(.hljs-string),
.tiptap-content :deep(.hljs-attr) {
  color: #0f766e;
}
.tiptap-content :deep(.hljs-comment) {
  color: #8c959f;
}
.tiptap-content :deep(.hljs-number),
.tiptap-content :deep(.hljs-literal) {
  color: #c2410c;
}
.outline-item.active {
  color: var(--color-primary);
  background: var(--color-bg-text-hover);
  border-left-color: var(--color-primary);
  font-weight: 600;
}
@media (max-width: 900px) {
  .outline-pane {
    display: none;
  }
}
</style>
