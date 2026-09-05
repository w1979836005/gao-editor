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

 const floderList = ref<FileItem[]>([])
 const activeFloderId = ref<null | number>(null)
 const isCollspe = ref(true)
 // 文件内容存储（key 为文件 id，value 为 markdown 内容）
 const fileContents = ref<Record<number, string>>({})


 /**
  * 切换状态栏
  */
 const toggleIsCollspe = () => {
  isCollspe.value = !isCollspe.value
 }
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
    editMode: 'add',
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
 * 检查同级目录下是否存在同名项
 * @param items 同级项列表
 * @param name 要检查的名称
 * @param type 文件类型
 * @param excludeId 排除的ID（当前正在编辑的项）
 * @returns 是否存在同名项
 */
const isDuplicateName = (items: FileItem[], name: string, type: 'file' | 'folder', excludeId?: number): boolean => {
  const normalizedName = name.trim().toLowerCase()
  return items.some(item =>
    item.id !== excludeId &&
    item.type === type &&
    item.name.trim().toLowerCase() === normalizedName
  )
}

/**
 * 完成新增文件/文件夹（用户输入名称后）
 * @param tempId 临时项的ID
 * @param fileName 用户输入的文件名
 * @returns { success: boolean, message?: string } 是否成功，失败时返回错误信息
 */
const finishAddFileItem = (tempId: number, fileName: string): { success: boolean; message?: string } => {
  let result: { success: boolean; message?: string } = { success: false }

  // 递归查找并处理临时项
  const processTempItem = (items: FileItem[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item) continue

      if (item.id === tempId) {
        if (fileName.trim()) {
          const itemType = item.type as 'file' | 'folder'
          // 检查同级目录下是否存在同名项（排除当前正在编辑的临时项）
          if (isDuplicateName(items, fileName, itemType, tempId)) {
            // 重名，保留编辑状态让用户修改
            result = {
              success: false,
              message: `已存在同名${itemType === 'folder' ? '文件夹' : '文件'}: ${fileName}`
            }
          } else {
            // 用户输入了名称且不重名：更新临时项为真正的项
            items.splice(i, 1, {
              ...item,
              name: fileName.trim(),
              isEditing: false,
              ...(itemType === 'folder' ? { isOpen: false, children: [] } : {})
            })
            // 排序该目录
            sortTree(items)
            // 设置activeFloderId为新建项
            activeFloderId.value = tempId
            result = { success: true }
          }
        } else {
          // 用户没有输入名称：移除临时项
          items.splice(i, 1)
          result = { success: true }
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
  return result
}

/** 开始重命名已有文件/文件夹。 */
const startRenameFileItem = (id: number): boolean => {
  const item = findItemById(id)
  if (!item) return false
  item.isEditing = true
  item.editMode = 'rename'
  return true
}

/** 完成新增或重命名编辑。 */
const finishEditFileItem = (id: number, fileName: string): { success: boolean; message?: string } => {
  const findAndEdit = (items: FileItem[]): { success: boolean; message?: string } | null => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item) continue
      if (item.id === id) {
        // Enter 确认后输入框可能随后触发 blur，避免重复提交破坏已完成的编辑。
        if (!item.isEditing) return { success: true }
        const name = fileName.trim()
        if (item.editMode === 'rename') {
          if (!name) return { success: false, message: '名称不能为空' }
          if (isDuplicateName(items, name, item.type, id)) {
            return { success: false, message: `已存在同名${item.type === 'folder' ? '文件夹' : '文件'}: ${name}` }
          }
          items.splice(i, 1, { ...item, name, isEditing: false, editMode: undefined })
          sortTree(items)
          return { success: true }
        }
        return finishAddFileItem(id, name)
      }
      if (item.children) {
        const result = findAndEdit(item.children)
        if (result) return result
      }
    }
    return null
  }
  return findAndEdit(floderList.value) ?? { success: false, message: '找不到要编辑的项' }
}

/** 取消编辑：新增的临时项移除，重命名恢复原状。 */
const cancelEditFileItem = (id: number) => {
  const cancel = (items: FileItem[]): boolean => {
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) {
      const item = items[index]
      if (!item) return false
      if (item.editMode === 'add') items.splice(index, 1)
      else items.splice(index, 1, { ...item, isEditing: false, editMode: undefined })
      return true
    }
    return items.some(item => item.children ? cancel(item.children) : false)
  }
  cancel(floderList.value)
}

/** 删除文件或文件夹（文件夹会递归删除其子项）。 */
const deleteFileItem = (id: number): { success: boolean; message?: string } => {
  const removedIds: number[] = []
  const collectIds = (item: FileItem) => {
    removedIds.push(item.id as number)
    item.children?.forEach(collectIds)
  }
  const remove = (items: FileItem[]): boolean => {
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) {
      const [removed] = items.splice(index, 1)
      if (removed) collectIds(removed)
      return true
    }
    return items.some(item => item.children ? remove(item.children) : false)
  }
  if (!remove(floderList.value)) return { success: false, message: '找不到要删除的项' }
  removedIds.forEach(removedId => { delete fileContents.value[removedId] })
  if (removedIds.includes(activeFloderId.value as number)) activeFloderId.value = null
  return { success: true }
}

/**
 * 检查目标文件夹是否是源项的子目录（防止循环引用）
 * @param sourceId 源项ID
 * @param targetId 目标文件夹ID
 * @returns 是否是子目录
 */
const isDescendant = (sourceId: number, targetId: number): boolean => {
  const findDescendant = (items: FileItem[]): boolean => {
    for (const item of items) {
      if (item.id === targetId) {
        return true
      }
      if (item.children && findDescendant(item.children)) {
        return true
      }
    }
    return false
  }

  // 找到源项，检查目标是否在其子目录中
  const findSource = (items: FileItem[]): FileItem | null => {
    for (const item of items) {
      if (item.id === sourceId) {
        return item
      }
      if (item.children) {
        const found = findSource(item.children)
        if (found) return found
      }
    }
    return null
  }

  const sourceItem = findSource(floderList.value)
  if (!sourceItem || !sourceItem.children) return false
  return findDescendant(sourceItem.children)
}

/**
 * 移动文件/文件夹到目标文件夹
 * @param sourceId 要移动的项的ID
 * @param targetFolderId 目标文件夹的ID
 * @returns { success: boolean, message?: string } 是否成功
 */
const moveItem = (sourceId: number, targetFolderId: number): { success: boolean; message?: string } => {
  // 不能移动到自己
  if (sourceId === targetFolderId) {
    return { success: false, message: '不能移动到自身' }
  }

  // 检查目标是否是源的子目录（防止循环引用）
  if (isDescendant(sourceId, targetFolderId)) {
    return { success: false, message: '不能移动到自己的子目录中' }
  }

  let sourceItem: FileItem | null = null
  let sourceIndex = -1
  let sourceParent: FileItem[] | null = null

  // 递归查找并移除源项
  const removeSource = (items: FileItem[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item) continue

      if (item.id === sourceId) {
        sourceItem = { ...item }
        sourceIndex = i
        sourceParent = items
        items.splice(i, 1)
        return true
      }

      if (item.children && removeSource(item.children)) {
        return true
      }
    }
    return false
  }

  // 查找目标文件夹并添加源项
  const addToTarget = (items: FileItem[]): boolean => {
    for (const item of items) {
      if (!item) continue

      if (item.id === targetFolderId) {
        if (item.type !== 'folder') {
          // 目标不是文件夹，放回原位
          if (sourceParent && sourceItem) {
            sourceParent.splice(sourceIndex, 0, sourceItem)
          }
          return false
        }

        if (!item.children) item.children = []
        item.children.unshift(sourceItem!)
        // 展开目标文件夹
        item.isOpen = true
        return true
      }

      if (item.children && addToTarget(item.children)) {
        return true
      }
    }
    return false
  }

  // 执行移动
  removeSource(floderList.value)

  if (!sourceItem) {
    return { success: false, message: '找不到要移动的项' }
  }

  const added = addToTarget(floderList.value)

  if (!added) {
    return { success: false, message: '目标不是文件夹' }
  }

  // 排序目标目录
  const sortTarget = (items: FileItem[]): boolean => {
    for (const item of items) {
      if (item.id === targetFolderId) {
        if (item.children) sortTree(item.children)
        return true
      }
      if (item.children && sortTarget(item.children)) {
        return true
      }
    }
    return false
  }
  sortTarget(floderList.value)

  // 更新activeFloderId
  activeFloderId.value = sourceId

  return { success: true }
}


  /**
   * 获取当前选中项的路径
   * @returns 路径数组，如 ['src', 'components', 'form', 'CustomInput.vue']
   */
  const getActiveItemPath = (): string[] => {
    if (activeFloderId.value === null) return []

    const path: string[] = []

    const findPath = (items: FileItem[]): boolean => {
      for (const item of items) {
        if (item.id === activeFloderId.value) {
          path.push(item.name)
          return true
        }
        if (item.children && findPath(item.children)) {
          path.unshift(item.name)
          return true
        }
      }
      return false
    }

    findPath(floderList.value)
    return path
  }

  /**
   * 根据 id 递归查找文件/文件夹项
   * @param id 项的 id
   * @returns 找到的项，未找到返回 null
   */
  const findItemById = (id: number): FileItem | null => {
    const search = (items: FileItem[]): FileItem | null => {
      for (const item of items) {
        if (item.id === id) return item
        if (item.children) {
          const found = search(item.children)
          if (found) return found
        }
      }
      return null
    }
    return search(floderList.value)
  }

  /**
   * 获取指定文件的内容
   * @param fileId 文件 id
   * @returns 文件内容字符串
   */
  const getFileContent = (fileId: number): string => {
    return fileContents.value[fileId] ?? ''
  }

  /**
   * 设置指定文件的内容
   * @param fileId 文件 id
   * @param content 文件内容
   */
  const setFileContent = (fileId: number, content: string) => {
    fileContents.value[fileId] = content
  }

  return {
    isCollspe,
    floderList,
    activeFloderId,
    fileContents,
    handleToggle,
    setAllFoldersClose,
    setAllFoldersOpen,
    startAddFileItem,
    finishAddFileItem,
    startRenameFileItem,
    finishEditFileItem,
    cancelEditFileItem,
    deleteFileItem,
    moveItem,
    toggleIsCollspe,
    getActiveItemPath,
    findItemById,
    getFileContent,
    setFileContent
  }
},{persist: true})
