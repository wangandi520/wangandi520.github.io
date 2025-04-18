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
  !*** ./src/js/rule.js ***!
  \************************/
/*!
 *  電脳麻将: ルール設定 v2.4.16
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */


const preset = __webpack_require__(/*! ./conf/rule.json */ "./src/js/conf/rule.json");

function set_form(rule) {

    for (let key of Object.keys(rule)) {

        let value;

        if (key == '順位点') {
            value = rule[key].find(n=>n.match(/\./)) ? 0 : 1;
            $('input[name="順位点四捨五入あり"]').val([value]);
            for (let i = 1; i < 4; i++) {
                $('input[name="順位点"]').eq(i).val(rule[key][i]);
            }
            continue;
        }
        if (key == '赤牌') {
            $('input[name="赤牌"]').eq(0).val(rule[key].m);
            $('input[name="赤牌"]').eq(1).val(rule[key].p);
            $('input[name="赤牌"]').eq(2).val(rule[key].s);
            continue;
        }

        if ($(`input[name="${key}"]`).attr('type') == 'radio' ||
            $(`input[name="${key}"]`).attr('type') == 'checkbox')
        {
            value = rule[key] === false ? [0]
                  : rule[key] === true  ? [1]
                  :                       [rule[key]];
        }
        else {
            value = rule[key];
        }
        $(`input[name="${key}"]`).val(value);
    }

    repair_point();
    repair_gang();
    repair_damanguan();

    Majiang.UI.Util.fadeIn($('form'));
}

function get_form() {

    let rule = Majiang.rule();

    for (let key of Object.keys(rule)) {

        if (key == '順位点') {
            for (let i = 0; i < 4; i++) {
                rule[key][i] = $('input[name="順位点"]').eq(i).val();
            }
            continue;
        }
        if (key == '赤牌') {
            rule[key].m = + $('input[name="赤牌"]').eq(0).val();
            rule[key].p = + $('input[name="赤牌"]').eq(1).val();
            rule[key].s = + $('input[name="赤牌"]').eq(2).val();
            continue;
        }

        if ($(`input[name="${key}"]`).attr('type') == 'radio') {
            rule[key] = + $(`input[name="${key}"]:checked`).val();
            if ($(`input[name="${key}"]`).length == 2) {
                rule[key] = rule[key] != 0;
            }
        }
        else if ($(`input[name="${key}"]`).attr('type') == 'checkbox') {
            rule[key] = $(`input[name="${key}"]`).prop('checked');
        }
        else {
            rule[key] = + $(`input[name="${key}"]`).val();
        }
    }
    return rule;
}

function round_point(p, round) {
    p = isNaN(p) ? '0'
      : + p > 0  ? '+' + (+ p)
      :            ''  + (+ p);
    if (round) p.replace(/\.\d*$/,'');
    else       p = ! p.match(/\./) ? p + '.0' : p;
    return p;
}

function repair_point() {
    let round = $('input[name="順位点四捨五入あり"]').prop('checked');
    let sum = 0;
    for (let i = 1; i < 4; i++) {
        let p = + $('input[name="順位点"]').eq(i).val();
        sum += p;
        $('input[name="順位点"]').eq(i).val(round_point(p, round))
    }
    $('input[name="順位点"]').eq(0).val(round_point(-sum, round))
}

function repair_gang() {
    if (+ $('input[name="裏ドラあり"]:checked').val()
        && + $('input[name="カンドラあり"]:checked').val())
    {
        $('input[name="カン裏あり"]').prop('disabled', false);
    }
    else {
        $('input[name="カン裏あり"]').prop('disabled', true).val([0]);
    }

    if (+ $('input[name="カンドラあり"]:checked').val()) {
        $('input[name="カンドラ後乗せ"]').prop('disabled', false);
    }
    else {
        $('input[name="カンドラ後乗せ"]').prop('disabled', true)
                                        .prop('checked', false);
    }
}

function repair_damanguan() {
    if (+ $('input[name="役満の複合あり"]:checked').val()) {
        $('input[name="ダブル役満あり"]').prop('disabled', false);
    }
    else {
        $('input[name="ダブル役満あり"]').prop('disabled', true).val([0]);
    }
}

function unsaved() {
    $(window).on('beforeunload', (ev)=>{
        const message = 'ページを離れますがよろしいですか？';
        ev.returnValue = message;
        return message;
    });
}

$(function(){

    for (let key of Object.keys(preset)) {
        $('select[name="プリセット"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="プリセット"]').append($('<option>')
                                    .val('-').text('カスタムルール'));
        $('select[name="プリセット"]').val('-');
    }

    let rule = Majiang.rule(
                    JSON.parse(localStorage.getItem('Majiang.rule')||'{}'));
    set_form(rule);

    $('input[name="配給原点"]').on('change', function(){
        let p = $(this).val();
        if (isNaN(p) || p <= 0) $(this).val(Majiang.rule()['配給原点']);
    });
    $('input[name="順位点"]').on('change', repair_point);
    $('input[name="順位点四捨五入あり"]').on('change', repair_point);
    $('input[name="赤牌"]').on('change', function(){
        let n = $(this).val();
        if (isNaN(n) || n < 0 || 4 < n) $(this).val(0);
    });
    $('input[name="裏ドラあり"]').on('change', repair_gang);
    $('input[name="カンドラあり"]').on('change', repair_gang);
    $('input[name="役満の複合あり"]').on('change', repair_damanguan);

    $('input[name="プリセット"]').on('click', ()=>{
        let key = $('select[name="プリセット"]').val();
        set_form(Majiang.rule(key == '-'
                    ? JSON.parse(localStorage.getItem('Majiang.rule')||'{}')
                    : preset[key] || {}));
        unsaved();
        return false;
    });

    $('form input').on('change', unsaved);

    $('form').on('submit', ()=>{
        if (! localStorage.getItem('Majiang.rule')) {
            $('select[name="プリセット"]').append($('<option>')
                                        .val('-').text('カスタムルール'));
        }
        localStorage.setItem('Majiang.rule', JSON.stringify(get_form()));

        $(window).off('beforeunload');
        $('select[name="プリセット"]').val('-');
        Majiang.UI.Util.fadeIn($('form'));
        Majiang.UI.Util.fadeIn($('.message'));
        setTimeout(()=>$('.message').trigger('click'), 2000);
        return false;
    });

    $('.message').on('click', function(){
        Majiang.UI.Util.fadeOut($(this));
        return false;
    });
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS0yLjQuMTYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztVQUFBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUViLGVBQWUsbUJBQU8sQ0FBQyxpREFBa0I7O0FBRXpDOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixPQUFPO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixJQUFJO0FBQ2pDLDZCQUE2QixJQUFJO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsSUFBSTtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLDRCQUE0QixPQUFPO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixJQUFJO0FBQ2pDLDJDQUEyQyxJQUFJO0FBQy9DLGlDQUFpQyxJQUFJO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxJQUFJO0FBQ3RDLHlDQUF5QyxJQUFJO0FBQzdDO0FBQ0E7QUFDQSwyQ0FBMkMsSUFBSTtBQUMvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdFQUF3RTtBQUN4RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFO0FBQzFFLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL21hamlhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWFqaWFuZy8uL3NyYy9qcy9ydWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKiFcbiAqICDpm7vohLPpurvlsIY6IOODq+ODvOODq+ioreWumiB2Mi40LjE2XG4gKlxuICogIENvcHlyaWdodChDKSAyMDE3IFNhdG9zaGkgS29iYXlhc2hpXG4gKiAgUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL2tvYmFsYWIvTWFqaWFuZy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBwcmVzZXQgPSByZXF1aXJlKCcuL2NvbmYvcnVsZS5qc29uJyk7XG5cbmZ1bmN0aW9uIHNldF9mb3JtKHJ1bGUpIHtcblxuICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhydWxlKSkge1xuXG4gICAgICAgIGxldCB2YWx1ZTtcblxuICAgICAgICBpZiAoa2V5ID09ICfpoIbkvY3ngrknKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJ1bGVba2V5XS5maW5kKG49Pm4ubWF0Y2goL1xcLi8pKSA/IDAgOiAxO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIumghuS9jeeCueWbm+aNqOS6lOWFpeOBguOCilwiXScpLnZhbChbdmFsdWVdKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIumghuS9jeeCuVwiXScpLmVxKGkpLnZhbChydWxlW2tleV1baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PSAn6LWk54mMJykge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIui1pOeJjFwiXScpLmVxKDApLnZhbChydWxlW2tleV0ubSk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwi6LWk54mMXCJdJykuZXEoMSkudmFsKHJ1bGVba2V5XS5wKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCLotaTniYxcIl0nKS5lcSgyKS52YWwocnVsZVtrZXldLnMpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChgaW5wdXRbbmFtZT1cIiR7a2V5fVwiXWApLmF0dHIoJ3R5cGUnKSA9PSAncmFkaW8nIHx8XG4gICAgICAgICAgICAkKGBpbnB1dFtuYW1lPVwiJHtrZXl9XCJdYCkuYXR0cigndHlwZScpID09ICdjaGVja2JveCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlID0gcnVsZVtrZXldID09PSBmYWxzZSA/IFswXVxuICAgICAgICAgICAgICAgICAgOiBydWxlW2tleV0gPT09IHRydWUgID8gWzFdXG4gICAgICAgICAgICAgICAgICA6ICAgICAgICAgICAgICAgICAgICAgICBbcnVsZVtrZXldXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gcnVsZVtrZXldO1xuICAgICAgICB9XG4gICAgICAgICQoYGlucHV0W25hbWU9XCIke2tleX1cIl1gKS52YWwodmFsdWUpO1xuICAgIH1cblxuICAgIHJlcGFpcl9wb2ludCgpO1xuICAgIHJlcGFpcl9nYW5nKCk7XG4gICAgcmVwYWlyX2RhbWFuZ3VhbigpO1xuXG4gICAgTWFqaWFuZy5VSS5VdGlsLmZhZGVJbigkKCdmb3JtJykpO1xufVxuXG5mdW5jdGlvbiBnZXRfZm9ybSgpIHtcblxuICAgIGxldCBydWxlID0gTWFqaWFuZy5ydWxlKCk7XG5cbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocnVsZSkpIHtcblxuICAgICAgICBpZiAoa2V5ID09ICfpoIbkvY3ngrknKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHJ1bGVba2V5XVtpXSA9ICQoJ2lucHV0W25hbWU9XCLpoIbkvY3ngrlcIl0nKS5lcShpKS52YWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT0gJ+i1pOeJjCcpIHtcbiAgICAgICAgICAgIHJ1bGVba2V5XS5tID0gKyAkKCdpbnB1dFtuYW1lPVwi6LWk54mMXCJdJykuZXEoMCkudmFsKCk7XG4gICAgICAgICAgICBydWxlW2tleV0ucCA9ICsgJCgnaW5wdXRbbmFtZT1cIui1pOeJjFwiXScpLmVxKDEpLnZhbCgpO1xuICAgICAgICAgICAgcnVsZVtrZXldLnMgPSArICQoJ2lucHV0W25hbWU9XCLotaTniYxcIl0nKS5lcSgyKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoYGlucHV0W25hbWU9XCIke2tleX1cIl1gKS5hdHRyKCd0eXBlJykgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgcnVsZVtrZXldID0gKyAkKGBpbnB1dFtuYW1lPVwiJHtrZXl9XCJdOmNoZWNrZWRgKS52YWwoKTtcbiAgICAgICAgICAgIGlmICgkKGBpbnB1dFtuYW1lPVwiJHtrZXl9XCJdYCkubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgICAgICBydWxlW2tleV0gPSBydWxlW2tleV0gIT0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgkKGBpbnB1dFtuYW1lPVwiJHtrZXl9XCJdYCkuYXR0cigndHlwZScpID09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIHJ1bGVba2V5XSA9ICQoYGlucHV0W25hbWU9XCIke2tleX1cIl1gKS5wcm9wKCdjaGVja2VkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBydWxlW2tleV0gPSArICQoYGlucHV0W25hbWU9XCIke2tleX1cIl1gKS52YWwoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnVsZTtcbn1cblxuZnVuY3Rpb24gcm91bmRfcG9pbnQocCwgcm91bmQpIHtcbiAgICBwID0gaXNOYU4ocCkgPyAnMCdcbiAgICAgIDogKyBwID4gMCAgPyAnKycgKyAoKyBwKVxuICAgICAgOiAgICAgICAgICAgICcnICArICgrIHApO1xuICAgIGlmIChyb3VuZCkgcC5yZXBsYWNlKC9cXC5cXGQqJC8sJycpO1xuICAgIGVsc2UgICAgICAgcCA9ICEgcC5tYXRjaCgvXFwuLykgPyBwICsgJy4wJyA6IHA7XG4gICAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHJlcGFpcl9wb2ludCgpIHtcbiAgICBsZXQgcm91bmQgPSAkKCdpbnB1dFtuYW1lPVwi6aCG5L2N54K55Zub5o2o5LqU5YWl44GC44KKXCJdJykucHJvcCgnY2hlY2tlZCcpO1xuICAgIGxldCBzdW0gPSAwO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIGxldCBwID0gKyAkKCdpbnB1dFtuYW1lPVwi6aCG5L2N54K5XCJdJykuZXEoaSkudmFsKCk7XG4gICAgICAgIHN1bSArPSBwO1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwi6aCG5L2N54K5XCJdJykuZXEoaSkudmFsKHJvdW5kX3BvaW50KHAsIHJvdW5kKSlcbiAgICB9XG4gICAgJCgnaW5wdXRbbmFtZT1cIumghuS9jeeCuVwiXScpLmVxKDApLnZhbChyb3VuZF9wb2ludCgtc3VtLCByb3VuZCkpXG59XG5cbmZ1bmN0aW9uIHJlcGFpcl9nYW5nKCkge1xuICAgIGlmICgrICQoJ2lucHV0W25hbWU9XCLoo4/jg4njg6njgYLjgopcIl06Y2hlY2tlZCcpLnZhbCgpXG4gICAgICAgICYmICsgJCgnaW5wdXRbbmFtZT1cIuOCq+ODs+ODieODqeOBguOCilwiXTpjaGVja2VkJykudmFsKCkpXG4gICAge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwi44Kr44Oz6KOP44GC44KKXCJdJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwi44Kr44Oz6KOP44GC44KKXCJdJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKS52YWwoWzBdKTtcbiAgICB9XG5cbiAgICBpZiAoKyAkKCdpbnB1dFtuYW1lPVwi44Kr44Oz44OJ44Op44GC44KKXCJdOmNoZWNrZWQnKS52YWwoKSkge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwi44Kr44Oz44OJ44Op5b6M5LmX44GbXCJdJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwi44Kr44Oz44OJ44Op5b6M5LmX44GbXCJdJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVwYWlyX2RhbWFuZ3VhbigpIHtcbiAgICBpZiAoKyAkKCdpbnB1dFtuYW1lPVwi5b255rqA44Gu6KSH5ZCI44GC44KKXCJdOmNoZWNrZWQnKS52YWwoKSkge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwi44OA44OW44Or5b255rqA44GC44KKXCJdJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwi44OA44OW44Or5b255rqA44GC44KKXCJdJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKS52YWwoWzBdKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVuc2F2ZWQoKSB7XG4gICAgJCh3aW5kb3cpLm9uKCdiZWZvcmV1bmxvYWQnLCAoZXYpPT57XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAn44Oa44O844K444KS6Zui44KM44G+44GZ44GM44KI44KN44GX44GE44Gn44GZ44GL77yfJztcbiAgICAgICAgZXYucmV0dXJuVmFsdWUgPSBtZXNzYWdlO1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9KTtcbn1cblxuJChmdW5jdGlvbigpe1xuXG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHByZXNldCkpIHtcbiAgICAgICAgJCgnc2VsZWN0W25hbWU9XCLjg5fjg6rjgrvjg4Pjg4hcIl0nKS5hcHBlbmQoJCgnPG9wdGlvbj4nKS52YWwoa2V5KS50ZXh0KGtleSkpO1xuICAgIH1cbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ01hamlhbmcucnVsZScpKSB7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwi44OX44Oq44K744OD44OIXCJdJykuYXBwZW5kKCQoJzxvcHRpb24+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWwoJy0nKS50ZXh0KCfjgqvjgrnjgr/jg6Djg6vjg7zjg6snKSk7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwi44OX44Oq44K744OD44OIXCJdJykudmFsKCctJyk7XG4gICAgfVxuXG4gICAgbGV0IHJ1bGUgPSBNYWppYW5nLnJ1bGUoXG4gICAgICAgICAgICAgICAgICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ01hamlhbmcucnVsZScpfHwne30nKSk7XG4gICAgc2V0X2Zvcm0ocnVsZSk7XG5cbiAgICAkKCdpbnB1dFtuYW1lPVwi6YWN57Wm5Y6f54K5XCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGxldCBwID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgaWYgKGlzTmFOKHApIHx8IHAgPD0gMCkgJCh0aGlzKS52YWwoTWFqaWFuZy5ydWxlKClbJ+mFjee1puWOn+eCuSddKTtcbiAgICB9KTtcbiAgICAkKCdpbnB1dFtuYW1lPVwi6aCG5L2N54K5XCJdJykub24oJ2NoYW5nZScsIHJlcGFpcl9wb2ludCk7XG4gICAgJCgnaW5wdXRbbmFtZT1cIumghuS9jeeCueWbm+aNqOS6lOWFpeOBguOCilwiXScpLm9uKCdjaGFuZ2UnLCByZXBhaXJfcG9pbnQpO1xuICAgICQoJ2lucHV0W25hbWU9XCLotaTniYxcIl0nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgbGV0IG4gPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICBpZiAoaXNOYU4obikgfHwgbiA8IDAgfHwgNCA8IG4pICQodGhpcykudmFsKDApO1xuICAgIH0pO1xuICAgICQoJ2lucHV0W25hbWU9XCLoo4/jg4njg6njgYLjgopcIl0nKS5vbignY2hhbmdlJywgcmVwYWlyX2dhbmcpO1xuICAgICQoJ2lucHV0W25hbWU9XCLjgqvjg7Pjg4njg6njgYLjgopcIl0nKS5vbignY2hhbmdlJywgcmVwYWlyX2dhbmcpO1xuICAgICQoJ2lucHV0W25hbWU9XCLlvbnmuoDjga7opIflkIjjgYLjgopcIl0nKS5vbignY2hhbmdlJywgcmVwYWlyX2RhbWFuZ3Vhbik7XG5cbiAgICAkKCdpbnB1dFtuYW1lPVwi44OX44Oq44K744OD44OIXCJdJykub24oJ2NsaWNrJywgKCk9PntcbiAgICAgICAgbGV0IGtleSA9ICQoJ3NlbGVjdFtuYW1lPVwi44OX44Oq44K744OD44OIXCJdJykudmFsKCk7XG4gICAgICAgIHNldF9mb3JtKE1hamlhbmcucnVsZShrZXkgPT0gJy0nXG4gICAgICAgICAgICAgICAgICAgID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnTWFqaWFuZy5ydWxlJyl8fCd7fScpXG4gICAgICAgICAgICAgICAgICAgIDogcHJlc2V0W2tleV0gfHwge30pKTtcbiAgICAgICAgdW5zYXZlZCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAkKCdmb3JtIGlucHV0Jykub24oJ2NoYW5nZScsIHVuc2F2ZWQpO1xuXG4gICAgJCgnZm9ybScpLm9uKCdzdWJtaXQnLCAoKT0+e1xuICAgICAgICBpZiAoISBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnTWFqaWFuZy5ydWxlJykpIHtcbiAgICAgICAgICAgICQoJ3NlbGVjdFtuYW1lPVwi44OX44Oq44K744OD44OIXCJdJykuYXBwZW5kKCQoJzxvcHRpb24+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsKCctJykudGV4dCgn44Kr44K544K/44Og44Or44O844OrJykpO1xuICAgICAgICB9XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdNYWppYW5nLnJ1bGUnLCBKU09OLnN0cmluZ2lmeShnZXRfZm9ybSgpKSk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9mZignYmVmb3JldW5sb2FkJyk7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwi44OX44Oq44K744OD44OIXCJdJykudmFsKCctJyk7XG4gICAgICAgIE1hamlhbmcuVUkuVXRpbC5mYWRlSW4oJCgnZm9ybScpKTtcbiAgICAgICAgTWFqaWFuZy5VSS5VdGlsLmZhZGVJbigkKCcubWVzc2FnZScpKTtcbiAgICAgICAgc2V0VGltZW91dCgoKT0+JCgnLm1lc3NhZ2UnKS50cmlnZ2VyKCdjbGljaycpLCAyMDAwKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgJCgnLm1lc3NhZ2UnKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICBNYWppYW5nLlVJLlV0aWwuZmFkZU91dCgkKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=