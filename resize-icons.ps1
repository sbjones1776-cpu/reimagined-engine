Add-Type -AssemblyName System.Drawing

# Load source image
$source = [System.Drawing.Image]::FromFile("$PSScriptRoot\public\icons\New Logo.png")

# Create 192x192
$dest192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($dest192)
$g192.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g192.DrawImage($source, 0, 0, 192, 192)
$dest192.Save("$PSScriptRoot\public\icons\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g192.Dispose()
$dest192.Dispose()
Write-Host "Created icon-192.png"

# Create 512x512
$dest512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($dest512)
$g512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g512.DrawImage($source, 0, 0, 512, 512)
$dest512.Save("$PSScriptRoot\public\icons\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g512.Dispose()
$dest512.Dispose()
Write-Host "Created icon-512.png"

$source.Dispose()
Write-Host "Icon generation complete!"
