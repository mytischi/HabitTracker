@echo off
echo Установка зависимостей для ASCII Habit Tracker...
echo.

REM Проверяем наличие Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Node.js не установлен!
    echo Пожалуйста, установите Node.js с https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Проверяем наличие npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: npm не установлен!
    echo Пожалуйста, установите npm
    echo.
    pause
    exit /b 1
)

echo Node.js найден: 
node --version
echo npm найден:
npm --version
echo.

echo Устанавливаем зависимости...
npm install

if %errorlevel% equ 0 (
    echo.
    echo Зависимости успешно установлены!
    echo.
    echo Для запуска приложения выполните:
    echo npm start
    echo.
    echo Или откройте index.html в браузере для standalone версии
    echo.
) else (
    echo.
    echo ОШИБКА при установке зависимостей!
    echo.
)

pause
