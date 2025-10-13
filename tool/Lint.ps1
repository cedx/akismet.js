Write-Output "Performing the static analysis of source code..."
Import-Module PSScriptAnalyzer -Scope Local
Invoke-ScriptAnalyzer $PSScriptRoot -Recurse
npx tsc --build tsconfig.json --noEmit
npx eslint --cache --cache-location=var --config=etc/ESLint.js example src test
