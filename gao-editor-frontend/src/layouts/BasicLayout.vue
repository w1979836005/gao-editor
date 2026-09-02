<template>
  <div id="basicLayout">
    <div class="left-container" v-if="leftFolderStroe.isCollspe">
      <!-- WebTitle -->
      <WebTitle />
      <!-- SiderTools -->
      <SiderTools />
      <!-- LeftFolders -->
      <LeftFolders />
    </div>
    <div class="right-container">
      <div class="header">
        <!-- GlobalHeader -->
        <GlobalHeader />
      </div>
      <div class="content">
        <RouterView />
      </div>
      <div class="footer">
        <!-- FooterUrl -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader.vue'
import LeftFolders from '@/components/LeftFloders/LeftFolders.vue'
import SiderTools from '@/components/SiderTools.vue'
import WebTitle from '@/components/WebTitle.vue'
import { useLeftFoldersStore } from '@/stores/leftFoldersStore'


const leftFolderStroe = useLeftFoldersStore()
</script>

<style scoped>
#basicLayout {
  width: 100%;
  height: 100vh;
  display: flex;
}

.left-container {
  width: 320px;
  height: 100%;
  border-right: 1px solid var(--color-border);
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.03);
}

.right-container {
  width: 100%;
  height: 100%;
}

.header {
  width: 100%;
  height: 48px;
  border-bottom: 1px solid var(--color-border);
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.03);
}

.content {
  width: 100%;
  padding: 16px;
}
</style>
