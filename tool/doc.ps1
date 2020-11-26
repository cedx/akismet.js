#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

npm run doc
Copy-Item docs/favicon.ico docs/api
