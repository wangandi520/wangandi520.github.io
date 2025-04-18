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
/*!***************************!*\
  !*** ./src/js/netplay.js ***!
  \***************************/
/*!
 *  電脳麻将: ネット対戦 v2.4.16
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */


const { hide, show, fadeIn, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;

const preset = __webpack_require__(/*! ./conf/rule.json */ "./src/js/conf/rule.json");

const base = location.pathname.replace(/\/[^\/]*?$/,'');

let loaded;

$(function(){

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const analyzer = (kaiju)=>{
        $('body').addClass('analyzer');
        return new Majiang.UI.Analyzer($('#board > .analyzer'), kaiju, pai,
                                        ()=>$('body').removeClass('analyzer'));
    };
    const viewer = (paipu)=>{
        $('#board .controller').addClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        return new Majiang.UI.Paipu(
                        $('#board'), paipu, pai, audio, 'Majiang.pref',
                        ()=>fadeIn($('body').attr('class','file')),
                        analyzer);
    };
    const stat = (paipu_list)=>{
        fadeIn($('body').attr('class','stat'));
        return new Majiang.UI.PaipuStat($('#stat'), paipu_list,
                        ()=>fadeIn($('body').attr('class','file')));
    };
    const file = new Majiang.UI.PaipuFile($('#file'), 'Majiang.netplay',
                                            viewer, stat);
    let sock, myuid;

    function init() {

        sock = io('/', { path: `${base}/server/socket.io/`});

        sock.on('HELLO', hello);
        sock.on('ROOM', room);
        sock.on('START', start);
        sock.on('END', end);
        sock.on('ERROR', file.error);
        sock.on('disconnect', ()=>hide($('#file .netplay form.room')));

        hide($('#title .loading'));
    }

    function hello(user) {
        if (! user) {
            $('body').attr('class','title');
            show($('#title .login'));
            return;
        }
        myuid = user.uid;
        show($('#file .netplay form'));
        fadeIn($('body').attr('class','file'));
        if (user.icon)
            $('#file .netplay img').attr('src', user.icon)
                                   .attr('title', user.uid);
        $('#file .netplay .name').text(user.name);
        file.redraw();
    }

    let row, src;

    function room(msg) {
        if (! row) {
            row = $('#room .user').eq(0);
            src = $('img', row).attr('src');
        }
        $('body').attr('class','room');
        $('#room input[name="room_no"]').val(msg.room_no);
        $('#room .room').empty();
        for (let user of msg.user) {
            let r = row.clone();
            if (user.icon) $('img', r).attr('src', user.icon)
                                      .attr('title', user.uid);
            else           $('img', r).attr('src', src);
            $('.name', r).text(user.name);
            if (msg.user[0].uid == myuid || user.uid == myuid )
                show($('input[name="quit"]', r).on('click', ()=> {
                        sock.emit('ROOM', msg.room_no, user.uid);
                        return false;
                    }));
            if (user.offline) r.addClass('offline');
            else              r.removeClass('offline');
            $('#room .room').append(r);
        }
        if (msg.user[0].uid == myuid) {
            show($('#room select[name="rule"]'));
            show($('#room input[name="timer"]'));
            show($('#room input[type="submit"]'));
        }
        else {
            hide($('#room select[name="rule"]'));
            hide($('#room input[name="timer"]'));
            hide($('#room input[type="submit"]'));
        }
    }

    function start() {

        const player = new Majiang.UI.Player($('#board'), pai, audio);
        player.view  = new Majiang.UI.Board($('#board .board'), pai, audio,
                                                player.model);

        const gameCtl = new Majiang.UI.GameCtl($('#board'), 'Majiang.pref',
                                                null, player, player._view);
        gameCtl._view.no_player_name = false;

        let players = [];

        $('#board .controller').removeClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        let seq = 0;
        sock.removeAllListeners('GAME');
        sock.on('GAME', (msg)=>{
            if (msg.players) {
                players = msg.players;
            }
            else if (msg.say) {
                player._view.say(msg.say.name, msg.say.l);
            }
            else if (msg.seq) {
                if (seq && msg.seq != seq) location.reload();
                player.action(msg, (reply = {})=>{
                    reply.seq = msg.seq;
                    sock.emit('GAME', reply);
                    seq = msg.seq + 1;
                });
            }
            else {
                player.action(msg);
                if (msg.kaiju && msg.kaiju.log) {
                    let log = msg.kaiju.log.pop();
                    for (let data of log) {
                        player.action(data);
                    }
                }
            }
            player._view.players(players);
        });
    }

    function end(paipu) {
        sock.removeAllListeners('GAME');
        if (paipu) file.add(paipu, 10);
        fadeIn($('body').attr('class','file'));
        file.redraw();
        $('#file input[name="room_no"]').val('');
    }

    for (let key of Object.keys(preset)) {
        $('select[name="rule"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="rule"]').append($('<option>')
                                .val('-').text('カスタムルール'));
    }

    $('#file form.room').on('submit', (ev)=>{
        let room = $('input[name="room_no"]', $(ev.target)).val();
        sock.emit('ROOM', room);
        return false;
    });
    $('#room form').on('submit', (ev)=>{
        let room = $('input[name="room_no"]', $(ev.target)).val();

        let rule = $('select[name="rule"]', $(ev.target)).val();
        rule = ! rule      ? {}
             : rule == '-' ? JSON.parse(
                                localStorage.getItem('Majiang.rule')||'{}')
             :               preset[rule];
        rule = Majiang.rule(rule);

        let timer = $('input[name="timer"]', $(ev.target)).val();
        timer = timer.match(/(\d+)/g);
        if (timer) timer = timer.map(t=>+t);

        sock.emit('START', room, rule, timer);
        return false;
    });

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    $(window).on('load', ()=>setTimeout(init, 500));
    if (loaded) $(window).trigger('load');

    $('#title .login form').each(function(){
        let method = $(this).attr('method')
        let url    = $(this).attr('action');
        fetch(url, { method: method, redirect: 'manual' }).then(res =>{
            if (res.status == 404) hide($(this));
        });
    });
});
$(window).on('load', ()=> loaded = true);

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0cGxheS0yLjQuMTYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztVQUFBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUViLFFBQVE7QUFDUixzQ0FBc0M7O0FBRXRDLGVBQWUsbUJBQU8sQ0FBQyxpREFBa0I7O0FBRXpDOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEseUJBQXlCLFNBQVMsS0FBSyxvQkFBb0I7O0FBRTNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RTtBQUN6RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixvQ0FBb0M7QUFDekQ7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUM7QUFDRCIsInNvdXJjZXMiOlsid2VicGFjazovL21hamlhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWFqaWFuZy8uL3NyYy9qcy9uZXRwbGF5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKiFcbiAqICDpm7vohLPpurvlsIY6IOODjeODg+ODiOWvvuaIpiB2Mi40LjE2XG4gKlxuICogIENvcHlyaWdodChDKSAyMDE3IFNhdG9zaGkgS29iYXlhc2hpXG4gKiAgUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL2tvYmFsYWIvTWFqaWFuZy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCB7IGhpZGUsIHNob3csIGZhZGVJbiwgc2NhbGUsXG4gICAgICAgIHNldFNlbGVjdG9yLCBjbGVhclNlbGVjdG9yICB9ID0gTWFqaWFuZy5VSS5VdGlsO1xuXG5jb25zdCBwcmVzZXQgPSByZXF1aXJlKCcuL2NvbmYvcnVsZS5qc29uJyk7XG5cbmNvbnN0IGJhc2UgPSBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qPyQvLCcnKTtcblxubGV0IGxvYWRlZDtcblxuJChmdW5jdGlvbigpe1xuXG4gICAgY29uc3QgcGFpICAgPSBNYWppYW5nLlVJLnBhaSgkKCcjbG9hZGRhdGEnKSk7XG4gICAgY29uc3QgYXVkaW8gPSBNYWppYW5nLlVJLmF1ZGlvKCQoJyNsb2FkZGF0YScpKTtcblxuICAgIGNvbnN0IGFuYWx5emVyID0gKGthaWp1KT0+e1xuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2FuYWx5emVyJyk7XG4gICAgICAgIHJldHVybiBuZXcgTWFqaWFuZy5VSS5BbmFseXplcigkKCcjYm9hcmQgPiAuYW5hbHl6ZXInKSwga2FpanUsIHBhaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKT0+JCgnYm9keScpLnJlbW92ZUNsYXNzKCdhbmFseXplcicpKTtcbiAgICB9O1xuICAgIGNvbnN0IHZpZXdlciA9IChwYWlwdSk9PntcbiAgICAgICAgJCgnI2JvYXJkIC5jb250cm9sbGVyJykuYWRkQ2xhc3MoJ3BhaXB1JylcbiAgICAgICAgJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnYm9hcmQnKTtcbiAgICAgICAgc2NhbGUoJCgnI2JvYXJkJyksICQoJyNzcGFjZScpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYWppYW5nLlVJLlBhaXB1KFxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2JvYXJkJyksIHBhaXB1LCBwYWksIGF1ZGlvLCAnTWFqaWFuZy5wcmVmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICgpPT5mYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnZmlsZScpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuYWx5emVyKTtcbiAgICB9O1xuICAgIGNvbnN0IHN0YXQgPSAocGFpcHVfbGlzdCk9PntcbiAgICAgICAgZmFkZUluKCQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ3N0YXQnKSk7XG4gICAgICAgIHJldHVybiBuZXcgTWFqaWFuZy5VSS5QYWlwdVN0YXQoJCgnI3N0YXQnKSwgcGFpcHVfbGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICgpPT5mYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnZmlsZScpKSk7XG4gICAgfTtcbiAgICBjb25zdCBmaWxlID0gbmV3IE1hamlhbmcuVUkuUGFpcHVGaWxlKCQoJyNmaWxlJyksICdNYWppYW5nLm5ldHBsYXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3ZXIsIHN0YXQpO1xuICAgIGxldCBzb2NrLCBteXVpZDtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICAgICAgc29jayA9IGlvKCcvJywgeyBwYXRoOiBgJHtiYXNlfS9zZXJ2ZXIvc29ja2V0LmlvL2B9KTtcblxuICAgICAgICBzb2NrLm9uKCdIRUxMTycsIGhlbGxvKTtcbiAgICAgICAgc29jay5vbignUk9PTScsIHJvb20pO1xuICAgICAgICBzb2NrLm9uKCdTVEFSVCcsIHN0YXJ0KTtcbiAgICAgICAgc29jay5vbignRU5EJywgZW5kKTtcbiAgICAgICAgc29jay5vbignRVJST1InLCBmaWxlLmVycm9yKTtcbiAgICAgICAgc29jay5vbignZGlzY29ubmVjdCcsICgpPT5oaWRlKCQoJyNmaWxlIC5uZXRwbGF5IGZvcm0ucm9vbScpKSk7XG5cbiAgICAgICAgaGlkZSgkKCcjdGl0bGUgLmxvYWRpbmcnKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGVsbG8odXNlcikge1xuICAgICAgICBpZiAoISB1c2VyKSB7XG4gICAgICAgICAgICAkKCdib2R5JykuYXR0cignY2xhc3MnLCd0aXRsZScpO1xuICAgICAgICAgICAgc2hvdygkKCcjdGl0bGUgLmxvZ2luJykpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG15dWlkID0gdXNlci51aWQ7XG4gICAgICAgIHNob3coJCgnI2ZpbGUgLm5ldHBsYXkgZm9ybScpKTtcbiAgICAgICAgZmFkZUluKCQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2ZpbGUnKSk7XG4gICAgICAgIGlmICh1c2VyLmljb24pXG4gICAgICAgICAgICAkKCcjZmlsZSAubmV0cGxheSBpbWcnKS5hdHRyKCdzcmMnLCB1c2VyLmljb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0aXRsZScsIHVzZXIudWlkKTtcbiAgICAgICAgJCgnI2ZpbGUgLm5ldHBsYXkgLm5hbWUnKS50ZXh0KHVzZXIubmFtZSk7XG4gICAgICAgIGZpbGUucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgbGV0IHJvdywgc3JjO1xuXG4gICAgZnVuY3Rpb24gcm9vbShtc2cpIHtcbiAgICAgICAgaWYgKCEgcm93KSB7XG4gICAgICAgICAgICByb3cgPSAkKCcjcm9vbSAudXNlcicpLmVxKDApO1xuICAgICAgICAgICAgc3JjID0gJCgnaW1nJywgcm93KS5hdHRyKCdzcmMnKTtcbiAgICAgICAgfVxuICAgICAgICAkKCdib2R5JykuYXR0cignY2xhc3MnLCdyb29tJyk7XG4gICAgICAgICQoJyNyb29tIGlucHV0W25hbWU9XCJyb29tX25vXCJdJykudmFsKG1zZy5yb29tX25vKTtcbiAgICAgICAgJCgnI3Jvb20gLnJvb20nKS5lbXB0eSgpO1xuICAgICAgICBmb3IgKGxldCB1c2VyIG9mIG1zZy51c2VyKSB7XG4gICAgICAgICAgICBsZXQgciA9IHJvdy5jbG9uZSgpO1xuICAgICAgICAgICAgaWYgKHVzZXIuaWNvbikgJCgnaW1nJywgcikuYXR0cignc3JjJywgdXNlci5pY29uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cigndGl0bGUnLCB1c2VyLnVpZCk7XG4gICAgICAgICAgICBlbHNlICAgICAgICAgICAkKCdpbWcnLCByKS5hdHRyKCdzcmMnLCBzcmMpO1xuICAgICAgICAgICAgJCgnLm5hbWUnLCByKS50ZXh0KHVzZXIubmFtZSk7XG4gICAgICAgICAgICBpZiAobXNnLnVzZXJbMF0udWlkID09IG15dWlkIHx8IHVzZXIudWlkID09IG15dWlkIClcbiAgICAgICAgICAgICAgICBzaG93KCQoJ2lucHV0W25hbWU9XCJxdWl0XCJdJywgcikub24oJ2NsaWNrJywgKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb2NrLmVtaXQoJ1JPT00nLCBtc2cucm9vbV9ubywgdXNlci51aWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBpZiAodXNlci5vZmZsaW5lKSByLmFkZENsYXNzKCdvZmZsaW5lJyk7XG4gICAgICAgICAgICBlbHNlICAgICAgICAgICAgICByLnJlbW92ZUNsYXNzKCdvZmZsaW5lJyk7XG4gICAgICAgICAgICAkKCcjcm9vbSAucm9vbScpLmFwcGVuZChyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobXNnLnVzZXJbMF0udWlkID09IG15dWlkKSB7XG4gICAgICAgICAgICBzaG93KCQoJyNyb29tIHNlbGVjdFtuYW1lPVwicnVsZVwiXScpKTtcbiAgICAgICAgICAgIHNob3coJCgnI3Jvb20gaW5wdXRbbmFtZT1cInRpbWVyXCJdJykpO1xuICAgICAgICAgICAgc2hvdygkKCcjcm9vbSBpbnB1dFt0eXBlPVwic3VibWl0XCJdJykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGlkZSgkKCcjcm9vbSBzZWxlY3RbbmFtZT1cInJ1bGVcIl0nKSk7XG4gICAgICAgICAgICBoaWRlKCQoJyNyb29tIGlucHV0W25hbWU9XCJ0aW1lclwiXScpKTtcbiAgICAgICAgICAgIGhpZGUoJCgnI3Jvb20gaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IG5ldyBNYWppYW5nLlVJLlBsYXllcigkKCcjYm9hcmQnKSwgcGFpLCBhdWRpbyk7XG4gICAgICAgIHBsYXllci52aWV3ICA9IG5ldyBNYWppYW5nLlVJLkJvYXJkKCQoJyNib2FyZCAuYm9hcmQnKSwgcGFpLCBhdWRpbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5tb2RlbCk7XG5cbiAgICAgICAgY29uc3QgZ2FtZUN0bCA9IG5ldyBNYWppYW5nLlVJLkdhbWVDdGwoJCgnI2JvYXJkJyksICdNYWppYW5nLnByZWYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCwgcGxheWVyLCBwbGF5ZXIuX3ZpZXcpO1xuICAgICAgICBnYW1lQ3RsLl92aWV3Lm5vX3BsYXllcl9uYW1lID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IHBsYXllcnMgPSBbXTtcblxuICAgICAgICAkKCcjYm9hcmQgLmNvbnRyb2xsZXInKS5yZW1vdmVDbGFzcygncGFpcHUnKVxuICAgICAgICAkKCdib2R5JykuYXR0cignY2xhc3MnLCdib2FyZCcpO1xuICAgICAgICBzY2FsZSgkKCcjYm9hcmQnKSwgJCgnI3NwYWNlJykpO1xuICAgICAgICBsZXQgc2VxID0gMDtcbiAgICAgICAgc29jay5yZW1vdmVBbGxMaXN0ZW5lcnMoJ0dBTUUnKTtcbiAgICAgICAgc29jay5vbignR0FNRScsIChtc2cpPT57XG4gICAgICAgICAgICBpZiAobXNnLnBsYXllcnMpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXJzID0gbXNnLnBsYXllcnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuc2F5KSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLl92aWV3LnNheShtc2cuc2F5Lm5hbWUsIG1zZy5zYXkubCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuc2VxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlcSAmJiBtc2cuc2VxICE9IHNlcSkgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbihtc2csIChyZXBseSA9IHt9KT0+e1xuICAgICAgICAgICAgICAgICAgICByZXBseS5zZXEgPSBtc2cuc2VxO1xuICAgICAgICAgICAgICAgICAgICBzb2NrLmVtaXQoJ0dBTUUnLCByZXBseSk7XG4gICAgICAgICAgICAgICAgICAgIHNlcSA9IG1zZy5zZXEgKyAxO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbihtc2cpO1xuICAgICAgICAgICAgICAgIGlmIChtc2cua2FpanUgJiYgbXNnLmthaWp1LmxvZykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbG9nID0gbXNnLmthaWp1LmxvZy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZGF0YSBvZiBsb2cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5hY3Rpb24oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwbGF5ZXIuX3ZpZXcucGxheWVycyhwbGF5ZXJzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kKHBhaXB1KSB7XG4gICAgICAgIHNvY2sucmVtb3ZlQWxsTGlzdGVuZXJzKCdHQU1FJyk7XG4gICAgICAgIGlmIChwYWlwdSkgZmlsZS5hZGQocGFpcHUsIDEwKTtcbiAgICAgICAgZmFkZUluKCQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2ZpbGUnKSk7XG4gICAgICAgIGZpbGUucmVkcmF3KCk7XG4gICAgICAgICQoJyNmaWxlIGlucHV0W25hbWU9XCJyb29tX25vXCJdJykudmFsKCcnKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocHJlc2V0KSkge1xuICAgICAgICAkKCdzZWxlY3RbbmFtZT1cInJ1bGVcIl0nKS5hcHBlbmQoJCgnPG9wdGlvbj4nKS52YWwoa2V5KS50ZXh0KGtleSkpO1xuICAgIH1cbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ01hamlhbmcucnVsZScpKSB7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwicnVsZVwiXScpLmFwcGVuZCgkKCc8b3B0aW9uPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWwoJy0nKS50ZXh0KCfjgqvjgrnjgr/jg6Djg6vjg7zjg6snKSk7XG4gICAgfVxuXG4gICAgJCgnI2ZpbGUgZm9ybS5yb29tJykub24oJ3N1Ym1pdCcsIChldik9PntcbiAgICAgICAgbGV0IHJvb20gPSAkKCdpbnB1dFtuYW1lPVwicm9vbV9ub1wiXScsICQoZXYudGFyZ2V0KSkudmFsKCk7XG4gICAgICAgIHNvY2suZW1pdCgnUk9PTScsIHJvb20pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgJCgnI3Jvb20gZm9ybScpLm9uKCdzdWJtaXQnLCAoZXYpPT57XG4gICAgICAgIGxldCByb29tID0gJCgnaW5wdXRbbmFtZT1cInJvb21fbm9cIl0nLCAkKGV2LnRhcmdldCkpLnZhbCgpO1xuXG4gICAgICAgIGxldCBydWxlID0gJCgnc2VsZWN0W25hbWU9XCJydWxlXCJdJywgJChldi50YXJnZXQpKS52YWwoKTtcbiAgICAgICAgcnVsZSA9ICEgcnVsZSAgICAgID8ge31cbiAgICAgICAgICAgICA6IHJ1bGUgPT0gJy0nID8gSlNPTi5wYXJzZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ01hamlhbmcucnVsZScpfHwne30nKVxuICAgICAgICAgICAgIDogICAgICAgICAgICAgICBwcmVzZXRbcnVsZV07XG4gICAgICAgIHJ1bGUgPSBNYWppYW5nLnJ1bGUocnVsZSk7XG5cbiAgICAgICAgbGV0IHRpbWVyID0gJCgnaW5wdXRbbmFtZT1cInRpbWVyXCJdJywgJChldi50YXJnZXQpKS52YWwoKTtcbiAgICAgICAgdGltZXIgPSB0aW1lci5tYXRjaCgvKFxcZCspL2cpO1xuICAgICAgICBpZiAodGltZXIpIHRpbWVyID0gdGltZXIubWFwKHQ9Pit0KTtcblxuICAgICAgICBzb2NrLmVtaXQoJ1NUQVJUJywgcm9vbSwgcnVsZSwgdGltZXIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsICgpPT5zY2FsZSgkKCcjYm9hcmQnKSwgJCgnI3NwYWNlJykpKTtcblxuICAgICQod2luZG93KS5vbignbG9hZCcsICgpPT5zZXRUaW1lb3V0KGluaXQsIDUwMCkpO1xuICAgIGlmIChsb2FkZWQpICQod2luZG93KS50cmlnZ2VyKCdsb2FkJyk7XG5cbiAgICAkKCcjdGl0bGUgLmxvZ2luIGZvcm0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgIGxldCBtZXRob2QgPSAkKHRoaXMpLmF0dHIoJ21ldGhvZCcpXG4gICAgICAgIGxldCB1cmwgICAgPSAkKHRoaXMpLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICBmZXRjaCh1cmwsIHsgbWV0aG9kOiBtZXRob2QsIHJlZGlyZWN0OiAnbWFudWFsJyB9KS50aGVuKHJlcyA9PntcbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09IDQwNCkgaGlkZSgkKHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiQod2luZG93KS5vbignbG9hZCcsICgpPT4gbG9hZGVkID0gdHJ1ZSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=