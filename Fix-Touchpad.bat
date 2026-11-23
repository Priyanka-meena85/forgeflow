@echo off
:: Batch script to fix Lenovo LOQ ELAN Touchpad intermittent freezing / sleep issue
:: Must be run as Administrator
title Lenovo LOQ Touchpad Power Management Fix
echo =======================================================
echo   Lenovo LOQ ELAN Touchpad Power Management Fix
echo =======================================================
echo.

:: Check for Administrator permissions
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: This script must be run as Administrator!
    echo Right-click this file and select "Run as administrator".
    echo.
    pause
    exit /b 1
)

echo [*] Applying Power Management tweaks to ELAN Touchpad (ACPI\ELAN06FA)...

:: 1. Disable Enhanced Power Management for ELAN Touchpad
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\ACPI\ELAN06FA\1\Device Parameters" /v EnhancedPowerManagementEnabled /t REG_DWORD /d 0 /f >nul 2>&1
if %errorlevel% equ 0 (
    echo [+] Successfully disabled EnhancedPowerManagementEnabled (Set to 0)
) else (
    echo [-] Could not set EnhancedPowerManagementEnabled
)

:: 2. Disable D3Cold power saving state for ELAN Touchpad
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\ACPI\ELAN06FA\1\Device Parameters\e5b3b5ac-9725-4f78-963f-03dfb1d828c7" /v D3ColdSupported /t REG_DWORD /d 0 /f >nul 2>&1
if %errorlevel% equ 0 (
    echo [+] Successfully disabled D3ColdSupported (Set to 0)
) else (
    echo [-] Could not set D3ColdSupported
)

echo.
echo [*] Restarting Touchpad I2C HID Device...
powershell -NoProfile -Command "Get-PnpDevice -InstanceId 'ACPI\ELAN06FA\1' | Disable-PnpDevice -Confirm:$false; Start-Sleep -Seconds 1; Get-PnpDevice -InstanceId 'ACPI\ELAN06FA\1' | Enable-PnpDevice -Confirm:$false" >nul 2>&1

echo.
echo =======================================================
echo   Fix applied successfully!
echo   Please test your trackpad now or restart your laptop.
echo =======================================================
echo.
pause
