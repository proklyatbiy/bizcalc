(function (BizCalc) {
'use strict';
const { names, descriptions, inputIds, $, num, money, pct, set, numFrom } = BizCalc;
function calculate(){
 let rev=num('revenue'),cost=num('costs'),other=num('other'),profit=rev-cost-other;
 set('profitValue',money(profit));set('profitHint','Маржинальность: '+(rev>0?pct(profit/rev*100):'—'));
 set('marginValue',num('mRevenue')>0?pct(num('mProfit')/num('mRevenue')*100):'—');
 let sale=num('purchase')*(1+num('markup')/100);
 set('salePrice',money(sale));set('markupHint','Прибыль с единицы: '+money(sale-num('purchase')));
 let contribution=1-num('variable')/100;
 set('breakValue',contribution>0?money(num('fixed')/contribution):'Не рассчитывается');
 set('breakHint',contribution>0?'Маржинальный доход: '+pct(contribution*100):'Переменные расходы должны быть меньше 100%');
 set('paybackValue',num('monthly')>0?(num('investment')/num('monthly')).toLocaleString('ru-RU',{maximumFractionDigits:1})+' мес.':'Не рассчитывается');
 let total=num('batchCost')+num('delivery');
 set('unitValue',num('quantity')>0?money(total/num('quantity')):'Не рассчитывается');
 set('batchHint','Полная стоимость партии: '+money(total));
 let discount=Math.min(100,Math.max(0,num('discountPercent')));
 set('discountValue',money(num('discountPrice')*(1-discount/100)));
 set('discountHint','Экономия на всей покупке: '+money(num('discountPrice')*discount/100*num('discountQty')));
 let fee=num('commissionRevenue')*num('commissionPercent')/100;
 set('commissionValue',money(num('commissionRevenue')-fee-num('commissionExtra')));
 set('commissionHint','Комиссия: '+money(fee));
 let va=num('vatAmount'),rate=Math.max(0,num('vatRate'));
 if($('vatMode').value==='extract'){
  let tax=rate>0?va*rate/(100+rate):0;
  set('vatValue',money(tax));set('vatHint','Сумма без НДС: '+money(va-tax));
 }else{
  let tax=va*rate/100;
  set('vatValue',money(tax));set('vatHint','Итого с НДС: '+money(va+tax));
 }
 set('roiValue',num('roiCosts')>0?pct(num('roiProfit')/num('roiCosts')*100):'—');
 let spend=num('adsSpend'),adRev=num('adsRevenue'),clients=num('adsClients');
 set('adsValue',spend>0?(adRev/spend).toLocaleString('ru-RU',{maximumFractionDigits:2})+'×':'—');
 set('adsHint','Стоимость клиента: '+(clients>0?money(spend/clients):'—')+' · Рекламный результат: '+money(adRev-spend));
}
function currentMode(){return document.querySelector('.mode.active')?.dataset.mode||'profit'}
function currentOutput(mode){
 const ids={profit:'profitValue',margin:'marginValue',markup:'salePrice',break:'breakValue',payback:'paybackValue',batch:'unitValue',discount:'discountValue',commission:'commissionValue',vat:'vatValue',roi:'roiValue',ads:'adsValue'};
 return $(ids[mode]).textContent;
}
function getInputs(){let v={};inputIds.forEach(id=>v[id]=$(id).value);return v}
function detailsFor(mode,v){
 const fields={
  profit:[['revenue','Выручка'],['costs','Себестоимость и закупки'],['other','Прочие расходы']],
  margin:[['mRevenue','Выручка'],['mProfit','Прибыль']],
  markup:[['purchase','Себестоимость единицы'],['markup','Наценка, %']],
  break:[['fixed','Постоянные расходы'],['variable','Переменные расходы, %']],
  payback:[['investment','Первоначальные вложения'],['monthly','Денежный поток в месяц']],
  batch:[['quantity','Количество единиц'],['batchCost','Стоимость закупки'],['delivery','Доставка и доп. расходы']],
  discount:[['discountPrice','Исходная цена'],['discountPercent','Скидка, %'],['discountQty','Количество товаров']],
  commission:[['commissionRevenue','Сумма продажи'],['commissionPercent','Процент комиссии'],['commissionExtra','Дополнительные расходы']],
  vat:[['vatAmount','Сумма'],['vatRate','Ставка НДС, %'],['vatMode','Тип расчёта']],
  roi:[['roiProfit','Прибыль'],['roiCosts','Затраты']],
  ads:[['adsSpend','Расходы на рекламу'],['adsRevenue','Выручка от рекламы'],['adsClients','Количество клиентов']]
 };
 return (fields[mode]||[]).map(([id,label])=>{
  let value=v[id];
  if(id==='vatMode')value=value==='extract'?'Выделение НДС из суммы':'Начисление НДС сверху';
  else if(id!=='adsClients'&&id!=='quantity'&&id!=='discountQty'&&id!=='markup'&&id!=='variable'&&id!=='discountPercent'&&id!=='commissionPercent'&&id!=='vatRate')value=money(Number(value)||0);
  else if(['markup','variable','discountPercent','commissionPercent','vatRate'].includes(id))value=(value||0)+'%';
  return {label,value:String(value)};
 });
}
function conclusionFor(mode,v){
 switch(mode){
  case 'profit':return {label:'Чистая прибыль',value:money(numFrom(v.revenue)-numFrom(v.costs)-numFrom(v.other))};
  case 'margin':return {label:'Маржинальность',value:$('marginValue').textContent};
  case 'markup':return {label:'Цена продажи',value:$('salePrice').textContent};
  case 'break':return {label:'Выручка для выхода в ноль',value:$('breakValue').textContent};
  case 'payback':return {label:'Срок окупаемости',value:$('paybackValue').textContent};
  case 'batch':return {label:'Себестоимость одной единицы',value:$('unitValue').textContent,extra:'Полная стоимость партии: '+money(numFrom(v.batchCost)+numFrom(v.delivery))};
  case 'discount':return {label:'Цена после скидки',value:$('discountValue').textContent,extra:$('discountHint').textContent};
  case 'commission':return {label:'Останется после удержаний',value:$('commissionValue').textContent,extra:$('commissionHint').textContent};
  case 'vat':return {label:'Сумма НДС',value:$('vatValue').textContent,extra:$('vatHint').textContent};
  case 'roi':return {label:'Рентабельность затрат',value:$('roiValue').textContent};
  case 'ads':return {label:'ROAS — возврат рекламных расходов',value:$('adsValue').textContent,extra:$('adsHint').textContent};
 }
}
Object.assign(BizCalc, { calculate, currentMode, currentOutput, getInputs, detailsFor, conclusionFor });
})(window.BizCalc);
