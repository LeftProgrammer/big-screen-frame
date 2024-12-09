export default {
  '*.{js,jsx,ts,tsx,vue}': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.{scss,less,css,html}': [
    'prettier --write'
  ],
  'package.json': [
    'prettier --write'
  ],
  '*.md': [
    'prettier --write'
  ]
}
