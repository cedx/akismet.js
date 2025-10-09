Write-Output "Updating the version number in the sources..."
$version = (Get-Content "package.json" | ConvertFrom-Json).version
(Get-Content "src/Client.ts") -replace '#version = "\d+(\.\d+){2}"', "#version = ""$version""" | Out-File "src/Client.ts"
