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
 *  電脳麻将: 牌譜ビューア v2.4.17
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
        delete _viewer._view.dummy_name;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWppYW5nLy4vbm9kZV9tb2R1bGVzL0Brb2JhbGFiL3RlbmhvdS11cmwtbG9nL2xpYi9sb2djb252LmpzIiwid2VicGFjazovL21hamlhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWFqaWFuZy8uL3NyYy9qcy9wYWlwdS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqICBAa29iYWxhYi90ZW5ob3UtdXJsLWxvZyB2MS4wLjNcbiAqXG4gKiAgQ29weXJpZ2h0KEMpIDIwMjQgU2F0b3NoaSBLb2JheWFzaGlcbiAqICBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqICBodHRwczovL2dpdGh1Yi5jb20va29iYWxhYi90ZW5ob3UtdXJsLWxvZy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBwYWkocCkge1xuICAgIGxldCBydiA9IHBbMl0gPT0gJ18nID8gNjBcbiAgICAgICAgICAgOiBwWzFdID09ICcwJyA/ICsgKCc1JyArIHsgbTonMScsIHA6JzInLCBzOiczJyB9W3BbMF1dKVxuICAgICAgICAgICA6ICsgKHsgbTonMScsIHA6JzInLCBzOiczJywgejonNCcgfVtwWzBdXSArIHBbMV0pO1xuICAgIGlmIChwLnNsaWNlKC0xKSA9PSAnKicpIHJ2ID0gJ3InICsgcnY7XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBxaXBhaShwYWlzdHIpIHtcbiAgICBsZXQgcnYgPSBbXTtcbiAgICBmb3IgKGxldCBzdWl0c3RyIG9mIHBhaXN0ci5tYXRjaCgvW21wc3pdXFxkKy9nKSB8fCBbXSkge1xuICAgICAgICBsZXQgcyA9IHN1aXRzdHJbMF07XG4gICAgICAgIGZvciAobGV0IG4gb2Ygc3VpdHN0ci5tYXRjaCgvXFxkL2cpKSB7XG4gICAgICAgICAgICBydi5wdXNoKHBhaShzK24pKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIG1pYW56aShtKSB7XG4gICAgbGV0IGggPSBtLnJlcGxhY2UoLzAvLCc1Jyk7XG4gICAgbGV0IHMgPSBtWzBdO1xuICAgIGxldCBkID0gbS5tYXRjaCgvW1xcK1xcPVxcLV0vKTtcbiAgICBpZiAoaC5tYXRjaCgvXlttcHN6XShcXGQpXFwxXFwxXFwxJC8pKSB7XG4gICAgICAgIGxldCBubiA9IG0ubWF0Y2goL1xcZC9nKTtcbiAgICAgICAgcmV0dXJuICcnICsgcGFpKHMrbm5bMF0pICsgcGFpKHMrbm5bMV0pICsgcGFpKHMrbm5bMl0pXG4gICAgICAgICAgICAgICAgICArICdhJyArIHBhaShzK25uWzNdKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaC5tYXRjaCgvXlttcHN6XShcXGQpXFwxXFwxXFwxW1xcK1xcPVxcLV0kLykpIHtcbiAgICAgICAgbGV0IG5uID0gbS5tYXRjaCgvXFxkL2cpO1xuICAgICAgICByZXR1cm4gZCA9PSAnLScgPyAgICAgICdtJyArIHBhaShzK25uWzNdKSArIHBhaShzK25uWzBdKSArIHBhaShzK25uWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHBhaShzK25uWzJdKVxuICAgICAgICAgICAgIDogZCA9PSAnPScgPyAnJyArIHBhaShzK25uWzBdKSArICdtJyArIHBhaShzK25uWzNdKSArIHBhaShzK25uWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHBhaShzK25uWzJdKVxuICAgICAgICAgICAgIDogICAgICAgICAgICAnJyArIHBhaShzK25uWzBdKSArIHBhaShzK25uWzFdKSArIHBhaShzK25uWzJdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICdtJyArIHBhaShzK25uWzNdKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaC5tYXRjaCgvXlttcHN6XShcXGQpXFwxXFwxW1xcK1xcPVxcLV1cXDEkLykpIHtcbiAgICAgICAgbGV0IG5uID0gbS5tYXRjaCgvXFxkL2cpO1xuICAgICAgICByZXR1cm4gZCA9PSAnLScgPyAgICAgICdrJyArIHBhaShzK25uWzNdKSArIHBhaShzK25uWzJdKSArIHBhaShzK25uWzBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHBhaShzK25uWzFdKVxuICAgICAgICAgICAgIDogZCA9PSAnPScgPyAnJyArIHBhaShzK25uWzBdKSArICdrJyArIHBhaShzK25uWzNdKSArIHBhaShzK25uWzJdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHBhaShzK25uWzFdKVxuICAgICAgICAgICAgIDogICAgICAgICAgICAnJyArIHBhaShzK25uWzBdKSArIHBhaShzK25uWzFdKSArICdrJyArIHBhaShzK25uWzNdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHBhaShzK25uWzJdKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaC5tYXRjaCgvXlttcHN6XShcXGQpXFwxXFwxW1xcK1xcPVxcLV0kLykpIHtcbiAgICAgICAgbGV0IG5uID0gbS5tYXRjaCgvXFxkL2cpO1xuICAgICAgICByZXR1cm4gZCA9PSAnLScgPyAgICAgICdwJyArIHBhaShzK25uWzJdKSArIHBhaShzK25uWzBdKSArIHBhaShzK25uWzFdKVxuICAgICAgICAgICAgIDogZCA9PSAnPScgPyAnJyArIHBhaShzK25uWzBdKSArICdwJyArIHBhaShzK25uWzJdKSArIHBhaShzK25uWzFdKVxuICAgICAgICAgICAgIDogICAgICAgICAgICAnJyArIHBhaShzK25uWzBdKSArIHBhaShzK25uWzFdKSArICdwJyArIHBhaShzK25uWzJdKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBubiA9IG0ubWF0Y2goL1xcZCg/PVtcXCtcXD1cXC1dKS9nKS5jb25jYXQobS5tYXRjaCgvXFxkKD8hW1xcK1xcPVxcLV0pL2cpKTtcbiAgICAgICAgcmV0dXJuICdjJyArIHBhaShzK25uWzBdKSArIHBhaShzK25uWzFdKSArIHBhaShzK25uWzJdKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlZmVuKGh1bGUpIHtcbiAgICBsZXQgbWFuZ3VhbiA9IGh1bGUuZGVmZW4gLyAoaHVsZS5sID09IDAgPyA2IDogNCkgLyAyMDAwO1xuICAgIGxldCBydiA9IG1hbmd1YW4gPj0gNCAgID8gJ+W9uea6gCdcbiAgICAgICAgICAgOiBtYW5ndWFuID49IDMgICA/ICfkuInlgI3muoAnXG4gICAgICAgICAgIDogbWFuZ3VhbiA+PSAyICAgPyAn5YCN5rqAJ1xuICAgICAgICAgICA6IG1hbmd1YW4gPj0gMS41ID8gJ+i3s+a6gCdcbiAgICAgICAgICAgOiBtYW5ndWFuID49IDEgICA/ICfmuoDosqsnXG4gICAgICAgICAgIDogYCR7aHVsZS5mdX3nrKYke2h1bGUuZmFuc2h1femjnGA7XG4gICAgcnYgKz0gaHVsZS5iYW9qaWEgIT0gbnVsbCA/IGh1bGUuZGVmZW4gKyAn54K5J1xuICAgICAgICA6IGh1bGUubCA9PSAwID8gKChodWxlLmRlZmVuIC8gMyl8MCkgKyAn54K54oiAJ1xuICAgICAgICA6IChNYXRoLmNlaWwoaHVsZS5kZWZlbiAvIDIwMCkgKiAxMDAgLyAyKSArICctJ1xuICAgICAgICAgICAgKyAoTWF0aC5mbG9vcihodWxlLmRlZmVuIC8gMjAwKSAqIDEwMCkgKyAn54K5JztcbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIGh1bGUoaHVsZSwgcGxheWVyX2lkKSB7XG4gICAgbGV0IHJ2ID0gWyflkozkuoYnLCBbXSwgW11dO1xuICAgIGZvciAobGV0IGwgPSAwOyBsIDwgNDsgbCsrKSB7XG4gICAgICAgIHJ2WzFdW3BsYXllcl9pZFtsXV0gPSBodWxlLmZlbnBlaVtsXTtcbiAgICB9XG4gICAgbGV0IGJhbyA9IGh1bGUuaHVwYWkuZmlsdGVyKGg9PmguYmFvamlhICE9IG51bGwpWzBdO1xuICAgIGxldCBiYW9qaWEgPSBiYW8gPyAoaHVsZS5sICsgeycrJzoxLCc9JzoyLCctJzozfVtiYW8uYmFvamlhXSkgJSA0IDogbnVsbDtcbiAgICBydlsyXT0gWyBwbGF5ZXJfaWRbaHVsZS5sXSxcbiAgICAgICAgICAgICBwbGF5ZXJfaWRbaHVsZS5iYW9qaWEgPT0gbnVsbCA/IGh1bGUubCA6IGh1bGUuYmFvamlhXSxcbiAgICAgICAgICAgICBwbGF5ZXJfaWRbYmFvamlhICE9IG51bGwgJiYgYmFvamlhICE9IGh1bGUuYmFvamlhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBiYW9qaWEgOiBodWxlLmxdLFxuICAgICAgICAgICAgIGRlZmVuKGh1bGUpIF07XG4gICAgZm9yIChsZXQgaHVwYWkgb2YgaHVsZS5odXBhaSkge1xuICAgICAgICBsZXQgbmFtZSA9IGh1cGFpLm5hbWUucmVwbGFjZSgvXuODgOODluODq+eri+ebtCQvLCfkuKHnq4vnm7QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXue/u+eJjCAvLCflvbnniYwgJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL17lm73lo6vnhKHlj4zljYHkuInpnaIkLywn5Zu95aOr54Sh5Y+M77yR77yT6Z2iJylcbiAgICAgICAgICAgICAgICAgKyAoaHVsZS5kYW1hbmd1YW4gPyAnKOW9uea6gCknIDogYCgke2h1cGFpLmZhbnNodX3po5wpYCk7XG4gICAgICAgIHJ2WzJdLnB1c2gobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gcGluZ2p1KHBpbmdqdSwgcGxheWVyX2lkKSB7XG4gICAgaWYgKHBpbmdqdS5uYW1lLm1hdGNoKC9e5rWB5bGAfOiNkueJjOW5s+WxgHzmtYHjgZfmuoDosqskLykpIHtcbiAgICAgICAgbGV0IHJ2ID0gWyBwaW5nanUubmFtZS5yZXBsYWNlKC9e6I2S54mM5bmz5bGAJC8sJ+a1geWxgCcpLCBbXSBdO1xuICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IDQ7IGwrKykge1xuICAgICAgICAgICAgcnZbMV1bcGxheWVyX2lkW2xdXSA9IHBpbmdqdS5mZW5wZWlbbF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGV0IG5hbWUgPSBwaW5nanUubmFtZS5yZXBsYWNlKC9e5LiJ5a625ZKMJC8sJ+S4ieWutuWSjOS6hicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXuWbm+mWi+ankyQvLCflm5vmp5PmlaPkuoYnKTtcbiAgICAgICAgcmV0dXJuIFsgbmFtZSBdO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2FtZWxvZyhsb2csIHFpamlhID0gMCkge1xuICAgIGxldCBwbGF5ZXJfaWQgPSBbXTtcbiAgICBsZXQgcnYgPSBbW10sW10sW10sW10sW10sW10sW10sW10sW10sW10sW10sW10sW10sW10sW10sW10sW11dO1xuICAgIGZvciAobGV0IGRhdGEgb2YgbG9nKSB7XG4gICAgICAgIGlmIChkYXRhLnFpcGFpKSB7XG4gICAgICAgICAgICBydlswXSA9IFsgZGF0YS5xaXBhaS56aHVhbmdmZW5nICogNCArIGRhdGEucWlwYWkuanVzaHUsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS5xaXBhaS5jaGFuZ2JhbmcsIGRhdGEucWlwYWkubGl6aGliYW5nIF07XG4gICAgICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IDQ7IGwrKykge1xuICAgICAgICAgICAgICAgIHBsYXllcl9pZFtsXSA9IChxaWppYSArIGRhdGEucWlwYWkuanVzaHUgKyBsKSAlIDQ7XG4gICAgICAgICAgICAgICAgcnZbMV1bcGxheWVyX2lkW2xdXSA9IGRhdGEucWlwYWkuZGVmZW5bbF07XG4gICAgICAgICAgICAgICAgcnZbNCArIHBsYXllcl9pZFtsXSozXSA9IHFpcGFpKGRhdGEucWlwYWkuc2hvdXBhaVtsXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBydlsyXSA9IFsgcGFpKGRhdGEucWlwYWkuYmFvcGFpKSBdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEuemltbykge1xuICAgICAgICAgICAgcnZbNCArIHBsYXllcl9pZFtkYXRhLnppbW8ubF0qMyArIDFdLnB1c2gocGFpKGRhdGEuemltby5wKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YS5kYXBhaSkge1xuICAgICAgICAgICAgcnZbNCArIHBsYXllcl9pZFtkYXRhLmRhcGFpLmxdKiAzICsgMl0ucHVzaChwYWkoZGF0YS5kYXBhaS5wKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YS5mdWxvdSkge1xuICAgICAgICAgICAgcnZbNCArIHBsYXllcl9pZFtkYXRhLmZ1bG91LmxdKjMgKyAxXS5wdXNoKG1pYW56aShkYXRhLmZ1bG91Lm0pKTtcbiAgICAgICAgICAgIGlmIChkYXRhLmZ1bG91Lm0ubWF0Y2goL1xcZHs0fS8pKSB7XG4gICAgICAgICAgICAgICAgcnZbNCArIHBsYXllcl9pZFtkYXRhLmZ1bG91LmxdKjMgKyAyXS5wdXNoKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEuZ2FuZykge1xuICAgICAgICAgICAgcnZbNCArIHBsYXllcl9pZFtkYXRhLmdhbmcubF0qIDMgKyAyXS5wdXNoKG1pYW56aShkYXRhLmdhbmcubSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEuZ2FuZ3ppbW8pIHtcbiAgICAgICAgICAgIHJ2WzQgKyBwbGF5ZXJfaWRbZGF0YS5nYW5nemltby5sXSozICsgMV0ucHVzaChwYWkoZGF0YS5nYW5nemltby5wKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YS5rYWlnYW5nKSB7XG4gICAgICAgICAgICBydlsyXS5wdXNoKHBhaShkYXRhLmthaWdhbmcuYmFvcGFpKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YS5odWxlKSB7XG4gICAgICAgICAgICBydlszXSAgPSAoZGF0YS5odWxlLmZ1YmFvcGFpfHxbXSkubWFwKHAgPT4gcGFpKHApKTtcbiAgICAgICAgICAgIHJ2WzE2XSA9IGh1bGUoZGF0YS5odWxlLCBwbGF5ZXJfaWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEucGluZ2p1KSB7XG4gICAgICAgICAgICBydlsxNl0gPSBwaW5nanUoZGF0YS5waW5nanUsIHBsYXllcl9pZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBsb2djb252KHBhaXB1LCBuLCBydWxlID0ge2Rpc3A6J+mbu+iEs+m6u+WwhicsIGFrYToxfSkge1xuICAgIGxldCB0aXRsZSA9IHBhaXB1LnRpdGxlLnNwbGl0KC9cXG4vKS5jb25jYXQoWycnLCcnXSkuc2xpY2UoMCwyKTtcbiAgICBsZXQgbmFtZSAgPSBwYWlwdS5wbGF5ZXIubWFwKG4gPT4gbi5yZXBsYWNlKC9cXG4uKiQvLCcnKSk7XG4gICAgbmFtZSA9IG5hbWUuc3BsaWNlKHBhaXB1LnFpamlhKS5jb25jYXQobmFtZSk7XG4gICAgbGV0IGxvZyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFpcHUubG9nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChuICE9IG51bGwgJiYgbiAhPSBpKSBjb250aW51ZTtcbiAgICAgICAgbG9nLnB1c2goZ2FtZWxvZyhwYWlwdS5sb2dbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdGl0bGU6IHRpdGxlLCBuYW1lOiBuYW1lLCBydWxlOiBydWxlLCBsb2c6IGxvZyB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ2NvbnY7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLyohXG4gKiAg6Zu76ISz6bq75bCGOiDniYzorZzjg5Pjg6Xjg7zjgqIgdjIuNC4xN1xuICpcbiAqICBDb3B5cmlnaHQoQykgMjAxNyBTYXRvc2hpIEtvYmF5YXNoaVxuICogIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogIGh0dHBzOi8vZ2l0aHViLmNvbS9rb2JhbGFiL01hamlhbmcvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuY29uc3QgeyBoaWRlLCBzaG93LCBmYWRlSW4sIHNjYWxlICAgfSA9IE1hamlhbmcuVUkuVXRpbDtcblxuJChmdW5jdGlvbigpe1xuXG4gICAgY29uc3QgdGVuaG91X2xvZyA9ICdodHRwczovL2tvYmFsYWIubmV0L21hamlhbmcvdGVuaG91LWxvZy8nO1xuXG4gICAgY29uc3QgcGFpICAgPSBNYWppYW5nLlVJLnBhaSgkKCcjbG9hZGRhdGEnKSk7XG4gICAgY29uc3QgYXVkaW8gPSBNYWppYW5nLlVJLmF1ZGlvKCQoJyNsb2FkZGF0YScpKTtcblxuICAgIGNvbnN0IHJ1bGUgID0gTWFqaWFuZy5ydWxlKFxuICAgICAgICAgICAgICAgICAgICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdNYWppYW5nLnJ1bGUnKXx8J3t9JykpO1xuXG4gICAgbGV0IGZpbGU7XG4gICAgbGV0IF92aWV3ZXI7XG5cbiAgICBjb25zdCBhbmFseXplciA9IChrYWlqdSk9PntcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdhbmFseXplcicpO1xuICAgICAgICByZXR1cm4gbmV3IE1hamlhbmcuVUkuQW5hbHl6ZXIoJCgnI2JvYXJkID4gLmFuYWx5emVyJyksIGthaWp1LCBwYWksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCk9PiQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYW5hbHl6ZXInKSk7XG4gICAgfTtcbiAgICBjb25zdCB2aWV3ZXIgPSAocGFpcHUpPT57XG4gICAgICAgICQoJyNib2FyZCAuY29udHJvbGxlcicpLmFkZENsYXNzKCdwYWlwdScpXG4gICAgICAgICQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2JvYXJkJyk7XG4gICAgICAgIHNjYWxlKCQoJyNib2FyZCcpLCAkKCcjc3BhY2UnKSk7XG4gICAgICAgIF92aWV3ZXIgPSBuZXcgTWFqaWFuZy5VSS5QYWlwdShcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNib2FyZCcpLCBwYWlwdSwgcGFpLCBhdWRpbywgJ01hamlhbmcucHJlZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAoKT0+eyBmYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnZmlsZScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF92aWV3ZXIgPSBudWxsIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmFseXplcik7XG4gICAgICAgICQoJ2lucHV0W25hbWU9XCJsaW1pdGVkXCJdJywgdGVuaG91X2RpYWxvZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSkudmFsKFswXSk7XG4gICAgICAgIHJldHVybiBfdmlld2VyO1xuICAgIH07XG4gICAgY29uc3Qgc3RhdCA9IChwYWlwdV9saXN0KT0+e1xuICAgICAgICBmYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnc3RhdCcpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYWppYW5nLlVJLlBhaXB1U3RhdCgkKCcjc3RhdCcpLCBwYWlwdV9saXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgKCk9PmZhZGVJbigkKCdib2R5JykuYXR0cignY2xhc3MnLCdmaWxlJykpKTtcbiAgICB9O1xuICAgIGNvbnN0IHByZXZpZXcgPSAocGFpcHUpPT57XG4gICAgICAgICQoJyNib2FyZCAuY29udHJvbGxlcicpLmFkZENsYXNzKCdwYWlwdScpXG4gICAgICAgICQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2JvYXJkJyk7XG4gICAgICAgIHNjYWxlKCQoJyNib2FyZCcpLCAkKCcjc3BhY2UnKSk7XG4gICAgICAgIF92aWV3ZXIgPSBuZXcgTWFqaWFuZy5VSS5QYWlwdShcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNib2FyZCcpLCBwYWlwdSwgcGFpLCBhdWRpbywgJ01hamlhbmcucHJlZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAoKT0+eyBmYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnZWRpdG9yJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZpZXdlciA9IG51bGwgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuYWx5emVyKTtcbiAgICAgICAgZGVsZXRlIF92aWV3ZXIuX3ZpZXcuZHVtbXlfbmFtZTtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cImxpbWl0ZWRcIl0nLCB0ZW5ob3VfZGlhbG9nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpLnZhbChbMV0pO1xuICAgICAgICByZXR1cm4gX3ZpZXdlcjtcbiAgICB9O1xuICAgIGNvbnN0IGVkaXRvciA9IChwYWlwdSwgc2F2ZSk9PntcbiAgICAgICAgbmV3IE1hamlhbmcuVUkuUGFpcHVFZGl0b3IoJCgnI2VkaXRvcicpLCBwYWlwdSwgcnVsZSwgcGFpLFxuICAgICAgICAgICAgICAgICAgICAgICAgKCk9PnsgZmlsZS5zdG9yYWdlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFkZUluKCQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2ZpbGUnKSkgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmUsIHByZXZpZXcpO1xuICAgICAgICBmYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnZWRpdG9yJykpO1xuICAgIH07XG5cbiAgICBpZiAobG9jYXRpb24uc2VhcmNoKSB7XG4gICAgICAgIGZpbGUgPSBuZXcgTWFqaWFuZy5VSS5QYWlwdUZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmaWxlJyksICdNYWppYW5nLnBhaXB1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld2VyLCBzdGF0LCBlZGl0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbmhvdV9sb2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywnJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgvXiMvLCcnKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWxlID0gbmV3IE1hamlhbmcuVUkuUGFpcHVGaWxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZmlsZScpLCAnTWFqaWFuZy5wYWlwdScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdlciwgc3RhdCwgZWRpdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5ob3VfbG9nKTtcbiAgICB9XG4gICAgZmlsZS5yZWRyYXcoKTtcblxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCk9PnNjYWxlKCQoJyNib2FyZCcpLCAkKCcjc3BhY2UnKSkpO1xuXG4gICAgY29uc3QgbG9nY29udiA9IHJlcXVpcmUoJ0Brb2JhbGFiL3RlbmhvdS11cmwtbG9nJyk7XG4gICAgY29uc3QgdGVuaG91X2RpYWxvZyA9ICQoJyNib2FyZCAudGVuaG91LWRpYWxvZycpO1xuXG4gICAgZnVuY3Rpb24gc2V0X2RhdGEoKSB7XG4gICAgICAgIGxldCB0eXBlICAgID0gJCgnW25hbWU9XCJ0eXBlXCJdOmNoZWNrZWQnLCB0ZW5ob3VfZGlhbG9nKS52YWwoKTtcbiAgICAgICAgbGV0IGxvZ19pZHggPSAkKCdbbmFtZT1cImxpbWl0ZWRcIl0nLCB0ZW5ob3VfZGlhbG9nKS5wcm9wKCdjaGVja2VkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IF92aWV3ZXIuX2xvZ19pZHggOiBudWxsO1xuICAgICAgICBsZXQgZGF0YSA9ICcnO1xuICAgICAgICBpZiAodHlwZSA9PSAnSlNPTicpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShsb2djb252KF92aWV3ZXIuX3BhaXB1LCBsb2dfaWR4KSk7XG4gICAgICAgICAgICAkKCd0ZXh0YXJlYScsIHRlbmhvdV9kaWFsb2cpLmF0dHIoJ2NsYXNzJywnSlNPTicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfdmlld2VyLl9wYWlwdS5sb2cubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobG9nX2lkeCAhPSBudWxsICYmIGkgIT0gbG9nX2lkeCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGF0YSArPSAnaHR0cHM6Ly90ZW5ob3UubmV0LzYvI2pzb249J1xuICAgICAgICAgICAgICAgICAgICAgICAgKyBlbmNvZGVVUkkoSlNPTi5zdHJpbmdpZnkobG9nY29udihfdmlld2VyLl9wYWlwdSwgaSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoJ3RleHRhcmVhJywgdGVuaG91X2RpYWxvZykuYXR0cignY2xhc3MnLCdVUkwnKTtcbiAgICAgICAgfVxuICAgICAgICAkKCd0ZXh0YXJlYScsIHRlbmhvdV9kaWFsb2cpLnZhbChkYXRhKTtcbiAgICAgICAgaWYgKCEgbmF2aWdhdG9yLmNsaXBib2FyZCkge1xuICAgICAgICAgICAgJCgndGV4dGFyZWEnLCB0ZW5ob3VfZGlhbG9nKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKS5zZWxlY3QoKTtcbiAgICAgICAgICAgIHNob3coJCgnW3R5cGU9XCJidXR0b25cIl0nLCB0ZW5ob3VfZGlhbG9nKSk7XG4gICAgICAgICAgICBoaWRlKCQoJ1t0eXBlPVwic3VibWl0XCJdJywgdGVuaG91X2RpYWxvZykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2hvdygkKCdbdHlwZT1cImJ1dHRvblwiXScsIHRlbmhvdV9kaWFsb2cpKTtcbiAgICAgICAgICAgIHNob3coJCgnW3R5cGU9XCJzdWJtaXRcIl0nLCB0ZW5ob3VfZGlhbG9nKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvcGVuX3RlbmhvdV9kaWFsb2coKSB7XG4gICAgICAgIGlmIChfdmlld2VyLl9sb2dfaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBfdmlld2VyLmNsZWFyX2hhbmRsZXIoKTtcbiAgICAgICAgc2hvdyh0ZW5ob3VfZGlhbG9nKTtcbiAgICAgICAgc2V0X2RhdGEoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3VibWl0X3RlbmhvdV9kaWFsb2coKSB7XG4gICAgICAgIGlmIChuYXZpZ2F0b3IuY2xpcGJvYXJkKSB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9ICQoJ3RleHRhcmVhJywgdGVuaG91X2RpYWxvZykudmFsKCk7XG4gICAgICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjbG9zZV90ZW5ob3VfZGlhbG9nKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvc2VfdGVuaG91X2RpYWxvZygpIHtcbiAgICAgICAgaGlkZSh0ZW5ob3VfZGlhbG9nKTtcbiAgICAgICAgX3ZpZXdlci5zZXRfaGFuZGxlcigpO1xuICAgIH1cblxuICAgICQod2luZG93KS5vbigna2V5dXAnLCAoZXYpPT57XG4gICAgICAgIGlmICghIF92aWV3ZXIgfHwgZXYua2V5ICE9ICd0JykgcmV0dXJuO1xuICAgICAgICBvcGVuX3RlbmhvdV9kaWFsb2coKTtcbiAgICB9KTtcbiAgICAkKCdmb3JtJywgdGVuaG91X2RpYWxvZykub24oJ3N1Ym1pdCcsIHN1Ym1pdF90ZW5ob3VfZGlhbG9nKTtcbiAgICAkKCdmb3JtIFt0eXBlPVwiYnV0dG9uXCJdJywgdGVuaG91X2RpYWxvZykub24oJ2NsaWNrJywgY2xvc2VfdGVuaG91X2RpYWxvZyk7XG4gICAgJCgnaW5wdXQnLCB0ZW5ob3VfZGlhbG9nKS5vbignY2hhbmdlJywgc2V0X2RhdGEpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=