(function (BizCalc) {
'use strict';
const { historyKey, names, inputIds, $, money, numFrom, element, detailsFor, currentMode, getInputs, conclusionFor, currentOutput, set } = BizCalc;

function readHistory(){
 try{let x=JSON.parse(localStorage.getItem(historyKey)||'[]');return Array.isArray(x)?x:[]}
 catch(e){return []}
}
function writeHistory(items){
 try{localStorage.setItem(historyKey,JSON.stringify(items));return true}
 catch(e){set('saveStatus','Не удалось сохранить расчёт в браузере.');return false}
}
function fallbackLabel(item){return item.label||((names[item.mode]||'Расчёт')+' — '+(item.date?new Date(item.date).toLocaleDateString('ru-RU'):''))}
function dateText(date){let d=new Date(date);return Number.isNaN(d.getTime())?'Дата неизвестна':d.toLocaleString('ru-RU')}
function getConclusion(item){
 if(item.conclusion)return item.conclusion;
 let v=item.values||{};
 if(item.mode==='profit')return {label:'Чистая прибыль',value:money(numFrom(v.revenue)-numFrom(v.costs)-numFrom(v.other))};
 if(item.mode==='commission')return {label:'Останется после удержаний',value:item.result||'—'};
 if(item.mode==='batch')return {label:'Себестоимость одной единицы',value:item.result||'—'};
 if(item.mode==='ads')return {label:'ROAS — возврат рекламных расходов',value:item.result||'—'};
 return {label:'Результат расчёта',value:item.result||'—'};
}
function getDetails(item){if(Array.isArray(item.details))return item.details;return detailsFor(item.mode||'profit',item.values||{})}
function save(onSaved){
 let mode=currentMode(),values=getInputs(),label=$('calculationLabel').value.trim();
 if(!label)label=(names[mode]||'Расчёт')+' — '+new Date().toLocaleDateString('ru-RU');
 let item={id:String(Date.now())+'_'+Math.random().toString(36).slice(2,7),mode,label,values,details:detailsFor(mode,values),conclusion:conclusionFor(mode,values),result:currentOutput(mode),date:new Date().toISOString()};
 let items=readHistory();items.push(item);
 if(writeHistory(items)){$('calculationLabel').value='';set('saveStatus','Расчёт сохранён.');if(onSaved)onSaved()}
}
function renderHistory(onOpenCalculation, onChange){
 let items=readHistory(),list=$('historyList');list.textContent='';
 let query=($('historySearch').value||'').toLocaleLowerCase('ru-RU');
 let filtered=items.slice().reverse().filter(item=>{
  let c=getConclusion(item);
  return [fallbackLabel(item),names[item.mode]||'',c.label,c.value,item.date].join(' ').toLocaleLowerCase('ru-RU').includes(query);
 });
 set('historyStatus',items.length?'Всего сохранено: '+items.length:'История пока пуста.');
 if(!filtered.length){list.appendChild(element('div','empty',items.length?'Ничего не найдено.':'Сохрани первый расчёт — он появится здесь.'));return}
 filtered.forEach(item=>{
  let card=element('article','history-item'),top=element('div','history-top'),info=element('div');
  info.appendChild(element('div','history-title',fallbackLabel(item)));
  info.appendChild(element('div','history-type',names[item.mode]||'Калькулятор'));
  info.appendChild(element('div','history-date',dateText(item.date)));
  top.appendChild(info);card.appendChild(top);
  let c=getConclusion(item),result=element('div','history-result');
  result.appendChild(element('small',null,c.label));result.appendChild(element('strong',null,c.value));
  if(c.extra)result.appendChild(element('div','hint',c.extra));card.appendChild(result);
  let details=getDetails(item);
  if(details.length){
   let grid=element('div','history-details');
   details.forEach(d=>{let box=element('div','detail');box.appendChild(element('small',null,d.label));box.appendChild(element('span',null,d.value));grid.appendChild(box)});
   card.appendChild(grid);
  }
  let actions=element('div','history-actions'),open=element('button',null,'Открыть расчёт');
  open.type='button';open.addEventListener('click',()=>{if(onOpenCalculation)onOpenCalculation(item)});
  let del=element('button',null,'Удалить');del.type='button';
  del.addEventListener('click',()=>{writeHistory(readHistory().filter(x=>x.id!==item.id));if(onChange)onChange()});
  actions.appendChild(open);actions.appendChild(del);card.appendChild(actions);list.appendChild(card);
 });
}
function clearHistory(){localStorage.removeItem(historyKey)}
function exportHistory(){
 let rows=[['Дата','Название','Калькулятор','Основной результат','Показатель','Значение']];
 readHistory().forEach(item=>{
  let c=getConclusion(item);rows.push([dateText(item.date),fallbackLabel(item),names[item.mode]||item.mode,c.label,c.value,'']);
  getDetails(item).forEach(d=>rows.push(['','','','',d.label,d.value]));
 });
 let csv='\uFEFF'+rows.map(row=>row.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
 let blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='bizcalc-history.csv';a.click();URL.revokeObjectURL(url);
}
Object.assign(BizCalc, { readHistory, writeHistory, fallbackLabel, dateText, getConclusion, getDetails, save, renderHistory, clearHistory, exportHistory });
})(window.BizCalc);
