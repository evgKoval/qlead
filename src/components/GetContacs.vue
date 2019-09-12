<template>
	<div>
		<clip-loader :loading="q_spinner" v-if="q_spinner" :size="'75px'" style="padding-top: 5%;"></clip-loader>

		<b-container v-if="!q_spinner" fluid class="main_content top_edit">
		  <b-row>
	          <b-col>
	        	  <b-card
	  		          tag="article">
	  		    <b-row>
	  		    	<b-col lg="4" md="6" class="d-flex align-items-center">
	  		    		<b-input-group size="lg">
	  		    		    <b-form-input placeholder="Название вашего квиза" v-model="quiz_name"></b-form-input>
	  		    		</b-input-group>
	  		    		<i class="fas fa-question-circle ml-3" id="exPopoverManual1"></i>
	  		    		<b-popover target="exPopoverManual1" triggers="hover focus">
		    		      Его увидите только вы в разделе "Мои квизы". Это исключительно для вашего удобства ;)
		    		    </b-popover>
	  		    	</b-col>
	  		    	<b-col lg="8" md="6" class="text-right edit_top_right">
	  		    		<b-button size="lg" :variant="styleMode == true ? 'primary' : 'outline-primary'" class="ml-2 d-none d-sm-inline-block" @click="styleMode = !styleMode; hoverCSS(); showPopover = false">
			                {{ styleMode === true ? 'Выключить настройку стилей' : 'Включить настройку стилей' }}
			                <i class="fas fa-palette ml-2"></i>
			            </b-button>
	  		    	</b-col>
	  		    </b-row>
	  		  </b-card>
	          </b-col>
	      </b-row>
		</b-container>

		<section v-show="!q_spinner" id="quiz" :style="{ backgroundColor: colors.hex, backgroundImage: 'url(' + bg_image_src + ')', backgroundPosition: bg_position, color: font_color.hex, fontFamily: selectedFont }">
			<div class="container">
				<div class="row" >
				    <div id="exPopoverReactive-test-edit" class="col-12 d-flex head_desc" :style="{ justifyContent: head_horizontal_align }">
				    	<div class="logo d-flex align-middle">
				    	  <a href="#" class="logo__logo">
				    	  	<img :src="head_logo_src">
				    	  </a>
				    	  <div :class="{ 'd-none': head_desc_show, 'logo-description': true }" :style="{ fontWeight: head_desc_weight, fontSize: head_desc_font_size + 'px' }">{{ head_desc }}</div>
				    	</div>
				    </div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="progress" ref="progress_wrap" :style="{ height: progress_height + 'px', borderRadius: progress_border.radius + 'px', marginTop: progress_margin_top + 'px', marginBottom: progress_margin_bottom + 'px' }">
						  	<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" id="progress-bar" ref="progress" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" :style="{ width: changeProgress, fontSize: progress_font_size + 'px', color: progressbar_color_text.hex, backgroundColor: progressbar_bg.hex, borderRadius: progressbar_radius + 'px' }">
						  	</div>
						</div>
					</div>
				</div>
				<div class="row mb-5">
					<div class="questions col-xl-6 col-lg-5">
						<div id="result" style="display: block" ref="result">
							<div class="question-number" ref="question_number" :style="{ width: question_index_width + 'px', height: question_index_height + 'px', borderRadius: question_index_border.radius + 'px', fontSize: question_index_fz + 'px', fontWeight: question_index_weight, top: question_index_top + 'px', left: question_index_left + 'px' }">{{ currentQ }}</div>
							<div class="question" ref="question_block" :style="{ paddingTop: question_padd_vert + 'px', paddingBottom: question_padd_vert + 'px', paddingLeft: question_padd_horz + 'px', paddingRight: question_padd_horz + 'px', borderRadius: question_radius + 'px', color: question_block_color_text.hex }">
								<h3 id="question" ref="question_title" :style="{ fontSize: question_title_fz + 'px', fontWeight: question_title_weight }">{{ resultTitleQ }}</h3>
								<p class="result_desc">{{ resultDescQ }}</p>
								<div class="question-comment" v-show="!(addGiftsList.length == 1 && addGiftsList[0] == '')">
								    <ul>
								        <li v-for="elem in addGiftsList">{{ elem }}</li>
								    </ul>
								</div>
								<div class="answer-group" v-for="input in inputs" ref="main_inputs">
									<input class="input quiz_inputs" :type="input.type" :name="input.name" :placeholder="input.placeholder" v-show="input.show" v-mask="readyMask" v-model="userInputPhone" v-if="input.name == 'Телефон'" :required="input.required" :style="{ color: input_color_text.hex, fontWeight: input_weight, borderRadius: input_border.radius + 'px' }">
									<input class="input quiz_inputs" :type="input.type" :name="input.name" :placeholder="input.placeholder" v-show="input.show" v-else :required="input.required" :style="{ color: input_color_text.hex, fontWeight: input_weight, borderRadius: input_border.radius + 'px' }">
								</div>
								<div class="messengers" ref="messengers" :style="{ display: 'none', color: m_block_color.hex, borderRadius: m_block_border.radius + 'px' }">
									<div class="messengers-title">{{ messengersTitle }}</div>
									<div class="messengers-list">
										<div class="messengers-item" v-for="link in messengerLink" v-show="link.show" @click="thisMessenger(link.name)">
											<img :src="'../../static/img/' + link.src" height="27" width="auto" class="pr-2">
											<span>{{ link.name }}</span>
										</div>
									</div>
									<a href="#" class="messengers-back" @click.prevent="messengerBack()">Вернуться к вводу контактов</a>
								</div>
								<div class="messenger-send" ref="messenger_send" :style="{ display: 'none', color: m_block_color.hex, borderRadius: m_block_border.radius + 'px' }">
									<div ref="messenger_choose" v-for="messenger in messengerLink" style="display: none;">
										<div class="mb-3">
											<img :src="'../../static/img/' + messenger.src" height="27" width="auto" class="pr-2">
											<span>{{ messenger.name }}</span>
										</div>
										<div>
											<label>{{ messenger.label }}</label>
											<input type="text" class="send_input" :placeholder="messenger.placeholder" :style="{ color: send_input_color_text.hex, borderRadius: send_input_border.radius + 'px' }">
										</div>
										<a href="#" class="messenger-change" ref="messenger_change" @click.prevent="messengerChange()">Выбрать другой мессенджер</a>
										<a href="#" class="messengers-back" ref="messenger_back" @click.prevent="messengerBack()">Вернуться к вводу контактов</a>
										<button type="submit" class="messenger-btn" :style="{ color: send_button_color_text.hex, borderRadius: send_button_border.radius + 'px' }">{{ messengerBtnText }}</button>
									</div>
								</div>

								<a href="#" :class="{ 'messengers-link': true, 'for_editing': styleMode }" ref="messengers_link" @click.prevent="showModalPop($event, 'right');choiceMessenger(); whichPopover = 'messenger'" v-show="messengerLink[0].show == true || messengerLink[1].show == true || messengerLink[2].show == true || messengerLink[3].show == true || messengerLink[4].show == true" :style="{ color: m_button_color.hex, paddingTop: m_button_padding + 'px', paddingBottom: m_button_padding + 'px', borderRadius: m_button_border.radius + 'px' }">
									<div class="editor-overlay" v-show="styleMode == true"></div>
									<img v-for="link in messengerLink" :src="'../../static/img/' + link.src" :alt="link.name" v-show="link.show" height="20" width="auto">
									<span class="pl-3">Использовать мессенджер</span>
								</a>
								<div class="answer-group" ref="main_btn">
									<button type="submit" class="button next-questions" :style="{ color: button_color_text.hex, borderRadius: button_border.radius + 'px' }">{{ btnText }}</button>
								</div>
								<div class="answer-group">
									<div class="agreement mt-2 for_editing" @click="whichPopover = 'link'; showModalPop($event, 'right')">
										<div class="editor-overlay" v-show="styleMode == true"></div>
										<input type="checkbox" name="AGREEMENT" id="agreement" required checked>
										<label for="agreement" v-if="!q_spinner">
											Отправляя сведения через электронную форму, Вы даете согласие на обработку, сбор, хранение и передачу третьим лицам предоставленной Вами информации на условиях <a :href="politicsUrl == '' ? '#' : politicsUrl" :style="{ color: link_color_text.hex }">Политики конфиденциальности</a>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="config col-xl-6 col-lg-7" ref="background">
						<div class="get-started" ref="started" style="display: none;">
							<span>Начните отвечать, сделайте первый шаг к дому своей мечты!</span>
						</div>
						<div ref="slider" style="display: block" v-if="config == 'gallery'">
							<div class="wrapper-loader" ref="loader" style="display: none;">
								<div class="circle-loader">
									<div class="checkmark draw"></div>
								</div>
								<p>{{ loaderCheck }}</p>
							</div>

							<div :class="{ 'd-none': result_display, 'results-header': true }" ref="result_header" :style="{ color: result_color.hex, borderTopLeftRadius: result_border.left + 'px', borderTopRightRadius: result_border.right + 'px', padding: result_padding + 'px', fontSize: result_fz + 'px', textAlign: result_align, display: result_display }">
							    Отобрано проектов: {{ sliderAllCount }}, в том числе:
							</div>
							<div class='slider js-slider' ref="js_slide" :style="{ borderTopLeftRadius: info_border.top + 'px', borderTopRightRadius: info_border.top + 'px' }">
								<div class="slider__body" :style='{left: sliderOffsetLeft + "px"}'>
									<div class="slider__slide js-slide" ref="elem" v-for='item in filterSlider' :style="{ backgroundImage: 'url(' + item.src + ')' }">
										<div class="home-item__info" :style="{ color: info_color.hex, borderBottomLeftRadius: info_border.bottom + 'px', borderBottomRightRadius: info_border.bottom + 'px', paddingLeft: info_padding_left + 'px' }" ref="info" v-show="galleryElements[0].more_values != 0">
											<div class="home-item__info-item" v-for="key in countInfo">
												<span class="home-item__info-title">
													{{ item.more_keys[key - 1] }}
												</span>
												<span class="home-item__info-value">
													{{ item.more_values[key - 1] }}	
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							

							<button @click='prevSlide' class="slider-prev" :style="{ borderRadius: arrows_border.radius + 'px', left: arrows_left + 'px', top: arrows_top + 'px' }">
								<i class="fas fa-chevron-left" :style="{ color: arrows_color.hex, fontSize: arrows_fz + 'px' }"></i>
							</button>
							<button @click='nextSlide' class="slider-next" :style="{ borderRadius: arrows_border.radius + 'px', right: arrows_right + 'px', top: arrows_top + 'px' }">
								<i class="fas fa-chevron-right" :style="{ color: arrows_color.hex, fontSize: arrows_fz + 'px' }"></i>
							</button>
						</div>
						<div v-if="config == 'video'">
							<div :class="youtubePlayer == 'false' ? 'mb-1 video-title' : 'mb-3 video-title'" :style="{ fontWeight: video_text_weight, fontSize: video_text_fz + 'px', display: video_image_display }">
								{{ video_text_text }}
								<img :src="video_image" :class="{ 'd-none': video_image_display }">
							</div>
							<iframe v-if="youtubePlayer == 'true'" width="100%" height="420" :src="'https://www.youtube.com/embed/' + lastVideoElements[0].readySrc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
							</iframe>
							<video v-if="youtubePlayer == 'false'" ref="video_local" width="100%" height="320" controls="controls">
						    	<source :src="lastVideoElements[0].localSrc" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
							    Элемент video не поддерживается вашим браузером. 
							</video>
						</div>
						<div v-if="config == 'consultant'">
							<div class="consultant" :style="{ color: consultant_color.hex, borderRadius: consultant_border.radius + 'px', padding: consultant_padding + 'px' }">
							    <div class="expert">
							        <div class="row">
							            <div class="col-lg-4 col-md-3 col-sm-4 expert-img">
							                <img :src="consultantImgSrc" alt="Казарина Екатерина" width="100%" height="100%">
							            </div>
							            <div class="col-lg-8 col-md-9 col-sm-8 expert-info" :style="{ paddingTop: consultant_top_padding + 'px' }">
							                <div class="expert-name" :style="{ fontSize: consultant_top_name_fz + 'px' }">{{ consultantName }}</div>
							                <div class="expert-position" :style="{ fontSize: consultant_top_position_fz + 'px', paddingRight: '30px' }">
							                	{{ consultantDescription }}
							                </div>
							            </div>
							        </div>
							        <div class="expert-says" :style="{ borderRadius: consultant_words_border.radius + 'px', color: consultant_words_color.hex }">
							        	{{ lastConsultantElements }}
							        </div>
							    </div>
							    <div class="message-consultant">
							    	<div v-for="(consultantText, index) in moreConsultantText">
							    		<p :class="'consultantText-' + index" :style="{ fontSize: consultantText.fz + 'px', fontWeight: consultantText.fw, marginBottom: consultantText.mb + 'px' }">{{ consultantText.text }}</p>
							    	</div>
							    </div>
							</div>
						</div>

						<div class="quiz-gifts mt-5" :style="{ color: gift_color.hex, borderRadius: gift_border.radius + 'px' }" v-if="addBlockElements.length == 2">
						    <div class="gift">
						        <div class="gift-description">
						            <div class="gift-title">{{ addBlockElements[0].title }}</div>
						            <div class="gift-image">
						                <img :src="addBlockElements[0].src" alt="" class="guaranteed-gift-image">
						            </div>
						            <div class="gift-name guaranteed-gift-name">
						            	{{ addBlockElements[0].name }}
						        	</div>
						        </div>
						    </div>
						    <div class="gift">
						        <div class="gift-description">
						            <div class="gift-title">{{ addBlockElements[1].title }}</div>
						            <div class="gift-image">
						                <img :src="addBlockElements[1].src" alt="" class="guaranteed-gift-image">
						            </div>
						            <div class="gift-name guaranteed-gift-name">
						            	{{ addBlockElements[1].name }}
						            </div>
						        </div>
						    </div>
						</div>
						<div v-if="addBlockElements.length == 1" class="gift-one mt-5" :style="{ color: gift_color.hex, borderRadius: gift_border.radius + 'px' }">
						    <div class="gift-item">
						        <div class="gift-item-img">
						        	<img :src="addBlockElements[0].src" alt="">
						        </div>
						        <div class="gift-item-text">
						            <span>{{ addBlockElements[0].title }}</span>
						            <h3>{{ addBlockElements[0].name }}</h3>
						        </div>
						    </div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<b-container v-show="!q_spinner" fluid class="main_content my_mb">
		  <b-card class="edit_contacs">
	  		  <b-row>
	  	          <b-col lg="6" class="my_mb_text">
	          		<h4 class="mb-4">Редактирование текста</h4>
	          		<b-input-group>
	          		    <b-form-input v-model="resultTitleQ" placeholder="Заголовок вопроса" size="lg"></b-form-input>
	          		</b-input-group>
	          		<b-input-group>
	          		    <b-form-input v-model="resultDescQ" placeholder="Подзаголовок" class="mt-3"></b-form-input>
	          		</b-input-group>
			        <hr>
			        <label class="mb-3 d-block">Маркированный список, который будет выделен (напр. для подарков)</label>
			        <div role="group" v-for="(elem, index) in addGiftsList">
				        <label class="mr-2">Элемент списка #{{ index + 1 }}</label>
				        <i class="far fa-trash-alt trash_cond" title="Удалить элемент" @click="deleteAddGiftsList(index)" v-show="addGiftsList.length > 1"></i>
	          		    <b-form-input placeholder="Текст для этого списка" class="mb-2" :value="elem" @keyup.native="changeAddGiftsList($event, index)"></b-form-input>
			        </div>
			        <b-button variant="outline-primary" size="lg" class="btn-block mt-3" @click="addAddGiftsList()">
			        	<span>Добавить элемент списка +</span> 
			        </b-button>
	          		<hr>
	          		<div role="group">
	          			<b-form-input v-model="btnText" placeholder="Текст кнопки" size="lg" class="mb-3"></b-form-input>
	          			<b-form-input v-model="politicsUrl" placeholder="Ссылка на политику конфиденциальности"></b-form-input>
	          		</div>
	  	          </b-col>
	  	          <b-col lg="6">
	  	          	<h4 class="mb-4">Сбор контактов</h4>
	  	          	<b-list-group class="edit_config_contacs">
			        	<Container @drop="onDrop" drag-handle-selector=".fa-arrows-alt">            
	        	            <Draggable v-for="(input, index, key) in inputs">
	        	            	<div class="draggable-item">
          		  	          	    <b-list-group-item class="mb-2">
          			  	          	  	<span>{{ input.name }}</span>
          			  	          	  	<div class="edit_form_btns">
          			  	          	  		<i class="far fa-edit" @click="editInputs(index, input.name)"></i>
          		  		          		    <b-form-checkbox :id="'checkbox' + index" v-model="inputs[index].show"></b-form-checkbox>
          			  	          	  		<i class="fas fa-arrows-alt"></i>
          			  	          	  	</div>
          		  	          	    </b-list-group-item>
	        	            	</div>
	        	        	</Draggable>
	        	        </Container>
        				<b-modal id="modal-input" ref="modal_input" @hide="hideInputs()" hide-footer title="Редактирование поля ввода">
        					<div role="group" class="mb-3">
        						<label>Подсказка для поля</label>
        					    <b-form-input ref="input_placeholder" type="text" placeholder="Напишите подсказку"></b-form-input>
        					</div>
        					<div role="group" ref="input_mask_block" style="display: none;" class="mb-3">
        						<label>Маска для телефона</label>
        					    <b-form-input ref="input_mask" :value="readyMask" type="text" placeholder="Напишите подсказку"></b-form-input>
        					    <p class="mb-3 mt-2 input_mask_explain">Используйте <kbd>#</kbd> для подстановки чисел</p>
        					    <b-form-select ref="select_masks" v-model="selectMask" @input="choiceMask($event)" :options="choiceMasks"/>
        					</div>
        					<div role="group" class="mb-3">
        						<b-form-checkbox id="checkbox_req" ref="checkbox_req" @change="changeReq()">
        							Обязательное поле
        						</b-form-checkbox>
        					</div>
        					<hr>
        					<div class="d-flex justify-content-end">
        						<b-button variant="outline-secondary" @click="closeInputs()">
        			                Закрыть
        			            </b-button>
        			            <b-button variant="primary" class="ml-2" @click="confirmInput()">
                                    Редактировать
                                </b-button>
        					</div>
        				</b-modal>
	  	          	</b-list-group>
  					
          		    <b-form-checkbox class="mt-3 mb" v-model="linkLocation.show">
			        	Включить переадресацию после заполнения формы
			        </b-form-checkbox>
			        <div v-show="linkLocation.show" class="mb-3 mt-2">
		        		<b-form-input type="text" 
		        					  v-model="linkLocation.url"
		        					  placeholder="https://www.example.com">
		        	    </b-form-input>
			        </div>
	  	    	    <hr>
	        	    <h6 class="mb-4 mt-4">Мессенджеры и социальные сети</h6>
	        	    <div class="d-flex flex-wrap">
	          		    <b-form-checkbox id="checkbox8"
				                         class="mt-1 mb-1 mr-3" v-model="messengerLink[0].show">
				        	Telegram
				        </b-form-checkbox>
              		    <b-form-checkbox id="checkbox9"
    			                         class="mt-1 mb-1 mr-3" v-model="messengerLink[1].show">
    			        	Viber
    			        </b-form-checkbox>
              		    <b-form-checkbox id="checkbox10"
    			                         class="mt-1 mb-1 mr-3" v-model="messengerLink[2].show">
    			        	WhatsApp
    			        </b-form-checkbox>
              		    <b-form-checkbox id="checkbox11"
    			                         class="mt-1 mb-1 mr-3" v-model="messengerLink[3].show">
    			            Messenger
    			        </b-form-checkbox>
	          		    <b-form-checkbox id="checkbox12"
				                         class="mt-1 mb-1" v-model="messengerLink[4].show">
				            VK
				        </b-form-checkbox>
	        	    </div>
	        	    <b-button variant="outline-primary" class="mt-2" v-b-modal.modal-placeholder>
	        	    	Изменить подсказки для полей
	                </b-button>
    				<b-modal id="modal-placeholder" hide-footer title="Редактирование подсказок для полей">
    					<div role="group" class="mb-3">
    						<template v-for="(messenger, index) in messengerLink">
    							<label>{{ messenger.name }}</label>
    							<b-form-input v-model="messenger.placeholder" placeholder="Напишите подсказку для поля с мессенджером" class="mb-3"></b-form-input>
    						</template>
    					</div>
    					<hr>
    					<div class="d-flex justify-content-end">
    						<b-button variant="outline-secondary" @click="closePlaceholder()">
    			                Закрыть
    			            </b-button>
    					</div>
    				</b-modal>
          		    <b-form-input v-model="messengerBtnText" placeholder="Текст на кнопке мессенджеров" size="lg" class="mt-3"></b-form-input>
          		    <b-form-input v-model="messengersTitle" placeholder="Заголовок для выбора мессенджера" class="mt-3"></b-form-input>
          		    <hr v-if="config == 'video' || config == 'consultant'">
	  	    	    <div v-if="config == 'video'">
	  	    	    	<h4 class="mb-4">Редактирование последнего элемента</h4>
    	            	<b-form-radio-group stacked class="choice_player" :checked="youtubePlayer" id="radios-player" @change="changePlayer($event)" ref="radio_player">
    	            		<b-form-radio value="true">
    	            			<label>Вставьте ссылку на видео из Youtube</label>
		  	    	    		<b-form-input type="text" 
		  	    	    					  class="mb-3 mt-2"
		  	    	    					  v-model="lastVideoElements[0].src"
		  	    	    					  placeholder="Вставьте ссылку на видео из Youtube"
		  	    	    					  @keyup.native="changeYoutubeLink()">
		  	    	    	    </b-form-input>
    	            		</b-form-radio>
    						<b-form-radio value="false" class="mb-1" checked="checked">
				    	    	<label class="mb-2">Загрузить видео локально</label>
			  	    	    	<div class="mb-3 custom-file b-form-file">
			  	    	    		<b-form-file accept=".mp4" placeholder="Загрузить изображение..." @change="uploadVideo($event)"></b-form-file>

			  	    	    		<!-- <input type="file" ref="upload_video" @input="uploadVideo()" accept=".mp4" class="custom-file-input">
			  	    	    					  	    	    	    <label class="custom-file-label">
			  	    	    					  	    	    	        {{ lastVideoElements[0].localSrc == '' ? 'Загрузить видео файл...' : lastVideoElements[0].localSrc }}
			  	    	    					  	    	    	    </label> -->
			  	    	    	</div>
    						</b-form-radio>
    					</b-form-radio-group>
	          		    <b-form-checkbox id="add-autoplay"
				                         @change="autoplayOn($event)"
				                         :checked="lastVideoElements[0].autoplay">
				        	Автовоспроизведение видео
				        </b-form-checkbox>
	  	    	    </div>
	  	    	    <div v-if="config == 'consultant'">
	  	    	    	<h4 class="mb-4">Редактирование последнего комментария</h4>
      	    	    	<textarea v-model="lastConsultantElements"
  	    	    				  size="lg"
  	    	    				  class="form-control mb-3" 
  	    	    				  rows="3" wrap="soft"
  	    	    				  placeholder="Напишите комментарий консультанта">
      	    	        </textarea>
	  	    	    </div>
	  	          </b-col>
	  	      </b-row>
		  </b-card>
		</b-container>

		<template v-if="showPopover && !q_spinner">
			<div class="modal my_modal_popover">
				<header class="modal-header">
					<slot name="header">
						<span>
							{{ whichPopover == 'messenger' ? 'Мессенджеры и социальные сети' :
							   whichPopover == 'link' ? 'Политика конфиденциальности' :
							   '' }}
							
						</span>
						<button type="button" class="btn-close" @click="closePopover()">
							x
						</button>
					</slot>
				</header>
				<section class="modal-body">
					<slot name="body">
					<template v-if="whichPopover == 'messenger'">
						<b-tabs>
							<b-tab title="Кнопка" class="pt-3" @click="messengerBack()">
								<b-tabs class="more_tabs">
				  					<b-tab title="Цвета" class="pt-4 pb-2">
				  						<div role="group">
				  						    <label>Цвет фона ползунка</label>
				  						    <b-input-group class="mb-4">
				  						        <b-input-group-prepend>
				  						            <b-btn variant="primary" id="exPopoverReactive-button-bg">Выбрать цвет</b-btn>
				  						            <b-popover target="exPopoverReactive-button-bg"
				  						                       triggers="click"
				  						                       placement="left">
									                    <sketch-picker v-model="m_button_bg.color" @input="setBackground('m_button_bg', '.messengers-link')" />
				  						            </b-popover>
				  						        </b-input-group-prepend>
				  						        <b-form-input @input="setBackground('m_button_bg', '.messengers-link')" v-model="m_button_bg.color.hex"></b-form-input>
				  						    </b-input-group>
				  						    <label>Прозрачность фона</label>
				  						    <div class="d-flex">
				  						        <div style="width: 60%">
				  						            <range-slider
				  						                class="slider_range"
				  						                min="0"
				  						                max="100"
				  						                v-model="m_button_bg.opacity"
				  						                @input="setBackground('m_button_bg', '.messengers-link')">
				  						            </range-slider>
				  						        </div>
				  						        <p class="ml-3 range_count" style="width: 40%">{{ m_button_bg.opacity }}%</p>
				  						    </div>
				  						</div>
				  						<div role="group">
				  						  <label>Цвет текста</label>
				  						    <b-input-group>
				  						    <b-input-group-prepend>
				  						        <b-btn variant="primary" id="exPopoverReactive-button-color">Выбрать цвет</b-btn>
				  						        <b-popover target="exPopoverReactive-button-color"
				  						                   triggers="click"
				  						                   placement="left">
										            <sketch-picker v-model="m_button_color" />
				  						        </b-popover>
				  						      </b-input-group-prepend>
				  						      <b-form-input v-model="m_button_color.hex"></b-form-input>
				  						  </b-input-group>
				  						</div>
				  					</b-tab>
				  					<b-tab title="Отступы" class="pt-4 pb-2">
				  						<div role="group">
			  								<label>Внутренние отступы</label>
			  								<b-input-group append="px">
			  							    	<b-form-input type="number" v-model="m_button_padding"></b-form-input>
			  								</b-input-group>
				  						</div>
				  					</b-tab>
			      		    		<b-tab title="Рамки" class="pt-4 pb-2">
	  									<div role="group" class="mb-4">
			  			    	    		<b-form-checkbox id="checkbox-button-border" :class="m_button_border.show == true ? 'mb-3' : ''"
			  			    	    		                 v-model="m_button_border.show" @change="setBorder($event, 'm_button_border', '.messengers-link')">
			  			    		      		Стилизовать границы
			  				    		    </b-form-checkbox>
	  										<template v-if="m_button_border.show == true">
	  											<div role="group" class="mb-4">
	  												<label>Размер границы</label>
	  												<b-input-group append="px">
	  											    	<b-form-input type="number" v-model="m_button_border.size" @change="setBorder(true, 'm_button_border', '.messengers-link')"></b-form-input>
	  												</b-input-group>
	  											</div>
	  											<div role="group">
	  												<label>Стиль рамки</label>
	  												<b-button-group class="d-flex mb-4">
	  												    <b-button style="width: 33.33%" 
	  												    		  @click="m_button_border.type = 'solid'; setBorder(true, 'm_button_border', '.messengers-link')"
	  												    		  variant="outline-secondary"
	  												    		  :class="m_button_border.type == 'solid' ? 'active' : ''">
	  												    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
	  													</b-button>
	  												    <b-button style="width: 33.33%"
	  												    		  @click="m_button_border.type = 'dashed'; setBorder(true, 'm_button_border', '.messengers-link')"
	  												    		  variant="outline-secondary"
	  												    		  :class="m_button_border.type == 'dashed' ? 'active' : ''">
	  												    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
	  													</b-button>
	  												    <b-button style="width: 33.34%"
	  												    		  @click="m_button_border.type = 'dotted'; setBorder(true, 'm_button_border', '.messengers-link')"
	  												    		  variant="outline-secondary"
	  												    		  :class="m_button_border.type == 'dotted' ? 'active' : ''">
	  												    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
	  													</b-button>
	  												</b-button-group>
	  											</div>
	  											<div role="group" class="mb-4">
	  												<label>Цвет рамки</label>
	  										    	<b-input-group class="mb-4">
	  										    		<b-input-group-prepend>
	  										    		    <b-btn variant="primary" id="exPopoverReactive-button-border">Выбрать цвет</b-btn>
	  										    		    <b-popover target="exPopoverReactive-button-border"
	  										    		               triggers="click"
	  										    		               placement="left">
	  									    		    		<sketch-picker v-model="m_button_border.color" @input="setBorder(true, 'm_button_border', '.messengers-link')" />
	  										    		    </b-popover>
	  									    		    </b-input-group-prepend>
	  										    	    <b-form-input v-model="m_button_border.color.hex" @input="setBorder(true, 'm_button_border', '.messengers-link')"></b-form-input>
	  										    	</b-input-group>
	  											</div>
	  										</template>
	  									</div>
			    						<div role="group">
			    							<label>Скругление краёв</label>
											<b-input-group append="px">
										    	<b-form-input type="number" v-model="m_button_border.radius"></b-form-input>
											</b-input-group>
			    						</div>
			      		    		</b-tab>
    		      		    		<b-tab title="Тени" class="pt-4 pb-2">
			      						<div role="group">
							    			<b-form-checkbox id="checkbox-button-shadow" :class="m_button_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
								    		                 v-model="m_button_shadow.show" @change="setShadow($event, 'm_button_shadow', '.messengers-link')">
									      		Включить тени
							    		    </b-form-checkbox>
							    		    <template v-if="m_button_shadow.show == true">
												<label>Тени (сдвиг по x)</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="m_button_shadow.x" @change="setShadow(true, 'm_button_shadow', '.messengers-link')"></b-form-input>
												</b-input-group>
												<label>Тени (сдвиг по y)</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="m_button_shadow.y" @change="setShadow(true, 'm_button_shadow', '.messengers-link')"></b-form-input>
												</b-input-group>
												<label>Радиус размытия теней</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="m_button_shadow.blur" @change="setShadow(true, 'm_button_shadow', '.messengers-link')"></b-form-input>
												</b-input-group>
												<label>Цвет тени</label>
										    	<b-input-group class="mb-4">
										    		<b-input-group-prepend>
										    		    <b-btn variant="primary" id="exPopoverReactive-button-shadow">Выбрать цвет</b-btn>
										    		    <b-popover target="exPopoverReactive-button-shadow"
										    		               triggers="click"
										    		               placement="left">
									    		    		<sketch-picker v-model="m_button_shadow.color" @input="setShadow(true, 'm_button_shadow', '.messengers-link')" />
										    		    </b-popover>
									    		    </b-input-group-prepend>
										    	    <b-form-input @input="setShadow(true, 'm_button_shadow', '.messengers-link')" v-model="m_button_shadow.color.hex"></b-form-input>
										    	</b-input-group>
										    	<label>Прозрачность фона</label>
												<div class="d-flex">
												  <div style="width: 60%">
												    <range-slider
												        class="slider_range"
												        min="0"
												        max="100"
												        v-model="m_button_shadow.opacity"
												        @input="setShadow(true, 'm_button_shadow', '.messengers-link')">
												    </range-slider>
												  </div>
												  <p class="ml-3 range_count" style="width: 40%">{{ m_button_shadow.opacity }}%</p>
												</div>
											</template>
										</div>
    		      		    		</b-tab>
								</b-tabs>
							</b-tab>
							<b-tab title="Блок" class="pt-4 pb-2" @click="choiceMessenger()">
								<b-tabs class="more_tabs">
				  					<b-tab title="Цвета" class="pt-4 pb-2">
				  						<div role="group" class="mb-3">
				  						    <label>Цвет фона ползунка</label>
				  						    <b-input-group class="mb-4">
				  						        <b-input-group-prepend>
				  						            <b-btn variant="primary" id="exPopoverReactive-block-bg">Выбрать цвет</b-btn>
				  						            <b-popover target="exPopoverReactive-block-bg"
				  						                       triggers="click"
				  						                       placement="left">
									                    <sketch-picker v-model="m_block_bg.color" @input="setBackground('m_block_bg', '.messengers, .messenger-send')" />
				  						            </b-popover>
				  						        </b-input-group-prepend>
				  						        <b-form-input @input="setBackground('m_block_bg', '.messengers, .messenger-send')" v-model="m_block_bg.color.hex"></b-form-input>
				  						    </b-input-group>
				  						    <label>Прозрачность фона</label>
				  						    <div class="d-flex">
				  						        <div style="width: 60%">
				  						            <range-slider
				  						                class="slider_range"
				  						                min="0"
				  						                max="100"
				  						                v-model="m_block_bg.opacity"
				  						                @input="setBackground('m_block_bg', '.messengers, .messenger-send')">
				  						            </range-slider>
				  						        </div>
				  						        <p class="ml-3 range_count" style="width: 40%">{{ m_block_bg.opacity }}%</p>
				  						    </div>
				  						</div>
				  						<div role="group">
				  						  <label>Цвет текста</label>
				  						    <b-input-group>
				  						    <b-input-group-prepend>
				  						        <b-btn variant="primary" id="exPopoverReactive-block-color">Выбрать цвет</b-btn>
				  						        <b-popover target="exPopoverReactive-block-color"
				  						                   triggers="click"
				  						                   placement="left">
										            <sketch-picker v-model="m_block_color" />
				  						        </b-popover>
				  						      </b-input-group-prepend>
				  						      <b-form-input v-model="m_block_color.hex"></b-form-input>
				  						  </b-input-group>
				  						</div>
				  					</b-tab>
			      		    		<b-tab title="Рамки" class="pt-4 pb-2">
	  									<div role="group" class="mb-3">
			  			    	    		<b-form-checkbox id="checkbox-block-border" :class="m_block_border.show == true ? 'mb-3' : ''"
			  			    	    		                 v-model="m_block_border.show" @change="setBorder($event, 'm_block_border', '.messengers, .messenger-send')">
			  			    		      		Стилизовать границы
			  				    		    </b-form-checkbox>
	  										<template v-if="m_block_border.show == true">
	  											<div role="group" class="mb-4">
	  												<label>Размер границы</label>
	  												<b-input-group append="px">
	  											    	<b-form-input type="number" v-model="m_block_border.size" @change="setBorder(true, 'm_block_border', '.messengers, .messenger-send')"></b-form-input>
	  												</b-input-group>
	  											</div>
	  											<div role="group">
	  												<label>Стиль рамки</label>
	  												<b-button-group class="d-flex mb-4">
	  												    <b-button style="width: 33.33%" 
	  												    		  @click="m_block_border.type = 'solid'; setBorder(true, 'm_block_border', '.messengers, .messenger-send')"
	  												    		  variant="outline-secondary"
	  												    		  :class="m_block_border.type == 'solid' ? 'active' : ''">
	  												    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
	  													</b-button>
	  												    <b-button style="width: 33.33%"
	  												    		  @click="m_block_border.type = 'dashed'; setBorder(true, 'm_block_border', '.messengers, .messenger-send')"
	  												    		  variant="outline-secondary"
	  												    		  :class="m_block_border.type == 'dashed' ? 'active' : ''">
	  												    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
	  													</b-button>
	  												    <b-button style="width: 33.34%"
	  												    		  @click="m_block_border.type = 'dotted'; setBorder(true, 'm_block_border', '.messengers, .messenger-send')"
	  												    		  variant="outline-secondary"
	  												    		  :class="m_block_border.type == 'dotted' ? 'active' : ''">
	  												    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
	  													</b-button>
	  												</b-button-group>
	  											</div>
	  											<div role="group" class="mb-4">
	  												<label>Цвет рамки</label>
	  										    	<b-input-group class="mb-4">
	  										    		<b-input-group-prepend>
	  										    		    <b-btn variant="primary" id="exPopoverReactive-block-border">Выбрать цвет</b-btn>
	  										    		    <b-popover target="exPopoverReactive-block-border"
	  										    		               triggers="click"
	  										    		               placement="left">
	  									    		    		<sketch-picker v-model="m_block_border.color" @input="setBorder(true, 'm_block_border', '.messengers, .messenger-send')" />
	  										    		    </b-popover>
	  									    		    </b-input-group-prepend>
	  										    	    <b-form-input v-model="m_block_border.color.hex" @input="setBorder(true, 'm_block_border', '.messengers, .messenger-send')"></b-form-input>
	  										    	</b-input-group>
	  											</div>
	  										</template>
	  									</div>
			    						<div role="group">
			    							<label>Скругление краёв</label>
											<b-input-group append="px">
										    	<b-form-input type="number" v-model="m_block_border.radius"></b-form-input>
											</b-input-group>
			    						</div>
			      		    		</b-tab>
    		      		    		<b-tab title="Тени" class="pt-4 pb-2">
			      						<div role="group">
							    			<b-form-checkbox id="checkbox-block-shadow" :class="m_block_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
								    		                 v-model="m_block_shadow.show" @change="setShadow($event, 'm_block_shadow', '.messengers, .messenger-send')">
									      		Включить тени
							    		    </b-form-checkbox>
							    		    <template v-if="m_block_shadow.show == true">
												<label>Тени (сдвиг по x)</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="m_block_shadow.x" @change="setShadow(true, 'm_block_shadow', '.messengers, .messenger-send')"></b-form-input>
												</b-input-group>
												<label>Тени (сдвиг по y)</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="m_block_shadow.y" @change="setShadow(true, 'm_block_shadow', '.messengers, .messenger-send')"></b-form-input>
												</b-input-group>
												<label>Радиус размытия теней</label>
												<b-input-group append="px" class="mb-3">
											    	<b-form-input type="number" v-model="m_block_shadow.blur" @change="setShadow(true, 'm_block_shadow', '.messengers, .messenger-send')"></b-form-input>
												</b-input-group>
												<label>Цвет тени</label>
										    	<b-input-group class="mb-4">
										    		<b-input-group-prepend>
										    		    <b-btn variant="primary" id="exPopoverReactive-block-shadow">Выбрать цвет</b-btn>
										    		    <b-popover target="exPopoverReactive-block-shadow"
										    		               triggers="click"
										    		               placement="left">
									    		    		<sketch-picker v-model="m_block_shadow.color" @input="setShadow(true, 'm_block_shadow', '.messengers, .messenger-send')" />
										    		    </b-popover>
									    		    </b-input-group-prepend>
										    	    <b-form-input @input="setShadow(true, 'm_block_shadow', '.messengers, .messenger-send')" v-model="m_block_shadow.color.hex"></b-form-input>
										    	</b-input-group>
										    	<label>Прозрачность фона</label>
												<div class="d-flex">
												  <div style="width: 60%">
												    <range-slider
												        class="slider_range"
												        min="0"
												        max="100"
												        v-model="m_block_shadow.opacity"
												        @input="setShadow(true, 'm_block_shadow', '.messengers, .messenger-send')">
												    </range-slider>
												  </div>
												  <p class="ml-3 range_count" style="width: 40%">{{ m_block_shadow.opacity }}%</p>
												</div>
											</template>
										</div>
    		      		    		</b-tab>
    		      		    		<b-tab title="При наведении" class="pt-4 pb-2">
    			  						<div role="group" class="mb-3">
    			  						    <label>Цвет фона ползунка</label>
    			  						    <b-input-group class="mb-4">
    			  						        <b-input-group-prepend>
    			  						            <b-btn variant="primary" id="exPopoverReactive-hover-bg">Выбрать цвет</b-btn>
    			  						            <b-popover target="exPopoverReactive-hover-bg"
    			  						                       triggers="click"
    			  						                       placement="left">
    								                    <sketch-picker v-model="m_block_hover.color" @input="setBgRoot('m_block_hover', '--m-block-hover')" />
    			  						            </b-popover>
    			  						        </b-input-group-prepend>
    			  						        <b-form-input @input="setBgRoot('m_block_hover', '--m-block-hover')" v-model="m_block_hover.color.hex"></b-form-input>
    			  						    </b-input-group>
    			  						    <label>Прозрачность фона</label>
    			  						    <div class="d-flex">
    			  						        <div style="width: 60%">
    			  						            <range-slider
    			  						                class="slider_range"
    			  						                min="0"
    			  						                max="100"
    			  						                v-model="m_block_hover.opacity"
    			  						                @input="setBgRoot('m_block_hover', '--m-block-hover')">
    			  						            </range-slider>
    			  						        </div>
    			  						        <p class="ml-3 range_count" style="width: 40%">{{ m_block_hover.opacity }}%</p>
    			  						    </div>
    			  						</div>
    		      		    		</b-tab>
    		      		    		<b-tab title="Поле" class="pt-3" @click="thisMessengerPopup()">
	    				    		<b-tabs class="more_tabs">
	      				    			<b-tab title="Цвета" active class="pt-4 pb-2">
				    								<div role="group" class="mb-3">
				    									<label>Цвет фона</label>
				    						    	<b-input-group class="mb-4">
				    						    		<b-input-group-prepend>
				    					    		    <b-btn variant="primary" id="exPopoverReactive-send-input-bg">Выбрать цвет</b-btn>
				    					    		    <b-popover target="exPopoverReactive-send-input-bg"
				    					    		               triggers="click"
				    					    		               placement="right">
			    					    		    		<sketch-picker v-model="send_input_bg.color" @input="setBackground('send_input_bg', '.send_input')" />
				    					    		    </b-popover>
				    				    		    </b-input-group-prepend>
				    					    	    <b-form-input @input="setBackground('send_input_bg', '.send_input')" v-model="send_input_bg.color.hex"></b-form-input>
				    						    	</b-input-group>
				    						    	<label>Прозрачность фона</label>
				    										<div class="d-flex">
				    									    <div style="width: 60%">
				    									        <range-slider
				    									            class="slider_range"
				    									            min="0"
				    									            max="100"
				    									            v-model="send_input_bg.opacity"
				    									            @input="setBackground('send_input_bg', '.send_input')">
				    									        </range-slider>
				    									    </div>
				    									    <p class="ml-3 range_count" style="width: 40%">{{ send_input_bg.opacity }}%</p>
				    										</div>
				    								</div>
	    								    	<div role="group">
	    				    					  <label>Цвет текста</label>
	    				    			    	<b-input-group>
	    				    			    		<b-input-group-prepend>
	    				    			    		    <b-btn variant="primary" id="exPopoverReactive-send-input-color-text">Выбрать цвет</b-btn>
	    				    			    		    <b-popover target="exPopoverReactive-send-input-color-text"
	    				    			    		               triggers="click"
	    				    			    		               placement="left">
	  				    			    		    		<sketch-picker v-model="send_input_color_text" />
	    				    			    		    </b-popover>
	    				    		    		    </b-input-group-prepend>
	    				    			    	    <b-form-input v-model="send_input_color_text.hex"></b-form-input>
	    				    			    	</b-input-group>
	    								    	</div>
	      				    			</b-tab>
	      				    			<b-tab title="Рамки" class="pt-4 pb-2">
	    				    					<div role="group" class="mb-3">
	    					    	    		<b-form-checkbox id="checkbox-input-border"
	    					    	    		                 v-model="send_input_border.show" @change="setBorder($event, 'send_input_border', '.send_input')">
	    					    		      		Стилизовать границы
	    						    		    </b-form-checkbox>
	    				    						<template v-if="send_input_border.show == true">
	    				    							<div role="group" class="mt-3 mb-4">
	    				    								<label>Размер границы</label>
	    				    								<b-input-group append="px">
	    				    							    	<b-form-input type="number" v-model="send_input_border.size" @change="setBorder(true, 'send_input_border', '.send_input')"></b-form-input>
	    				    								</b-input-group>
	    				    							</div>
	    				    							<div role="group">
	    				    								<label>Стиль рамки</label>
	    				    								<b-button-group class="d-flex mb-4">
	    				    								    <b-button style="width: 33.33%" 
	    				    								    		  @click="send_input_border.type = 'solid'; setBorder(true, 'send_input_border', '.send_input')"
	    				    								    		  variant="outline-secondary"
	    				    								    		  :class="send_input_border.type == 'solid' ? 'active' : ''">
	    				    								    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
	    				    									</b-button>
	    				    								    <b-button style="width: 33.33%"
	    				    								    		  @click="send_input_border.type = 'dashed'; setBorder(true, 'send_input_border', '.send_input')"
	    				    								    		  variant="outline-secondary"
	    				    								    		  :class="send_input_border.type == 'dashed' ? 'active' : ''">
	    				    								    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
	    				    									</b-button>
	    				    								    <b-button style="width: 33.34%"
	    				    								    		  @click="send_input_border.type = 'dotted'; setBorder(true, 'send_input_border', '.send_input')"
	    				    								    		  variant="outline-secondary"
	    				    								    		  :class="send_input_border.type == 'dotted' ? 'active' : ''">
	    				    								    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
	    				    									</b-button>
	    				    								</b-button-group>
	    				    							</div>
	    				    							<div role="group" class="mb-4">
	    				    								<label>Цвет рамки</label>
	    				    						    	<b-input-group>
	    				    						    		<b-input-group-prepend>
	    				    						    		    <b-btn variant="primary" id="exPopoverReactive-send-input-border">Выбрать цвет</b-btn>
	    				    						    		    <b-popover target="exPopoverReactive-send-input-border"
	    				    						    		               triggers="click"
	    				    						    		               placement="left">
	  				    						    		    		<sketch-picker v-model="send_input_border.color" @input="setBorder(true, 'send_input_border', '.send_input')" />
	    				    						    		    </b-popover>
	    				    					    		    </b-input-group-prepend>
	    				    						    	    <b-form-input v-model="send_input_border.color.hex" @input="setBorder(true, 'send_input_border', '.send_input')"></b-form-input>
	    				    						    	</b-input-group>
	    				    							</div>
	    				    						</template>
	    				    					</div>
	    				    					<div role="group">
	    				    						<label>Радиус скругления уголков рамки</label>
	    				    						<b-input-group append="px">
	  				    					    	<b-form-input v-model="send_input_border.radius"></b-form-input>
	    				    						</b-input-group>
	    				    					</div>
	      				    			</b-tab>
	      				    			<b-tab title="Тени" class="pt-4 pb-2">
	    				    					<div role="group">
	    							    		  <b-form-checkbox id="checkbox-send-input-shadow" 
	    							    		                   v-model="send_input_shadow.show" @change="setShadow($event, 'send_input_shadow', '.send_input')">
	    								      		Включить тени
	    						    		    </b-form-checkbox>
	    						    		    <template v-if="send_input_shadow.show == true">
	    				    							<div role="group" class="mt-3">
	    				    								<label>Тени (сдвиг по x)</label>
	    				    								<b-input-group append="px" class="mb-3">
	    				    							    	<b-form-input type="number" v-model="send_input_shadow.x" @change="setShadow(true, 'send_input_shadow', '.send_input')"></b-form-input>
	    				    								</b-input-group>
	    				    								<label>Тени (сдвиг по y)</label>
	    				    								<b-input-group append="px" class="mb-3">
	    				    							    	<b-form-input type="number" v-model="send_input_shadow.y" @change="setShadow(true, 'send_input_shadow', '.send_input')"></b-form-input>
	    				    								</b-input-group>
	    				    								<label>Радиус размытия теней</label>
	    				    								<b-input-group append="px" class="mb-3">
	    				    							    	<b-form-input type="number" v-model="send_input_shadow.blur" @change="setShadow(true, 'send_input_shadow', '.send_input')"></b-form-input>
	    				    								</b-input-group>
	    				    								<label>Цвет тени</label>
	    				    						    	<b-input-group class="mb-4">
	    				    						    		<b-input-group-prepend>
	    				    						    		    <b-btn variant="primary" id="exPopoverReactive-send-input-shadow">Выбрать цвет</b-btn>
	    				    						    		    <b-popover target="exPopoverReactive-send-input-shadow"
	    				    						    		               triggers="click"
	    				    						    		               placement="left">
	    				    						    		    		<sketch-picker v-model="send_input_shadow.color" @input="setShadow(true, 'send_input_shadow', '.send_input')" />
	    				    						    		    </b-popover>
	    				    					    		    </b-input-group-prepend>
	    				    						    	    <b-form-input @input="setShadow(true, 'send_input_shadow', '.send_input')" v-model="send_input_shadow.color.hex"></b-form-input>
	    				    						    	</b-input-group>
	    				    						    	<label>Прозрачность фона</label>
	    				      								<div class="d-flex">
				    				                          <div style="width: 60%">
				    				                              <range-slider
				    				                                  class="slider_range"
				    				                                  min="0"
				    				                                  max="100"
				    				                                  v-model="send_input_shadow.opacity"
				    				                                  @input="setShadow(true, 'send_input_shadow', '.send_input')">
				    				                              </range-slider>
				    				                          </div>
				    				                          <p class="ml-3 range_count" style="width: 40%">{{ send_input_shadow.opacity }}%</p>
				    				                      	</div>
	    				    							</div>
	    										    </template>
	    				    					</div>
	      				    			</b-tab>
	    				    		</b-tabs>
    		      		    		</b-tab>
    		      		    		<b-tab title="Кнопка" class="pt-3" @click="thisMessengerPopup()">
    			        		    	<b-tabs class="more_tabs">
    			        		    		<b-tab title="Цвета" class="pt-4 pb-2">
    			  		    					<div role="group" class="mb-4">
    			  		    						<label>Цвет фона</label>
    			  		    				    	<b-input-group class="mb-3">
    			  		    				    		<b-input-group-prepend>
    			  		    				    		    <b-btn variant="primary" id="exPopoverReactive-send-button-bg">Выбрать цвет</b-btn>
    			  		    				    		    <b-popover target="exPopoverReactive-send-button-bg" triggers="click" placement="left">
    					    				    		    		<sketch-picker v-model="send_button_bg.color" @input="setBackground('send_button_bg', '.messenger-btn')" />
    			  		    				    		    </b-popover>
    			  		    			    		    </b-input-group-prepend>
    			  		    				    	    <b-form-input @input="setBackground('send_button_bg', '.messenger-btn')" v-model="send_button_bg.color.hex"></b-form-input>
    			  		    				    	</b-input-group>
    			  		    				    	<label>Прозрачность фона</label>
    			  		    						<div class="d-flex">
    			  		    						    <div style="width: 60%">
    			  		    						        <range-slider
    			  		    						            class="slider_range"
    			  		    						            min="0"
    			  		    						            max="100"
    			  		    						            v-model="send_button_bg.opacity"
    			  		    						            @input="setBackground('send_button_bg', '.messenger-btn')">
    			  		    						        </range-slider>
    			  		    						    </div>
    			  		    						    <p class="ml-3 range_count" style="width: 40%">{{ send_button_bg.opacity }}%</p>
    			  		    						</div>
    			  		    					</div>
    			  		    			    	<div role="group">
    			  		    						<label>Цвет текста</label>
    			  		    				    	<b-input-group>
    			  		    				    		<b-input-group-prepend>
    			  		    				    		    <b-btn variant="primary" id="exPopoverReactive-send-button-color-text">Выбрать цвет</b-btn>
    			  		    				    		    <b-popover target="exPopoverReactive-send-button-color-text"
    			  		    				    		               triggers="click"
    			  		    				    		               placement="left">
    					    				    		    		<sketch-picker v-model="send_button_color_text" />
    			  		    				    		    </b-popover>
    			  		    			    		    </b-input-group-prepend>
    			  		    				    	    <b-form-input v-model="send_button_color_text.hex"></b-form-input>
    			  		    				    	</b-input-group>
    			  		    			    	</div>
    			        		    		</b-tab>
    			        		    		<b-tab title="Рамки" class="pt-4 pb-2">
    					    				    	<div role="group">
    					    				    		<b-form-checkbox id="checkbox-send-button-border" class="mb-3"
    					    				    		                 v-model="send_button_border.show" @change="setBorder($event, 'send_button_border', '.messenger-btn')">
    					    					      		Стилизовать границы
    					    			    		    </b-form-checkbox>
    					    							<template v-if="send_button_border.show == true">
    					    								<div role="group" class="mb-4">
    					    									<label>Размер границы</label>
    					    									<b-input-group append="px">
    					    								    	<b-form-input type="number" v-model="send_button_border.size" @change="setBorder(true, 'send_button_border', '.messenger-btn')"></b-form-input>
    					    									</b-input-group>
    					    								</div>
    					    								<div role="group">
    					    									<label>Стиль рамки</label>
    					    									<b-button-group class="d-flex mb-4">
    					    									    <b-button style="width: 33.33%" 
    					    									    		  @click="send_button_border.type = 'solid'; setBorder(true, 'send_button_border', '.messenger-btn')"
    					    									    		  variant="outline-secondary"
    					    									    		  :class="send_button_border.type == 'solid' ? 'active' : ''">
    					    									    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
    					    										</b-button>
    					    									    <b-button style="width: 33.33%"
    					    									    		  @click="send_button_border.type = 'dashed'; setBorder(true, 'send_button_border', '.messenger-btn')"
    					    									    		  variant="outline-secondary"
    					    									    		  :class="send_button_border.type == 'dashed' ? 'active' : ''">
    					    									    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
    					    										</b-button>
    					    									    <b-button style="width: 33.34%"
    					    									    		  @click="send_button_border.type = 'dotted'; setBorder(true, 'send_button_border', '.messenger-btn')"
    					    									    		  variant="outline-secondary"
    					    									    		  :class="send_button_border.type == 'dotted' ? 'active' : ''">
    					    									    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
    					    										</b-button>
    					    									</b-button-group>
    					    								</div>
    					    								<div role="group" class="mb-4">
    					    									<label>Цвет рамки</label>
    					    							    	<b-input-group class="mb-4">
    					    							    		<b-input-group-prepend>
    					    							    		    <b-btn variant="primary" id="exPopoverReactive-send-button-border">Выбрать цвет</b-btn>
    					    							    		    <b-popover target="exPopoverReactive-send-button-border"
    					    							    		               triggers="click"
    					    							    		               placement="left">
    					    							    		      	<template slot="title">
    					    							    		    		<sketch-picker v-model="send_button_border.color" @input="setBorder(true, 'send_button_border', '.messenger-btn')" />
    					    							    		    	</template>
    					    							    		    </b-popover>
    					    						    		    </b-input-group-prepend>
    					    							    	    <b-form-input v-model="send_button_border.color.hex" @input="setBorder(true, 'send_button_border', '.messenger-btn')"></b-form-input>
    					    							    	</b-input-group>
    					    								</div>
    					    							</template>
    					    				    	</div>
    					    				    	<div role="group">
    					    				    		<label>Радиус скругления уголков рамки</label>
    					    				    		<b-input-group append="px">
    					    				    	    	<b-form-input type="number" v-model="send_button_border.radius"></b-form-input>
    					    				    		</b-input-group>
    					    				    	</div>
    			        		    		</b-tab>
    			        		    		<b-tab title="Тени" class="pt-4 pb-2">
    					    						<div role="group">
    					    				    		<b-form-checkbox id="checkbox-send-button-shadow"
    					    				    		                 v-model="send_button_shadow.show" @change="setShadow($event, 'send_button_shadow', '.messenger-btn')">
    					    					      		Включить тени
    					    			    		    </b-form-checkbox>
    					    			    		    <template v-if="send_button_shadow.show == true">
    					    							<div role="group" class="mt-3">
    					    								<label>Тени (сдвиг по x)</label>
    					    								<b-input-group append="px" class="mb-3">
    					    							    	<b-form-input type="number" v-model="send_button_shadow.x" @change="setShadow(true, 'send_button_shadow', '.messenger-btn')"></b-form-input>
    					    								</b-input-group>
    					    								<label>Тени (сдвиг по y)</label>
    					    								<b-input-group append="px" class="mb-3">
    					    							    	<b-form-input type="number" v-model="send_button_shadow.y" @change="setShadow(true, 'send_button_shadow', '.messenger-btn')"></b-form-input>
    					    								</b-input-group>
    					    								<label>Радиус размытия теней</label>
    					    								<b-input-group append="px" class="mb-3">
    					    							    	<b-form-input type="number" v-model="send_button_shadow.blur" @change="setShadow(true, 'send_button_shadow', '.messenger-btn')"></b-form-input>
    					    								</b-input-group>
    					    								<label>Цвет тени</label>
    					    						    	<b-input-group class="mb-4">
    					    						    		<b-input-group-prepend>
    					    						    		    <b-btn variant="primary" id="exPopoverReactive-send-button-shadow">Выбрать цвет</b-btn>
    					    						    		    <b-popover target="exPopoverReactive-send-button-shadow"
    					    						    		               triggers="click"
    					    						    		               placement="left">
    					    						    		      	<template slot="title">
    					    						    		    		<sketch-picker v-model="send_button_shadow.color" @input="setShadow(true, 'send_button_shadow', '.messenger-btn')" />
    					    						    		    	</template>
    					    						    		    </b-popover>
    					    					    		    </b-input-group-prepend>
    					    						    	    <b-form-input @input="setShadow(true, 'send_button_shadow', '.messenger-btn')" v-model="send_button_shadow.color.hex"></b-form-input>
    					    						    	</b-input-group>
    					    						    	<label>Прозрачность фона</label>
    					    								<div class="d-flex">
    			      		    	    			        <div style="width: 60%">
    			      		    	    			            <range-slider
    			      		    	    			                class="slider_range"
    			      		    	    			                min="0"
    			      		    	    			                max="100"
    			      		    	    			                v-model="send_button_shadow.opacity"
    			      		    	    			                @input="setShadow(true, 'send_button_shadow', '.messenger-btn')">
    			      		    	    			            </range-slider>
    			      		    	    			        </div>
    			      		    	    			        <p class="ml-3 range_count" style="width: 40%">{{ send_button_shadow.opacity }}%</p>
    			      		    	    			    </div>
    					    							</div>
    					    							</template>
    					    						</div>	
    			        		    		</b-tab>
    			        		    	</b-tabs>
    		      		    		</b-tab>
								</b-tabs>
							</b-tab>
						</b-tabs>
					</template>
					<template v-if="whichPopover == 'link'">
						<div role="group" class="pt-3 pb-2">
							<label>Цвет ссылки</label>
							<b-input-group>
							    <b-input-group-prepend>
							        <b-btn variant="primary" id="exPopoverReactive-link-color-text">Выбрать цвет</b-btn>
							        <b-popover target="exPopoverReactive-link-color-text"
							                   triggers="click"
							                   placement="right"
							                   container="myContainer">
							            <template slot="title">
							                <sketch-picker v-model="link_color_text" />
							            </template>
							        </b-popover>
							    </b-input-group-prepend>
							    <b-form-input v-model="link_color_text.hex"></b-form-input>
							</b-input-group>
						</div>
					</template>
					</slot>
				</section>
			</div>
		</template>
	</div>
</template>

<script>
	import * as fb from 'firebase'

	import { Container, Draggable } from "vue-smooth-dnd";
	import { Sketch } from 'vue-color';
	import RangeSlider from 'vue-range-slider';
	import 'vue-range-slider/dist/vue-range-slider.css';
	import { Jumper } from 'vue-loading-spinner';
	import ClipLoader from 'vue-spinner/src/ClipLoader.vue';

	export default {
		components: { Container, Draggable, 'sketch-picker': Sketch, RangeSlider, Jumper, ClipLoader },
		data() {
			return {
				whichPopover: '',
				allFonts: [],
				selectedFont: 'PT Sans Caption',
				q_spinner: true,
				quiz_name: '',
				resultTitleQ: 'Остался последний шаг. Заберите результаты теста и подарки!',
				resultDescQ: 'Вы гарантировано получите:',
				resultAddGifts: 'Сравнительная таблица поставщиков услуг',
				addGiftsList: [
					'Сравнительная таблица поставщиков услуг',
					'Расчет Вашего возможного дохода от арендной платы и коммерческое предложение',
					'Каталог автоматов, которые подходят именно для Вашей организации'
				],
				btnText: 'Получить результат',
				politicsUrl: '',
				inputs: [
					{
						show: false,
						type: 'text',
						name: 'Имя',
						placeholder: 'Как к вам обращаться?',
						required: true
					},
					{
						show: true,
						type: 'text',
						name: 'Телефон',
						placeholder: 'Введите ваш номер телефона',
						required: false
					},
					{
						show: false,
						type: 'email',
						name: 'Email',
						placeholder: 'Электронный ящик для отправки расчета',
						required: false
					}
				],
				phoneMask: '',
				selectMask: null,
				readyMask: '',
				choiceMasks: [
			        { value: null, text: 'Выбрать готовую подсказку', disabled: true },
			        { value: '+7 (###) ###-##-##', text: '+7 (###) ###-##-##' },
			        { value: '+38 (###) ###-##-##', text: '+38 (###) ###-##-##' },
			        { value: '+375 (##) ###-##-##', text: '+375 (##) ###-##-##' }
			    ],
			    userInputPhone: '',
			    messengerLink: [
			    	{
			    		name: 'Telegram',
			    		src: 'telegram_btn.png',
			    		show: true,
			    		label: 'Введите номер или логин Telegram',
			    		placeholder: '+7 (999) 999-99-99'
			    	},
			    	{
			    		name: 'Viber',
			    		src: 'viber_btn.png',
			    		show: true,
			    		label: 'Введите номер Viber',
			    		placeholder: '+7 (999) 999-99-99'
			    	},
			    	{
			    		name: 'WhatsApp',
			    		src: 'whatsapp_btn.png',
			    		show: false,
			    		label: 'Введите номер WhatsApp',
			    		placeholder: '+7 (999) 999-99-99'
			    	},
			    	{
			    		name: 'Messenger',
			    		src: 'messenger_btn.png',
			    		show: false,
			    		label: 'Введите логин или id Messenger',
			    		placeholder: 'login'
			    	},
			    	{
			    		name: 'VK',
			    		src: 'vk_btn.png',
			    		show: false,
			    		label: 'Введите логин или id VK',
			    		placeholder: 'id123456789'
			    	},
			    ],
			    messengerBtnText: 'Send',
			    messengersTitle: 'Куда присылать результаты?',
			    lastVideoElements: [{
			    	src: '',
			    	readySrc: '',
			    	localSrc: '',
			    	autoplay: false
			    }],
			    lastConsultantElements: '',
			    linkLocation: {
			    	show: false,
			    	url: ''
			    },

                // Quiz-pattern

				questionIndex: 0,
				currentQ: 0,
				questions: [],

				config: '',
				galleryElements: [],
				youtubePlayer: 'true',
				videoElements: [],
				localVideo: null,

				consultantName: '',
				consultantDescription: '',
				consultantImg: null,
				consultantImgSrc: '',
				moreConsultantText: [],
				consultantElements: [],

				addBlockElements: [],

				answersFinal: [],
				v_q: '',
				v_qCheck: [],
				v_qChoices: [],
				v_range: 0,
				//
				infoHeight: 0,

		        sliderAllCount: 0,
		        sliderActive: 0,
		        sliderOffsetLeft: 0,
		        sliderOffsetStep: 0,

                animation: true,
                loaderCheck: '',
                customEmails: [],
				readyEmail: [],
				metrika: '',
				analytics: '',
				autoOpenCh: false,
				autoOpen: false,
				exitOpen: false,
				exitOpenOnce: false,
				modal: 'full',

                // Edit

                styleMode: false,
                showPopover: false,

		        
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
				bg_image_raw: 'MHA.JR_201708_038.jpg',
				bg_image: '',
				bg_image_src: '',
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
		        head_logo: null,
		        head_logo_src: '',
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
        		send_button_bg: {
        			color: { 
                    	"hsl": { "h": 212.3684210526316, "s": 0.7238095238095237, "l": 0.5882352941176471, "a": 1 },
                    	"hex": "#4A90E2", "hex8": "#4A90E2FF", 
                    	"rgba": { "r": 74, "g": 144, "b": 226, "a": 1 }, 
                    	"hsv": { "h": 212.3684210526316, "s": 0.6725663716814159, "v": 0.8862745098039215, "a": 1 },
                    	"oldHue": 150, "source": "hex", "a": 1 
                    },
        			opacity: 100
        		},
        		send_button_color_text: {
        			"hsl": { "h": 0, "s": 0, "l": 1, "a": 1 }, 
        			"hex": "#FFFFFF", "hex8": "#FFFFFFFF", 
        			"rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }, 
        			"hsv": { "h": 0, "s": 0, "v": 1, "a": 1 }, 
        			"oldHue": 0, 
        			"source": "hex", "a": 1
        		},
        		send_button_border: {
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
        		send_button_shadow: {
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
		    	send_input_bg: {
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
			    send_input_color_text: { 
			    	"hsl": { "h": 0, "s": 0, "l": 0, "a": 1 }, 
					"hex": "#000000", "hex8": "#000000FF", 
					"rgba": { "r": 0, "g": 0, "b": 0, "a": 1 }, 
					"hsv": { "h": 0, "s": 0, "v": 0, "a": 1 }, 
					"oldHue": 0, 
					"source": "hsva", "a": 1 
				},
				send_input_border: {
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
				send_input_shadow: {
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
		beforeMount() {
			
		},
		mounted() {
			let idQuiz = this.$router.history.current.params.id,
				localQuiz = 'quiz_' + idQuiz,
				urlQuiz = 'https://myquiz-9b908.firebaseio.com/quizzes/' + idQuiz +'.json';

			this.$http.get(urlQuiz).then((response) => {
				//console.log(response);
				//console.log(JSON.parse(response.bodyText));
				//console.log(JSON.parse(response.bodyText).quiz_name);

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
					this.bgOverlay(this.bg_overlay.show);
					setTimeout(() => {
						//this.$el.querySelector('#quiz').style.backgroundImage = "url(../../static/questions/"+ this.bg_image_raw +" )";
						this.$el.querySelector('#quiz').style.backgroundImage = this.bg_image_src;
					}, 0);
					this.radioStyleChange();
					this.radioActiveImage();
					this.checkboxRadius();
					this.checkboxActiveImage();
					this.calendarHoverColor();
					this.calendarActiveColor();
					this.rangeThumb();
					//
					this.setBackground('progress_bg', '.progress');
					this.setBackground('question_bg', '.question');
					this.setBackground('question_index_bg', '.question-number');
					this.setBackground('button_bg', '.next-questions');
					this.setBackground('input_bg', '.quiz_inputs');
					this.setBackground('calendar_bg', '.calendar');
					this.setBackground('calendar_active_bg', 'tbody td.selected');
					this.setBackground('gift_bg', '.quiz-gifts'); 
					this.setBackground('gift_bg', '.gift-one');
					this.setBackground('result_bg', '.results-header');
					this.setBackground('info_bg', '.home-item__info');
					this.setBackground('arrows_bg', '.slider-prev'); 
					this.setBackground('arrows_bg', '.slider-next');
					this.setBackground('tooltip_title_bg', '.tooltip-title');
					this.setBackground('tooltip_text_bg', '.tooltip-text');
					this.setBackground('consultant_bg', '.consultant');
					this.setBackground('consultant_words_bg', '.expert-says');
					//
					this.setBgRoot('radio_bg', '--radio-background');
					this.setBgRoot('radio_hover_bg', '--radio-hover-background');
					this.setBgRoot('radio_before_bg', '--radio-before-background');
					this.setBgRoot('radio_active_bg', '--radio-hover-shadow');
					this.setBgRoot('checkbox_bg', '--checkbox-background');
					this.setBgRoot('checkbox_hover_bg', '--checkbox-hover-background');
					this.setBgRoot('checkbox_before_bg', '--checkbox-before-background');
					this.setBgRoot('checkbox_active_bg', '--checkbox-checked');
					//
					this.setBorder(this.progress_border.show, 'progress_border', '.progress');
					this.setBorder(this.question_border.show, 'question_border', '.question');
					this.setBorder(this.question_index_border.show, 'question_index_border', '.question-number');
					this.setBorder(this.button_border.show, 'button_border', '.next-questions');
					this.setBorderRoot(this.radio_border.show, 'radio_border', '--radio-border');
					this.setBorder(this.input_border.show, 'input_border', '.quiz_inputs');
					this.setBorderRoot(this.checkbox_border.show, 'checkbox_border', '--checkbox-border');
					this.setBorder(this.calendar_border.show, 'calendar_border', '.calendar');
					this.setBorder(this.gift_border.show, 'gift_border', '.quiz-gifts'); 
					this.setBorder(this.gift_border.show, 'gift_border', '.gift-one');
					this.setBorder(this.result_border.show, 'result_border', '.results-header');
					this.setBorder(this.info_border.show, 'info_border', '.home-item__info');
					this.setBorder(this.arrows_border.show, 'arrows_border', '.slider-prev');
					this.setBorder(this.arrows_border.show, 'arrows_border', '.slider-next');
					this.setBorder(this.tooltip_image_border.show, 'tooltip_image_border', '.tooltip-image');
					this.setBorder(this.consultant_border.show, 'consultant_border', '.consultant');
					this.setBorder(this.consultant_image_border.show, 'consultant_image_border', '.expert-img-img');
					this.setBorder(this.consultant_words_border.show, 'consultant_words_border', '.expert-says');
					//
					this.setBorderRoot(this.radio_border.show, 'radio_border', '--radio-border');
					this.setBorderRoot(this.checkbox_border.show, 'checkbox_border', '--checkbox-border');
					//
					this.setShadow(this.progress_shadow.show, 'progress_shadow', '.progress');
					this.setShadow(this.progressbar_shadow.show, 'progressbar_shadow', '.progress-bar');
					this.setShadow(this.question_shadow.show, 'question_shadow', '.question');
					this.setShadow(this.question_index_shadow.show, 'question_index_shadow', '.question-number');
					this.setShadow(this.button_shadow.show, 'button_shadow', '.next-questions');
					this.setShadowRoot(this.radio_shadow.show, 'radio_shadow', '--radio-shadow');
					this.setShadowRoot(this.radio_hover_shadow.show, 'radio_hover_shadow', '--radio-hover-shadow');
					this.setShadowRoot(this.radio_before_shadow.show, 'radio_before_shadow', '--radio-before-shadow');
					this.setShadow(this.input_shadow.show, 'input_shadow', '.quiz_inputs');
					this.setShadowRoot(this.checkbox_shadow.show, 'checkbox_shadow', '--checkbox-shadow');
					this.setShadowRoot(this.checkbox_hover_shadow.show, 'checkbox_hover_shadow', '--checkbox-hover-shadow');
					this.setShadowRoot(this.checkbox_before_shadow.show, 'checkbox_before_shadow', '--checkbox-before-shadow');
					this.setShadow(this.calendar_shadow.show, 'calendar_shadow', '.calendar');
					this.setShadow(this.range_shadow.show, 'range_shadow', '.range-positive');
					this.setShadow(this.gift_shadow.show, 'gift_shadow', '.quiz-gifts'); 
					this.setShadow(this.gift_shadow.show, 'gift_shadow', '.gift-one');
					this.setShadow(this.result_shadow.show, 'result_shadow', '.results-header');
					this.setShadow(this.info_shadow.show, 'info_shadow', '.slider');
					this.setShadow(this.arrows_shadow.show, 'arrows_shadow', '.slider-prev'); 
					this.setShadow(this.arrows_shadow.show, 'arrows_shadow', '.slider-next');
					this.setShadow(this.tooltip_image_shadow.show, 'tooltip_image_shadow', '.tooltip-image');
					this.setShadow(this.tooltip_title_shadow.show, 'tooltip_title_shadow', '.tooltip-title');
					this.setShadow(this.tooltip_text_shadow.show, 'tooltip_text_shadow', '.tooltip-text');
					this.setShadow(this.consultant_shadow.show, 'consultant_shadow', '.consultant');
					this.setShadow(this.consultant_image_shadow.show, 'consultant_image_shadow', '.expert-img-img');
					this.setShadow(this.consultant_words_shadow.show, 'consultant_words_shadow', '.expert-says');
					this.setBackground('m_button_bg', '.messengers-link');
					this.setBorder(this.m_button_border.show, 'm_button_border', '.messengers-link');
					this.setShadow(this.m_button_shadow.show, 'm_button_shadow', '.messengers-link');
					this.setBackground('m_block_bg', '.messengers, .messenger-send');
					this.setBorder(this.m_block_border.show, 'm_block_border', '.messengers, .messenger-send');
					this.setShadow(this.m_block_shadow.show, 'm_block_shadow', '.messengers, .messenger-send');
					this.setBgRoot('m_block_hover', '--m-block-hover');
					this.changeFont(this.selectedFont);
					this.setBackground('send_input_bg', '.send_input');
					this.setBorder(this.send_input_border.show, 'send_input_border', '.send_input');
					this.setShadow(this.send_input_shadow.show, 'send_input_shadow', '.send_input');
					this.setBackground('send_button_bg', '.messenger-btn');
					this.setBorder(this.send_button_border.show, 'send_button_border', '.messenger-btn');
					this.setShadow(this.send_button_shadow.show, 'send_button_shadow', '.messenger-btn');

					this.currentQ = this.questions.length + 1;

					this.changeProgress;

					if(this.config == 'gallery') {
						setTimeout(() => {
							this.infoHeight = document.querySelector('.home-item__info').offsetHeight;

							var infoHeight = 420 + this.infoHeight + 'px';

							document.querySelector('.js-slider').style.height = infoHeight;

							for(var i = 0; i < document.querySelectorAll('.home-item__info').length; i++) {
								document.querySelectorAll('.home-item__info')[i].style.bottom = '-' + this.infoHeight + 'px';
							}
						}, 0);

						this.initSlider();
						this.openSlide(this.sliderActive);

						window.addEventListener('resize', () => {
						 	this.initSlider();
							this.openSlide(this.sliderActive);
						});
					}

					this.q_spinner = false;
				}, 0)
			}, (response) => {
				console.log(response);
			});

			this.$http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCQRU_i-GNWxU3dikp5E2Z0oe9btPKeyfU').then((response) => {
				let fonts = response.body.items;
				let myFonts = [];

				myFonts = fonts.filter(array => {
					for(let a of array.subsets) {
						if (a === 'cyrillic') {
							return true
						}
					}
				})

				for(let obj of myFonts) {
					delete obj['category'];
					delete obj['kind'];
					delete obj['lastModified'];
					delete obj['subsets'];
					delete obj['variants'];
					delete obj['version'];

					delete Object.assign(obj, {['value']: obj['family'] })['family'];

					obj['text'] = obj['value']
				}

				this.allFonts = Object.values(myFonts);
			}, (response) => {
				console.log(response);
			});
		},
		computed: {
			moreGalleryInfo() {
				let result = {},
					v = 0,
					k = 0;

				for (var i = 0; i < this.galleryElements[0].more_values.length * 2; i++) {
					if(i % 2 != 0) {
						result[i] = '';
						k++;
					} else {
						result[i] = this.galleryElements[0].more_keys[v];
						v++;
					}
				}

				return result
			},
			changeProgress() {
				setTimeout(() => {
					this.$refs.progress.innerHTML = 100 + '%';
					
				}, 0)
				return '100%'
			},
			filterSlider() {
				this.sliderAllCount = this.galleryElements.length;

				return this.galleryElements;
			},
			countInfo() {
				return this.galleryElements[0].more_keys.length
			},
		},
		methods: {
			async hoverCSS() {
				if(this.styleMode === true) {
					let objHover = this.$el.querySelectorAll('.editor-overlay');

					let styler = new PseudoStyler();
					await styler.loadDocumentStyles();

					for (var i = 0; i < objHover.length; i++) {
						styler.toggleStyle(objHover[i], ':hover');
					}

					setTimeout(() => {
						for (var i = 0; i < objHover.length; i++) {
							styler.toggleStyle(objHover[i], ':hover');
						}
					}, 750);
				}
			},
			changeAddGiftsList(e, index) {
				this.addGiftsList.splice(index, 1, e.target.value);
			},
			deleteAddGiftsList(index) {
				this.addGiftsList.splice(index, 1);
			},
			addAddGiftsList() {
				this.addGiftsList.push('');
			},
			editInputs(index, type) {
				this.$root.$emit('bv::show::modal', 'modal-input');

				this.$refs.modal_input.$refs.body.setAttribute('data-input-index', index);

				let placeholderI = this.$refs.input_placeholder.$el;
				placeholderI.value = this.inputs[index].placeholder;

				this.$refs.checkbox_req.$el.querySelector('input').checked = this.inputs[index].required;

				if(type == 'Телефон') {
					this.$refs.input_mask_block.style.display = 'block'
				}
			},
			choiceMask(e) {
				this.$refs.input_mask.$el.value = e;
			},
			confirmInput() {
				let index = this.$refs.modal_input.$refs.body.getAttribute('data-input-index');

				this.readyMask = this.$refs.input_mask.$el.value;

				let placeholderI = this.$refs.input_placeholder.$el;
				this.inputs[index].placeholder = placeholderI.value;

				this.$root.$emit('bv::hide::modal', 'modal-input');
			},
			closeInputs() {
				this.$root.$emit('bv::hide::modal', 'modal-input');

				this.$refs.input_mask.$el.value = this.readyMask;
			},
			hideInputs() {
				this.$refs.input_mask_block.style.display = 'none'
			},
			changeReq() {
				let index = this.$refs.modal_input.$refs.body.getAttribute('data-input-index');
				
				this.inputs[index].required = !(this.inputs[index].required)
			},
			choiceMessenger() {
				let count = 0;
				for (var i = 0; i < this.messengerLink.length; i++) {
					if(this.messengerLink[i].show == true) {
						count++;
					}
				}

				if(count == 1) {
					let target = '';
					for (var i = 0; i < this.$refs.messengers.querySelectorAll('.messengers-item').length; i++) {
						if(this.$refs.messengers.querySelectorAll('.messengers-item')[i].attributeStyleMap.size == 0) {
							target = this.$refs.messengers.querySelectorAll('.messengers-item')[i].querySelector('span').innerHTML;
						}
					}

					this.$refs.messenger_send.style.display = 'block';

					for (var i = 0; i < this.$refs.messenger_choose.length; i++) {
						if(target == this.$refs.messenger_choose[i].querySelector('span').innerHTML) {
							this.$refs.messenger_choose[i].style.display = 'block';
						}
					}

					this.$refs.messengers.style.display = 'none';

					for (var i = 0; i < this.$refs.main_inputs.length; i++) {
						this.$refs.main_inputs[i].style.display = 'none';
						this.$refs.messenger_change[i].style.display = 'none';
						this.$refs.messenger_back[i].style.display = 'block';
					}
					this.$refs.main_btn.style.display = 'none';
					this.$refs.messengers_link.style.display = 'none';
				} else {
					for (var i = 0; i < this.$refs.main_inputs.length; i++) {
						this.$refs.main_inputs[i].style.display = 'none';
					}
					this.$refs.main_btn.style.display = 'none';
					this.$refs.messengers_link.style.display = 'none';
					this.$refs.messengers.style.display = 'block';
				}
			},
			messengerBack() {
				for (var i = 0; i < this.$refs.main_inputs.length; i++) {
					this.$refs.main_inputs[i].style.display = 'block';
				}
				this.$refs.main_btn.style.display = 'block';
				this.$refs.messengers_link.style.display = 'flex';
				this.$refs.messengers.style.display = 'none';

				this.$refs.messenger_send.style.display = 'none';

				for (var i = 0; i < this.$refs.messenger_choose.length; i++) {
					this.$refs.messenger_choose[i].style.display = 'none';
				}
			},
			thisMessenger(name) {
				this.$refs.messenger_send.style.display = 'block';

				for (var i = 0; i < this.$refs.messenger_choose.length; i++) {
					if(name == this.$refs.messenger_choose[i].querySelector('span').innerHTML) {
						this.$refs.messenger_choose[i].style.display = 'block';
						this.$refs.messenger_back[i].style.display = 'none';
						this.$refs.messenger_change[i].style.display = 'block';
					}
				}

				this.$refs.messengers.style.display = 'none';
			},
			thisMessengerPopup() {
				let name = '';

				for(var i = 0; i < this.messengerLink.length; i++) {
					if(this.messengerLink[i].show == true) {
						name = this.messengerLink[i].name;
						break;
					}
				}

				this.$refs.messenger_send.style.display = 'block';

				for (var i = 0; i < this.$refs.messenger_choose.length; i++) {
					if(name == this.$refs.messenger_choose[i].querySelector('span').innerHTML) {
						this.$refs.messenger_choose[i].style.display = 'block';
						this.$refs.messenger_back[i].style.display = 'none';
						this.$refs.messenger_change[i].style.display = 'block';
					}
				}

				this.$refs.messengers.style.display = 'none';
			},
			messengerChange() {
				this.$refs.messenger_send.style.display = 'none';

				for (var i = 0; i < this.$refs.messenger_choose.length; i++) {
					this.$refs.messenger_choose[i].style.display = 'none';
				}

				this.$refs.messengers.style.display = 'block';
			},
			closePlaceholder() {
				this.$root.$emit('bv::hide::modal', 'modal-placeholder');
			},
			autoplayOn(e) {
				if(e == true) {
					this.lastVideoElements[0].autoplay = e;

					this.lastVideoElements[0].readySrc += '?autoplay=1';
					this.$refs.video_local.autoplay = true;

					this.$refs.video_local.load();
				} else {
					this.lastVideoElements[0].autoplay = e;

					this.lastVideoElements[0].readySrc = this.lastVideoElements[0].readySrc.replace('?autoplay=1', '');
					this.$refs.video_local.autoplay = false;
					
					this.$refs.video_local.load();
				}
			},
			async uploadVideo(e) {
				let idQuiz = this.$router.history.current.params.id;
				const file = e.target.files[0];

				let helpRef = '';
				await fb.storage().ref(`quiz/${idQuiz}_lastvideo`).put(file).then((res) => {
					helpRef = res.metadata.fullPath;
				});

				await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
					this.lastVideoElements[0].localSrc = url;
				});

				this.$refs.video_local.load();
			},

			initSlider() {
			    setTimeout(() => {
			    	var sliderBody = this.$el.querySelector('.js-slider');
			    	this.sliderOffsetStep = sliderBody.clientWidth;
			    }, 3)
			},
			openSlide: function (id) {
			    if (id > 0 && id <= this.sliderAllCount) {
			    	this.sliderActive = id
			    	this.sliderOffsetLeft = -(this.sliderActive * this.sliderOffsetStep - this.sliderOffsetStep)
			    }
			},
			nextSlide: function () {
			    if(this.sliderActive < this.sliderAllCount) {
			        this.sliderActive += 1;
					this.openSlide(this.sliderActive);
			    } else if(this.sliderActive == this.sliderAllCount) {
	    	        this.sliderActive = 1;
	    			this.openSlide(this.sliderActive);
			   	}
			},
		    prevSlide: function () {
			    if(this.sliderActive > 1) {
			        this.sliderActive -= 1;
					this.openSlide(this.sliderActive);
			    } else if(this.sliderActive == 1) {
	    	        this.sliderActive = this.sliderAllCount;
	    			this.openSlide(this.sliderActive);
			   	}
		    },
		    changeYoutubeLink() {
		    	if(this.lastVideoElements[0].src == '') {
					this.lastVideoElements[0].readySrc = '';
		    	} else {
		    		let e = this.lastVideoElements[0].src;

		    		let linkParts = e.split('/');
		    		let link = linkParts[3];

		    		if(link.includes('watch?v=')) {
		    			link = link.replace('watch?v=', '');
		    		}

		    		this.lastVideoElements[0].readySrc = link;
		    	}
		    },

		    onDrop(dropResult) {
		    	this.inputs = this.applyDrag(this.inputs, dropResult);
		    },
		    applyDrag(arr, dragResult) {
		    	const { removedIndex, addedIndex, payload } = dragResult
		    	if (removedIndex === null && addedIndex === null) return arr

		    	const result = [...arr]
		    	let itemToAdd = payload

		    	if (removedIndex !== null) {
		    		itemToAdd = result.splice(removedIndex, 1)[0]
		    	}

		    	if (addedIndex !== null) {
		    		result.splice(addedIndex, 0, itemToAdd)
		    	}

		    	return result
		    },
        	showModalPop(e, pos) {
        		if(this.styleMode == true) {
        			this.showPopover = true;

	        		setTimeout(() => {
		    			let elemCoordinates = e.target.getBoundingClientRect(),
		    				myModalWidth = this.$el.querySelector('.my_modal_popover').offsetWidth,
		    				myModalHeight = this.$el.querySelector('.my_modal_popover').offsetHeight;

		    				function getCoords(elem) {
		    				  var box = elem.getBoundingClientRect();

		    				  var body = document.body;
		    				  var docEl = document.documentElement;

		    				  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		    				  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

		    				  var clientTop = docEl.clientTop || body.clientTop || 0;
		    				  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

		    				  var top = box.top + scrollTop - clientTop;
		    				  var left = box.left + scrollLeft - clientLeft;

		    				  return {
		    				    top: top,
		    				    left: left
		    				  };
		    				}

		    				let thisElemC = getCoords(e.target);

		    			switch (pos) {
		    				case 'bottom':
		    						this.$el.querySelector('.my_modal_popover').style.top = thisElemC.top + elemCoordinates.height + 15 + 'px';
		    						this.$el.querySelector('.my_modal_popover').style.left = (elemCoordinates.left + elemCoordinates.right) / 2 - myModalWidth / 2 + 'px';
								break;
							case 'top':
									this.$el.querySelector('.my_modal_popover').style.top = thisElemC.top - myModalHeight - 15 + 'px';
									this.$el.querySelector('.my_modal_popover').style.left = (elemCoordinates.left + elemCoordinates.right) / 2 - myModalWidth / 2 + 'px';
								break;
							case 'left':
								if(elemCoordinates.left - myModalWidth - 15 < 30) {
									if (elemCoordinates.top - myModalHeight - 15 < 30) {
										this.$el.querySelector('.my_modal_popover').style.top = thisElemC.top + elemCoordinates.height + 15 + 'px';
										this.$el.querySelector('.my_modal_popover').style.left = (elemCoordinates.left + elemCoordinates.right) / 2 - myModalWidth / 2 + 'px';
									} else {
										this.$el.querySelector('.my_modal_popover').style.top = thisElemC.top - myModalHeight - 15 + 'px';
										this.$el.querySelector('.my_modal_popover').style.left = (elemCoordinates.left + elemCoordinates.right) / 2 - myModalWidth / 2 + 'px';
									}
								} else {
									this.$el.querySelector('.my_modal_popover').style.top = (thisElemC.top + thisElemC.top + elemCoordinates.height) / 2 - myModalHeight / 2 + 'px';
									this.$el.querySelector('.my_modal_popover').style.left = elemCoordinates.left - myModalWidth - 15 + 'px';
								}
								break;
							case 'right':
								if(elemCoordinates.right + myModalWidth + 15 > elemCoordinates.left + elemCoordinates.right + elemCoordinates.width) {
									if (elemCoordinates.top - myModalHeight - 15 < 30) {
										this.$el.querySelector('.my_modal_popover').style.top = thisElemC.top + elemCoordinates.height + 15 + 'px';
										this.$el.querySelector('.my_modal_popover').style.left = (elemCoordinates.left + elemCoordinates.right) / 2 - myModalWidth / 2 + 'px';
									} else {
										this.$el.querySelector('.my_modal_popover').style.top = thisElemC.top - myModalHeight - 15 + 'px';
										this.$el.querySelector('.my_modal_popover').style.left = (elemCoordinates.left + elemCoordinates.right) / 2 - myModalWidth / 2 + 'px';
									}
								} else {
									this.$el.querySelector('.my_modal_popover').style.top = (thisElemC.top + thisElemC.top + elemCoordinates.height) / 2 - myModalHeight / 2 + 'px';
									this.$el.querySelector('.my_modal_popover').style.left = elemCoordinates.right + 15 + 'px';
								}
	        			}
	        		}, 0)
        		}
        	},
        	closePopover() {
				this.showPopover = false;
        	},
        	bgOverlay(e) {
        		if(e == true) {
        			let a = this.bg_overlay.opacity / 100;

        			this.$el.querySelector('section').style.boxShadow = 'inset 0 0 0 2000px rgba(' + this.bg_overlay.color.rgba.r + ',' + this.bg_overlay.color.rgba.g + ',' + this.bg_overlay.color.rgba.b + ',' + a + ')';
        		} else {
        			this.$el.querySelector('section').style.boxShadow = '';
        		}
        	},
        	radioStyleChange(e) {
        		document.documentElement.style.setProperty('--radio-width-height', this.radio_width_and_height + 'px');
        		document.documentElement.style.setProperty('--radio-width-height', this.radio_width_and_height + 'px');
        	},
        	radioActiveImage() {
        		let check = this.radio_active_image;
        		if(check == false) {
        			document.documentElement.style.setProperty('--inputs-check', '');
        		} else {
        			document.documentElement.style.setProperty('--inputs-check', 'none');
        		}
        	},
        	checkboxRadius() {
        		document.documentElement.style.setProperty('--checkbox-radius', this.checkbox_border.radius + 'px');	
        	},
        	checkboxActiveImage() {
            	let check = this.checkbox_active_image;
            	if(check == false) {
            		document.documentElement.style.setProperty('--inputs-checkbox-check', '');
            	} else {
            		document.documentElement.style.setProperty('--inputs-checkbox-check', 'none');
            	}
            },
            calendarHoverColor() {
            	document.documentElement.style.setProperty('--calendar-hover-color', this.calendar_hover_color.hex);
            },
            calendarActiveColor() {
            	document.documentElement.style.setProperty('--calendar-color', this.calendar_active_color.hex);
            },
            rangeThumb() {
            	document.documentElement.style.setProperty('--range-thumb', this.range_thumb.hex);
            },
            setBorderRoot(e, myVar, myElem) {
            	if(e == true) {
            		let myObject = eval("(" + "this." + myVar + ")");
            	
            		document.documentElement.style.setProperty(myElem, myObject.size + 'px ' + myObject.type + ' ' + myObject.color.hex);
            	} else {
            		document.documentElement.style.setProperty(myElem, '');
            	}
            },
            setBackground(myVar, myElem) {
            	let myObject = eval("(" + "this." + myVar + ")"),
            		a = myObject.opacity / 100,
					myElems = this.$el.querySelectorAll(myElem);

				let rgbColors = this.hexToRgb(myObject.color.hex);

            	for (var i = 0; i < myElems.length; i++) {
            		myElems[i].style.backgroundColor = 'rgba(' + rgbColors.r + ',' + rgbColors.g + ',' + rgbColors.b + ',' + a + ')';
            	}
            },
            setBorder(e, myVar, myElem) {
            	let myElems = this.$el.querySelectorAll(myElem);

            	if(e == true) {
            		let myObject = eval("(" + "this." + myVar + ")");

            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.border = myObject.size + 'px ' + myObject.type + ' ' + myObject.color.hex;
            		}
            	} else {
            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.border = '';
            		}
            	}
            },
            setShadow(a, myVar, myElem) {
				let myElems = this.$el.querySelectorAll(myElem);

            	if(a == true) {
            		let myObject = eval("(" + "this." + myVar + ")"),
            			a = myObject.opacity / 100;

            		let rgbColors = this.hexToRgb(myObject.color.hex);

            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.boxShadow = myObject.x + 'px ' + myObject.y + 'px ' + myObject.blur + 'px ' + 'rgba(' + rgbColors.r + ',' + rgbColors.g + ',' + rgbColors.b + ',' + a + ')';
            		}	
            	} else {
            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.boxShadow = '';
            		}
            	}
            },
            setBgRoot(myVar, myElem) {
            	let myObject = eval("(" + "this." + myVar + ")"),
            		a = myObject.opacity / 100;

            	let rgbColors = this.hexToRgb(myObject.color.hex);

            	document.documentElement.style.setProperty(myElem, 'rgba(' + rgbColors.r + ',' + rgbColors.g + ',' + rgbColors.b + ',' + a + ')');
            },
            setShadowRoot(e, myVar, myElem) {
            	if(e == true) {
            		let myObject = eval("(" + "this." + myVar + ")"),
            			a = myObject.opacity / 100;

            		let rgbColors = this.hexToRgb(myObject.color.hex);

            		document.documentElement.style.setProperty(myElem, myObject.x + 'px ' + myObject.y + 'px ' + myObject.blur + 'px ' + 'rgba(' + rgbColors.r + ',' + rgbColors.g + ',' + rgbColors.b + ',' + a + ')');
            	} else {
            		document.documentElement.style.setProperty(myElem, '');
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
            changeFont(e) {
            	for (let arr of this.allFonts) {
            		if(e == arr.value) {
            			e += ':400,700';

            			WebFont.load({
            			    google: {
            			    	families: [e]
            			    }
            			});
            		}
            	}
            },
            changePlayer(e) {
            	this.youtubePlayer = e;
            },
            toLocalStorage() {

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
            		bg_image_raw: this.bg_image_raw,
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
            },
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
	#textarea1 {
		font-size: 1.25rem;
		padding: .5rem 1rem;
	}

	.edit_config_contacs .list-group-item {
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		justify-content: space-between;
		-ms-align-items: center;
		align-items: center;
	}

	.edit_config_contacs .list-group-item i {
	    padding: 0.3rem;
	}

	.edit_form_btns {
		padding-left: 1rem;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		-ms-align-items: center;
		align-items: center;
	}

	.edit_form_btns .custom-control-inline {
	    margin-right: 0;
	    padding-left: 2rem;
	}

	@media (max-width: 991.98px) {
		.my_mb_text {
			margin-bottom: 1.25rem;
		}
	}

	@media (max-width: 767.98px) {
		.edit_contacs .btn-lg {
		    padding: .375rem .75rem;
		    font-size: 1rem;
		    line-height: 1.5;
		    border-radius: .25rem;
		}

		.edit_contacs .form-control-lg {
		    height: calc(2.25rem + 2px);
		    padding: .375rem .75rem;
		    font-size: 1rem;
		    line-height: 1.5;
		    border-radius: .25rem;
		}

		#textarea1 {
			padding: .375rem .75rem;
			font-size: 1rem;
			line-height: 1.5;
			border-radius: .25rem;
		}

		.my_mb_text button {
			white-space: normal;
		}
	}

	#quiz {
	    font-size: 18px;
	    font-family: 'PT Sans Caption', sans-serif;
	    line-height: 1.5;
	    font-weight: 400;
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	    -webkit-background-size: cover;
	    background-size: cover;
	    background-repeat: no-repeat;
	    padding-top: 30px;
	    padding-bottom: 60px;
	    min-height: 800px;
	    position: relative;
	}

	.align-middle {
	    -ms-align-items: center;
	    align-items: center;
	}

	.logo-description {
	    margin-left: 30px;
	    padding-left: 30px;
	    border-left: 1px solid #fff;
	    font-size: 15px;
	}

	.progress {
	  display: -webkit-box;
	  display: -ms-flexbox;
	  display: flex;
	  /* height: 2.1rem; */
	  overflow: hidden;
	  /* font-size: 1rem; */
	  /* background-color: transparent; */
	  /* border: 3px solid #d51f3d; */
	  /* border-radius: 0; */
	  width: 100%;
	  /* margin-top: 30px; */
	  /* box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.3); */
	  /*box-shadow: inset 0 -1px 1px rgba(255,255,255,0.3);*/
	}

	.progress-bar {
	  display: -webkit-box;
	  display: -ms-flexbox;
	  display: flex;
	  -webkit-box-orient: vertical;
	  -webkit-box-direction: normal;
	  -ms-flex-direction: column;
	  flex-direction: column;
	  -webkit-box-pack: center;
	  -ms-flex-pack: center;
	  justify-content: center;
	  /* color: #000; */
	  /* font-size: 18px; */
	  text-align: center;
	  background-color: #d51f3d;
	  transition: width 0.6s ease;
	  border-radius: 0;
	  /* box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 1); */
	}

	.progress-bar-striped {
	  background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
	  background-size: 2rem 2rem;
	}

	.progress-bar-animated {
	  -webkit-animation: progress-bar-stripes 1s linear infinite;
	  animation: progress-bar-stripes 1s linear infinite;
	}

	@-webkit-keyframes progress-bar-stripes {
	  from {
	    background-position: 2rem 0;
	  }
	  to {
	    background-position: 0 0;
	  }
	}

	@keyframes progress-bar-stripes {
	  from {
	    background-position: 2rem 0;
	  }
	  to {
	    background-position: 0 0;
	  }
	}

	.mt-3 {
	    margin-top: 45px;
	}

	.question {
	    padding-left: 60px;
	    position: relative;
	}

	.question-number {
	    position: absolute;
	    /* top: 0.06rem; */
	    /* min-width: 35px; */
	    /* max-width: 35px; */
	    /* padding: 0 0 0 3px; */
	    /* height: 35px; */
	    /* border-top-left-radius: 9px; */
	    /* border-bottom-left-radius: 9px; */
	    /* border: 3px solid #d51f3d; */
	    /* background-color: #2f69d4; */
	    /* color: #fff; */
	    /* line-height: 35px; */
	    /* font-size: 22px; */
	    /* font-weight: 700; */
	    /* margin-right: 15px; */
	    /* padding: 0 9px; */
	    /* box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.3); */
	    z-index: 46;
	    display: flex;
        justify-content: center;
        align-items: center;
	}

	h3 {
	    margin: 0;
	    font-weight: 700;
	    font-size: 1.5rem;
	    line-height: 1.4;
	    margin-bottom: 1.5rem;
	}

	.answer-group input[type="radio"], .answer-group input[type="checkbox"] {
	    position: absolute;
	    width: 0;
	    height: 0;
	    overflow: hidden;
	    opacity: 0;
	}

	.answer-group input[type="radio"] + label, .answer-group input[type="checkbox"] + label {
	    position: relative;
	    display: inline-block;
	    padding-left: 48px;
	    cursor: pointer;
	}

	.answer-group input[type="radio"] + label:before, .answer-group input[type="checkbox"] + label:before {
	    content: '';
	    width: 10px;
	    height: 10px;
	    background: #fff;
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 5px;
	    top: 7px;
	    /*opacity: 0;*/
	    -webkit-transition: all .3s;
	    transition: all .3s;
	}

	.answer-group input[type="radio"] + label:after {
	    content: '';
	    width: 20px;
	    height: 20px;
	    border: 1px solid #bbb;
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 0;
	    top: 4px;
	    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8);
	    -webkit-transition: all .4s;
	    transition: all .4s;
	}

	.answer-group input[type="radio"]:hover + label:after, .answer-group input[type="checkbox"]:hover + label:after {
	    box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.8);
	}

	.answer-group input[type="radio"]:checked + label:before {
	    /*opacity: 1;*/
	    background: var(--radio-checked);
	    background-image: var(--inputs-check);
	    background-repeat: no-repeat;
	    background-position: center center;
	}

	.answer-group input[type="checkbox"]:checked + label:before {
		background: var(--checkbox-checked);
		background-image: var(--inputs-checkbox-check);
		background-repeat: no-repeat;
	    background-position: center center;
	}

	/*.answer-group input[type="radio"]:checked + label:before, .answer-group input[type="checkbox"]:checked + label:before {
	    opacity: 1;
	}*/

	.answer-group input[type="checkbox"] + label:before {
	    content: '';
	    width: 16px;
	    height: 16px;
	    background: var(--checkbox-before-background);
	    position: absolute;
	    left: 4px;
	    -webkit-transition: all .3s;
	    transition: all .3s;
	    z-index: 60;
	    border-radius: 0;
	    box-shadow: var(--checkbox-before-shadow);
	}

	.magic-checkbox + label:before {
	    left: 3px;
	    top: 8px;
	    width: 9px;
	    height: 9px;
	}

	.magic-checkbox + label:after {
	    content: '';
	    width: 24px;
	    height: 24px;
	    border: var(--checkbox-border);
	    background-color: var(--checkbox-background);
	    border-radius: var(--checkbox-radius);
	    position: absolute;
	    left: 0;
	    top: 50%;
	    transform: translateY(-50%);
	    box-shadow: var(--checkbox-shadow);
	    -webkit-transition: all .4s;
	    transition: all .4s;
	}

	.button {
	    background-color: #d51f3d;
	    opacity: 1;
	    display: inline-block;
	    transition: all .3s;
	    position: relative;
	    /*height: 68px;*/
	    /*line-height: 68px;*/
	    font-weight: 600;
	    padding: 18px 48px;
	    position: relative;
	    outline: none;
	    text-align: center;
	    font-weight: bold;
	    font-size: 1rem;
	    color: #fafafa;
	    box-sizing: border-box;
	    /* text-transform: uppercase; */
	    /* border-top-left-radius: 34px; */
	    /* border-bottom-right-radius: 34px; */
	    /* border: none; */
	    /* border: 3px solid #d51f3d; */
	    /* border-bottom: 3px solid #90241c; */
	    text-decoration: none;
	    cursor: pointer;
	    overflow: hidden;
	    margin-top: 1.5rem;
	    /* box-shadow: 0px 3px 30px 0px rgba(241, 225, 200, 0.45); */
	}

	.button.disabled {
	    filter: grayscale(100%);
	    opacity: 0.5;
	    pointer-events: none;
	    cursor: not-allowed;
	}

	.config {
	    -webkit-background-size: cover;
	    background-size: cover;
	    background-position: center;
	    position: relative;
	    /* height: 420px; */
	}

	.get-started {
	    width: 100%;
	    height: 100%;
	    display: -webkit-flex;
	    display: -moz-flex;
	    display: -ms-flex;
	    display: -o-flex;
	    display: flex;
	    -ms-align-items: center;
	    align-items: center;
	    justify-content: center;
	    padding: 0 9rem;
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    font-size: 1.6rem;
	    text-align: center;
	    background: rgba(0, 0, 0, .6);
	}

	.get-started span {
	    position: relative;
	}

	.get-started span::before {
	    content: '';
	    position: absolute;
	    display: block;
	    width: 91px;
	    height: 47px;
	    background: url(../../static/questions/projects-arrow.png);
	    top: -47px;
	    left: -91px;
	}

	.input {
	    width: 100%;
	    font-size: 16px;
	    line-height: 16px;
	    font-weight: normal;
	    outline: none;
	    background: none;
	    border: none;
	    box-shadow: none;
	    border-radius: 0;
	    -webkit-appearance: none;
	    resize: none;
	    background: #fff;
	    border: solid 1px #cfcfcf;
	    padding: 15px 20px 16px;
	}

	#result .input {
	    max-width: 375px;
	    width: 100%;
	    margin-top: 1rem;
	}

	#result .button {
	    max-width: 375px;
	    width: 100%;
	    margin-top: 1.8rem;
	    border: none;
	}

	.agreement label {
	    line-height: 15px;
	    font-size: 12px;
	    font-weight: 300;
	    opacity: 1;
	    padding-left: 42px !important;
	}

	.answer-group .agreement input[type="radio"] + label:before, .answer-group .agreement input[type="checkbox"] + label:before {
	    content: '';
	    width: 16px;
	    height: 16px;
	    background: var(--checkbox-before-background);
	    position: absolute;
	    left: 4px;
	    -webkit-transition: all .3s;
	    transition: all .3s;
	    z-index: 60;
	    border-radius: 0;
	    box-shadow: var(--checkbox-before-shadow);
	}

	#result input[type="radio"] + label:after, #result input[type="checkbox"] + label:after {
	    content: '';
	    width: 24px;
	    height: 24px;
	    border: var(--checkbox-border);
	    background-color: var(--checkbox-background);
	    border-radius: var(--checkbox-radius);
	    position: absolute;
	    left: 0;
	    top: 15px;
	    transform: translateY(-50%);
	    box-shadow: var(--checkbox-shadow);
	    -webkit-transition: all .4s;
	    transition: all .4s;
	}

	.answer-group input[type="checkbox"]:hover + label[data-v-d0466a66]:after {
	    background-color: var(--checkbox-hover-background) !important;
	    -webkit-box-shadow: var(--checkbox-hover-shadow) !important;
	    box-shadow: var(--checkbox-hover-shadow) !important;
	}

	.agreement {
	    padding-top: 0.5rem;
	}

	.questions {
	    padding-right: 3rem;
	}

	.swiper-container {
	    width: 100%;
	    height: 420px;
	}

	.slider-prev {
	    background: #d51f3d;
	    border: none;
	    /* text-indent: -9999px; */
	    width: 60px;
	    height: 60px;
	    /* background: #d1a96e url(../../static/questions/icon_prev.png) no-repeat 18px 14px; */
	    position: absolute;
	    top: 398px;
	    right: 75px;
	    z-index: 19000;
	    /* padding: 13px 0 0 20px; */
	    cursor: pointer;
	    /* border-radius: 100%; */
	    outline-style: none;
	}

	.slider-next {
	    background: #d51f3d;
	    border: none;
	    /* text-indent: -9999px; */
	    width: 60px;
	    height: 60px;
	    /* background: #d1a96e url(../../static/questions/icon_next.png) no-repeat 20px 14px; */
	    position: absolute;
	    top: 398px;
	    right: 15px;
	    z-index: 19000;
	    /* padding: 13px 0 0 20px; */
	    cursor: pointer;
	    /* border-radius: 100%; */
	    outline-style: none;
	}

	.slider {
	    width: 100%;
	    height: 420px;
	    position: relative;
	    overflow-x: hidden;
	}

	.slider__body {
	    min-width: auto;
	    height: 420px;
	    display: flex;
	    position: relative;
	    align-items: stretch;
	    transition: all .5s ease;
	}

	.slider__slide {
	    min-width: 100%;
	    height: 420px;
	    background-size: cover;
	    background-position: center;
	    flex: 1 100%;
	    position: relative;
	}

	.results-header {
	    background: #fff;
	    padding: 11px 13px;
	    font-weight: bold;
	    font-size: 16px;
	    line-height: 16px;
	    color: #000;
	    width: 100%;
	    z-index: 10;
	    text-align: center;
	    /* box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.3); */
	}

	.home-item__info {
	    background: #fff;
	    padding: 12px 16px;
	    color: #000;
	    position: absolute;
	    width: 100%;
	    bottom: -116px;
	}

	.home-item__info-item {
	    margin: 5px 0;
	    font-size: 16px;
	    display: -webkit-flex;
	    display: -moz-flex;
	    display: -ms-flex;
	    display: -o-flex;
	    display: flex;
	}

	.home-item__info-title {
	    width: 193px;
	}

	.home-item__info-value {
	    font-weight: bold;
	}

	.answer-group input[type="checkbox"]:checked + label:before {
		background: var(--checkbox-checked);
		background-image: var(--inputs-checkbox-check);
		background-repeat: no-repeat;
	    background-position: center center;
	}

	.magic-checkbox + label:before {
	    left: 3px;
	    top: 8px;
	    width: 9px;
	    height: 9px;
	    background: transparent url(../../static/questions/checkmark.png) no-repeat center center !important;
	}

	.magic-checkbox + label:after {
	    content: '';
	    width: 18px;
	    height: 18px;
	    border: 1px solid #bbb;
	    border-radius: 0;
	    position: absolute;
	    left: 0;
	    top: 4px;
	    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8);
	    -webkit-transition: all .4s;
	    transition: all .4s;
	}

	section input[type="text"], section input[type="email"], section input[type="password"], section select {
	    /* border: 1px solid #dbdbdb; */
	    border: none;
	    /* border-bottom: 1px solid #fff; */
	    font-size: 16px;
	    font-weight: 400;
	    /* height: 45px; */
	    margin: 0;
	    padding: 0;
	    line-height: 1;
	    padding: 15px 18px;
	    display: inline-block;
	    /* border-radius: 3px; */
	    color: #000;
	    box-sizing: border-box;
	    outline: none;
	    width: 80%;
	    /* background-color: transparent; */
	    background-color: #fff;
	    transition: .18s;
	    /* box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.3); */
	}

	input[type=range] {
	    -webkit-appearance: none;
	    width: 80%;
	    position: relative;
	    top: -16px;
	}

	input[type=range]:focus {
	    outline: none;
	}

	input[type=range]::-webkit-slider-runnable-track {
	    width: 100%;
	    height: 4px;
	    cursor: pointer;
	    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(13, 13, 13, 0.06);
	    background: #ffffff;
	    border-radius: 25px;
	    border: 0px solid rgba(0, 1, 1, 0);
	}

	input[type=range]::-webkit-slider-thumb {
	    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5), 0px 0px 1px rgba(13, 13, 13, 0.5);
	    border: 4px solid #ffffff;
	    height: 16.8px;
	    width: 16.8px;
	    border-radius: 50px;
	    background: #8aa429;
	    cursor: pointer;
	    -webkit-appearance: none;
	    margin-top: -6.4px;
	    position: relative;
	    z-index: 9
	}

	input[type=range]:focus::-webkit-slider-runnable-track {
	    background: #ffffff;
	}

	input[type=range]::-moz-range-track {
	    width: 100%;
	    height: 4px;
	    cursor: pointer;
	    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(13, 13, 13, 0.06);
	    background: #ffffff;
	    border-radius: 25px;
	    border: 0px solid rgba(0, 1, 1, 0);
	}

	input[type=range]::-moz-range-thumb {
	    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5), 0px 0px 1px rgba(13, 13, 13, 0.5);
	    border: 4px solid #ffffff;
	    height: 16.8px;
	    width: 16.8px;
	    border-radius: 50px;
	    background: #8aa429;
	    cursor: pointer;
	}

	input[type=range]::-ms-track {
	    width: 100%;
	    height: 4px;
	    cursor: pointer;
	    background: transparent;
	    border-color: transparent;
	    color: transparent;
	}

	input[type=range]::-ms-fill-lower {
	    background: #f2f2f2;
	    border: 0px solid rgba(0, 1, 1, 0);
	    border-radius: 50px;
	    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(13, 13, 13, 0.06);
	}

	input[type=range]::-ms-fill-upper {
	    background: #ffffff;
	    border: 0px solid rgba(0, 1, 1, 0);
	    border-radius: 50px;
	    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(13, 13, 13, 0.06);
	}

	input[type=range]::-ms-thumb {
	    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5), 0px 0px 1px rgba(13, 13, 13, 0.5);
	    border: 4px solid #ffffff;
	    height: 16.8px;
	    width: 16.8px;
	    border-radius: 50px;
	    background: #8aa429;
	    cursor: pointer;
	    height: 4px;
	}

	input[type=range]:focus::-ms-fill-lower {
	    background: #ffffff;
	}

	input[type=range]:focus::-ms-fill-upper {
	    background: #ffffff;
	}

	.wrapper-range {
	    position: relative;
	}

	.range-positive {
	    height: 5px;
	    background: #8aa429;
	    position: absolute;
	    pointer-events: none;
	    z-index: 5
	}

	#date-picker {
	    display: inline-block;
	    color: #000;
	}

	.other-month {
	    color: gray;
	}

	.arrow {
	    cursor: pointer;
	    width: 1.5em;
	}

	.arrow:hover {
	    color: steelblue;
	    font-weight: 400;
	}

	.year, .month {
	    height: 1.2em;
	}

	.left {
	    float: left;
	}

	.right {
	    float: right;
	}

	.center {
	    text-align: center;
	    clear: both;
	}

	table {
	    clear: both;
	}

	table .week td {
	    color: #9a9a9a;
	    font-family: 'Rubik', sans-serif;
	}

	table td {
	    width: 2em;
	    height: 2em;
	    vertical-align: middle;
	    text-align: center;
	}

	tbody td {
	    cursor: pointer;
	    border-radius: 100%;
	}

	tbody td.selected {
	    background: #8aa429;
	    color: #fff;
	}

	tbody td.selected:hover {
	    background: #8aa429;
	    color: #fff;
	}

	tbody td:hover {
	    background-color: #8aa429;
	    color: #fff;
	}

	.calendar {
	    background-color: #fff;
	    border-radius: 5px;
	    padding: 0.5em 0.2em;
	    position: absolute;
	    top: 123px;
	    z-index: 99;
	}

	.calendar:before {
	    content: '';
	    width: 0;
	    height: 0;
	    border: solid transparent 8px;
	    border-bottom: solid #e6e6e6 8px;
	    position: absolute;
	    bottom: 100%;
	    left: 1em;
	}

	[v-cloak] {
	    display: none;
	}

	#date-picker input {
	    width: 280px;
	    margin-bottom: 15px;
	}

	.add-text-circle, .add-text-square {
	    position: relative;
	}

	.add-text-circle::before {
	    content: '';
	    width: 10px;
	    height: 10px;
	    background: #fff;
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 5px;
	    top: 18px;
	    opacity: 0;
	    -webkit-transition: all .3s;
	    transition: all .3s;
	}

	.add-text-circle::after {
	    content: '';
	    width: 20px;
	    height: 20px;
	    border: 1px solid #bbb;
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 0;
	    top: 50%;
	    transform: translateY(-50%);
	    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8);
	    -webkit-transition: all .4s;
	    transition: all .4s;
	}

	.add-text-square::before {
	    content: '';
	    width: 10px;
	    height: 10px;
	    background: transparent url(../../static/questions/checkmark.png) no-repeat center center !important;
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 4px;
	    top: 17px;
	    opacity: 0;
	    -webkit-transition: all .3s;
	    transition: all .3s;
	}

	.add-text-square::after {
	    content: '';
	    width: 18px;
	    height: 18px;
	    border: 1px solid #bbb;
	    position: absolute;
	    left: 0;
	    top: 50%;
	    transform: translateY(-50%);
	    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8);
	    -webkit-transition: all .4s;
	    transition: all .4s;
	}

	.add-text-circle:hover::after, .add-text-square:hover::after {
	    box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.8);
	}

	.add-input {
	    margin-left: 38px !important;
	}

	.input-focused::before {
	    opacity: 1;
	}

	.video-title {
	    margin-bottom: 10px;
	    font-size: 14px;
	}

	.video-title img {
	    vertical-align: middle;
	    display: inline-block;
	    margin-left: 12px;
	    max-width: 30px;
	    max-height: 30px;
	}

	.consultant {
	    color: #000;
	    background-color: #fff;
	    /* border-radius: 3px; */
	    padding: 20px 30px;
	    /* box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.3); */
	}

	.expert-img {
		height: 146.66px;
	}

	.expert-img, .expert-info {
	    margin-bottom: 30px;
	}

	.expert-img img {
	    border-radius: 100%;
	}

	.expert-name {
	    font-size: 20px;
	    line-height: 1;
	    font-weight: bold;
	    margin-bottom: 9px;
	}

	.expert-info {
	    display: -webkit-flex;
	    display: -moz-flex;
	    display: -ms-flex;
	    display: -o-flex;
	    display: flex;
	    padding-top: 20px;
	    -webkit-flex-direction: column;
	    -moz-flex-direction: column;
	    -ms-flex-direction: column;
	    -o-flex-direction: column;
	    flex-direction: column;
	}

	.expert-position {
	    font-size: 14px;
	    line-height: 1.2;
	    font-style: italic;
	    font-weight: 300;
	    margin-right: -13px;
	}

	.expert-says {
	    /* border-radius: 3px; */
	    padding: 15px 20px;
	    position: relative;
	    font-size: 16px;
	    line-height: 16px;
	    line-height: 1.3;
	    /* box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.12); */
	}

	/*.expert-says::before {
	    content: '';
	    position: absolute;
	    left: 41px;
	    bottom: 100%;
	    z-index: 2;
	    width: 0;
	    height: 0;
	    border-style: solid;
	    border-width: 0 14px 24px 14px;
	    border-color: transparent transparent #ffffff transparent;
	}

	.expert-says::after {
	    content: '';
	    position: absolute;
	    left: 40px;
	    bottom: 100%;
	    width: 0;
	    height: 0;
	    border-style: solid;
	    border-width: 0 15px 25px 15px;
	    border-color: transparent transparent #cecece transparent;
	    z-index: 1;
	}*/

	.message-consultant {
	    font-size: 14px;
	    line-height: 18px;
	    margin-top: 1.5rem;
	}

	.message-consultant p {
	    margin-bottom: 20px;
	}

	.message-consultant p:last-of-type {
	    margin-bottom: 0;
	}

	.message-consultant b {
	    font-weight: 800;
	    font-size: 18px;
	}

	.message-consultant .phone-number {
	    font-weight: 700;
	    font-size: 18px;
	    line-height: 20px;
	    display: inline-block;
	    color: #a08532;
	    border-bottom: 2px dotted #a08532;
	}

	.wrapper-loader {
	    position: absolute;
	    z-index: 9999;
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
	    -ms-align-items: center;
	    justify-content: center;
	    align-items: center;
	    background: rgba(0, 0, 0, .75);
	}

	.circle-loader {
	  border: 2px solid #fff;
	  border-left-color: #5cb85c;
	  animation: loader-spin 1.2s infinite linear;
	  position: relative;
	  border-radius: 50%;
	  width: 4em;
	  height: 4em;
	  z-index: 99;
	  margin-bottom: 10px;
	}

	.load-complete {
	  -webkit-animation: none;
	  animation: none;
	  border-color: #5cb85c;
	  transition: border 500ms ease-out;
	  background: #5cb85c;
	}

	.wrapper-loader p {
	    font-size: 1.5rem;
	}

	.checkmark {
	  display: none;
	}
	.checkmark.draw:after {
	  animation-duration: 800ms;
	  animation-timing-function: ease;
	  animation-name: checkmark;
	  transform: scaleX(-1) rotate(135deg);
	}
	.checkmark:after {
	  opacity: 1;
	  height: 2em;
	  width: 1em;
	  transform-origin: left top;
	  border-right: 3px solid #fff;
	  border-top: 3px solid #fff;
	  content: '';
	  left: 0.9em;
	  top: 2.1em;
	  position: absolute;
	  z-index: 9999;
	}

	@keyframes loader-spin {
	  0% {
	    transform: rotate(0deg);
	  }
	  100% {
	    transform: rotate(360deg);
	  }
	}
	@keyframes checkmark {
	  0% {
	    height: 0;
	    width: 0;
	    opacity: 1;
	  }
	  20% {
	    height: 0;
	    width: 1em;
	    opacity: 1;
	  }
	  40% {
	    height: 2em;
	    width: 1em;
	    opacity: 1;
	  }
	  100% {
	    height: 2em;
	    width: 1em;
	    opacity: 1;
	  }
	}

	.qtip-content {
		width: 100%;
		height: 100%;
	    position: absolute;
	    padding: 5px 9px;
	    overflow: hidden;
	    text-align: left;
	    word-wrap: break-word;
	    z-index: 10001;
	    top: 30%;
	    left: 12.5%;
	}

	.tooltip {
	    display: -ms-flexbox !important;
	    display: flex !important;
	    opacity: 1 !important;
	}

	.tooltip .tooltip-image {
	    height: 110px;
	    min-width: 110px;
	    max-width: 110px;
	    border-radius: 50%;
	    overflow: hidden;
	    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.26);
	    border: 2px solid #dabb26;
	    padding: 5px;
	    background-color: #fff;
	    position: relative;
	    z-index: 3200;
	    cursor: pointer;
	}

	.tooltip .tooltip-image-wrapper {
	    width: 100%;
	    height: 100%;
	    border-radius: 50%;
	    background-position: center;
	    background-repeat: no-repeat;
	    background-size: cover;
	}

	.tooltip .tooltip-description {
	    margin-left: 15px;
	}

	.tooltip .tooltip-title {
	    font-size: 18px;
	    font-weight: 500;
	    color: #1b1b1b;
	    white-space: nowrap;
	    display: inline-block;
	    background-color: #dabb26;
	    padding: 0 15px;
	    height: 35px;
	    line-height: 35px;
	    position: relative;
	    z-index: 3100;
	}

	.tooltip .tooltip-title:after {
	    width: 50px;
	    height: 1px;
	    content: "";
	    position: absolute;
	    border: 1px dashed #fff;
	    left: -50px;
	    position: absolute;
	    top: 50%;
	    margin-top: -1px;
	    z-index: 3090;
	}

	.tooltip .tooltip-text {
	    width: 280px;
	    margin-top: 5px;
	    font-size: 12px;
	    font-weight: 400;
	    background-color: rgba(255, 255, 255, 0.85);
	    padding: 10px 15px;
	    color: #000;
	    text-align: left;
	    z-index: 3120;
	}

	.type_item {
		width: 50%;
		padding: 1.5rem 1rem;
		text-align: center;
	}

	.type_item p {
		margin-bottom: 0;
	}

	.type_item:hover {
		cursor: pointer;
		background-color: #e5e5e5;
	}

	.type_active {
		background-color: #4da1ff;
		color: #fff;
		font-weight: 500;
	}

	.type_active:hover {
		background-color: #4da1ff;
	}

	.trash_cond {
		font-size: 0.9rem;
		position: relative;
		top: -1px;
	}

	.fa-arrows-alt {
		cursor: move;
	}

	.trash_cons_text {
		font-size: 0.85rem;
		margin-left: 6px;
		position: relative;
		top: -1px;
	}

	.quiz-gifts {
	    padding: 15px 24px;
	    display: -ms-flexbox;
	    display: flex;
	    border-radius: 0;
	    -ms-flex-pack: center;
	    justify-content: center;
	    /* box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.3); */
	}

	.gift {
	    display: inline-block;
	    vertical-align: top;
	    /* margin-right: -5px; */
	    width: 50%;
	    opacity: 1;
	}

	.gift:first-child {
	    padding-right: 18px;
	    /* border-right: 1px solid #fff; */
	}

	.gift:last-child {
	    padding-left: 18px;
	    /* border-left: 1px solid #f3eae3; */
	}

	.gift-title {
		    font-size: 14px;
		}

		.gift-image {
		    margin: 10px 0;
		}

		.gift-name {
		    font-size: 16px;
		    text-transform: uppercase;
		    font-weight: 600;
		    line-height: 1.2;
		}

		.gift-image img {
		    width: auto;
		    max-width: 100%;
		    max-height: 100px;
		    height: auto;
		}

		.gift-item-img {
		    width: 25%;
		}
		.gift-item-img, .gift-item-text {
		    display: inline-block;
		    vertical-align: top;
		    margin-right: -5px;
		}

		.gift-item-img img {
		    width: auto;
		    height: auto;
		    max-width: 120px;
		}

		.gift-item-text {
		    width: 75%;
		    font-size: 14px;
		    line-height: 18px;
		    font-weight: 500;
		    padding-left: 15px;
		}

		.gift-item-text h3 {
		    font-size: 18px;
		    line-height: 1.2;
		    font-weight: 900;
		    text-transform: uppercase;
		    margin-bottom: 0;
		}

		.gift-item-text span {
			display: block;
			margin-bottom: 6px;
		}

		.gift-one {
		    padding: 20px 25px;
		}

	.result_desc {
		font-size: 0.9rem;
		margin-top: -0.6rem;
		margin-bottom: 1.5rem;
	}

	.question-comment {
	    font-size: 16px;
	    margin-bottom: 15px;
	}

	.input_mask_explain {
		font-size: 0.9rem;
	}

	.messengers-link {
		max-width: 375px;
	    background: #f5f7f9;
	    font-size: 16px;
	    color: #999999;
	    padding: 0 1rem;
	    margin-top: 1rem;
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-box-pack: center;
	    -ms-flex-pack: center;
	    justify-content: center;
	    -ms-align-items: center;
	    align-items: center;
	    border-radius: 2px;
	}

	.messengers-link img {
		margin-right: -5px;
	}

	.messengers {
		max-width: 375px;
		background-color: #fff;
		color: #000;
		border-radius: 2px;
	}

	.messengers-title {
		text-align: center;
	    font-size: 18px;
	    margin-bottom: 1rem;
	    padding-top: 0.75rem;
	}

	.messengers-list {
	    display: -webkit-flex;
	    display: -moz-flex;
	    display: -ms-flex;
	    display: -o-flex;
	    display: flex;
	    position: relative;
	    -webkit-flex-wrap: wrap;
	    -moz-flex-wrap: wrap;
	    -ms-flex-wrap: wrap;
	    -o-flex-wrap: wrap;
	    flex-wrap: wrap;
	    justify-content: center;
	}

	.messengers-item {
		width: 50%;
		padding: 1rem;
		/*color: #999999;*/
		transition: .18s;
	}

	.messengers-item:hover {
		background-color: var(--m-block-hover);
		cursor: pointer;
		/*color: #000;*/
	}

	.messengers-back {
		font-size: 14px;
		text-align: center;
		display: block;
		padding: 0.75rem 0 0.6rem;
		color: inherit;
	}

	.messenger-send {
		max-width: 375px;
		background-color: #fff;
		color: #000;
		border-radius: 2px;
		text-align: center;
		padding: 1rem;
	}

	.messenger-send label {
		font-size: 14px;
	}

	.messenger-change {
		font-size: 14px;
		text-align: center;
		display: block;
		padding: 0.75rem 0 0.6rem;
		color: inherit;
	}

	.messenger-btn {
		background-color: #f44336;
		border: none;
		padding: 18px 14px;
	    opacity: 1;
	    display: inline-block;
	    -webkit-transition: all .3s;
	    transition: all .3s;
	    position: relative;
	    line-height: 1;
	    font-weight: 600;
	    position: relative;
	    outline: none;
	    text-align: center;
	    font-size: 1rem;
	    border-radius: 3px;
	    text-decoration: none;
	    cursor: pointer;
	    overflow: hidden;
		max-width: 375px;
		width: 100%;
		margin-top: 0.3rem;
	}

	.for_editing {
		transition: .18s;
		cursor: pointer;
		position: relative;
	}

	.editor-overlay:hover {
		background-color: rgba(0, 0, 0, 0.15);
		background-image: url(../../static/questions/paint-palette-and-brush.png);
		background-repeat: no-repeat;
		background-position: center;
		-webkit-background-size: auto 75%;
		background-size: auto 75%;
	}

	.editor-overlay img {
		opacity: 0;
	}

	.for_editing:hover .editor-overlay img {
		opacity: 1;
	}

	.editor-overlay {
		top: 0;
    	left: 0;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		position: absolute;
		opacity: 1;
		width: 100%;
		height: 100%;
		justify-content: center;
		-ms-align-items: center;
		align-items: center;
		transition: .18s;
		z-index: 99600;
	}

	  .modal {
	    background: #FFFFFF;
	    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.18);
	    overflow-x: auto;
	    display: flex;
	    flex-direction: column;
	    max-width: 500px;
	    height: max-content;
	    position: absolute;
	    border-radius: calc(.3rem - 1px);
	    transition: .18s;
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

	@media screen and (max-width: 1199px) {
	    .questions {
	        padding-right: 15px;
	    }

	    .answer-group input[type="checkbox"] + label:before {
	        top: 7px;
	    }

	    #date-picker input {
	        width: 100%;
	    }

	    .messengers-item {
	        text-align: center;
	    }

	    .messengers-item img {
	        margin-bottom: 6px;
	    }

	    .messengers-title {
	    	padding-right: 6px;
	    	padding-left: 6px;
	    }
	}

	@media screen and (max-width: 991px) {
	    .config {
	        margin-top: 2rem;
	    }

	    .mt-5 {
	        margin-top: 2rem;
	    }

	    .qtip-content {
	        left: 25% !important;
	        -webkit-transform: translateX(-50%) !important;
	        -ms-transform: translateX(-50%) !important;
	        -o-transform: translateX(-50%) !important;
	        transform: translateX(-50%) !important;
	    }

	    #quiz {
	        padding-bottom: 45px;
	    }

	    #date-picker {
	        width: 80%;
	    }

	    .expert-img {
	        height: 135px;
	    }

	    video {
	    	margin-top: 15px;
	    	height: 100% !important;
	    }
	}

	@media screen and (max-width: 767px) {
		.qtip-content {
		    left: 15% !important;
		    -webkit-transform: translateX(-50%) !important;
		    -ms-transform: translateX(-50%) !important;
		    -o-transform: translateX(-50%) !important;
		    transform: translateX(-50%) !important;
		}

		.expert-img {
		    height: 130px;
		}

		video {
			margin-top: 0;
			height: 300px !important;
		}
	}

	@media screen and (max-width: 575px) {
	    .quiz-gifts {
	        -webkit-flex-direction: column;
	        -moz-flex-direction: column;
	        -ms-flex-direction: column;
	        -o-flex-direction: column;
	        flex-direction: column;
	        justify-content: center;
	    }

	    .gift {
	        width: 100%;
	    }

	    .gift:last-child {
	        padding-left: 0;
	        margin-top: 1rem;
	    }

	    .no-margin {
	        margin-bottom: 0;
	    }

	    section input[type="text"], section input[type="email"], section input[type="password"], section select {
	        width: 80%;
	        -webkit-box-sizing: border-box;
	        -moz-box-sizing: border-box;
	        box-sizing: border-box;
	    }

	    .logo {
	        -webkit-flex-direction: column;
	        -moz-flex-direction: column;
	        -ms-flex-direction: column;
	        -o-flex-direction: column;
	        flex-direction: column;
	    }

	    .logo-description {
	        margin-left: 0;
	        padding-left: 0;
	        border-left: none;
	        margin-top: 12px;
	    }

	    #quiz {
	        padding-top: 15px;
	        padding-bottom: 30px;
	    }

	    .qtip-content {
	        display: none !important;
	    }

	    #date-picker {
	        width: 100%;
	    }

	    .expert-img {
	        height: ;
	        height: 150px;
	        width: 180px;
	        margin-bottom: 9px;
	    }

	    video {
	        margin-top: 15px;
	        height: 100% !important;
	    }
	}

	@media screen and (max-width: 419px) {
	    #quiz {
	        font-size: 15px;
	    }

	    #progress-bar {
	        font-size: 75% !important;
	    }

	    .button {
	    	width: 100%;
	    	padding: 18px 0;
	    }

	    .calendar {
	    	width: 125%;
	    }

	    .video-title img {
	    	display: none;
	    }
	}
</style>