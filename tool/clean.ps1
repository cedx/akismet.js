#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

foreach ($item in "build", "docs/api", "lib") {
	if (Test-Path $item) { Remove-Item $item -Force -Recurse }
}

Remove-Item var/* -Exclude .gitkeep -Force -Recurse
