/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@kobalab/tenhou-url-log/lib/logconv.js":
/*!*************************************************************!*\
  !*** ./node_modules/@kobalab/tenhou-url-log/lib/logconv.js ***!
  \*************************************************************/
/***/ ((module) => {

/*!
 *  @kobalab/tenhou-url-log v1.0.3
 *
 *  Copyright(C) 2024 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/tenhou-url-log/blob/master/LICENSE
 */


function pai(p) {
    let rv = p[2] == '_' ? 60
           : p[1] == '0' ? + ('5' + { m:'1', p:'2', s:'3' }[p[0]])
           : + ({ m:'1', p:'2', s:'3', z:'4' }[p[0]] + p[1]);
    if (p.slice(-1) == '*') rv = 'r' + rv;
    return rv;
}

function qipai(paistr) {
    let rv = [];
    for (let suitstr of paistr.match(/[mpsz]\d+/g) || []) {
        let s = suitstr[0];
        for (let n of suitstr.match(/\d/g)) {
            rv.push(pai(s+n));
        }
    }
    return rv;
}

function mianzi(m) {
    let h = m.replace(/0/,'5');
    let s = m[0];
    let d = m.match(/[\+\=\-]/);
    if (h.match(/^[mpsz](\d)\1\1\1$/)) {
        let nn = m.match(/\d/g);
        return '' + pai(s+nn[0]) + pai(s+nn[1]) + pai(s+nn[2])
                  + 'a' + pai(s+nn[3]);
    }
    else if (h.match(/^[mpsz](\d)\1\1\1[\+\=\-]$/)) {
        let nn = m.match(/\d/g);
        return d == '-' ?      'm' + pai(s+nn[3]) + pai(s+nn[0]) + pai(s+nn[1])
                             + pai(s+nn[2])
             : d == '=' ? '' + pai(s+nn[0]) + 'm' + pai(s+nn[3]) + pai(s+nn[1])
                             + pai(s+nn[2])
             :            '' + pai(s+nn[0]) + pai(s+nn[1]) + pai(s+nn[2])
                             + 'm' + pai(s+nn[3]);
    }
    else if (h.match(/^[mpsz](\d)\1\1[\+\=\-]\1$/)) {
        let nn = m.match(/\d/g);
        return d == '-' ?      'k' + pai(s+nn[3]) + pai(s+nn[2]) + pai(s+nn[0])
                             + pai(s+nn[1])
             : d == '=' ? '' + pai(s+nn[0]) + 'k' + pai(s+nn[3]) + pai(s+nn[2])
                             + pai(s+nn[1])
             :            '' + pai(s+nn[0]) + pai(s+nn[1]) + 'k' + pai(s+nn[3])
                             + pai(s+nn[2]);
    }
    else if (h.match(/^[mpsz](\d)\1\1[\+\=\-]$/)) {
        let nn = m.match(/\d/g);
        return d == '-' ?      'p' + pai(s+nn[2]) + pai(s+nn[0]) + pai(s+nn[1])
             : d == '=' ? '' + pai(s+nn[0]) + 'p' + pai(s+nn[2]) + pai(s+nn[1])
             :            '' + pai(s+nn[0]) + pai(s+nn[1]) + 'p' + pai(s+nn[2]);
    }
    else {
        let nn = m.match(/\d(?=[\+\=\-])/g).concat(m.match(/\d(?![\+\=\-])/g));
        return 'c' + pai(s+nn[0]) + pai(s+nn[1]) + pai(s+nn[2]);
    }
}

function defen(hule) {
    let manguan = hule.defen / (hule.l == 0 ? 6 : 4) / 2000;
    let rv = manguan >= 4   ? '役満'
           : manguan >= 3   ? '三倍満'
           : manguan >= 2   ? '倍満'
           : manguan >= 1.5 ? '跳満'
           : manguan >= 1   ? '満貫'
           : `${hule.fu}符${hule.fanshu}飜`;
    rv += hule.baojia != null ? hule.defen + '点'
        : hule.l == 0 ? ((hule.defen / 3)|0) + '点∀'
        : (Math.ceil(hule.defen / 200) * 100 / 2) + '-'
            + (Math.floor(hule.defen / 200) * 100) + '点';
    return rv;
}

function hule(hule, player_id) {
    let rv = ['和了', [], []];
    for (let l = 0; l < 4; l++) {
        rv[1][player_id[l]] = hule.fenpei[l];
    }
    let bao = hule.hupai.filter(h=>h.baojia != null)[0];
    let baojia = bao ? (hule.l + {'+':1,'=':2,'-':3}[bao.baojia]) % 4 : null;
    rv[2]= [ player_id[hule.l],
             player_id[hule.baojia == null ? hule.l : hule.baojia],
             player_id[baojia != null && baojia != hule.baojia
                                                    ? baojia : hule.l],
             defen(hule) ];
    for (let hupai of hule.hupai) {
        let name = hupai.name.replace(/^ダブル立直$/,'両立直')
                             .replace(/^翻牌 /,'役牌 ')
                             .replace(/^国士無双十三面$/,'国士無双１３面')
                 + (hule.damanguan ? '(役満)' : `(${hupai.fanshu}飜)`);
        rv[2].push(name);
    }
    return rv;
}

function pingju(pingju, player_id) {
    if (pingju.name.match(/^流局|荒牌平局|流し満貫$/)) {
        let rv = [ pingju.name.replace(/^荒牌平局$/,'流局'), [] ];
        for (let l = 0; l < 4; l++) {
            rv[1][player_id[l]] = pingju.fenpei[l];
        }
        return rv;
    }
    else {
        let name = pingju.name.replace(/^三家和$/,'三家和了')
                              .replace(/^四開槓$/,'四槓散了');
        return [ name ];
    }
}

function gamelog(log, qijia = 0) {
    let player_id = [];
    let rv = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
    for (let data of log) {
        if (data.qipai) {
            rv[0] = [ data.qipai.zhuangfeng * 4 + data.qipai.jushu,
                      data.qipai.changbang, data.qipai.lizhibang ];
            for (let l = 0; l < 4; l++) {
                player_id[l] = (qijia + data.qipai.jushu + l) % 4;
                rv[1][player_id[l]] = data.qipai.defen[l];
                rv[4 + player_id[l]*3] = qipai(data.qipai.shoupai[l]);
            }
            rv[2] = [ pai(data.qipai.baopai) ];
        }
        else if (data.zimo) {
            rv[4 + player_id[data.zimo.l]*3 + 1].push(pai(data.zimo.p));
        }
        else if (data.dapai) {
            rv[4 + player_id[data.dapai.l]* 3 + 2].push(pai(data.dapai.p));
        }
        else if (data.fulou) {
            rv[4 + player_id[data.fulou.l]*3 + 1].push(mianzi(data.fulou.m));
            if (data.fulou.m.match(/\d{4}/)) {
                rv[4 + player_id[data.fulou.l]*3 + 2].push(0);
            }
        }
        else if (data.gang) {
            rv[4 + player_id[data.gang.l]* 3 + 2].push(mianzi(data.gang.m));
        }
        else if (data.gangzimo) {
            rv[4 + player_id[data.gangzimo.l]*3 + 1].push(pai(data.gangzimo.p));
        }
        else if (data.kaigang) {
            rv[2].push(pai(data.kaigang.baopai));
        }
        else if (data.hule) {
            rv[3]  = (data.hule.fubaopai||[]).map(p => pai(p));
            rv[16] = hule(data.hule, player_id);
        }
        else if (data.pingju) {
            rv[16] = pingju(data.pingju, player_id);
        }
    }
    return rv;
}

function logconv(paipu, n, rule = {disp:'電脳麻将', aka:1}) {
    let title = paipu.title.split(/\n/).concat(['','']).slice(0,2);
    let name  = paipu.player.map(n => n.replace(/\n.*$/,''));
    name = name.splice(paipu.qijia).concat(name);
    let log = [];
    for (let i = 0; i < paipu.log.length; i++) {
        if (n != null && n != i) continue;
        log.push(gamelog(paipu.log[i]));
    }
    return { title: title, name: name, rule: rule, log: log };
}

module.exports = logconv;


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
  !*** ./src/js/paipu.js ***!
  \*************************/
/*!
 *  電脳麻将: 牌譜ビューア v2.4.16
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */


const { hide, show, fadeIn, scale   } = Majiang.UI.Util;

$(function(){

    const tenhou_log = 'https://kobalab.net/majiang/tenhou-log/';

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const rule  = Majiang.rule(
                    JSON.parse(localStorage.getItem('Majiang.rule')||'{}'));

    let file;
    let _viewer;

    const analyzer = (kaiju)=>{
        $('body').addClass('analyzer');
        return new Majiang.UI.Analyzer($('#board > .analyzer'), kaiju, pai,
                                        ()=>$('body').removeClass('analyzer'));
    };
    const viewer = (paipu)=>{
        $('#board .controller').addClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        _viewer = new Majiang.UI.Paipu(
                        $('#board'), paipu, pai, audio, 'Majiang.pref',
                        ()=>{ fadeIn($('body').attr('class','file'));
                              _viewer = null },
                        analyzer);
        $('input[name="limited"]', tenhou_dialog)
                            .prop('disabled', false).val([0]);
        return _viewer;
    };
    const stat = (paipu_list)=>{
        fadeIn($('body').attr('class','stat'));
        return new Majiang.UI.PaipuStat($('#stat'), paipu_list,
                        ()=>fadeIn($('body').attr('class','file')));
    };
    const preview = (paipu)=>{
        $('#board .controller').addClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        _viewer = new Majiang.UI.Paipu(
                        $('#board'), paipu, pai, audio, 'Majiang.pref',
                        ()=>{ fadeIn($('body').attr('class','editor'));
                              _viewer = null },
                        analyzer);
        $('input[name="limited"]', tenhou_dialog)
                            .prop('disabled', true).val([1]);
        return _viewer;
    };
    const editor = (paipu, save)=>{
        new Majiang.UI.PaipuEditor($('#editor'), paipu, rule, pai,
                        ()=>{ file.storage(true);
                              fadeIn($('body').attr('class','file')) },
                        save, preview);
        fadeIn($('body').attr('class','editor'));
    };

    if (location.search) {
        file = new Majiang.UI.PaipuFile(
                                $('#file'), 'Majiang.paipu',
                                viewer, stat, editor,
                                tenhou_log,
                                location.search.replace(/^\?/,''),
                                location.hash.replace(/^#/,''));
    }
    else {
        file = new Majiang.UI.PaipuFile(
                                $('#file'), 'Majiang.paipu',
                                viewer, stat, editor,
                                tenhou_log);
    }
    file.redraw();

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    const logconv = __webpack_require__(/*! @kobalab/tenhou-url-log */ "./node_modules/@kobalab/tenhou-url-log/lib/logconv.js");
    const tenhou_dialog = $('#board .tenhou-dialog');

    function set_data() {
        let type    = $('[name="type"]:checked', tenhou_dialog).val();
        let log_idx = $('[name="limited"]', tenhou_dialog).prop('checked')
                                        ? _viewer._log_idx : null;
        let data = '';
        if (type == 'JSON') {
            data = JSON.stringify(logconv(_viewer._paipu, log_idx));
            $('textarea', tenhou_dialog).attr('class','JSON');
        }
        else {
            for (let i = 0; i < _viewer._paipu.log.length; i++) {
                if (log_idx != null && i != log_idx) continue;
                data += 'https://tenhou.net/6/#json='
                        + encodeURI(JSON.stringify(logconv(_viewer._paipu, i)))
                        + '\n';
            }
            $('textarea', tenhou_dialog).attr('class','URL');
        }
        $('textarea', tenhou_dialog).val(data);
        if (! navigator.clipboard) {
            $('textarea', tenhou_dialog).attr('disabled', false).select();
            show($('[type="button"]', tenhou_dialog));
            hide($('[type="submit"]', tenhou_dialog));
        }
        else {
            show($('[type="button"]', tenhou_dialog));
            show($('[type="submit"]', tenhou_dialog));
        }
    }

    function open_tenhou_dialog() {
        if (_viewer._log_idx < 0) return;
        _viewer.clear_handler();
        show(tenhou_dialog);
        set_data();
    }
    function submit_tenhou_dialog() {
        if (navigator.clipboard) {
            let data = $('textarea', tenhou_dialog).val();
            navigator.clipboard.writeText(data);
        }
        close_tenhou_dialog();
        return false;
    }
    function close_tenhou_dialog() {
        hide(tenhou_dialog);
        _viewer.set_handler();
    }

    $(window).on('keyup', (ev)=>{
        if (! _viewer || ev.key != 't') return;
        open_tenhou_dialog();
    });
    $('form', tenhou_dialog).on('submit', submit_tenhou_dialog);
    $('form [type="button"]', tenhou_dialog).on('click', close_tenhou_dialog);
    $('input', tenhou_dialog).on('change', set_data);
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFqaWFuZy8uL25vZGVfbW9kdWxlcy9Aa29iYWxhYi90ZW5ob3UtdXJsLWxvZy9saWIvbG9nY29udi5qcyIsIndlYnBhY2s6Ly9tYWppYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21hamlhbmcvLi9zcmMvanMvcGFpcHUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiAgQGtvYmFsYWIvdGVuaG91LXVybC1sb2cgdjEuMC4zXG4gKlxuICogIENvcHlyaWdodChDKSAyMDI0IFNhdG9zaGkgS29iYXlhc2hpXG4gKiAgUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL2tvYmFsYWIvdGVuaG91LXVybC1sb2cvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gcGFpKHApIHtcbiAgICBsZXQgcnYgPSBwWzJdID09ICdfJyA/IDYwXG4gICAgICAgICAgIDogcFsxXSA9PSAnMCcgPyArICgnNScgKyB7IG06JzEnLCBwOicyJywgczonMycgfVtwWzBdXSlcbiAgICAgICAgICAgOiArICh7IG06JzEnLCBwOicyJywgczonMycsIHo6JzQnIH1bcFswXV0gKyBwWzFdKTtcbiAgICBpZiAocC5zbGljZSgtMSkgPT0gJyonKSBydiA9ICdyJyArIHJ2O1xuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gcWlwYWkocGFpc3RyKSB7XG4gICAgbGV0IHJ2ID0gW107XG4gICAgZm9yIChsZXQgc3VpdHN0ciBvZiBwYWlzdHIubWF0Y2goL1ttcHN6XVxcZCsvZykgfHwgW10pIHtcbiAgICAgICAgbGV0IHMgPSBzdWl0c3RyWzBdO1xuICAgICAgICBmb3IgKGxldCBuIG9mIHN1aXRzdHIubWF0Y2goL1xcZC9nKSkge1xuICAgICAgICAgICAgcnYucHVzaChwYWkocytuKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBtaWFuemkobSkge1xuICAgIGxldCBoID0gbS5yZXBsYWNlKC8wLywnNScpO1xuICAgIGxldCBzID0gbVswXTtcbiAgICBsZXQgZCA9IG0ubWF0Y2goL1tcXCtcXD1cXC1dLyk7XG4gICAgaWYgKGgubWF0Y2goL15bbXBzel0oXFxkKVxcMVxcMVxcMSQvKSkge1xuICAgICAgICBsZXQgbm4gPSBtLm1hdGNoKC9cXGQvZyk7XG4gICAgICAgIHJldHVybiAnJyArIHBhaShzK25uWzBdKSArIHBhaShzK25uWzFdKSArIHBhaShzK25uWzJdKVxuICAgICAgICAgICAgICAgICAgKyAnYScgKyBwYWkocytublszXSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGgubWF0Y2goL15bbXBzel0oXFxkKVxcMVxcMVxcMVtcXCtcXD1cXC1dJC8pKSB7XG4gICAgICAgIGxldCBubiA9IG0ubWF0Y2goL1xcZC9nKTtcbiAgICAgICAgcmV0dXJuIGQgPT0gJy0nID8gICAgICAnbScgKyBwYWkocytublszXSkgKyBwYWkocytublswXSkgKyBwYWkocytublsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBwYWkocytublsyXSlcbiAgICAgICAgICAgICA6IGQgPT0gJz0nID8gJycgKyBwYWkocytublswXSkgKyAnbScgKyBwYWkocytublszXSkgKyBwYWkocytublsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBwYWkocytublsyXSlcbiAgICAgICAgICAgICA6ICAgICAgICAgICAgJycgKyBwYWkocytublswXSkgKyBwYWkocytublsxXSkgKyBwYWkocytublsyXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnbScgKyBwYWkocytublszXSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGgubWF0Y2goL15bbXBzel0oXFxkKVxcMVxcMVtcXCtcXD1cXC1dXFwxJC8pKSB7XG4gICAgICAgIGxldCBubiA9IG0ubWF0Y2goL1xcZC9nKTtcbiAgICAgICAgcmV0dXJuIGQgPT0gJy0nID8gICAgICAnaycgKyBwYWkocytublszXSkgKyBwYWkocytublsyXSkgKyBwYWkocytublswXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBwYWkocytublsxXSlcbiAgICAgICAgICAgICA6IGQgPT0gJz0nID8gJycgKyBwYWkocytublswXSkgKyAnaycgKyBwYWkocytublszXSkgKyBwYWkocytublsyXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBwYWkocytublsxXSlcbiAgICAgICAgICAgICA6ICAgICAgICAgICAgJycgKyBwYWkocytublswXSkgKyBwYWkocytublsxXSkgKyAnaycgKyBwYWkocytublszXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBwYWkocytublsyXSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGgubWF0Y2goL15bbXBzel0oXFxkKVxcMVxcMVtcXCtcXD1cXC1dJC8pKSB7XG4gICAgICAgIGxldCBubiA9IG0ubWF0Y2goL1xcZC9nKTtcbiAgICAgICAgcmV0dXJuIGQgPT0gJy0nID8gICAgICAncCcgKyBwYWkocytublsyXSkgKyBwYWkocytublswXSkgKyBwYWkocytublsxXSlcbiAgICAgICAgICAgICA6IGQgPT0gJz0nID8gJycgKyBwYWkocytublswXSkgKyAncCcgKyBwYWkocytublsyXSkgKyBwYWkocytublsxXSlcbiAgICAgICAgICAgICA6ICAgICAgICAgICAgJycgKyBwYWkocytublswXSkgKyBwYWkocytublsxXSkgKyAncCcgKyBwYWkocytublsyXSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgbm4gPSBtLm1hdGNoKC9cXGQoPz1bXFwrXFw9XFwtXSkvZykuY29uY2F0KG0ubWF0Y2goL1xcZCg/IVtcXCtcXD1cXC1dKS9nKSk7XG4gICAgICAgIHJldHVybiAnYycgKyBwYWkocytublswXSkgKyBwYWkocytublsxXSkgKyBwYWkocytublsyXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZWZlbihodWxlKSB7XG4gICAgbGV0IG1hbmd1YW4gPSBodWxlLmRlZmVuIC8gKGh1bGUubCA9PSAwID8gNiA6IDQpIC8gMjAwMDtcbiAgICBsZXQgcnYgPSBtYW5ndWFuID49IDQgICA/ICflvbnmuoAnXG4gICAgICAgICAgIDogbWFuZ3VhbiA+PSAzICAgPyAn5LiJ5YCN5rqAJ1xuICAgICAgICAgICA6IG1hbmd1YW4gPj0gMiAgID8gJ+WAjea6gCdcbiAgICAgICAgICAgOiBtYW5ndWFuID49IDEuNSA/ICfot7PmuoAnXG4gICAgICAgICAgIDogbWFuZ3VhbiA+PSAxICAgPyAn5rqA6LKrJ1xuICAgICAgICAgICA6IGAke2h1bGUuZnV956ymJHtodWxlLmZhbnNodX3po5xgO1xuICAgIHJ2ICs9IGh1bGUuYmFvamlhICE9IG51bGwgPyBodWxlLmRlZmVuICsgJ+eCuSdcbiAgICAgICAgOiBodWxlLmwgPT0gMCA/ICgoaHVsZS5kZWZlbiAvIDMpfDApICsgJ+eCueKIgCdcbiAgICAgICAgOiAoTWF0aC5jZWlsKGh1bGUuZGVmZW4gLyAyMDApICogMTAwIC8gMikgKyAnLSdcbiAgICAgICAgICAgICsgKE1hdGguZmxvb3IoaHVsZS5kZWZlbiAvIDIwMCkgKiAxMDApICsgJ+eCuSc7XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBodWxlKGh1bGUsIHBsYXllcl9pZCkge1xuICAgIGxldCBydiA9IFsn5ZKM5LqGJywgW10sIFtdXTtcbiAgICBmb3IgKGxldCBsID0gMDsgbCA8IDQ7IGwrKykge1xuICAgICAgICBydlsxXVtwbGF5ZXJfaWRbbF1dID0gaHVsZS5mZW5wZWlbbF07XG4gICAgfVxuICAgIGxldCBiYW8gPSBodWxlLmh1cGFpLmZpbHRlcihoPT5oLmJhb2ppYSAhPSBudWxsKVswXTtcbiAgICBsZXQgYmFvamlhID0gYmFvID8gKGh1bGUubCArIHsnKyc6MSwnPSc6MiwnLSc6M31bYmFvLmJhb2ppYV0pICUgNCA6IG51bGw7XG4gICAgcnZbMl09IFsgcGxheWVyX2lkW2h1bGUubF0sXG4gICAgICAgICAgICAgcGxheWVyX2lkW2h1bGUuYmFvamlhID09IG51bGwgPyBodWxlLmwgOiBodWxlLmJhb2ppYV0sXG4gICAgICAgICAgICAgcGxheWVyX2lkW2Jhb2ppYSAhPSBudWxsICYmIGJhb2ppYSAhPSBodWxlLmJhb2ppYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYmFvamlhIDogaHVsZS5sXSxcbiAgICAgICAgICAgICBkZWZlbihodWxlKSBdO1xuICAgIGZvciAobGV0IGh1cGFpIG9mIGh1bGUuaHVwYWkpIHtcbiAgICAgICAgbGV0IG5hbWUgPSBodXBhaS5uYW1lLnJlcGxhY2UoL17jg4Djg5bjg6vnq4vnm7QkLywn5Lih56uL55u0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL17nv7vniYwgLywn5b2554mMICcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9e5Zu95aOr54Sh5Y+M5Y2B5LiJ6Z2iJC8sJ+WbveWjq+eEoeWPjO+8ke+8k+mdoicpXG4gICAgICAgICAgICAgICAgICsgKGh1bGUuZGFtYW5ndWFuID8gJyjlvbnmuoApJyA6IGAoJHtodXBhaS5mYW5zaHV96aOcKWApO1xuICAgICAgICBydlsyXS5wdXNoKG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIHBpbmdqdShwaW5nanUsIHBsYXllcl9pZCkge1xuICAgIGlmIChwaW5nanUubmFtZS5tYXRjaCgvXua1geWxgHzojZLniYzlubPlsYB85rWB44GX5rqA6LKrJC8pKSB7XG4gICAgICAgIGxldCBydiA9IFsgcGluZ2p1Lm5hbWUucmVwbGFjZSgvXuiNkueJjOW5s+WxgCQvLCfmtYHlsYAnKSwgW10gXTtcbiAgICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCA0OyBsKyspIHtcbiAgICAgICAgICAgIHJ2WzFdW3BsYXllcl9pZFtsXV0gPSBwaW5nanUuZmVucGVpW2xdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBydjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBuYW1lID0gcGluZ2p1Lm5hbWUucmVwbGFjZSgvXuS4ieWutuWSjCQvLCfkuInlrrblkozkuoYnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL17lm5vplovmp5MkLywn5Zub5qeT5pWj5LqGJyk7XG4gICAgICAgIHJldHVybiBbIG5hbWUgXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdhbWVsb2cobG9nLCBxaWppYSA9IDApIHtcbiAgICBsZXQgcGxheWVyX2lkID0gW107XG4gICAgbGV0IHJ2ID0gW1tdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdLFtdXTtcbiAgICBmb3IgKGxldCBkYXRhIG9mIGxvZykge1xuICAgICAgICBpZiAoZGF0YS5xaXBhaSkge1xuICAgICAgICAgICAgcnZbMF0gPSBbIGRhdGEucWlwYWkuemh1YW5nZmVuZyAqIDQgKyBkYXRhLnFpcGFpLmp1c2h1LFxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEucWlwYWkuY2hhbmdiYW5nLCBkYXRhLnFpcGFpLmxpemhpYmFuZyBdO1xuICAgICAgICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCA0OyBsKyspIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXJfaWRbbF0gPSAocWlqaWEgKyBkYXRhLnFpcGFpLmp1c2h1ICsgbCkgJSA0O1xuICAgICAgICAgICAgICAgIHJ2WzFdW3BsYXllcl9pZFtsXV0gPSBkYXRhLnFpcGFpLmRlZmVuW2xdO1xuICAgICAgICAgICAgICAgIHJ2WzQgKyBwbGF5ZXJfaWRbbF0qM10gPSBxaXBhaShkYXRhLnFpcGFpLnNob3VwYWlbbF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnZbMl0gPSBbIHBhaShkYXRhLnFpcGFpLmJhb3BhaSkgXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkYXRhLnppbW8pIHtcbiAgICAgICAgICAgIHJ2WzQgKyBwbGF5ZXJfaWRbZGF0YS56aW1vLmxdKjMgKyAxXS5wdXNoKHBhaShkYXRhLnppbW8ucCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEuZGFwYWkpIHtcbiAgICAgICAgICAgIHJ2WzQgKyBwbGF5ZXJfaWRbZGF0YS5kYXBhaS5sXSogMyArIDJdLnB1c2gocGFpKGRhdGEuZGFwYWkucCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEuZnVsb3UpIHtcbiAgICAgICAgICAgIHJ2WzQgKyBwbGF5ZXJfaWRbZGF0YS5mdWxvdS5sXSozICsgMV0ucHVzaChtaWFuemkoZGF0YS5mdWxvdS5tKSk7XG4gICAgICAgICAgICBpZiAoZGF0YS5mdWxvdS5tLm1hdGNoKC9cXGR7NH0vKSkge1xuICAgICAgICAgICAgICAgIHJ2WzQgKyBwbGF5ZXJfaWRbZGF0YS5mdWxvdS5sXSozICsgMl0ucHVzaCgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkYXRhLmdhbmcpIHtcbiAgICAgICAgICAgIHJ2WzQgKyBwbGF5ZXJfaWRbZGF0YS5nYW5nLmxdKiAzICsgMl0ucHVzaChtaWFuemkoZGF0YS5nYW5nLm0pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkYXRhLmdhbmd6aW1vKSB7XG4gICAgICAgICAgICBydls0ICsgcGxheWVyX2lkW2RhdGEuZ2FuZ3ppbW8ubF0qMyArIDFdLnB1c2gocGFpKGRhdGEuZ2FuZ3ppbW8ucCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEua2FpZ2FuZykge1xuICAgICAgICAgICAgcnZbMl0ucHVzaChwYWkoZGF0YS5rYWlnYW5nLmJhb3BhaSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEuaHVsZSkge1xuICAgICAgICAgICAgcnZbM10gID0gKGRhdGEuaHVsZS5mdWJhb3BhaXx8W10pLm1hcChwID0+IHBhaShwKSk7XG4gICAgICAgICAgICBydlsxNl0gPSBodWxlKGRhdGEuaHVsZSwgcGxheWVyX2lkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkYXRhLnBpbmdqdSkge1xuICAgICAgICAgICAgcnZbMTZdID0gcGluZ2p1KGRhdGEucGluZ2p1LCBwbGF5ZXJfaWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gbG9nY29udihwYWlwdSwgbiwgcnVsZSA9IHtkaXNwOifpm7vohLPpurvlsIYnLCBha2E6MX0pIHtcbiAgICBsZXQgdGl0bGUgPSBwYWlwdS50aXRsZS5zcGxpdCgvXFxuLykuY29uY2F0KFsnJywnJ10pLnNsaWNlKDAsMik7XG4gICAgbGV0IG5hbWUgID0gcGFpcHUucGxheWVyLm1hcChuID0+IG4ucmVwbGFjZSgvXFxuLiokLywnJykpO1xuICAgIG5hbWUgPSBuYW1lLnNwbGljZShwYWlwdS5xaWppYSkuY29uY2F0KG5hbWUpO1xuICAgIGxldCBsb2cgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhaXB1LmxvZy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobiAhPSBudWxsICYmIG4gIT0gaSkgY29udGludWU7XG4gICAgICAgIGxvZy5wdXNoKGdhbWVsb2cocGFpcHUubG9nW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiB7IHRpdGxlOiB0aXRsZSwgbmFtZTogbmFtZSwgcnVsZTogcnVsZSwgbG9nOiBsb2cgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2djb252O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8qIVxuICogIOmbu+iEs+m6u+Wwhjog54mM6K2c44OT44Ol44O844KiIHYyLjQuMTZcbiAqXG4gKiAgQ29weXJpZ2h0KEMpIDIwMTcgU2F0b3NoaSBLb2JheWFzaGlcbiAqICBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqICBodHRwczovL2dpdGh1Yi5jb20va29iYWxhYi9NYWppYW5nL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IHsgaGlkZSwgc2hvdywgZmFkZUluLCBzY2FsZSAgIH0gPSBNYWppYW5nLlVJLlV0aWw7XG5cbiQoZnVuY3Rpb24oKXtcblxuICAgIGNvbnN0IHRlbmhvdV9sb2cgPSAnaHR0cHM6Ly9rb2JhbGFiLm5ldC9tYWppYW5nL3RlbmhvdS1sb2cvJztcblxuICAgIGNvbnN0IHBhaSAgID0gTWFqaWFuZy5VSS5wYWkoJCgnI2xvYWRkYXRhJykpO1xuICAgIGNvbnN0IGF1ZGlvID0gTWFqaWFuZy5VSS5hdWRpbygkKCcjbG9hZGRhdGEnKSk7XG5cbiAgICBjb25zdCBydWxlICA9IE1hamlhbmcucnVsZShcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnTWFqaWFuZy5ydWxlJyl8fCd7fScpKTtcblxuICAgIGxldCBmaWxlO1xuICAgIGxldCBfdmlld2VyO1xuXG4gICAgY29uc3QgYW5hbHl6ZXIgPSAoa2FpanUpPT57XG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnYW5hbHl6ZXInKTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYWppYW5nLlVJLkFuYWx5emVyKCQoJyNib2FyZCA+IC5hbmFseXplcicpLCBrYWlqdSwgcGFpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpPT4kKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2FuYWx5emVyJykpO1xuICAgIH07XG4gICAgY29uc3Qgdmlld2VyID0gKHBhaXB1KT0+e1xuICAgICAgICAkKCcjYm9hcmQgLmNvbnRyb2xsZXInKS5hZGRDbGFzcygncGFpcHUnKVxuICAgICAgICAkKCdib2R5JykuYXR0cignY2xhc3MnLCdib2FyZCcpO1xuICAgICAgICBzY2FsZSgkKCcjYm9hcmQnKSwgJCgnI3NwYWNlJykpO1xuICAgICAgICBfdmlld2VyID0gbmV3IE1hamlhbmcuVUkuUGFpcHUoXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjYm9hcmQnKSwgcGFpcHUsIHBhaSwgYXVkaW8sICdNYWppYW5nLnByZWYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgKCk9PnsgZmFkZUluKCQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2ZpbGUnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdmlld2VyID0gbnVsbCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5hbHl6ZXIpO1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwibGltaXRlZFwiXScsIHRlbmhvdV9kaWFsb2cpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpLnZhbChbMF0pO1xuICAgICAgICByZXR1cm4gX3ZpZXdlcjtcbiAgICB9O1xuICAgIGNvbnN0IHN0YXQgPSAocGFpcHVfbGlzdCk9PntcbiAgICAgICAgZmFkZUluKCQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ3N0YXQnKSk7XG4gICAgICAgIHJldHVybiBuZXcgTWFqaWFuZy5VSS5QYWlwdVN0YXQoJCgnI3N0YXQnKSwgcGFpcHVfbGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICgpPT5mYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnZmlsZScpKSk7XG4gICAgfTtcbiAgICBjb25zdCBwcmV2aWV3ID0gKHBhaXB1KT0+e1xuICAgICAgICAkKCcjYm9hcmQgLmNvbnRyb2xsZXInKS5hZGRDbGFzcygncGFpcHUnKVxuICAgICAgICAkKCdib2R5JykuYXR0cignY2xhc3MnLCdib2FyZCcpO1xuICAgICAgICBzY2FsZSgkKCcjYm9hcmQnKSwgJCgnI3NwYWNlJykpO1xuICAgICAgICBfdmlld2VyID0gbmV3IE1hamlhbmcuVUkuUGFpcHUoXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjYm9hcmQnKSwgcGFpcHUsIHBhaSwgYXVkaW8sICdNYWppYW5nLnByZWYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgKCk9PnsgZmFkZUluKCQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2VkaXRvcicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF92aWV3ZXIgPSBudWxsIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmFseXplcik7XG4gICAgICAgICQoJ2lucHV0W25hbWU9XCJsaW1pdGVkXCJdJywgdGVuaG91X2RpYWxvZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKS52YWwoWzFdKTtcbiAgICAgICAgcmV0dXJuIF92aWV3ZXI7XG4gICAgfTtcbiAgICBjb25zdCBlZGl0b3IgPSAocGFpcHUsIHNhdmUpPT57XG4gICAgICAgIG5ldyBNYWppYW5nLlVJLlBhaXB1RWRpdG9yKCQoJyNlZGl0b3InKSwgcGFpcHUsIHJ1bGUsIHBhaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICgpPT57IGZpbGUuc3RvcmFnZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVJbigkKCdib2R5JykuYXR0cignY2xhc3MnLCdmaWxlJykpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlLCBwcmV2aWV3KTtcbiAgICAgICAgZmFkZUluKCQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2VkaXRvcicpKTtcbiAgICB9O1xuXG4gICAgaWYgKGxvY2F0aW9uLnNlYXJjaCkge1xuICAgICAgICBmaWxlID0gbmV3IE1hamlhbmcuVUkuUGFpcHVGaWxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZmlsZScpLCAnTWFqaWFuZy5wYWlwdScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdlciwgc3RhdCwgZWRpdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5ob3VfbG9nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5zZWFyY2gucmVwbGFjZSgvXlxcPy8sJycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoL14jLywnJykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlsZSA9IG5ldyBNYWppYW5nLlVJLlBhaXB1RmlsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2ZpbGUnKSwgJ01hamlhbmcucGFpcHUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3ZXIsIHN0YXQsIGVkaXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuaG91X2xvZyk7XG4gICAgfVxuICAgIGZpbGUucmVkcmF3KCk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsICgpPT5zY2FsZSgkKCcjYm9hcmQnKSwgJCgnI3NwYWNlJykpKTtcblxuICAgIGNvbnN0IGxvZ2NvbnYgPSByZXF1aXJlKCdAa29iYWxhYi90ZW5ob3UtdXJsLWxvZycpO1xuICAgIGNvbnN0IHRlbmhvdV9kaWFsb2cgPSAkKCcjYm9hcmQgLnRlbmhvdS1kaWFsb2cnKTtcblxuICAgIGZ1bmN0aW9uIHNldF9kYXRhKCkge1xuICAgICAgICBsZXQgdHlwZSAgICA9ICQoJ1tuYW1lPVwidHlwZVwiXTpjaGVja2VkJywgdGVuaG91X2RpYWxvZykudmFsKCk7XG4gICAgICAgIGxldCBsb2dfaWR4ID0gJCgnW25hbWU9XCJsaW1pdGVkXCJdJywgdGVuaG91X2RpYWxvZykucHJvcCgnY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBfdmlld2VyLl9sb2dfaWR4IDogbnVsbDtcbiAgICAgICAgbGV0IGRhdGEgPSAnJztcbiAgICAgICAgaWYgKHR5cGUgPT0gJ0pTT04nKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkobG9nY29udihfdmlld2VyLl9wYWlwdSwgbG9nX2lkeCkpO1xuICAgICAgICAgICAgJCgndGV4dGFyZWEnLCB0ZW5ob3VfZGlhbG9nKS5hdHRyKCdjbGFzcycsJ0pTT04nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3ZpZXdlci5fcGFpcHUubG9nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvZ19pZHggIT0gbnVsbCAmJiBpICE9IGxvZ19pZHgpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRhdGEgKz0gJ2h0dHBzOi8vdGVuaG91Lm5ldC82LyNqc29uPSdcbiAgICAgICAgICAgICAgICAgICAgICAgICsgZW5jb2RlVVJJKEpTT04uc3RyaW5naWZ5KGxvZ2NvbnYoX3ZpZXdlci5fcGFpcHUsIGkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKCd0ZXh0YXJlYScsIHRlbmhvdV9kaWFsb2cpLmF0dHIoJ2NsYXNzJywnVVJMJyk7XG4gICAgICAgIH1cbiAgICAgICAgJCgndGV4dGFyZWEnLCB0ZW5ob3VfZGlhbG9nKS52YWwoZGF0YSk7XG4gICAgICAgIGlmICghIG5hdmlnYXRvci5jbGlwYm9hcmQpIHtcbiAgICAgICAgICAgICQoJ3RleHRhcmVhJywgdGVuaG91X2RpYWxvZykuYXR0cignZGlzYWJsZWQnLCBmYWxzZSkuc2VsZWN0KCk7XG4gICAgICAgICAgICBzaG93KCQoJ1t0eXBlPVwiYnV0dG9uXCJdJywgdGVuaG91X2RpYWxvZykpO1xuICAgICAgICAgICAgaGlkZSgkKCdbdHlwZT1cInN1Ym1pdFwiXScsIHRlbmhvdV9kaWFsb2cpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNob3coJCgnW3R5cGU9XCJidXR0b25cIl0nLCB0ZW5ob3VfZGlhbG9nKSk7XG4gICAgICAgICAgICBzaG93KCQoJ1t0eXBlPVwic3VibWl0XCJdJywgdGVuaG91X2RpYWxvZykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb3Blbl90ZW5ob3VfZGlhbG9nKCkge1xuICAgICAgICBpZiAoX3ZpZXdlci5fbG9nX2lkeCA8IDApIHJldHVybjtcbiAgICAgICAgX3ZpZXdlci5jbGVhcl9oYW5kbGVyKCk7XG4gICAgICAgIHNob3codGVuaG91X2RpYWxvZyk7XG4gICAgICAgIHNldF9kYXRhKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN1Ym1pdF90ZW5ob3VfZGlhbG9nKCkge1xuICAgICAgICBpZiAobmF2aWdhdG9yLmNsaXBib2FyZCkge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSAkKCd0ZXh0YXJlYScsIHRlbmhvdV9kaWFsb2cpLnZhbCgpO1xuICAgICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgY2xvc2VfdGVuaG91X2RpYWxvZygpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsb3NlX3RlbmhvdV9kaWFsb2coKSB7XG4gICAgICAgIGhpZGUodGVuaG91X2RpYWxvZyk7XG4gICAgICAgIF92aWV3ZXIuc2V0X2hhbmRsZXIoKTtcbiAgICB9XG5cbiAgICAkKHdpbmRvdykub24oJ2tleXVwJywgKGV2KT0+e1xuICAgICAgICBpZiAoISBfdmlld2VyIHx8IGV2LmtleSAhPSAndCcpIHJldHVybjtcbiAgICAgICAgb3Blbl90ZW5ob3VfZGlhbG9nKCk7XG4gICAgfSk7XG4gICAgJCgnZm9ybScsIHRlbmhvdV9kaWFsb2cpLm9uKCdzdWJtaXQnLCBzdWJtaXRfdGVuaG91X2RpYWxvZyk7XG4gICAgJCgnZm9ybSBbdHlwZT1cImJ1dHRvblwiXScsIHRlbmhvdV9kaWFsb2cpLm9uKCdjbGljaycsIGNsb3NlX3RlbmhvdV9kaWFsb2cpO1xuICAgICQoJ2lucHV0JywgdGVuaG91X2RpYWxvZykub24oJ2NoYW5nZScsIHNldF9kYXRhKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9