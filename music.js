'use strict';
(()=>{
 const $=s=>document.querySelector(s),audio=$('#lofiaudio'),select=$('#musictrack'),play=$('#musicplay'),next=$('#musicnext'),volume=$('#musicvolume'),loop=$('#musicloop'),status=$('#musicstatus'),badge=$('#musicbadge');
 const tracks=['countryside','florist','oceanside','rainy-forest','cup-of-tea','morning-rain'];
 let wantPlay=false,operation=0,loaded=false;
 function save(){try{localStorage.setItem('tree-lofi',JSON.stringify({track:select.value,volume:+volume.value,loop:loop.checked}));}catch{}}
 try{const data=JSON.parse(localStorage.getItem('tree-lofi')||'null');if(data){if(tracks.includes(data.track))select.value=data.track;if(Number.isFinite(data.volume))volume.value=Math.max(0,Math.min(100,data.volume));loop.checked=data.loop===true;}}catch{}
 function setVolume(){audio.volume=+volume.value/100;$('#musicvolumeout').value=volume.value+'%';save();}
 function buttons(){play.textContent=wantPlay?'Ⅱ 暫停':'▶ 播放';play.setAttribute('aria-label',wantPlay?'暫停 Lo-fi 音樂':'播放 Lo-fi 音樂');badge.textContent=wantPlay?'播放中':'6 首 · 點選聆聽';}
 function title(){return select.selectedOptions[0].textContent.split(' · ')[1];}
 async function start(){const op=++operation;wantPlay=true;if(!loaded){audio.src='music/'+select.value+'.mp3';loaded=true;}buttons();badge.textContent='載入中…';status.textContent='正在載入 · '+title();try{await audio.play();if(op!==operation)return;buttons();status.textContent='播放中 · '+title()+' / TAD';}catch(e){if(op!==operation)return;wantPlay=false;buttons();status.textContent=e.name==='NotAllowedError'?'請再點一次播放，以啟用聲音。':'音樂載入失敗，請重試或切換下一首。';}}
 function pause(){operation++;wantPlay=false;audio.pause();buttons();status.textContent='已暫停 · '+title();}
 function choose(){const resume=wantPlay;operation++;audio.pause();loaded=false;audio.removeAttribute('src');audio.load();save();status.textContent='已選擇 · '+title();if(resume)start();else buttons();}
 play.addEventListener('click',()=>wantPlay?pause():start());select.addEventListener('change',choose);next.addEventListener('click',()=>{select.value=tracks[(tracks.indexOf(select.value)+1)%tracks.length];choose();});volume.addEventListener('input',setVolume);loop.addEventListener('change',()=>{audio.loop=loop.checked;save();});
 audio.addEventListener('ended',()=>{if(!wantPlay||audio.loop)return;select.value=tracks[(tracks.indexOf(select.value)+1)%tracks.length];choose();});
 audio.addEventListener('playing',()=>{if(!wantPlay)return;buttons();status.textContent='播放中 · '+title()+' / TAD';});audio.addEventListener('waiting',()=>{if(wantPlay){badge.textContent='緩衝中…';status.textContent='緩衝中 · '+title();}});
 audio.addEventListener('error',()=>{if(!wantPlay)return;operation++;wantPlay=false;buttons();status.textContent='音樂載入失敗，請重試或切換下一首。';});
 // Pause when the page is hidden; returning never starts music without another tap.
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&wantPlay)pause();});
 audio.loop=loop.checked;setVolume();buttons();
})();
