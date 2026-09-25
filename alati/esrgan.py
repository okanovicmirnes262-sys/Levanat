# Minimalna implementacija RRDBNet (Real-ESRGAN x4plus) za CPU upscaling.
import sys, torch, torch.nn as nn, torch.nn.functional as F, numpy as np
from PIL import Image

class RDB(nn.Module):
    def __init__(s, nf=64, gc=32):
        super().__init__()
        s.conv1 = nn.Conv2d(nf, gc, 3, 1, 1); s.conv2 = nn.Conv2d(nf+gc, gc, 3, 1, 1)
        s.conv3 = nn.Conv2d(nf+2*gc, gc, 3, 1, 1); s.conv4 = nn.Conv2d(nf+3*gc, gc, 3, 1, 1)
        s.conv5 = nn.Conv2d(nf+4*gc, nf, 3, 1, 1); s.l = nn.LeakyReLU(0.2, True)
    def forward(s, x):
        x1 = s.l(s.conv1(x)); x2 = s.l(s.conv2(torch.cat((x, x1), 1)))
        x3 = s.l(s.conv3(torch.cat((x, x1, x2), 1))); x4 = s.l(s.conv4(torch.cat((x, x1, x2, x3), 1)))
        return s.conv5(torch.cat((x, x1, x2, x3, x4), 1)) * 0.2 + x

class RRDB(nn.Module):
    def __init__(s, nf=64):
        super().__init__(); s.rdb1 = RDB(nf); s.rdb2 = RDB(nf); s.rdb3 = RDB(nf)
    def forward(s, x): return s.rdb3(s.rdb2(s.rdb1(x))) * 0.2 + x

class RRDBNet(nn.Module):
    def __init__(s, nf=64, nb=23):
        super().__init__()
        s.conv_first = nn.Conv2d(3, nf, 3, 1, 1)
        s.body = nn.Sequential(*[RRDB(nf) for _ in range(nb)])
        s.conv_body = nn.Conv2d(nf, nf, 3, 1, 1)
        s.conv_up1 = nn.Conv2d(nf, nf, 3, 1, 1); s.conv_up2 = nn.Conv2d(nf, nf, 3, 1, 1)
        s.conv_hr = nn.Conv2d(nf, nf, 3, 1, 1); s.conv_last = nn.Conv2d(nf, 3, 3, 1, 1)
        s.l = nn.LeakyReLU(0.2, True)
    def forward(s, x):
        f = s.conv_first(x); f = f + s.conv_body(s.body(f))
        f = s.l(s.conv_up1(F.interpolate(f, scale_factor=2, mode='nearest')))
        f = s.l(s.conv_up2(F.interpolate(f, scale_factor=2, mode='nearest')))
        return s.conv_last(s.l(s.conv_hr(f)))

torch.set_num_threads(4)
net = RRDBNet(); sd = torch.load('RealESRGAN_x4plus.pth', map_location='cpu')
net.load_state_dict(sd.get('params_ema', sd.get('params', sd)), strict=True); net.eval()
for src in sys.argv[1:]:
    im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
    x = torch.from_numpy(im).permute(2, 0, 1)[None]
    # obrada u pločicama radi memorije
    T, P = 192, 12; _, _, H, W = x.shape; out = torch.zeros(1, 3, H*4, W*4)
    with torch.no_grad():
        for y0 in range(0, H, T):
            for x0 in range(0, W, T):
                y1, x1 = min(y0+T, H), min(x0+T, W)
                ya, xa = max(y0-P, 0), max(x0-P, 0); yb, xb = min(y1+P, H), min(x1+P, W)
                o = net(x[:, :, ya:yb, xa:xb])
                out[:, :, y0*4:y1*4, x0*4:x1*4] = o[:, :, (y0-ya)*4:(y0-ya+y1-y0)*4, (x0-xa)*4:(x0-xa+x1-x0)*4]
    res = (out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255).round().astype(np.uint8)
    Image.fromarray(res).save(src.replace('.jpg', '_x4.png')); print('done', src, res.shape)
