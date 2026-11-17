# Bandhani model photographs (client, Nov 17 2026): model photography/*.png → assets/images/<slug>.jpg, full size, JPEG q88.
# Run from homepage/: powershell -File _tools/convert-bandhani.ps1   then: node _tools/add-bandhani.cjs
Add-Type -AssemblyName System.Drawing
$SRC = (Resolve-Path '..\model photography').Path
$OUT = (Resolve-Path 'assets\images').Path
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$S = [ordered]@{
  chunari = 'Magenta and Gold Sari Elegance 1'
  sakhi   = 'Contemplative Magenta Sari Portrait 1'
  jamuni  = 'Elegant Magenta Saree Portrait (4) 1'
  bindiya = 'Elegant Purple Saree Portrait (2) 1'
  gulabo  = 'Heritage Steps in Magenta Saree 1'
  lavanya = 'Lavender Paisley Saree Portrait 1'
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
