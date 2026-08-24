export const themeTokens = {
  // 使用 Ant Design 的标准 Token 名称
  colorPrimary: '#18181b', // 自动转为 CSS: --color-primary
  colorBorder: '#e8e8e8', // 自动转为 CSS: --color-border
  colorBgContainer: '#ffffff', // 自动转为 CSS: --color-bg-container
}

export function initTheme() {
  const rootStyle = document.documentElement.style

  Object.entries(themeTokens).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    rootStyle.setProperty(cssVarName, value)
  })
}
