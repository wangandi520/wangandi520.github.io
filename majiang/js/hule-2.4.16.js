/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/conf/rule.json":
/*!*******************************!*\
  !*** ./src/js/conf/rule.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"Mリーグルール":{"配給原点":25000,"順位点":["+30.0","+10.0","-10.0","-30.0"],"赤牌":{"m":1,"p":1,"s":1},"連風牌は2符":true,"クイタンあり":true,"喰い替え許可レベル":0,"場数":2,"途中流局あり":false,"流し満貫あり":false,"ノーテン宣言あり":true,"ノーテン罰あり":true,"最大同時和了数":1,"連荘方式":2,"トビ終了あり":false,"オーラス止めあり":false,"延長戦方式":0,"一発あり":true,"裏ドラあり":true,"カンドラあり":true,"カン裏あり":true,"カンドラ後乗せ":false,"ツモ番なしリーチあり":true,"リーチ後暗槓許可レベル":1,"ダブル役満あり":false,"役満の複合あり":true,"数え役満あり":false,"役満パオあり":true,"切り上げ満貫あり":true},"Classicルール":{"配給原点":30000,"順位点":["+12.0","+4.0","-4.0","-12.0"],"赤牌":{"m":0,"p":0,"s":0},"連風牌は2符":false,"クイタンあり":true,"喰い替え許可レベル":2,"場数":2,"途中流局あり":false,"流し満貫あり":false,"ノーテン宣言あり":false,"ノーテン罰あり":false,"最大同時和了数":1,"連荘方式":1,"トビ終了あり":false,"オーラス止めあり":false,"延長戦方式":0,"一発あり":false,"裏ドラあり":false,"カンドラあり":false,"カン裏あり":false,"カンドラ後乗せ":false,"ツモ番なしリーチあり":true,"リーチ後暗槓許可レベル":0,"ダブル役満あり":false,"役満の複合あり":false,"数え役満あり":false,"役満パオあり":false,"切り上げ満貫あり":false}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/*!************************!*\
  !*** ./src/js/hule.js ***!
  \************************/
/*!
 *  電脳麻将: 和了点計算 v2.4.16
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */


const { hide, show, fadeIn, fadeOut } = Majiang.UI.Util;

const preset = __webpack_require__(/*! ./conf/rule.json */ "./src/js/conf/rule.json");
const view = {};

function init(fragment) {

    if (fragment) {

        let [ paistr, baopai, fubaopai, zimo, zhuangfeng, menfeng,
              lizhi, yifa, haidi, lingshang, qianggang, tianhu, rule ]
                    = fragment.split(/\//);
        baopai   = (baopai   || '').split(/,/);
        fubaopai = (fubaopai || '').split(/,/);
        rule     = decodeURIComponent(rule||'');

        $('input[name="paistr"]').val(paistr);
        for (let i = 0; i < baopai.length; i++) {
            $('input[name="baopai"]').eq(i).val(baopai[i]);
        }
        for (let i = 0; i < fubaopai.length; i++) {
            $('input[name="fubaopai"]').eq(i).val(fubaopai[i]);
        }
        $(`input[name="zimo"][value="${zimo}"]`).click();
        $('select[name="zhuangfeng"]').val(zhuangfeng || 0);
        $('select[name="menfeng"]').val(menfeng || 0);
        $(`input[name="lizhi"][value="${lizhi}"]`).click();
        if (+yifa)      $('input[name="yifa"]').click();
        if (+haidi)     $('input[name="haidi"]').click();
        if (+lingshang) $('input[name="lingshang"]').click();
        if (+qianggang) $('input[name="qianggang"]').click();
        if (+tianhu)    $('input[name="tianhu"]').click();
        if (rule)       $('select[name="rule"]').val(rule);

        $('form').submit();
    }
    else {
        let paistr = 'm123p123z1z1,s1-23,z222=';
        let baopai = ['z1'];

        $('input[name="paistr"]').val(paistr).focus();
        for (let i = 0; i < baopai.length; i++) {
            $('input[name="baopai"]').eq(i).val(baopai[i]);
        }
    }
}

function submit() {

    let paistr = $('input[name="paistr"]').val();
    if (! paistr) {
        return false;
    }
    let shoupai = Majiang.Shoupai.fromString(paistr);
    $('input[name="paistr"]').val(shoupai.toString());

    let rongpai;
    if ($('input[name="zimo"]:checked').val() == 0) {
        if (shoupai._zimo) {
            rongpai = shoupai._zimo + '=';
            shoupai.dapai(shoupai._zimo);
        }
    }

    if (! shoupai.menqian) {
        $('input[name="lizhi"]').prop('checked', false);
        $('input[name="fubaopai"]').parent().addClass('hide');
        $('input[name="yifa"]').prop('checked', false)
                               .prop('disabled', true);
        $('input[name="tianhu"]').prop('checked', false);
    }
    if (! shoupai._fulou
            .find(m=>m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1.*\1.*$/)))
    {
        $('input[name="lingshang"]').prop('checked', false);
    }

    let baopai   = $.makeArray($('input[name="baopai"]'))
                        .map(n => Majiang.Shoupai.valid_pai($(n).val()))
                        .filter(p => p);
    let fubaopai = $.makeArray($('input[name="fubaopai"]'))
                        .map(n => Majiang.Shoupai.valid_pai($(n).val()))
                        .filter(p => p);

    let lizhi = + $('input[name="lizhi"]:checked').val() || 0;

    let rule = $('select[name="rule"]').val();
    rule = ! rule      ? {}
         : rule == '-' ? JSON.parse(localStorage.getItem('Majiang.rule')||'{}')
         :               preset[rule];
    rule = Majiang.rule(rule);

    if (! rule['一発あり']) {
        $('input[name="yifa"]').prop('checked', false);
    }
    if (! rule['カンドラあり']) {
        while (baopai.length > 1) baopai.pop();
        while (fubaopai.length > 1) fubaopai.pop();
    }
    if (! rule['カン裏あり']) {
        while (fubaopai.length > 1) fubaopai.pop();
    }
    if (! rule['裏ドラあり']) {
        fubaopai = null;
    }

    let param = {
        rule:       rule,
        zhuangfeng: + $('select[name="zhuangfeng"]').val(),
        menfeng:    + $('select[name="menfeng"]').val(),
        hupai: {
            lizhi:      lizhi,
            yifa:       $('input[name="yifa"]').prop('checked'),
            qianggang:  $('input[name="qianggang"]').prop('checked'),
            lingshang:  $('input[name="lingshang"]').prop('checked'),
            haidi:      ! $('input[name="haidi"]').prop('checked') ? 0
                            : ! rongpai                            ? 1
                            :                                        2,
            tianhu:     + $('input[name="tianhu"]:checked').val() || 0,
        },
        baopai:     baopai,
        fubaopai:   lizhi ? fubaopai : null,
        jicun:      { changbang: 0, lizhibang: 0 }
    };

    let hule = Majiang.Util.hule(shoupai, rongpai, param) || {};

    const model = {
        player: ['','','',''],
        defen:  [0,0,0,0],
        changbang: param.jicun.changbang,
        lizhibang: param.jicun.lizhibang,
        shan: {
            baopai:   param.baopai,
            fubaopai: param.fubaopai,
            paishu:   0
        },
        player_id:  [0,1,2,3],
    };
    const paipu = {
        l:          param.menfeng,
        shoupai:    paistr,
        baojia:     rongpai ? (param.menfeng + 2) % 4 : null,
        fubaopai:   param.fubaopai,
        fu:         hule.fu,
        fanshu:     hule.fanshu,
        damanguan:  hule.damanguan,
        defen:      hule.defen,
        hupai:      hule.hupai,
        fenpei:     hule.fenpei,
    };

    new Majiang.UI.HuleDialog($('.hule-dialog'), view.pai, model).hule(paipu);
    fadeIn($('.hule-dialog'));

    $('input[name="baopai"]').val('');
    for (let i = 0; i < baopai.length; i++) {
        $('input[name="baopai"]').eq(i).val(baopai[i]);
    }
    $('input[name="fubaopai"]').val('');
    if (! fubaopai) fubaopai = [];
    for (let i = 0; i < fubaopai.length; i++) {
        $('input[name="fubaopai"]').eq(i).val(fubaopai[i]);
    }

    let fragment = '#' + [
                    paistr,
                    baopai.join(','),
                    fubaopai.join(','),
                    $('input[name="zimo"]:checked').val(),
                    $('select[name="zhuangfeng"]').val(),
                    $('select[name="menfeng"]').val(),
                    $('input[name="lizhi"]:checked').val(),
                    + $('input[name="yifa"]').prop('checked'),
                    + $('input[name="haidi"]').prop('checked'),
                    + $('input[name="lingshang"]').prop('checked'),
                    + $('input[name="qianggang"]').prop('checked'),
                    + $('input[name="tianhu"]:checked').val() || 0
                ].join('/');
    rule = $('select[name="rule"]').val();
    if (rule) fragment += `/${rule}`;

    if (rule == '-')
            history.replaceState('', '', location.href.replace(/#.*$/,''));
    else    history.replaceState('', '', fragment);

    return false;
}

$(function(){

    view.pai = Majiang.UI.pai('#loaddata');

    for (let key of Object.keys(preset)) {
        $('select[name="rule"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="rule"]').append($('<option>')
                                .val('-').text('カスタムルール'));
    }

    $('form').on('submit', submit);

    $('form').on('reset', function(){
        hide($('.hule-dialog'));
        $('input[name="fubaopai"]').parent().addClass('hide');
        $('input[name="tianhu"]').next().text('地和');
        $('input[name="tianhu"]').val(2);
        $('form input[name="paistr"]').focus();
    });

    $('input[name="zimo"]').on('change', function(){
        if ($(this, ':checked').val() == 1) {
            $('input[name="qianggang"]').prop('checked', false);
        }
        else {
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
        }
    });
    $('select[name="menfeng"]').on('change', function(){
        if ($(this, ':selected').val() == 0) {
            $('input[name="tianhu"]').next().text('天和');
            $('input[name="tianhu"]').val(1);
        }
        else {
            $('input[name="tianhu"]').next().text('地和');
            $('input[name="tianhu"]').val(2);
        }
    });
    $('input[name="lizhi"]').on('change', function(){
        if ($(this).prop('checked')) {
            let val = $(this).val() == 1 ? 2 : 1;
            $(`input[name="lizhi"][value="${val}"]`).prop('checked', false);
            $('input[name="fubaopai"]').parent().removeClass('hide');
            $('input[name="yifa"]').prop('disabled', false);
            $('input[name="tianhu"]').prop('checked', false);
        }
        else {
            $('input[name="fubaopai"]').parent().addClass('hide');
            $('input[name="yifa"]').prop('checked', false)
                                   .prop('disabled', true);
        }
    });
    $('input[name="yifa"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="lingshang"]').prop('checked', false);
        }
    });
    $('input[name="haidi"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="qianggang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
        }
    });
    $('input[name="lingshang"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="yifa"]').prop('checked', false);
            $('input[name="haidi"]').prop('checked', false);
            $('input[name="qianggang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
            $('input[name="zimo"][value="1"]').click();
        }
    });
    $('input[name="qianggang"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="haidi"]').prop('checked', false);
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
            $('input[name="zimo"][value="0"]').click();
        }
    });
    $('input[name="tianhu"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="lizhi"]').prop('checked', false);
            $('input[name="fubaopai"]').parent().addClass('hide');
            $('input[name="yifa"]').prop('checked', false)
                                   .prop('disabled', true);
            $('input[name="haidi"]').prop('checked', false);
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="qianggang"]').prop('checked', false);
            $('input[name="zimo"][value="1"]').click();
        }
    });

    let fragment = location.hash.replace(/^#/,'');
    init(fragment);
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Oi8vbWFqaWFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tYWppYW5nLy4vc3JjL2pzL2h1bGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8qIVxuICogIOmbu+iEs+m6u+Wwhjog5ZKM5LqG54K56KiI566XIHYyLjQuMTZcbiAqXG4gKiAgQ29weXJpZ2h0KEMpIDIwMTcgU2F0b3NoaSBLb2JheWFzaGlcbiAqICBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqICBodHRwczovL2dpdGh1Yi5jb20va29iYWxhYi9NYWppYW5nL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IHsgaGlkZSwgc2hvdywgZmFkZUluLCBmYWRlT3V0IH0gPSBNYWppYW5nLlVJLlV0aWw7XG5cbmNvbnN0IHByZXNldCA9IHJlcXVpcmUoJy4vY29uZi9ydWxlLmpzb24nKTtcbmNvbnN0IHZpZXcgPSB7fTtcblxuZnVuY3Rpb24gaW5pdChmcmFnbWVudCkge1xuXG4gICAgaWYgKGZyYWdtZW50KSB7XG5cbiAgICAgICAgbGV0IFsgcGFpc3RyLCBiYW9wYWksIGZ1YmFvcGFpLCB6aW1vLCB6aHVhbmdmZW5nLCBtZW5mZW5nLFxuICAgICAgICAgICAgICBsaXpoaSwgeWlmYSwgaGFpZGksIGxpbmdzaGFuZywgcWlhbmdnYW5nLCB0aWFuaHUsIHJ1bGUgXVxuICAgICAgICAgICAgICAgICAgICA9IGZyYWdtZW50LnNwbGl0KC9cXC8vKTtcbiAgICAgICAgYmFvcGFpICAgPSAoYmFvcGFpICAgfHwgJycpLnNwbGl0KC8sLyk7XG4gICAgICAgIGZ1YmFvcGFpID0gKGZ1YmFvcGFpIHx8ICcnKS5zcGxpdCgvLC8pO1xuICAgICAgICBydWxlICAgICA9IGRlY29kZVVSSUNvbXBvbmVudChydWxlfHwnJyk7XG5cbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cInBhaXN0clwiXScpLnZhbChwYWlzdHIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhb3BhaS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImJhb3BhaVwiXScpLmVxKGkpLnZhbChiYW9wYWlbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnViYW9wYWkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJmdWJhb3BhaVwiXScpLmVxKGkpLnZhbChmdWJhb3BhaVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgJChgaW5wdXRbbmFtZT1cInppbW9cIl1bdmFsdWU9XCIke3ppbW99XCJdYCkuY2xpY2soKTtcbiAgICAgICAgJCgnc2VsZWN0W25hbWU9XCJ6aHVhbmdmZW5nXCJdJykudmFsKHpodWFuZ2ZlbmcgfHwgMCk7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwibWVuZmVuZ1wiXScpLnZhbChtZW5mZW5nIHx8IDApO1xuICAgICAgICAkKGBpbnB1dFtuYW1lPVwibGl6aGlcIl1bdmFsdWU9XCIke2xpemhpfVwiXWApLmNsaWNrKCk7XG4gICAgICAgIGlmICgreWlmYSkgICAgICAkKCdpbnB1dFtuYW1lPVwieWlmYVwiXScpLmNsaWNrKCk7XG4gICAgICAgIGlmICgraGFpZGkpICAgICAkKCdpbnB1dFtuYW1lPVwiaGFpZGlcIl0nKS5jbGljaygpO1xuICAgICAgICBpZiAoK2xpbmdzaGFuZykgJCgnaW5wdXRbbmFtZT1cImxpbmdzaGFuZ1wiXScpLmNsaWNrKCk7XG4gICAgICAgIGlmICgrcWlhbmdnYW5nKSAkKCdpbnB1dFtuYW1lPVwicWlhbmdnYW5nXCJdJykuY2xpY2soKTtcbiAgICAgICAgaWYgKCt0aWFuaHUpICAgICQoJ2lucHV0W25hbWU9XCJ0aWFuaHVcIl0nKS5jbGljaygpO1xuICAgICAgICBpZiAocnVsZSkgICAgICAgJCgnc2VsZWN0W25hbWU9XCJydWxlXCJdJykudmFsKHJ1bGUpO1xuXG4gICAgICAgICQoJ2Zvcm0nKS5zdWJtaXQoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBwYWlzdHIgPSAnbTEyM3AxMjN6MXoxLHMxLTIzLHoyMjI9JztcbiAgICAgICAgbGV0IGJhb3BhaSA9IFsnejEnXTtcblxuICAgICAgICAkKCdpbnB1dFtuYW1lPVwicGFpc3RyXCJdJykudmFsKHBhaXN0cikuZm9jdXMoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiYW9wYWkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJiYW9wYWlcIl0nKS5lcShpKS52YWwoYmFvcGFpW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc3VibWl0KCkge1xuXG4gICAgbGV0IHBhaXN0ciA9ICQoJ2lucHV0W25hbWU9XCJwYWlzdHJcIl0nKS52YWwoKTtcbiAgICBpZiAoISBwYWlzdHIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgc2hvdXBhaSA9IE1hamlhbmcuU2hvdXBhaS5mcm9tU3RyaW5nKHBhaXN0cik7XG4gICAgJCgnaW5wdXRbbmFtZT1cInBhaXN0clwiXScpLnZhbChzaG91cGFpLnRvU3RyaW5nKCkpO1xuXG4gICAgbGV0IHJvbmdwYWk7XG4gICAgaWYgKCQoJ2lucHV0W25hbWU9XCJ6aW1vXCJdOmNoZWNrZWQnKS52YWwoKSA9PSAwKSB7XG4gICAgICAgIGlmIChzaG91cGFpLl96aW1vKSB7XG4gICAgICAgICAgICByb25ncGFpID0gc2hvdXBhaS5femltbyArICc9JztcbiAgICAgICAgICAgIHNob3VwYWkuZGFwYWkoc2hvdXBhaS5femltbyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoISBzaG91cGFpLm1lbnFpYW4pIHtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cImxpemhpXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cImZ1YmFvcGFpXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cInlpZmFcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICQoJ2lucHV0W25hbWU9XCJ0aWFuaHVcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAoISBzaG91cGFpLl9mdWxvdVxuICAgICAgICAgICAgLmZpbmQobT0+bS5yZXBsYWNlKC8wL2csJzUnKS5tYXRjaCgvXlttcHN6XShcXGQpXFwxXFwxLipcXDEuKiQvKSkpXG4gICAge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwibGluZ3NoYW5nXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBsZXQgYmFvcGFpICAgPSAkLm1ha2VBcnJheSgkKCdpbnB1dFtuYW1lPVwiYmFvcGFpXCJdJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKG4gPT4gTWFqaWFuZy5TaG91cGFpLnZhbGlkX3BhaSgkKG4pLnZhbCgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIocCA9PiBwKTtcbiAgICBsZXQgZnViYW9wYWkgPSAkLm1ha2VBcnJheSgkKCdpbnB1dFtuYW1lPVwiZnViYW9wYWlcIl0nKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAobiA9PiBNYWppYW5nLlNob3VwYWkudmFsaWRfcGFpKCQobikudmFsKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihwID0+IHApO1xuXG4gICAgbGV0IGxpemhpID0gKyAkKCdpbnB1dFtuYW1lPVwibGl6aGlcIl06Y2hlY2tlZCcpLnZhbCgpIHx8IDA7XG5cbiAgICBsZXQgcnVsZSA9ICQoJ3NlbGVjdFtuYW1lPVwicnVsZVwiXScpLnZhbCgpO1xuICAgIHJ1bGUgPSAhIHJ1bGUgICAgICA/IHt9XG4gICAgICAgICA6IHJ1bGUgPT0gJy0nID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnTWFqaWFuZy5ydWxlJyl8fCd7fScpXG4gICAgICAgICA6ICAgICAgICAgICAgICAgcHJlc2V0W3J1bGVdO1xuICAgIHJ1bGUgPSBNYWppYW5nLnJ1bGUocnVsZSk7XG5cbiAgICBpZiAoISBydWxlWyfkuIDnmbrjgYLjgoonXSkge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwieWlmYVwiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmICghIHJ1bGVbJ+OCq+ODs+ODieODqeOBguOCiiddKSB7XG4gICAgICAgIHdoaWxlIChiYW9wYWkubGVuZ3RoID4gMSkgYmFvcGFpLnBvcCgpO1xuICAgICAgICB3aGlsZSAoZnViYW9wYWkubGVuZ3RoID4gMSkgZnViYW9wYWkucG9wKCk7XG4gICAgfVxuICAgIGlmICghIHJ1bGVbJ+OCq+ODs+ijj+OBguOCiiddKSB7XG4gICAgICAgIHdoaWxlIChmdWJhb3BhaS5sZW5ndGggPiAxKSBmdWJhb3BhaS5wb3AoKTtcbiAgICB9XG4gICAgaWYgKCEgcnVsZVsn6KOP44OJ44Op44GC44KKJ10pIHtcbiAgICAgICAgZnViYW9wYWkgPSBudWxsO1xuICAgIH1cblxuICAgIGxldCBwYXJhbSA9IHtcbiAgICAgICAgcnVsZTogICAgICAgcnVsZSxcbiAgICAgICAgemh1YW5nZmVuZzogKyAkKCdzZWxlY3RbbmFtZT1cInpodWFuZ2ZlbmdcIl0nKS52YWwoKSxcbiAgICAgICAgbWVuZmVuZzogICAgKyAkKCdzZWxlY3RbbmFtZT1cIm1lbmZlbmdcIl0nKS52YWwoKSxcbiAgICAgICAgaHVwYWk6IHtcbiAgICAgICAgICAgIGxpemhpOiAgICAgIGxpemhpLFxuICAgICAgICAgICAgeWlmYTogICAgICAgJCgnaW5wdXRbbmFtZT1cInlpZmFcIl0nKS5wcm9wKCdjaGVja2VkJyksXG4gICAgICAgICAgICBxaWFuZ2dhbmc6ICAkKCdpbnB1dFtuYW1lPVwicWlhbmdnYW5nXCJdJykucHJvcCgnY2hlY2tlZCcpLFxuICAgICAgICAgICAgbGluZ3NoYW5nOiAgJCgnaW5wdXRbbmFtZT1cImxpbmdzaGFuZ1wiXScpLnByb3AoJ2NoZWNrZWQnKSxcbiAgICAgICAgICAgIGhhaWRpOiAgICAgICEgJCgnaW5wdXRbbmFtZT1cImhhaWRpXCJdJykucHJvcCgnY2hlY2tlZCcpID8gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogISByb25ncGFpICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMixcbiAgICAgICAgICAgIHRpYW5odTogICAgICsgJCgnaW5wdXRbbmFtZT1cInRpYW5odVwiXTpjaGVja2VkJykudmFsKCkgfHwgMCxcbiAgICAgICAgfSxcbiAgICAgICAgYmFvcGFpOiAgICAgYmFvcGFpLFxuICAgICAgICBmdWJhb3BhaTogICBsaXpoaSA/IGZ1YmFvcGFpIDogbnVsbCxcbiAgICAgICAgamljdW46ICAgICAgeyBjaGFuZ2Jhbmc6IDAsIGxpemhpYmFuZzogMCB9XG4gICAgfTtcblxuICAgIGxldCBodWxlID0gTWFqaWFuZy5VdGlsLmh1bGUoc2hvdXBhaSwgcm9uZ3BhaSwgcGFyYW0pIHx8IHt9O1xuXG4gICAgY29uc3QgbW9kZWwgPSB7XG4gICAgICAgIHBsYXllcjogWycnLCcnLCcnLCcnXSxcbiAgICAgICAgZGVmZW46ICBbMCwwLDAsMF0sXG4gICAgICAgIGNoYW5nYmFuZzogcGFyYW0uamljdW4uY2hhbmdiYW5nLFxuICAgICAgICBsaXpoaWJhbmc6IHBhcmFtLmppY3VuLmxpemhpYmFuZyxcbiAgICAgICAgc2hhbjoge1xuICAgICAgICAgICAgYmFvcGFpOiAgIHBhcmFtLmJhb3BhaSxcbiAgICAgICAgICAgIGZ1YmFvcGFpOiBwYXJhbS5mdWJhb3BhaSxcbiAgICAgICAgICAgIHBhaXNodTogICAwXG4gICAgICAgIH0sXG4gICAgICAgIHBsYXllcl9pZDogIFswLDEsMiwzXSxcbiAgICB9O1xuICAgIGNvbnN0IHBhaXB1ID0ge1xuICAgICAgICBsOiAgICAgICAgICBwYXJhbS5tZW5mZW5nLFxuICAgICAgICBzaG91cGFpOiAgICBwYWlzdHIsXG4gICAgICAgIGJhb2ppYTogICAgIHJvbmdwYWkgPyAocGFyYW0ubWVuZmVuZyArIDIpICUgNCA6IG51bGwsXG4gICAgICAgIGZ1YmFvcGFpOiAgIHBhcmFtLmZ1YmFvcGFpLFxuICAgICAgICBmdTogICAgICAgICBodWxlLmZ1LFxuICAgICAgICBmYW5zaHU6ICAgICBodWxlLmZhbnNodSxcbiAgICAgICAgZGFtYW5ndWFuOiAgaHVsZS5kYW1hbmd1YW4sXG4gICAgICAgIGRlZmVuOiAgICAgIGh1bGUuZGVmZW4sXG4gICAgICAgIGh1cGFpOiAgICAgIGh1bGUuaHVwYWksXG4gICAgICAgIGZlbnBlaTogICAgIGh1bGUuZmVucGVpLFxuICAgIH07XG5cbiAgICBuZXcgTWFqaWFuZy5VSS5IdWxlRGlhbG9nKCQoJy5odWxlLWRpYWxvZycpLCB2aWV3LnBhaSwgbW9kZWwpLmh1bGUocGFpcHUpO1xuICAgIGZhZGVJbigkKCcuaHVsZS1kaWFsb2cnKSk7XG5cbiAgICAkKCdpbnB1dFtuYW1lPVwiYmFvcGFpXCJdJykudmFsKCcnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhb3BhaS5sZW5ndGg7IGkrKykge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwiYmFvcGFpXCJdJykuZXEoaSkudmFsKGJhb3BhaVtpXSk7XG4gICAgfVxuICAgICQoJ2lucHV0W25hbWU9XCJmdWJhb3BhaVwiXScpLnZhbCgnJyk7XG4gICAgaWYgKCEgZnViYW9wYWkpIGZ1YmFvcGFpID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmdWJhb3BhaS5sZW5ndGg7IGkrKykge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwiZnViYW9wYWlcIl0nKS5lcShpKS52YWwoZnViYW9wYWlbaV0pO1xuICAgIH1cblxuICAgIGxldCBmcmFnbWVudCA9ICcjJyArIFtcbiAgICAgICAgICAgICAgICAgICAgcGFpc3RyLFxuICAgICAgICAgICAgICAgICAgICBiYW9wYWkuam9pbignLCcpLFxuICAgICAgICAgICAgICAgICAgICBmdWJhb3BhaS5qb2luKCcsJyksXG4gICAgICAgICAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJ6aW1vXCJdOmNoZWNrZWQnKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgJCgnc2VsZWN0W25hbWU9XCJ6aHVhbmdmZW5nXCJdJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICQoJ3NlbGVjdFtuYW1lPVwibWVuZmVuZ1wiXScpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwibGl6aGlcIl06Y2hlY2tlZCcpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICArICQoJ2lucHV0W25hbWU9XCJ5aWZhXCJdJykucHJvcCgnY2hlY2tlZCcpLFxuICAgICAgICAgICAgICAgICAgICArICQoJ2lucHV0W25hbWU9XCJoYWlkaVwiXScpLnByb3AoJ2NoZWNrZWQnKSxcbiAgICAgICAgICAgICAgICAgICAgKyAkKCdpbnB1dFtuYW1lPVwibGluZ3NoYW5nXCJdJykucHJvcCgnY2hlY2tlZCcpLFxuICAgICAgICAgICAgICAgICAgICArICQoJ2lucHV0W25hbWU9XCJxaWFuZ2dhbmdcIl0nKS5wcm9wKCdjaGVja2VkJyksXG4gICAgICAgICAgICAgICAgICAgICsgJCgnaW5wdXRbbmFtZT1cInRpYW5odVwiXTpjaGVja2VkJykudmFsKCkgfHwgMFxuICAgICAgICAgICAgICAgIF0uam9pbignLycpO1xuICAgIHJ1bGUgPSAkKCdzZWxlY3RbbmFtZT1cInJ1bGVcIl0nKS52YWwoKTtcbiAgICBpZiAocnVsZSkgZnJhZ21lbnQgKz0gYC8ke3J1bGV9YDtcblxuICAgIGlmIChydWxlID09ICctJylcbiAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKCcnLCAnJywgbG9jYXRpb24uaHJlZi5yZXBsYWNlKC8jLiokLywnJykpO1xuICAgIGVsc2UgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoJycsICcnLCBmcmFnbWVudCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbiQoZnVuY3Rpb24oKXtcblxuICAgIHZpZXcucGFpID0gTWFqaWFuZy5VSS5wYWkoJyNsb2FkZGF0YScpO1xuXG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHByZXNldCkpIHtcbiAgICAgICAgJCgnc2VsZWN0W25hbWU9XCJydWxlXCJdJykuYXBwZW5kKCQoJzxvcHRpb24+JykudmFsKGtleSkudGV4dChrZXkpKTtcbiAgICB9XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdNYWppYW5nLnJ1bGUnKSkge1xuICAgICAgICAkKCdzZWxlY3RbbmFtZT1cInJ1bGVcIl0nKS5hcHBlbmQoJCgnPG9wdGlvbj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsKCctJykudGV4dCgn44Kr44K544K/44Og44Or44O844OrJykpO1xuICAgIH1cblxuICAgICQoJ2Zvcm0nKS5vbignc3VibWl0Jywgc3VibWl0KTtcblxuICAgICQoJ2Zvcm0nKS5vbigncmVzZXQnLCBmdW5jdGlvbigpe1xuICAgICAgICBoaWRlKCQoJy5odWxlLWRpYWxvZycpKTtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cImZ1YmFvcGFpXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cInRpYW5odVwiXScpLm5leHQoKS50ZXh0KCflnLDlkownKTtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cInRpYW5odVwiXScpLnZhbCgyKTtcbiAgICAgICAgJCgnZm9ybSBpbnB1dFtuYW1lPVwicGFpc3RyXCJdJykuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgICQoJ2lucHV0W25hbWU9XCJ6aW1vXCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKHRoaXMsICc6Y2hlY2tlZCcpLnZhbCgpID09IDEpIHtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJxaWFuZ2dhbmdcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImxpbmdzaGFuZ1wiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwidGlhbmh1XCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJ3NlbGVjdFtuYW1lPVwibWVuZmVuZ1wiXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCh0aGlzLCAnOnNlbGVjdGVkJykudmFsKCkgPT0gMCkge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInRpYW5odVwiXScpLm5leHQoKS50ZXh0KCflpKnlkownKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJ0aWFuaHVcIl0nKS52YWwoMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwidGlhbmh1XCJdJykubmV4dCgpLnRleHQoJ+WcsOWSjCcpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInRpYW5odVwiXScpLnZhbCgyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJ2lucHV0W25hbWU9XCJsaXpoaVwiXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCh0aGlzKS5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgIGxldCB2YWwgPSAkKHRoaXMpLnZhbCgpID09IDEgPyAyIDogMTtcbiAgICAgICAgICAgICQoYGlucHV0W25hbWU9XCJsaXpoaVwiXVt2YWx1ZT1cIiR7dmFsfVwiXWApLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiZnViYW9wYWlcIl0nKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInlpZmFcIl0nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJ0aWFuaHVcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImZ1YmFvcGFpXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJ5aWZhXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJ2lucHV0W25hbWU9XCJ5aWZhXCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImxpbmdzaGFuZ1wiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCdpbnB1dFtuYW1lPVwiaGFpZGlcIl0nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQodGhpcykucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwibGluZ3NoYW5nXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJxaWFuZ2dhbmdcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInRpYW5odVwiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCdpbnB1dFtuYW1lPVwibGluZ3NoYW5nXCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInlpZmFcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImhhaWRpXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJxaWFuZ2dhbmdcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInRpYW5odVwiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiemltb1wiXVt2YWx1ZT1cIjFcIl0nKS5jbGljaygpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJCgnaW5wdXRbbmFtZT1cInFpYW5nZ2FuZ1wiXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCh0aGlzKS5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJoYWlkaVwiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwibGluZ3NoYW5nXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJ0aWFuaHVcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInppbW9cIl1bdmFsdWU9XCIwXCJdJykuY2xpY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJ2lucHV0W25hbWU9XCJ0aWFuaHVcIl0nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQodGhpcykucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwibGl6aGlcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImZ1YmFvcGFpXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJ5aWZhXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJoYWlkaVwiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwibGluZ3NoYW5nXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJxaWFuZ2dhbmdcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInppbW9cIl1bdmFsdWU9XCIxXCJdJykuY2xpY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGZyYWdtZW50ID0gbG9jYXRpb24uaGFzaC5yZXBsYWNlKC9eIy8sJycpO1xuICAgIGluaXQoZnJhZ21lbnQpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=