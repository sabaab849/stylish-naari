# Block print sarees: model photographs (client, Nov 17 2026): model photography/*.png → assets/images/<slug>.jpg, full size, JPEG q88.
# Run from homepage/: powershell -File _tools/convert-blockprint.ps1   then: node _tools/add-blockprint.cjs
Add-Type -AssemblyName System.Drawing
$SRC = (Resolve-Path '..\model photography').Path
$OUT = (Resolve-Path 'assets\images').Path
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$S = [ordered]@{
  rekha    = 'Elegant Black and Gold Saree Portrait 1'
  syahi    = 'Elegant Black Saree Studio Portrait 1'
  chaand   = 'IMG-20261105-WA0067 1'
  champa   = 'IMG-20261105-WA0089 1'
  jaali    = 'IMG-20261105-WA0091 1'
  samandar = 'IMG-20261105-WA0105 1'
  saras    = 'IMG-20261116-WA0002 1'
  shaam    = 'IMG-20261116-WA0006 1'
  rangrez  = 'IMG-20261116-WA0018 1'
  jugnu    = 'IMG-20261116-WA0034 1'
  patti    = 'IMG-20261116-WA0042 1'
  dhaara   = 'IMG-20261116-WA0066 1'
  sarson   = 'IMG-20261116-WA0076 1'
  raat     = 'Indigo Saree in a Warm Studio 1'
  mehrab   = 'Regal Blue Saree in an Ornate Palace 1'
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
