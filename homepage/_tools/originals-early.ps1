# Original product photos (gallery slides 2–4) for the early model sarees that match a client SN (Nov 16, 2026):
# Kajal SN-002 black, Kamal SN-005, Moonga SN-006, Phalsa SN-013 purple, Panna SN-023 dark green, Kasni SN-029 lilac,
# Chameli SN-032, Mehendi SN-034. Source: Drive (G:) 01 – Banarasi/Premium Silk/Original Product Photos – Pendrive
# (byte copies of the pendrive shoot folders day1/2day). Files are picked by their camera name (_DSCxxxx).
# Same treatment as convert-semi-silk.ps1: whole photo, EXIF orientation applied, landscape turned upright (90° clockwise),
# longest side 2400 px, JPEG q88 → assets/images/<slug>-original.jpg, -print.jpg, -border.jpg.
# Kairi, Jamun, Neel and Bagh have no folded photos: they are not in the client workbook and none of the 92 pendrive
# shoot folders (day1 1–48, 2day 49–92) holds them (checked by eye, Nov 16).
# Run from homepage/:  powershell -File _tools/originals-early.ps1 && node _tools/set-originals-early.cjs
param([string]$Drive = 'G:\My Drive\Stylish Naari – Saree Photography\01 – Banarasi\Premium Silk\Original Product Photos – Pendrive')
Add-Type -AssemblyName System.Drawing
$OUT = (Resolve-Path 'assets\images').Path
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
function Save-Jpeg($bmp, $dst, [long]$q) { $p = New-Object System.Drawing.Imaging.EncoderParameters 1; $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $q; $bmp.Save($dst, $enc, $p) }
function Orient($im) {
  if ($im.PropertyIdList -notcontains 0x0112) { return }
  $o = [int]$im.GetPropertyItem(0x0112).Value[0]
  $map = @{ 2 = 'RotateNoneFlipX'; 3 = 'Rotate180FlipNone'; 4 = 'Rotate180FlipX'; 5 = 'Rotate90FlipX'; 6 = 'Rotate90FlipNone'; 7 = 'Rotate270FlipX'; 8 = 'Rotate270FlipNone' }
  if ($map.ContainsKey($o)) { $im.RotateFlip([System.Drawing.RotateFlipType]$map[$o]) } }

# slug, SN, [slide 2 (the saree), slide 3 (print), slide 4 (another view)] as camera file names
$S = @(
  @('kajal',   '002', @('_DSC4617', '_DSC4620', '_DSC4618')),
  @('kamal',   '005', @('_DSC4528', '_DSC4529', '_DSC4545')),
  @('moonga',  '006', @('_DSC4767', '_DSC4769', '_DSC4771')),
  @('phalsa',  '013', @('_DSC4625', '_DSC4628', '_DSC4629')),
  @('panna',   '023', @('_DSC4652', '_DSC4655', '_DSC4653')),
  @('kasni',   '029', @('_DSC4681', '_DSC4682', '_DSC4683')),
  @('chameli', '032', @('_DSC4546', '_DSC4548', '_DSC4550')),
  @('mehendi', '034', @('_DSC4571', '_DSC4573', '_DSC4572'))
)
$kinds = @('original', 'print', 'border')
foreach ($s in $S) {
  $slug, $sn, $files = $s
  $dir = Get-ChildItem -LiteralPath $Drive -Directory | Where-Object { $_.Name -like "SN-$sn *" } | Select-Object -First 1
  $line = "{0,-8} SN-{1}" -f $slug, $sn
  for ($k = 0; $k -lt 3; $k++) {
    $src = Get-ChildItem -LiteralPath $dir.FullName -File | Where-Object { $_.Name -like "*$($files[$k]).JPG" } | Select-Object -First 1
    if (-not $src) { throw "missing SN-$sn $($files[$k])" }
    $im = [System.Drawing.Image]::FromFile($src.FullName); Orient $im
    $turned = $im.Width -gt $im.Height; if ($turned) { $im.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
    $sc = [math]::Min(1.0, 2400.0 / [math]::Max($im.Width, $im.Height)); $w = [int][math]::Round($im.Width * $sc); $h = [int][math]::Round($im.Height * $sc)
    $b = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($b); $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality; $g.DrawImage($im, 0, 0, $w, $h); $g.Dispose()
    Save-Jpeg $b "$OUT\$slug-$($kinds[$k]).jpg" 88
    $line += " | {0} {1} {2}x{3}{4}" -f $kinds[$k], $src.Name, $w, $h, $(if ($turned) { ' turned' } else { '' })
    $b.Dispose(); $im.Dispose()
  }
  $line
}
