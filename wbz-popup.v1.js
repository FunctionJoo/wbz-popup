const $popup = {
	// 변수
	// z-index 조절 필요시 값 변경
	scrollY: 0,
	zIndex: 10000000,
	count: 0,
	activePopup: [],
	$popbg: `<div class="wbz-popup-bg" id="wbz-popup-bg"></div>`,
	backgroundSetting: function() {
		// 최초 생성인 경우 팝업
		if (this.count == 0) {
			document.body.insertAdjacentHTML('beforeend', this.$popbg);
			document.querySelector('#wbz-popup-bg').style.zIndex = this.zIndex;

			this.scrollY = window.pageYOffset;
			const body = document.querySelector('body');
			body.style.overflow = 'hidden';
			body.style.position = 'fixed';
			body.style.top = `-${this.scrollY}px`;
			body.style.width = '100%';
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
			opt.title = '&nbsp;';
		}

		// confirm 타입인 경우
		let buttonTemplate;
		if (opt.isConfirm == true) {
			buttonTemplate = `
			<button type="button" class="popup-close popup-close-event">취소</button>
			<button type="button" class="popup-confirm-event">확인</button>
			`;
		} else {
			buttonTemplate = `
			<button type="button" class="popup-close popup-close-event">확인</button>
			`;
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
						${buttonTemplate}
					</div>
				</div>
			</div>
		`;
		document.querySelector('body').insertAdjacentHTML('beforeend', temp);
		this.activePopup.push(`#wbz-popup-${this.zIndex + this.count}`);

		// 이벤트 설정
		if (opt.isConfirm == true) {
			if (opt.confirmEvent) {
				document.querySelector(`#wbz-popup-${this.zIndex + this.count} .popup-confirm-event`).addEventListener('click', () => {
					opt.confirmEvent();
				});
			} else if (opt.closeEvent) {
				document.querySelector(`#wbz-popup-${this.zIndex + this.count} .popup-confirm-event`).addEventListener('click', () => {
					opt.closeEvent();
				});
			} else {
				document.querySelector(`#wbz-popup-${this.zIndex + this.count} .popup-confirm-event`).addEventListener('click', () => {
					this.close();
				});
			}
		}
	},
	confirm: function(opt) {
		opt.isConfirm = true;
		this.alert(opt);
	},
	template: function(target) {
		this.backgroundSetting();
		document.querySelector(target).classList.add('on');
		if (document.querySelector(target).classList.contains('type-bottom')) {
			setTimeout(function() {document.querySelector(target).classList.add('ani');}, 10);
		}
		document.querySelector(target).style.zIndex = this.zIndex + this.count;
		this.activePopup.push(target);

		document.querySelector('#wbz-popup-bg').addEventListener('click', function() {
			$popup.closeAll();
		})
	},
	close: function() {
		let $activePopup = document.querySelector(this.activePopup[this.activePopup.length - 1]);
		if ($activePopup) {
			if (this.count == 1) {
				document.querySelector('#wbz-popup-bg').remove();

				const body = document.querySelector('body');
				body.style.removeProperty('overflow');
				body.style.removeProperty('position');
				body.style.removeProperty('top');
				body.style.removeProperty('width');
				window.scrollTo(0, this.scrollY);
			}
			if ($activePopup.classList.contains('is-instant')) {
				// 인스턴트 팝업인 경우
				$activePopup.remove();
			} else {
				// 템플릿 팝업의 경우
				if ($activePopup.classList.contains('type-bottom')) {
					$activePopup.classList.remove('ani');
					setTimeout(function() {$activePopup.classList.remove('on');}, 400);
				} else {
					$activePopup.classList.remove('on');
				}
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
		this.activePopup.forEach(() => {
			this.close();
		});
		this.activePopup = [];
		this.count = 0;
	}
}

// 팝업 이벤트 리스너 등록
window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('[data-popup^="#"][data-popup$="-pop"]').forEach(element => {
		element.addEventListener('click', () => $popup.template(element.dataset.popup));
	});
});
