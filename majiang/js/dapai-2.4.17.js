/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*************************!*\
  !*** ./src/js/dapai.js ***!
  \*************************/
/*!
 *  電脳麻将: 何切る解答機 v2.4.17
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */


const { hide, show, fadeIn, fadeOut } = Majiang.UI.Util;

let pai;

function init(fragment) {

    if (fragment) {

        let [ paistr, zhuangfeng, menfeng, baopai, hongpai ]
                = fragment.split(/\//);
        baopai  = (baopai   || '').split(/,/);
        hongpai = ! hongpai;

        $('input[name="paistr"]').val(paistr);
        $('select[name="zhuangfeng"]').val(zhuangfeng);
        $('select[name="menfeng"]').val(menfeng);
        for (let i = 0; i < baopai.length; i++) {
            $('input[name="baopai"]').eq(i).val(baopai[i]);
        }
        $('input[name="hongpai"]').prop('checked', hongpai);

        submit();
    }
    else {
        $('input[name="paistr"]').val('m123p1234789s338s8').focus();
        $('input[name="baopai"]').eq(0).val('s3');
    }
}

function init_analyzer(paistr, zhuangfeng, menfeng, baopai, hongpai) {

    let kaiju = {
        id:     0,
        rule:   Majiang.rule({'赤牌':hongpai}),
        player: [],
        qijia:  0
    };
    const analyzer = new Majiang.UI.Analyzer($('.analyzer'),
                                                { kaiju: kaiju }, pai);
    let qipai = {
        zhuangfeng: zhuangfeng,
        jushu:      (4 - menfeng) % 4,
        changbang:  0,
        lizhibang:  0,
        defen:      [ 25000, 25000, 25000, 25000 ],
        baopai:     baopai.length && Majiang.Shoupai.valid_pai(baopai[0])
                                  || 'z2',
        shoupai:    ['','','','']
    };
    qipai.shoupai[menfeng] = paistr;
    analyzer.next({ qipai: qipai });

    for (let i = 1; i < baopai.length; i++) {
        analyzer.next({ kaigang: { baopai: baopai[i] }});
    }

    return analyzer;
}

function submit() {

    hide($('.shan, .shoupai, .analyzer'));

    let paistr = $('input[name="paistr"]').val();
    if (! paistr) return false;

    let zhuangfeng = + $('select[name="zhuangfeng"]').val();
    let menfeng    = + $('select[name="menfeng"]').val();
    let baopai     = $.makeArray($('input[name="baopai"]'))
                                    .map(n => $(n).val()).filter(p => p);
    let hongpai    = $('input[name="hongpai"]').prop('checked');

    let shoupai = Majiang.Shoupai.fromString(paistr);
    paistr = shoupai.toString();
    if (! hongpai) paistr = paistr.replace(/0/,'5');

    const analyzer = init_analyzer(paistr, zhuangfeng, menfeng, baopai, hongpai
                        ? { m: 1, p: 1, s: 1 }
                        : { m: 0, p: 0, s: 0 });

    if (shoupai._zimo) {
        if (shoupai._zimo.length == 2)
                analyzer.action_zimo({ l: menfeng, p: shoupai._zimo });
        else    analyzer.action_fulou({ l: menfeng, m: shoupai._zimo });
    }
    new Majiang.UI.Shan($('.shan'), pai, analyzer.shan).redraw();
    new Majiang.UI.Shoupai($('.shoupai'), pai, analyzer.shoupai).redraw(true);

    fadeIn($('.shan, .shoupai, .analyzer'));

    paistr = analyzer.shoupai.toString();
    baopai = analyzer.shan.baopai;
    $('input[name="paistr"]').val(paistr);
    for (let i = 0; i < 5; i++) {
        $('input[name="baopai"]').eq(i).val(baopai[i] || '');
    }

    let fragment = '#'
                 + [ paistr, zhuangfeng, menfeng, baopai.join(',')].join('/');
    if (! hongpai) fragment += '/1';
    history.replaceState('', '', fragment)

    return false;
}

$(function(){

    pai = Majiang.UI.pai('#loaddata');

    $('form').on('submit', submit);

    $('form').on('reset', function(){
        hide($('.shan, .shoupai, .analyzer'));
        $('form input[name="paistr"]').focus();
    });

    let fragment = location.hash.replace(/^#/,'');
    init(fragment);
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFwYWktMi40LjE3LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFYixRQUFRLDhCQUE4Qjs7QUFFdEM7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDhCQUE4QixhQUFhO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGNBQWM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixjQUFjOztBQUVsQyxvQkFBb0IsbUJBQW1CO0FBQ3ZDLHdCQUF3QixXQUFXLG9CQUFvQjtBQUN2RDs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUIsNEJBQTRCLGtCQUFrQjs7QUFFOUM7QUFDQTtBQUNBLHVDQUF1Qyw4QkFBOEI7QUFDckUsd0NBQXdDLDhCQUE4QjtBQUN0RTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWppYW5nLy4vc3JjL2pzL2RhcGFpLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogIOmbu+iEs+m6u+Wwhjog5L2V5YiH44KL6Kej562U5qmfIHYyLjQuMTdcbiAqXG4gKiAgQ29weXJpZ2h0KEMpIDIwMTcgU2F0b3NoaSBLb2JheWFzaGlcbiAqICBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqICBodHRwczovL2dpdGh1Yi5jb20va29iYWxhYi9NYWppYW5nL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IHsgaGlkZSwgc2hvdywgZmFkZUluLCBmYWRlT3V0IH0gPSBNYWppYW5nLlVJLlV0aWw7XG5cbmxldCBwYWk7XG5cbmZ1bmN0aW9uIGluaXQoZnJhZ21lbnQpIHtcblxuICAgIGlmIChmcmFnbWVudCkge1xuXG4gICAgICAgIGxldCBbIHBhaXN0ciwgemh1YW5nZmVuZywgbWVuZmVuZywgYmFvcGFpLCBob25ncGFpIF1cbiAgICAgICAgICAgICAgICA9IGZyYWdtZW50LnNwbGl0KC9cXC8vKTtcbiAgICAgICAgYmFvcGFpICA9IChiYW9wYWkgICB8fCAnJykuc3BsaXQoLywvKTtcbiAgICAgICAgaG9uZ3BhaSA9ICEgaG9uZ3BhaTtcblxuICAgICAgICAkKCdpbnB1dFtuYW1lPVwicGFpc3RyXCJdJykudmFsKHBhaXN0cik7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwiemh1YW5nZmVuZ1wiXScpLnZhbCh6aHVhbmdmZW5nKTtcbiAgICAgICAgJCgnc2VsZWN0W25hbWU9XCJtZW5mZW5nXCJdJykudmFsKG1lbmZlbmcpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhb3BhaS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImJhb3BhaVwiXScpLmVxKGkpLnZhbChiYW9wYWlbaV0pO1xuICAgICAgICB9XG4gICAgICAgICQoJ2lucHV0W25hbWU9XCJob25ncGFpXCJdJykucHJvcCgnY2hlY2tlZCcsIGhvbmdwYWkpO1xuXG4gICAgICAgIHN1Ym1pdCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cInBhaXN0clwiXScpLnZhbCgnbTEyM3AxMjM0Nzg5czMzOHM4JykuZm9jdXMoKTtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cImJhb3BhaVwiXScpLmVxKDApLnZhbCgnczMnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRfYW5hbHl6ZXIocGFpc3RyLCB6aHVhbmdmZW5nLCBtZW5mZW5nLCBiYW9wYWksIGhvbmdwYWkpIHtcblxuICAgIGxldCBrYWlqdSA9IHtcbiAgICAgICAgaWQ6ICAgICAwLFxuICAgICAgICBydWxlOiAgIE1hamlhbmcucnVsZSh7J+i1pOeJjCc6aG9uZ3BhaX0pLFxuICAgICAgICBwbGF5ZXI6IFtdLFxuICAgICAgICBxaWppYTogIDBcbiAgICB9O1xuICAgIGNvbnN0IGFuYWx5emVyID0gbmV3IE1hamlhbmcuVUkuQW5hbHl6ZXIoJCgnLmFuYWx5emVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGthaWp1OiBrYWlqdSB9LCBwYWkpO1xuICAgIGxldCBxaXBhaSA9IHtcbiAgICAgICAgemh1YW5nZmVuZzogemh1YW5nZmVuZyxcbiAgICAgICAganVzaHU6ICAgICAgKDQgLSBtZW5mZW5nKSAlIDQsXG4gICAgICAgIGNoYW5nYmFuZzogIDAsXG4gICAgICAgIGxpemhpYmFuZzogIDAsXG4gICAgICAgIGRlZmVuOiAgICAgIFsgMjUwMDAsIDI1MDAwLCAyNTAwMCwgMjUwMDAgXSxcbiAgICAgICAgYmFvcGFpOiAgICAgYmFvcGFpLmxlbmd0aCAmJiBNYWppYW5nLlNob3VwYWkudmFsaWRfcGFpKGJhb3BhaVswXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAnejInLFxuICAgICAgICBzaG91cGFpOiAgICBbJycsJycsJycsJyddXG4gICAgfTtcbiAgICBxaXBhaS5zaG91cGFpW21lbmZlbmddID0gcGFpc3RyO1xuICAgIGFuYWx5emVyLm5leHQoeyBxaXBhaTogcWlwYWkgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGJhb3BhaS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhbmFseXplci5uZXh0KHsga2FpZ2FuZzogeyBiYW9wYWk6IGJhb3BhaVtpXSB9fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFuYWx5emVyO1xufVxuXG5mdW5jdGlvbiBzdWJtaXQoKSB7XG5cbiAgICBoaWRlKCQoJy5zaGFuLCAuc2hvdXBhaSwgLmFuYWx5emVyJykpO1xuXG4gICAgbGV0IHBhaXN0ciA9ICQoJ2lucHV0W25hbWU9XCJwYWlzdHJcIl0nKS52YWwoKTtcbiAgICBpZiAoISBwYWlzdHIpIHJldHVybiBmYWxzZTtcblxuICAgIGxldCB6aHVhbmdmZW5nID0gKyAkKCdzZWxlY3RbbmFtZT1cInpodWFuZ2ZlbmdcIl0nKS52YWwoKTtcbiAgICBsZXQgbWVuZmVuZyAgICA9ICsgJCgnc2VsZWN0W25hbWU9XCJtZW5mZW5nXCJdJykudmFsKCk7XG4gICAgbGV0IGJhb3BhaSAgICAgPSAkLm1ha2VBcnJheSgkKCdpbnB1dFtuYW1lPVwiYmFvcGFpXCJdJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKG4gPT4gJChuKS52YWwoKSkuZmlsdGVyKHAgPT4gcCk7XG4gICAgbGV0IGhvbmdwYWkgICAgPSAkKCdpbnB1dFtuYW1lPVwiaG9uZ3BhaVwiXScpLnByb3AoJ2NoZWNrZWQnKTtcblxuICAgIGxldCBzaG91cGFpID0gTWFqaWFuZy5TaG91cGFpLmZyb21TdHJpbmcocGFpc3RyKTtcbiAgICBwYWlzdHIgPSBzaG91cGFpLnRvU3RyaW5nKCk7XG4gICAgaWYgKCEgaG9uZ3BhaSkgcGFpc3RyID0gcGFpc3RyLnJlcGxhY2UoLzAvLCc1Jyk7XG5cbiAgICBjb25zdCBhbmFseXplciA9IGluaXRfYW5hbHl6ZXIocGFpc3RyLCB6aHVhbmdmZW5nLCBtZW5mZW5nLCBiYW9wYWksIGhvbmdwYWlcbiAgICAgICAgICAgICAgICAgICAgICAgID8geyBtOiAxLCBwOiAxLCBzOiAxIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogeyBtOiAwLCBwOiAwLCBzOiAwIH0pO1xuXG4gICAgaWYgKHNob3VwYWkuX3ppbW8pIHtcbiAgICAgICAgaWYgKHNob3VwYWkuX3ppbW8ubGVuZ3RoID09IDIpXG4gICAgICAgICAgICAgICAgYW5hbHl6ZXIuYWN0aW9uX3ppbW8oeyBsOiBtZW5mZW5nLCBwOiBzaG91cGFpLl96aW1vIH0pO1xuICAgICAgICBlbHNlICAgIGFuYWx5emVyLmFjdGlvbl9mdWxvdSh7IGw6IG1lbmZlbmcsIG06IHNob3VwYWkuX3ppbW8gfSk7XG4gICAgfVxuICAgIG5ldyBNYWppYW5nLlVJLlNoYW4oJCgnLnNoYW4nKSwgcGFpLCBhbmFseXplci5zaGFuKS5yZWRyYXcoKTtcbiAgICBuZXcgTWFqaWFuZy5VSS5TaG91cGFpKCQoJy5zaG91cGFpJyksIHBhaSwgYW5hbHl6ZXIuc2hvdXBhaSkucmVkcmF3KHRydWUpO1xuXG4gICAgZmFkZUluKCQoJy5zaGFuLCAuc2hvdXBhaSwgLmFuYWx5emVyJykpO1xuXG4gICAgcGFpc3RyID0gYW5hbHl6ZXIuc2hvdXBhaS50b1N0cmluZygpO1xuICAgIGJhb3BhaSA9IGFuYWx5emVyLnNoYW4uYmFvcGFpO1xuICAgICQoJ2lucHV0W25hbWU9XCJwYWlzdHJcIl0nKS52YWwocGFpc3RyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwiYmFvcGFpXCJdJykuZXEoaSkudmFsKGJhb3BhaVtpXSB8fCAnJyk7XG4gICAgfVxuXG4gICAgbGV0IGZyYWdtZW50ID0gJyMnXG4gICAgICAgICAgICAgICAgICsgWyBwYWlzdHIsIHpodWFuZ2ZlbmcsIG1lbmZlbmcsIGJhb3BhaS5qb2luKCcsJyldLmpvaW4oJy8nKTtcbiAgICBpZiAoISBob25ncGFpKSBmcmFnbWVudCArPSAnLzEnO1xuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKCcnLCAnJywgZnJhZ21lbnQpXG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbiQoZnVuY3Rpb24oKXtcblxuICAgIHBhaSA9IE1hamlhbmcuVUkucGFpKCcjbG9hZGRhdGEnKTtcblxuICAgICQoJ2Zvcm0nKS5vbignc3VibWl0Jywgc3VibWl0KTtcblxuICAgICQoJ2Zvcm0nKS5vbigncmVzZXQnLCBmdW5jdGlvbigpe1xuICAgICAgICBoaWRlKCQoJy5zaGFuLCAuc2hvdXBhaSwgLmFuYWx5emVyJykpO1xuICAgICAgICAkKCdmb3JtIGlucHV0W25hbWU9XCJwYWlzdHJcIl0nKS5mb2N1cygpO1xuICAgIH0pO1xuXG4gICAgbGV0IGZyYWdtZW50ID0gbG9jYXRpb24uaGFzaC5yZXBsYWNlKC9eIy8sJycpO1xuICAgIGluaXQoZnJhZ21lbnQpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=