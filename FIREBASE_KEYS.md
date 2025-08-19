# 🔑 Получение реальных ключей Firebase

## ❌ Проблема
В коде используются placeholder значения:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",           // ❌ Замените на реальный ключ
    authDomain: "mytischi-tracker.firebaseapp.com",
    projectId: "mytischi-tracker",
    storageBucket: "mytischi-tracker.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID", // ❌ Замените на реальный ID
    appId: "YOUR_APP_ID"              // ❌ Замените на реальный ID
};
```

## ✅ Решение: Получите реальные ключи

### Шаг 1: Откройте Firebase Console
1. Перейдите на [console.firebase.google.com](https://console.firebase.google.com)
2. Выберите ваш проект `mytischi-tracker`

### Шаг 2: Получите конфигурацию
1. Нажмите на **шестеренку** ⚙️ рядом с "Project Overview"
2. Выберите **"Project settings"**
3. Прокрутите вниз до раздела **"Your apps"**
4. Если нет веб-приложения, нажмите **"Add app"** → **"Web"**
5. Назовите приложение: `MytischiTracker`
6. Нажмите **"Register app"**

### Шаг 3: Скопируйте конфигурацию
После регистрации вы увидите код:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...",                    // ✅ Реальный ключ
    authDomain: "mytischi-tracker.firebaseapp.com",
    projectId: "mytischi-tracker",
    storageBucket: "mytischi-tracker.appspot.com",
    messagingSenderId: "123456789",          // ✅ Реальный ID
    appId: "1:123456789:web:abc123def456"   // ✅ Реальный ID
};
```

### Шаг 4: Обновите HTML файл
1. Откройте `public/index.html`
2. Найдите строки 218-224
3. Замените placeholder значения на реальные
4. Сохраните файл

## 🔍 Проверка конфигурации

### Правильная конфигурация должна выглядеть так:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...", // Длинная строка из букв и цифр
    authDomain: "mytischi-tracker.firebaseapp.com",
    projectId: "mytischi-tracker",
    storageBucket: "mytischi-tracker.appspot.com",
    messagingSenderId: "123456789", // Только цифры
    appId: "1:123456789:web:abc123def456" // Формат: 1:ID:web:ID
};
```

### ❌ Неправильно:
- `apiKey: "YOUR_API_KEY"`
- `messagingSenderId: "YOUR_SENDER_ID"`
- `appId: "YOUR_APP_ID"`

## 🚨 Важно!
- **НЕ коммитьте** реальные ключи в Git
- **НЕ публикуйте** ключи в открытых репозиториях
- Ключи безопасны для использования в frontend коде
- Firebase автоматически ограничивает доступ по домену

## 🧪 Тестирование
После обновления ключей:
1. Обновите страницу (Ctrl+F5)
2. Попробуйте создать аккаунт
3. Проверьте консоль браузера на ошибки
4. Убедитесь, что регистрация работает

## 🆘 Если всё ещё не работает:
1. Проверьте, что проект Firebase создан
2. Убедитесь, что Authentication включен
3. Проверьте, что Firestore Database создан
4. Убедитесь, что правила безопасности настроены

## 📱 Пример готовой конфигурации:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC_1234567890abcdefghijklmnopqrstuvwxyz",
    authDomain: "mytischi-tracker.firebaseapp.com",
    projectId: "mytischi-tracker",
    storageBucket: "mytischi-tracker.appspot.com",
    messagingSenderId: "987654321",
    appId: "1:987654321:web:fedcba0987654321"
};
```

**После обновления ключей приложение должно работать!** 🎉
