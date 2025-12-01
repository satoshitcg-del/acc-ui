# 📖 AI Coding Rules - How to Use

## 🎯 Overview

โปรเจคนี้มี **coding rules** ที่ออกแบบมาเพื่อให้ **Cursor AI** และ **GitHub Copilot** ทำงานร่วมกันได้อย่างลงตัว โดยไม่ขัดแย้งกัน

**ไฟล์ Rules ที่มี:**
- `.cursorrules` - กฎสำหรับ Cursor AI (comprehensive rules)
- `.instructions.md` - กฎสำหรับ GitHub Copilot (code completion focused)
- `README-rules.md` (ไฟล์นี้) - คู่มือการใช้งาน

---

## 🚀 Quick Start

### สำหรับ Cursor AI Users

Cursor จะอ่านไฟล์ `.cursorrules` โดยอัตโนมัติเมื่อคุณเปิดโปรเจค

**วิธีใช้:**
1. เปิดโปรเจคใน Cursor
2. เริ่ม coding หรือใช้ Cursor Chat
3. Cursor จะปฏิบัติตาม rules ใน `.cursorrules` โดยอัตโนมัติ

**ตรวจสอบว่า rules ทำงาน:**
- ลองถาม: "สร้าง component ใหม่" → ควรได้ TypeScript + i18n
- ลองถาม: "แก้ MUI style" → ควรใช้ theme tokens แทน hardcode

---

### สำหรับ GitHub Copilot Users

GitHub Copilot จะอ่านไฟล์ `.instructions.md` โดยอัตโนมัติ (ใน VSCode/IDEs ที่รองรับ)

**วิธีใช้:**
1. เปิดโปรเจคใน VSCode/IDE ที่มี Copilot
2. เริ่ม coding ตามปกติ
3. Copilot จะ complete code ตาม rules ใน `.instructions.md`

**ตรวจสอบว่า rules ทำงาน:**
- เริ่มพิมพ์: `const MyComponent: React.FC<` → ควร suggest typed props
- เริ่มพิมพ์: `<Button>` → ควร suggest `{t("...")}`
- เริ่มพิมพ์: `<Box sx={{ bg` → ควร suggest `bgcolor: 'primary.main'`

---

## 📋 Core Rules Summary

### 1. **TypeScript - Strict Mode**
- ✅ ใช้ types เสมอ, ห้ามใช้ `any`
- ✅ Strict mode enabled

### 2. **i18n - NO Hardcoded Text**
- ✅ ใช้ `t("key")` จาก `useTranslation`
- ❌ ห้าม hardcode text ใน UI
- 🔄 การเพิ่มคีย์ใหม่: อย่าแก้ไฟล์ locale ตรงๆ ให้เพิ่มคีย์ในโค้ดและรัน `yarn trans` เพื่อ generate/update คีย์อัตโนมัติ แล้วค่อยเติมคำแปลใน `th/translation.json` และ `en/translation.json` ตามลำดับ

### 3. **MUI - Theme Tokens Only**
- ✅ ใช้ `sx={{ bgcolor: 'primary.main', p: 2 }}`
- ❌ ห้าม hardcode colors/spacing

### 4. **Imports - Use Path Alias**
- ✅ ใช้ `@/` alias: `import { X } from "@/services/X"`
- ❌ หลีกเลี่ยง deep relative: `import { X } from "../../../X"`

### 5. **React - Functional Components Only**
- ✅ Functional components + hooks
- ❌ ห้าม class components

### 6. **State Management**
- **Recoil**: global state (theme, user, shared data)
- **Zustand**: feature-specific state
- **useState**: local component state

### 7. **Forms - React Hook Form + Yup**
- ✅ ใช้ `useForm` + `yupResolver`
- ✅ ใช้ `Controller` สำหรับ MUI components

### 8. **Conventional Commits**
- ✅ Format: `<type>(<scope>): <description>`
- ✅ Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`

---

## 🔧 ESLint & Prettier Configuration

โปรเจคมี **ESLint** และ **Prettier** configured แล้ว:

**ESLint:**
- Location: `.eslintrc.cjs`
- ใช้ TypeScript rules + React Hooks rules
- รัน: `yarn lint`

**Prettier:**
- Location: `package.json` (inline config)
- Format: 2 spaces, double quotes, semicolons, trailing commas
- Prettier จะ format อัตโนมัติใน Cursor/VSCode (ถ้าติดตั้ง extension)

---

## 🛠️ Recommended Config Updates (Optional)

ถ้าต้องการเพิ่มความเข้มงวดของ linting (แนะนำสำหรับ production):

### 1. Update ESLint Config

แก้ไฟล์ `.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',         // ← เพิ่ม
    'plugin:react/jsx-runtime',         // ← เพิ่ม
    'plugin:jsx-a11y/recommended',      // ← เพิ่ม (accessibility)
    'prettier',                          // ← เพิ่ม (ต้องอยู่ท้ายสุด)
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  settings: {
    react: { version: 'detect' },       // ← เพิ่ม
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',           // ← เพิ่ม (ใช้ TS แทน PropTypes)
  },
}
```

**หมายเหตุ:**
- Plugins ที่ต้องเพิ่ม (`eslint-plugin-react`, `eslint-plugin-jsx-a11y`) มีอยู่ใน devDeps ของ root package.json แล้ว
- `prettier` ใน extends จะปิด rules ที่ขัดแย้งกับ Prettier (ต้องมี `eslint-config-prettier` ใน devDeps ซึ่งมีอยู่แล้ว)

### 2. Enable Stricter TypeScript Rules

แก้ไฟล์ `tsconfig.base.json` (ถ้าต้องการเพิ่มความเข้มงวด):

```json
{
  "compilerOptions": {
    // ... existing options ...
    
    // Uncomment these for stricter checking:
    "noUnusedLocals": true,              // เตือนเมื่อมี local variables ไม่ได้ใช้
    "noUnusedParameters": true,          // เตือนเมื่อมี parameters ไม่ได้ใช้
    "noImplicitReturns": true,           // เตือนเมื่อ function ไม่ return ทุก path
    "noFallthroughCasesInSwitch": true,  // เตือน switch case ที่ไม่มี break
  }
}
```

**คำเตือน:** การเปิด options เหล่านี้อาจทำให้เกิด errors ใน existing code - ควร fix ทีละน้อย

### 3. Setup Commitlint (Optional)

ถ้าต้องการ enforce Conventional Commits:

```bash
yarn add -D @commitlint/cli @commitlint/config-conventional husky

# Setup
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

สร้างไฟล์ `.commitlintrc.json`:
```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

---

## 🔍 Checking Rules Compliance

### Pre-commit Checklist

ก่อน commit ทุกครั้ง:

```bash
# 1. Run linter
yarn lint

# 2. Run tests
yarn test

# 3. Check for console.logs (manual)
# Search for console.log in changed files

# 4. Check i18n usage (manual)
# Ensure no hardcoded text in JSX
```

### ใช้ Cursor AI ช่วยตรวจสอบ

ถาม Cursor:
- "Review my code for rules compliance"
- "Check if I'm following the project rules"
- "Am I using i18n correctly?"
- "Are there any hardcoded colors in my component?"

---

## 🤝 Cursor + Copilot Co-existence

### Rules ไม่ขัดแย้งกัน

- `.cursorrules` (Cursor) มีรายละเอียดมากกว่า → สำหรับ conversation และ code generation
- `.instructions.md` (Copilot) กระชับกว่า → สำหรับ code completion

**ทั้งสอง tools จะ:**
- ใช้ TypeScript types (no `any`)
- ใช้ i18n (no hardcoded text)
- ใช้ MUI theme tokens (no hardcoded colors)
- ใช้ path alias `@/`
- Follow functional components + hooks pattern
- Follow React Hook Form + Yup for forms

### ใช้ทั้งคู่พร้อมกัน

**Copilot**: ดีสำหรับ inline code completion
**Cursor**: ดีสำหรับ:
- Chat-based code generation
- Refactoring
- Explaining code
- Complex tasks

**แนะนำ:** ใช้ Copilot สำหรับ typing, ใช้ Cursor สำหรับ planning และ complex changes

---

## 📚 Additional Resources

### Key Files to Check

- **Theme**: `app/theme/index.tsx` - MUI theme config
- **i18n**: `app/core/i18n/config.ts` - i18next config
- **Services**: `app/services/` - API service layer
- **Hooks**: `app/core/hooks/` - custom hooks
- **Types**: `app/core/interface/` - shared types

### Documentation

- **MUI**: https://mui.com/material-ui/getting-started/
- **React Hook Form**: https://react-hook-form.com/
- **i18next**: https://www.i18next.com/
- **Recoil**: https://recoiljs.org/
- **Vitest**: https://vitest.dev/

---

## 🆘 Troubleshooting

### Cursor ไม่เห็นปฏิบัติตาม rules

1. ตรวจสอบว่าไฟล์ `.cursorrules` อยู่ที่ root ของโปรเจค
2. ลอง restart Cursor
3. ลองพิมพ์ชัดเจนว่า "Follow the .cursorrules"

### Copilot suggestion ไม่ตรง rules

1. ตรวจสอบว่าไฟล์ `.instructions.md` อยู่ที่ root
2. Copilot อาจใช้เวลาเรียนรู้ - reject suggestions ที่ไม่ตรง rules
3. พิมพ์เองบางส่วนแล้วให้ Copilot complete ต่อ

### ESLint errors หลังจาก update config

1. รัน `yarn lint --fix` เพื่อ auto-fix
2. แก้ manual สำหรับ errors ที่ auto-fix ไม่ได้
3. ถ้ามีมากเกินไป ให้ update config ทีละ rule

---

## ✅ Quick Command Reference

```bash
# Development
yarn start                 # Start dev server
yarn build                # Build production
yarn preview              # Preview production build

# Code Quality
yarn lint                 # Run ESLint
yarn test                 # Run Vitest
yarn coverage             # Test coverage

# Monorepo
yarn workspace app <cmd>   # Run command in app workspace
yarn workspace api-mock <cmd>  # Run command in api-mock
```

---

## 📝 Updating Rules

Rules เหล่านี้เป็น **living documents** - สามารถแก้ไขได้เมื่อโปรเจคเติบโต

**เมื่อต้องการแก้ rules:**
1. แก้ `.cursorrules` และ `.instructions.md` ให้สอดคล้องกัน
2. Update `README-rules.md` (ไฟล์นี้) ด้วย
3. แจ้ง team ผ่าน PR หรือ team chat
4. Commit ด้วย: `docs: update coding rules for [reason]`

---

## 🎯 Goals

จุดประสงค์ของ rules เหล่านี้:
- ✅ **Consistency**: Code style เหมือนกันทั้งโปรเจค
- ✅ **Quality**: Type-safe, accessible, maintainable code
- ✅ **AI-Friendly**: Cursor และ Copilot ให้ suggestions ที่ดี
- ✅ **Non-Breaking**: ไม่ทำลาย existing code
- ✅ **Developer Experience**: เขียนโค้ดได้เร็วขึ้นโดยไม่ลด quality

---

**Happy Coding! 🚀**

ถ้ามีคำถามหรือข้อเสนอแนะ สามารถเปิด issue หรือ PR เพื่อปรับปรุง rules ได้ตลอดเวลา

