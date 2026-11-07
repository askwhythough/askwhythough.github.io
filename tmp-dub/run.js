window.dubRun = async (vid, l) => {
 const W=ms=>new Promise(r=>setTimeout(r,ms)); const vis=e=>e&&e.offsetParent;
 const dlgs=()=>[...document.querySelectorAll('tp-yt-paper-dialog,[role=dialog],ytcp-dialog')].filter(vis);
 const main=()=>document.querySelector('main').innerText.replace(/\s+/g,' ');
 const jobs=await (await fetch('https://askwhythough.github.io/tmp-dub/jobs.json?'+Date.now())).json();
 const j=jobs.find(x=>x.id===vid&&x.l===l); if(!j) return 'no job';
 if(/Set language/.test(main())){
   [...document.querySelectorAll('ytcp-form-select, ytcp-dropdown-trigger, #select-button, button')].filter(vis).find(b=>/Set language|Select/.test(b.innerText)||b.closest('ytcp-form-select'))?.click(); await W(1200);
   const en=[...document.querySelectorAll('tp-yt-paper-item,[role=option],yt-formatted-string')].filter(vis).find(e=>e.innerText.trim()==='English');
   if(!en) return 'no English item'; en.scrollIntoView(); en.click(); await W(800);
   [...document.querySelectorAll('button')].filter(vis).find(b=>/^\s*Confirm\s*$/.test(b.innerText)).click(); await W(4000);
   if(!/Video language: English/.test(main())) return 'language not set';
 }
 if(new RegExp(j.lang+' (Processing|Published|Draft)').test(main())) return 'already has '+j.lang;
 [...document.querySelectorAll('button')].filter(vis).find(b=>/^\s*Add language\s*$/.test(b.innerText)).click(); await W(1500);
 const it=[...document.querySelectorAll('tp-yt-paper-item,[role=option],yt-formatted-string')].filter(vis).find(e=>e.innerText.trim()===j.lang);
 if(!it) return 'no lang item'; it.scrollIntoView(); it.click(); await W(3000);
 let d=dlgs().find(x=>/Media table/.test(x.innerText)); if(!d) return 'no details dialog';
 [...d.querySelectorAll('button')].find(b=>/^\s*Add\s*$/.test(b.innerText)).click(); await W(2500);
 const b=await (await fetch(j.url)).blob(); const f=new File([b],j.url.split('/').pop(),{type:'audio/mp4'});
 const inp=[...document.querySelectorAll('input[type=file]')].find(i=>i.closest('[id]')?.id==='audio-file-loader');
 const dt=new DataTransfer(); dt.items.add(f); inp.files=dt.files; inp.dispatchEvent(new Event('change',{bubbles:true})); await W(5000);
 const ad=dlgs().filter(x=>/Add audio track/.test(x.innerText)).pop(); if(!ad||!ad.innerText.includes(f.name)) return 'file not taken';
 [...ad.querySelectorAll('button')].find(x=>/^\s*Publish\s*$/.test(x.innerText)).click(); await W(8000);
 d=dlgs().find(x=>/Media table/.test(x.innerText)); if(!/Audio Published/.test(d.innerText.replace(/\s+/g,' '))) return 'audio not published';
 const tb=[...d.querySelectorAll('#textbox[contenteditable],[contenteditable=true]')];
 for(const [el,t] of [[tb[0],j.title],[tb[1],j.desc]]){ el.focus(); document.execCommand('insertText',false,t); await W(300); }
 [...d.querySelectorAll('button')].find(x=>/^\s*Update\s*$/.test(x.innerText)).click(); await W(3500);
 return 'ok '+(main().split('Title & description')[1]||'').slice(0,120);
};
'loaded'
