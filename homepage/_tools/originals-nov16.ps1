# Original product photos for the 25 November 16 sarees (gallery slides 2–4), from the Drive folder
# "Original Product Photos - Pendrive" (SN-001 … SN-049, one folder per saree; files "SN-0xx – NN – _DSCxxxx.JPG").
# Run from homepage/:  powershell -File _tools/originals-nov16.ps1 -Src <folder with the downloaded photos>
#   <Src>\prim\<sn>.jpg        the "01 (primary)" photo, downloaded at 2400 px (drive.google.com/thumbnail?id=…&sz=w2400)
#   <Src>\full\<sn>-<nn>.jpg   the chosen print and border shots, same size
# Writes assets/images/<slug>-original.jpg (primary, unedited, longest side 1800), <slug>-print.jpg and <slug>-border.jpg.
#   print  = the WHOLE Drive shot of the print, uncut, so the print reads as a whole, not one motif (client, Nov 16)
#   border = the WHOLE Drive shot that shows the border beside the saree's print (longest side 1800), never cut, shown whole
#            in the gallery (client, Nov 16: a crop of the border alone, without the print, "doesn't look right"; the
#            shots of the border beside plain cloth / the blouse piece are not used)
# On print and border the black studio backdrop that touches the edge is replaced by the page ivory (#F6F1EA,
# --color-bg) with a soft edge; the cloth is untouched. "nofill": dark cloth that would match the backdrop, left as shot.
# Megh (SN-022) has no Drive folder: its primary is catalogue/sn-022.jpg and its print is cut from the WhatsApp photo
# images/images/extra_photo_030.jpg; it has NO border image (border images come from the Drive photos only).
param([string]$Src)
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices; using System.Collections.Generic;
public static class Orig {
  static ImageCodecInfo Jpeg() { foreach (var c in ImageCodecInfo.GetImageEncoders()) if (c.MimeType == "image/jpeg") return c; return null; }
  public static void Save(Bitmap b, string dst) { var p = new EncoderParameters(1); p.Param[0] = new EncoderParameter(Encoder.Quality, 88L); b.Save(dst, Jpeg(), p); }
  // Primary: resize only (longest side max), no edits.
  public static string Primary(string src, string dst, int max) {
    using (var im = Image.FromFile(src)) {
      double s = Math.Min(1.0, (double)max / Math.Max(im.Width, im.Height)); int w = (int)Math.Round(im.Width * s), h = (int)Math.Round(im.Height * s);
      using (var b = new Bitmap(w, h)) using (var g = Graphics.FromImage(b)) {
        g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic; g.DrawImage(im, 0, 0, w, h); Save(b, dst);
        var c = b.GetPixel(4, 4); return w + "x" + h + " #" + c.R.ToString("X2") + c.G.ToString("X2") + c.B.ToString("X2"); } } }
  // Close-up: crop a 3:4 window (x, y, w as shares of the photo; h follows) or, with fw <= 0, the whole photo;
  // resize to outW (longest side for a whole photo); replace the edge-connected backdrop.
  public static string Detail(string src, string dst, double fx, double fy, double fw, int outW, int bgR, int bgG, int bgB, bool fill) {
    using (var im = Image.FromFile(src)) {
      int cw, ch, cx, cy, ow, oh;
      if (fw <= 0) {
        cw = im.Width; ch = im.Height; cx = 0; cy = 0;
        double s = Math.Min(1.0, (double)outW / Math.Max(cw, ch)); ow = (int)Math.Round(cw * s); oh = (int)Math.Round(ch * s);
      } else {
        cw = (int)Math.Round(fw * im.Width); ch = (int)Math.Round(cw * 4.0 / 3.0);
        if (ch > im.Height) { ch = im.Height; cw = (int)Math.Round(ch * 0.75); }
        cx = (int)Math.Round(fx * im.Width); cy = (int)Math.Round(fy * im.Height);
        cx = Math.Max(0, Math.Min(cx, im.Width - cw)); cy = Math.Max(0, Math.Min(cy, im.Height - ch));
        ow = Math.Min(outW, cw); oh = (int)Math.Round(ow * 4.0 / 3.0);
      }
      var b = new Bitmap(ow, oh, PixelFormat.Format24bppRgb);
      using (var g = Graphics.FromImage(b)) { g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
        g.DrawImage(im, new Rectangle(0, 0, ow, oh), new Rectangle(cx, cy, cw, ch), GraphicsUnit.Pixel); }
      var d = b.LockBits(new Rectangle(0, 0, ow, oh), ImageLockMode.ReadWrite, PixelFormat.Format24bppRgb);
      int st = d.Stride; var px = new byte[st * oh]; Marshal.Copy(d.Scan0, px, 0, px.Length);
      Func<int, int, bool> dark = (x, y) => { int i = y * st + x * 3; int bl = px[i], gr = px[i + 1], r = px[i + 2];
        int mx = Math.Max(r, Math.Max(gr, bl)), mn = Math.Min(r, Math.Min(gr, bl)); return mx < 58 && mx - mn < 26; };
      var m = new float[ow * oh]; var q = new Queue<int>();
      for (int x = 0; x < ow; x++) { foreach (int y in new[] { 0, oh - 1 }) if (dark(x, y) && m[y * ow + x] == 0) { m[y * ow + x] = 1; q.Enqueue(y * ow + x); } }
      for (int y = 0; y < oh; y++) { foreach (int x in new[] { 0, ow - 1 }) if (dark(x, y) && m[y * ow + x] == 0) { m[y * ow + x] = 1; q.Enqueue(y * ow + x); } }
      while (q.Count > 0) { int k = q.Dequeue(), x = k % ow, y = k / ow;
        int[] nx = { x - 1, x + 1, x, x }, ny = { y, y, y - 1, y + 1 };
        for (int j = 0; j < 4; j++) { if (nx[j] < 0 || ny[j] < 0 || nx[j] >= ow || ny[j] >= oh) continue; int n = ny[j] * ow + nx[j];
          if (m[n] == 0 && dark(nx[j], ny[j])) { m[n] = 1; q.Enqueue(n); } } }
      if (!fill) Array.Clear(m, 0, m.Length);
      int count = 0; foreach (var v in m) if (v > 0) count++;
      // grow by 2 px (shadow fringe), then soften with two 5×5 box passes
      for (int pass = 0; pass < 2; pass++) { var t = (float[])m.Clone();
        for (int y = 1; y < oh - 1; y++) for (int x = 1; x < ow - 1; x++) if (m[y * ow + x] == 0 && (m[y * ow + x - 1] > 0 || m[y * ow + x + 1] > 0 || m[(y - 1) * ow + x] > 0 || m[(y + 1) * ow + x] > 0)) t[y * ow + x] = 1;
        m = t; }
      for (int pass = 0; pass < 2; pass++) { var t = new float[m.Length];
        for (int y = 0; y < oh; y++) for (int x = 0; x < ow; x++) { float s = 0; int c = 0;
          for (int dy = -2; dy <= 2; dy++) for (int dx = -2; dx <= 2; dx++) { int xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= ow || yy >= oh) continue; s += m[yy * ow + xx]; c++; }
          t[y * ow + x] = s / c; }
        m = t; }
      if (count > 0) for (int y = 0; y < oh; y++) for (int x = 0; x < ow; x++) { float a = m[y * ow + x]; if (a <= 0) continue; int i = y * st + x * 3;
        px[i] = (byte)(px[i] + (bgB - px[i]) * a); px[i + 1] = (byte)(px[i + 1] + (bgG - px[i + 1]) * a); px[i + 2] = (byte)(px[i + 2] + (bgR - px[i + 2]) * a); }
      Marshal.Copy(px, 0, d.Scan0, px.Length); b.UnlockBits(d); Save(b, dst); b.Dispose();
      return ow + "x" + oh + " backdrop " + (100.0 * count / (ow * oh)).ToString("0.0") + "%"; } }
}
"@

# slug, SN, print shot, print window (x, y, w), border shot (whole), [nofill]
$S = @(
  @('kattha','014','014-03',@(0,0,0),'014-02'),
  @('sosan','001','001-04',@(0,0,0),'001-03'),
  @('khus','036','036-02',@(0,0,0),'036-03'),
  @('haldi','035','035-03',@(0,0,0),'035-02'),
  @('rani','007','007-04',@(0,0,0),'007-02'),
  @('sawari','003','003-04',@(0,0,0),'003-03'),
  @('taal','021','021-02',@(0,0,0),'021-03','nofill'),
  @('shabnam','032','032-03',@(0,0,0),'032-02'),
  @('mor','008','008-03',@(0,0,0),'008-02','nofill'),
  @('palash','027','027-02',@(0,0,0),'027-03'),
  @('mehfil','045','045-03',@(0,0,0),'045-02'),
  @('mishri','020','020-03',@(0,0,0),'020-02'),
  @('ambi','012','012-04',@(0,0,0),'012-03'),
  @('bahaar','026','026-04',@(0,0,0),'026-03'),
  @('shagun','038','038-03',@(0,0,0),'038-02'),
  @('mangal','011','011-04',@(0,0,0),'011-03'),
  @('aasmaan','004','004-04',@(0,0,0),'004-03'),
  @('airavat','033','033-03',@(0,0,0),'033-02'),
  @('shringaar','028','028-03',@(0,0,0),'028-02'),
  @('firoza','048','048-03',@(0,0,0),'048-02'),
  @('gulistan','025','025-03',@(0,0,0),'025-02'),
  @('basant','019','019-04',@(0,0,0),'019-03'),
  @('chaman','006','006-03',@(0,0,0),'006-02'),
  @('moti','010','010-02',@(0,0,0),'010-03')
)
$img = (Resolve-Path 'assets\images').Path
# these sarees' slugs, for the upright step (taken before the loop: PowerShell names ignore case, so $s would overwrite $S)
$mine = @($S | ForEach-Object { $_[0] }) + 'megh'
foreach ($s in $S) {
  $slug, $sn, $pf, $pw, $bf, $opt = $s; $fill = $opt -ne 'nofill'
  "{0,-10} original {1}" -f $slug, [Orig]::Primary("$Src\prim\$sn.jpg", "$img\$slug-original.jpg", 1800)
  "{0,-10} print    {1}" -f $slug, [Orig]::Detail("$Src\full\$pf.jpg", "$img\$slug-print.jpg", 0, 0, 0, 1800, 0xF6, 0xF1, 0xEA, $fill)
  "{0,-10} border   {1}" -f $slug, [Orig]::Detail("$Src\full\$bf.jpg", "$img\$slug-border.jpg", 0, 0, 0, 1800, 0xF6, 0xF1, 0xEA, $fill)
}
# Megh (SN-022): local photos only, no border image
$wa = (Resolve-Path '..\images\images\extra_photo_030.jpg').Path
"megh       original " + [Orig]::Primary((Resolve-Path 'assets\images\catalogue\sn-022.jpg').Path, "$img\megh-original.jpg", 1800)
"megh       print    " + [Orig]::Detail($wa, "$img\megh-print.jpg", 0.1, 0.05, 0.8, 1800, 0xF6, 0xF1, 0xEA, $true)
if (Test-Path "$img\megh-border.jpg") { Remove-Item "$img\megh-border.jpg" }
# Upright (client, Nov 16): a landscape folded or border shot left wide bands above and below it in the portrait
# gallery frame, so every landscape original / border photo is turned 90° clockwise to portrait. Safe to re-run.
foreach ($f in Get-ChildItem $img -File | Where-Object { $_.Name -match '^[a-z]+-(original|border|print)\.jpg$' -and ($mine -contains ($_.Name -replace '-(original|border|print)\.jpg$', '')) }) {
  $im = [System.Drawing.Image]::FromFile($f.FullName)
  if ($im.Width -gt $im.Height) {
    $bm = New-Object System.Drawing.Bitmap $im; $im.Dispose(); $bm.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
    [Orig]::Save($bm, $f.FullName); "{0,-24} turned upright {1}x{2}" -f $f.Name, $bm.Width, $bm.Height; $bm.Dispose()
  } else { $im.Dispose() }
}
