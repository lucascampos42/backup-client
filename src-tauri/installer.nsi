!include "MUI2.nsh"

Name "Backup Client"
OutFile "BackupClientInstaller.exe"
InstallDir "$PROGRAMFILES\Backup Maximus Cliente"
InstallDirRegKey HKLM "Software\BackupMaximus" "Install_Dir"
ShowInstDetails show

!define MUI_ABORTWARNING

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "dist\\**\\*.*"          ; todos os binários gerados em dist/
  WriteRegStr HKLM "Software\BackupClient" "Install_Dir" "$INSTDIR"
SectionEnd

Section "Uninstall"
  DeleteRegKey HKLM "Software\BackupClient"
  RMDir /r "$INSTDIR"
SectionEnd

!insertmacro MUI_LANGUAGE "Portuguese"