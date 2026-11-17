# Folded "original" photos for the first-shoot Banarasi sarees (client, Nov 17 2026): slide 2 of the PDP, after the model photo.
# Source: Drive folder "Stylissh Naari" (https://drive.google.com/drive/folders/1mSuMo7MDkNpEl0HseQIfbgSGHYJnBWZs), the flat-lays on
# the yellow diamond rug. Download the originals (16–19 MB, 8064 px) into one folder, then run from homepage/:
#   powershell -File _tools/originals-firstshoot.ps1 -Src <folder with IMG_xxxx.jpg>
# The whole photo, never cropped: EXIF orientation applied, a landscape photo turned upright (90° clockwise) so it fills the
# portrait gallery frame, longest side 2400 px, JPEG q88 → assets/images/<slug>-original.jpg. Then: node _tools/add-originals-firstshoot.cjs
param([Parameter(Mandatory)][string]$Src)
Add-Type -AssemblyName System.Drawing
$OUT = (Resolve-Path 'assets\images').Path
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
# slug → Drive file (chosen by eye against each model photo)
$S = [ordered]@{ kairi = 'IMG_7947'; bagh = 'IMG_7944' }
# Not found in that folder: jamun (its real shoot, IMG_8016–8029, is plum-wine with gold buti; no flat-lay of it) and neel.
foreach ($slug in $S.Keys) {
  $im = [System.Drawing.Image]::FromFile((Join-Path $Src "$($S[$slug]).jpg"))
  if ($im.PropertyIdList -contains 0x0112) {
    $o = [int]$im.GetPropertyItem(0x0112).Value[0]
    $map = @{ 2 = 'RotateNoneFlipX'; 3 = 'Rotate180FlipNone'; 4 = 'Rotate180FlipX'; 5 = 'Rotate90FlipX'; 6 = 'Rotate90FlipNone'; 7 = 'Rotate270FlipX'; 8 = 'Rotate270FlipNone' }
    if ($map.ContainsKey($o)) { $im.RotateFlip([System.Drawing.RotateFlipType]$map[$o]) }
  }
  if ($im.Width -gt $im.Height) { $im.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
  $k = 2400 / [math]::Max($im.Width, $im.Height); $w = [int][math]::Round($im.Width * $k); $h = [int][math]::Round($im.Height * $k)
  $b = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($b); $g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($im, 0, 0, $w, $h); $g.Dispose(); $im.Dispose()
  $p = New-Object System.Drawing.Imaging.EncoderParameters 1
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 88L
  $b.Save((Join-Path $OUT "$slug-original.jpg"), $enc, $p); $b.Dispose()
  "$slug-original.jpg  ${w}x$h  from $($S[$slug])"
}
