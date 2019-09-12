<template>
	<div>
		<b-container fluid class="main_content my_mb">
		  <b-card class="edit_contacs">
	  		  <b-row>
	  	          <b-col lg="6" class="my_mb_install">
	          		<h4 class="mb-4">Установка квиза</h4>
	          		<h6 class="mb-4 mt-4">1. Вставьте этот код в блок head в начале страницы</h6>
	          		<clip-loader :loading="q_spinner" v-if="q_spinner" :size="'50px'" style="padding-top: 5%;"></clip-loader>
	          		<b-form-textarea id="textarea1" v-show="!q_spinner"
	          						 v-model="ready_code"
          		                     :rows="18"
          		                     readonly
          		                     class="mt-3">
          		    </b-form-textarea>
          		    <b-row v-show="!q_spinner">
          		    	<b-col lg="3">
		          		    <b-form-checkbox class="mt-3 mb-1"
					                         v-model="autoOpenCh"
					                         @change="autoOpening($event)">
					          Автооткрытие
					        </b-form-checkbox>
					        <div role="group" v-show="autoOpenCh" class="mt-2">
		        		        <label>Открывать через</label>
		        	        	<b-input-group append="сек">
		        	            	<b-form-input type="number" :value="autoOpen" @input="autoOpeningNumber($event)"></b-form-input>
		        	        	</b-input-group> 	
					        </div>	    
          		    	</b-col>
          		    	<b-col lg="6">
		          		    <b-form-checkbox class="mt-3 mb-1"
		          		    				 v-model="exitOpen" @change="exitOpening($event)">
					          Открывать квиз при попытке уйти с сайта
					        </b-form-checkbox>
        			        <div role="group" v-show="exitOpen" class="mt-2">
        	          		    <b-form-checkbox v-model="exitOpenOnce" @change="exitOpeningOnce($event)">
        				          Открывать каждый раз
        				        </b-form-checkbox>	
        			        </div>
          		    	</b-col>
          		    	<b-col lg="3">
          		    		<label class="mt-3 mb-2">Открывать квиз:</label>
          		    		<b-form-select v-model="modal" :options="modalOptions" class="mt-0" @change="modalLook($event)" />
          		    	</b-col>
          		    </b-row>
			        <hr>
			        <h6 class="mb-4 mt-4">2. Добавьте в нужное место кнопку, открывающую квиз</h6>
			        <clip-loader :loading="q_spinner" v-if="q_spinner" :size="'50px'" style="padding-top: 5%;"></clip-loader>
			        <b-button size="lg" class="d-none d-sm-inline-block" variant="primary" @click="showPopover = true; modalTop($event)" v-show="!q_spinner">
                    	Открыть редактор кнопки
                    	<i class="far fa-edit ml-2"></i>
                    </b-button>
                    <div class="mt-4" v-show="!q_spinner">
                    	<p>Предпросмотр:</p>
                    	<button class="qlead-button" :style="{ width: i_button_width + 'px', height: i_button_height + 'px', backgroundColor: i_button_bg.color.hex, color: i_button_color.hex, borderRadius: i_button_border.radius + 'px', fontSize: i_button_fz + 'px', fontWeight: i_button_weight  }">
                    		Пройти тест
                    	</button>
                    </div>
                    <div class="mt-4" v-show="!q_spinner">
                    	<p>Скопируйте этот код и установите в то место, где должна быть кнопка открытия квиза</p>
		          		<b-form-textarea id="textarea1"
		          						 :value="`<div class='qlead-container'>
	<a class='qlead-open-modal' style='width: ${i_button_width}px; height: ${i_button_height}px; background-color: ${i_button_bg.color.hex}; color: ${i_button_color.hex}; border-radius: ${i_button_border.radius}px; font-size: ${i_button_fz}px; font-weight: ${i_button_weight}; border: ${i_button_border.size}px ${i_button_border.type} ${i_button_border.color.hex}; box-shadow: rgba(${i_button_shadow.color.rgba.r}, ${i_button_shadow.color.rgba.g}, ${i_button_shadow.color.rgba.b}, ${i_button_shadow.opacity / 100}) ${i_button_shadow.x}px ${i_button_shadow.y}px ${i_button_shadow.blur}px>Пройти тест</a>
</div>`"
	          		                     :rows="5"
	          		                     :max-rows="9"
	          		                     readonly
	          		                     class="mt-3">
	          		    </b-form-textarea>
                    </div>
                    <hr>
                    <b-alert show variant="warning" class="mb-0">
						Код нужно вставить один раз. В дальнейшем, при редактировании квиза, изменения отобразятся автоматически. Менять нужно будет только кнопку, если вы изменили её дизайн.
                    </b-alert>
	  	          </b-col>
	  	          <b-col lg="6">
	  	          	<h4 class="mb-4">Прямая ссылка на квиз</h4>
	  	          	<b-input-group>
	  	          	    <b-form-input :value="'https://app.qlead.in/quiz/?id=' + idForUrl" readonly size="lg"></b-form-input>
	  	          	</b-input-group>
	  	          	<b-link :href="'https://app.qlead.in/quiz/?id=' + idForUrl" target="_blank">Открыть <i class="fas fa-external-link-alt ml-1 mt-3"></i></b-link>
	  	          </b-col>
	  	      </b-row>
		  </b-card>
		</b-container>

		<template v-if="showPopover">
			<div class="modal my_modal_popover">
				<header class="modal-header">
					<slot name="header">
						<span>Редактор кнопки</span>
						<button type="button" class="btn-close" @click="showPopover = false">
							x
						</button>
					</slot>
				</header>
				<section class="modal-body">
					<slot name="body">
						<b-tabs>
							<b-tab title="Конструктор" class="pt-3">
								<b-tabs class="more_tabs">
									<b-tab title="Размер" class="pt-4 pb-2">
				  						<div role="group" class="mb-3">
			  								<label>Ширина</label>
			  								<b-input-group append="px">
			  							    	<b-form-input type="number" v-model="i_button_width"></b-form-input>
			  								</b-input-group>
				  						</div>
				  						<div role="group">
			  								<label>Высота</label>
			  								<b-input-group append="px">
			  							    	<b-form-input type="number" v-model="i_button_height"></b-form-input>
			  								</b-input-group>
				  						</div>
									</b-tab>
									<b-tab title="Цвета" class="pt-4 pb-2">
				  						<div role="group">
				  						    <label>Цвет фона ползунка</label>
				  						    <b-input-group class="mb-3">
				  						        <b-input-group-prepend>
				  						            <b-btn variant="primary" id="exPopoverReactive-i-button-bg">Выбрать цвет</b-btn>
				  						            <b-popover target="exPopoverReactive-i-button-bg"
				  						                       triggers="click"
				  						                       placement="left">
									                    <sketch-picker v-model="i_button_bg.color" />
				  						            </b-popover>
				  						        </b-input-group-prepend>
				  						        <b-form-input v-model="i_button_bg.color.hex"></b-form-input>
				  						    </b-input-group>
				  						</div>
				  						<div role="group" class="mt-3">
				  						  <label>Цвет текста</label>
				  						    <b-input-group>
				  						    <b-input-group-prepend>
				  						        <b-btn variant="primary" id="exPopoverReactive-i-button-color">Выбрать цвет</b-btn>
				  						        <b-popover target="exPopoverReactive-i-button-color"
				  						                   triggers="click"
				  						                   placement="left">
										            <sketch-picker v-model="i_button_color" />
				  						        </b-popover>
				  						      </b-input-group-prepend>
				  						      <b-form-input v-model="i_button_color.hex"></b-form-input>
				  						  </b-input-group>
				  						</div>
									</b-tab>
									<b-tab title="Текст" class="pt-4 pb-2">
										<div role="group" class="mb-4">
											<label>Размер текста</label>
											<b-input-group append="px">
										    	<b-form-input type="number" v-model="i_button_fz"></b-form-input>
											</b-input-group>
										</div>
										<div role="group">
											<label>Начертание шрифта</label>
											<b-button-group class="d-flex">
											    <b-button style="width: 50%" 
											    		  @click="i_button_weight = 'normal'"
											    		  variant="outline-secondary"
											    		  :class="i_button_weight == 'normal' ? 'active' : ''">
											    	Нормальный
												</b-button>
											    <b-button style="width: 50%"
											    		  @click="i_button_weight = 'bold'"
											    		  variant="outline-secondary"
											    		  :class="i_button_weight == 'bold' ? 'active' : ''">
											    	Жирный
												</b-button>
											</b-button-group>
										</div>
									</b-tab>
									<b-tab title="Рамки" class="pt-4 pb-2">
	  									<div role="group" class="mb-4">
			  			    	    		<b-form-checkbox id="checkbox-i-button-border" :class="i_button_border.show == true ? 'mb-3' : ''"
			  			    	    		                 v-model="i_button_border.show" @change="setBorder($event, 'i_button_border', '.qlead-button')">
			  			    		      		Стилизовать границы
			  				    		    </b-form-checkbox>
	  										<template v-if="i_button_border.show == true">
	  											<div role="group" class="mb-4">
	  												<label>Размер границы</label>
	  												<b-input-group append="px">
	  											    	<b-form-input type="number" v-model="i_button_border.size" @change="setBorder(true, 'i_button_border', '.qlead-button')"></b-form-input>
	  												</b-input-group>
	  											</div>
	  											<div role="group">
	  												<label>Стиль рамки</label>
	  												<b-button-group class="d-flex mb-4">
	  												    <b-button style="width: 33.33%" 
	  												    		  @click="i_button_border.type = 'solid'; setBorder(true, 'i_button_border', '.qlead-button')"
	  												    		  variant="outline-secondary"
	  												    		  :class="i_button_border.type == 'solid' ? 'active' : ''">
	  												    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
	  													</b-button>
	  												    <b-button style="width: 33.33%"
	  												    		  @click="i_button_border.type = 'dashed'; setBorder(true, 'i_button_border', '.qlead-button')"
	  												    		  variant="outline-secondary"
	  												    		  :class="i_button_border.type == 'dashed' ? 'active' : ''">
	  												    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
	  													</b-button>
	  												    <b-button style="width: 33.34%"
	  												    		  @click="i_button_border.type = 'dotted'; setBorder(true, 'i_button_border', '.qlead-button')"
	  												    		  variant="outline-secondary"
	  												    		  :class="i_button_border.type == 'dotted' ? 'active' : ''">
	  												    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
	  													</b-button>
	  												</b-button-group>
	  											</div>
	  											<div role="group" class="mb-4">
	  												<label>Цвет рамки</label>
	  										    	<b-input-group class="mb-4">
	  										    		<b-input-group-prepend>
	  										    		    <b-btn variant="primary" id="exPopoverReactive-i-button-border">Выбрать цвет</b-btn>
	  										    		    <b-popover target="exPopoverReactive-i-button-border"
	  										    		               triggers="click"
	  										    		               placement="left">
	  									    		    		<sketch-picker v-model="i_button_border.color" @input="setBorder(true, 'i_button_border', '.qlead-button')" />
	  										    		    </b-popover>
	  									    		    </b-input-group-prepend>
	  										    	    <b-form-input v-model="i_button_border.color.hex" @input="setBorder(true, 'i_button_border', '.qlead-button')"></b-form-input>
	  										    	</b-input-group>
	  											</div>
	  										</template>
	  									</div>
			    						<div role="group">
			    							<label>Скругление краёв</label>
											<b-input-group append="px">
										    	<b-form-input type="number" v-model="i_button_border.radius"></b-form-input>
											</b-input-group>
			    						</div>
									</b-tab>
									<b-tab title="Тени" class="pt-4 pb-2">
			      						<div role="group">
							    			<b-form-checkbox id="checkbox-i-button-shadow" :class="i_button_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
								    		                 v-model="i_button_shadow.show" @change="setShadow($event, 'i_button_shadow', '.qlead-button')">
									      		Включить тени
							    		    </b-form-checkbox>
							    		    <template v-if="i_button_shadow.show == true">
												<label>Тени (сдвиг по x)</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="i_button_shadow.x" @change="setShadow(true, 'i_button_shadow', '.qlead-button')"></b-form-input>
												</b-input-group>
												<label>Тени (сдвиг по y)</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="i_button_shadow.y" @change="setShadow(true, 'i_button_shadow', '.qlead-button')"></b-form-input>
												</b-input-group>
												<label>Радиус размытия теней</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="i_button_shadow.blur" @change="setShadow(true, 'i_button_shadow', '.qlead-button')"></b-form-input>
												</b-input-group>
												<label>Цвет тени</label>
										    	<b-input-group class="mb-4">
										    		<b-input-group-prepend>
										    		    <b-btn variant="primary" id="exPopoverReactive-i-button-shadow">Выбрать цвет</b-btn>
										    		    <b-popover target="exPopoverReactive-i-button-shadow"
										    		               triggers="click"
										    		               placement="left">
									    		    		<sketch-picker v-model="i_button_shadow.color" @input="setShadow(true, 'i_button_shadow', '.qlead-button')" />
										    		    </b-popover>
									    		    </b-input-group-prepend>
										    	    <b-form-input v-model="i_button_shadow.color.hex" @input="setShadow(true, 'i_button_shadow', '.qlead-button')"></b-form-input>
										    	</b-input-group>
										    	<label>Прозрачность фона</label>
												<div class="d-flex">
												  <div style="width: 60%">
												    <range-slider
												        class="slider_range"
												        min="0"
												        max="100"
												        v-model="i_button_shadow.opacity" @input="setShadow(true, 'i_button_shadow', '.qlead-button')">
												    </range-slider>
												  </div>
												  <p class="ml-3 range_count" style="width: 40%">{{ i_button_shadow.opacity }}%</p>
												</div>
											</template>
										</div>
									</b-tab>
								</b-tabs>
							</b-tab>
							<b-tab title="Своя" class="pt-4 pb-2">
								<p>Добавьте к вашей кнопки этот класс:</p>
								<b-input-group>
								    <b-form-input :value="yourButton" readonly size="lg"></b-form-input>
								</b-input-group>
							</b-tab>
						</b-tabs>
					</slot>
				</section>
			</div>
		</template>
	</div>
</template>

<script>
	import { Sketch } from 'vue-color';
	import RangeSlider from 'vue-range-slider';
	import 'vue-range-slider/dist/vue-range-slider.css';
	import ClipLoader from 'vue-spinner/src/ClipLoader.vue';

	export default {
		components: { 'sketch-picker': Sketch, RangeSlider, ClipLoader },
		data() {
			return {
				q_spinner: true,
				i_button_width: 240,
				i_button_height: 60,
				i_button_bg: {
					color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            }
				},
				i_button_color: {
					"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
					"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
					"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
					"oldHue": 0, 
					"source": "hex", "a": 1
				},
				i_button_border: {
		        	show: false,
		        	size: 0,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
				},
				i_button_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 0,
				},
				i_button_fz: 20,
				i_button_weight: 'normal',
				yourButton: 'class="qlead-open-modal"',

				showPopover: false,
				idForUrl: this.$router.history.current.params.id,
				allFonts: [],
				selectedFont: '',

				ready_code: `<!-- Qlead script start -->\

<script src='https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/qlead.min.js?alt=media&token=b99469e8-593e-4286-ad55-db94c2f42cc5'>\
</\script>\

<script>\

	document.addEventListener('DOMContentLoaded', function() {\

		var qlead = new Qlead;\

		qlead.init({ \

			id: '${this.$router.history.current.params.id}', \

			autoOpen: false, \

			exitOpen: false, \

			exitOpenOnce: true, \

			modal: 'full' \

		});\

		document.querySelector('.qlead-modal-close').addEventListener("click", qlead.closeQuiz); \

		document.querySelector('.qlead-open-modal').addEventListener("click", qlead.openQuiz); \

	});\

</\script>\

<!-- Qlead script end -->`,

				autoOpenCh: false,
				autoOpen: false,
				exitOpen: false,
				exitOpenOnce: false,
				modal: 'full',
				modalOptions: [
					{ value: 'full', text: 'На весь экран' },
					{ value: 'modal', text: 'В модальном окне' }
				],

				// Others

				questions: '',
				config: '',
				galleryElements: '',
				youtubePlayer: '',
				videoElements: '',
				localVideo: '',
				consultantName: '',
				consultantDescription: '',
				consultantImg: null,
				consultantImgSrc: '',
				moreConsultantText: '',
				consultantElements: '',
				addBlockElements: '',
				v_range: '',
				infoHeight: '',
				sliderAllCount: '',
				sliderActive: '',
				sliderOffsetLeft: '',
				sliderOffsetStep: '',
				animation: '',
				loaderCheck: '',
				resultTitleQ: '',
				resultDescQ: '',
				resultAddGifts: '',
				addGiftsList: '',
				btnText: '',
				politicsUrl: '',
				inputs: '',
				phoneMask: '',
				selectMask: '',
				readyMask: '',
				userInputPhone: '',
				messengerLink: '',
				messengerBtnText: '',
				messengersTitle: '',
				lastVideoElements: '',
				lastConsultantElements: '',
				customEmails: [],
				readyEmail: [],
				metrika: '',
				analytics: '',
				linkLocation: {
					show: false,
					url: ''
				},

				// Styles

		        colors: {
				  	hex: '#194d33',
				  	hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
				  	hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
				  	rgba: { r: 25, g: 77, b: 51, a: 1 },
				  	a: 1
				},
				font_color: {
					"hsl": { "h": 150, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 150, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 150, 
					"source": "hex", "a": 1
				},
				bg_image: '',
				bg_position: 'center',
				bg_position_select: [
		            { value: 'center', text: 'По центру' },
		            { value: 'top', text: 'По центру вверху' },
		            { value: 'bottom', text: 'По центру внизу' },
		            { value: 'left', text: 'По левому краю и по центру' },
		            { value: 'right', text: 'По правому краю и по центру' }
		        ],
		        bg_overlay: {
		        	color: { 
		        		"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		        		"hex": "#000000", "hex8": "#000000FF", 
		        		"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		        		"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		        		"oldHue": 0, 
		        		"source": "hsva", "a": 1 
		        	},
		        	opacity: 1,
		        },
		        head_horizontal_align: 'center',
		        head_horizontal_align_select: [
		        	{ value: 'flex-start', text: 'По левому краю' },
		        	{ value: 'center', text: 'По центру' },
		            { value: 'flex-end', text: 'По правому краю' }
		        ],
		        head_logo: {
		        	name: 'quiz-logo.png'
		        },
		        head_desc: 'Тест для подбора проектов деревянного дома',
		        head_desc_show: false,
		        head_desc_weight: 'normal',
		        head_desc_font_size: 14,
		        progress_height: 30,
		        progress_font_size: 16,
		        progress_bg: {
		        	color: {
		        		"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		        		"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		        		"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		        		"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		        		"oldHue": 150, "source": "hex", "a": 1 
		        	},
		        	opacity: 100
		        },
		        progress_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
		        },
		        progress_margin_top: 30,
		        progress_margin_bottom: 60,
		        progress_shadow: {
		        	show: false,
		        	x: 0,
		        	y: 0,
		        	blur: 0,
		        	color: { 
		        		"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		        		"hex": "#000000", "hex8": "#000000FF", 
		        		"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		        		"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		        		"oldHue": 0, 
		        		"source": "hsva", "a": 1 
		        	},
		        	opacity: 50
		        },
		        progressbar_color_text: { 
		        	"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		        	"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		        	"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		        	"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		        	"oldHue": 0, 
		        	"source": "hex", "a": 1 
		    	},
		    	progressbar_bg: { 
		    		"hsl": { "h": 352.71844660194176, "s": 0.980952380952381, "l": 0.4117647058823529, "a": 1 },
		    		"hex": "#D0021B", "hex8": "#D0021BFF", 
		    		"rgba": { "r": 208, "g": 2, "b": 27, "a": 1 }, 
		    		"hsv": { "h": 352.71844660194176, "s": 0.9903846153846154, "v": 0.8156862745098039, "a": 1 }, 
		    		"oldHue": 352.71844660194176, 
		    		"source": "hex", "a": 1 
		    	},
		    	progressbar_radius: 0,
		    	progressbar_shadow: {
		    		show: false,
		    		x: 0,
		    		y: 0,
		    		blur: 0,
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 50
		    	},
		    	question_bg: {
		    		color: {
		    			"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		    			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		    			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hex", "a": 1
		    		},
		    		opacity: 0
		    	},
		    	question_border: {
			      	show: false,
			      	size: 3,
			      	type: 'solid',
			      	color: { 
			        	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
			        	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
			        	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
			        	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
			        	"oldHue": 150, "source": "hex", "a": 1 
			        },
			        radius: 0
		    	},
		    	question_padd_vert: 0,
		    	question_padd_horz: 60,
		    	question_radius: 0,
		    	question_shadow: {
		    		show: false,
		    		x: 0,
		    		y: 0,
		    		blur: 0,
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 50
		    	},
		    	question_index_width: 35,
		    	question_index_height: 35,
		    	question_index_bg: {
		    		color: {
		    			"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		    			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		    			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hex", "a": 1
		    		},
		    		opacity: 1
		    	},
		    	question_index_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
		    	},
		    	question_index_fz: 16,
		    	question_index_weight: 'normal',
		    	question_index_shadow: {
		    		show: false,
		    		x: 0,
		    		y: 0,
		    		blur: 0,
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 50
		    	},
		    	question_index_top: 0,
		    	question_index_left: 0,
		    	question_title_fz: 24,
		    	question_title_weight: 'bold',
		    	radio_width_and_height: 26,
		    	radio_bg: {
		    		color: {
		    			"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		    			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		    			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hex", "a": 1
		    		},
		    		opacity: 100
		    	},
		    	radio_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
		    	},
		    	radio_shadow: {
		    		show: false,
		    		x: 0,
		    		y: 0,
		    		blur: 0,
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 50
		    	},
		    	radio_before_bg: {
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 30
		    	},
		    	radio_before_shadow: {
		    		show: false,
		    		x: 0,
		    		y: 0,
		    		blur: 0,
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 50
		    	},
		    	radio_hover_bg: {
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 30
		    	},
		    	radio_hover_shadow: {
		    		show: false,
		    		x: 0,
		    		y: 0,
		    		blur: 0,
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 50
		    	},
		    	radio_active_bg: {
		    		color: { 
		    			"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
		    			"hex": "#000000", "hex8": "#000000FF", 
		    			"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hsva", "a": 1 
		    		},
		    		opacity: 100
		    	},
		    	radio_active_image: false,
		    	input_bg: {
		    		color: {
		    			"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		    			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		    			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hex", "a": 1
		    		},
		    		opacity: 100
		    	},
			    input_color_text: { 
			    	"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0, 
					"source": "hsva", "a": 1 
				},
				input_weight: 'normal',
				input_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
				},
				input_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				button_bg: {
					color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
					opacity: 100
				},
				button_color_text: {
					"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
					"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
					"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
					"oldHue": 0, 
					"source": "hex", "a": 1
				},
				button_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
				},
				button_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				checkbox_bg: {
					color: {
						"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
						"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
						"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
						"oldHue": 0, 
						"source": "hex", "a": 1
					},
					opacity: 100
				},
				checkbox_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
				},
				checkbox_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				checkbox_before_bg: {
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 100
				},
				checkbox_before_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				checkbox_hover_bg: {
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 30
				},
				checkbox_hover_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				checkbox_active_bg: {
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 100
				},
				checkbox_active_image: false,
				calendar_bg: {
					color: {
						"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
						"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
						"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
						"oldHue": 0, 
						"source": "hex", "a": 1
					},
					opacity: 100
				},
				calendar_color: {
					"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0, 
					"source": "hsva", "a": 1
				},
				calendar_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
				},
				calendar_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				calendar_hover_bg: {
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 45
				},
				calendar_hover_color: {
					"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
					"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
					"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
					"oldHue": 0, 
					"source": "hex", "a": 1
				},
				calendar_active_bg: {
					color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
					opacity: 100
				},
				calendar_active_color: {
					"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
					"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
					"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
					"oldHue": 0, 
					"source": "hex", "a": 1
				},
				range_bg: { 
		        	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		        	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		        	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		        	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		        	"oldHue": 150, "source": "hex", "a": 1
				},
				range_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				range_thumb: {
					"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
					"hex": "#4A90E2", "hex8": "#4A90E2FF", 
					"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
					"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
					"oldHue": 150, "source": "hex", "a": 1 
				},
				result_bg: {
					color: {
						"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
						"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
						"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
						"oldHue": 0, 
						"source": "hex", "a": 1
					},
					opacity: 100
				},
				result_color: {
					"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0, 
					"source": "hsva", "a": 1 
				},
				result_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            left: 0,
		            right: 0
				},
				result_fz: 16,
				result_padding: 15,
				result_align: 'center',
				result_align_select: [
					{ value: 'left', text: 'По левому краю' },
					{ value: 'center', text: 'По центру' },
				    { value: 'right', text: 'По правому краю' }
				],
				result_display: false,
				result_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				info_bg: {
					color: {
						"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
						"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
						"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
						"oldHue": 0, 
						"source": "hex", "a": 1
					},
					opacity: 100
				},
				info_color: {
					"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0, 
					"source": "hsva", "a": 1 
				},
				info_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            top: 0,
		            bottom: 0
				},
				info_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				info_padding_left: 15,
				arrows_bg: {
					color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
					opacity: 100
				},
				arrows_color: {
					"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
					"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
					"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
					"oldHue": 0, 
					"source": "hex", "a": 1
				},
				arrows_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
				},
				arrows_fz: 24,
				arrows_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				arrows_left: 0,
				arrows_right: 0,
				arrows_top: 226,
				tooltip_image_border: {
		        	show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
				},
				tooltip_image_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				tooltip_image_align: 'row',
				tooltip_image_align_select: [
					{ value: 'column', text: 'Над текстом' },
					{ value: 'row', text: 'Слева' },
				],
				tooltip_title_bg: {
					color: {
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
					opacity: 100
				},
				tooltip_title_color: {
					"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
					"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
					"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
					"oldHue": 0, 
					"source": "hex", "a": 1
				},
				tooltip_title_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				tooltip_title_radius: 0,
				tooltip_text_bg: {
					color: {
		            	"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		    			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		    			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hex", "a": 1
		            },
					opacity: 90
				},
				tooltip_text_color: {
					"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0, 
					"source": "hsva", "a": 1 
				},
				tooltip_text_radius: 0,
				tooltip_text_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				qtip_top: 150,
				qtip_left: 80,
				gift_bg: {
					color: {
		            	"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		    			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		    			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hex", "a": 1
		            },
					opacity: 90
				},
				gift_color: {
					"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0, 
					"source": "hsva", "a": 1 
				},
				gift_border: {
					show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0
				},
				gift_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				video_text_weight: 'normal',
				video_text_fz: 16,
				video_image: '',
				video_image_display: false,
				video_text_text: 'Смотрите поясняющее видео к вопросу',
				consultant_bg: {
					color: {
		            	"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		    			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		    			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hex", "a": 1
		            },
					opacity: 100
				},
				consultant_color: {
					"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0, 
					"source": "hsva", "a": 1 
				},
				consultant_border: {
					show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0       			
				},
				consultant_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				consultant_padding: 20,
				consultant_top_padding: 20,
				consultant_top_name_fz: 20,
				consultant_top_position_fz: 14,
				consultant_image_border: {
					show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            }
				},
				consultant_image_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				consultant_words_bg: {
					color: {
		            	"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
		    			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
		    			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
		    			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
		    			"oldHue": 0, 
		    			"source": "hex", "a": 1
		            },
					opacity: 100
				},
				consultant_words_border: {
					show: false,
		        	size: 3,
		        	type: 'solid',
		        	color: { 
		            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
		            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
		            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
		            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
		            	"oldHue": 150, "source": "hex", "a": 1 
		            },
		            radius: 0 
				},
				consultant_words_shadow: {
					show: false,
					x: 0,
					y: 0,
					blur: 0,
					color: { 
						"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
						"hex": "#000000", "hex8": "#000000FF", 
						"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
						"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
						"oldHue": 0, 
						"source": "hsva", "a": 1 
					},
					opacity: 50
				},
				consultant_words_color: {
					"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0,
					"source": "hsva", "a": 1 
				},
                m_button_bg: {
                	color: {
                		"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
                		"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
                		"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
                		"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
                		"oldHue": 0, 
                		"source": "hex", "a": 1
                	},
                	opacity: 100
                },
                m_button_color: {
                	"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
                	"hex": "#000000", "hex8": "#000000FF", 
                	"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
                	"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
                	"oldHue": 0, 
                	"source": "hsva", "a": 1 
                },
                m_button_padding: 15,
                m_button_border: {
                	show: false,
                	size: 3,
                	type: 'solid',
                	color: { 
	                	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
	                	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
	                	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
	                	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
	                	"oldHue": 150, "source": "hex", "a": 1 
	                },
	                radius: 0
                },
                m_button_shadow: {
                	show: false,
                	x: 0,
                	y: 0,
                	blur: 0,
                	color: { 
                		"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
                		"hex": "#000000", "hex8": "#000000FF", 
                		"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
                		"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
                		"oldHue": 0, 
                		"source": "hsva", "a": 1 
                	},
                	opacity: 50
                },
                m_block_bg: {
                	color: {
                		"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
                		"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
                		"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
                		"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
                		"oldHue": 0, 
                		"source": "hex", "a": 1
                	},
                	opacity: 100
                },
                m_block_color: {
                	"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
                	"hex": "#000000", "hex8": "#000000FF", 
                	"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
                	"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
                	"oldHue": 0, 
                	"source": "hsva", "a": 1 
                },
                m_block_border: {
                	show: false,
                	size: 3,
                	type: 'solid',
                	color: { 
	                	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
	                	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
	                	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
	                	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
	                	"oldHue": 150, "source": "hex", "a": 1 
	                },
	                radius: 0
                },
                m_block_shadow: {
                	show: false,
                	x: 0,
                	y: 0,
                	blur: 0,
                	color: { 
                		"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
                		"hex": "#000000", "hex8": "#000000FF", 
                		"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
                		"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
                		"oldHue": 0, 
                		"source": "hsva", "a": 1 
                	},
                	opacity: 50	
                },
                m_block_hover: {
                	color: { 
                		"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
                		"hex": "#000000", "hex8": "#000000FF", 
                		"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
                		"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
                		"oldHue": 0, 
                		"source": "hsva", "a": 1 
                	},
                	opacity: 30
                },
				question_block_color_text: {
                	"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
                	"hex": "#000000", "hex8": "#000000FF", 
                	"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
                	"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
                	"oldHue": 0, 
                	"source": "hsva", "a": 1 
                },
                link_color_text: { 
	            	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
	            	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
	            	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
	            	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
	            	"oldHue": 150, "source": "hex", "a": 1 
	            },
			}
		},
		mounted() {
			let idQuiz = this.$router.history.current.params.id,
				localQuiz = 'quiz_' + idQuiz,
				urlQuiz = 'https://myquiz-9b908.firebaseio.com/quizzes/' + idQuiz +'.json';

			this.$http.get(urlQuiz).then((response) => {

				this.quiz_name = response.body.name;

				if(JSON.parse(localStorage.getItem(localQuiz) == null)) {
					const getData = JSON.parse(response.body.questions);
					const getStyle = JSON.parse(response.body.styles);

					this.metrika = getData.metrika;
					this.analytics = getData.analytics;
					this.questions = getData.questions;
					this.config = getData.config;
					this.galleryElements = getData.galleryElements;
					this.youtubePlayer = getData.youtubePlayer;
					this.videoElements = getData.videoElements;
					this.localVideo = getData.localVideo;
					this.consultantName = getData.consultantName;
					this.consultantDescription = getData.consultantDescription;
					this.consultantImg = getData.consultantImg;
					this.consultantImgSrc = getData.consultantImgSrc;
					this.moreConsultantText = getData.moreConsultantText;
					this.consultantElements = getData.consultantElements;
					this.addBlockElements = getData.addBlockElements;
					this.v_range = getData.v_range;
					this.infoHeight = getData.infoHeight;
					this.sliderAllCount = getData.sliderAllCount;
					this.sliderActive = getData.sliderActive;
					this.sliderOffsetLeft = getData.sliderOffsetLeft;
					this.sliderOffsetStep = getData.sliderOffsetStep;
					this.animation = getData.animation;
					this.loaderCheck = getData.loaderCheck;
					this.resultTitleQ = getData.resultTitleQ;
					this.resultDescQ = getData.resultDescQ;
					this.resultAddGifts = getData.resultAddGifts;
					this.addGiftsList = getData.addGiftsList;
					this.btnText = getData.btnText;
					this.politicsUrl = getData.politicsUrl;
					this.inputs = getData.inputs;
					this.phoneMask = getData.phoneMask;
					this.selectMask = getData.selectMask;
					this.readyMask = getData.readyMask;
					this.userInputPhone = getData.userInputPhone;
					this.messengerLink = getData.messengerLink;
					this.messengerBtnText = getData.messengerBtnText;
					this.messengersTitle = getData.messengersTitle;
					this.lastVideoElements = getData.lastVideoElements;
					this.lastConsultantElements = getData.lastConsultantElements;
					this.customEmails = getData.customEmails;
					this.readyEmail = getData.readyEmail;
					this.autoOpenCh = getData.autoOpenCh;
					this.autoOpen = getData.autoOpen;
					this.exitOpen = getData.exitOpen;
					this.exitOpenOnce = getData.exitOpenOnce;
					this.modal = getData.modal;
					this.linkLocation = getData.linkLocation;

					this.colors = getStyle.colors;
					this.font_color = getStyle.font_color;
					this.bg_image_raw = getStyle.bg_image_raw;
					this.bg_image = getStyle.bg_image;
					this.bg_image_src = getStyle.bg_image_src;
					this.bg_position = getStyle.bg_position;
					this.bg_position_select = getStyle.bg_position_select;
					this.bg_overlay = getStyle.bg_overlay;
					this.head_horizontal_align = getStyle.head_horizontal_align;
					this.head_horizontal_align_select = getStyle.head_horizontal_align_select;
					this.head_logo = getStyle.head_logo;
					this.head_logo_src = getStyle.head_logo_src;
					this.head_desc = getStyle.head_desc;
					this.head_desc_show = getStyle.head_desc_show;
					this.head_desc_weight = getStyle.head_desc_weight;
					this.head_desc_font_size = getStyle.head_desc_font_size;
					this.progress_height = getStyle.progress_height;
					this.progress_font_size = getStyle.progress_font_size;
					this.progress_bg = getStyle.progress_bg;
					this.progress_border = getStyle.progress_border;
					this.progress_margin_top = getStyle.progress_margin_top;
					this.progress_margin_bottom = getStyle.progress_margin_bottom;
					this.progress_shadow = getStyle.progress_shadow;
					this.progressbar_color_text = getStyle.progressbar_color_text;
					this.progressbar_bg = getStyle.progressbar_bg;
					this.progressbar_radius = getStyle.progressbar_radius;
					this.progressbar_shadow = getStyle.progressbar_shadow;
					this.question_bg = getStyle.question_bg;
					this.question_border = getStyle.question_border;
					this.question_padd_vert = getStyle.question_padd_vert;
					this.question_padd_horz = getStyle.question_padd_horz;
					this.question_radius = getStyle.question_radius;
					this.question_shadow = getStyle.question_shadow;
					this.question_index_width = getStyle.question_index_width;
					this.question_index_height = getStyle.question_index_height;
					this.question_index_bg = getStyle.question_index_bg;
					this.question_index_border = getStyle.question_index_border;
					this.question_index_fz = getStyle.question_index_fz;
					this.question_index_weight = getStyle.question_index_weight;
					this.question_index_shadow = getStyle.question_index_shadow;
					this.question_index_top = getStyle.question_index_top;
					this.question_index_left = getStyle.question_index_left;
					this.question_title_fz = getStyle.question_title_fz;
					this.question_title_weight = getStyle.question_title_weight;
					this.radio_width_and_height = getStyle.radio_width_and_height;
					this.radio_bg = getStyle.radio_bg;
					this.radio_border = getStyle.radio_border;
					this.radio_shadow = getStyle.radio_shadow;
					this.radio_before_bg = getStyle.radio_before_bg;
					this.radio_before_shadow = getStyle.radio_before_shadow;
					this.radio_hover_bg = getStyle.radio_hover_bg;
					this.radio_hover_shadow = getStyle.radio_hover_shadow;
					this.radio_active_bg = getStyle.radio_active_bg;
					this.radio_active_image = getStyle.radio_active_image;
					this.input_bg = getStyle.input_bg;
					this.input_color_text = getStyle.input_color_text;
					this.input_weight = getStyle.input_weight;
					this.input_border = getStyle.input_border;
					this.input_shadow = getStyle.input_shadow;
					this.button_bg = getStyle.button_bg;
					this.button_color_text = getStyle.button_color_text;
					this.button_border = getStyle.button_border;
					this.button_shadow = getStyle.button_shadow;
					this.checkbox_bg = getStyle.checkbox_bg;
					this.checkbox_border = getStyle.checkbox_border;
					this.checkbox_shadow = getStyle.checkbox_shadow;
					this.checkbox_before_bg = getStyle.checkbox_before_bg;
					this.checkbox_before_shadow = getStyle.checkbox_before_shadow;
					this.checkbox_hover_bg = getStyle.checkbox_hover_bg;
					this.checkbox_hover_shadow = getStyle.checkbox_hover_shadow;
					this.checkbox_active_bg = getStyle.checkbox_active_bg;
					this.checkbox_active_image = getStyle.checkbox_active_image;
					this.calendar_bg = getStyle.calendar_bg;
					this.calendar_color = getStyle.calendar_color;
					this.calendar_border = getStyle.calendar_border;
					this.calendar_shadow = getStyle.calendar_shadow;
					this.calendar_hover_bg = getStyle.calendar_hover_bg;
					this.calendar_hover_color = getStyle.calendar_hover_color;
					this.calendar_active_bg = getStyle.calendar_active_bg;
					this.calendar_active_color = getStyle.calendar_active_color;
					this.range_bg = getStyle.range_bg;
					this.range_shadow = getStyle.range_shadow;
					this.range_thumb = getStyle.range_thumb;
					this.result_bg = getStyle.result_bg;
					this.result_color = getStyle.result_color;
					this.result_border = getStyle.result_border;
					this.result_fz = getStyle.result_fz;
					this.result_padding = getStyle.result_padding;
					this.result_align = getStyle.result_align;
					this.result_align_select = getStyle.result_align_select;
					this.result_display = getStyle.result_display;
					this.result_shadow = getStyle.result_shadow;
					this.info_bg = getStyle.info_bg;
					this.info_color = getStyle.info_color;
					this.info_border = getStyle.info_border;
					this.info_shadow = getStyle.info_shadow;
					this.info_padding_left = getStyle.info_padding_left;
					this.arrows_bg = getStyle.arrows_bg;
					this.arrows_color = getStyle.arrows_color;
					this.arrows_border = getStyle.arrows_border;
					this.arrows_fz = getStyle.arrows_fz;
					this.arrows_shadow = getStyle.arrows_shadow;
					this.arrows_left = getStyle.arrows_left;
					this.arrows_right = getStyle.arrows_right;
					this.arrows_top = getStyle.arrows_top;
					this.tooltip_image_border = getStyle.tooltip_image_border;
					this.tooltip_image_shadow = getStyle.tooltip_image_shadow;
					this.tooltip_image_align = getStyle.tooltip_image_align;
					this.tooltip_image_align_select = getStyle.tooltip_image_align_select;
					this.tooltip_title_bg = getStyle.tooltip_title_bg;
					this.tooltip_title_color = getStyle.tooltip_title_color;
					this.tooltip_title_shadow = getStyle.tooltip_title_shadow;
					this.tooltip_title_radius = getStyle.tooltip_title_radius;
					this.tooltip_text_bg = getStyle.tooltip_text_bg;
					this.tooltip_text_color = getStyle.tooltip_text_color;
					this.tooltip_text_radius = getStyle.tooltip_text_radius;
					this.tooltip_text_shadow = getStyle.tooltip_text_shadow;
					this.qtip_top = getStyle.qtip_top;
					this.qtip_left = getStyle.qtip_left;
					this.gift_bg = getStyle.gift_bg;
					this.gift_color = getStyle.gift_color;
					this.gift_border = getStyle.gift_border;
					this.gift_shadow = getStyle.gift_shadow;
					this.video_text_weight = getStyle.video_text_weight;
					this.video_text_fz = getStyle.video_text_fz;
					this.video_image = getStyle.video_image;
					this.video_image_display = getStyle.video_image_display;
					this.video_text_text = getStyle.video_text_text;
					this.consultant_bg = getStyle.consultant_bg;
					this.consultant_color = getStyle.consultant_color;
					this.consultant_border = getStyle.consultant_border;
					this.consultant_shadow = getStyle.consultant_shadow;
					this.consultant_padding = getStyle.consultant_padding;
					this.consultant_top_padding = getStyle.consultant_top_padding;
					this.consultant_top_name_fz = getStyle.consultant_top_name_fz;
					this.consultant_top_position_fz = getStyle.consultant_top_position_fz;
					this.consultant_image_border = getStyle.consultant_image_border;
					this.consultant_image_shadow = getStyle.consultant_image_shadow;
					this.consultant_words_bg = getStyle.consultant_words_bg;
					this.consultant_words_border = getStyle.consultant_words_border;
					this.consultant_words_shadow = getStyle.consultant_words_shadow;
					this.consultant_words_color = getStyle.consultant_words_color;
					this.m_button_bg = getStyle.m_button_bg;
					this.m_button_color = getStyle.m_button_color;
					this.m_button_padding = getStyle.m_button_padding;
					this.m_button_border = getStyle.m_button_border;
					this.m_button_shadow = getStyle.m_button_shadow;
					this.m_block_bg = getStyle.m_block_bg;
					this.m_block_color = getStyle.m_block_color;
					this.m_block_border = getStyle.m_block_border;
					this.m_block_shadow = getStyle.m_block_shadow;
					this.m_block_hover = getStyle.m_block_hover;
					this.allFonts = getStyle.allFonts;
					this.selectedFont = getStyle.selectedFont;
					this.send_button_bg = getStyle.send_button_bg;
					this.send_button_color_text = getStyle.send_button_color_text;
					this.send_button_border = getStyle.send_button_border;
					this.send_button_shadow = getStyle.send_button_shadow;
					this.send_input_bg = getStyle.send_input_bg;
					this.send_input_color_text = getStyle.send_input_color_text;
					this.send_input_border = getStyle.send_input_border;
					this.send_input_shadow = getStyle.send_input_shadow;
					this.i_button_width = getStyle.i_button_width;
					this.i_button_height = getStyle.i_button_height;
					this.i_button_bg = getStyle.i_button_bg;
					this.i_button_color = getStyle.i_button_color;
					this.i_button_border = getStyle.i_button_border;
					this.i_button_shadow = getStyle.i_button_shadow;
					this.i_button_fz = getStyle.i_button_fz;
					this.i_button_weight = getStyle.i_button_weight;
					this.question_block_color_text = getStyle.question_block_color_text;
					this.link_color_text = getStyle.link_color_text;
				} else {
					let idQuiz = this.$router.history.current.params.id,
						itemQuiz = 'quiz_' + idQuiz,
						styleQuiz = 'style_' + idQuiz;
					const getData = JSON.parse(localStorage.getItem(itemQuiz));
					const getStyle = JSON.parse(localStorage.getItem(styleQuiz));
					
					this.metrika = getData[0].metrika;
					this.analytics = getData[0].analytics;
					this.questions = getData[0].questions;
					this.config = getData[0].config;
					this.galleryElements = getData[0].galleryElements;
					this.youtubePlayer = getData[0].youtubePlayer;
					this.videoElements = getData[0].videoElements;
					this.localVideo = getData[0].localVideo;
					this.consultantName = getData[0].consultantName;
					this.consultantDescription = getData[0].consultantDescription;
					this.consultantImg = getData[0].consultantImg;
					this.consultantImgSrc = getData[0].consultantImgSrc;
					this.moreConsultantText = getData[0].moreConsultantText;
					this.consultantElements = getData[0].consultantElements;
					this.addBlockElements = getData[0].addBlockElements;
					this.v_range = getData[0].v_range;
					this.infoHeight = getData[0].infoHeight;
					this.sliderAllCount = getData[0].sliderAllCount;
					this.sliderActive = getData[0].sliderActive;
					this.sliderOffsetLeft = getData[0].sliderOffsetLeft;
					this.sliderOffsetStep = getData[0].sliderOffsetStep;
					this.animation = getData[0].animation;
					this.loaderCheck = getData[0].loaderCheck;
					this.resultTitleQ = getData[0].resultTitleQ;
					this.resultDescQ = getData[0].resultDescQ;
					this.resultAddGifts = getData[0].resultAddGifts;
					this.addGiftsList = getData[0].addGiftsList;
					this.btnText = getData[0].btnText;
					this.politicsUrl = getData[0].politicsUrl;
					this.inputs = getData[0].inputs;
					this.phoneMask = getData[0].phoneMask;
					this.selectMask = getData[0].selectMask;
					this.readyMask = getData[0].readyMask;
					this.userInputPhone = getData[0].userInputPhone;
					this.messengerLink = getData[0].messengerLink;
					this.messengerBtnText = getData[0].messengerBtnText;
					this.messengersTitle = getData[0].messengersTitle;
					this.lastVideoElements = getData[0].lastVideoElements;
					this.lastConsultantElements = getData[0].lastConsultantElements;
					this.customEmails = getData[0].customEmails;
					this.readyEmail = getData[0].readyEmail;
					this.autoOpenCh = getData[0].autoOpenCh;
					this.autoOpen = getData[0].autoOpen;
					this.exitOpen = getData[0].exitOpen;
					this.exitOpenOnce = getData[0].exitOpenOnce;
					this.modal = getData[0].modal;
					this.linkLocation = getData[0].linkLocation;

					this.link_color_text = getStyle[0].link_color_text;
					this.colors = getStyle[0].colors;
					this.font_color = getStyle[0].font_color;
					this.bg_image_raw = getStyle[0].bg_image_raw;
					this.bg_image = getStyle[0].bg_image;
					this.bg_image_src = getStyle[0].bg_image_src;
					this.bg_position = getStyle[0].bg_position;
					this.bg_position_select = getStyle[0].bg_position_select;
					this.bg_overlay = getStyle[0].bg_overlay;
					this.head_horizontal_align = getStyle[0].head_horizontal_align;
					this.head_horizontal_align_select = getStyle[0].head_horizontal_align_select;
					this.head_logo = getStyle[0].head_logo;
					this.head_logo_src = getStyle[0].head_logo_src;
					this.head_desc = getStyle[0].head_desc;
					this.head_desc_show = getStyle[0].head_desc_show;
					this.head_desc_weight = getStyle[0].head_desc_weight;
					this.head_desc_font_size = getStyle[0].head_desc_font_size;
					this.progress_height = getStyle[0].progress_height;
					this.progress_font_size = getStyle[0].progress_font_size;
					this.progress_bg = getStyle[0].progress_bg;
					this.progress_border = getStyle[0].progress_border;
					this.progress_margin_top = getStyle[0].progress_margin_top;
					this.progress_margin_bottom = getStyle[0].progress_margin_bottom;
					this.progress_shadow = getStyle[0].progress_shadow;
					this.progressbar_color_text = getStyle[0].progressbar_color_text;
					this.progressbar_bg = getStyle[0].progressbar_bg;
					this.progressbar_radius = getStyle[0].progressbar_radius;
					this.progressbar_shadow = getStyle[0].progressbar_shadow;
					this.question_bg = getStyle[0].question_bg;
					this.question_border = getStyle[0].question_border;
					this.question_padd_vert = getStyle[0].question_padd_vert;
					this.question_padd_horz = getStyle[0].question_padd_horz;
					this.question_radius = getStyle[0].question_radius;
					this.question_shadow = getStyle[0].question_shadow;
					this.question_index_width = getStyle[0].question_index_width;
					this.question_index_height = getStyle[0].question_index_height;
					this.question_index_bg = getStyle[0].question_index_bg;
					this.question_index_border = getStyle[0].question_index_border;
					this.question_index_fz = getStyle[0].question_index_fz;
					this.question_index_weight = getStyle[0].question_index_weight;
					this.question_index_shadow = getStyle[0].question_index_shadow;
					this.question_index_top = getStyle[0].question_index_top;
					this.question_index_left = getStyle[0].question_index_left;
					this.question_title_fz = getStyle[0].question_title_fz;
					this.question_title_weight = getStyle[0].question_title_weight;
					this.radio_width_and_height = getStyle[0].radio_width_and_height;
					this.radio_bg = getStyle[0].radio_bg;
					this.radio_border = getStyle[0].radio_border;
					this.radio_shadow = getStyle[0].radio_shadow;
					this.radio_before_bg = getStyle[0].radio_before_bg;
					this.radio_before_shadow = getStyle[0].radio_before_shadow;
					this.radio_hover_bg = getStyle[0].radio_hover_bg;
					this.radio_hover_shadow = getStyle[0].radio_hover_shadow;
					this.radio_active_bg = getStyle[0].radio_active_bg;
					this.radio_active_image = getStyle[0].radio_active_image;
					this.input_bg = getStyle[0].input_bg;
					this.input_color_text = getStyle[0].input_color_text;
					this.input_weight = getStyle[0].input_weight;
					this.input_border = getStyle[0].input_border;
					this.input_shadow = getStyle[0].input_shadow;
					this.button_bg = getStyle[0].button_bg;
					this.button_color_text = getStyle[0].button_color_text;
					this.button_border = getStyle[0].button_border;
					this.button_shadow = getStyle[0].button_shadow;
					this.checkbox_bg = getStyle[0].checkbox_bg;
					this.checkbox_border = getStyle[0].checkbox_border;
					this.checkbox_shadow = getStyle[0].checkbox_shadow;
					this.checkbox_before_bg = getStyle[0].checkbox_before_bg;
					this.checkbox_before_shadow = getStyle[0].checkbox_before_shadow;
					this.checkbox_hover_bg = getStyle[0].checkbox_hover_bg;
					this.checkbox_hover_shadow = getStyle[0].checkbox_hover_shadow;
					this.checkbox_active_bg = getStyle[0].checkbox_active_bg;
					this.checkbox_active_image = getStyle[0].checkbox_active_image;
					this.calendar_bg = getStyle[0].calendar_bg;
					this.calendar_color = getStyle[0].calendar_color;
					this.calendar_border = getStyle[0].calendar_border;
					this.calendar_shadow = getStyle[0].calendar_shadow;
					this.calendar_hover_bg = getStyle[0].calendar_hover_bg;
					this.calendar_hover_color = getStyle[0].calendar_hover_color;
					this.calendar_active_bg = getStyle[0].calendar_active_bg;
					this.calendar_active_color = getStyle[0].calendar_active_color;
					this.range_bg = getStyle[0].range_bg;
					this.range_shadow = getStyle[0].range_shadow;
					this.range_thumb = getStyle[0].range_thumb;
					this.result_bg = getStyle[0].result_bg;
					this.result_color = getStyle[0].result_color;
					this.result_border = getStyle[0].result_border;
					this.result_fz = getStyle[0].result_fz;
					this.result_padding = getStyle[0].result_padding;
					this.result_align = getStyle[0].result_align;
					this.result_align_select = getStyle[0].result_align_select;
					this.result_display = getStyle[0].result_display;
					this.result_shadow = getStyle[0].result_shadow;
					this.info_bg = getStyle[0].info_bg;
					this.info_color = getStyle[0].info_color;
					this.info_border = getStyle[0].info_border;
					this.info_shadow = getStyle[0].info_shadow;
					this.info_padding_left = getStyle[0].info_padding_left;
					this.arrows_bg = getStyle[0].arrows_bg;
					this.arrows_color = getStyle[0].arrows_color;
					this.arrows_border = getStyle[0].arrows_border;
					this.arrows_fz = getStyle[0].arrows_fz;
					this.arrows_shadow = getStyle[0].arrows_shadow;
					this.arrows_left = getStyle[0].arrows_left;
					this.arrows_right = getStyle[0].arrows_right;
					this.arrows_top = getStyle[0].arrows_top;
					this.tooltip_image_border = getStyle[0].tooltip_image_border;
					this.tooltip_image_shadow = getStyle[0].tooltip_image_shadow;
					this.tooltip_image_align = getStyle[0].tooltip_image_align;
					this.tooltip_image_align_select = getStyle[0].tooltip_image_align_select;
					this.tooltip_title_bg = getStyle[0].tooltip_title_bg;
					this.tooltip_title_color = getStyle[0].tooltip_title_color;
					this.tooltip_title_shadow = getStyle[0].tooltip_title_shadow;
					this.tooltip_title_radius = getStyle[0].tooltip_title_radius;
					this.tooltip_text_bg = getStyle[0].tooltip_text_bg;
					this.tooltip_text_color = getStyle[0].tooltip_text_color;
					this.tooltip_text_radius = getStyle[0].tooltip_text_radius;
					this.tooltip_text_shadow = getStyle[0].tooltip_text_shadow;
					this.qtip_top = getStyle[0].qtip_top;
					this.qtip_left = getStyle[0].qtip_left;
					this.gift_bg = getStyle[0].gift_bg;
					this.gift_color = getStyle[0].gift_color;
					this.gift_border = getStyle[0].gift_border;
					this.gift_shadow = getStyle[0].gift_shadow;
					this.video_text_weight = getStyle[0].video_text_weight;
					this.video_text_fz = getStyle[0].video_text_fz;
					this.video_image = getStyle[0].video_image;
					this.video_image_display = getStyle[0].video_image_display;
					this.video_text_text = getStyle[0].video_text_text;
					this.consultant_bg = getStyle[0].consultant_bg;
					this.consultant_color = getStyle[0].consultant_color;
					this.consultant_border = getStyle[0].consultant_border;
					this.consultant_shadow = getStyle[0].consultant_shadow;
					this.consultant_padding = getStyle[0].consultant_padding;
					this.consultant_top_padding = getStyle[0].consultant_top_padding;
					this.consultant_top_name_fz = getStyle[0].consultant_top_name_fz;
					this.consultant_top_position_fz = getStyle[0].consultant_top_position_fz;
					this.consultant_image_border = getStyle[0].consultant_image_border;
					this.consultant_image_shadow = getStyle[0].consultant_image_shadow;
					this.consultant_words_bg = getStyle[0].consultant_words_bg;
					this.consultant_words_border = getStyle[0].consultant_words_border;
					this.consultant_words_shadow = getStyle[0].consultant_words_shadow;
					this.consultant_words_color = getStyle[0].consultant_words_color;
					this.m_button_bg = getStyle[0].m_button_bg;
					this.m_button_color = getStyle[0].m_button_color;
					this.m_button_padding = getStyle[0].m_button_padding;
					this.m_button_border = getStyle[0].m_button_border;
					this.m_button_shadow = getStyle[0].m_button_shadow;
					this.m_block_bg = getStyle[0].m_block_bg;
					this.m_block_color = getStyle[0].m_block_color;
					this.m_block_border = getStyle[0].m_block_border;
					this.m_block_shadow = getStyle[0].m_block_shadow;
					this.m_block_hover = getStyle[0].m_block_hover;
					this.allFonts = getStyle[0].allFonts;
					this.selectedFont = getStyle[0].selectedFont;
					this.send_button_bg = getStyle[0].send_button_bg;
					this.send_button_color_text = getStyle[0].send_button_color_text;
					this.send_button_border = getStyle[0].send_button_border;
					this.send_button_shadow = getStyle[0].send_button_shadow;
					this.send_input_bg = getStyle[0].send_input_bg;
					this.send_input_color_text = getStyle[0].send_input_color_text;
					this.send_input_border = getStyle[0].send_input_border;
					this.send_input_shadow = getStyle[0].send_input_shadow;
					this.i_button_width = getStyle[0].i_button_width;
					this.i_button_height = getStyle[0].i_button_height;
					this.i_button_bg = getStyle[0].i_button_bg;
					this.i_button_color = getStyle[0].i_button_color;
					this.i_button_border = getStyle[0].i_button_border;
					this.i_button_shadow = getStyle[0].i_button_shadow;
					this.i_button_fz = getStyle[0].i_button_fz;
					this.i_button_weight = getStyle[0].i_button_weight;
					this.question_block_color_text = getStyle[0].question_block_color_text;
				}

				setTimeout(() => {
					this.autoOpeningNumber(this.autoOpen);
					this.autoOpening(this.autoOpenCh);
					this.exitOpening(this.exitOpen);
					this.exitOpeningOnce(this.exitOpenOnce);
					this.modalLook(this.modal);

					this.q_spinner = false
				}, 0)	
			}, (response) => {
				console.log(response);
			});
		},
		methods: {
			setBorder(e, myVar, myElem) {
            	let myElems = this.$el.querySelectorAll(myElem);

            	if(e == true) {
            		let myObject = eval("(" + "this." + myVar + ")");

            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.border = myObject.size + 'px ' + myObject.type + ' ' + myObject.color.hex;
            		}
            	} else {
            		this.i_button_border.size = 0;

            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.border = '';
            		}
            	}
            },
            setShadow(e, myVar, myElem) {
				let myElems = this.$el.querySelectorAll(myElem);

            	if(e == true) {
            		let myObject = eval("(" + "this." + myVar + ")"),
            			a = myObject.opacity / 100;

            		let rgbColors = this.hexToRgb(myObject.color.hex);

            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.boxShadow = myObject.x + 'px ' + myObject.y + 'px ' + myObject.blur + 'px ' + 'rgba(' + rgbColors.r + ',' + rgbColors.g + ',' + rgbColors.b + ',' + a + ')';
            		}	
            	} else {
            		this.i_button_shadow.opacity = 0;

            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.boxShadow = '';
            		}
            	}
            },
            hexToRgb(hex) {
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            },
            autoOpening(e) {
            	if(e !== true) {
            		this.ready_code = this.ready_code.replace('autoOpen: ' + this.autoOpen + ',', 'autoOpen: false,');

            		this.autoOpen = false;
            	} else {
            		if(this.autoOpen === false) {
            			this.autoOpen = 0;
            		}

            		this.ready_code = this.ready_code.replace('autoOpen: false,', 'autoOpen: ' + this.autoOpen + ',')
            	}
            },
            autoOpeningNumber(e) {
            	this.ready_code = this.ready_code.replace('autoOpen: ' + this.autoOpen + ',', 'autoOpen: ' + e + ',');

            	this.autoOpen = e;
            },
            exitOpening(e) {
            	if(e === false) {
            		this.ready_code = this.ready_code.replace('exitOpen: true,', 'exitOpen: false,');
            	} else {
            		this.ready_code = this.ready_code.replace('exitOpen: false,', 'exitOpen: true,');
            	}
            },
            exitOpeningOnce(e) {
            	if(e !== false) {
            		this.ready_code = this.ready_code.replace('exitOpenOnce: true,', 'exitOpenOnce: false,');
            	} else {
            		this.ready_code = this.ready_code.replace('exitOpenOnce: false,', 'exitOpenOnce: true,');
            	}
            },
            modalLook(e) {
            	if(e === 'modal') {
            		this.ready_code = this.ready_code.replace("modal: 'full'", "modal: 'modal'");
            	} else {
            		this.ready_code = this.ready_code.replace("modal: 'modal'", "modal: 'full'");
            	}
            },
            modalTop(e) {
            	console.log(e)
            },
            toLocalStorage() {
            	console.log('Install', 'LS');

            	let data = [];
            	let styles = [];

            	data.push({
            		metrika: this.metrika,
            		analytics: this.analytics,
            		questions: this.questions,
            		config: this.config,
            		galleryElements: this.galleryElements,
            		youtubePlayer: this.youtubePlayer,
            		videoElements: this.videoElements,
            		localVideo: this.localVideo,
            		consultantName: this.consultantName,
            		consultantDescription: this.consultantDescription,
            		consultantImg: this.consultantImg,
            		consultantImgSrc: this.consultantImgSrc,
            		moreConsultantText: this.moreConsultantText,
            		consultantElements: this.consultantElements,
            		addBlockElements: this.addBlockElements,
            		v_range: this.v_range,
            		infoHeight: this.infoHeight,
            		sliderAllCount: this.sliderAllCount,
            		sliderActive: this.sliderActive,
            		sliderOffsetLeft: this.sliderOffsetLeft,
            		sliderOffsetStep: this.sliderOffsetStep,
            		animation: this.animation,
            		loaderCheck: this.loaderCheck,
            		resultTitleQ: this.resultTitleQ,
            		resultDescQ: this.resultDescQ,
            		resultAddGifts: this.resultAddGifts,
            		addGiftsList: this.addGiftsList,
            		btnText: this.btnText,
            		politicsUrl: this.politicsUrl,
            		inputs: this.inputs,
            		phoneMask: this.phoneMask,
            		selectMask: this.selectMask,
            		readyMask: this.readyMask,
            		userInputPhone: this.userInputPhone,
            		messengerLink: this.messengerLink,
            		messengerBtnText: this.messengerBtnText,
            		messengersTitle: this.messengersTitle,
            		lastVideoElements: this.lastVideoElements,
            		lastConsultantElements: this.lastConsultantElements,
            		customEmails: this.customEmails,
            		readyEmail: this.readyEmail,
            		autoOpenCh: this.autoOpenCh,
            		autoOpen: this.autoOpen,
            		exitOpen: this.exitOpen,
            		exitOpenOnce: this.exitOpenOnce,
            		modal: this.modal,
            		linkLocation: this.linkLocation,
            	});

            	styles.push({
            		colors: this.colors,
            		font_color: this.font_color,
            		bg_image: this.bg_image,
            		bg_image_src: this.bg_image_src,
            		bg_position: this.bg_position,
            		bg_position_select: this.bg_position_select,
            		bg_overlay: this.bg_overlay,
            		head_horizontal_align: this.head_horizontal_align,
            		head_horizontal_align_select: this.head_horizontal_align_select,
            		head_logo: this.head_logo,
            		head_logo_src: this.head_logo_src,
            		head_desc: this.head_desc,
            		head_desc_show: this.head_desc_show,
            		head_desc_weight: this.head_desc_weight,
            		head_desc_font_size: this.head_desc_font_size,
            		progress_height: this.progress_height,
            		progress_font_size: this.progress_font_size,
            		progress_bg: this.progress_bg,
            		progress_border: this.progress_border,
            		progress_margin_top: this.progress_margin_top,
            		progress_margin_bottom: this.progress_margin_bottom,
            		progress_shadow: this.progress_shadow,
            		progressbar_color_text: this.progressbar_color_text,
            		progressbar_bg: this.progressbar_bg,
            		progressbar_radius: this.progressbar_radius,
            		progressbar_shadow: this.progressbar_shadow,
            		question_bg: this.question_bg,
            		question_border: this.question_border,
            		question_padd_vert: this.question_padd_vert,
            		question_padd_horz: this.question_padd_horz,
            		question_radius: this.question_radius,
            		question_shadow: this.question_shadow,
            		question_index_width: this.question_index_width,
            		question_index_height: this.question_index_height,
            		question_index_bg: this.question_index_bg,
            		question_index_border: this.question_index_border,
            		question_index_fz: this.question_index_fz,
            		question_index_weight: this.question_index_weight,
            		question_index_shadow: this.question_index_shadow,
            		question_index_top: this.question_index_top,
            		question_index_left: this.question_index_left,
            		question_title_fz: this.question_title_fz,
            		question_title_weight: this.question_title_weight,
            		radio_width_and_height: this.radio_width_and_height,
            		radio_bg: this.radio_bg,
            		radio_border: this.radio_border,
            		radio_shadow: this.radio_shadow,
            		radio_before_bg: this.radio_before_bg,
            		radio_before_shadow: this.radio_before_shadow,
            		radio_hover_bg: this.radio_hover_bg,
            		radio_hover_shadow: this.radio_hover_shadow,
            		radio_active_bg: this.radio_active_bg,
            		radio_active_image: this.radio_active_image,
            		input_bg: this.input_bg,
            		input_color_text: this.input_color_text,
            		input_weight: this.input_weight,
            		input_border: this.input_border,
            		input_shadow: this.input_shadow,
            		button_bg: this.button_bg,
            		button_color_text: this.button_color_text,
            		button_border: this.button_border,
            		button_shadow: this.button_shadow,
            		checkbox_bg: this.checkbox_bg,
            		checkbox_border: this.checkbox_border,
            		checkbox_shadow: this.checkbox_shadow,
            		checkbox_before_bg: this.checkbox_before_bg,
            		checkbox_before_shadow: this.checkbox_before_shadow,
            		checkbox_hover_bg: this.checkbox_hover_bg,
            		checkbox_hover_shadow: this.checkbox_hover_shadow,
            		checkbox_active_bg: this.checkbox_active_bg,
            		checkbox_active_image: this.checkbox_active_image,
            		calendar_bg: this.calendar_bg,
            		calendar_color: this.calendar_color,
            		calendar_border: this.calendar_border,
            		calendar_shadow: this.calendar_shadow,
            		calendar_hover_bg: this.calendar_hover_bg,
            		calendar_hover_color: this.calendar_hover_color,
            		calendar_active_bg: this.calendar_active_bg,
            		calendar_active_color: this.calendar_active_color,
            		range_bg: this.range_bg,
            		range_shadow: this.range_shadow,
            		range_thumb: this.range_thumb,
            		result_bg: this.result_bg,
            		result_color: this.result_color,
            		result_border: this.result_border,
            		result_fz: this.result_fz,
            		result_padding: this.result_padding,
            		result_align: this.result_align,
            		result_align_select: this.result_align_select,
            		result_display: this.result_display,
            		result_shadow: this.result_shadow,
            		info_bg: this.info_bg,
            		info_color: this.info_color,
            		info_border: this.info_border,
            		info_shadow: this.info_shadow,
            		info_padding_left: this.info_padding_left,
            		arrows_bg: this.arrows_bg,
            		arrows_color: this.arrows_color,
            		arrows_border: this.arrows_border,
            		arrows_fz: this.arrows_fz,
            		arrows_shadow: this.arrows_shadow,
            		arrows_left: this.arrows_left,
            		arrows_right: this.arrows_right,
            		arrows_top: this.arrows_top,
            		tooltip_image_border: this.tooltip_image_border,
            		tooltip_image_shadow: this.tooltip_image_shadow,
            		tooltip_image_align: this.tooltip_image_align,
            		tooltip_image_align_select: this.tooltip_image_align_select,
            		tooltip_title_bg: this.tooltip_title_bg,
            		tooltip_title_color: this.tooltip_title_color,
            		tooltip_title_shadow: this.tooltip_title_shadow,
            		tooltip_title_radius: this.tooltip_title_radius,
            		tooltip_text_bg: this.tooltip_text_bg,
            		tooltip_text_color: this.tooltip_text_color,
            		tooltip_text_radius: this.tooltip_text_radius,
            		tooltip_text_shadow: this.tooltip_text_shadow,
            		qtip_top: this.qtip_top,
            		qtip_left: this.qtip_left,
            		gift_bg: this.gift_bg,
            		gift_color: this.gift_color,
            		gift_border: this.gift_border,
            		gift_shadow: this.gift_shadow,
            		video_text_weight: this.video_text_weight,
            		video_text_fz: this.video_text_fz,
            		video_image: this.video_image,
            		video_image_display: this.video_image_display,
            		video_text_text: this.video_text_text,
            		consultant_bg: this.consultant_bg,
            		consultant_color: this.consultant_color,
            		consultant_border: this.consultant_border,
            		consultant_shadow: this.consultant_shadow,
            		consultant_padding: this.consultant_padding,
            		consultant_top_padding: this.consultant_top_padding,
            		consultant_top_name_fz: this.consultant_top_name_fz,
            		consultant_top_position_fz: this.consultant_top_position_fz,
            		consultant_image_border: this.consultant_image_border,
            		consultant_image_shadow: this.consultant_image_shadow,
            		consultant_words_bg: this.consultant_words_bg,
            		consultant_words_border: this.consultant_words_border,
            		consultant_words_shadow: this.consultant_words_shadow,
            		consultant_words_color: this.consultant_words_color,
            		m_button_bg: this.m_button_bg,
            		m_button_color: this.m_button_color,
            		m_button_padding: this.m_button_padding,
            		m_button_border: this.m_button_border,
            		m_button_shadow: this.m_button_shadow,
            		m_block_bg: this.m_block_bg,
            		m_block_color: this.m_block_color,
            		m_block_border: this.m_block_border,
            		m_block_shadow: this.m_block_shadow,
            		m_block_hover: this.m_block_hover,
            		allFonts: this.allFonts,
            		selectedFont: this.selectedFont,
            		send_button_bg: this.send_button_bg,
            		send_button_color_text: this.send_button_color_text,
            		send_button_border: this.send_button_border,
            		send_button_shadow: this.send_button_shadow,
            		send_input_bg: this.send_input_bg,
            		send_input_color_text: this.send_input_color_text,
            		send_input_border: this.send_input_border,
            		send_input_shadow: this.send_input_shadow,
            		i_button_width: this.i_button_width,
            		i_button_height: this.i_button_height,
            		i_button_bg: this.i_button_bg,
            		i_button_color: this.i_button_color,
            		i_button_border: this.i_button_border,
            		i_button_shadow: this.i_button_shadow,
            		i_button_fz: this.i_button_fz,
            		i_button_weight: this.i_button_weight,
            		question_block_color_text: this.question_block_color_text,
            		link_color_text: this.link_color_text,
            	});

            	let idQuiz = this.$router.history.current.params.id,
            		itemQuiz = 'quiz_' + idQuiz,
            		styleQuiz = 'style_' + idQuiz;

            	localStorage.setItem(itemQuiz, JSON.stringify(data));
            	localStorage.setItem(styleQuiz, JSON.stringify(styles));
            }
		},
		beforeRouteLeave (to, from, next) {
			if(this.q_spinner === false) {
				this.toLocalStorage();

				next();
			}
		}
	}
</script>

<style scoped>
	.qlead-button {
		border: none;
		outline: none !important;
	}

	.my_mb_install button {
		white-space: normal;
	}

	  .modal {
	    background: #FFFFFF;
	    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.18);
	    overflow-x: auto;
	    display: flex;
	    flex-direction: column;
	    max-width: 500px;
	    height: max-content;
	    position: fixed;
	    border-radius: calc(.3rem - 1px);
	    transition: .18s;
	    /*margin: 0 auto;*/
	    top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
	  }

	  .modal-header,
	  .modal-footer {
	    padding: 15px;
	    display: flex;
	  }

	  .modal-header {
	    color: #4AAE9B;
	    justify-content: space-between;
	    padding: .5rem .75rem;
	    margin-bottom: 0;
	    font-size: 1rem;
	    color: inherit;
	    background-color: #f7f7f7;
	    border-bottom: 1px solid #ebebeb;
	    font-weight: 500;
	  }

	  .modal-footer {
	    border-top: 1px solid #eeeeee;
	    justify-content: flex-end;
	  }

	  .modal-body {
	    position: relative;
	    padding: .5rem .75rem;
	  }

	  .btn-close {
	    border: none;
	    font-size: 1rem;
	    cursor: pointer;
	    font-weight: bold;
	    color: #000;
	    text-shadow: 0 1px 0 #fff;
	    opacity: .5;
	    background: transparent;
	    line-height: 1;
	  }

	  .btn-green {
	    color: white;
	    background: #4AAE9B;
	    border: 1px solid #4AAE9B;
	    border-radius: 2px;
	  }

	.modal .form-control {
	    display: block;
	    width: 100%;
	    padding: .375rem .75rem;
	    font-size: 1rem;
	    line-height: 1.5;
	    color: #495057;
	    background-color: #fff;
	    background-clip: padding-box;
	    border: 1px solid #ced4da;
	    border-radius: .25rem;
	    transition: border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out;
	}

	.modal .input-group>.custom-file, .modal .input-group>.custom-select, .modal .input-group>.form-control {
	    position: relative;
	    flex: 1 1 auto;
	    width: 1%;
	    margin-bottom: 0;
	}

	.slider_range {
  		width: 100%;
	}

	.range_count {
	    margin-bottom: 0;
	}

	@media (max-width: 991.98px) {
		.my_mb_install {
			margin-bottom: 1.25rem;
		}
	}
</style>