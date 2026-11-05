# Removes the background from the five product photos, at full resolution, entirely on this computer.
#   1. Everything outside the traced outline (outlines.json) is background.
#   2. Inside the outline, a fill runs inward from the edge through pixels that look like the floor or sheet
#      (low colour, light), up to `band` px deep, so the cut follows the cloth instead of the straight trace.
#      Fabric is never crossed: the fill stops at the first coloured pixel.
#   3. A one-pixel feather softens the edge.
# Writes cutouts/<slug>.png (transparent master) and assets/images/<slug>-product.jpg (on the site ivory).
param([string]$only = '')
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Collections.Generic; using System.Runtime.InteropServices;
public static class Cut {
  public static Bitmap Run(Bitmap src, PointF[] poly, int maxChroma, int minLum, int band) {
    int W = src.Width, H = src.Height, N = W * H;
    // inside-outline mask
    var m = new Bitmap(W, H, PixelFormat.Format24bppRgb);
    using (var g = Graphics.FromImage(m)) { g.Clear(Color.Black); g.FillPolygon(Brushes.White, poly); }
    int ms; byte[] mask = Bytes(m, out ms); m.Dispose();
    var s32 = new Bitmap(W, H, PixelFormat.Format32bppArgb);
    using (var g = Graphics.FromImage(s32)) g.DrawImage(src, 0, 0, W, H);
    int ss; byte[] px = Bytes(s32, out ss);
    var keep = new bool[N]; var dist = new int[N]; var q = new Queue<int>();
    for (int y = 0; y < H; y++) for (int x = 0; x < W; x++) {
      int i = y * W + x; keep[i] = mask[y * ms + x * 3] > 127; dist[i] = -1;
      if (!keep[i]) { dist[i] = 0; q.Enqueue(i); }
    }
    // also seed from the image frame, so background touching the edge is reachable
    while (q.Count > 0) {
      int i = q.Dequeue(); int x = i % W, y = i / W;
      int[] nb = { i - 1, i + 1, i - W, i + W };
      for (int k = 0; k < 4; k++) {
        int j = nb[k]; if (j < 0 || j >= N) continue; if (k == 0 && x == 0) continue; if (k == 1 && x == W - 1) continue;
        if (dist[j] >= 0) continue;
        if (dist[i] + 1 > band) continue;
        int o = (j / W) * ss + (j % W) * 4; int b = px[o], gg = px[o + 1], r = px[o + 2];
        int mx = Math.Max(r, Math.Max(gg, b)), mn = Math.Min(r, Math.Min(gg, b));
        int lum = (r * 299 + gg * 587 + b * 114) / 1000;
        if (mx - mn <= maxChroma && lum >= minLum) { dist[j] = dist[i] + 1; keep[j] = false; q.Enqueue(j); }
      }
    }
    // keep only the largest connected piece (the saree); detached flecks of floor or sheet are dropped
    var lab = new int[N]; int best = 0, bestSize = 0, cur = 0; var st = new Stack<int>();
    for (int p0 = 0; p0 < N; p0++) {
      if (!keep[p0] || lab[p0] != 0) continue;
      cur++; int size = 0; st.Push(p0); lab[p0] = cur;
      while (st.Count > 0) { int i = st.Pop(); size++; int x = i % W;
        if (x > 0 && keep[i - 1] && lab[i - 1] == 0) { lab[i - 1] = cur; st.Push(i - 1); }
        if (x < W - 1 && keep[i + 1] && lab[i + 1] == 0) { lab[i + 1] = cur; st.Push(i + 1); }
        if (i >= W && keep[i - W] && lab[i - W] == 0) { lab[i - W] = cur; st.Push(i - W); }
        if (i + W < N && keep[i + W] && lab[i + W] == 0) { lab[i + W] = cur; st.Push(i + W); } }
      if (size > bestSize) { bestSize = size; best = cur; } }
    for (int i = 0; i < N; i++) if (keep[i] && lab[i] != best) keep[i] = false;
    // feather: alpha = share of keep in a 3x3 neighbourhood
    var outp = new byte[ss * H];
    for (int y = 0; y < H; y++) for (int x = 0; x < W; x++) {
      int c = 0, t = 0;
      for (int dy = -1; dy <= 1; dy++) for (int dx = -1; dx <= 1; dx++) { int xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; t++; if (keep[yy * W + xx]) c++; }
      int o = y * ss + x * 4; outp[o] = px[o]; outp[o + 1] = px[o + 1]; outp[o + 2] = px[o + 2];
      outp[o + 3] = (byte)(keep[y * W + x] ? (c == t ? 255 : 255 * c / t) : (c * 255 / t / 3));
    }
    var res = new Bitmap(W, H, PixelFormat.Format32bppArgb);
    var d = res.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
    Marshal.Copy(outp, 0, d.Scan0, outp.Length); res.UnlockBits(d); s32.Dispose();
    return res;
  }
  static byte[] Bytes(Bitmap b, out int stride) {
    var d = b.LockBits(new Rectangle(0, 0, b.Width, b.Height), ImageLockMode.ReadOnly, b.PixelFormat);
    stride = d.Stride; var a = new byte[d.Stride * b.Height]; Marshal.Copy(d.Scan0, a, 0, a.Length); b.UnlockBits(d); return a;
  }
}
'@
$dir = Split-Path $MyInvocation.MyCommand.Path
$root = Split-Path (Split-Path $dir)
$src = Join-Path (Split-Path $root) 'model photography'
$cfg = Get-Content (Join-Path $dir 'outlines.json') -Raw | ConvertFrom-Json
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | ? { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1; $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
$ivory = [System.Drawing.ColorTranslator]::FromHtml('#F7F2EC')
foreach ($n in $cfg.PSObject.Properties.Name) {
  if ($only -and $n -ne $only) { continue }
  $c = $cfg.$n
  $img = New-Object System.Drawing.Bitmap (Join-Path $src $c.file)
  $poly = [System.Drawing.PointF[]]($c.pts | ForEach-Object { New-Object System.Drawing.PointF $_[0], $_[1] })
  $cut = [Cut]::Run($img, $poly, [int]$c.chroma, [int]$c.lum, [int]$c.band)
  $cut.Save((Join-Path $dir "$n.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $flat = New-Object System.Drawing.Bitmap $cut.Width, $cut.Height
  $g = [System.Drawing.Graphics]::FromImage($flat); $g.Clear($ivory); $g.DrawImage($cut, 0, 0, $cut.Width, $cut.Height); $g.Dispose()
  $flat.Save((Join-Path $root "assets\images\$n-product.jpg"), $codec, $ep)
  "{0,-8} {1}x{2}  png {3:N1}MB  jpg {4}KB" -f $n, $cut.Width, $cut.Height, ((Get-Item (Join-Path $dir "$n.png")).Length/1MB), [int]((Get-Item (Join-Path $root "assets\images\$n-product.jpg")).Length/1KB)
  $img.Dispose(); $cut.Dispose(); $flat.Dispose()
}
