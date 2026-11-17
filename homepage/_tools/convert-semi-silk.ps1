# Photos for the 25 Premium Semi-Silk sarees (added 16 Nov 2026, _tools/add-semi-silk.cjs).
# Run from homepage/:  powershell -File _tools/convert-semi-silk.ps1
#   Model photographs: model photography/premium silk ai photography/*.png (same files as the Drive folder
#     01 – Banarasi/Premium Semi-Silk/AI Model Photography) → assets/images/<slug>.jpg, full size, JPEG q92, no edits.
#   Gallery slides 2–4: Drive (G:) 01 – Banarasi/Premium Semi-Silk/Original Product Photos – Pendrive/SN-0xx – …/
#     "SN-0xx – NN – _DSCxxxx.JPG" → <slug>-original.jpg (slide 2, the SN's own photo), <slug>-print.jpg and <slug>-border.jpg
#     (slides 3–4, a print close-up and a different view). The whole photo, never cropped: the camera's EXIF orientation is
#     applied, then a landscape photo is turned upright (90° clockwise) so it fills the portrait gallery frame without bars;
#     longest side 2400 px, JPEG q88.
param([string]$Drive = 'G:\My Drive\Stylish Naari – Saree Photography\01 – Banarasi\Premium Semi-Silk\Original Product Photos – Pendrive')
Add-Type -AssemblyName System.Drawing
$AI = (Resolve-Path '..\model photography\premium silk ai photography').Path
$OUT = (Resolve-Path 'assets\images').Path
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
function Save-Jpeg($bmp, $dst, [long]$q) { $p = New-Object System.Drawing.Imaging.EncoderParameters 1; $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $q; $bmp.Save($dst, $enc, $p) }
function Flatten($im, [int]$w, [int]$h) { # draw onto an opaque RGB canvas (PNG alpha → white), resized
  $b = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($b); $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($im, 0, 0, $w, $h); $g.Dispose(); return $b }
function Orient($im) { # apply EXIF orientation (tag 0x0112)
  if ($im.PropertyIdList -notcontains 0x0112) { return }
  $o = [int]$im.GetPropertyItem(0x0112).Value[0]
  $map = @{ 2 = 'RotateNoneFlipX'; 3 = 'Rotate180FlipNone'; 4 = 'Rotate180FlipX'; 5 = 'Rotate90FlipX'; 6 = 'Rotate90FlipNone'; 7 = 'Rotate270FlipX'; 8 = 'Rotate270FlipNone' }
  if ($map.ContainsKey($o)) { $im.RotateFlip([System.Drawing.RotateFlipType]$map[$o]) } }

# slug, model photo, SN, [slide 2, slide 3 (print), slide 4 (different view)] = the NN in the Drive file names
$S = @(
  @('surmai',    'Elegant Gold and Silver Saree Portrait 1.png',           '057', @('01','02','03')),
  @('zamurrad',  'Elegant Green Saree Studio Portrait 1.png',              '066', @('01','04','05')),
  @('shahtoot',  'Elegant Magenta Saree Portrait (2) 1.png',               '076', @('01','03','02')),
  @('khubani',   'Elegant Peach Floral Saree Portrait 1.png',              '053', @('01','02','03')),
  @('kachnar',   'Elegant Pink Saree Portrait 1.png',                      '071', @('01','03','02')),
  @('jharokha',  'Elegant Red Saree Botanical Portrait 1.png',             '050', @('01','04','02')),
  @('gunja',     'Elegant Red Saree Portrait (1) 1.png',                   '070', @('01','04','03')),
  @('gulbahar',  'Elegant Red Saree in Arched Studio Setting 1.png',       '055', @('01','03','02')),
  @('jaswand',   'Elegant Saree Portrait by Lotus Bowl 1.png',             '061', @('01','04','03')),
  @('tulsi',     'Emerald Saree Marigold Portrait 1.png',                  '054', @('01','05','06')),
  @('tesu',      'Golden Orange Saree Editorial Portrait 1.png',           '078', @('01','03','02')),
  @('mitti',     'Golden Saree Portrait in an Ochre Interior 1.png',       '056', @('01','04','03')),
  @('kokum',     'Graceful Magenta Sari Profile 1.png',                    '080', @('01','04','03')),
  @('amavas',    'Heritage Elegance in Embroidered Black Saree 1.png',     '074', @('01','03','04')),
  @('shikara',   'Heritage Temple Saree Portrait 1.png',                   '083', @('01','02','03')),
  @('saunf',     'Model 01 in Olive Silk Elegance 1.png',                  '062', @('02','03','04')),
  @('neem',      'Modern Muse in Emerald Silk 1.png',                      '082', @('01','03','04')),
  @('sitara',    'Modern Muse in Navy Saree 1.png',                        '065', @('01','04','05')),
  @('gulaal',    'Modern Muse in a Red Sari 1.png',                        '077', @('01','04','03')),
  @('aparajita', 'Royal Blue Sari in a Botanical Studio 1.png',            '081', @('01','02','03')),
  @('banafsha',  'Royal Purple Silk Saree Portrait (1) 1.png',             '068', @('01','03','05')),
  @('kumud',     'Serene Lotus Pond Saree Portrait 1.png',                 '079', @('01','02','03')),
  @('maina',     'Serene Magenta Saree Portrait 1.png',                    '052', @('01','04','08')),
  @('pudina',    'Serene Sage-Green Saree Portrait 1.png',                 '072', @('01','03','04')),
  @('laali',     'Timeless Coral Saree Elegance 1.png',                    '064', @('01','03','04'))
)
$kinds = @('original', 'print', 'border')
foreach ($s in $S) {
  $slug, $file, $sn, $nn = $s
  $im = [System.Drawing.Image]::FromFile((Join-Path $AI $file))
  $b = Flatten $im $im.Width $im.Height; Save-Jpeg $b "$OUT\$slug.jpg" 92
  $line = "{0,-10} model {1}x{2}" -f $slug, $im.Width, $im.Height; $b.Dispose(); $im.Dispose()
  $dir = Get-ChildItem -LiteralPath $Drive -Directory | Where-Object { $_.Name -like "SN-$sn *" } | Select-Object -First 1
  for ($k = 0; $k -lt 3; $k++) {
    $src = Get-ChildItem -LiteralPath $dir.FullName -File | Where-Object { $_.Name -like "SN-$sn – $($nn[$k])*" } | Select-Object -First 1
    if (-not $src) { throw "missing SN-$sn $($nn[$k])" }
    $im = [System.Drawing.Image]::FromFile($src.FullName); Orient $im
    $turned = $im.Width -gt $im.Height; if ($turned) { $im.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
    $sc = [math]::Min(1.0, 2400.0 / [math]::Max($im.Width, $im.Height)); $w = [int][math]::Round($im.Width * $sc); $h = [int][math]::Round($im.Height * $sc)
    $b = Flatten $im $w $h; Save-Jpeg $b "$OUT\$slug-$($kinds[$k]).jpg" 88
    $line += " | {0} {1} {2}x{3}{4}" -f $kinds[$k], $nn[$k], $w, $h, $(if ($turned) { ' turned' } else { '' })
    $b.Dispose(); $im.Dispose()
  }
  $line
}
