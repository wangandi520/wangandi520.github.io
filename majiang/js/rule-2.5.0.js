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
 *  電脳麻将: ルール設定 v2.5.0
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS0yLjUuMC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O1VBQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRWIsZUFBZSxtQkFBTyxDQUFDLGlEQUFrQjs7QUFFekM7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLE9BQU87QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCLElBQUk7QUFDakMsNkJBQTZCLElBQUk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixJQUFJO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsNEJBQTRCLE9BQU87QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCLElBQUk7QUFDakMsMkNBQTJDLElBQUk7QUFDL0MsaUNBQWlDLElBQUk7QUFDckM7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLElBQUk7QUFDdEMseUNBQXlDLElBQUk7QUFDN0M7QUFDQTtBQUNBLDJDQUEyQyxJQUFJO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0VBQXdFO0FBQ3hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEU7QUFDMUUsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFqaWFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tYWppYW5nLy4vc3JjL2pzL3J1bGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8qIVxuICogIOmbu+iEs+m6u+Wwhjog44Or44O844Or6Kit5a6aIHYyLjUuMFxuICpcbiAqICBDb3B5cmlnaHQoQykgMjAxNyBTYXRvc2hpIEtvYmF5YXNoaVxuICogIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogIGh0dHBzOi8vZ2l0aHViLmNvbS9rb2JhbGFiL01hamlhbmcvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuY29uc3QgcHJlc2V0ID0gcmVxdWlyZSgnLi9jb25mL3J1bGUuanNvbicpO1xuXG5mdW5jdGlvbiBzZXRfZm9ybShydWxlKSB7XG5cbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocnVsZSkpIHtcblxuICAgICAgICBsZXQgdmFsdWU7XG5cbiAgICAgICAgaWYgKGtleSA9PSAn6aCG5L2N54K5Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBydWxlW2tleV0uZmluZChuPT5uLm1hdGNoKC9cXC4vKSkgPyAwIDogMTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCLpoIbkvY3ngrnlm5vmjajkupTlhaXjgYLjgopcIl0nKS52YWwoW3ZhbHVlXSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCLpoIbkvY3ngrlcIl0nKS5lcShpKS52YWwocnVsZVtrZXldW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT0gJ+i1pOeJjCcpIHtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCLotaTniYxcIl0nKS5lcSgwKS52YWwocnVsZVtrZXldLm0pO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIui1pOeJjFwiXScpLmVxKDEpLnZhbChydWxlW2tleV0ucCk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwi6LWk54mMXCJdJykuZXEoMikudmFsKHJ1bGVba2V5XS5zKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoYGlucHV0W25hbWU9XCIke2tleX1cIl1gKS5hdHRyKCd0eXBlJykgPT0gJ3JhZGlvJyB8fFxuICAgICAgICAgICAgJChgaW5wdXRbbmFtZT1cIiR7a2V5fVwiXWApLmF0dHIoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJ1bGVba2V5XSA9PT0gZmFsc2UgPyBbMF1cbiAgICAgICAgICAgICAgICAgIDogcnVsZVtrZXldID09PSB0cnVlICA/IFsxXVxuICAgICAgICAgICAgICAgICAgOiAgICAgICAgICAgICAgICAgICAgICAgW3J1bGVba2V5XV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJ1bGVba2V5XTtcbiAgICAgICAgfVxuICAgICAgICAkKGBpbnB1dFtuYW1lPVwiJHtrZXl9XCJdYCkudmFsKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXBhaXJfcG9pbnQoKTtcbiAgICByZXBhaXJfZ2FuZygpO1xuICAgIHJlcGFpcl9kYW1hbmd1YW4oKTtcblxuICAgIE1hamlhbmcuVUkuVXRpbC5mYWRlSW4oJCgnZm9ybScpKTtcbn1cblxuZnVuY3Rpb24gZ2V0X2Zvcm0oKSB7XG5cbiAgICBsZXQgcnVsZSA9IE1hamlhbmcucnVsZSgpO1xuXG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJ1bGUpKSB7XG5cbiAgICAgICAgaWYgKGtleSA9PSAn6aCG5L2N54K5Jykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBydWxlW2tleV1baV0gPSAkKCdpbnB1dFtuYW1lPVwi6aCG5L2N54K5XCJdJykuZXEoaSkudmFsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ID09ICfotaTniYwnKSB7XG4gICAgICAgICAgICBydWxlW2tleV0ubSA9ICsgJCgnaW5wdXRbbmFtZT1cIui1pOeJjFwiXScpLmVxKDApLnZhbCgpO1xuICAgICAgICAgICAgcnVsZVtrZXldLnAgPSArICQoJ2lucHV0W25hbWU9XCLotaTniYxcIl0nKS5lcSgxKS52YWwoKTtcbiAgICAgICAgICAgIHJ1bGVba2V5XS5zID0gKyAkKCdpbnB1dFtuYW1lPVwi6LWk54mMXCJdJykuZXEoMikudmFsKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGBpbnB1dFtuYW1lPVwiJHtrZXl9XCJdYCkuYXR0cigndHlwZScpID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgIHJ1bGVba2V5XSA9ICsgJChgaW5wdXRbbmFtZT1cIiR7a2V5fVwiXTpjaGVja2VkYCkudmFsKCk7XG4gICAgICAgICAgICBpZiAoJChgaW5wdXRbbmFtZT1cIiR7a2V5fVwiXWApLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgICAgICAgICAgcnVsZVtrZXldID0gcnVsZVtrZXldICE9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoJChgaW5wdXRbbmFtZT1cIiR7a2V5fVwiXWApLmF0dHIoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICBydWxlW2tleV0gPSAkKGBpbnB1dFtuYW1lPVwiJHtrZXl9XCJdYCkucHJvcCgnY2hlY2tlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcnVsZVtrZXldID0gKyAkKGBpbnB1dFtuYW1lPVwiJHtrZXl9XCJdYCkudmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ1bGU7XG59XG5cbmZ1bmN0aW9uIHJvdW5kX3BvaW50KHAsIHJvdW5kKSB7XG4gICAgcCA9IGlzTmFOKHApID8gJzAnXG4gICAgICA6ICsgcCA+IDAgID8gJysnICsgKCsgcClcbiAgICAgIDogICAgICAgICAgICAnJyAgKyAoKyBwKTtcbiAgICBpZiAocm91bmQpIHAucmVwbGFjZSgvXFwuXFxkKiQvLCcnKTtcbiAgICBlbHNlICAgICAgIHAgPSAhIHAubWF0Y2goL1xcLi8pID8gcCArICcuMCcgOiBwO1xuICAgIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiByZXBhaXJfcG9pbnQoKSB7XG4gICAgbGV0IHJvdW5kID0gJCgnaW5wdXRbbmFtZT1cIumghuS9jeeCueWbm+aNqOS6lOWFpeOBguOCilwiXScpLnByb3AoJ2NoZWNrZWQnKTtcbiAgICBsZXQgc3VtID0gMDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKykge1xuICAgICAgICBsZXQgcCA9ICsgJCgnaW5wdXRbbmFtZT1cIumghuS9jeeCuVwiXScpLmVxKGkpLnZhbCgpO1xuICAgICAgICBzdW0gKz0gcDtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cIumghuS9jeeCuVwiXScpLmVxKGkpLnZhbChyb3VuZF9wb2ludChwLCByb3VuZCkpXG4gICAgfVxuICAgICQoJ2lucHV0W25hbWU9XCLpoIbkvY3ngrlcIl0nKS5lcSgwKS52YWwocm91bmRfcG9pbnQoLXN1bSwgcm91bmQpKVxufVxuXG5mdW5jdGlvbiByZXBhaXJfZ2FuZygpIHtcbiAgICBpZiAoKyAkKCdpbnB1dFtuYW1lPVwi6KOP44OJ44Op44GC44KKXCJdOmNoZWNrZWQnKS52YWwoKVxuICAgICAgICAmJiArICQoJ2lucHV0W25hbWU9XCLjgqvjg7Pjg4njg6njgYLjgopcIl06Y2hlY2tlZCcpLnZhbCgpKVxuICAgIHtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cIuOCq+ODs+ijj+OBguOCilwiXScpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cIuOCq+ODs+ijj+OBguOCilwiXScpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSkudmFsKFswXSk7XG4gICAgfVxuXG4gICAgaWYgKCsgJCgnaW5wdXRbbmFtZT1cIuOCq+ODs+ODieODqeOBguOCilwiXTpjaGVja2VkJykudmFsKCkpIHtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cIuOCq+ODs+ODieODqeW+jOS5l+OBm1wiXScpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cIuOCq+ODs+ODieODqeW+jOS5l+OBm1wiXScpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlcGFpcl9kYW1hbmd1YW4oKSB7XG4gICAgaWYgKCsgJCgnaW5wdXRbbmFtZT1cIuW9uea6gOOBruikh+WQiOOBguOCilwiXTpjaGVja2VkJykudmFsKCkpIHtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cIuODgOODluODq+W9uea6gOOBguOCilwiXScpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cIuODgOODluODq+W9uea6gOOBguOCilwiXScpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSkudmFsKFswXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1bnNhdmVkKCkge1xuICAgICQod2luZG93KS5vbignYmVmb3JldW5sb2FkJywgKGV2KT0+e1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gJ+ODmuODvOOCuOOCkumbouOCjOOBvuOBmeOBjOOCiOOCjeOBl+OBhOOBp+OBmeOBi++8nyc7XG4gICAgICAgIGV2LnJldHVyblZhbHVlID0gbWVzc2FnZTtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfSk7XG59XG5cbiQoZnVuY3Rpb24oKXtcblxuICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhwcmVzZXQpKSB7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwi44OX44Oq44K744OD44OIXCJdJykuYXBwZW5kKCQoJzxvcHRpb24+JykudmFsKGtleSkudGV4dChrZXkpKTtcbiAgICB9XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdNYWppYW5nLnJ1bGUnKSkge1xuICAgICAgICAkKCdzZWxlY3RbbmFtZT1cIuODl+ODquOCu+ODg+ODiFwiXScpLmFwcGVuZCgkKCc8b3B0aW9uPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsKCctJykudGV4dCgn44Kr44K544K/44Og44Or44O844OrJykpO1xuICAgICAgICAkKCdzZWxlY3RbbmFtZT1cIuODl+ODquOCu+ODg+ODiFwiXScpLnZhbCgnLScpO1xuICAgIH1cblxuICAgIGxldCBydWxlID0gTWFqaWFuZy5ydWxlKFxuICAgICAgICAgICAgICAgICAgICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdNYWppYW5nLnJ1bGUnKXx8J3t9JykpO1xuICAgIHNldF9mb3JtKHJ1bGUpO1xuXG4gICAgJCgnaW5wdXRbbmFtZT1cIumFjee1puWOn+eCuVwiXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICBsZXQgcCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgIGlmIChpc05hTihwKSB8fCBwIDw9IDApICQodGhpcykudmFsKE1hamlhbmcucnVsZSgpWyfphY3ntabljp/ngrknXSk7XG4gICAgfSk7XG4gICAgJCgnaW5wdXRbbmFtZT1cIumghuS9jeeCuVwiXScpLm9uKCdjaGFuZ2UnLCByZXBhaXJfcG9pbnQpO1xuICAgICQoJ2lucHV0W25hbWU9XCLpoIbkvY3ngrnlm5vmjajkupTlhaXjgYLjgopcIl0nKS5vbignY2hhbmdlJywgcmVwYWlyX3BvaW50KTtcbiAgICAkKCdpbnB1dFtuYW1lPVwi6LWk54mMXCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGxldCBuID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgaWYgKGlzTmFOKG4pIHx8IG4gPCAwIHx8IDQgPCBuKSAkKHRoaXMpLnZhbCgwKTtcbiAgICB9KTtcbiAgICAkKCdpbnB1dFtuYW1lPVwi6KOP44OJ44Op44GC44KKXCJdJykub24oJ2NoYW5nZScsIHJlcGFpcl9nYW5nKTtcbiAgICAkKCdpbnB1dFtuYW1lPVwi44Kr44Oz44OJ44Op44GC44KKXCJdJykub24oJ2NoYW5nZScsIHJlcGFpcl9nYW5nKTtcbiAgICAkKCdpbnB1dFtuYW1lPVwi5b255rqA44Gu6KSH5ZCI44GC44KKXCJdJykub24oJ2NoYW5nZScsIHJlcGFpcl9kYW1hbmd1YW4pO1xuXG4gICAgJCgnaW5wdXRbbmFtZT1cIuODl+ODquOCu+ODg+ODiFwiXScpLm9uKCdjbGljaycsICgpPT57XG4gICAgICAgIGxldCBrZXkgPSAkKCdzZWxlY3RbbmFtZT1cIuODl+ODquOCu+ODg+ODiFwiXScpLnZhbCgpO1xuICAgICAgICBzZXRfZm9ybShNYWppYW5nLnJ1bGUoa2V5ID09ICctJ1xuICAgICAgICAgICAgICAgICAgICA/IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ01hamlhbmcucnVsZScpfHwne30nKVxuICAgICAgICAgICAgICAgICAgICA6IHByZXNldFtrZXldIHx8IHt9KSk7XG4gICAgICAgIHVuc2F2ZWQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybSBpbnB1dCcpLm9uKCdjaGFuZ2UnLCB1bnNhdmVkKTtcblxuICAgICQoJ2Zvcm0nKS5vbignc3VibWl0JywgKCk9PntcbiAgICAgICAgaWYgKCEgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ01hamlhbmcucnVsZScpKSB7XG4gICAgICAgICAgICAkKCdzZWxlY3RbbmFtZT1cIuODl+ODquOCu+ODg+ODiFwiXScpLmFwcGVuZCgkKCc8b3B0aW9uPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbCgnLScpLnRleHQoJ+OCq+OCueOCv+ODoOODq+ODvOODqycpKTtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnTWFqaWFuZy5ydWxlJywgSlNPTi5zdHJpbmdpZnkoZ2V0X2Zvcm0oKSkpO1xuXG4gICAgICAgICQod2luZG93KS5vZmYoJ2JlZm9yZXVubG9hZCcpO1xuICAgICAgICAkKCdzZWxlY3RbbmFtZT1cIuODl+ODquOCu+ODg+ODiFwiXScpLnZhbCgnLScpO1xuICAgICAgICBNYWppYW5nLlVJLlV0aWwuZmFkZUluKCQoJ2Zvcm0nKSk7XG4gICAgICAgIE1hamlhbmcuVUkuVXRpbC5mYWRlSW4oJCgnLm1lc3NhZ2UnKSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCk9PiQoJy5tZXNzYWdlJykudHJpZ2dlcignY2xpY2snKSwgMjAwMCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgICQoJy5tZXNzYWdlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgTWFqaWFuZy5VSS5VdGlsLmZhZGVPdXQoJCh0aGlzKSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9