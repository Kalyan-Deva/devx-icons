# Publishes the seven DevX Icons tarballs to npm under @kalyan-dev.
# npm verifies each publish in the browser: it prints (and usually opens) an npmjs.com link,
# you sign in / approve there (npm may email you a code), and the publish continues.
$ErrorActionPreference = "Continue"  # `npm view` returns 404 for not-yet-published packages; that's expected
$dir = Join-Path $PSScriptRoot "..\release\npm"
$order = @("", "-font", "-iconify", "-react", "-vue", "-svelte", "-elements")
$version = (Get-Content (Join-Path $PSScriptRoot "..\packages\svg\package.json") | ConvertFrom-Json).version
foreach ($s in $order) {
  $name = "@kalyan-dev/devx-icons$s"
  $file = Join-Path $dir "kalyan-dev-devx-icons$s-$version.tgz"
  $existing = npm view "$name@$version" version 2>$null
  if ($existing -eq $version) { Write-Host "$name@$version already published" -ForegroundColor DarkGray; continue }
  Write-Host ""
  Write-Host "Publishing $name@${version} - approve it in the browser when npm asks" -ForegroundColor Cyan
  npm publish $file --access public --auth-type=web
  if ($LASTEXITCODE -ne 0) { Write-Host "Failed: $name. Run this script again to retry (published ones are skipped)." -ForegroundColor Red; exit 1 }
  Write-Host "Published $name" -ForegroundColor Green
}
Write-Host ""
Write-Host "All 7 DevX Icons packages are on npm." -ForegroundColor Green
