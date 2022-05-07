window.showModalDialog = window.showModalDialog || function(url, arg, opt) {
	window.open(url, arg, opt);
};

function macro() {
	if (sessionStorage.getItem('macro') === "true") {
		return;
	}
	let coachSelected = [].map.call(document.querySelectorAll('.coachMacro:checked'), function (select) {
		return select.value;
	});
	let firstSelected = [].map.call(document.querySelectorAll('.firstMacro:checked'), function (select) {
		return select.value;
	});
	let waitSelected = [].map.call(document.querySelectorAll('.waitMacro:checked'), function (select) {
		return select.value;
	});

	if (coachSelected.length == 0 && firstSelected.length == 0 && waitSelected.length == 0) {
		alert("매크로를 실행하기 위해서는 예매하기 위한 열차 1개 이상을 선택하십시오.");
	} else {
		alert("매크로를 시작합니다.\n트럼펫 소리가 나면 바로 결제를 해주셔야 합니다.");

		sessionStorage.setItem('macro', "true");
		sessionStorage.setItem('coachSelected', JSON.stringify(coachSelected));
		sessionStorage.setItem('firstSelected', JSON.stringify(firstSelected));
		sessionStorage.setItem('waitSelected', JSON.stringify(waitSelected));

		// Stores user preferences.
		sessionStorage.setItem('psgInfoPerPrnb1', document.getElementsByName('psgInfoPerPrnb1')[0].value);
		sessionStorage.setItem('psgInfoPerPrnb2', document.getElementsByName('psgInfoPerPrnb2')[0].value);
		sessionStorage.setItem('psgInfoPerPrnb3', document.getElementsByName('psgInfoPerPrnb3')[0].value);
		sessionStorage.setItem('psgInfoPerPrnb4', document.getElementsByName('psgInfoPerPrnb4')[0].value);
		sessionStorage.setItem('psgInfoPerPrnb5', document.getElementsByName('psgInfoPerPrnb5')[0].value);
		sessionStorage.setItem('locSeatAttCd1', document.getElementsByName('locSeatAttCd1')[0].value);
		sessionStorage.setItem('rqSeatAttCd1', document.getElementsByName('rqSeatAttCd1')[0].value);
		sessionStorage.setItem("dptRsStnCdNm", document.getElementById("dptRsStnCdNm").value);
		sessionStorage.setItem("arvRsStnCdNm", document.getElementById("arvRsStnCdNm").value);
		sessionStorage.setItem("dptDt", document.getElementById("dptDt").value);
		sessionStorage.setItem("dptTm", document.getElementById("dptTm").value);

		location.reload();
	}
}

function macrostop() {
	if (sessionStorage.getItem('macro') !== "true") {
		return;
	}
	alert("매크로를 중지합니다.\n조건을 변경하여 재조회하신 후 다시 시작하실 수 있습니다.");

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

	location.reload();
}

const ESC_KEYCODE = 27;

document.addEventListener("keydown", (evt) =>{
	let key = evt.key || evt.keyCode;
	if (key === "Escape" || key === ESC_KEYCODE) {
		macrostop();
	}
});