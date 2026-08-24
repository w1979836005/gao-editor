<template>
  <div id="webTitle">
    <div class="icon"></div>
    <div class="text">Gao-Editor</div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
#webTitle {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border);
}
.icon {
  width: 32px;
  height: 32px;
  background-color: gray;
  border-radius: 8px;
}
.text {
  margin-left: 8px;
  letter-spacing: 1px;
  font-size: 14px;
}
</style>
