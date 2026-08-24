<template>
  <div id="webTitle">
    <div class="webInfo">
      <img class="logo" src="../assets/logo.png" />
      <div class="text">Gao-Editor</div>
    </div>
    <div class="icons">
      <UserOutlined class="userIcon icon" />
      <SettingOutlined class="settingIcon icon" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UserOutlined, SettingOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
#webTitle {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border);
}
.webInfo {
  display: flex;
  align-items: center;
}
.logo {
  width: 32px;
  height: 32px;
  background-color: gray;
  border-radius: 8px;
}
.text {
  margin-left: 8px;
  letter-spacing: 1px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
.text:hover {
  border-bottom: 1px solid var(--color-underline);
}
.icons {
  width: 48px;
  display: flex;
  gap: 2px;
}
.icon {
  padding: 6px;
  font-size: 16px;
  border-radius: 6px; /* 圆角（4px ~ 6px 最契合极简风） */
  cursor: pointer;
}

.icon:hover {
  /* 悬浮时加深图标颜色，并显示浅灰背景 */
  color: var(--color-primary);
  background-color: var(--color-bg-text-hover);
}
</style>
