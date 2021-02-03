function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
    document.getElementsByTagName('head')[0].appendChild(scr);
}

var dsturl1 = "https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000";
var resultUrl = "https://etk.srail.kr/hpg/hra/02/confirmReservationInfo.do?pageId=TK0101030000";


if (document.URL.substring(0, dsturl1.length) == dsturl1) {

	$(document).ready(function() {
		injectJs(chrome.extension.getURL('inject.js'));

		var coachSelected = JSON.parse(sessionStorage.getItem('coachSelected'));
		var firstSelected = JSON.parse(sessionStorage.getItem('firstSelected'));
		var waitSelected = JSON.parse(sessionStorage.getItem('waitSelected'));

		if (coachSelected == null) coachSelected = [];
		if (firstSelected == null) firstSelected = [];
		if (waitSelected == null) waitSelected = [];
		console.log("coach:" + coachSelected);
		console.log("first:" + firstSelected);
		console.log("wait:" + waitSelected);

		var btn_dom = document.querySelector('div.tal_c');

		if (sessionStorage.getItem('macro') == "true") {
			var link = document.createElement('a');
			link.setAttribute('href', '#');
			link.setAttribute('onclick', 'macrostop();');
			link.setAttribute('style', "margin-left:5px;");
			var img = document.createElement('img');
			img.setAttribute('src', chrome.extension.getURL('images/btn_stop.png'));
			img.setAttribute('style', 'vertical-align:middle;');
			link.appendChild(img);
			btn_dom.appendChild(link);
		} else {
			var link = document.createElement('a');
			link.setAttribute('href', '#');
			link.setAttribute('onclick', 'macro();');
			link.setAttribute('style', "margin-left:5px;");
			var img = document.createElement('img');
			img.setAttribute('src', chrome.extension.getURL('images/btn_start.png'));
			img.setAttribute('style', 'vertical-align:middle;');
			link.appendChild(img);
			btn_dom.appendChild(link);
		}


		// Inserts the macro button into the table.
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

		if (sessionStorage.getItem('macro') == "true") {
			// Restores user preferences
			$("#psgInfoPerPrnb1").val(sessionStorage.getItem('psgInfoPerPrnb1'));
			$("#psgInfoPerPrnb5").val(sessionStorage.getItem('psgInfoPerPrnb5'));
			$("#psgInfoPerPrnb4").val(sessionStorage.getItem('psgInfoPerPrnb4'));
			$("#psgInfoPerPrnb2").val(sessionStorage.getItem('psgInfoPerPrnb2'));
			$("#psgInfoPerPrnb3").val(sessionStorage.getItem('psgInfoPerPrnb3'));
			$("#locSeatAttCd1").val(sessionStorage.getItem('locSeatAttCd1'));
			$("#rqSeatAttCd1").val(sessionStorage.getItem('rqSeatAttCd1'));

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
				history.go(-1);
			}
		}
	});
} else if (document.URL.substring(0, resultUrl.length) === resultUrl) {
	if (sessionStorage.getItem('macro') == "true") {
		var msgdom = document.querySelector('div.box2.val_m.tal_c > span');
		var paybtn = document.querySelector('a.btn_large.btn_blue_dark.val_m.mgr10 > span');
		var waitmsg = document.querySelector('#wrap > div.container.container-e > div > div.sub_con_area > div.alert_box > span:nth-child(2)');
		console.log(msgdom);
		if (msgdom && msgdom.innerText === "잔여석없음") {
			alert('실패....');
			console.log("사실 실패");
			setTimeout(function() {
				history.go(-1);
			}, 1000);
		} else if (paybtn && paybtn.innerText === "결제하기") {
			// 좌석 선점 성공시 매크로 정지
			sessionStorage.removeItem('macro');
			sessionStorage.removeItem('coachSelected');
			sessionStorage.removeItem('firstSelected');
			sessionStorage.removeItem('psgInfoPerPrnb1');
			sessionStorage.removeItem('psgInfoPerPrnb5');
			sessionStorage.removeItem('psgInfoPerPrnb4');
			sessionStorage.removeItem('psgInfoPerPrnb2');
			sessionStorage.removeItem('psgInfoPerPrnb3');
			sessionStorage.removeItem('locSeatAttCd1');
			sessionStorage.removeItem('rqSeatAttCd1');
			chrome.extension.sendMessage({type: 'playSound'}, function(data) { });
		} else if (waitmsg && waitmsg.innerText == "예약대기가 접수되었습니다") {
			// 예약대기 성공시 매크로 정지
			sessionStorage.removeItem('macro');
			sessionStorage.removeItem('coachSelected');
			sessionStorage.removeItem('firstSelected');
			sessionStorage.removeItem('psgInfoPerPrnb1');
			sessionStorage.removeItem('psgInfoPerPrnb5');
			sessionStorage.removeItem('psgInfoPerPrnb4');
			sessionStorage.removeItem('psgInfoPerPrnb2');
			sessionStorage.removeItem('psgInfoPerPrnb3');
			sessionStorage.removeItem('locSeatAttCd1');
			sessionStorage.removeItem('rqSeatAttCd1');
			chrome.extension.sendMessage({type: 'playSound'}, function(data) { });
		} else {
			alert('이도저도아님...?!');
		}
	}
}
