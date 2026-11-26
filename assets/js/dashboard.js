(function (BizCalc) {
'use strict';
const { names, element, fallbackLabel, getConclusion, dateText, readHistory, set, $ } = BizCalc;
function miniCard(item){
 let node=element('div','mini-item');node.appendChild(element('strong',null,fallbackLabel(item)));
 let c=getConclusion(item);node.appendChild(element('div','value',c.value));
 node.appendChild(element('div','hint',(names[item.mode]||'Калькулятор')+' · '+dateText(item.date)));return node;
}
function renderDashboard(){
 let items=readHistory(),week=Date.now()-7*86400000,recent=items.slice(-3).reverse();
 let weekCount=items.filter(x=>new Date(x.date).getTime()>=week).length;
 ['statTotal','mobileStatTotal'].forEach(id=>set(id,items.length));
 ['statWeek','mobileStatWeek'].forEach(id=>set(id,weekCount));
 ['recentCalculations','desktopRecent','mobileRecent'].forEach(id=>{
  let box=$(id);box.textContent='';
  if(!recent.length){box.appendChild(element('div','empty','Пока нет сохранённых расчётов.'));return}
  recent.forEach(item=>box.appendChild(miniCard(item)));
 });
}
Object.assign(BizCalc, { miniCard, renderDashboard });
})(window.BizCalc);
