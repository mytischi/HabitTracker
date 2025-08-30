@echo off
echo ========================================
echo ASCII Habit Tracker - Запуск
echo ========================================
echo.

REM Проверяем наличие Node.js
echo Проверяем Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Node.js не установлен!
    echo Пожалуйста, установите Node.js с https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Проверяем наличие npm
echo Проверяем npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: npm не установлен!
    echo Пожалуйста, установите npm
    echo.
    pause
    exit /b 1
)

echo.
echo Node.js и npm найдены!
echo.

REM Проверяем наличие node_modules
if not exist "node_modules" (
    echo Устанавливаем зависимости...
    echo Это может занять несколько минут...
    npm install
    if %errorlevel% neq 0 (
        echo.
        echo ОШИБКА при установке зависимостей!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Зависимости успешно установлены!
    echo.
) else (
    echo Зависимости уже установлены.
    echo.
)

echo Запускаем приложение...
echo После запуска откройте http://localhost:3000 в браузере
echo.
echo Для остановки нажмите Ctrl+C
echo.
echo ========================================
echo.

npm start

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo ОШИБКА при запуске приложения!
    echo Код ошибки: %errorlevel%
    echo ========================================
    echo.
    pause
    exit /b 1
)

echo.
echo Приложение остановлено.
pause
