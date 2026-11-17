# Converts the model photographs of Kamdhenu, Gulnaar, Saawan and Gagan (supplied 16 Nov 2026, 1024 px wide PNGs,
# saved in model photography/) to JPEG quality 95 as assets/images/<slug>*.jpg, full size, no edits.
# Run from homepage/:  powershell -File _tools/convert-nov16c.ps1
Add-Type -AssemblyName System.Drawing
$map = [ordered]@{
  'Romantic Saree Portrait Under Floral Canopy 1.png' = 'kamdhenu.jpg'
  'Elegant Pink Sari Portrait 1.png'                  = 'kamdhenu-detail.jpg'
  'Elegant Magenta Sari Portrait 1.png'               = 'gulnaar.jpg'
  'Embroidered Magenta Sari Portrait 1.png'           = 'gulnaar-back.jpg'
  'Embroidered Magenta Sari Portrait (1) 1.png'       = 'gulnaar-detail.jpg'
  'Mediterranean Sari in Motion 1.png'                = 'saawan.jpg'
  'Sari Elegance Beside a Blue Urn 1.png'             = 'saawan-detail.jpg'
  'Sari Elegance in a Vintage Turquoise Car 1.png'    = 'gagan.jpg'
  'Elegant Blue Embroidered Sari Portrait 1.png'      = 'gagan-detail.jpg'
}
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 95L
foreach ($k in $map.Keys) {
  $src = Join-Path (Resolve-Path '..\model photography') $k
  $dst = Join-Path (Resolve-Path 'assets\images') $map[$k]
  $im = [System.Drawing.Image]::FromFile($src)
  $b = New-Object System.Drawing.Bitmap $im.Width, $im.Height, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($b); $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($im, 0, 0, $im.Width, $im.Height)
  $b.Save($dst, $enc, $p)
  "{0} -> {1} {2}x{3}" -f $k, $map[$k], $im.Width, $im.Height
  $g.Dispose(); $b.Dispose(); $im.Dispose()
}
