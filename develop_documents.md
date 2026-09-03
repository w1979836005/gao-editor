# 如何写代码？
## 1. 我要实现什么功能

- 新建 md file
- 新建 document

## 2. 整体的流程是什么

- 新建 md file

1. 单击新建 md file的icon
2. 当前选中的文件夹子目录或者当前选中的 md file的同级目录出现一个新的fileItem（这里一定是在顶部），用户输入名称
3. 用户输入名称后，排序对新增的文件或者文件夹


- 新建 documents

1. 单击新建 documents的icon
2. 当前选中的文件夹子目录或者当前选中的 md file的同级目录出现一个新的fileItem（这里一定是在顶部），用户输入名称
3. 用户输入名称后，排序对新增的文件或者文件夹

## 3. 伪代码演示


1. 在leftFoldersStroe中添加这个方法用于新增mdfile或者document（这里store中维护的有activeId所以不用传递），void addFileItem(string fileName, string type)

这里的fileName应该是要从leftFloders中获取，这里视图层我不知道如何实现了

```vue
<template>
  <div id="siderTools">
    <div class="left-tool">
      <PlusSquareOutlined class="icon" @click="LeftFoldersStore.setAllFoldersOpen" />
      <MinusSquareOutlined class="icon" @click="LeftFoldersStore.setAllFoldersClose"/>
    </div>
    <div class="right-tool">
      <FileAddOutlined class="icon"  @click="leftFoldersStroe.addFileItem"/>
      <FolderAddOutlined class="icon" @click="leftFoldersStroe.addFileItem"/>
      <ReloadOutlined 
          class="icon" 
          style="font-size: 14px"
          @click="handleRefresh"
          />
    </div>
  </div>
</template>
```

## 4. 填充、优化


# 如何读代码？

## 1. 看导入的依赖以及文件名称判断整个文件是干啥的： 问自己这份代码是干啥的

## 2. 找到入口文件，读大概的整个流程（全部的函数）：问自己整个流程有哪些步骤？

## 3. 细看细读：问自己这个函数这个方法这个变量是干啥的？如何实现的？


# 我要做什么？ 

封装一个页面组件，这个组件表示当前单机了某一个md file，使用动态路由，这个页面组件支持编辑和展示md格式，编辑的话是以md语法，输入一行就可以实时渲染一行


# 如何实现？

1. 新建一个支持编辑和渲染的页面（这里可以先不纠结markdown格式渲染），先创建动态路由


2. 开始编写markdown各中语法的渲染效果，样式放在main.css中


3. 增加本地保存和导入功能