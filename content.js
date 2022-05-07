function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
    document.getElementsByTagName('head')[0].appendChild(scr);
}

function getDom(selector) {
	let ret = document.querySelector(selector);
	if (Boolean(ret) === false) {
		console.error(`Cannot find ${selector} - dom`);
		alert(`Cannot find ${selector} - dom`);
	}
	return ret;
}

const reservePageUrl = "https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000";
const resultUrl = "https://etk.srail.kr/hpg/hra/02/confirmReservationInfo.do?pageId=TK0101030000";

let getData = function(key, defaultValue) {
	let data = JSON.parse(sessionStorage.getItem(key));
	return data === null ? defaultValue : data;
}

let addMacroButton = function(image, handler) {
	let btn_dom = getDom('div.tal_c');

	let link = document.createElement('a');
	link.setAttribute('href', '#');
	link.setAttribute('onclick', handler);
	link.setAttribute('style', "margin-left:5px;");

	let img = document.createElement('img');
	img.setAttribute('src', chrome.extension.getURL(image));
	img.setAttribute('style', 'vertical-align:middle;');
	link.appendChild(img);
	btn_dom.appendChild(link);
}

let setNeedRefresh = function() {
	sessionStorage.setItem("needRefresh", "true");
	location.href = reservePageUrl;
}

let setSettings = function() {
	getDom("select[name=psgInfoPerPrnb1]").value = (sessionStorage.getItem('psgInfoPerPrnb1'));
	getDom("select[name=psgInfoPerPrnb2]").value = (sessionStorage.getItem('psgInfoPerPrnb2'));
	getDom("select[name=psgInfoPerPrnb3]").value = (sessionStorage.getItem('psgInfoPerPrnb3'));
	getDom("select[name=psgInfoPerPrnb4]").value = (sessionStorage.getItem('psgInfoPerPrnb4'));
	getDom("select[name=psgInfoPerPrnb5]").value = (sessionStorage.getItem('psgInfoPerPrnb5'));
	getDom("select[name=locSeatAttCd1]").value = (sessionStorage.getItem('locSeatAttCd1'));
	getDom("select[name=rqSeatAttCd1]").value = (sessionStorage.getItem('rqSeatAttCd1'));

	getDom("#dptRsStnCdNm").value = (sessionStorage.getItem('dptRsStnCdNm'));
	getDom("#arvRsStnCdNm").value = (sessionStorage.getItem('arvRsStnCdNm'));

	getDom("#dptDt").value = (sessionStorage.getItem('dptDt'));
	getDom("#dptTm").value = (sessionStorage.getItem('dptTm'));
}

let clearData = function() {
	sessionStorage.removeItem('macro');
	sessionStorage.removeItem('coachSelected');
	sessionStorage.removeItem('firstSelected');
	sessionStorage.removeItem('waitSelected');
	sessionStorage.removeItem('psgInfoPerPrnb1');
	sessionStorage.removeItem('psgInfoPerPrnb2');
	sessionStorage.removeItem('psgInfoPerPrnb3');
	sessionStorage.removeItem('psgInfoPerPrnb4');
	sessionStorage.removeItem('psgInfoPerPrnb5');
	sessionStorage.removeItem('locSeatAttCd1');
	sessionStorage.removeItem('rqSeatAttCd1');
	sessionStorage.removeItem("dptRsStnCdNm");
	sessionStorage.removeItem("arvRsStnCdNm");
	sessionStorage.removeItem("dptDt");
	sessionStorage.removeItem("dptTm");
}

let reservePageController = function() {
		injectJs(chrome.extension.getURL('inject.js'));

		let coachSelected = getData("coachSelected", []);
		let firstSelected = getData("firstSelected", []);
		let waitSelected = getData("waitSelected", []);

		if (sessionStorage.getItem("needRefresh") === "true") {
			sessionStorage.removeItem("needRefresh");
			setSettings();
			getDom('#search_top_tag > input').click();
			return;
		}

		if (sessionStorage.getItem("macro") === "true") {
			addMacroButton("images/btn_stop.png", "macrostop();");
		} else {
			addMacroButton("images/btn_start.png", "macro();");
		}


		// Inserts the macro checkbox into the table.
		if ($("#search-list").length != 0) {
			var rows = $('#search-list table tr');
			for (i = 1; i < rows.length; i++) {
				var columns = $(rows[i]).children('td');
				var first = $(columns[5]);
				var coach = $(columns[6]);
				var wait = $(columns[7]);
				if (coach.children().length > 0) {
					coach.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="coachMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', coachSelected.indexOf(i+"") > -1);
					coach.append(checkbox);
				}
				if (first.children().length > 0) {
					first.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="firstMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', firstSelected.indexOf(i+"") > -1);
					first.append(checkbox);
				}
				if (wait.children().length > 0) {
					wait.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="waitMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', waitSelected.indexOf(i+"") > -1);
					wait.append(checkbox);
				}
			}
		}

		if (sessionStorage.getItem('macro') === "true") {
			// Restores user preferences
			setSettings();

			if ($("#search-list").length != 0) {
				var rows = $('#search-list table tr');

				var succeed = false;
				for (i = 1; i < rows.length; i++) {
					var columns = $(rows[i]).children('td');

					var first = $(columns[5]);
					var coach = $(columns[6]);
					var wait = $(columns[7]);

					if (coachSelected.indexOf(i+"") > -1) {
						var coachSpecials = coach.children("a");
						console.log('coachSpecials', coachSpecials);

						if (coachSpecials.length != 0) {
							for (j = 0; j < coachSpecials.length; j++) {
								name = $(coachSpecials[j]).attr('class');
								spans = $(coachSpecials[j]).children('span');
								text = $(spans[0]).text();
								if (name == 'btn_small btn_burgundy_dark val_m wx90' && text == '예약하기') {
									$(coachSpecials[0])[0].click();
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}

					if (firstSelected.indexOf(i+"") > -1) {
						var firstSpecials = first.children("a");
						if (firstSpecials.length != 0) {
							for (j = 0; j < firstSpecials.length; j++) {
								name = $(firstSpecials[j]).attr('class');
								if (name == 'btn_small btn_burgundy_dark val_m wx90') {
									$(firstSpecials[0])[0].click();
									var coronaConfirm = document.querySelector('body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button');
									if (coronaConfirm != null && coronaConfirm.click && typeof coronaConfirm.click === 'function') {
										coronaConfirm.click();
									}
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}
					if (waitSelected.indexOf(i+"") > -1) {
						var waitSpecials = wait.children("a");
						if (waitSpecials.length != 0) {
							for (j = 0; j < waitSpecials.length; j++) {
								name = $(waitSpecials[j]).attr('class');
								spans = $(waitSpecials[j]).children('span');
								text = $(spans[0]).text();
								if (name == 'btn_small btn_burgundy_dark val_m wx90' && text == '신청하기') {
									$(waitSpecials[0])[0].click();
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}

					}
				}

				if (succeed == true) {
					//성공한건가?!~
				
				} else {
					setTimeout(function() { 
					location.reload();
					}, 1000);
				}
			} else {
				setNeedRefresh();
			}
		}

};

let resultPageController = function() {
	if (sessionStorage.getItem('macro') === "true") {
		var msgdom = document.querySelector('div.box2.val_m.tal_c > span');
		var paybtn = document.querySelector('a.btn_large.btn_blue_dark.val_m.mgr10 > span');
		var waitmsg = document.querySelector('#wrap > div.container.container-e > div > div.sub_con_area > div.alert_box > span:nth-child(2)');
		console.log(msgdom);
		console.log(paybtn);
		if (msgdom && (msgdom.innerText === "잔여석없음" || msgdom.innerText === "예약대기자한도수초과")) {
			//실패
			setNeedRefresh();
		} else if (paybtn && paybtn.innerText === "결제하기") {
			// 좌석 선점 성공시 매크로 정지
			clearData();
			chrome.extension.sendMessage({type: 'playSound'}, function(data) { });
		} else if (waitmsg && waitmsg.innerText == "예약대기가 접수되었습니다") {
			// 예약대기 성공시 매크로 정지
			clearData();
			chrome.extension.sendMessage({type: 'playSound'}, function(data) { });
		} else {
			setNeedRefresh();
		}
	}
}

$(document).ready(() => {

	if (document.URL.substring(0, reservePageUrl.length) == reservePageUrl) {
		reservePageController();
	} else if (document.URL.substring(0, resultUrl.length) === resultUrl) {
		resultPageController();
	}
});
