import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { FileItem } from '@/components/LeftFloders/LeftFolders.vue'

//初始化数据
 const initFloderList:FileItem[] = [
  {
    id: 1,
    name: '.vscode',
    
    type: 'folder',
    isOpen: false,
    children: [
      { id: 101, name: 'settings.json',  type: 'file' },
      { id: 102, name: 'extensions.json',  type: 'file' },
      { id: 103, name: 'launch.json',  type: 'file' },
    ],
  },
  {
    id: 2,
    name: 'src',
    
    type: 'folder',
    isOpen: true, // 默认展开，方便直接往下看深层结构
    children: [
      {
        id: 201,
        name: 'api',
        
        type: 'folder',
        isOpen: false,
        children: [
          { id: 2011, name: 'user.ts',  type: 'file' },
          { id: 2012, name: 'order.ts',  type: 'file' },
          { id: 2013, name: 'auth.ts',  type: 'file' },
          { id: 2014, name: 'index.ts',  type: 'file' },
        ],
      },
      {
        id: 202,
        name: 'assets',
        
        type: 'folder',
        isOpen: false,
        children: [
          {
            id: 2021,
            name: 'images',
            
            type: 'folder',
            isOpen: false,
            children: [
              { id: 20211, name: 'logo.png',  type: 'file' },
              { id: 20212, name: 'banner.jpg',  type: 'file' },
              { id: 20213, name: 'avatar.svg',  type: 'file' },
            ],
          },
          { id: 2022, name: 'styles',  type: 'folder', isOpen: false, children: [
            { id: 20221, name: 'global.css',  type: 'file' },
            { id: 20222, name: 'variables.scss',  type: 'file' },
          ]},
        ],
      },
      {
        id: 203,
        name: 'components',
        
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 2031,
            name: 'form',
            
            type: 'folder',
            isOpen: true,
            children: [
              { id: 20311, name: 'CustomInput.vue',  type: 'file' },
              { id: 20312, name: 'CustomSelect.vue',  type: 'file' },
              { id: 20313, name: 'CustomUpload.vue',  type: 'file' },
            ],
          },
          {
            id: 2032,
            name: 'modal',
            
            type: 'folder',
            isOpen: false,
            children: [
              { id: 20321, name: 'ConfirmModal.vue',  type: 'file' },
              { id: 20322, name: 'Dialog.vue',  type: 'file' },
            ],
          },
          { id: 2033, name: 'Header.vue',  type: 'file' },
          { id: 2034, name: 'Sidebar.vue',  type: 'file' },
          { id: 2035, name: 'Footer.vue',  type: 'file' },
        ],
      },
      {
        id: 204,
        name: 'router',
        
        type: 'folder',
        isOpen: false,
        children: [
          { id: 2041, name: 'index.ts',  type: 'file' },
          { id: 2042, name: 'guards.ts',  type: 'file' },
        ],
      },
      {
        id: 205,
        name: 'store',
        
        type: 'folder',
        isOpen: false,
        children: [
          { id: 2051, name: 'modules',  type: 'folder', isOpen: false, children: [
            { id: 20511, name: 'userStore.ts',  type: 'file' },
            { id: 20512, name: 'appStore.ts',  type: 'file' },
          ]},
          { id: 2052, name: 'index.ts',  type: 'file' },
        ],
      },
      {
        id: 206,
        name: 'views',
        
        type: 'folder',
        isOpen: false,
        children: [
          { id: 2061, name: 'Login.vue',  type: 'file' },
          { id: 2062, name: 'Dashboard.vue',  type: 'file' },
          { id: 2063, name: 'Settings.vue',  type: 'file' },
          { id: 2064, name: 'Profile.vue',  type: 'file' },
        ],
      },
      { id: 207, name: 'App.vue',  type: 'file' },
      { id: 208, name: 'main.ts',  type: 'file' },
      { id: 209, name: 'env.d.ts',  type: 'file' },
    ],
  },
  {
    id: 3,
    name: 'public',
    
    type: 'folder',
    isOpen: false,
    children: [
      { id: 301, name: 'favicon.ico',  type: 'file' },
      { id: 302, name: 'index.html',  type: 'file' },
    ],
  },
  {
    id: 4,
    name: 'tests',
    
    type: 'folder',
    isOpen: false,
    children: [
      { id: 401, name: 'unit',  type: 'folder', isOpen: false, children: [
        { id: 4011, name: 'example.spec.ts',  type: 'file' },
      ]},
      { id: 402, name: 'e2e',  type: 'folder', isOpen: false, children: [
        { id: 4021, name: 'specs.cy.ts',  type: 'file' },
      ]},
    ],
  },
  // 模拟空文件夹和超长文件名，测试文本溢出省略号（ellipsis）
  {
    id: 5,
    name: 'empty_directory_test_for_nothing_inside_here',
    
    type: 'folder',
    isOpen: false,
    children: [],
  },
  { id: 6, name: 'package.json',  type: 'file' },
  { id: 7, name: 'tsconfig.json',  type: 'file' },
  { id: 8, name: 'vite.config.ts',  type: 'file' },
  { id: 9, name: 'README_VERY_LONG_FILE_NAME_DESCRIPTION_EXAMPLE.md',  type: 'file' },
  { id: 10, name: 'LICENSE',  type: 'file' },
  { id: 11, name: '.gitignore',  type: 'file' },
  { id: 12, name: 'yarn.lock',  type: 'file' },
  { id: 13, name: 'package-lock.json',  type: 'file' },
]

/**
 * 左侧文件全局状态
 */
export const useLeftFoldersStore = defineStore('leftFolders', () => {

 const floderList = ref<FileItem[]>(initFloderList)
 const activeFloderId = ref<null | number>(null)
 
 /**
  * 更新activeFolderId以及文件折叠状态
  * @param id 
  */
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


  return {  floderList ,activeFloderId,handleToggle}
},{persist: true})
