bdoChatVm = function() {
	/*let bdoChatTpl = `
        <div class="js-chat-container" data-chat-mode="popup" data-chat-height="360" :style="bdoChatStyle">
            <!-- Chat Window -->
            <div class="block block-bordered remove-margin-b block-opt-hidden" id="bdoChatblock" ref="bdoChatblock">
                <div class="block-header bg-gray-lighter" @click="headerClick">
                    <ul class="block-options">
                        <li>
                            <button type="button" @click.stop="toggleBdoChat" v-show="toggleBdoChatShow">
                                <i class="fa fa-arrows-v"></i>
                            </button>
                        </li>
                    </ul>
                    <h3 class="block-title">
                        <img class="img-avatar img-avatar16 pull-left"  src="images/faith/xxr.png" alt="">
                        <span class="push-5-l" v-show="xxrNameShow">小杏仁</span>
                    </h3>
                </div>
                <div class="js-chat-talk overflow-y-auto block-content block-content-full" data-chat-id="7" :style="msgBlockStyle">
                    <template v-for="(msgGroupItem, msgGroupIndex) in bdoChatMessges">
                        <div class="font-s12 text-muted text-center push-20-t push-15"><em>{{ msgGroupItem.date }}</em></div>
                        <template v-for="(msgItem, msgIndex) in msgGroupItem.msgs">
                            <div v-if="msgItem.type == 'qs'" class="block block-rounded block-transparent animated fadeInUp push-15 push-50-l block-chat-msg  block-chat-right">
                                <img class="img-avatar img-avatar32" :src="currentUserPhoto" alt="" onerror="this.src='assets/img/avatars/avatar10.jpg'">
                                <div class="block-content block-content-full block-content-mini bg-gray-lighter bdo-chat-msgcontent" v-html="msgItem.content"></div>
                            </div>
                            <div v-if="msgItem.type == 'as'" class="block block-rounded block-transparent animated fadeInUp push-15 push-50-r block-chat-msg block-chat-left">
                                <img class="img-avatar img-avatar32"  src="images/faith/xxr.png" alt="assets/img/avatars/avatar10.jpg">
                                <div class="block-content block-content-full block-content-mini bg-gray-lighter bdo-chat-msgcontent" v-html="msgItem.content"></div>
                            </div>
                        </template>
                    </template>
                </div>
                <div class="js-chat-form block-content block-content-full block-content-mini border-t">
                    <div class="row form-group remove-margin-b">
                        <div class="col-xs-12">
                            <textarea rows="3" id="bdoChatFormMessage" class="form-control postil-textarea" v-model="bdoChatFormMessage" placeholder="我想说.."></textarea>
                        </div>
                    </div>
                    <div class="row form-group remove-margin-b">
                        <div class="col-xs-12">
                            <botton id="submitBdoChatFormMessageBtn" class="btn btn-xs btn-primary postil-submit-btn pull-right" @click="submitBdoChatFormMessage">&nbsp;发送</botton>
                            <botton id="minBdoChatFormMessageBtn" class="btn btn-xs btn-primary postil-submit-btn pull-right" @click="toggleBdoChat">&nbsp;关闭</botton>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END Chat Window -->
        </div>
    `;*/
	let bdoChatTpl = `
		<div>
			<div id="bdo-xxr-min-show" :class="bdoXXRMinClass" @click="onDdoXXRMinShowClick">
				<img src="images/faith/xxr.png" alt="" class="img-avatar img-avatar32 pull-left">
			</div>
			<div class="js-chat-container" data-chat-mode="popup" data-chat-height="360" :style="bdoChatStyle">
				<!-- Chat Window -->
				<div class="block block-bordered remove-margin-b block-opt-hidden" id="bdoChatblock" ref="bdoChatblock">
					<div class="block-header bg-gray-lighter" @click="headerClick">
						<ul class="block-options">
							<li>
								<button type="button" @click.stop="toggleBdoChat" v-show="toggleBdoChatShow">
									<i class="fa fa-arrows-v"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">
							<img class="img-avatar img-avatar16 pull-left" src="images/faith/xxr.png" alt="">
							<span class="push-5-l" v-show="xxrNameShow">小杏仁</span>
						</h3>
					</div>
					<template>
						<div class="xxr-iframe-wrap">
							<iframe :src="xxrUrl"></iframe>
						</div>
					</template>
				</div>
				<!-- END Chat Window -->
			</div>
		</div>
	`;
	const bdoChat = {
		id: 'bdoChatForm',
		template: bdoChatTpl,
		data() {
			return {
				xxrUrl: window.xxrUrl + '?loginId=' + window.loginId + '&token=' + window.xxrToken,
				xxrNameShow: false,
				toggleBdoChatShow: false,
				bdoXXRMinClass: ['bdo-xxr-min', 'bdo-xxr-min-show'],
				bdoChatStyle: {
					'position': 'fixed',
					'right': '10px',
					'bottom': '0px',
					'display': 'inline-block',
					'padding': '0px',
					'width': '0px',
					'max-width': '70vw',
					'min-width': '0px',
					'height': '0px',
					'max-height': '70vw',
					'min-height': '0px',
					'z-index': '10500',
					'border-top-left-radius': '10px',
					'border-top-right-radius': '10px',
					'box-shadow': 'rgb(0, 200, 255) 1px 2px 10px 1px'
				},
				msgBlockStyle: {
					'max-height': '80vh',
					'min-height': '80vh'
				},
				bdoChatFormMessage: '',
				bdoChatMessges: [],
				currentDay: new Date().format('yyyy-MM-dd'),
				currentUserPhoto: ''
			};
		},
		methods: {
			pushMsg(msg) {
				let msgs = this.bdoChatMessges.filter(msgdata => msgdata.date == this.currentDay);
				/*let msg = {
					type: 'qs',
					content: this.bdoChatFormMessage
				};*/
				if (msgs.length < 1) {
					this.bdoChatMessges.push({
						date: this.currentDay,
						msgs: [msg]
					});
				} else {
					msgs[0].msgs.push(msg);
				}
			},
			submitBdoChatFormMessage(event) {
				/*let msgs = this.bdoChatMessges.filter(msgdata => msgdata.date == this.currentDay);
				let msg = {
					type: 'qs',
					content: this.bdoChatFormMessage
				};
				if(msgs.length < 1) {
					this.bdoChatMessges.push({
						date: this.currentDay,
						msgs: [msg]
					});
				}else {
					msgs[0].msgs.push(msg);
				}
				this.bdoChatFormMessage = '';*/
				let msgQs = {
					type: 'qs',
					content: this.bdoChatFormMessage
				};
				this.pushMsg(msgQs);
				$.ajax({
					type: 'post',
					url: 'base/Robot.sms.json',
					data: {
						param1: this.bdoChatFormMessage
					},
					dataType: 'json'
				}).done(function(data) {
					if (data.success == true) {
						let msgAs = {
							type: 'as',
							content: data.data[0].smsResult
						};
						this.pushMsg(msgAs);
					}
				}.bind(this));
				this.bdoChatFormMessage = '';
			},
			headerClick(event) {
				if (event.currentTarget.tagName == 'BUTTON') {
					return;
				}
				if (!this.toggleBdoChatShow) {
					this.toggleBdoChat(event);
				}
			},
			toggleBdoChat(event) {
				let $elBlock = $(this.$refs['bdoChatblock']);
				$elBlock.toggleClass('block-opt-hidden');
				let $btnToggle = $('[data-toggle="block-option"][data-action="content_toggle"]', $elBlock);
				let $iconContent = 'si si-arrow-up';
				let $iconContentActive = 'si si-arrow-down';
				if ($btnToggle.length) {
					if ($elBlock.hasClass('block-opt-hidden')) {
						$('i', $btnToggle)
							.removeClass($iconContent)
							.addClass($iconContentActive);
					} else {
						$('i', $btnToggle)
							.removeClass($iconContentActive)
							.addClass($iconContent);
					}
				}
				this.xxrNameShow = !this.xxrNameShow;
				this.toggleBdoChatShow = !this.toggleBdoChatShow;
				if (this.toggleBdoChatShow) {
					this.bdoChatStyle['max-width'] = '70vh';
					this.bdoChatStyle['width'] = '70vh';
					this.bdoChatStyle['height'] = '80vh';
					this.bdoChatStyle['max-height'] = '80vh';

					if (this.bdoXXRMinClass.length == 2) {
						this.bdoXXRMinClass.pop();
					}
				} else {
					/*this.bdoChatStyle['max-width'] = '40px';
					this.bdoChatStyle['width'] = '40px';
					this.bdoChatStyle['height'] = '60px';
					this.bdoChatStyle['max-height'] = '60px';*/
					this.bdoChatStyle['max-width'] = '0px';
					this.bdoChatStyle['width'] = '0px';
					this.bdoChatStyle['height'] = '0px';
					this.bdoChatStyle['max-height'] = '0px';
					if (this.bdoXXRMinClass.length == 1) {
						this.bdoXXRMinClass.push('bdo-xxr-min-show');
					}
				}
			},
			onDdoXXRMinShowClick() {
				if (event.currentTarget.tagName == 'BUTTON') {
					return;
				}
				if (!this.toggleBdoChatShow) {
					this.toggleBdoChat(event);
				}
			}
		}
	};
	const BdoChat = Vue.extend(bdoChat);
	return new BdoChat();
}();