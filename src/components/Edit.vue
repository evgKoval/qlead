<template>
	<div>
		<router-view></router-view>
		<div class="footer fixed-bottom">
			<b-container fluid>
				<b-row>
					<b-col lg="6" md="4" class="save_next">
						<b-button size="lg" variant="primary" class="mr-3 d-inline-flex align-items-center" @click="saveData()">
							<span>Сохранить</span> 
							<clip-loader :loading="edit_loading" v-if="edit_loading" :size="'20px'" class="edit-loading"></clip-loader>
							<i class="far fa-save ml-2" v-show="!edit_loading"></i>
						</b-button>
						<b-button size="lg" variant="outline-primary" @click="nextStep()" v-show="router !== 'install'">
							<span class="xl_show">К следующему шагу</span> 
							<i class="fas fa-forward ml-2 ml_fix_lg"></i>
						</b-button>
					</b-col>
					<b-col lg="6" md="8" class="d-flex justify-content-end all_steps">
						<b-button-group size="lg">
						  <b-button variant="outline-success" to="questions">
							Вопросы
						  </b-button>
						  <b-button variant="outline-success" to="contacs">
							Сбор контактов
						  </b-button>
						  <b-button variant="outline-success" to="integration">
							Интеграции
						  </b-button>
						  <b-button variant="outline-success" to="install">
							Установка
						  </b-button>
						</b-button-group>
					</b-col>
				</b-row>
			</b-container>
		</div>
	</div>
</template>

<script>
	import * as fb from 'firebase';
	import ClipLoader from 'vue-spinner/src/ClipLoader.vue';

	export default {
		components: { ClipLoader },
		data() {
			return {
				edit_loading: false
			}
		},
		computed: {
			router() {
				return this.$route.name
			}
		},
		methods: {
			async saveData() {
				this.edit_loading = true;

				let index = 0;
				for (var i = 0; i < this.$children.length; i++) {
					if(this.$children[i].questions) {
						index = i
					}
				}

				let question = {
					quiz_name: this.$children[index].quiz_name,
					metrika: this.$children[index].metrika,
					analytics: this.$children[index].analytics,
					questions: this.$children[index].questions,
					config: this.$children[index].config,
					galleryElements: this.$children[index].galleryElements,
					youtubePlayer: this.$children[index].youtubePlayer,
					videoElements: this.$children[index].videoElements,
					localVideo: this.$children[index].localVideo,
					consultantName: this.$children[index].consultantName,
					consultantDescription: this.$children[index].consultantDescription,
					consultantImg: this.$children[index].consultantImg,
					consultantImgSrc: this.$children[index].consultantImgSrc,
					moreConsultantText: this.$children[index].moreConsultantText,
					consultantElements: this.$children[index].consultantElements,
					addBlockElements: this.$children[index].addBlockElements,
					v_range: this.$children[index].v_range,
					infoHeight: this.$children[index].infoHeight,
					sliderAllCount: this.$children[index].sliderAllCount,
					sliderActive: this.$children[index].sliderActive,
					sliderOffsetLeft: this.$children[index].sliderOffsetLeft,
					sliderOffsetStep: this.$children[index].sliderOffsetStep,
					lastVideoElements: this.$children[index].lastVideoElements,
					lastConsultantElements: this.$children[index].lastConsultantElements,
					resultTitleQ: this.$children[index].resultTitleQ,
					resultDescQ: this.$children[index].resultDescQ,
					resultAddGifts: this.$children[index].resultAddGifts,
					addGiftsList: this.$children[index].addGiftsList,
					btnText: this.$children[index].btnText,
					politicsUrl: this.$children[index].politicsUrl,
					inputs: this.$children[index].inputs,
					phoneMask: this.$children[index].phoneMask,
					selectMask: this.$children[index].selectMask,
					readyMask: this.$children[index].readyMask,
					userInputPhone: this.$children[index].userInputPhone,
					messengerLink: this.$children[index].messengerLink,
					messengerBtnText: this.$children[index].messengerBtnText,
					messengersTitle: this.$children[index].messengersTitle,
					animation: this.$children[index].animation,
					loaderCheck: this.$children[index].loaderCheck,
					customEmails: this.$children[index].customEmails,
					readyEmail: this.$children[index].readyEmail,
					autoOpenCh: this.$children[index].autoOpenCh,
					autoOpen: this.$children[index].autoOpen,
					exitOpen: this.$children[index].exitOpen,
					exitOpenOnce: this.$children[index].exitOpenOnce,
					modal: this.$children[index].modal,
					linkLocation: this.$children[index].linkLocation,
				};

				let style = {
					colors: this.$children[index].colors,
					font_color: this.$children[index].font_color,
					bg_image: this.$children[index].bg_image,
					bg_image_src: this.$children[index].bg_image_src,
					bg_position: this.$children[index].bg_position,
					bg_position_select: this.$children[index].bg_position_select,
					bg_overlay: this.$children[index].bg_overlay,
					head_horizontal_align: this.$children[index].head_horizontal_align,
					head_horizontal_align_select: this.$children[index].head_horizontal_align_select,
					head_logo: this.$children[index].head_logo,
					head_logo_src: this.$children[index].head_logo_src,
					head_desc: this.$children[index].head_desc,
					head_desc_show: this.$children[index].head_desc_show,
					head_desc_weight: this.$children[index].head_desc_weight,
					head_desc_font_size: this.$children[index].head_desc_font_size,
					progress_height: this.$children[index].progress_height,
					progress_font_size: this.$children[index].progress_font_size,
					progress_bg: this.$children[index].progress_bg,
					progress_border: this.$children[index].progress_border,
					progress_margin_top: this.$children[index].progress_margin_top,
					progress_margin_bottom: this.$children[index].progress_margin_bottom,
					progress_shadow: this.$children[index].progress_shadow,
					progressbar_color_text: this.$children[index].progressbar_color_text,
					progressbar_bg: this.$children[index].progressbar_bg,
					progressbar_radius: this.$children[index].progressbar_radius,
					progressbar_shadow: this.$children[index].progressbar_shadow,
					question_bg: this.$children[index].question_bg,
					question_border: this.$children[index].question_border,
					question_padd_vert: this.$children[index].question_padd_vert,
					question_padd_horz: this.$children[index].question_padd_horz,
					question_radius: this.$children[index].question_radius,
					question_shadow: this.$children[index].question_shadow,
					question_index_width: this.$children[index].question_index_width,
					question_index_height: this.$children[index].question_index_height,
					question_index_bg: this.$children[index].question_index_bg,
					question_index_border: this.$children[index].question_index_border,
					question_index_fz: this.$children[index].question_index_fz,
					question_index_weight: this.$children[index].question_index_weight,
					question_index_shadow: this.$children[index].question_index_shadow,
					question_index_top: this.$children[index].question_index_top,
					question_index_left: this.$children[index].question_index_left,
					question_title_fz: this.$children[index].question_title_fz,
					question_title_weight: this.$children[index].question_title_weight,
					radio_width_and_height: this.$children[index].radio_width_and_height,
					radio_bg: this.$children[index].radio_bg,
					radio_border: this.$children[index].radio_border,
					radio_shadow: this.$children[index].radio_shadow,
					radio_before_bg: this.$children[index].radio_before_bg,
					radio_before_shadow: this.$children[index].radio_before_shadow,
					radio_hover_bg: this.$children[index].radio_hover_bg,
					radio_hover_shadow: this.$children[index].radio_hover_shadow,
					radio_active_bg: this.$children[index].radio_active_bg,
					radio_active_image: this.$children[index].radio_active_image,
					input_bg: this.$children[index].input_bg,
					input_color_text: this.$children[index].input_color_text,
					input_weight: this.$children[index].input_weight,
					input_border: this.$children[index].input_border,
					input_shadow: this.$children[index].input_shadow,
					button_bg: this.$children[index].button_bg,
					button_color_text: this.$children[index].button_color_text,
					button_border: this.$children[index].button_border,
					button_shadow: this.$children[index].button_shadow,
					checkbox_bg: this.$children[index].checkbox_bg,
					checkbox_border: this.$children[index].checkbox_border,
					checkbox_shadow: this.$children[index].checkbox_shadow,
					checkbox_before_bg: this.$children[index].checkbox_before_bg,
					checkbox_before_shadow: this.$children[index].checkbox_before_shadow,
					checkbox_hover_bg: this.$children[index].checkbox_hover_bg,
					checkbox_hover_shadow: this.$children[index].checkbox_hover_shadow,
					checkbox_active_bg: this.$children[index].checkbox_active_bg,
					checkbox_active_image: this.$children[index].checkbox_active_image,
					calendar_bg: this.$children[index].calendar_bg,
					calendar_color: this.$children[index].calendar_color,
					calendar_border: this.$children[index].calendar_border,
					calendar_shadow: this.$children[index].calendar_shadow,
					calendar_hover_bg: this.$children[index].calendar_hover_bg,
					calendar_hover_color: this.$children[index].calendar_hover_color,
					calendar_active_bg: this.$children[index].calendar_active_bg,
					calendar_active_color: this.$children[index].calendar_active_color,
					range_bg: this.$children[index].range_bg,
					range_shadow: this.$children[index].range_shadow,
					range_thumb: this.$children[index].range_thumb,
					result_bg: this.$children[index].result_bg,
					result_color: this.$children[index].result_color,
					result_border: this.$children[index].result_border,
					result_fz: this.$children[index].result_fz,
					result_padding: this.$children[index].result_padding,
					result_align: this.$children[index].result_align,
					result_align_select: this.$children[index].result_align_select,
					result_display: this.$children[index].result_display,
					result_shadow: this.$children[index].result_shadow,
					info_bg: this.$children[index].info_bg,
					info_color: this.$children[index].info_color,
					info_border: this.$children[index].info_border,
					info_shadow: this.$children[index].info_shadow,
					info_padding_left: this.$children[index].info_padding_left,
					arrows_bg: this.$children[index].arrows_bg,
					arrows_color: this.$children[index].arrows_color,
					arrows_border: this.$children[index].arrows_border,
					arrows_fz: this.$children[index].arrows_fz,
					arrows_shadow: this.$children[index].arrows_shadow,
					arrows_left: this.$children[index].arrows_left,
					arrows_right: this.$children[index].arrows_right,
					arrows_top: this.$children[index].arrows_top,
					tooltip_image_border: this.$children[index].tooltip_image_border,
					tooltip_image_shadow: this.$children[index].tooltip_image_shadow,
					tooltip_image_align: this.$children[index].tooltip_image_align,
					tooltip_image_align_select: this.$children[index].tooltip_image_align_select,
					tooltip_title_bg: this.$children[index].tooltip_title_bg,
					tooltip_title_color: this.$children[index].tooltip_title_color,
					tooltip_title_shadow: this.$children[index].tooltip_title_shadow,
					tooltip_title_radius: this.$children[index].tooltip_title_radius,
					tooltip_text_bg: this.$children[index].tooltip_text_bg,
					tooltip_text_color: this.$children[index].tooltip_text_color,
					tooltip_text_radius: this.$children[index].tooltip_text_radius,
					tooltip_text_shadow: this.$children[index].tooltip_text_shadow,
					qtip_top: this.$children[index].qtip_top,
					qtip_left: this.$children[index].qtip_left,
					gift_bg: this.$children[index].gift_bg,
					gift_color: this.$children[index].gift_color,
					gift_border: this.$children[index].gift_border,
					gift_shadow: this.$children[index].gift_shadow,
					video_text_weight: this.$children[index].video_text_weight,
					video_text_fz: this.$children[index].video_text_fz,
					video_image: this.$children[index].video_image,
					video_image_display: this.$children[index].video_image_display,
					video_text_text: this.$children[index].video_text_text,
					consultant_bg: this.$children[index].consultant_bg,
					consultant_color: this.$children[index].consultant_color,
					consultant_border: this.$children[index].consultant_border,
					consultant_shadow: this.$children[index].consultant_shadow,
					consultant_padding: this.$children[index].consultant_padding,
					consultant_top_padding: this.$children[index].consultant_top_padding,
					consultant_top_name_fz: this.$children[index].consultant_top_name_fz,
					consultant_top_position_fz: this.$children[index].consultant_top_position_fz,
					consultant_image_border: this.$children[index].consultant_image_border,
					consultant_image_shadow: this.$children[index].consultant_image_shadow,
					consultant_words_bg: this.$children[index].consultant_words_bg,
					consultant_words_border: this.$children[index].consultant_words_border,
					consultant_words_shadow: this.$children[index].consultant_words_shadow,
					consultant_words_color: this.$children[index].consultant_words_color,
					m_button_bg: this.$children[index].m_button_bg,
					m_button_color: this.$children[index].m_button_color,
					m_button_padding: this.$children[index].m_button_padding,
					m_button_border: this.$children[index].m_button_border,
					m_button_shadow: this.$children[index].m_button_shadow,
					m_block_bg: this.$children[index].m_block_bg,
					m_block_color: this.$children[index].m_block_color,
					m_block_border: this.$children[index].m_block_border,
					m_block_shadow: this.$children[index].m_block_shadow,
					m_block_hover: this.$children[index].m_block_hover,
					allFonts: this.$children[index].allFonts,
					selectedFont: this.$children[index].selectedFont,
					send_button_bg: this.$children[index].send_button_bg,
					send_button_color_text: this.$children[index].send_button_color_text,
					send_button_border: this.$children[index].send_button_border,
					send_button_shadow: this.$children[index].send_button_shadow,
					send_input_bg: this.$children[index].send_input_bg,
					send_input_color_text: this.$children[index].send_input_color_text,
					send_input_border: this.$children[index].send_input_border,
					send_input_shadow: this.$children[index].send_input_shadow,
					i_button_width: this.$children[index].i_button_width,
					i_button_height: this.$children[index].i_button_height,
					i_button_bg: this.$children[index].i_button_bg,
					i_button_color: this.$children[index].i_button_color,
					i_button_border: this.$children[index].i_button_border,
					i_button_shadow: this.$children[index].i_button_shadow,
					i_button_fz: this.$children[index].i_button_fz,
					i_button_weight: this.$children[index].i_button_weight,
					question_block_color_text: this.$children[index].question_block_color_text,
					link_color_text: this.$children[index].link_color_text,
				}

				let idQuiz = this.$router.history.current.params.id,
					urlQuiz = 'https://myquiz-9b908.firebaseio.com/quizzes/' + idQuiz +'.json';
				
				let dataForAjax = {
					owner: this.$store.getters.user.id,
					questions: JSON.stringify(question),
					styles: JSON.stringify(style),
					name: question.quiz_name,
				};

				$.ajax({
					type: 'PUT',
				    url: urlQuiz,
				    data: JSON.stringify(dataForAjax),
				    success: (data, textStatus, request, response) => {
				    	this.edit_loading = false;
				    },
				    error: function (request, textStatus, errorThrown, response) {
				    	console.log(request);
				    }
				});
			},
			nextStep() {
				switch (this.$route.name) {
					case 'questions':
						this.$router.push({ name: 'getcontacs' })
						break;
					case 'getcontacs':
						this.$router.push({ name: 'integration' })
						break;
					case 'integration':
						this.$router.push({ name: 'install' })
						break;
				}
			}
		}
	}
</script>

<style>
	:root {
		--radio-background: rgba(255, 255, 255, 1);
		--radio-border: 0px solid #000;
		--radio-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
		--radio-before-background: rgba(255, 255, 255, 0.3);
		--radio-before-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
		--radio-hover-background: rgba(255, 255, 255, 0.3);
		--radio-hover-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
		--radio-checked: rgba(0, 0, 0, 1);
		--inputs-check: url(../../static/questions/checkmark.png);
		--checkbox-background: rgba(255, 255, 255, 1);
		--checkbox-border: 0px solid #000;
		--checkbox-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
		--checkbox-radius: 0px;
		--checkbox-before-background: rgba(255, 255, 255, 1);
		--checkbox-before-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
		--checkbox-hover-background: rgba(255, 255, 255, 0.3);
		--checkbox-hover-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
		--checkbox-checked: rgba(0, 0, 0, 1);
		--inputs-checkbox-check: url(../../static/questions/checkmark.png);
		--calendar-arrow: rgba(255, 255, 255, 1);
		--calendar-arrow-display: block;
		--calendar-selected: rgba(255, 0, 255, 1);
		--calendar-color: rgba(255, 255, 255, 1);
		--calendar-radius: 0px;
		--calendar-hover-background: rgba(0, 0, 0, 0.45);
		--calendar-hover-color: rgba(255, 255, 255, 1);
		--range-thumb: #ff0;
		--m-block-hover: #e5e5e5;
	}

	#app {
		justify-content: flex-start;
	}

	.main_content {
		padding: 3rem;
	}

	.edit_list_questions .list-group-item {
		overflow-x: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		position: relative;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		justify-content: space-between;
		-ms-align-items: center;
		align-items: center;
		height: 50px;
	}

	.list-group-item:hover {
		color: #495057;
		text-decoration: none;
		background-color: #f8f9fa;
	}

	.edit_list_questions .active:hover {
		background-color: #4da1ff;
		color: #fff;
	}

	.edit_list_questions span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		width: 90%;
	}

	.edit_list_questions .fa-trash-alt {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 1rem;
		opacity: 0;
		transition: .18s;
	}

	.edit_list_questions .list-group-item:hover .fa-trash-alt {
		opacity: 1;
	}

	.fa-trash-alt:hover {
		color: #dc3545;
		cursor: pointer;
	}

	.edit_list_questions .active .fa-trash-alt:hover {
		color: #dc3545;
	}

	.edit_answers .list-group-item, .edit_config .list-group-item {
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		justify-content: space-between;
		-ms-align-items: center;
		align-items: center;
	}

	.edit_answers .list-group-item i, .edit_config .list-group-item i {
		padding: 0.3rem;
	}

	.fa-arrows-alt:hover, .fa-edit:hover {
		color: #4da1ff;
		cursor: pointer;
	}

	.edit_config .list-group-item {
		padding-left: 73px;
	}

	.footer {
		border-top: 1px solid rgba(0,0,0,.125);
		background-color: #fff;
		padding: 2rem;
		z-index: 100200;
	}

	.steps_description {
		margin-right: 1rem;
	}

	.my_mb {
		margin-bottom: 113px;
	}

	.fa-question-circle {
		color: rgba(0,0,0,.5);
		cursor: pointer;
		transition: .18s;
		font-size: 1.2rem;
	}

	.fa-question-circle:hover {
		color: #4da1ff;
	}

	.xl_show {
		display: inline-block;
	}

	.xl_hidden {
		display: none;
	}

	.edit_config_btns, .edit_question_btns {
		text-align: right;
		padding-left: 1rem;
	}

	@media (max-width: 1199.98px) {
		.top_edit .btn-lg {
			padding: .375rem .75rem;
			font-size: 1rem;
			line-height: 1.5;
			border-radius: .25rem;
		}

		.top_edit .input-group-lg > .form-control, .top_edit .input-group-lg > .input-group-append > .btn, .top_edit .input-group-lg > .input-group-append > .input-group-text, .top_edit .input-group-lg > .input-group-prepend > .btn, .top_edit .input-group-lg > .input-group-prepend > .input-group-text {
			height: calc(2.25rem + 2px);
			padding: .375rem .75rem;
			font-size: 1rem;
			line-height: 1.5;
			border-radius: .25rem;
		}

		.edit_top_right .btn-lg {
			margin: 0.3rem 0;
		}

		.ml_fix_lg {
			margin-left: 0 !important;
		}

		.xl_show {
			display: none;
		}

		.xl_hidden {
			display: inline-block;
		}

		.my_mb_questions {
			margin-bottom: 1.25rem;
		}
	}

	@media (max-width: 991.98px) {
		.footer .btn-lg, .footer .btn-group-lg button, .footer .btn-group-lg a {
			padding: .375rem .75rem;
			font-size: 1rem;
			line-height: 1.5;
			border-radius: .25rem;
		}

		.fa-save {
			display: none;
		}

		.my_mb {
			margin-bottom: 103px;
		}
	}

	@media (max-width: 767.98px) {
		.edit_top_right {
			margin-top: 1rem;
			text-align: left !important;
		}

		.fixed-bottom {
			position: static;
		}

		.my_mb {
			margin-bottom: 0;
		}

		.save_next {
			margin-bottom: 1rem;
			display: flex;
		}

		.save_next button {
			width: 100%;
		}

		.all_steps .btn-group, .all_steps .btn-group button {
			width: 100%
		}

		.my_mb_steps {
			margin-bottom: 1.25rem;
		}

		.edit_list_questions .fa-trash-alt {
			opacity: 1;
		}

		.my_mb_questions button, .my_configuration button {
			white-space: normal;
		}
	}

	@media (max-width: 575.98px) {
		.main_content {
			padding: 1.5rem;
		}

		.edit_top_right {
			display: -webkit-flex;
			display: -moz-flex;
			display: -ms-flex;
			display: -o-flex;
			display: flex;
			-webkit-flex-direction: column;
			-moz-flex-direction: column;
			-ms-flex-direction: column;
			-o-flex-direction: column;
			flex-direction: column;
		}

		.edit_top_right button {
			margin-left: 0 !important;
			white-space: normal;
		}

		.edit_top_right button i {
			display: none;
		}

		.top_edit .fa-question-circle {
			display: none;
		}

		.all_steps .btn-group {
			display: flex;
			flex-direction: column;
		}

		.my_mb_steps button {
			padding: .375rem .75rem;
			font-size: 1rem;
			line-height: 1.5;
			border-radius: .25rem;
			width: 100%;
			white-space: normal;
		}

		.edit_config .list-group-item {
			background: none !important;
		}

		.edit_config .list-group-item {
			padding-left: 1.25rem;
		}
	}

	.custom-file-label {
		overflow: hidden;
	}

	.custom-file-label::after {
		color: #fff;
		content: "Выбрать";
		background-color: #4da1ff;
		border-left: 1px solid #4da1ff;
	}

	.choice_player .custom-control-label {
		width: 100%;
	}

	.choice_player .custom-control-inline {
		display: block;
	}

	.choice_player .custom-control-label label {
		display: block;
		width: 100% !important;
	}

	.choice_player label {
		width: 100% !important;
	}

	.modal {
		z-index: 100500;
	}

	.modal-backdrop {
		z-index: 100400;
	}

	.nav-tabs .nav-item {
		width: 50%;
		text-align: center;
	}

	.vue-slider-component .vue-slider {
		background-color: #ced4da;	
	}

	.vue-slider-component .vue-slider-tooltip {
		display: none;
	}

	.vue-slider-component .vue-slider-process {
		background-color: #4da1ff;
	}

	.vc-sketch-field {
		display: none !important;
	}

	.vc-sketch-alpha-wrap {
		display: none !important;
	}

	.vc-sketch-hue-wrap {
		height: 16px !important;
	}

	.vc-hue-picker {
		height: 14px !important;
	}

	.vc-sketch-color-wrap {
		width: 16px !important;
		height: 16px !important;
	}

	.popover {
		max-width: 320px;
	}

	.three_tabs .nav-tabs .nav-item {
		width: 33.33%;
		text-align: center;
	}

	.four_tabs .nav-tabs .nav-item {
		width: 25%;
		text-align: center;
	}

	.more_tabs .nav-tabs .nav-item {
		width: auto;
		text-align: center;
		font-size: 14px;
	}

	.more_tabs .nav-link {
		padding: .5rem 0.75rem;
	}

	.popover {
		z-index: 106000;
	}

	.range-slider-fill {
		background-color: #4da1ff;
	}

	.spinner {
	    margin: auto;
	    margin-top: 6rem;
	    /*height: 4.5rem !important;
	    width: 4.5rem !important;
	    background-color: #4da1ff !important;*/
	}

	.spinner > div {
	    background-color: #4da1ff !important;
	    border-radius: 100%;
	    -webkit-animation-fill-mode: both;
	    animation-fill-mode: both;
	    position: absolute;
	    opacity: 0;
	    width: 100px !important;
	    height: 100px !important;
	    -webkit-animation: jumper-data-v-5cce2b38 1s 0s linear infinite;
	    animation: jumper-data-v-5cce2b38 1s 0s linear infinite;
	}

	.my_modal_popover {
		z-index: 100100;
	}

	.v-clip {
		border-width: 6px !important;
		border-color: #4da1ff #4da1ff transparent !important;
	}

	.edit-loading .v-clip {
		position: relative;
		top: 3px;
		margin-left: 8px;
		border-width: 3px !important;
		border-color: #fff #fff transparent !important;
	}
</style>
