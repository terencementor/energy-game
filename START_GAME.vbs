Set objShell = CreateObject("WScript.Shell")
strBatch = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\START_GAME.bat"
objShell.Run strBatch, 0, False
