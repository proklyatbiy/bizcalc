(function (BizCalc) {
'use strict';
const historyKey='bizcalc_history_v1';
const names={
 profit:'Прибыль',margin:'Маржа',markup:'Наценка',break:'Безубыточность',
 payback:'Окупаемость',batch:'Стоимость партии',discount:'Скидка',
 commission:'Комиссия',vat:'НДС',roi:'Рентабельность',ads:'Реклама'
};
const descriptions={
 profit:'Выручка минус себестоимость и прочие расходы.',
 margin:'Доля прибыли в выручке.',
 markup:'Цена продажи на основе себестоимости и наценки.',
 break:'Минимальная выручка для покрытия постоянных расходов.',
 payback:'Срок возврата первоначальных вложений.',
 batch:'Полная стоимость закупки и себестоимость единицы.',
 discount:'Цена после скидки и общая экономия.',
 commission:'Сколько останется после комиссии и дополнительных расходов.',
 vat:'Начисление НДС сверху или выделение его из суммы.',
 roi:'Прибыль относительно понесённых затрат.',
 ads:'Возврат рекламных расходов и стоимость привлечения клиента.'
};
const inputIds=[
 'revenue','costs','other','mRevenue','mProfit','purchase','markup',
 'fixed','variable','investment','monthly','quantity','batchCost','delivery',
 'discountPrice','discountPercent','discountQty','commissionRevenue',
 'commissionPercent','commissionExtra','vatAmount','vatRate','vatMode',
 'roiProfit','roiCosts','adsSpend','adsRevenue','adsClients'
];
const $=id=>document.getElementById(id);
const num=id=>{let x=parseFloat(String($(id)?.value??'').replace(',','.'));return Number.isFinite(x)?x:0};
const money=x=>Number.isFinite(x)?x.toLocaleString('ru-RU',{maximumFractionDigits:2})+' ₽':'—';
const pct=x=>Number.isFinite(x)?x.toLocaleString('ru-RU',{maximumFractionDigits:2})+'%':'—';
const set=(id,value)=>$(id).textContent=value;
function numFrom(v){let x=parseFloat(v);return Number.isFinite(x)?x:0}
function element(tag,cls,text){
 let e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;
}
Object.assign(BizCalc, { historyKey, names, descriptions, inputIds, $, num, money, pct, set, numFrom, element });
})(window.BizCalc = window.BizCalc || {});
