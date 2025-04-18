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
/*!*************************!*\
  !*** ./src/js/drill.js ***!
  \*************************/
/*!
 *  電脳麻将: 点数計算ドリル v2.4.16
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */


const { hide, show, fadeIn, fadeOut } = Majiang.UI.Util;

const preset = __webpack_require__(/*! ./conf/rule.json */ "./src/js/conf/rule.json");
const view = {};

const feng_hanzi = ['東','南','西','北'];

let player, next_exam, miss_exams, stat;

class Player extends Majiang.AI {
    select_lizhi(p) {
        return this.allow_lizhi(this.shoupai, p) && Math.random() < 0.3;
    }
}

function init_player() {

    let player = new Player();

    let rule = $('select[name="rule"]').val();
    rule = ! rule      ? {}
         : rule == '-' ? JSON.parse(localStorage.getItem('Majiang.rule')||'{}')
         :               preset[rule];
    rule = Majiang.rule(rule);

    player.kaiju({ id: 0, qijia: 0, title: '', player: [], rule: rule });

    return player;
}

function make_exam(player) {
    for (;;) {
        let zhuangfeng = (Math.random()*2)|0;
        let menfeng    = (Math.random()*4)|0;
        let shoupai    = [ '', '', '', '' ];
        let shan = new Majiang.Shan(player._rule);
        let qipai = [];
        for (let i = 0; i < 13; i++) qipai.push(shan.zimo());
        shoupai[menfeng] = (new Majiang.Shoupai(qipai)).toString();
        player.qipai({
            zhuangfeng: zhuangfeng,
            jushu:      [0,3,2,1][menfeng],
            changbang:  0,
            lizhibang:  0,
            defen:      [ 25000, 25000, 25000, 25000 ],
            baopai:     shan.baopai[0],
            shoupai:    shoupai
        });
        player.shan.paishu = shan.paishu + 4;
        let gang = null, lunban = 0;
        while (shan.paishu) {
            let p;
            if (gang) {
                p = shan.gangzimo();
                if (shan._weikaigang) shan.kaigang();
                gang = null;
            }
            else {
                p = shan.zimo();
            }
            let msg = { l: lunban, p: p };
            if (lunban == menfeng) {
                player.zimo(msg);
                if (player.select_hule()) {
                    shan.close();
                    return {
                        shoupai:    player.shoupai,
                        zhuangfeng: zhuangfeng,
                        menfeng:    menfeng,
                        baopai:     shan.baopai,
                        fubaopai:   player.shoupai.lizhi && shan.fubaopai
                    };
                }
                let m = player.select_gang();
                if (m)  {
                    player.gang({ l: menfeng, m: m});
                    gang = m;
                    continue;
                }
                player.dapai({ l: menfeng, p: player.select_dapai()});
            }
            else {
                player.zimo(msg);
                player.dapai(msg);
                player._neng_rong = true;
                if (player.select_hule(msg)) {
                    shan.close();
                    let rongpai
                            = p + ['','+','=','-'][(4 + lunban - menfeng) % 4];
                    return {
                        shoupai:    player.shoupai,
                        rongpai:    rongpai,
                        zhuangfeng: zhuangfeng,
                        menfeng:    menfeng,
                        baopai:     shan.baopai,
                        fubaopai:   player.shoupai.lizhi && shan.fubaopai
                    };
                }
                let m = player.select_fulou(msg);
                if (m) {
                    player.fulou({ l: menfeng, m: m });
                    if (m.match(/^[mpsz]\d{4}/)) {
                        gang = m;
                        continue;
                    }
                    player.dapai({ l: menfeng, p: player.select_dapai()});
                }
            }
            lunban = (lunban + 1) % 4;
        }
    }
}

function parse_fragment(hash) {
    let [ paistr, baopai, fubaopai, zimo, zhuangfeng, menfeng, lizhi ]
            = hash.split('/');
    let shoupai = Majiang.Shoupai.fromString(paistr);
    let rongpai;
    if (zimo != '1' && shoupai._zimo) {
        rongpai = shoupai._zimo + '=';
        shoupai.dapai(shoupai._zimo);
    }
    if (lizhi == '1') {
        shoupai._lizhi = true;
    }
    baopai      = baopai ? baopai.split(',') : [];
    fubaopai    = fubaopai ? fubaopai.split(',')
                : shoupai.lizhi ? [] : null;
    zhuangfeng  = +(zhuangfeng || 0);
    menfeng     = +(menfeng || 0);
    return {
        shoupai:    shoupai,
        rongpai:    rongpai,
        zhuangfeng: zhuangfeng,
        menfeng:    menfeng,
        baopai:     baopai,
        fubaopai:   fubaopai
    };
}

function show_exam(exam) {

    let hule = Majiang.Util.hule(
                    exam.shoupai,
                    exam.rongpai,
                    Majiang.Util.hule_param({
                        rule:       player._rule,
                        zhuangfeng: exam.zhuangfeng,
                        menfeng:    exam.menfeng,
                        baopai:     exam.baopai,
                        fubaopai:   exam.fubaopai,
                        lizhi:      exam.shoupai.lizhi
                    }));

    $('.zhuangfeng').text(feng_hanzi[exam.zhuangfeng]);
    $('.menfeng').text(feng_hanzi[exam.menfeng]);

    if (exam.shoupai.lizhi) show($('.lizhi'));
    else                    hide($('.lizhi'));

    let shan = {
        baopai:   exam.baopai,
        fubaopai: exam.fubaopai,
        paishu:   0
    };
    if (exam.fubaopai) show($('.shan.fubaopai'));
    else               hide($('.shan.fubaopai'));
    view.baopai = new Majiang.UI.Shan($('.shan'), view.pai, shan).redraw(true);

    let shoupai = exam.shoupai.clone();
    if (exam.rongpai) shoupai.zimo(exam.rongpai);

    view.shoupai = new Majiang.UI.Shoupai(
                            $('.shoupai'), view.pai, shoupai
                        ).redraw(true);
    if (exam.rongpai) $('.shoupai .zimo').prepend('<span>ロン</span>');
    else              $('.shoupai .zimo').append('<span>ツモ</span>');

    let defen;
    if (hule && hule.defen) {
        defen = (exam.rongpai ? 'ロン: ' : 'ツモ: ')
              + (exam.rongpai ? hule.defen
                    : exam.menfeng
                        ? (Math.ceil(hule.defen / 200) * 100 / 2)
                            + ' / ' + (Math.floor(hule.defen / 200) * 100)
                        : `${hule.defen / 3}オール`)
              + (hule.damanguan
                  ? (hule.damanguan > 1
                        ? ` (役満 ×${hule.damanguan})`
                        : ' (役満)')
                  : ` (${hule.fu}符 ${hule.fanshu}翻)`);
    }
    else {
        defen = '(役なし)';
    }
    $('.defen').text(defen);

    let hupai = '';
    if (hule && hule.hupai)
        hupai = hule.hupai.map(h =>
                    h.name.match(/^(赤|裏)?ドラ$/)
                        ? `${h.name} ×${h.fanshu}` : h.name
                ).join(' / ');
    $('.hupai').text(hupai);

    stat.total++;

    hide($('.answer'));
    show($('.button'));

    $('.answer button.miss').off('click').on('click', ()=>{
        miss_exams.push(exam);
        next();
    });

    show($('.exam'));
    hide($('.break'));
    show($('.drill'));

    next_exam = null;
    setTimeout(()=>{
        next_exam = miss_exams.splice(Math.random() * 5, 1)[0]
                        || make_exam(player);
    }, 10);
}

function next() {
    hide($('.drill'));
    $('.stat').text(
        `回答数: ${stat.total}、`
        + `正答率: ${(stat.right / stat.total * 100)|0}%`);
    if (stat.total % 10 == 0) take_break();
    else                      show_exam(next_exam || make_exam(player));
}

function take_break() {
    hide($('.exam'));
    show($('.break'));
    show($('.drill'));
}

function restart() {

    hide($('.drill'));
    $('.stat').text('');

    next_exam = null;
    miss_exams = [];
    player = init_player();
    stat = { total:  0, right:  0 };

    if (location.hash)
            show_exam(parse_fragment(location.hash.replace(/^#/,'')));
    else    show_exam(make_exam(player));
}

$(function(){

    view.pai = Majiang.UI.pai('#loaddata');

    for (let key of Object.keys(preset)) {
        $('select[name="rule"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="rule"]').append($('<option>')
                                .val('-').text('カスタムルール')
                                .attr('selected',true));
    }

    $('select[name="rule"]').on('change', restart);

    $('.button button').on('click', ()=>{
        show($('.answer'));
        hide($('.button'));
    });
    $('.answer button.right').on('click', ()=>{
        stat.right++;
        next();
    });
    $('.break button').on('click', ()=>{
        show_exam(next_exam || make_exam(player));
    });

    restart();
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWppYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21hamlhbmcvLi9zcmMvanMvZHJpbGwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8qIVxuICogIOmbu+iEs+m6u+Wwhjog54K55pWw6KiI566X44OJ44Oq44OrIHYyLjQuMTZcbiAqXG4gKiAgQ29weXJpZ2h0KEMpIDIwMTcgU2F0b3NoaSBLb2JheWFzaGlcbiAqICBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqICBodHRwczovL2dpdGh1Yi5jb20va29iYWxhYi9NYWppYW5nL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IHsgaGlkZSwgc2hvdywgZmFkZUluLCBmYWRlT3V0IH0gPSBNYWppYW5nLlVJLlV0aWw7XG5cbmNvbnN0IHByZXNldCA9IHJlcXVpcmUoJy4vY29uZi9ydWxlLmpzb24nKTtcbmNvbnN0IHZpZXcgPSB7fTtcblxuY29uc3QgZmVuZ19oYW56aSA9IFsn5p2xJywn5Y2XJywn6KW/Jywn5YyXJ107XG5cbmxldCBwbGF5ZXIsIG5leHRfZXhhbSwgbWlzc19leGFtcywgc3RhdDtcblxuY2xhc3MgUGxheWVyIGV4dGVuZHMgTWFqaWFuZy5BSSB7XG4gICAgc2VsZWN0X2xpemhpKHApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsb3dfbGl6aGkodGhpcy5zaG91cGFpLCBwKSAmJiBNYXRoLnJhbmRvbSgpIDwgMC4zO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdF9wbGF5ZXIoKSB7XG5cbiAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcigpO1xuXG4gICAgbGV0IHJ1bGUgPSAkKCdzZWxlY3RbbmFtZT1cInJ1bGVcIl0nKS52YWwoKTtcbiAgICBydWxlID0gISBydWxlICAgICAgPyB7fVxuICAgICAgICAgOiBydWxlID09ICctJyA/IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ01hamlhbmcucnVsZScpfHwne30nKVxuICAgICAgICAgOiAgICAgICAgICAgICAgIHByZXNldFtydWxlXTtcbiAgICBydWxlID0gTWFqaWFuZy5ydWxlKHJ1bGUpO1xuXG4gICAgcGxheWVyLmthaWp1KHsgaWQ6IDAsIHFpamlhOiAwLCB0aXRsZTogJycsIHBsYXllcjogW10sIHJ1bGU6IHJ1bGUgfSk7XG5cbiAgICByZXR1cm4gcGxheWVyO1xufVxuXG5mdW5jdGlvbiBtYWtlX2V4YW0ocGxheWVyKSB7XG4gICAgZm9yICg7Oykge1xuICAgICAgICBsZXQgemh1YW5nZmVuZyA9IChNYXRoLnJhbmRvbSgpKjIpfDA7XG4gICAgICAgIGxldCBtZW5mZW5nICAgID0gKE1hdGgucmFuZG9tKCkqNCl8MDtcbiAgICAgICAgbGV0IHNob3VwYWkgICAgPSBbICcnLCAnJywgJycsICcnIF07XG4gICAgICAgIGxldCBzaGFuID0gbmV3IE1hamlhbmcuU2hhbihwbGF5ZXIuX3J1bGUpO1xuICAgICAgICBsZXQgcWlwYWkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMzsgaSsrKSBxaXBhaS5wdXNoKHNoYW4uemltbygpKTtcbiAgICAgICAgc2hvdXBhaVttZW5mZW5nXSA9IChuZXcgTWFqaWFuZy5TaG91cGFpKHFpcGFpKSkudG9TdHJpbmcoKTtcbiAgICAgICAgcGxheWVyLnFpcGFpKHtcbiAgICAgICAgICAgIHpodWFuZ2Zlbmc6IHpodWFuZ2ZlbmcsXG4gICAgICAgICAgICBqdXNodTogICAgICBbMCwzLDIsMV1bbWVuZmVuZ10sXG4gICAgICAgICAgICBjaGFuZ2Jhbmc6ICAwLFxuICAgICAgICAgICAgbGl6aGliYW5nOiAgMCxcbiAgICAgICAgICAgIGRlZmVuOiAgICAgIFsgMjUwMDAsIDI1MDAwLCAyNTAwMCwgMjUwMDAgXSxcbiAgICAgICAgICAgIGJhb3BhaTogICAgIHNoYW4uYmFvcGFpWzBdLFxuICAgICAgICAgICAgc2hvdXBhaTogICAgc2hvdXBhaVxuICAgICAgICB9KTtcbiAgICAgICAgcGxheWVyLnNoYW4ucGFpc2h1ID0gc2hhbi5wYWlzaHUgKyA0O1xuICAgICAgICBsZXQgZ2FuZyA9IG51bGwsIGx1bmJhbiA9IDA7XG4gICAgICAgIHdoaWxlIChzaGFuLnBhaXNodSkge1xuICAgICAgICAgICAgbGV0IHA7XG4gICAgICAgICAgICBpZiAoZ2FuZykge1xuICAgICAgICAgICAgICAgIHAgPSBzaGFuLmdhbmd6aW1vKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNoYW4uX3dlaWthaWdhbmcpIHNoYW4ua2FpZ2FuZygpO1xuICAgICAgICAgICAgICAgIGdhbmcgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcCA9IHNoYW4uemltbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG1zZyA9IHsgbDogbHVuYmFuLCBwOiBwIH07XG4gICAgICAgICAgICBpZiAobHVuYmFuID09IG1lbmZlbmcpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuemltbyhtc2cpO1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuc2VsZWN0X2h1bGUoKSkge1xuICAgICAgICAgICAgICAgICAgICBzaGFuLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91cGFpOiAgICBwbGF5ZXIuc2hvdXBhaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHpodWFuZ2Zlbmc6IHpodWFuZ2ZlbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW5mZW5nOiAgICBtZW5mZW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFvcGFpOiAgICAgc2hhbi5iYW9wYWksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWJhb3BhaTogICBwbGF5ZXIuc2hvdXBhaS5saXpoaSAmJiBzaGFuLmZ1YmFvcGFpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBtID0gcGxheWVyLnNlbGVjdF9nYW5nKCk7XG4gICAgICAgICAgICAgICAgaWYgKG0pICB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nYW5nKHsgbDogbWVuZmVuZywgbTogbX0pO1xuICAgICAgICAgICAgICAgICAgICBnYW5nID0gbTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBsYXllci5kYXBhaSh7IGw6IG1lbmZlbmcsIHA6IHBsYXllci5zZWxlY3RfZGFwYWkoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnppbW8obXNnKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZGFwYWkobXNnKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuX25lbmdfcm9uZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5zZWxlY3RfaHVsZShtc2cpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoYW4uY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvbmdwYWlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHAgKyBbJycsJysnLCc9JywnLSddWyg0ICsgbHVuYmFuIC0gbWVuZmVuZykgJSA0XTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VwYWk6ICAgIHBsYXllci5zaG91cGFpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9uZ3BhaTogICAgcm9uZ3BhaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHpodWFuZ2Zlbmc6IHpodWFuZ2ZlbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW5mZW5nOiAgICBtZW5mZW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFvcGFpOiAgICAgc2hhbi5iYW9wYWksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWJhb3BhaTogICBwbGF5ZXIuc2hvdXBhaS5saXpoaSAmJiBzaGFuLmZ1YmFvcGFpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBtID0gcGxheWVyLnNlbGVjdF9mdWxvdShtc2cpO1xuICAgICAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5mdWxvdSh7IGw6IG1lbmZlbmcsIG06IG0gfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtLm1hdGNoKC9eW21wc3pdXFxkezR9LykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbmcgPSBtO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmRhcGFpKHsgbDogbWVuZmVuZywgcDogcGxheWVyLnNlbGVjdF9kYXBhaSgpfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbHVuYmFuID0gKGx1bmJhbiArIDEpICUgNDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VfZnJhZ21lbnQoaGFzaCkge1xuICAgIGxldCBbIHBhaXN0ciwgYmFvcGFpLCBmdWJhb3BhaSwgemltbywgemh1YW5nZmVuZywgbWVuZmVuZywgbGl6aGkgXVxuICAgICAgICAgICAgPSBoYXNoLnNwbGl0KCcvJyk7XG4gICAgbGV0IHNob3VwYWkgPSBNYWppYW5nLlNob3VwYWkuZnJvbVN0cmluZyhwYWlzdHIpO1xuICAgIGxldCByb25ncGFpO1xuICAgIGlmICh6aW1vICE9ICcxJyAmJiBzaG91cGFpLl96aW1vKSB7XG4gICAgICAgIHJvbmdwYWkgPSBzaG91cGFpLl96aW1vICsgJz0nO1xuICAgICAgICBzaG91cGFpLmRhcGFpKHNob3VwYWkuX3ppbW8pO1xuICAgIH1cbiAgICBpZiAobGl6aGkgPT0gJzEnKSB7XG4gICAgICAgIHNob3VwYWkuX2xpemhpID0gdHJ1ZTtcbiAgICB9XG4gICAgYmFvcGFpICAgICAgPSBiYW9wYWkgPyBiYW9wYWkuc3BsaXQoJywnKSA6IFtdO1xuICAgIGZ1YmFvcGFpICAgID0gZnViYW9wYWkgPyBmdWJhb3BhaS5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgOiBzaG91cGFpLmxpemhpID8gW10gOiBudWxsO1xuICAgIHpodWFuZ2ZlbmcgID0gKyh6aHVhbmdmZW5nIHx8IDApO1xuICAgIG1lbmZlbmcgICAgID0gKyhtZW5mZW5nIHx8IDApO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNob3VwYWk6ICAgIHNob3VwYWksXG4gICAgICAgIHJvbmdwYWk6ICAgIHJvbmdwYWksXG4gICAgICAgIHpodWFuZ2Zlbmc6IHpodWFuZ2ZlbmcsXG4gICAgICAgIG1lbmZlbmc6ICAgIG1lbmZlbmcsXG4gICAgICAgIGJhb3BhaTogICAgIGJhb3BhaSxcbiAgICAgICAgZnViYW9wYWk6ICAgZnViYW9wYWlcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBzaG93X2V4YW0oZXhhbSkge1xuXG4gICAgbGV0IGh1bGUgPSBNYWppYW5nLlV0aWwuaHVsZShcbiAgICAgICAgICAgICAgICAgICAgZXhhbS5zaG91cGFpLFxuICAgICAgICAgICAgICAgICAgICBleGFtLnJvbmdwYWksXG4gICAgICAgICAgICAgICAgICAgIE1hamlhbmcuVXRpbC5odWxlX3BhcmFtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGU6ICAgICAgIHBsYXllci5fcnVsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHpodWFuZ2Zlbmc6IGV4YW0uemh1YW5nZmVuZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbmZlbmc6ICAgIGV4YW0ubWVuZmVuZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhb3BhaTogICAgIGV4YW0uYmFvcGFpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnViYW9wYWk6ICAgZXhhbS5mdWJhb3BhaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpemhpOiAgICAgIGV4YW0uc2hvdXBhaS5saXpoaVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAkKCcuemh1YW5nZmVuZycpLnRleHQoZmVuZ19oYW56aVtleGFtLnpodWFuZ2ZlbmddKTtcbiAgICAkKCcubWVuZmVuZycpLnRleHQoZmVuZ19oYW56aVtleGFtLm1lbmZlbmddKTtcblxuICAgIGlmIChleGFtLnNob3VwYWkubGl6aGkpIHNob3coJCgnLmxpemhpJykpO1xuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgIGhpZGUoJCgnLmxpemhpJykpO1xuXG4gICAgbGV0IHNoYW4gPSB7XG4gICAgICAgIGJhb3BhaTogICBleGFtLmJhb3BhaSxcbiAgICAgICAgZnViYW9wYWk6IGV4YW0uZnViYW9wYWksXG4gICAgICAgIHBhaXNodTogICAwXG4gICAgfTtcbiAgICBpZiAoZXhhbS5mdWJhb3BhaSkgc2hvdygkKCcuc2hhbi5mdWJhb3BhaScpKTtcbiAgICBlbHNlICAgICAgICAgICAgICAgaGlkZSgkKCcuc2hhbi5mdWJhb3BhaScpKTtcbiAgICB2aWV3LmJhb3BhaSA9IG5ldyBNYWppYW5nLlVJLlNoYW4oJCgnLnNoYW4nKSwgdmlldy5wYWksIHNoYW4pLnJlZHJhdyh0cnVlKTtcblxuICAgIGxldCBzaG91cGFpID0gZXhhbS5zaG91cGFpLmNsb25lKCk7XG4gICAgaWYgKGV4YW0ucm9uZ3BhaSkgc2hvdXBhaS56aW1vKGV4YW0ucm9uZ3BhaSk7XG5cbiAgICB2aWV3LnNob3VwYWkgPSBuZXcgTWFqaWFuZy5VSS5TaG91cGFpKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zaG91cGFpJyksIHZpZXcucGFpLCBzaG91cGFpXG4gICAgICAgICAgICAgICAgICAgICAgICApLnJlZHJhdyh0cnVlKTtcbiAgICBpZiAoZXhhbS5yb25ncGFpKSAkKCcuc2hvdXBhaSAuemltbycpLnByZXBlbmQoJzxzcGFuPuODreODszwvc3Bhbj4nKTtcbiAgICBlbHNlICAgICAgICAgICAgICAkKCcuc2hvdXBhaSAuemltbycpLmFwcGVuZCgnPHNwYW4+44OE44OiPC9zcGFuPicpO1xuXG4gICAgbGV0IGRlZmVuO1xuICAgIGlmIChodWxlICYmIGh1bGUuZGVmZW4pIHtcbiAgICAgICAgZGVmZW4gPSAoZXhhbS5yb25ncGFpID8gJ+ODreODszogJyA6ICfjg4Tjg6I6ICcpXG4gICAgICAgICAgICAgICsgKGV4YW0ucm9uZ3BhaSA/IGh1bGUuZGVmZW5cbiAgICAgICAgICAgICAgICAgICAgOiBleGFtLm1lbmZlbmdcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKE1hdGguY2VpbChodWxlLmRlZmVuIC8gMjAwKSAqIDEwMCAvIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnIC8gJyArIChNYXRoLmZsb29yKGh1bGUuZGVmZW4gLyAyMDApICogMTAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBgJHtodWxlLmRlZmVuIC8gM33jgqrjg7zjg6tgKVxuICAgICAgICAgICAgICArIChodWxlLmRhbWFuZ3VhblxuICAgICAgICAgICAgICAgICAgPyAoaHVsZS5kYW1hbmd1YW4gPiAxXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGAgKOW9uea6gCDDlyR7aHVsZS5kYW1hbmd1YW59KWBcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJyAo5b255rqAKScpXG4gICAgICAgICAgICAgICAgICA6IGAgKCR7aHVsZS5mdX3nrKYgJHtodWxlLmZhbnNodX3nv7spYCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkZWZlbiA9ICco5b2544Gq44GXKSc7XG4gICAgfVxuICAgICQoJy5kZWZlbicpLnRleHQoZGVmZW4pO1xuXG4gICAgbGV0IGh1cGFpID0gJyc7XG4gICAgaWYgKGh1bGUgJiYgaHVsZS5odXBhaSlcbiAgICAgICAgaHVwYWkgPSBodWxlLmh1cGFpLm1hcChoID0+XG4gICAgICAgICAgICAgICAgICAgIGgubmFtZS5tYXRjaCgvXijotaR86KOPKT/jg4njg6kkLylcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7aC5uYW1lfSDDlyR7aC5mYW5zaHV9YCA6IGgubmFtZVxuICAgICAgICAgICAgICAgICkuam9pbignIC8gJyk7XG4gICAgJCgnLmh1cGFpJykudGV4dChodXBhaSk7XG5cbiAgICBzdGF0LnRvdGFsKys7XG5cbiAgICBoaWRlKCQoJy5hbnN3ZXInKSk7XG4gICAgc2hvdygkKCcuYnV0dG9uJykpO1xuXG4gICAgJCgnLmFuc3dlciBidXR0b24ubWlzcycpLm9mZignY2xpY2snKS5vbignY2xpY2snLCAoKT0+e1xuICAgICAgICBtaXNzX2V4YW1zLnB1c2goZXhhbSk7XG4gICAgICAgIG5leHQoKTtcbiAgICB9KTtcblxuICAgIHNob3coJCgnLmV4YW0nKSk7XG4gICAgaGlkZSgkKCcuYnJlYWsnKSk7XG4gICAgc2hvdygkKCcuZHJpbGwnKSk7XG5cbiAgICBuZXh0X2V4YW0gPSBudWxsO1xuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgbmV4dF9leGFtID0gbWlzc19leGFtcy5zcGxpY2UoTWF0aC5yYW5kb20oKSAqIDUsIDEpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBtYWtlX2V4YW0ocGxheWVyKTtcbiAgICB9LCAxMCk7XG59XG5cbmZ1bmN0aW9uIG5leHQoKSB7XG4gICAgaGlkZSgkKCcuZHJpbGwnKSk7XG4gICAgJCgnLnN0YXQnKS50ZXh0KFxuICAgICAgICBg5Zue562U5pWwOiAke3N0YXQudG90YWx944CBYFxuICAgICAgICArIGDmraPnrZTnjoc6ICR7KHN0YXQucmlnaHQgLyBzdGF0LnRvdGFsICogMTAwKXwwfSVgKTtcbiAgICBpZiAoc3RhdC50b3RhbCAlIDEwID09IDApIHRha2VfYnJlYWsoKTtcbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgIHNob3dfZXhhbShuZXh0X2V4YW0gfHwgbWFrZV9leGFtKHBsYXllcikpO1xufVxuXG5mdW5jdGlvbiB0YWtlX2JyZWFrKCkge1xuICAgIGhpZGUoJCgnLmV4YW0nKSk7XG4gICAgc2hvdygkKCcuYnJlYWsnKSk7XG4gICAgc2hvdygkKCcuZHJpbGwnKSk7XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnQoKSB7XG5cbiAgICBoaWRlKCQoJy5kcmlsbCcpKTtcbiAgICAkKCcuc3RhdCcpLnRleHQoJycpO1xuXG4gICAgbmV4dF9leGFtID0gbnVsbDtcbiAgICBtaXNzX2V4YW1zID0gW107XG4gICAgcGxheWVyID0gaW5pdF9wbGF5ZXIoKTtcbiAgICBzdGF0ID0geyB0b3RhbDogIDAsIHJpZ2h0OiAgMCB9O1xuXG4gICAgaWYgKGxvY2F0aW9uLmhhc2gpXG4gICAgICAgICAgICBzaG93X2V4YW0ocGFyc2VfZnJhZ21lbnQobG9jYXRpb24uaGFzaC5yZXBsYWNlKC9eIy8sJycpKSk7XG4gICAgZWxzZSAgICBzaG93X2V4YW0obWFrZV9leGFtKHBsYXllcikpO1xufVxuXG4kKGZ1bmN0aW9uKCl7XG5cbiAgICB2aWV3LnBhaSA9IE1hamlhbmcuVUkucGFpKCcjbG9hZGRhdGEnKTtcblxuICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhwcmVzZXQpKSB7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwicnVsZVwiXScpLmFwcGVuZCgkKCc8b3B0aW9uPicpLnZhbChrZXkpLnRleHQoa2V5KSk7XG4gICAgfVxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnTWFqaWFuZy5ydWxlJykpIHtcbiAgICAgICAgJCgnc2VsZWN0W25hbWU9XCJydWxlXCJdJykuYXBwZW5kKCQoJzxvcHRpb24+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbCgnLScpLnRleHQoJ+OCq+OCueOCv+ODoOODq+ODvOODqycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzZWxlY3RlZCcsdHJ1ZSkpO1xuICAgIH1cblxuICAgICQoJ3NlbGVjdFtuYW1lPVwicnVsZVwiXScpLm9uKCdjaGFuZ2UnLCByZXN0YXJ0KTtcblxuICAgICQoJy5idXR0b24gYnV0dG9uJykub24oJ2NsaWNrJywgKCk9PntcbiAgICAgICAgc2hvdygkKCcuYW5zd2VyJykpO1xuICAgICAgICBoaWRlKCQoJy5idXR0b24nKSk7XG4gICAgfSk7XG4gICAgJCgnLmFuc3dlciBidXR0b24ucmlnaHQnKS5vbignY2xpY2snLCAoKT0+e1xuICAgICAgICBzdGF0LnJpZ2h0Kys7XG4gICAgICAgIG5leHQoKTtcbiAgICB9KTtcbiAgICAkKCcuYnJlYWsgYnV0dG9uJykub24oJ2NsaWNrJywgKCk9PntcbiAgICAgICAgc2hvd19leGFtKG5leHRfZXhhbSB8fCBtYWtlX2V4YW0ocGxheWVyKSk7XG4gICAgfSk7XG5cbiAgICByZXN0YXJ0KCk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==