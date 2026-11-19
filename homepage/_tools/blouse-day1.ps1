# Blouse piece photos for the Premium Silk sarees (client, 19 Nov 2026), from the pendrive shoot "day1" (Drive folder
# 1pJXlePZQ8OwY0l8eE95p89qQB0kyMhgk, folders 1–48). The same photos sit, sorted by SN, in (G:) 01 – Banarasi / Premium Silk /
# Original Product Photos – Pendrive, which is what this reads. In each SN folder the blouse piece is the shot of plain (or
# lightly striped) cloth with the border beside it, usually the last one (05); picked by eye from contact sheets of every
# folder. A few Premium Semi-Silk folders were checked too: only Neem's holds a blouse piece (the embroidered neckline).
# Whole photo, EXIF orientation applied, landscape turned upright so the border runs along the BOTTOM (side = where the border
# is in the landscape shot: L → turned 90° anticlockwise, R → 90° clockwise), longest side 2400px, JPEG q88
# → assets/images/<slug>-blouse.jpg. Then: node _tools/add-blouse-day1.cjs
# Folders with no blouse shot: kattha 014, aasmaan 004, kamal 005, moti 010, mehfil 045, firoza 048; Megh 022 has no folder.
# Run from homepage/:  powershell -File _tools/blouse-day1.ps1
param([string]$Root = 'G:\My Drive\Stylish Naari – Saree Photography\01 – Banarasi')
Add-Type -AssemblyName System.Drawing
$OUT = (Resolve-Path 'assets\images').Path
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
function Save-Jpeg($bmp, $dst, [long]$q) { $p = New-Object System.Drawing.Imaging.EncoderParameters 1; $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $q; $bmp.Save($dst, $enc, $p) }
function Orient($im) {
  if ($im.PropertyIdList -notcontains 0x0112) { return }
  $o = [int]$im.GetPropertyItem(0x0112).Value[0]
  $map = @{ 2 = 'RotateNoneFlipX'; 3 = 'Rotate180FlipNone'; 4 = 'Rotate180FlipX'; 5 = 'Rotate90FlipX'; 6 = 'Rotate90FlipNone'; 7 = 'Rotate270FlipX'; 8 = 'Rotate270FlipNone' }
  if ($map.ContainsKey($o)) { $im.RotateFlip([System.Drawing.RotateFlipType]$map[$o]) } }

# slug, range folder, SN, camera file, border side in the landscape shot
$S = @(
  @('sosan',     'Premium Silk', '001', '_DSC', '05', 'L'),
  @('kajal',     'Premium Silk', '002', '_DSC4619', '', 'L'),
  @('sawari',    'Premium Silk', '003', '_DSC', '05', 'L'),
  @('moonga',    'Premium Silk', '006', '_DSC4771', '', 'R'),
  @('rani',      'Premium Silk', '007', '_DSC', '05', 'R'),
  @('mor',       'Premium Silk', '008', '_DSC', '05', 'L'),
  @('mangal',    'Premium Silk', '011', '_DSC4588', '', 'L'),
  @('ambi',      'Premium Silk', '012', '_DSC', '05', 'L'),
  @('phalsa',    'Premium Silk', '013', '_DSC4629', '', 'L'),
  @('basant',    'Premium Silk', '019', '_DSC', '05', 'L'),
  @('mishri',    'Premium Silk', '020', '_DSC', '05', 'L'),
  @('taal',      'Premium Silk', '021', '_DSC', '05', 'R'),
  @('panna',     'Premium Silk', '023', '_DSC4656', '', 'R'),
  @('gulistan',  'Premium Silk', '025', '_DSC', '05', 'L'),
  @('bahaar',    'Premium Silk', '026', '_DSC', '05', 'L'),
  @('palash',    'Premium Silk', '027', '_DSC', '04', 'R'),
  @('shringaar', 'Premium Silk', '028', '_DSC', '05', 'L'),
  @('kasni',     'Premium Silk', '029', '_DSC4685', '', 'R'),
  @('chameli',   'Premium Silk', '032', '_DSC4550', '', 'R'),
  @('airavat',   'Premium Silk', '033', '_DSC', '05', 'L'),
  @('mehendi',   'Premium Silk', '034', '_DSC4577', '', 'L'),
  @('haldi',     'Premium Silk', '035', '_DSC', '05', 'L'),
  @('khus',      'Premium Silk', '036', '_DSC', '05', 'L'),
  @('shagun',    'Premium Silk', '038', '_DSC', '05', 'R'),
  @('neem',      'Premium Semi-Silk', '082', '_SKS', '05', 'L'),
  # "2day" re-check (client, 19 Nov 2026; Drive folder 1L5IGCyCFQ88OFCj1s1ko-PJslqcQKIDP): these blouse pieces have a
  # different weave from the saree, so the first pass (add-blouse.cjs) missed them. 2day folder → the same photo in the SN folder:
  # Surmai 53/6, Jaswand 55/5, Saunf 64/5, Khubani 75/4.
  @('surmai',    'Premium Semi-Silk', '057', '_DSC', '05', 'L'),
  @('jaswand',   'Premium Semi-Silk', '061', '_DSC', '05', 'L'),
  @('saunf',     'Premium Semi-Silk', '062', '_DSC', '05', 'L'),
  @('khubani',   'Premium Semi-Silk', '053', '_DSC', '04', 'L')
)
$log = @()
foreach ($s in $S) {
  $slug, $range, $sn, $cam, $num, $side = $s
  $base = Join-Path $Root "$range\Original Product Photos – Pendrive"
  $dir = Get-ChildItem -LiteralPath $base -Directory | Where-Object { $_.Name -like "SN-$sn *" } | Select-Object -First 1
  # either an exact camera file, or "photo number NN" in an SN folder with one colourway
  $src = Get-ChildItem -LiteralPath $dir.FullName -File | Where-Object {
    if ($num) { $_.Name -match "^SN-$sn – $num( |\.| –)" } else { $_.Name -like "*$cam.JPG" } } | Select-Object -First 1
  if (-not $src) { throw "missing $slug SN-$sn $cam $num" }
  $im = [System.Drawing.Image]::FromFile($src.FullName); Orient $im
  if ($im.Width -gt $im.Height) {
    if ($side -eq 'L') { $im.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) } else { $im.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
  }
  $sc = [math]::Min(1.0, 2400.0 / [math]::Max($im.Width, $im.Height)); $w = [int][math]::Round($im.Width * $sc); $h = [int][math]::Round($im.Height * $sc)
  $b = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($b); $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality; $g.DrawImage($im, 0, 0, $w, $h); $g.Dispose()
  Save-Jpeg $b "$OUT\$slug-blouse.jpg" 88
  $b.Dispose(); $im.Dispose()
  $log += [pscustomobject]@{ slug = $slug; source = "$range / Original Product Photos – Pendrive / $($src.BaseName)"; width = $w; height = $h }
  "{0,-10} {1}  {2}x{3}" -f $slug, $src.Name, $w, $h
}
$log | ConvertTo-Json | Set-Content -Encoding utf8 '_tools\blouse-day1.json'
