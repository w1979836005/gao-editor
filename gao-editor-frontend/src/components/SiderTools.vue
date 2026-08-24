<template>
  <div id="siderTools">
    <div class="left-tool">
      <PlusSquareOutlined class="icon" />
      <MinusSquareOutlined class="icon" />
    </div>
    <div class="right-tool">
      <FileAddOutlined class="icon" />
      <FolderAddOutlined class="icon" />
      <ReloadOutlined class="icon" style="font-size: 14px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  FileAddOutlined,
  FolderAddOutlined,
  ReloadOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons-vue'
</script>

<style scoped>
#siderTools {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 16px;
  border-bottom: 1px solid var(--color-border);
}
</style>
