<template>
  <div id="app">
    <a-config-provider
      :theme="{
        token: themeTokens,
      }"
    >
      <RouterView />
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { themeTokens } from './theme/theme'
</script>

<style scoped></style>
