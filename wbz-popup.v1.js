const $popup = {
	// 변수
	count: 0,
	zIndex: 10000,
	$popbg: `<div class="wbz-popup-bg" id="wbz-popup-bg"></div>`,
	alert: function(opt) {
		// 최초 생성인 경우 팝업
		if (this.count == 0) {
			document.body.insertAdjacentHTML('beforeend', this.$popbg);
			document.querySelector('#wbz-popup-bg').style.zIndex = this.zIndex;
		}
		this.count++;
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
			<div class="wbz-popup-cont on" id="wbz-popup-${this.zIndex + this.count}">
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
	close: function() {
		if (this.count == 1) {
			document.querySelector('#wbz-popup-bg').remove();
		}
		document.querySelector(`#wbz-popup-${this.zIndex + this.count}`).remove();
		this.count--;
	}
}