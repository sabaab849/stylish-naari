# Gives the three SN-002 lion-motif model photos (Kajal, Kishmish, Gulmohar) room above the head (client, 20 Nov 2026).
# The photos are 1024x1536 with the hair ~55px from the top edge, and the 3:4 window already used the full width, so a
# crop could not add space. This widens the canvas with the photo's own studio backdrop: 72px on top and 54px on each
# side, filled from the edge pixels softened along the edge (no streaks), so the 3:4 window can sit lower in the frame.
# The photo itself is untouched. Output: assets/images/<name>-space.jpg (1132x1608, JPEG q95).
# Then: node _tools/set-lion-space.cjs.  Run from homepage/:  powershell -File _tools/pad-lion-models.ps1
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class Pad {
  // mean of n edge pixels along one line, then a box blur of radius r along the edge
  static double[,] Smooth(double[,] v, int len, int r) {
    var o = new double[len, 3];
    for (int i = 0; i < len; i++) for (int c = 0; c < 3; c++) {
      double s = 0; int k = 0;
      for (int j = Math.Max(0, i - r); j <= Math.Min(len - 1, i + r); j++) { s += v[j, c]; k++; }
      o[i, c] = s / k;
    }
    return o;
  }
  public static Bitmap Run(Bitmap src, int top, int side) {
    int W = src.Width, H = src.Height, NW = W + 2 * side, NH = H + top;
    var a = new byte[W * H * 3];
    var d = src.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
    for (int y = 0; y < H; y++) Marshal.Copy(d.Scan0 + y * d.Stride, a, y * W * 3, W * 3);
    src.UnlockBits(d);
    var b = new byte[NW * NH * 3];
    Func<int, int, int, byte> at = (x, y, c) => a[(y * W + x) * 3 + c];
    // 1. the photo
    for (int y = 0; y < H; y++) Array.Copy(a, y * W * 3, b, ((y + top) * NW + side) * 3, W * 3);
    // 2. sides: per row, mean of the 6 edge columns, smoothed down the edge
    const int n = 6;
    for (int s = 0; s < 2; s++) {
      var v = new double[H, 3];
      for (int y = 0; y < H; y++) for (int c = 0; c < 3; c++) { double t = 0; for (int i = 0; i < n; i++) t += at(s == 0 ? i : W - 1 - i, y, c); v[y, c] = t / n; }
      var m = Smooth(v, H, 3); // short, so the wall / carpet line stays crisp
      for (int y = 0; y < H; y++) for (int x = 0; x < side; x++) for (int c = 0; c < 3; c++) {
        int bx = s == 0 ? x : NW - 1 - x;
        // blend from the smoothed colour (outer) to the raw edge colour (next to the photo) over the inner 12px
        double w = Math.Max(0, (x - (side - 12)) / 12.0);
        double raw = at(s == 0 ? 0 : W - 1, y, c);
        b[((y + top) * NW + bx) * 3 + c] = (byte)Math.Round(m[y, c] * (1 - w) + raw * w);
      }
    }
    // 3. top: per column of the widened image, mean of its top 6 rows, smoothed along the edge
    {
      var v = new double[NW, 3];
      for (int x = 0; x < NW; x++) for (int c = 0; c < 3; c++) { double t = 0; for (int i = 0; i < n; i++) t += b[((top + i) * NW + x) * 3 + c]; v[x, c] = t / n; }
      var m = Smooth(v, NW, 30);
      for (int y = 0; y < top; y++) for (int x = 0; x < NW; x++) for (int c = 0; c < 3; c++) {
        // the last 10 rows above the photo ease from the smoothed colour into the photo's own top row
        double w = Math.Max(0, (y - (top - 10)) / 10.0);
        b[(y * NW + x) * 3 + c] = (byte)Math.Round(m[x, c] * (1 - w) + v[x, c] * w);
      }
    }
    var o = new Bitmap(NW, NH, PixelFormat.Format24bppRgb);
    var e = o.LockBits(new Rectangle(0, 0, NW, NH), ImageLockMode.WriteOnly, PixelFormat.Format24bppRgb);
    for (int y = 0; y < NH; y++) Marshal.Copy(b, y * NW * 3, e.Scan0 + y * e.Stride, NW * 3);
    o.UnlockBits(e);
    return o;
  }
}
'@
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 95L
$dir = Resolve-Path 'assets\images'
# superseded: the seated model photos need no padding (20 Nov 2026)
foreach ($name in @()) {
  $im = [System.Drawing.Image]::FromFile("$dir\$name.jpg")
  $bm = New-Object System.Drawing.Bitmap $im
  $out = [Pad]::Run($bm, 72, 54)
  $out.Save("$dir\$name-space.jpg", $enc, $p)
  "{0}.jpg {1}x{2} -> {0}-space.jpg {3}x{4}" -f $name, $im.Width, $im.Height, $out.Width, $out.Height
  $out.Dispose(); $bm.Dispose(); $im.Dispose()
}
