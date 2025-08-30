@echo off
echo ========================================
echo ASCII Habit Tracker - Отладка
echo ========================================
echo.

echo Текущая директория:
cd
echo.

echo Содержимое директории:
dir
echo.

echo Версия Node.js:
node --version
echo.

echo Версия npm:
npm --version
echo.

echo Проверяем package.json:
if exist "package.json" (
    echo package.json найден
    type package.json
) else (
    echo package.json НЕ найден!
)
echo.

echo Проверяем node_modules:
if exist "node_modules" (
    echo node_modules найден
    dir node_modules | find /c "."
    echo папок в node_modules
) else (
    echo node_modules НЕ найден!
)
echo.

echo Пробуем запустить npm start:
echo.
npm start

echo.
echo Нажмите любую клавишу для закрытия...
pause
