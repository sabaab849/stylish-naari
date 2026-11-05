# Draws each outline from outlines.json over its photo (half size) on one sheet, to check the trace by eye.
param([string]$out)
Add-Type -AssemblyName System.Drawing
$dir = Split-Path $MyInvocation.MyCommand.Path
$src = Join-Path (Split-Path (Split-Path (Split-Path $dir))) 'model photography'
$cfg = Get-Content (Join-Path $dir 'outlines.json') -Raw | ConvertFrom-Json
$names = $cfg.PSObject.Properties.Name
$sheet = New-Object System.Drawing.Bitmap (610 * $names.Count), 830
$g = [System.Drawing.Graphics]::FromImage($sheet); $g.Clear([System.Drawing.Color]::White)
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 0, 255, 0)), 3
$font = New-Object System.Drawing.Font 'Segoe UI', 14
$i = 0
foreach ($n in $names) {
  $c = $cfg.$n; $img = [System.Drawing.Image]::FromFile((Join-Path $src $c.file))
  $x0 = $i * 610; $g.DrawImage($img, $x0, 0, 600, 800)
  $p = $c.pts | ForEach-Object { New-Object System.Drawing.PointF (($x0 + $_[0] / 2), ($_[1] / 2)) }
  $g.DrawPolygon($pen, [System.Drawing.PointF[]]$p)
  $g.DrawString($n, $font, [System.Drawing.Brushes]::Black, $x0 + 4, 803); $img.Dispose(); $i++
}
$sheet.Save($out); "ok"
