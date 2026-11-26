(function (BizCalc) {
'use strict';
const { $, names, descriptions, inputIds, calculate, readHistory, renderHistory, clearHistory, exportHistory, renderDashboard, save } = BizCalc;
function refresh(){renderHistoryView();renderDashboard()}
function selectMode(mode){
 document.querySelectorAll('.mode').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode===mode));
 document.querySelectorAll('[data-panel]').forEach(panel=>panel.hidden=panel.dataset.panel!==mode);
 $('modeSummary').textContent=names[mode]||'Выбрать калькулятор';
 $('description').textContent=descriptions[mode]||'';
 $('modePicker').open=false;calculate();
}
function showPage(page){
 $('landingPage').style.display='none';
 $('calculatorPage').style.display=page==='calculator'?'block':'none';
 $('historyPage').classList.toggle('active',page==='history');
 $('bottomNav').style.display=page==='home'?'none':'';
 $('navCalculator').classList.toggle('active',page==='calculator');
 $('navHistory').classList.toggle('active',page==='history');
 if(page==='history')renderHistoryView();
 if(page==='home'){$('landingPage').style.display='block';window.scrollTo({top:0,behavior:'smooth'})}
 else window.scrollTo({top:0,behavior:'smooth'});
}
function openCalculator(mode){
 if(mode)selectMode(mode);
 showPage('calculator');
}
function openHistoryRecord(item){
 let values=item.values||{};
 inputIds.forEach(id=>{if(values[id]!==undefined)$(id).value=values[id]});
 $('calculationLabel').value=item.label||'';
 selectMode(item.mode||'profit');showPage('calculator');window.scrollTo({top:0,behavior:'smooth'});
}
function renderHistoryView(){renderHistory(openHistoryRecord,refresh)}
Object.assign(BizCalc, { refresh, selectMode, showPage, openCalculator });
document.addEventListener('DOMContentLoaded',function(){
'use strict';

document.querySelectorAll('.mode').forEach(btn=>btn.addEventListener('click',()=>selectMode(btn.dataset.mode)));
inputIds.forEach(id=>$(id).addEventListener('input',calculate));
$('vatMode').addEventListener('change',calculate);
$('saveCalculation').addEventListener('click',()=>save(refresh));
$('historySearch').addEventListener('input',renderHistoryView);
$('clearHistory').addEventListener('click',()=>{
 if(confirm('Удалить всю историю расчётов?')){clearHistory();refresh()}
});
$('exportHistory').addEventListener('click',exportHistory);
$('navCalculator').addEventListener('click',()=>showPage('calculator'));
$('navHistory').addEventListener('click',()=>showPage('history'));
$('desktopOpenHistory').addEventListener('click',()=>showPage('history'));
$('brandHome').addEventListener('click',()=>showPage('home'));
$('backHomeFromCalc').addEventListener('click',()=>showPage('home'));
$('backHomeFromHistory').addEventListener('click',()=>showPage('home'));
['headerStart','heroStart','bottomStart','catalogOpenAll'].forEach(id=>$(id).addEventListener('click',()=>openCalculator()));
$('headerHistory').addEventListener('click',()=>showPage('history'));
document.querySelectorAll('[data-tool]').forEach(card=>card.addEventListener('click',()=>openCalculator(card.dataset.tool)));
document.querySelectorAll('[data-filter]').forEach(button=>{
 button.addEventListener('click',()=>{
  let filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===button));
  document.querySelectorAll('[data-tool]').forEach(card=>{card.style.display=filter==='all'||card.dataset.category===filter?'':'none'});
 });
});
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.12});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
selectMode('profit');calculate();refresh();showPage('home');
});
})(window.BizCalc);
