# Converts the model photographs of Neelambari, Gulaabi, Pista and Dariya (supplied 16 Nov 2026, 1024 px wide PNGs,
# saved in model photography/) to JPEG quality 92 as assets/images/<slug>*.jpg, full size, no edits.
# Run from homepage/:  powershell -File _tools/convert-nov16b.ps1
Add-Type -AssemblyName System.Drawing
$map = [ordered]@{
  'Neelambari 1 (full length).png' = 'neelambari.jpg'
  'Neelambari 2 (drape).png'       = 'neelambari-drape.jpg'
  'Gulaabi 1 (full length).png'    = 'gulaabi.jpg'
  'Gulaabi 2 (close-up).png'       = 'gulaabi-detail.jpg'
  'Gulaabi 3 (border).png'         = 'gulaabi-border.jpg'
  'Pista 1 (full length).png'      = 'pista.jpg'
  'Pista 2 (close-up).png'         = 'pista-detail.jpg'
  'Dariya 1 (bamboo).png'          = 'dariya.jpg'
  'Dariya 2 (smiling).png'         = 'dariya-smile.jpg'
  'Dariya 3 (close-up).png'        = 'dariya-detail.jpg'
}
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
foreach ($k in $map.Keys) {
  $src = Join-Path (Resolve-Path '..\model photography') $k
  $dst = Join-Path (Resolve-Path 'assets\images') $map[$k]
  $im = [System.Drawing.Image]::FromFile($src)
  $b = New-Object System.Drawing.Bitmap $im.Width, $im.Height, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($b); $g.Clear([System.Drawing.Color]::White); $g.DrawImage($im, 0, 0, $im.Width, $im.Height)
  $b.Save($dst, $enc, $p)
  "{0} -> {1} {2}x{3}" -f $k, $map[$k], $im.Width, $im.Height
  $g.Dispose(); $b.Dispose(); $im.Dispose()
}
