# 🚨 БЫСТРОЕ ИСПРАВЛЕНИЕ: Ошибка API ключей

## ❌ Ошибка:
```
Sign up failed: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## ✅ Решение за 2 минуты:

### 1. Получите ключи Firebase:
- Откройте [console.firebase.google.com](https://console.firebase.google.com)
- Выберите проект `mytischi-tracker`
- Нажмите ⚙️ → "Project settings"
- Прокрутите до "Your apps"
- Нажмите "Add app" → "Web"
- Назовите: `MytischiTracker`
- Скопируйте конфигурацию

### 2. Обновите файл `public/index.html`:
Найдите строки 218-224 и замените:
```javascript
// ❌ СТАРОЕ (не работает):
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ✅ НОВОЕ (работает):
const firebaseConfig = {
    apiKey: "AIzaSyC_1234567890abcdefghijklmnopqrstuvwxyz",
    messagingSenderId: "987654321",
    appId: "1:987654321:web:fedcba0987654321"
};
```

### 3. Сохраните и обновите страницу (Ctrl+F5)

## 🎯 Готово! Теперь регистрация должна работать.
