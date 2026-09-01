import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { FileItem } from '@/components/LeftFloders/LeftFolders.vue'


/**
 * 比较函数
 * @param a 
 * @param b 
 * @returns 
 */
function compareItems(a: FileItem, b:FileItem) : number {
  if(a.type !== b.type) {
    return a.type === 'folder' ? -1 : 1;
  }
  return a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}); 
}

/**
 * 递归排序文件树
 * @param list 
 */
function sortTree(list: FileItem[]) {
  list.sort(compareItems);
  list.forEach(item => {
    if(item.children && item.children.length) {
      sortTree(item.children)
    }
  })
}

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
    isOpen: true,
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
  {
    id: 5,
    name: 'empty_directory_test',
    type: 'folder',
    isOpen: false,
    children: [],
  },
  { id: 6, name: 'package.json',  type: 'file' },
  { id: 7, name: 'tsconfig.json',  type: 'file' },
  { id: 8, name: 'vite.config.ts',  type: 'file' },
  { id: 9, name: 'README.md',  type: 'file' },
  { id: 10, name: 'LICENSE',  type: 'file' },
  { id: 11, name: '.gitignore',  type: 'file' },
  { id: 12, name: 'yarn.lock',  type: 'file' },
  { id: 13, name: 'package-lock.json',  type: 'file' },
]

//初始化后立马排序一次
sortTree(initFloderList)

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


/**
 * 递归修改全部的文件isOpen状态
 * @param FolderList 
 * @param isOpen 
 */
const setAllFoldersOpenStatus = (FolderList: FileItem[], isOpen: boolean) => {
    FolderList.forEach(item => {
      item.isOpen = isOpen;
      if(item.children)
      setAllFoldersOpenStatus(item.children, isOpen);
    })
}

const setAllFoldersClose = ()=> setAllFoldersOpenStatus(floderList.value, false);
const setAllFoldersOpen = ()=> setAllFoldersOpenStatus(floderList.value, true);


/**
 * 开始新增文件/文件夹（在正确位置显示输入框）
 * @param type 文件类型：'file' 或 'folder'
 */
const startAddFileItem = (type: 'file' | 'folder') => {
  const tempItem: FileItem = {
    id: Date.now(),
    name: '',
    type: type,
    isEditing: true,
    ...(type === 'folder' ? { isOpen: false, children: [] } : {})
  }
  
  // 找到要添加的位置
  const addTempItem = (items: FileItem[]): boolean => {
    // 如果没有选中项，添加到根目录顶部
    if (activeFloderId.value === null) {
      items.unshift(tempItem)
      return true
    }
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item) continue
      
      // 找到选中的项
      if (item.id === activeFloderId.value) {
        if (item.type === 'folder') {
          // 选中的是文件夹：添加到该文件夹子目录顶部，并展开
          if (!item.children) item.children = []
          item.children.unshift(tempItem)
          if (!item.isOpen) {
            items.splice(i, 1, { ...item, isOpen: true })
          }
        } else {
          // 选中的是文件：添加到该文件的同级目录顶部
          items.unshift(tempItem)
        }
        return true
      }
      
      // 递归查找子目录
      if (item.children && item.children.length > 0) {
        if (addTempItem(item.children)) return true
      }
    }
    return false
  }
  
  addTempItem(floderList.value)
}

/**
 * 完成新增文件/文件夹（用户输入名称后）
 * @param tempId 临时项的ID
 * @param fileName 用户输入的文件名
 */
const finishAddFileItem = (tempId: number, fileName: string) => {
  // 递归查找并处理临时项
  const processTempItem = (items: FileItem[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item) continue
      
      if (item.id === tempId) {
        if (fileName.trim()) {
          // 用户输入了名称：更新临时项为真正的项
          const type = item.type
          items.splice(i, 1, {
            ...item,
            name: fileName.trim(),
            isEditing: false,
            ...(type === 'folder' ? { isOpen: false, children: [] } : {})
          })
          // 排序该目录
          sortTree(items)
        } else {
          // 用户没有输入名称：移除临时项
          items.splice(i, 1)
        }
        return true
      }
      
      // 递归查找子目录
      if (item.children && processTempItem(item.children)) {
        return true
      }
    }
    return false
  }
  
  processTempItem(floderList.value)
}


  return { floderList, activeFloderId, handleToggle, setAllFoldersClose, setAllFoldersOpen, startAddFileItem, finishAddFileItem }
},{persist: true})
