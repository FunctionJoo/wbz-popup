const $popup = {
	// 변수
	// z-index 조절 필요시 값 변경
	zIndex: 10000,
	count: 0,
	activePopup: [],
	$popbg: `<div class="wbz-popup-bg" id="wbz-popup-bg"></div>`,
	backgroundSetting: function() {
		// 최초 생성인 경우 팝업
		if (this.count == 0) {
			document.body.insertAdjacentHTML('beforeend', this.$popbg);
			document.querySelector('#wbz-popup-bg').style.zIndex = this.zIndex;
		}
		this.count++;
	},
	alert: function(opt) {
		this.backgroundSetting();
		// 스트링만 입력된 경우
		if (typeof(opt) == 'string') {
			opt = {
				content: opt
			}
		}
		// 타이틀 입력되지 않은 경우 빈값 처리
		if (!opt.title) {
			opt.title = '';
		}
		let temp = `
			<div class="wbz-popup-cont is-instant on" id="wbz-popup-${this.zIndex + this.count}">
				<div class="popup-header">
					<b class="popup-title">${opt.title}</b>
					<button class="popup-close">close</button>
				</div>
				<div class="popup-cont">
					<div class="popup-text">
						${opt.content}
					</div>
					<div class="popup-button">
						<button type="button" class="popup-close popup-close-event">확인</button>
					</div>
				</div>
			</div>
		`;
		document.querySelector('body').insertAdjacentHTML('beforeend', temp);
		this.activePopup.push(`#wbz-popup-${this.zIndex + this.count}`);

		// 이벤트 설정
		if (opt.closeEvent) {
			// 설정한 이벤트가 있는경우 해당 이벤트를 실행
			document.querySelectorAll(`#wbz-popup-${this.zIndex + this.count} .popup-close`).forEach(($close) => {
				$close.addEventListener('click', () => {
					opt.closeEvent();
				});
			});
		} else {
			// 설정한 이벤트가 없는경우 닫기
			document.querySelectorAll(`#wbz-popup-${this.zIndex + this.count} .popup-close`).forEach(($close) => {
				$close.addEventListener('click', () => {
					this.close();
				});
			});
		}
	},
	template: function(target) {
		this.backgroundSetting();
		document.querySelector(target).classList.add('on');
		document.querySelector(target).style.zIndex = this.zIndex + this.count;
		this.activePopup.push(target);
	},
	close: function() {
		let $activePopup = document.querySelector(this.activePopup[this.activePopup.length - 1]);
		if ($activePopup) {
			if (this.count == 1) {
				document.querySelector('#wbz-popup-bg').remove();
			}
			if ($activePopup.classList.contains('is-instant')) {
				// 인스턴트 팝업인 경우
				$activePopup.remove();
			} else {
				// 템플릿 팝업의 경우
				$activePopup.classList.remove('on');
			}
			this.activePopup.pop();
			this.count--;
		} else {
			// 오류
			console.log('오류 발생: 활성화 팝업이 없음');
			return false;
		}
	},
	closeAll: function() {
		document.querySelector('#wbz-popup-bg').remove();
		document.querySelectorAll('.wbz-popup-cont').forEach(($el) => {
			if ($el.classList.contains('is-instant')) {
				$el.remove();
			} else {
				$el.classList.remove('on');
			}
		});
		this.activePopup = [];
		this.count = 0;
	}
}