# Kalamkari model photographs (client, Nov 17 2026): model photography/*.png → assets/images/<slug>.jpg, full size, JPEG q88.
# Run from homepage/: powershell -File _tools/convert-kalamkari.ps1   then: node _tools/add-kalamkari.cjs
Add-Type -AssemblyName System.Drawing
$SRC = (Resolve-Path '..\model photography').Path
$OUT = (Resolve-Path 'assets\images').Path
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$S = [ordered]@{
  veena   = 'Flowing Folk-Art Saree Portrait'
  darbar  = 'Contemplative Woman in a Bespoke Sari'
  chitra  = 'Elegant Kalamkari Saree Portrait'
  gajraj  = 'Seated in a Vivid Elephant-Print Sari'
  bansuri = 'Mustard Kalamkari Saree Portrait'
}
foreach ($slug in $S.Keys) {
  $im = [System.Drawing.Image]::FromFile((Join-Path $SRC "$($S[$slug]).png"))
  $b = New-Object System.Drawing.Bitmap $im.Width, $im.Height, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($b); $g.DrawImage($im, 0, 0, $im.Width, $im.Height); $g.Dispose()
  $p = New-Object System.Drawing.Imaging.EncoderParameters 1
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 88L
  $b.Save((Join-Path $OUT "$slug.jpg"), $enc, $p)
  "$slug.jpg  $($im.Width)x$($im.Height)  from $($S[$slug]).png"
  $b.Dispose(); $im.Dispose()
}
