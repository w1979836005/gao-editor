<template>
  <div id="footerUrl">
    <template v-if="path.length > 0">
      <span v-for="(segment, index) in path" :key="index" class="breadcrumb-item">
        <span class="breadcrumb-segment">{{ segment }}</span>
        <span v-if="index < path.length - 1" class="breadcrumb-separator">/</span>
      </span>
    </template>
    <template v-else>
      <span class="breadcrumb-empty">未选择文件</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLeftFoldersStore } from '@/stores/leftFoldersStore'

const leftFolderStore = useLeftFoldersStore()

const path = computed(() => leftFolderStore.getActiveItemPath())
</script>

<style scoped>
#footerUrl {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-segment {
  cursor: default;
}

.breadcrumb-separator {
  margin: 0 6px;
  color: var(--color-text-tertiary);
}

.breadcrumb-empty {
  color: var(--color-text-tertiary);
}
</style>
