// Border close-ups for Premium Silk sarees (client, 19 Nov 2026): cut from each saree's OWN folded photo (the Drive pendrive
// original "01", full resolution, turned upright exactly as <slug>-original.jpg), never from the AI model photo. 2:3, 1600x2400
// → assets/images/<slug>-border-zoom.jpg. Usage (from homepage/): FFMPEG=… FFPROBE=… node _tools/border-zoom.cjs "<json list>" crop
// (modes: full = upright previews, preview = crop previews, crop = write the files). The list used is in add-border-zoom.cjs.
const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
const ff=process.env.FFMPEG||'ffmpeg';const fp=process.env.FFPROBE||'ffprobe'; // paths to ffmpeg / ffprobe
const P='G:/My Drive/Stylish Naari – Saree Photography/01 – Banarasi/'+(process.env.RANGE||'Premium Silk')+'/Original Product Photos – Pendrive/'; // RANGE=Premium Semi-Silk for the semi-silk sarees
const dir=(sn)=>P+fs.readdirSync(P).find(x=>x.startsWith('SN-'+sn+' '));
const file=(sn,cam)=>{const d=dir(sn);return path.join(d,fs.readdirSync(d).find(x=>x.includes(cam)))};
// slug, SN, camera file, extra flip, crop [x0,y0,w] as shares of the upright photo (height share = same as width for 2:3)
const J=JSON.parse(process.argv[2]||'null');
const L=J||[
 ['mehfil','045','_SKS6622','',[0.15,0.50,0.5]],
 ['phalsa','013','_DSC4625','flip',[0.30,0.45,0.5]],
 ['moonga','006','_DSC4767','',[0.15,0.50,0.5]],
 ['chameli','032','_DSC4546','',[0.00,0.40,0.5]],
 ['kajal','002','_DSC4617','',[0.40,0.00,0.5]],
 ['kamal','005','_DSC4528','',[0.35,0.10,0.5]],
];
const mode=process.argv[3]||'crop';
for(const [slug,sn,cam,flip,[x,y,w]] of L){
 const src=file(sn,cam);
 const dim=execFileSync(fp,['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',src]).toString().trim().split(',').map(Number);
 let vf=[];if(dim[0]>dim[1])vf.push('transpose=1');if(flip)vf.push('hflip,vflip');
 if(mode==='full'){vf.push('scale=400:600');execFileSync(ff,['-nostdin','-y','-v','error','-i',src,'-vf',vf.join(','),'full-'+slug+'.jpg']);continue;}
 vf.push(`crop=iw*${w}:ih*${w}:iw*${x}:ih*${y}`,'scale=1600:2400:flags=lanczos');
 const out=mode==='preview'?'prev-'+slug+'.jpg':path.join(__dirname,'..','assets','images',slug+'-border-zoom.jpg');
 execFileSync(ff,['-nostdin','-y','-v','error','-i',src,'-vf',vf.join(','),'-q:v','2',out]);
 console.log(slug,path.basename(src),dim.join('x'));
}
