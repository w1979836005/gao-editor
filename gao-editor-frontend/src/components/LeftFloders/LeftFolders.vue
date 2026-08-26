<template>
  <div id="LeftFolders">
    <FolderItem v-for="item in floderList" :key="item.id" :item="item" :level="0" @toggle="handleToggle" :active-folder-id="activeFloderId"/>
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

const floderList = ref<FileItem[]>([
  {
    id: 1,
    name: '.vscode',
    icon: FolderOutlined,
    type: 'folder',
    isOpen: false,
    children: [
      { id: 101, name: 'settings.json', icon: FileOutlined, type: 'file' },
      { id: 102, name: 'extensions.json', icon: FileOutlined, type: 'file' },
      { id: 103, name: 'launch.json', icon: FileOutlined, type: 'file' },
    ],
  },
  {
    id: 2,
    name: 'src',
    icon: FolderOutlined,
    type: 'folder',
    isOpen: true, // 默认展开，方便直接往下看深层结构
    children: [
      {
        id: 201,
        name: 'api',
        icon: FolderOutlined,
        type: 'folder',
        isOpen: false,
        children: [
          { id: 2011, name: 'user.ts', icon: FileOutlined, type: 'file' },
          { id: 2012, name: 'order.ts', icon: FileOutlined, type: 'file' },
          { id: 2013, name: 'auth.ts', icon: FileOutlined, type: 'file' },
          { id: 2014, name: 'index.ts', icon: FileOutlined, type: 'file' },
        ],
      },
      {
        id: 202,
        name: 'assets',
        icon: FolderOutlined,
        type: 'folder',
        isOpen: false,
        children: [
          {
            id: 2021,
            name: 'images',
            icon: FolderOutlined,
            type: 'folder',
            isOpen: false,
            children: [
              { id: 20211, name: 'logo.png', icon: FileOutlined, type: 'file' },
              { id: 20212, name: 'banner.jpg', icon: FileOutlined, type: 'file' },
              { id: 20213, name: 'avatar.svg', icon: FileOutlined, type: 'file' },
            ],
          },
          { id: 2022, name: 'styles', icon: FolderOutlined, type: 'folder', isOpen: false, children: [
            { id: 20221, name: 'global.css', icon: FileOutlined, type: 'file' },
            { id: 20222, name: 'variables.scss', icon: FileOutlined, type: 'file' },
          ]},
        ],
      },
      {
        id: 203,
        name: 'components',
        icon: FolderOutlined,
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 2031,
            name: 'form',
            icon: FolderOutlined,
            type: 'folder',
            isOpen: true,
            children: [
              { id: 20311, name: 'CustomInput.vue', icon: FileOutlined, type: 'file' },
              { id: 20312, name: 'CustomSelect.vue', icon: FileOutlined, type: 'file' },
              { id: 20313, name: 'CustomUpload.vue', icon: FileOutlined, type: 'file' },
            ],
          },
          {
            id: 2032,
            name: 'modal',
            icon: FolderOutlined,
            type: 'folder',
            isOpen: false,
            children: [
              { id: 20321, name: 'ConfirmModal.vue', icon: FileOutlined, type: 'file' },
              { id: 20322, name: 'Dialog.vue', icon: FileOutlined, type: 'file' },
            ],
          },
          { id: 2033, name: 'Header.vue', icon: FileOutlined, type: 'file' },
          { id: 2034, name: 'Sidebar.vue', icon: FileOutlined, type: 'file' },
          { id: 2035, name: 'Footer.vue', icon: FileOutlined, type: 'file' },
        ],
      },
      {
        id: 204,
        name: 'router',
        icon: FolderOutlined,
        type: 'folder',
        isOpen: false,
        children: [
          { id: 2041, name: 'index.ts', icon: FileOutlined, type: 'file' },
          { id: 2042, name: 'guards.ts', icon: FileOutlined, type: 'file' },
        ],
      },
      {
        id: 205,
        name: 'store',
        icon: FolderOutlined,
        type: 'folder',
        isOpen: false,
        children: [
          { id: 2051, name: 'modules', icon: FolderOutlined, type: 'folder', isOpen: false, children: [
            { id: 20511, name: 'userStore.ts', icon: FileOutlined, type: 'file' },
            { id: 20512, name: 'appStore.ts', icon: FileOutlined, type: 'file' },
          ]},
          { id: 2052, name: 'index.ts', icon: FileOutlined, type: 'file' },
        ],
      },
      {
        id: 206,
        name: 'views',
        icon: FolderOutlined,
        type: 'folder',
        isOpen: false,
        children: [
          { id: 2061, name: 'Login.vue', icon: FileOutlined, type: 'file' },
          { id: 2062, name: 'Dashboard.vue', icon: FileOutlined, type: 'file' },
          { id: 2063, name: 'Settings.vue', icon: FileOutlined, type: 'file' },
          { id: 2064, name: 'Profile.vue', icon: FileOutlined, type: 'file' },
        ],
      },
      { id: 207, name: 'App.vue', icon: FileOutlined, type: 'file' },
      { id: 208, name: 'main.ts', icon: FileOutlined, type: 'file' },
      { id: 209, name: 'env.d.ts', icon: FileOutlined, type: 'file' },
    ],
  },
  {
    id: 3,
    name: 'public',
    icon: FolderOutlined,
    type: 'folder',
    isOpen: false,
    children: [
      { id: 301, name: 'favicon.ico', icon: FileOutlined, type: 'file' },
      { id: 302, name: 'index.html', icon: FileOutlined, type: 'file' },
    ],
  },
  {
    id: 4,
    name: 'tests',
    icon: FolderOutlined,
    type: 'folder',
    isOpen: false,
    children: [
      { id: 401, name: 'unit', icon: FolderOutlined, type: 'folder', isOpen: false, children: [
        { id: 4011, name: 'example.spec.ts', icon: FileOutlined, type: 'file' },
      ]},
      { id: 402, name: 'e2e', icon: FolderOutlined, type: 'folder', isOpen: false, children: [
        { id: 4021, name: 'specs.cy.ts', icon: FileOutlined, type: 'file' },
      ]},
    ],
  },
  // 模拟空文件夹和超长文件名，测试文本溢出省略号（ellipsis）
  {
    id: 5,
    name: 'empty_directory_test_for_nothing_inside_here',
    icon: FolderOutlined,
    type: 'folder',
    isOpen: false,
    children: [],
  },
  { id: 6, name: 'package.json', icon: FileOutlined, type: 'file' },
  { id: 7, name: 'tsconfig.json', icon: FileOutlined, type: 'file' },
  { id: 8, name: 'vite.config.ts', icon: FileOutlined, type: 'file' },
  { id: 9, name: 'README_VERY_LONG_FILE_NAME_DESCRIPTION_EXAMPLE.md', icon: FileOutlined, type: 'file' },
  { id: 10, name: 'LICENSE', icon: FileOutlined, type: 'file' },
  { id: 11, name: '.gitignore', icon: FileOutlined, type: 'file' },
  { id: 12, name: 'yarn.lock', icon: FileOutlined, type: 'file' },
  { id: 13, name: 'package-lock.json', icon: FileOutlined, type: 'file' },
])

const activeFloderId = ref<null | number>(null)

const handleToggle = (id: string | number) => {
  //更新activeFolderId
  activeFloderId.value = id as number
  //更新折叠状态
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


</script>

<style scoped>
#LeftFolders {
  width: 100%;
  height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 8px;
}
</style>
