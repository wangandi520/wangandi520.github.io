/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/conf/rule.json"
/*!*******************************!*\
  !*** ./src/js/conf/rule.json ***!
  \*******************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"Mリーグルール":{"配給原点":25000,"順位点":["+30.0","+10.0","-10.0","-30.0"],"赤牌":{"m":1,"p":1,"s":1},"連風牌は2符":true,"クイタンあり":true,"喰い替え許可レベル":0,"場数":2,"途中流局あり":false,"流し満貫あり":false,"ノーテン宣言あり":true,"ノーテン罰あり":true,"最大同時和了数":1,"連荘方式":2,"トビ終了あり":false,"オーラス止めあり":false,"延長戦方式":0,"一発あり":true,"裏ドラあり":true,"カンドラあり":true,"カン裏あり":true,"カンドラ後乗せ":false,"ツモ番なしリーチあり":true,"リーチ後暗槓許可レベル":1,"ダブル役満あり":false,"役満の複合あり":true,"数え役満あり":false,"役満パオあり":true,"切り上げ満貫あり":true},"Classicルール":{"配給原点":30000,"順位点":["+12.0","+4.0","-4.0","-12.0"],"赤牌":{"m":0,"p":0,"s":0},"連風牌は2符":false,"クイタンあり":true,"喰い替え許可レベル":2,"場数":2,"途中流局あり":false,"流し満貫あり":false,"ノーテン宣言あり":false,"ノーテン罰あり":false,"最大同時和了数":1,"連荘方式":1,"トビ終了あり":false,"オーラス止めあり":false,"延長戦方式":0,"一発あり":false,"裏ドラあり":false,"カンドラあり":false,"カン裏あり":false,"カンドラ後乗せ":false,"ツモ番なしリーチあり":true,"リーチ後暗槓許可レベル":0,"ダブル役満あり":false,"役満の複合あり":false,"数え役満あり":false,"役満パオあり":false,"切り上げ満貫あり":false}}');

/***/ }

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
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/js/netplay.js ***!
  \***************************/
/*!
 *  電脳麻将: ネット対戦 v2.5.1
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0cGxheS0yLjUuMS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O1VBQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFYixRQUFRO0FBQ1Isc0NBQXNDOztBQUV0QyxlQUFlLG1CQUFPLENBQUMsaURBQWtCOztBQUV6Qzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHlCQUF5QixTQUFTLEtBQUssb0JBQW9COztBQUUzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUU7QUFDekU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsb0NBQW9DO0FBQ3pEO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBQ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWppYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21hamlhbmcvLi9zcmMvanMvbmV0cGxheS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKiFcbiAqICDpm7vohLPpurvlsIY6IOODjeODg+ODiOWvvuaIpiB2Mi41LjFcbiAqXG4gKiAgQ29weXJpZ2h0KEMpIDIwMTcgU2F0b3NoaSBLb2JheWFzaGlcbiAqICBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqICBodHRwczovL2dpdGh1Yi5jb20va29iYWxhYi9NYWppYW5nL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IHsgaGlkZSwgc2hvdywgZmFkZUluLCBzY2FsZSxcbiAgICAgICAgc2V0U2VsZWN0b3IsIGNsZWFyU2VsZWN0b3IgIH0gPSBNYWppYW5nLlVJLlV0aWw7XG5cbmNvbnN0IHByZXNldCA9IHJlcXVpcmUoJy4vY29uZi9ydWxlLmpzb24nKTtcblxuY29uc3QgYmFzZSA9IGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSo/JC8sJycpO1xuXG5sZXQgbG9hZGVkO1xuXG4kKGZ1bmN0aW9uKCl7XG5cbiAgICBjb25zdCBwYWkgICA9IE1hamlhbmcuVUkucGFpKCQoJyNsb2FkZGF0YScpKTtcbiAgICBjb25zdCBhdWRpbyA9IE1hamlhbmcuVUkuYXVkaW8oJCgnI2xvYWRkYXRhJykpO1xuXG4gICAgY29uc3QgYW5hbHl6ZXIgPSAoa2FpanUpPT57XG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnYW5hbHl6ZXInKTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYWppYW5nLlVJLkFuYWx5emVyKCQoJyNib2FyZCA+IC5hbmFseXplcicpLCBrYWlqdSwgcGFpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpPT4kKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2FuYWx5emVyJykpO1xuICAgIH07XG4gICAgY29uc3Qgdmlld2VyID0gKHBhaXB1KT0+e1xuICAgICAgICAkKCcjYm9hcmQgLmNvbnRyb2xsZXInKS5hZGRDbGFzcygncGFpcHUnKVxuICAgICAgICAkKCdib2R5JykuYXR0cignY2xhc3MnLCdib2FyZCcpO1xuICAgICAgICBzY2FsZSgkKCcjYm9hcmQnKSwgJCgnI3NwYWNlJykpO1xuICAgICAgICByZXR1cm4gbmV3IE1hamlhbmcuVUkuUGFpcHUoXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjYm9hcmQnKSwgcGFpcHUsIHBhaSwgYXVkaW8sICdNYWppYW5nLnByZWYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgKCk9PmZhZGVJbigkKCdib2R5JykuYXR0cignY2xhc3MnLCdmaWxlJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5hbHl6ZXIpO1xuICAgIH07XG4gICAgY29uc3Qgc3RhdCA9IChwYWlwdV9saXN0KT0+e1xuICAgICAgICBmYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnc3RhdCcpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYWppYW5nLlVJLlBhaXB1U3RhdCgkKCcjc3RhdCcpLCBwYWlwdV9saXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgKCk9PmZhZGVJbigkKCdib2R5JykuYXR0cignY2xhc3MnLCdmaWxlJykpKTtcbiAgICB9O1xuICAgIGNvbnN0IGZpbGUgPSBuZXcgTWFqaWFuZy5VSS5QYWlwdUZpbGUoJCgnI2ZpbGUnKSwgJ01hamlhbmcubmV0cGxheScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdlciwgc3RhdCk7XG4gICAgbGV0IHNvY2ssIG15dWlkO1xuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgICAgICBzb2NrID0gaW8oJy8nLCB7IHBhdGg6IGAke2Jhc2V9L3NlcnZlci9zb2NrZXQuaW8vYH0pO1xuXG4gICAgICAgIHNvY2sub24oJ0hFTExPJywgaGVsbG8pO1xuICAgICAgICBzb2NrLm9uKCdST09NJywgcm9vbSk7XG4gICAgICAgIHNvY2sub24oJ1NUQVJUJywgc3RhcnQpO1xuICAgICAgICBzb2NrLm9uKCdFTkQnLCBlbmQpO1xuICAgICAgICBzb2NrLm9uKCdFUlJPUicsIGZpbGUuZXJyb3IpO1xuICAgICAgICBzb2NrLm9uKCdkaXNjb25uZWN0JywgKCk9PmhpZGUoJCgnI2ZpbGUgLm5ldHBsYXkgZm9ybS5yb29tJykpKTtcblxuICAgICAgICBoaWRlKCQoJyN0aXRsZSAubG9hZGluZycpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoZWxsbyh1c2VyKSB7XG4gICAgICAgIGlmICghIHVzZXIpIHtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ3RpdGxlJyk7XG4gICAgICAgICAgICBzaG93KCQoJyN0aXRsZSAubG9naW4nKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbXl1aWQgPSB1c2VyLnVpZDtcbiAgICAgICAgc2hvdygkKCcjZmlsZSAubmV0cGxheSBmb3JtJykpO1xuICAgICAgICBmYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnZmlsZScpKTtcbiAgICAgICAgaWYgKHVzZXIuaWNvbilcbiAgICAgICAgICAgICQoJyNmaWxlIC5uZXRwbGF5IGltZycpLmF0dHIoJ3NyYycsIHVzZXIuaWNvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3RpdGxlJywgdXNlci51aWQpO1xuICAgICAgICAkKCcjZmlsZSAubmV0cGxheSAubmFtZScpLnRleHQodXNlci5uYW1lKTtcbiAgICAgICAgZmlsZS5yZWRyYXcoKTtcbiAgICB9XG5cbiAgICBsZXQgcm93LCBzcmM7XG5cbiAgICBmdW5jdGlvbiByb29tKG1zZykge1xuICAgICAgICBpZiAoISByb3cpIHtcbiAgICAgICAgICAgIHJvdyA9ICQoJyNyb29tIC51c2VyJykuZXEoMCk7XG4gICAgICAgICAgICBzcmMgPSAkKCdpbWcnLCByb3cpLmF0dHIoJ3NyYycpO1xuICAgICAgICB9XG4gICAgICAgICQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ3Jvb20nKTtcbiAgICAgICAgJCgnI3Jvb20gaW5wdXRbbmFtZT1cInJvb21fbm9cIl0nKS52YWwobXNnLnJvb21fbm8pO1xuICAgICAgICAkKCcjcm9vbSAucm9vbScpLmVtcHR5KCk7XG4gICAgICAgIGZvciAobGV0IHVzZXIgb2YgbXNnLnVzZXIpIHtcbiAgICAgICAgICAgIGxldCByID0gcm93LmNsb25lKCk7XG4gICAgICAgICAgICBpZiAodXNlci5pY29uKSAkKCdpbWcnLCByKS5hdHRyKCdzcmMnLCB1c2VyLmljb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0aXRsZScsIHVzZXIudWlkKTtcbiAgICAgICAgICAgIGVsc2UgICAgICAgICAgICQoJ2ltZycsIHIpLmF0dHIoJ3NyYycsIHNyYyk7XG4gICAgICAgICAgICAkKCcubmFtZScsIHIpLnRleHQodXNlci5uYW1lKTtcbiAgICAgICAgICAgIGlmIChtc2cudXNlclswXS51aWQgPT0gbXl1aWQgfHwgdXNlci51aWQgPT0gbXl1aWQgKVxuICAgICAgICAgICAgICAgIHNob3coJCgnaW5wdXRbbmFtZT1cInF1aXRcIl0nLCByKS5vbignY2xpY2snLCAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvY2suZW1pdCgnUk9PTScsIG1zZy5yb29tX25vLCB1c2VyLnVpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGlmICh1c2VyLm9mZmxpbmUpIHIuYWRkQ2xhc3MoJ29mZmxpbmUnKTtcbiAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgIHIucmVtb3ZlQ2xhc3MoJ29mZmxpbmUnKTtcbiAgICAgICAgICAgICQoJyNyb29tIC5yb29tJykuYXBwZW5kKHIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtc2cudXNlclswXS51aWQgPT0gbXl1aWQpIHtcbiAgICAgICAgICAgIHNob3coJCgnI3Jvb20gc2VsZWN0W25hbWU9XCJydWxlXCJdJykpO1xuICAgICAgICAgICAgc2hvdygkKCcjcm9vbSBpbnB1dFtuYW1lPVwidGltZXJcIl0nKSk7XG4gICAgICAgICAgICBzaG93KCQoJyNyb29tIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoaWRlKCQoJyNyb29tIHNlbGVjdFtuYW1lPVwicnVsZVwiXScpKTtcbiAgICAgICAgICAgIGhpZGUoJCgnI3Jvb20gaW5wdXRbbmFtZT1cInRpbWVyXCJdJykpO1xuICAgICAgICAgICAgaGlkZSgkKCcjcm9vbSBpbnB1dFt0eXBlPVwic3VibWl0XCJdJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnQoKSB7XG5cbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IE1hamlhbmcuVUkuUGxheWVyKCQoJyNib2FyZCcpLCBwYWksIGF1ZGlvKTtcbiAgICAgICAgcGxheWVyLnZpZXcgID0gbmV3IE1hamlhbmcuVUkuQm9hcmQoJCgnI2JvYXJkIC5ib2FyZCcpLCBwYWksIGF1ZGlvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLm1vZGVsKTtcblxuICAgICAgICBjb25zdCBnYW1lQ3RsID0gbmV3IE1hamlhbmcuVUkuR2FtZUN0bCgkKCcjYm9hcmQnKSwgJ01hamlhbmcucHJlZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLCBwbGF5ZXIsIHBsYXllci5fdmlldyk7XG4gICAgICAgIGdhbWVDdGwuX3ZpZXcubm9fcGxheWVyX25hbWUgPSBmYWxzZTtcblxuICAgICAgICBsZXQgcGxheWVycyA9IFtdO1xuXG4gICAgICAgICQoJyNib2FyZCAuY29udHJvbGxlcicpLnJlbW92ZUNsYXNzKCdwYWlwdScpXG4gICAgICAgICQoJ2JvZHknKS5hdHRyKCdjbGFzcycsJ2JvYXJkJyk7XG4gICAgICAgIHNjYWxlKCQoJyNib2FyZCcpLCAkKCcjc3BhY2UnKSk7XG4gICAgICAgIGxldCBzZXEgPSAwO1xuICAgICAgICBzb2NrLnJlbW92ZUFsbExpc3RlbmVycygnR0FNRScpO1xuICAgICAgICBzb2NrLm9uKCdHQU1FJywgKG1zZyk9PntcbiAgICAgICAgICAgIGlmIChtc2cucGxheWVycykge1xuICAgICAgICAgICAgICAgIHBsYXllcnMgPSBtc2cucGxheWVycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5zYXkpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuX3ZpZXcuc2F5KG1zZy5zYXkubmFtZSwgbXNnLnNheS5sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5zZXEpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VxICYmIG1zZy5zZXEgIT0gc2VxKSBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuYWN0aW9uKG1zZywgKHJlcGx5ID0ge30pPT57XG4gICAgICAgICAgICAgICAgICAgIHJlcGx5LnNlcSA9IG1zZy5zZXE7XG4gICAgICAgICAgICAgICAgICAgIHNvY2suZW1pdCgnR0FNRScsIHJlcGx5KTtcbiAgICAgICAgICAgICAgICAgICAgc2VxID0gbXNnLnNlcSArIDE7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuYWN0aW9uKG1zZyk7XG4gICAgICAgICAgICAgICAgaWYgKG1zZy5rYWlqdSAmJiBtc2cua2FpanUubG9nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2cgPSBtc2cua2FpanUubG9nLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBkYXRhIG9mIGxvZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBsYXllci5fdmlldy5wbGF5ZXJzKHBsYXllcnMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmQocGFpcHUpIHtcbiAgICAgICAgc29jay5yZW1vdmVBbGxMaXN0ZW5lcnMoJ0dBTUUnKTtcbiAgICAgICAgaWYgKHBhaXB1KSBmaWxlLmFkZChwYWlwdSwgMTApO1xuICAgICAgICBmYWRlSW4oJCgnYm9keScpLmF0dHIoJ2NsYXNzJywnZmlsZScpKTtcbiAgICAgICAgZmlsZS5yZWRyYXcoKTtcbiAgICAgICAgJCgnI2ZpbGUgaW5wdXRbbmFtZT1cInJvb21fbm9cIl0nKS52YWwoJycpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhwcmVzZXQpKSB7XG4gICAgICAgICQoJ3NlbGVjdFtuYW1lPVwicnVsZVwiXScpLmFwcGVuZCgkKCc8b3B0aW9uPicpLnZhbChrZXkpLnRleHQoa2V5KSk7XG4gICAgfVxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnTWFqaWFuZy5ydWxlJykpIHtcbiAgICAgICAgJCgnc2VsZWN0W25hbWU9XCJydWxlXCJdJykuYXBwZW5kKCQoJzxvcHRpb24+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbCgnLScpLnRleHQoJ+OCq+OCueOCv+ODoOODq+ODvOODqycpKTtcbiAgICB9XG5cbiAgICAkKCcjZmlsZSBmb3JtLnJvb20nKS5vbignc3VibWl0JywgKGV2KT0+e1xuICAgICAgICBsZXQgcm9vbSA9ICQoJ2lucHV0W25hbWU9XCJyb29tX25vXCJdJywgJChldi50YXJnZXQpKS52YWwoKTtcbiAgICAgICAgc29jay5lbWl0KCdST09NJywgcm9vbSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICAkKCcjcm9vbSBmb3JtJykub24oJ3N1Ym1pdCcsIChldik9PntcbiAgICAgICAgbGV0IHJvb20gPSAkKCdpbnB1dFtuYW1lPVwicm9vbV9ub1wiXScsICQoZXYudGFyZ2V0KSkudmFsKCk7XG5cbiAgICAgICAgbGV0IHJ1bGUgPSAkKCdzZWxlY3RbbmFtZT1cInJ1bGVcIl0nLCAkKGV2LnRhcmdldCkpLnZhbCgpO1xuICAgICAgICBydWxlID0gISBydWxlICAgICAgPyB7fVxuICAgICAgICAgICAgIDogcnVsZSA9PSAnLScgPyBKU09OLnBhcnNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnTWFqaWFuZy5ydWxlJyl8fCd7fScpXG4gICAgICAgICAgICAgOiAgICAgICAgICAgICAgIHByZXNldFtydWxlXTtcbiAgICAgICAgcnVsZSA9IE1hamlhbmcucnVsZShydWxlKTtcblxuICAgICAgICBsZXQgdGltZXIgPSAkKCdpbnB1dFtuYW1lPVwidGltZXJcIl0nLCAkKGV2LnRhcmdldCkpLnZhbCgpO1xuICAgICAgICB0aW1lciA9IHRpbWVyLm1hdGNoKC8oXFxkKykvZyk7XG4gICAgICAgIGlmICh0aW1lcikgdGltZXIgPSB0aW1lci5tYXAodD0+K3QpO1xuXG4gICAgICAgIHNvY2suZW1pdCgnU1RBUlQnLCByb29tLCBydWxlLCB0aW1lcik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCk9PnNjYWxlKCQoJyNib2FyZCcpLCAkKCcjc3BhY2UnKSkpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgKCk9PnNldFRpbWVvdXQoaW5pdCwgNTAwKSk7XG4gICAgaWYgKGxvYWRlZCkgJCh3aW5kb3cpLnRyaWdnZXIoJ2xvYWQnKTtcblxuICAgICQoJyN0aXRsZSAubG9naW4gZm9ybScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgbGV0IG1ldGhvZCA9ICQodGhpcykuYXR0cignbWV0aG9kJylcbiAgICAgICAgbGV0IHVybCAgICA9ICQodGhpcykuYXR0cignYWN0aW9uJyk7XG4gICAgICAgIGZldGNoKHVybCwgeyBtZXRob2Q6IG1ldGhvZCwgcmVkaXJlY3Q6ICdtYW51YWwnIH0pLnRoZW4ocmVzID0+e1xuICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT0gNDA0KSBoaWRlKCQodGhpcykpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuJCh3aW5kb3cpLm9uKCdsb2FkJywgKCk9PiBsb2FkZWQgPSB0cnVlKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==