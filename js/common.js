/* 정보 3단원 알고리즘과 프로그래밍 – 공통 스크립트 */
(function(){
'use strict';

const UNITS=[
 {id:1,t:'알고리즘과 문제 해결',pg:'76–81',std:['12정03-01','12정03-10'],c:'#3b5bdb',ic:'🧭',d:'추상화 → 알고리즘 설계 → 자동화로 문제를 해결하는 절차'},
 {id:2,t:'문제 분해와 모델링',pg:'82–89',std:['12정03-01'],c:'#7048e8',ic:'🧩',d:'복잡한 문제를 작게 나누고, 표·그림·그래프로 구조화하기'},
 {id:3,t:'자료형과 변수',pg:'90–99',std:['12정03-04'],c:'#0c8599',ic:'📦',d:'수치·문자열·불 자료형, 변수, 산술·비교·논리 연산자'},
 {id:4,t:'표준 입출력과 파일 입출력',pg:'100–109',std:['12정03-05'],c:'#2b8a3e',ic:'⌨️',d:'print / input, 형 변환, 파일 열기-처리-닫기'},
 {id:5,t:'제어 구조와 데이터 구조',pg:'110–123',std:['12정03-06','12정03-07'],c:'#e67700',ic:'🔀',d:'if·for·while, 중첩 구조, 1·2차원 리스트'},
 {id:6,t:'객체지향과 클래스',pg:'124–131',std:['12정03-08'],c:'#d6336c',ic:'🏭',d:'객체·클래스·인스턴스, 속성과 메서드'},
 {id:7,t:'정렬과 탐색 알고리즘',pg:'132–143',std:['12정03-02','12정03-03'],c:'#c92a2a',ic:'📊',d:'선택·퀵 정렬, 순차·이진 탐색의 특징과 효율'},
 {id:8,t:'협력적 문제 해결 프로젝트',pg:'144–155',std:['12정03-09','12정03-10'],c:'#495057',ic:'🤝',d:'주제 선정부터 성능 평가·공유까지 5단계 프로젝트'}
];
const STD={
 '12정03-01':'복잡한 문제를 해결 가능한 작은 문제로 분해하고 모델링한다.',
 '12정03-02':'데이터를 정렬하는 다양한 알고리즘의 특징과 효율을 비교ㆍ분석한다.',
 '12정03-03':'데이터를 탐색하는 다양한 알고리즘의 특징과 효율을 비교ㆍ분석한다.',
 '12정03-04':'자료형의 종류와 특성을 알고, 적합한 자료형을 선택하여 프로그램을 작성한다.',
 '12정03-05':'표준입출력과 파일입출력을 활용한 프로그램을 작성한다.',
 '12정03-06':'다차원 데이터 구조를 활용한 프로그램을 작성한다.',
 '12정03-07':'다양한 제어 구조를 복합적으로 활용한 프로그램을 작성한다.',
 '12정03-08':'객체를 구현하는 클래스와 인스턴스를 활용하여 프로그램을 작성한다.',
 '12정03-09':'실생활 및 다양한 학문 분야의 문제 해결을 위한 프로그램을 협력적으로 설계ㆍ구현한다.',
 '12정03-10':'문제 해결을 위한 프로그램의 성능을 평가하고 공유한다.'
};
const KEY='info3-samyang-progress-v1';
const Progress={
  load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}},
  save(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}},
  get(u){const p=this.load();return p['u'+u]||{}},
  set(u,patch){const p=this.load();p['u'+u]=Object.assign(p['u'+u]||{},patch);this.save(p)},
  pct(u){const s=this.get(u);let v=0;
    if(s.quiz&&s.quiz[1])v+=Math.round(60*s.quiz[0]/s.quiz[1]);
    if(s.checks){const n=Object.values(s.checks).filter(Boolean).length;const tot=s.checkTotal||5;v+=Math.min(30,Math.round(30*n/tot));}
    if(s.simVisited)v+=10;
    return Math.min(100,v)}
};
window.UNITS=UNITS;window.STD=STD;window.Progress=Progress;

/* ---------- 유틸 ---------- */
window.$=(s,r)=> (r||document).querySelector(s);
window.$$=(s,r)=> Array.from((r||document).querySelectorAll(s));
window.esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 코드 블록: 줄별 span (하이라이트용) */
window.codeBlock=function(lines){return '<pre class="code">'+lines.map((l,i)=>`<span class="ln" data-i="${i}">${esc(l)||' '}</span>`).join('')+'</pre>'};
window.hlLine=function(root,i){$$('.ln',root).forEach(e=>e.classList.toggle('hl',+e.dataset.i===i))};

/* ---------- 파이썬 실행기 (Pyodide, 필요할 때만 로드) ---------- */
let pyP=null;
function loadPy(){
  if(pyP)return pyP;
  pyP=new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    s.onload=async()=>{try{
      const py=await loadPyodide();
      await py.runPythonAsync(`
import builtins, js
def _inp(p=''):
    v = js.prompt(str(p))
    if v is None:
        raise EOFError('입력이 취소되었습니다.')
    print(str(p)+str(v))
    return str(v)
builtins.input = _inp
`);
      res(py);}catch(e){pyP=null;rej(e)}};
    s.onerror=()=>{pyP=null;rej(new Error('파이썬 실행 환경을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'))};
    document.head.appendChild(s);
  });
  return pyP;
}
window.PyRunner={
  mount(host,opt){
    opt=opt||{};
    host.classList.add('pyrun');
    host.innerHTML=`<div class="row"><b>🐍 ${esc(opt.title||'파이썬 실행기')}</b><span class="small">${opt.page?'교과서 '+esc(opt.page)+'쪽 코드':''} · 코드를 고쳐서 직접 실행해 보세요.</span></div>
    <textarea spellcheck="false">${esc(opt.code||'')}</textarea>
    <div class="row"><button class="btn run">▶ 실행</button><button class="btn ghost reset">↺ 처음 코드로</button><span class="small st"></span></div>
    <div class="out">(실행 결과가 여기에 표시됩니다)</div>`;
    const ta=$('textarea',host),out=$('.out',host),st=$('.st',host);
    ta.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const s=ta.selectionStart;ta.setRangeText('  ',s,ta.selectionEnd,'end')}});
    $('.reset',host).onclick=()=>{ta.value=opt.code||''};
    $('.run',host).onclick=async()=>{
      out.className='out';out.textContent='';st.textContent='실행 환경 준비 중… (처음 한 번은 몇 초 걸려요)';
      try{
        const py=await loadPy();st.textContent='';
        let buf='';
        py.setStdout({batched:s=>{buf+=s+'\n';out.textContent=buf}});
        py.setStderr({batched:s=>{buf+=s+'\n';out.textContent=buf}});
        const ns=py.globals.get('dict')();
        try{await py.runPythonAsync(ta.value,{globals:ns});if(!buf)out.textContent='(출력 없음)';}
        catch(e){out.className='out err';const m=String(e.message||e).trim().split('\n');out.textContent=(buf?buf:'')+m.slice(-4).join('\n')}
        ns.destroy&&ns.destroy();
      }catch(e){out.className='out err';out.textContent=e.message;st.textContent=''}
    };
  }
};

/* ---------- 퀴즈 엔진 ---------- */
function renderQuiz(host,u,Q){
  let answered={},score=0;
  host.innerHTML='<div class="card"><h2>✅ 복습 퀴즈</h2><p class="small">교과서 내용을 바탕으로 한 문제입니다. 선택하면 바로 해설이 나와요. 점수는 이 브라우저에 저장됩니다.</p></div><div class="qs"></div><div class="score"></div>';
  const qs=$('.qs',host),sc=$('.score',host);
  function finish(){
    const n=Q.length;sc.innerHTML=`내 점수: <span style="color:var(--uc)">${score} / ${n}</span><br><button class="btn" id="retry">🔁 다시 풀기</button>`;
    const prev=Progress.get(u).quiz;
    const best=(prev&&prev[0]>score)?prev:[score,n];
    Progress.set(u,{quiz:best});
    $('#retry').onclick=()=>{renderQuiz(host,u,Q)};
  }
  function done(card,ok,idx){
    card.classList.add('done');
    if(answered[idx]!==undefined)return;
    answered[idx]=ok;if(ok)score++;
    if(Object.keys(answered).length===Q.length)finish();
  }
  Q.forEach((q,i)=>{
    const card=document.createElement('div');card.className='quizq';
    let html=`<div><span class="qn">Q${i+1}.</span> ${q.q}${q.pg?`<span class="pg">${q.pg}쪽</span>`:''}</div>`;
    if(q.type==='fill'){
      html+=`<div class="row"><input type="text" style="width:220px" placeholder="정답 입력"><button class="btn sm">확인</button></div><div class="msg"></div>`;
    }else{
      html+=q.c.map((c,j)=>`<button class="ch" data-j="${j}">${c}</button>`).join('');
    }
    html+=`<div class="exp">💡 ${q.e}</div>`;
    card.innerHTML=html;qs.appendChild(card);
    if(q.type==='fill'){
      const inp=$('input',card),msg=$('.msg',card);
      const chk=()=>{const v=inp.value.trim().replace(/\s+/g,'');if(!v)return;
        const ok=q.a.some(a=>a.replace(/\s+/g,'')===v);
        msg.className='msg '+(ok?'ok':'bad');msg.textContent=ok?'정답!':'다시 생각해 보세요. (정답: '+q.a[0]+')';
        inp.disabled=true;$('button',card).disabled=true;done(card,ok,i)};
      $('button',card).onclick=chk;inp.addEventListener('keydown',e=>{if(e.key==='Enter')chk()});
    }else{
      $$('.ch',card).forEach(b=>b.onclick=()=>{
        if(card.classList.contains('done'))return;
        const j=+b.dataset.j,ok=j===q.a;
        b.classList.add(ok?'right':'wrong');
        if(!ok)$$('.ch',card)[q.a].classList.add('right');
        done(card,ok,i);
      });
    }
  });
}

/* ---------- 성취기준 점검 ---------- */
function renderStd(host,u,info){
  const checks=window.CHECKS||[];
  const saved=Progress.get(u).checks||{};
  host.innerHTML=`<div class="card"><h2>🎯 성취기준</h2>
   ${info.std.map(s=>`<div class="def"><b class="mono">[${s}]</b> ${STD[s]}</div>`).join('')}
   <p class="small">2022 개정 교육과정 고등학교 정보과 성취기준(성취수준 자료) 기준입니다.</p></div>
   <div class="card"><h2>📝 학습 자가 점검 <span class="small">(교과서 평가 항목 기반)</span></h2>
   <p class="small">스스로 설명하거나 해 볼 수 있으면 체크하세요.</p>
   ${checks.map((c,i)=>`<label class="check"><input type="checkbox" data-i="${i}" ${saved[i]?'checked':''}><span>${c}</span></label>`).join('')}
   <div style="margin-top:10px"><div class="progressbar"><i id="pb" style="width:0"></i></div><div class="small" id="pbt"></div></div></div>
   <div class="card"><h2>🏅 성취수준 가이드 (A~E)</h2>
   <table><tr><th style="width:60px">수준</th><th class="l">이 단원에서 이런 모습이에요</th></tr>
   ${(window.LEVELS||[]).map((t,i)=>`<tr><td><b>${'ABCDE'[i]}</b></td><td class="l">${t}</td></tr>`).join('')}</table></div>`;
  function upd(){const cs=$$('input[type=checkbox]',host);const n=cs.filter(c=>c.checked).length;
    $('#pb').style.width=(checks.length?100*n/checks.length:0)+'%';$('#pbt').textContent=`${n} / ${checks.length} 항목 달성`;
    const o={};cs.forEach(c=>o[c.dataset.i]=c.checked);Progress.set(u,{checks:o,checkTotal:checks.length})}
  $$('input[type=checkbox]',host).forEach(c=>c.onchange=upd);
  const cs=$$('input[type=checkbox]',host);const n=cs.filter(c=>c.checked).length;
  $('#pb').style.width=(checks.length?100*n/checks.length:0)+'%';$('#pbt').textContent=`${n} / ${checks.length} 항목 달성`;
}

/* ---------- 셸(헤더·탭·페이저) ---------- */
function topbar(base,cur){
  const tb=document.createElement('div');tb.className='topbar';
  tb.innerHTML=`<a class="logo" href="${base}index.html">💻 정보 <span>3단원</span> 시뮬레이션</a><nav>${UNITS.map(x=>`<a href="${base}units/u${x.id}.html" class="${x.id===cur?'cur':''}" title="${x.t}">${x.id}</a>`).join('')}<a href="${base}submit.html" title="학습 기록 제출">📤 제출</a></nav>`;
  document.body.prepend(tb);
}
window.initHome=function(){topbar('./',0)};
document.addEventListener('DOMContentLoaded',()=>{
  const u=+document.body.dataset.unit;if(!u)return;
  const info=UNITS[u-1];document.body.style.setProperty('--uc',info.c);
  topbar('../',u);
  const app=$('#app');
  const wrap=document.createElement('div');wrap.className='wrap';
  document.body.insertBefore(wrap,app);
  const secs=$$('section[data-tab]',app);
  const quizSec=document.createElement('section');quizSec.dataset.tab='✅ 복습 퀴즈';quizSec.id='quiz';
  const stdSec=document.createElement('section');stdSec.dataset.tab='🎯 성취기준 점검';stdSec.id='std';
  app.append(quizSec,stdSec);
  const all=[...secs,quizSec,stdSec];
  const hero=document.createElement('div');hero.className='hero';
  hero.innerHTML=`<span class="badge">${u}단원 · 교과서 ${info.pg}쪽</span><h1>${info.ic} ${info.t}</h1><p>${window.GOAL||info.d}</p><div class="chips">${info.std.map(s=>`<span class="chip">[${s}]</span>`).join('')}</div>`;
  const tabs=document.createElement('div');tabs.className='tabs';
  all.forEach((s,i)=>{s.classList.add('tabsec');const b=document.createElement('button');b.textContent=s.dataset.tab;b.onclick=()=>show(i);tabs.appendChild(b)});
  wrap.append(hero,tabs,app);
  const pager=document.createElement('div');pager.className='pager';
  const pv=UNITS[u-2],nx=UNITS[u];
  pager.innerHTML=`<div>${pv?`<a class="btn ghost" href="u${pv.id}.html">← ${pv.id}. ${pv.t}</a>`:`<a class="btn ghost" href="../index.html">← 처음으로</a>`}</div><div>${nx?`<a class="btn" href="u${nx.id}.html">${nx.id}. ${nx.t} →</a>`:`<a class="btn" href="../index.html">🏁 전체 학습 현황</a>`}</div>`;
  wrap.appendChild(pager);
  let quizDone=false,stdDone=false;
  function show(i){
    $$('button',tabs).forEach((b,j)=>b.classList.toggle('on',i===j));
    all.forEach((s,j)=>s.classList.toggle('on',i===j));
    const s=all[i];
    if(s===quizSec&&!quizDone){renderQuiz(quizSec,u,window.QUIZ||[]);quizDone=true}
    if(s===stdSec&&!stdDone){renderStd(stdSec,u,info);stdDone=true}
    if(s.id==='sim')Progress.set(u,{simVisited:true});
    try{history.replaceState(null,'','#'+(s.id||'tab'+i))}catch(e){}
    window.scrollTo({top:0});
  }
  const h=location.hash.replace('#','');
  const start=all.findIndex(s=>s.id===h);
  show(start>=0?start:0);
  window.gotoTab=id=>{const i=all.findIndex(s=>s.id===id);if(i>=0)show(i)};
});
})();
