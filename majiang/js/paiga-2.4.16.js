/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*************************!*\
  !*** ./src/js/paiga.js ***!
  \*************************/
/*!
 *  電脳麻将: 牌画入力 v2.4.16
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */


const example = 'このような記述ができます。\n'
              + '{s067z1 z1}(ツモ) {p2-13} {z66=6-6} {_z77_} {  }(ドラ){m1}';

const imgbase = 'https://kobalab.github.io/paiga/';
const img = {
    _:  'ura.gif',

    m0: 'man5red.gif',
    m1: 'man1.gif', m2: 'man2.gif', m3: 'man3.gif',
    m4: 'man4.gif', m5: 'man5.gif', m6: 'man6.gif',
    m7: 'man7.gif', m8: 'man8.gif', m9: 'man9.gif',

    p0: 'pin5red.gif',
    p1: 'pin1.gif', p2: 'pin2.gif', p3: 'pin3.gif',
    p4: 'pin4.gif', p5: 'pin5.gif', p6: 'pin6.gif',
    p7: 'pin7.gif', p8: 'pin8.gif', p9: 'pin9.gif',

    s0: 'sou5red.gif',
    s1: 'sou1.gif', s2: 'sou2.gif', s3: 'sou3.gif',
    s4: 'sou4.gif', s5: 'sou5.gif', s6: 'sou6.gif',
    s7: 'sou7.gif', s8: 'sou8.gif', s9: 'sou9.gif',

    z1: 'ton.gif',  z2: 'nan.gif',  z3: 'sha.gif',  z4: 'pei.gif',
    z5: 'haku.gif', z6: 'hatu.gif', z7: 'tyun.gif',

    m0_: 'yman5red.gif',
    m1_: 'yman1.gif', m2_: 'yman2.gif', m3_: 'yman3.gif',
    m4_: 'yman4.gif', m5_: 'yman5.gif', m6_: 'yman6.gif',
    m7_: 'yman7.gif', m8_: 'yman8.gif', m9_: 'yman9.gif',

    p0_: 'ypin5red.gif',
    p1_: 'ypin1.gif', p2_: 'ypin2.gif', p3_: 'ypin3.gif',
    p4_: 'ypin4.gif', p5_: 'ypin5.gif', p6_: 'ypin6.gif',
    p7_: 'ypin7.gif', p8_: 'ypin8.gif', p9_: 'ypin9.gif',

    s0_: 'ysou5red.gif',
    s1_: 'ysou1.gif', s2_: 'ysou2.gif', s3_: 'ysou3.gif',
    s4_: 'ysou4.gif', s5_: 'ysou5.gif', s6_: 'ysou6.gif',
    s7_: 'ysou7.gif', s8_: 'ysou8.gif', s9_: 'ysou9.gif',

    z1_: 'yton.gif',  z2_: 'ynan.gif',  z3_: 'ysha.gif',  z4_: 'ypei.gif',
    z5_: 'yhaku.gif', z6_: 'yhatu.gif', z7_: 'ytyun.gif'
};

function markup(paistr, w, h) {

    let url, v = 0;
    let html = '<span style="white-space:pre;">';

    for (let pai of paistr.match(/[mpsz](?:\d+[\-\=]?)+|[ _]|.+/g)||[]) {

        if (pai == ' ') {
            html += ' ';
        }
        else if (pai == '_') {
            url = imgbase + img._;
            html += `<img src="${url}" width="${w}" height="${h}"`
                  + ` alt="${pai}">`;
        }
        else if (pai.match(/^[mpsz](?:\d+[\-\=]?)+/)) {
            let s = pai[0];
            for (let n of pai.match(/\d[\-\=]?/g)) {
                let d = n[1]||''; n = n[0];
                if (d == '=' && ! v) {
                    html += `<span style="display:inline-block;width:${h}px">`;
                    v = 1;
                }
                if (d || v) {
                    url = imgbase + img[s+n+'_'];
                    if (d == '=') {
                        html += `<img src="${url}" width="${h}" height="${w}"`
                              + ` style="vertical-align:bottom;display:block"`
                              + ` alt="${s+n+'='}">`;
                    }
                    else {
                        html += `<img src="${url}" width="${h}" height="${w}"`
                              + ` alt="${s+n+'-'}">`;
                    }
                }
                else {
                    url = imgbase + img[s+n];
                    html += `<img src="${url}" width="${w}" height="${h}"`
                          + ` alt="${s+n}">`;
                }
                if (d != '=') {
                    if (v) html += '</span>';
                    v = 0;
                }
            }
        }
        else {
            html += `<span style="color:red;">${pai}</span>`;
        }
    }
    if (v) html += '</span>';
    html += '</span>';
    return html;
}

function parse(text, w, h) {
    return text.replace(/\\.|{(.+?)}/g, (match, mark)=>
        match[0] == '\\' ? match.slice(1)
                         : markup(mark, w, h)
    );
}

$(function(){

    $('textarea[name="text"]').val(example).focus();

    $('form').on('submit', ()=>{

        let [ , w, h ] = $('input[name="size"]:checked').val()
                                                        .match(/^(\d+)x(\d+)$/);
        let text = $('textarea[name="text"]').val();
        let html = parse(text, w, h);
        $('.paiga div')
            .empty()
            .append($(`<p  style="white-space:pre-line">${html}</p>`));
        $('.paiga textarea').val(html).select();

        return false;
    });

    $('form').on('reset', ()=>{
        $('.paiga div').empty();
        $('.paiga textarea').val('');
        $('textarea[name="text"]').focus();
    });
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpZ2EtMi40LjE2LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFYjtBQUNBLGtCQUFrQixVQUFVLE1BQU0sUUFBUSxVQUFVLFdBQVcsS0FBSyxHQUFHOztBQUV2RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw2Q0FBNkM7O0FBRTdDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsSUFBSSxXQUFXLEVBQUUsWUFBWSxFQUFFO0FBQ2hFLDZCQUE2QixJQUFJO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0EsK0RBQStELFFBQVEsRUFBRTtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLElBQUksV0FBVyxFQUFFLFlBQVksRUFBRTtBQUM1RSwrREFBK0Q7QUFDL0QseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBLDZDQUE2QyxJQUFJLFdBQVcsRUFBRSxZQUFZLEVBQUU7QUFDNUUseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsSUFBSSxXQUFXLEVBQUUsWUFBWSxFQUFFO0FBQ3hFLHFDQUFxQyxJQUFJO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsSUFBSSxJQUFJO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QixNQUFNO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCxLQUFLO0FBQy9EOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFqaWFuZy8uL3NyYy9qcy9wYWlnYS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqICDpm7vohLPpurvlsIY6IOeJjOeUu+WFpeWKmyB2Mi40LjE2XG4gKlxuICogIENvcHlyaWdodChDKSAyMDE3IFNhdG9zaGkgS29iYXlhc2hpXG4gKiAgUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL2tvYmFsYWIvTWFqaWFuZy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBleGFtcGxlID0gJ+OBk+OBruOCiOOBhuOBquiomOi/sOOBjOOBp+OBjeOBvuOBmeOAglxcbidcbiAgICAgICAgICAgICAgKyAne3MwNjd6MSB6MX0o44OE44OiKSB7cDItMTN9IHt6NjY9Ni02fSB7X3o3N199IHsgIH0o44OJ44OpKXttMX0nO1xuXG5jb25zdCBpbWdiYXNlID0gJ2h0dHBzOi8va29iYWxhYi5naXRodWIuaW8vcGFpZ2EvJztcbmNvbnN0IGltZyA9IHtcbiAgICBfOiAgJ3VyYS5naWYnLFxuXG4gICAgbTA6ICdtYW41cmVkLmdpZicsXG4gICAgbTE6ICdtYW4xLmdpZicsIG0yOiAnbWFuMi5naWYnLCBtMzogJ21hbjMuZ2lmJyxcbiAgICBtNDogJ21hbjQuZ2lmJywgbTU6ICdtYW41LmdpZicsIG02OiAnbWFuNi5naWYnLFxuICAgIG03OiAnbWFuNy5naWYnLCBtODogJ21hbjguZ2lmJywgbTk6ICdtYW45LmdpZicsXG5cbiAgICBwMDogJ3BpbjVyZWQuZ2lmJyxcbiAgICBwMTogJ3BpbjEuZ2lmJywgcDI6ICdwaW4yLmdpZicsIHAzOiAncGluMy5naWYnLFxuICAgIHA0OiAncGluNC5naWYnLCBwNTogJ3BpbjUuZ2lmJywgcDY6ICdwaW42LmdpZicsXG4gICAgcDc6ICdwaW43LmdpZicsIHA4OiAncGluOC5naWYnLCBwOTogJ3BpbjkuZ2lmJyxcblxuICAgIHMwOiAnc291NXJlZC5naWYnLFxuICAgIHMxOiAnc291MS5naWYnLCBzMjogJ3NvdTIuZ2lmJywgczM6ICdzb3UzLmdpZicsXG4gICAgczQ6ICdzb3U0LmdpZicsIHM1OiAnc291NS5naWYnLCBzNjogJ3NvdTYuZ2lmJyxcbiAgICBzNzogJ3NvdTcuZ2lmJywgczg6ICdzb3U4LmdpZicsIHM5OiAnc291OS5naWYnLFxuXG4gICAgejE6ICd0b24uZ2lmJywgIHoyOiAnbmFuLmdpZicsICB6MzogJ3NoYS5naWYnLCAgejQ6ICdwZWkuZ2lmJyxcbiAgICB6NTogJ2hha3UuZ2lmJywgejY6ICdoYXR1LmdpZicsIHo3OiAndHl1bi5naWYnLFxuXG4gICAgbTBfOiAneW1hbjVyZWQuZ2lmJyxcbiAgICBtMV86ICd5bWFuMS5naWYnLCBtMl86ICd5bWFuMi5naWYnLCBtM186ICd5bWFuMy5naWYnLFxuICAgIG00XzogJ3ltYW40LmdpZicsIG01XzogJ3ltYW41LmdpZicsIG02XzogJ3ltYW42LmdpZicsXG4gICAgbTdfOiAneW1hbjcuZ2lmJywgbThfOiAneW1hbjguZ2lmJywgbTlfOiAneW1hbjkuZ2lmJyxcblxuICAgIHAwXzogJ3lwaW41cmVkLmdpZicsXG4gICAgcDFfOiAneXBpbjEuZ2lmJywgcDJfOiAneXBpbjIuZ2lmJywgcDNfOiAneXBpbjMuZ2lmJyxcbiAgICBwNF86ICd5cGluNC5naWYnLCBwNV86ICd5cGluNS5naWYnLCBwNl86ICd5cGluNi5naWYnLFxuICAgIHA3XzogJ3lwaW43LmdpZicsIHA4XzogJ3lwaW44LmdpZicsIHA5XzogJ3lwaW45LmdpZicsXG5cbiAgICBzMF86ICd5c291NXJlZC5naWYnLFxuICAgIHMxXzogJ3lzb3UxLmdpZicsIHMyXzogJ3lzb3UyLmdpZicsIHMzXzogJ3lzb3UzLmdpZicsXG4gICAgczRfOiAneXNvdTQuZ2lmJywgczVfOiAneXNvdTUuZ2lmJywgczZfOiAneXNvdTYuZ2lmJyxcbiAgICBzN186ICd5c291Ny5naWYnLCBzOF86ICd5c291OC5naWYnLCBzOV86ICd5c291OS5naWYnLFxuXG4gICAgejFfOiAneXRvbi5naWYnLCAgejJfOiAneW5hbi5naWYnLCAgejNfOiAneXNoYS5naWYnLCAgejRfOiAneXBlaS5naWYnLFxuICAgIHo1XzogJ3loYWt1LmdpZicsIHo2XzogJ3loYXR1LmdpZicsIHo3XzogJ3l0eXVuLmdpZidcbn07XG5cbmZ1bmN0aW9uIG1hcmt1cChwYWlzdHIsIHcsIGgpIHtcblxuICAgIGxldCB1cmwsIHYgPSAwO1xuICAgIGxldCBodG1sID0gJzxzcGFuIHN0eWxlPVwid2hpdGUtc3BhY2U6cHJlO1wiPic7XG5cbiAgICBmb3IgKGxldCBwYWkgb2YgcGFpc3RyLm1hdGNoKC9bbXBzel0oPzpcXGQrW1xcLVxcPV0/KSt8WyBfXXwuKy9nKXx8W10pIHtcblxuICAgICAgICBpZiAocGFpID09ICcgJykge1xuICAgICAgICAgICAgaHRtbCArPSAnICc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGFpID09ICdfJykge1xuICAgICAgICAgICAgdXJsID0gaW1nYmFzZSArIGltZy5fO1xuICAgICAgICAgICAgaHRtbCArPSBgPGltZyBzcmM9XCIke3VybH1cIiB3aWR0aD1cIiR7d31cIiBoZWlnaHQ9XCIke2h9XCJgXG4gICAgICAgICAgICAgICAgICArIGAgYWx0PVwiJHtwYWl9XCI+YDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwYWkubWF0Y2goL15bbXBzel0oPzpcXGQrW1xcLVxcPV0/KSsvKSkge1xuICAgICAgICAgICAgbGV0IHMgPSBwYWlbMF07XG4gICAgICAgICAgICBmb3IgKGxldCBuIG9mIHBhaS5tYXRjaCgvXFxkW1xcLVxcPV0/L2cpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGQgPSBuWzFdfHwnJzsgbiA9IG5bMF07XG4gICAgICAgICAgICAgICAgaWYgKGQgPT0gJz0nICYmICEgdikge1xuICAgICAgICAgICAgICAgICAgICBodG1sICs9IGA8c3BhbiBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOiR7aH1weFwiPmA7XG4gICAgICAgICAgICAgICAgICAgIHYgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZCB8fCB2KSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGltZ2Jhc2UgKyBpbWdbcytuKydfJ107XG4gICAgICAgICAgICAgICAgICAgIGlmIChkID09ICc9Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBgPGltZyBzcmM9XCIke3VybH1cIiB3aWR0aD1cIiR7aH1cIiBoZWlnaHQ9XCIke3d9XCJgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGAgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjpib3R0b207ZGlzcGxheTpibG9ja1wiYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBgIGFsdD1cIiR7cytuKyc9J31cIj5gO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBgPGltZyBzcmM9XCIke3VybH1cIiB3aWR0aD1cIiR7aH1cIiBoZWlnaHQ9XCIke3d9XCJgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGAgYWx0PVwiJHtzK24rJy0nfVwiPmA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGltZ2Jhc2UgKyBpbWdbcytuXTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBgPGltZyBzcmM9XCIke3VybH1cIiB3aWR0aD1cIiR7d31cIiBoZWlnaHQ9XCIke2h9XCJgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgYCBhbHQ9XCIke3Mrbn1cIj5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZCAhPSAnPScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYpIGh0bWwgKz0gJzwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgICAgICB2ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBodG1sICs9IGA8c3BhbiBzdHlsZT1cImNvbG9yOnJlZDtcIj4ke3BhaX08L3NwYW4+YDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodikgaHRtbCArPSAnPC9zcGFuPic7XG4gICAgaHRtbCArPSAnPC9zcGFuPic7XG4gICAgcmV0dXJuIGh0bWw7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKHRleHQsIHcsIGgpIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcLnx7KC4rPyl9L2csIChtYXRjaCwgbWFyayk9PlxuICAgICAgICBtYXRjaFswXSA9PSAnXFxcXCcgPyBtYXRjaC5zbGljZSgxKVxuICAgICAgICAgICAgICAgICAgICAgICAgIDogbWFya3VwKG1hcmssIHcsIGgpXG4gICAgKTtcbn1cblxuJChmdW5jdGlvbigpe1xuXG4gICAgJCgndGV4dGFyZWFbbmFtZT1cInRleHRcIl0nKS52YWwoZXhhbXBsZSkuZm9jdXMoKTtcblxuICAgICQoJ2Zvcm0nKS5vbignc3VibWl0JywgKCk9PntcblxuICAgICAgICBsZXQgWyAsIHcsIGggXSA9ICQoJ2lucHV0W25hbWU9XCJzaXplXCJdOmNoZWNrZWQnKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWF0Y2goL14oXFxkKyl4KFxcZCspJC8pO1xuICAgICAgICBsZXQgdGV4dCA9ICQoJ3RleHRhcmVhW25hbWU9XCJ0ZXh0XCJdJykudmFsKCk7XG4gICAgICAgIGxldCBodG1sID0gcGFyc2UodGV4dCwgdywgaCk7XG4gICAgICAgICQoJy5wYWlnYSBkaXYnKVxuICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgIC5hcHBlbmQoJChgPHAgIHN0eWxlPVwid2hpdGUtc3BhY2U6cHJlLWxpbmVcIj4ke2h0bWx9PC9wPmApKTtcbiAgICAgICAgJCgnLnBhaWdhIHRleHRhcmVhJykudmFsKGh0bWwpLnNlbGVjdCgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgICQoJ2Zvcm0nKS5vbigncmVzZXQnLCAoKT0+e1xuICAgICAgICAkKCcucGFpZ2EgZGl2JykuZW1wdHkoKTtcbiAgICAgICAgJCgnLnBhaWdhIHRleHRhcmVhJykudmFsKCcnKTtcbiAgICAgICAgJCgndGV4dGFyZWFbbmFtZT1cInRleHRcIl0nKS5mb2N1cygpO1xuICAgIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=