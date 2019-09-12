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
				    <div id="exPopoverReactive-test-edit" :class="{ 'col-12': true, 'd-flex': true, 'for_editing': styleMode, 'head_desc': true }" :style="{ justifyContent: head_horizontal_align }" @click="whichPopover = 'header'; showModalPop($event, 'bottom')">
				    	<div class="editor-overlay" v-show="styleMode"></div>
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
						<div :class="{ 'progress': true, 'for_editing': styleMode }" ref="progress_wrap" :style="{ height: progress_height + 'px', borderRadius: progress_border.radius + 'px', marginTop: progress_margin_top + 'px', marginBottom: progress_margin_bottom + 'px' }" @click="whichPopover = 'progress'; showModalPop($event, 'bottom')">
							<div class="editor-overlay" v-show="styleMode"></div>
						  	<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" id="progress-bar" ref="progress" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" :style="{ width: changeProgress, fontSize: progress_font_size + 'px', color: progressbar_color_text.hex, backgroundColor: progressbar_bg.hex, borderRadius: progressbar_radius + 'px' }">
						  	</div>
						</div>
					</div>
				</div>
				<div class="row mb-5">
					<div class="questions col-xl-6 col-lg-5">
						<div class="wrapper-questions" v-for="(question, index_q) in questions" style="display: none;" :key="index_q" ref="question" >
							<div class="question-number" ref="question_number" :style="{ width: question_index_width + 'px', height: question_index_height + 'px', borderRadius: question_index_border.radius + 'px', fontSize: question_index_fz + 'px', fontWeight: question_index_weight, top: question_index_top + 'px', left: question_index_left + 'px' }">{{ currentQ }}</div>
							<div class="question" ref="question_block" :style="{ paddingTop: question_padd_vert + 'px', paddingBottom: question_padd_vert + 'px', paddingLeft: question_padd_horz + 'px', paddingRight: question_padd_horz + 'px', borderRadius: question_radius + 'px', color: question_block_color_text.hex }">
								<h3 id="question" :class="{ 'for_editing': styleMode }" ref="question_title" :style="{ fontSize: question_title_fz + 'px', fontWeight: question_title_weight }" @click="whichPopover = 'question-block'; showModalPop($event, 'right')">
									<div class="editor-overlay" v-show="styleMode"></div>
									{{ question.question }}
								</h3>
								<div :class="{ 'answers': true, 'for_editing': styleMode }" ref="answer_block" @click="forWhichPopover(question.type); showModalPop($event, 'right')">
									<div class="editor-overlay" v-show="styleMode"></div>
									<div class="answer-group" v-for="(answer, index_a) in question.choices">
										<div v-if="question.type == 'radio'" @mouseover="showHelp(index_a)">
											<input class="magic-radio" :type="question.type" :id="'q' + index_q + '-a' + index_a" :name="index_q" :value="answer" v-model="v_q" />
											<label :for="'q' + index_q + '-a' + index_a">{{ answer }}</label>
										</div>
										<div v-if="question.type == 'checkbox'" @mouseover="showHelp(index_a)">
											<input class="magic-checkbox" type="checkbox" :id="'q' + index_q + '-a' + index_a" :name="index_q" :value="answer" v-model="v_qCheck" />
											<label :for="'q' + index_q + '-a' + index_a">{{ answer }}</label>
										</div>
									</div>
									<div v-show="question.type == 'range'" class="input-range">
										<input type="text" name="chance" v-model="v_range" ref="range" class="quiz_inputs quiz_input_range" :style="{ color: input_color_text.hex, fontWeight: input_weight, borderRadius: input_border.radius + 'px' }">
										<div class="wrapper-range">
											<div class="range-positive" ref="range_positive" :style="{ backgroundColor: range_bg.hex }"></div>
											<input type="range" id="chanceSlider" :min="question.min" :max="question.max" :step="question.step" v-model="v_range">
										</div>
									</div>
									<div v-show="question.type == 'text'">
										<div class="answers">	
											<input type="text" class="quiz_inputs" id="q2" name="q2" :value="questions[questionIndex].forText" :placeholder="questions[questionIndex].forTextPlaceholder" :style="{ color: input_color_text.hex, fontWeight: input_weight, borderRadius: input_border.radius + 'px' }">
										</div>
									</div>
									<div v-show="question.type == 'date'">
										<div id="date-picker" v-cloak="v-cloak">
										  <input type="text" class="quiz_inputs" :style="{ color: input_color_text.hex, fontWeight: input_weight, borderRadius: input_border.radius + 'px' }" v-model="showDate" @input="updatePickedDate($event.target.value)" @focus="onFocus()" @blur.prevent.stop="onBlur()"/>
										  <div class="calendar" ref="calendar" v-show="open" @mousedown.prevent.stop="onMouseDown()" @mouseup.prevent.stop="onMouseUp()" :style="{ color: calendar_color.hex, borderRadius: calendar_border.radius + 'px' }">
										    <div class="header">
										      <div class="center">
										        <div class="left arrow" @click="changeCurMonth(-12)">&lt;</div>
										        <div class="right arrow" @click="changeCurMonth(12)">&gt;</div>
										        <div class="year">{{ curYear }}</div>
										        <div class="left arrow" @click="changeCurMonth(-1)">&lt;</div>
										        <div class="right arrow" @click="changeCurMonth(1)">&gt;</div>
										        <div class="month">{{ curMonth | formatMonth }}</div>
										      </div>
										    </div>
										    <table>
										      <thead>
										        <tr class="week">
										          <td>Пн</td>
										          <td>Вт</td>
										          <td>Ср</td>
										          <td>Чт</td>
										          <td>Пт</td>
										          <td>Сб</td>
										          <td>Вс</td>
										        </tr>
										      </thead>
										      <tbody>
										        <tr v-for="row in rows">
										          <td class="day" v-for="date in row" :class="{ 'other-month': date.getMonth() !== curMonth , 'selected': date.valueOf() == pickedDate.valueOf()}" @click="pickDate(date)">{{ date.getDate() }}</td>
										        </tr>
										      </tbody>
										    </table>
										  </div>
										</div>
									</div>

									<div :class="question.class" v-show="(question.type == 'radio' || question.type == 'checkbox') && question.addInput" ref="addtext">
										<input type="text" ref="input_text" id="q2" name="q2" :placeholder="question.placeholder" class="add-input quiz_inputs" @focus="addFocus" @input="delFocusCheckbox($event.target.value)" @blur="unFocusedCheckbox($event.target.value)" :style="{ color: input_color_text.hex, fontWeight: input_weight, borderRadius: input_border.radius + 'px' }">
									</div>
								</div>
								<div class="btn_wrapper" id="exPopoverReactive-button">
									<a :class="{ 'mt-5': true, 'button': true, 'next-questions': true, 'for_editing': styleMode }" ref="next" :style="{ color: button_color_text.hex, borderRadius: button_border.radius + 'px' }" @click="whichPopover = 'question-button'; showModalPop($event, 'right')">
										<div class="editor-overlay" v-show="styleMode"></div>
										На следующий шаг
									</a>
								</div>
							</div>
						</div>
					</div>
					<div class="config col-xl-6 col-lg-7" ref="background">
						<div class="get-started" ref="started" style="display: none;">
							<span>Начните отвечать, сделайте первый шаг к дому своей мечты!</span>
						</div>
						<div ref="slider" style="display: block" v-show="config == 'gallery'">
							
							<div class="qtip-content" :style="{ top: qtip_top + 'px', left: qtip_left + 'px' }" ref="qtip">
								<div class="tooltip" :style="{ flexDirection: tooltip_image_align }">
								    <div :class="tooltip_image_align == 'column' ? 'mb-3 tooltip-image' : 'tooltip-image'" :style="{ borderRadius: tooltip_image_border.radius + 'px' }">
								        <div class="tooltip-image-wrapper" ref="tooltipImage"></div>
							        </div>
								    <div class="tooltip-description">
								        <div class="tooltip-title" ref="tooltipTitle" :style="{ color: tooltip_title_color.hex, borderRadius: tooltip_title_radius + 'px' }"></div>
								        <div class="tooltip-text" ref="tooltipText" :style="{ color: tooltip_text_color.hex, borderRadius: tooltip_text_radius + 'px' }"></div>	
								    </div>								
								</div>
							</div>

							<div :class="{ 'd-none': result_display, 'results-header': true, 'for_editing': styleMode }" ref="result_header" :style="{ color: result_color.hex, borderTopLeftRadius: result_border.left + 'px', borderTopRightRadius: result_border.right + 'px', padding: result_padding + 'px', fontSize: result_fz + 'px', textAlign: result_align, display: result_display }" @click="whichPopover = 'result'; showModalPop($event, 'left')">
									<div class="editor-overlay" v-show="styleMode"></div>
							    Отобрано проектов: {{ sliderAllCount }}, в том числе:
							</div>
							<div :class="{ 'slider': true, 'js-slider': true, 'for_editing': styleMode }" :style="{ borderTopLeftRadius: info_border.top + 'px', borderTopRightRadius: info_border.top + 'px' }" ref="js_slide" @click="whichPopover = 'gallery'; showModalPop($event, 'left')">
								<div class="editor-overlay" v-show="styleMode"></div>
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
						<div v-show="config == 'video'" :class="{ 'video-block': true, 'for_editing': styleMode }" @click="whichPopover = 'video'; showModalPop($event, 'left')">
							<div class="editor-overlay" v-show="styleMode"></div>
							<div :class="youtubePlayer == 'false' ? 'mb-1 video-title' : 'mb-3 video-title'" :style="{ fontWeight: video_text_weight, fontSize: video_text_fz + 'px', display: video_image_display }">
								{{ video_text_text }}
								<img :src="video_image" :class="{ 'd-none': video_image_display }">
							</div>
							<iframe v-if="youtubePlayer == 'true'" width="100%" height="420" :src="'https://www.youtube.com/embed/' + videoElements[questionIndex].readySrc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
							</iframe>
							<video v-if="youtubePlayer == 'false'" ref="video_local" width="100%" height="320" controls="controls">
						    	<source :src="videoElements[questionIndex].localSrc" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
							    Элемент video не поддерживается вашим браузером. 
							</video>
						</div>
						<div v-show="config == 'consultant'">
							<div class="consultant" :style="{ color: consultant_color.hex, borderRadius: consultant_border.radius + 'px', padding: consultant_padding + 'px' }">
							    <div class="expert">
							        <div :class="{ 'row': true, 'for_editing': styleMode }" @click="whichPopover = 'consultant-top'; showModalPop($event, 'left')">
							        		<div class="editor-overlay" v-show="styleMode"></div>
							            <div class="col-lg-4 col-md-3 col-sm-4 expert-img">
							                <img class="expert-img-img" :src="consultantImgSrc" width="100%" height="100%">
							            </div>
							            <div class="col-lg-8 col-md-9 col-sm-8 expert-info" :style="{ paddingTop: consultant_top_padding + 'px' }">
							                <div class="expert-name" :style="{ fontSize: consultant_top_name_fz + 'px' }">{{ consultantName }}</div>
							                <div class="expert-position" :style="{ fontSize: consultant_top_position_fz + 'px', paddingRight: '30px' }"> 
							                	{{ consultantDescription }}
							                </div>
							            </div>
							        </div>
							        <div :class="{ 'expert-says': true, 'for_editing': styleMode }" :style="{ borderRadius: consultant_words_border.radius + 'px', color: consultant_words_color.hex }" @click="whichPopover = 'consultant-words'; showModalPop($event, 'left')">
							        	<div class="editor-overlay" v-show="styleMode"></div>
							        	{{ consultantElements[questionIndex].words }}
							        </div>
							    </div>
							    <div :class="{ 'message-consultant': true, 'for_editing': styleMode }" @click="whichPopover = 'consultant-add'; showModalPop($event, 'left')">
							    	<div class="editor-overlay" v-show="styleMode"></div>
							    	<div v-for="(consultantText, index) in moreConsultantText">
							    		<p :class="'consultantText-' + index" :style="{ fontSize: consultantText.fz + 'px', fontWeight: consultantText.fw, marginBottom: consultantText.mb + 'px' }">{{ consultantText.text }}</p>
							    	</div>
							    </div>
							</div>
						</div>

						<div :class="{ 'quiz-gifts': true, 'mt-5': true, 'for_editing': styleMode }" :style="{ color: gift_color.hex, borderRadius: gift_border.radius + 'px' }" v-if="addBlockElements.length == 2" @click="whichPopover = 'gifts'; showModalPop($event, 'left')">
								<div class="editor-overlay" v-show="styleMode"></div>
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
						<div v-if="addBlockElements.length == 1" :class="{ 'gift-one': true, 'mt-5': true, 'for_editing': styleMode }" :style="{ color: gift_color.hex, borderRadius: gift_border.radius + 'px' }" @click="whichPopover = 'gifts'; showModalPop($event, 'left')">
								<div class="editor-overlay" v-show="styleMode"></div>
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

			<div class="main_style_change" v-show="styleMode">
				<div @click="whichPopover = 'bg'; showModalPop($event, 'left')">
					<img src="../../static/questions/style_bg.png" width="36" height="36">
				</div>
				<div @click="whichPopover = 'fonts'; showModalPop($event, 'left')">
					<img src="../../static/questions/style_font.png" width="36" height="36">
				</div>
			</div>
		</section>

		<b-container v-show="!q_spinner" fluid class="main_content my_mb">
		  <b-card>
	  		  <b-row>
	  	          <b-col xl="3" lg="4" md="5" class="my_mb_steps">
					<h4 class="mb-4">Список шагов</h4>
					<b-list-group class="edit_list_questions mb-3">
						<b-list-group-item v-for="(question, index) in questions" :key="index" ref="question_elem" @click="activeQuestion(index)">
							<span>{{ question.question }}</span>
							<i class="far fa-trash-alt" title="Удалить вопрос" @click="deleteQuestion(index)"></i>
						</b-list-group-item>
					</b-list-group>
					<b-button variant="outline-primary" size="lg" v-b-modal.modal-add>
						<span>Добавить вопрос +</span> 
					</b-button>
					<b-modal id="modal-add" hide-footer title="Добавить вопрос">
						<div role="group">
						    <label for="input-add">Добавьте заголовок вопроса:</label>
						    <b-form-input id="input-add"
						                  type="text"
						                  ref="addinput"
						                  placeholder="Заголовок вопроса">
						    </b-form-input>
						    <span class="text-danger error" v-show="addInputError">Поле обязательное для заполнения</span>
						</div>
						<hr>
						<div role="group">
						    <p>
						    	Выберите тип вопроса: <br>
						    	<span class="text-danger error" v-show="addChoiceTypeError">Выберите один из вариантов</span>
						    </p>
						    
						    <div class="d-flex mt-2 flex-wrap justify-content-center" ref="type_choice">
						    	<div class="type_item" @click="choiceType(0)">
						    		<div class="type_top img-radio">
						    			<!-- <img src="../../static/img/radio.png" height="28"> -->
						    		</div>
						    		<div class="type_bottom mt-2">
						    			<p>Единичный выбор</p>
						    		</div>
						    	</div>
						    	<div class="type_item" @click="choiceType(1)">
						    		<div class="type_top img-checkbox">
						    			<!-- <img src="../../static/img/checkbox.png" height="28"> -->
						    		</div>
						    		<div class="type_bottom mt-2">
						    			<p>Множественный выбор</p>
						    		</div>
						    	</div>
						    	<div class="type_item" @click="choiceType(2)">
						    		<div class="type_top img-input">
						    			<!-- <img src="../../static/img/input.png" height="24"> -->
						    		</div>
						    		<div class="type_bottom mt-2">
						    			<p>Поле для ввода</p>
						    		</div>
						    	</div>
						    	<div class="type_item" @click="choiceType(3)">
						    		<div class="type_top img-calendar">
						    			<!-- <img src="../../static/img/q_calendar.png" height="28"> -->
						    		</div>
						    		<div class="type_bottom mt-2">
						    			<p>Выбор даты</p>
						    		</div>
						    	</div>
						    	<div class="type_item" @click="choiceType(4)">
						    		<div class="type_top img-range">
						    			<!-- <img src="../../static/img/range.png" height="20"> -->
						    		</div>
						    		<div class="type_bottom mt-2">
						    			<p>Ползунок</p>
						    		</div>
						    	</div>
						    </div>
						</div>
						<hr>
						<div class="d-flex justify-content-end">
							<b-button variant="outline-secondary" @click="hideModal()">
				                Закрыть
				            </b-button>
				            <b-button variant="primary" class="ml-2" @click="addQuestion()">
	                            Добавить вопрос
	                        </b-button>
						</div>
					</b-modal>
	  	          </b-col>
	  	          <b-col xl="4" lg="8" md="7" class="my_mb_questions">
	          		<h4 class="mb-4">Редактирование вопроса</h4>
	          		<b-input-group>
	          		    <b-form-input placeholder="Заголовок вопроса" size="lg" :value="questions[questionIndex].question" @keyup.native="changeQuestion($event.target.value)"></b-form-input>
	          		</b-input-group>
	          		<span class="text-danger error" v-show="titleQuestionError">Поле обязательное для заполнения</span>
	      		    <select ref="select_types" class="mt-3 form-control custom-select" @change="changeTypeQ($event)">
	      		        <option value="radio">Единичный выбор</option>
	      		        <option value="checkbox">Множественный выбор</option>
	      		        <option value="text">Поле для ввода</option>
	      		        <option value="date">Выбор даты</option>
	      		        <option value="range">Ползунок</option>
	      		    </select>
			        <hr v-show="questions[questionIndex].type !== 'date'">
			        <h6 class="mb-4 mt-4">
			        	{{ questions[questionIndex].type == 'radio' || questions[questionIndex].type == 'checkbox' ? 'Варианты ответов' : questions[questionIndex].type == 'text' ? 'Редактирование своего поля' : questions[questionIndex].type == 'range' ? 'Редактирование поля с диапазоном значений' : '' }}
			    	</h6>
			        <b-list-group class="edit_answers" v-if="questions[questionIndex].type == 'radio' || questions[questionIndex].type == 'checkbox'">
			        	<Container @drop="onDrop" drag-handle-selector=".fa-arrows-alt">            
	        	            <Draggable v-for="(answer, index) in questions[questionIndex].choices" :key="index">
	        	            	<div class="draggable-item">
	        	              		<b-list-group-item class="mb-1 mt-1">
      				        	   		<span>{{ answer }}</span>
      				        	   		<div class="edit_question_btns">
      				        	   			<i class="far fa-edit" @click="editAnswer(index)"></i>
      				        	   			<i class="far fa-trash-alt" @click="deleteAnswer(index)"></i>
      				        	   			<i class="fas fa-arrows-alt"></i>
      				        	   		</div>
      				        	    </b-list-group-item>
	        	            	</div>
	        	        	</Draggable>
	        	        </Container>
						<b-modal id="modal-answer" data-index="0" ref="modal_answer" hide-footer title="Редактировать ответ">
							<div role="group">
								<label>Вариант ответа:</label>
							    <b-form-input type="text" ref="edited_answer" placeholder="Напишите ответ">
							    </b-form-input>
							    <span class="text-danger error" v-show="editAnswerError">Поле обязательное для заполнения</span>
							</div>
							<hr>
							<div role="group">
								<label>Заголовок подсказки:</label>
								<b-form-input class="mb-3" ref="help_title" type="text" placeholder="Заголовок подсказки"></b-form-input>
								<label>Описание подсказки:</label>
							    <b-form-textarea placeholder="Напишите подсказку для данного ответа"
							    				 v-model="textarea_answer"
						                         :rows="3"
						                         :max-rows="6"
						                         class="mb-3"
						                         ref="help_desc">
						        </b-form-textarea>
						        <label>Изображение для подсказки:</label>
		                  	    <div class="mb-2 custom-file b-form-file">
		                  	    	<b-form-file accept=".jpg, .png, .gif" placeholder="Загрузить изображение..." @change="uploadImgEditHelp($event)"></b-form-file>

		                  	    	<!-- <input type="file" ref="edit_help_img" @input="uploadImgEditHelp()" accept=".jpg, .png, .gif" class="custom-file-input">
		                  	    			                  	        <label class="custom-file-label" ref="label_edit_help_img">
		                  	    			                  	        	Загрузить изображение...
		                  	    			                  	        </label> -->
		                  	    </div>
							</div>
							<hr>
							<div class="d-flex justify-content-end">
								<b-button variant="outline-secondary" @click="hideModalAnswer()">
					                Закрыть
					            </b-button>
					            <b-button variant="primary" class="ml-2" @click="confirmAnswer()">
		                            Редактировать
		                        </b-button>
							</div>
						</b-modal>
			        </b-list-group>
	        	    <b-button v-if="questions[questionIndex].type == 'radio' || questions[questionIndex].type == 'checkbox'" variant="outline-primary" size="lg" class="mt-1 btn-block" @click="addAnswer()">
	  	    		  <span>Добавить вариант +</span> 
	  	    	    </b-button>
    				<b-modal id="modal-add-answer" hide-footer title="Добавить вариант ответа">
						<div role="group">
							<label>Название ответа</label>
						    <b-form-input ref="input_new_answer" type="text" placeholder="Напишите ответ"></b-form-input>
						    <span class="text-danger error" v-show="newAnswerError">Поле обязательное для заполнения</span>
						</div>
						<hr>
						<div role="group">
							<label>Заголовок подсказки</label>
							<b-form-input class="mb-3" ref="new_help_title" type="text" placeholder="Заголовок подсказки"></b-form-input>
							<label>Описание подсказки:</label>
						    <b-form-textarea placeholder="Напишите подсказку для данного ответа"
						    				 v-model="textarea_answer"
					                         :rows="3"
					                         :max-rows="6"
					                         class="mb-3"
					                         ref="new_help_desc">
					        </b-form-textarea>
					        <label>Изображение для подсказки</label>
	        	    	    <div class="mb-2 custom-file b-form-file">
	        	    	    	<b-form-file accept=".jpg, .png, .gif" ref="uploadImgNewHelp" placeholder="Загрузить изображение..." @change="uploadImgNewHelp($event)"></b-form-file>

	        	    	    	<!-- <input type="file" ref="new_help_img" @input="uploadImgNewHelp()" accept=".jpg, .png, .gif" class="custom-file-input">
	        	    	    		        	    	        <label class="custom-file-label" ref="label_new_help_img">
	        	    	    		        	    	        	Загрузить изображение...
	        	    	    		        	    	        </label> -->
	        	    	    </div>
						</div>
						<hr>
						<div class="d-flex justify-content-end">
							<b-button variant="outline-secondary" @click="hideModalAddAnswer()">
				                Закрыть
				            </b-button>
				            <b-button variant="primary" class="ml-2" @click="addNewAnswer()">
	                            Добавить вариант
	                        </b-button>
						</div>
    				</b-modal>
    				<div v-if="questions[questionIndex].type == 'text'">
    					<b-form-input type="text"
    								  class="mb-3"
    								  size="lg"
    					              placeholder="Значение по умолчанию для поля"
    					              :value="questions[questionIndex].forText"
    					              @keyup.native="changeTextValue($event)">           	
    					</b-form-input>
    					<b-form-input type="text"
    								  size="lg"
    					              placeholder="Подсказка для поля"
    					              :value="questions[questionIndex].forTextPlaceholder"
    					              @keyup.native="changeTextPlaceholder($event)">           	
    					</b-form-input>
    				</div>
    				<div v-if="questions[questionIndex].type == 'range'">
    					<label>Минимальное значение</label>
						<b-form-input type="number"
									  class="mb-3"
									  size="lg"
						              placeholder="Минимальное значение"
						              :value="questions[questionIndex].min"
						              @keyup.native="changeMin($event)">           	
						</b-form-input>
						<label>Максимальное значение</label>
						<b-form-input type="number"
									  class="mb-3"
									  size="lg"
						              placeholder="Максимальное значение"
						              :value="questions[questionIndex].max"
						              @keyup.native="changeMax($event)">           	
						</b-form-input>
						<label>Значение по умолчанию</label>
						<b-form-input type="number"
									  class="mb-3"
									  size="lg"
						              placeholder="Значение по умолчанию"
						              :value="questions[questionIndex].default"
						              @keyup.native="changeDefalutRange($event)">           	
						</b-form-input>
						<label>Шаг ползунка</label>
						<b-form-input type="number"
									  size="lg"
						              placeholder="Шаг ползунка"
						              :value="questions[questionIndex].step"
						              @keyup.native="changeStep($event)">           	
						</b-form-input>
    				</div>
	  	    	    <hr v-if="questionIndex > 0">
	        	    <div class="d-flex align-items-center" v-if="questionIndex > 0">
		        	    <b-button variant="outline-primary" @click="addModalCond()">
	      	    		  <span>Показать этот вопрос при условии</span>
	      	    		  <i class="fas fa-code-branch ml-2"></i> 
	      	    	    </b-button>
        				<b-modal id="modal-cond" ref="modal_cond" hide-footer title="Добавить условие" @hide="closeModalCond()">
        					<div data-cond="0" class="cond_index"></div>
        					<div v-for="(cond, index) in questions[questionIndex].ifs" class="mb-4">
        						<div>
        							<strong class="mr-2">Условие {{ index + 1 }}</strong>
        							<span>
        								<i class="far fa-trash-alt trash_cond" @click="deleteCond(index)"></i>
        							</span>
        						</div>
        						<div class="mt-3">
        							<label>Показать, если в ответ на вопрос</label>
				  		    		<i class="fas fa-question-circle ml-2" id="exPopoverCond"></i>
				  		    		<b-popover target="exPopoverCond" triggers="hover focus">
					    		      Ветвления работают с единичными вопросами
					    		    </b-popover>
	    							<select class="form-control custom-select cond_question" ref="select_question" @change="getAnswersFunc($event.target)">
								    </select>
        						</div>
        						<div class="mt-3">
        							<label>Дан ответ</label>
        							<select class="form-control custom-select" ref="select_choices" @change="changeCondAnswer($event, index)">
    							    </select>
        						</div>
        					</div>
							<b-button variant="primary" @click="addCond()">
				                Добавить условие
				            </b-button>
				            <div class="d-flex mt-3" v-if="questions[questionIndex].ifsMode != undefined">
				            	<!-- <b-form-radio-group id="radios-cond" @change="changeCondMode($event)" ref="radio_cond">
				            		<b-form-radio value="one">обязательно хотя бы одно условие</b-form-radio>
				            										<b-form-radio value="all" class="mb-1" checked="checked">все условия обязательны</b-form-radio>
				            									</b-form-radio-group> -->
				            </div>
    						<hr>
    						<div class="d-flex justify-content-end">
    							<b-button variant="outline-secondary" @click="hideModalCond()">
    				                Закрыть
    				            </b-button>
    						</div>
        				</b-modal>
	        	    </div>
	      		    <div v-if="questions[questionIndex].type == 'radio' || questions[questionIndex].type == 'checkbox'" :class="questionIndex === 0 ? 'mt-3' : ''">
	          		    <b-form-checkbox id="add-input"
				                         :class="questionIndex > 0 ? 'mt-3' : 'mt-0'"
				                         @change="addInput()"
				                         :checked="questions[questionIndex].addInput">
				        	Позволить пользователю вводить свой ответ
				        </b-form-checkbox>
						<b-form-input type="text" 
									  :value="questions[questionIndex].placeholder"
									  placeholder="Напишите подсказку для доп. поля"
									  class="mt-2"
									  v-if="questions[questionIndex].addInput"
									  @keyup.native="changePlaceholder($event.target.value)">
					    </b-form-input>
	      		    </div>
	  	          </b-col>
	  	          <b-col xl="5" lg="12" class="my_configuration">
	  	          	<h4 class="mb-4">Настройка конфигуратора</h4>
	  	          	<b-form-select v-model="config" :options="options" class="mb-2 mr-sm-3" size="lg" @change="fixSlider($event)"/>
	  	          	<hr>
	  	          	<h6 class="mb-4 mt-4">
	  	          		{{ config == 'gallery' ? 'Элементы галереи' : config == 'video' ? 'Элементы видео' : config == 'consultant' ? 'Консультант' : '' }} 
  	          		</h6>
	  	          	<b-list-group class="edit_config" v-if="config == 'gallery'">
			        	<Container @drop="onDropGallery" drag-handle-selector=".fa-arrows-alt">
	        	            <Draggable v-for="(element, index) in galleryElements" :key="index">
	        	            	<div class="draggable-item">
          		  	          		<b-list-group-item class="mb-1 mt-1"
          											   :style="{ backgroundImage: 'url(' + element.src + ')', backgroundPosition: 'center left', backgroundSize: '53px 53px', backgroundRepeat: 'no-repeat' }"
          		  	          						   >
          		  	          			<span>{{ element.title }}</span>
          		  	          			<div class="edit_config_btns">
          		  	          				<i class="far fa-edit" @click="editGalleryElem(index)"></i>
          		  	          				<i class="far fa-trash-alt" @click="deleteElemGallery(index)"></i>
          		  	          				<i class="fas fa-arrows-alt"></i>
          		  	          			</div>
          		  	          		</b-list-group-item>
	        	            	</div>
	        	        	</Draggable>
        					<b-modal id="modal-edit-gallery" ref="modal_edit_gallery"  hide-footer title="Редактировать элемент галереи">
        						<div data-gallery-index="0" class="modal_edit_gallery"></div>
        						<div role="group" class="mb-3">
        							<label>Название элемента</label>
        						    <b-form-input type="text" ref="edited_title_gallery" placeholder="Напишите название элемента">
        						    </b-form-input>
        						    <span class="text-danger error" v-show="editGalleryError">Поле обязательное для заполнения</span>
        						</div>
        						<div role="group">
					    	    	<label class="mb-2">Изображение для элемента</label>
				  	    	    	<div class="mb-2 custom-file b-form-file">
										<b-form-file accept=".jpg, .png, .gif" placeholder="Загрузить изображение..." @change="uploadImgGallery($event)" class="mb-3"></b-form-file>
				  	    	    	</div>
				  	    	    	<span class="text-danger error" v-show="editGalleryImgError">Загрузите изображение</span>
        						</div>
        						<hr>
								<b-tabs>
								  	<b-tab title="Доп. информация" active>
		        						<div role="group" class="pt-3" ref="more_gallery_info">
						  	    	    	<template v-for="(elem, index) in moreGalleryInfo">
				        						<label class="mb-2 mr-2" v-if="index % 2 != 1">
				        							Доп. поле #{{ index / 2 + 1 }}
				        						</label>
				        						<span v-if="index % 2 != 1">
				        							<i class="far fa-trash-alt trash_cond" @click="deleteGalleryInfo(index)"></i>
				        						</span>
							  	    	    	<b-form-input type="text" 
						  	    	    					  :value="elem"
						  	    	    					  :class="index % 2 == 0 ? 'gallery_key mb-2' : 'gallery_value mb-3'"
						  	    	    					  :placeholder="index % 2 == 0 ? 'Заголовок' : 'Значение'">
						  	    	    	    </b-form-input>
						  	    	    	</template>
						  	    	    	<b-button variant="primary" @click="addGalleryInfo()">
						  	    	    	    Добавить доп. поле
						  	    	    	</b-button>
						  	    	    	<hr>
		        						</div>
									</b-tab>
									<b-tab title="Фильтры" >
										<p class="pt-3">
											Выберите условия показа
						  		    		<i class="fas fa-question-circle ml-2" id="exPopoverManual-filter"></i>
						  		    		<b-popover target="exPopoverManual-filter" placement="right" triggers="hover focus">
							    		      Ниже выпадающие списки с единичными ответами на вопросы. Если ответ пользователя совпадет с условием фильтра, то все остальные отсеятся. Ответ «Не выбрано» не будет учитыватся при фильтрации
							    		    </b-popover>
										</p>
								    	<div role="group">
								    		<b-form-select :options="questions[index].choices" 
								    					   v-for="(elem, index) in questions"
								    					   class="mb-2"
								    					   ref="edit_select_filter"
								    					   v-if="elem.type === 'radio'"/>
								    	</div>
								    	<hr>
									</b-tab>
								</b-tabs>
        						<div class="d-flex justify-content-end">
        							<b-button variant="outline-secondary" @click="hideModalEditGallery()">
        				                Закрыть
        				            </b-button>
        				            <b-button variant="primary" class="ml-2" @click="confirmElementGallery()">
        	                            Редактировать
        	                        </b-button>
        						</div>
        					</b-modal>
	        	        </Container>
	  	          	</b-list-group>
	        	    <b-button variant="outline-primary" size="lg" class="mt-1 btn-block" v-if="config == 'gallery'" @click="addElementGallery()">
	  	    		  <span>Добавить элемент для галереи +</span> 
	  	    	    </b-button>
					<b-modal id="modal-add-gallery" ref="modal_add_gallery"  hide-footer title="Добавить элемент для галереи">
						<div role="group" class="mb-3">
							<label>Название элемента</label>
						    <b-form-input type="text" ref="add_title_gallery" placeholder="Напишите название элемента">
						    </b-form-input>
						    <span class="text-danger error" v-show="newGalleryError">Поле обязательное для заполнения</span>
						</div>
						<div role="group">
			    	    	<label class="mb-2">Изображение для элемента</label>
		  	    	    	<div class="mb-2 custom-file b-form-file">
								<b-form-file accept=".jpg, .png, .gif" placeholder="Загрузить изображение..." @change="uploadAddImgGallery($event)" ref="uploadAddImgGallery"></b-form-file>

		  	    	    		<!-- <input type="file" ref="add_upload_img_gallery" @change="uploadAddImgGallery()" accept=".jpg, .png, .gif" class="custom-file-input">
		  	    	    				  	    	    	    <label class="custom-file-label" ref="add_label_upload_img_gallery">
		  	    	    				  	    	    	    	Загрузить изображение...
		  	    	    				  	    	    	    </label> -->
		  	    	    	    <span class="text-danger error" v-show="newGalleryImgError">Загрузите изображение</span>
		  	    	    	</div>
						</div>
						<hr>
						<b-tabs>
						  	<b-tab title="Доп. информация" active>
    							<div role="group" ref="add_more_gallery_info" class="pt-3">
    			  	    	    	<template v-for="(elem, index) in moreGalleryInfo">
    	        						<label class="mb-2 mr-2" v-if="index % 2 != 1">
    	        							Доп. поле #{{ index / 2 + 1 }}
    	        						</label>
    	        						<span v-if="index % 2 != 1">
    	        							<i class="far fa-trash-alt trash_cond" @click="deleteGalleryInfo(index)"></i>
    	        						</span>
    				  	    	    	<b-form-input type="text" 
    			  	    	    					  :value="elem"
    			  	    	    					  :class="index % 2 == 0 ? 'gallery_key mb-2' : 'gallery_value mb-3'"
    			  	    	    					  :placeholder="index % 2 == 0 ? 'Заголовок' : 'Значение'">
    			  	    	    	    </b-form-input>
    			  	    	    	</template>
    			  	    	    	<b-button variant="primary" @click="addGalleryInfo()">
    			  	    	    	    Добавить доп. поле
    			  	    	    	</b-button>
    			  	    	    	<hr>
    							</div>
							</b-tab>
							<b-tab title="Фильтры" >
								<p class="pt-3">
									Выберите условия показа
				  		    		<i class="fas fa-question-circle ml-2" id="exPopoverManual-filter2"></i>
				  		    		<b-popover target="exPopoverManual-filter2" placement="right" triggers="hover focus">
					    		      Ниже выпадающие списки с единичными ответами на вопросы. Если ответ пользователя совпадет с условием фильтра, то все остальные отсеятся. Ответ «Не выбрано» не будет учитыватся при фильтрации
					    		    </b-popover>
								</p>
						    	<div role="group">
						    		<b-form-select :options="questions[index].choices" 
						    					   v-for="(elem, index) in questions"
						    					   class="mb-2"
						    					   ref="select_filter"
						    					   v-if="elem.type === 'radio'"/>
						    	</div>
						    	<hr>
							</b-tab>
						</b-tabs>
						
						<div class="d-flex justify-content-end">
							<b-button variant="outline-secondary" @click="hideModalAddGallery()">
				                Закрыть
				            </b-button>
				            <b-button variant="primary" class="ml-2" @click="addNewElementGallery()">
	                            Добавить
	                        </b-button>
						</div>
					</b-modal>
	  	    	    <div v-if="config == 'video'">
    	            	<b-form-radio-group stacked class="choice_player" :checked="youtubePlayer" id="radios-player" @change="changePlayer($event)" ref="radio_player">
    	            		<b-form-radio value="true">
    	            			<label>Вставьте ссылку на видео из Youtube</label>
		  	    	    		<b-form-input type="text" 
		  	    	    					  class="mb-3 mt-2"
		  	    	    					  :value="videoElements[questionIndex].src"
		  	    	    					  placeholder="Вставьте ссылку на видео из Youtube"
		  	    	    					  @keyup.native="changeYoutubeLink($event.target.value)">
		  	    	    	    </b-form-input>
    	            		</b-form-radio>
    						<b-form-radio value="false" class="mb-1" checked="checked">
				    	    	<label class="mb-2">Загрузить видео локально</label>
			  	    	    	<div class="mb-3 custom-file b-form-file">
			  	    	    		<b-form-file accept=".mp4" placeholder="Загрузить видео файл..." @change="uploadVideo($event)" class="mb-3"></b-form-file>
			  	    	    	</div>
    						</b-form-radio>
    					</b-form-radio-group>
	          		    <b-form-checkbox id="add-autoplay"
				                         @change="autoplayOn($event)"
				                         :checked="videoElements[questionIndex].autoplay">
				        	Автовоспроизведение видео
				        </b-form-checkbox>
	  	    	    </div>
	  	    	    <div v-if="config == 'consultant'">
				        <label>Фото консультанта</label>
        	    	    <b-form-file accept="image/*" v-model="consultantImg" placeholder="Загрузить изображение..." @change="uploadConsultantImg($event)" class="mb-3"></b-form-file>
	  	    	    	<label>Имя</label>
	  	    	    	<b-form-input type="text" 
  	    	    					  :value="consultantName"
  	    	    					  size="lg"
  	    	    					  class="mb-3"
  	    	    					  placeholder="Напишите имя консультанта"
  	    	    					  @keyup.native="changeConsultantName($event.target.value)">
  	    	    	    </b-form-input>
  	    	    	    <label>Должность</label>
    	    	    	<b-form-input type="text" 
    	    	    				  :value="consultantDescription"
    	    	    				  size="lg"
    	    	    				  class="mb-3"
    	    	    				  placeholder="Напишите должность консультанта"
    	    	    				  @keyup.native="changeConsultantDesc($event.target.value)">
    	    	        </b-form-input>
    	    	    	<label>Комментарий консультанта на этом вопросе</label>
      	    	    	<textarea :value="consultantElements[questionIndex].words"
  	    	    				  size="lg"
  	    	    				  class="form-control mb-3" 
  	    	    				  rows="3" wrap="soft"
  	    	    				  placeholder="Напишите комментарий консультанта"
  	    	    				  @input="changeConsultantWords($event.target.value)">
      	    	        </textarea>
	  	    	    	<template v-for="(addConsultantText, index) in moreConsultantText">
		  	    	    	<label>Доп. поле #{{ index + 1 }}</label>
		  	    	    	<i class="far fa-trash-alt trash_cons_text" v-if="index > 0" @click="deleteConsultantText(index)"></i>
		  	    	    	<b-form-input type="text" 
	  	    	    					  :value="addConsultantText.text"
	  	    	    					  class="mb-3"
	  	    	    					  placeholder="Напишите доп. текст для консультанта"
	  	    	    					  @keyup.native="changeAddConsultantText($event.target.value, index)">
	  	    	    	    </b-form-input>
	  	    	    	</template>
		        	    <b-button variant="outline-primary" class="btn-block" @click="newConsultantText()">
	      	    			<span>Добавить доп. поле</span> 
	      	    	    </b-button>
	  	    	    </div>
	  	    	    <hr>
	        	    <div class="d-flex align-items-center">
		        	    <b-button variant="outline-primary" v-b-modal.block-config>
	      	    			<span>Добавить блок под конфигуратор</span> 
	      	    	    </b-button>
	  		    		<!-- <i class="fas fa-question-circle ml-3" id="exPopoverManual3"></i>
	  		    		<b-popover target="exPopoverManual3" triggers="hover focus">
	  		    				    		    	Добавить блок под конфигуратор
	  		    				    		    </b-popover> -->
	        	    </div>
	        	    <b-modal id="block-config" ref="block_config" hide-footer title="Добавить/Редактировать блок">
	        	    	<div role="group" v-for="(elem, index) in addBlockElements">
	        	    		<strong class="d-block mb-2">
	        	    			Доп. блок #{{ index + 1 }} 
	        	    			<i class="far fa-trash-alt trash_cond pl-2" @click="deleteAddBlock(index)"></i>
	        	    		</strong>
	        	    		<label>Заголовок</label>
		  	    	    	<b-form-input type="text" 
	  	    	    					  :value="elem.title"
	  	    	    					  class="mb-3"
	  	    	    					  ref="title_add_block"
	  	    	    					  placeholder="Заголовок для доп. блока"
	  	    	    					  >
	  	    	    	    </b-form-input>
	    	    	    	<label>Изображение</label>
	    	    	    	<b-form-file accept="image/*" v-model="elem.src" placeholder="Загрузить изображение..." @change="uploadImgAddBlock($event, index)" class="mb-3"></b-form-file>
	      	    	    	<!-- <div class="mb-3 custom-file b-form-file">
	      	    	    	
	      	    	    		<input ref="src_add_block" @input="uploadImgAddBlock($event, index)" type="file" accept=".png, .jpg, .gif, .jpeg" class="custom-file-input">
	      	    	    			      	    	    	    <label class="custom-file-label" ref="label_src_add_block">
	      	    	    			      	    	    	        {{ elem.src == '' ? 'Загрузить изображение...' : elem.src }}
	      	    	    			      	    	    	    </label>
	      	    	    	</div> -->
    	  	    	    	<label>Описание</label>
	    	    	    	<textarea :value="elem.name"
		    	    				  class="form-control mb-3"
		    	    				  ref="name_add_block" 
		    	    				  rows="3" wrap="soft"
		    	    				  placeholder="Доп. текст для блока">
	    	    	        </textarea>
	        	    	</div>
	    				<b-button variant="primary" v-if="addBlockElements.length < 2" @click="newAddBlock()">
	    	                Добавить ещё один блок
	    	            </b-button>
    					<hr>
						<div class="d-flex justify-content-end">
							<b-button variant="outline-secondary" @click="hideModalAddBlock()">
				                Закрыть
				            </b-button>
				            <b-button variant="primary" class="ml-2" @click="confirmAddBlock()">
	                            Редактировать
	                        </b-button>
						</div>
        	        </b-modal>
	  	          </b-col>
	  	      </b-row>
		  </b-card>
		</b-container>

    	<template v-if="showPopover && !q_spinner">
    	 	<!-- <div class="modal-backdrop" @click="targetPopover($event)"> -->
	    	<div class="modal my_modal_popover">
					<header class="modal-header">
						<slot name="header">
							<span>
								{{ whichPopover == 'header' ? 'Шапка (лого и текст)' :
								   whichPopover == 'progress' ? 'Прогресс-бар' :
								   whichPopover == 'question-block' ? 'Блок с вопросом' :
								   whichPopover == 'question-button' ? 'Блок с вопросом' :
								   whichPopover == 'question-radio' ? 'Блок с вопросом' :
								   whichPopover == 'question-checkbox' ? 'Блок с вопросом' :
								   whichPopover == 'question-text' ? 'Блок с вопросом' :
								   whichPopover == 'question-date' ? 'Блок с вопросом' :
								   whichPopover == 'question-range' ? 'Блок с вопросом' :
								   whichPopover == 'gifts' ? 'Доп. блок' :
								   whichPopover == 'result' ? 'Верхняя плашка' :
								   whichPopover == 'gallery' ? 'Галерея' :
								   whichPopover == 'video' ? 'Видео' :
								   whichPopover == 'consultant-top' ? 'Блок консультанта' :
								   whichPopover == 'consultant-words' ? 'Блок консультанта' :
								   whichPopover == 'consultant-add' ? 'Блок консультанта' :
								   whichPopover == 'bg' ? 'Фон' :
								   whichPopover == 'fonts' ? 'Шрифты' :
								   '' }}
							</span>
							<button type="button" class="btn-close" @click="closePopover()">
								x
							</button>	
						</slot>
					</header>
	        <section class="modal-body">
		        <slot name="body">
	        	<template v-if="whichPopover == 'header'">
	        		<b-tabs>
	        			<b-tab title="Общее" class="pt-3 pb-2">
	        				<div role="group" class="mb-4">
	        					<label>Горизонтальное выравнивание</label>
	        					<b-form-select v-model="head_horizontal_align" 
	        								   :options="head_horizontal_align_select" />
	        				</div>
	        				<div role="group" class="mb-4">
	        					<label>Логотип</label>
	        					<b-form-file v-model="head_logo" @change="uploadLogo($event)" placeholder="Загрузить изображение..."></b-form-file>
	        				</div>
	        				<div role="group">
	        					<label>Описание</label>
	        					<b-form-input v-model="head_desc" class="mb-2"
	        					              type="text"
	        					              placeholder="Напишите описание">
	        					</b-form-input>
	        					<b-form-checkbox id="checkbox-desc"
	        					                 v-model="head_desc_show">
	        					    Скрыть описание
	        					</b-form-checkbox>
	        				</div>
	        			</b-tab>
	        			<b-tab title="Описание" class="pt-3 pb-2">
	        				<div role="group" class="mb-4">
	        					<label>Начертание шрифта</label>
	        					<b-button-group class="d-flex">
	        					    <b-button style="width: 50%" 
	        					    		  @click="head_desc_weight = 'normal'"
	        					    		  variant="outline-secondary"
	        					    		  :class="head_desc_weight == 'normal' ? 'active' : ''">
	        					    	Нормальный
	        						</b-button>
	        					    <b-button style="width: 50%"
	        					    		  @click="head_desc_weight = 'bold'"
	        					    		  variant="outline-secondary"
	        					    		  :class="head_desc_weight == 'bold' ? 'active' : ''">
	        					    	Жирный
	        						</b-button>
	        					</b-button-group>
	        				</div>
	        				<div role="group">
	        					<label>Размер шрифта</label>
	      						<b-input-group append="px">
	      					    	<b-form-input type="number" v-model="head_desc_font_size"></b-form-input>
	      						</b-input-group>
	        				</div>
	        			</b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'progress'">
	        		<b-tabs>
	        			<b-tab title="Общий ползунок" class="pt-3" active>
	        				<b-tabs class="more_tabs">
	        					<b-tab title="Размер" class="pt-4 pb-2" active>
	        						<div role="group">
	        						    <label>Высота ползунка</label>
	        						    <b-input-group append="px">
	        						        <b-form-input type="number" v-model="progress_height"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Цвета" class="pt-4 pb-2">
	        						<div role="group">
	        						    <label>Цвет фона ползунка</label>
	        						    <b-input-group class="mb-4">
	        						        <b-input-group-prepend>
	        						            <b-btn variant="primary" id="exPopoverReactive-progress-bg">Выбрать цвет</b-btn>
	        						            <b-popover target="exPopoverReactive-progress-bg"
	        						                       triggers="click"
	        						                       placement="left">
	      						                    <sketch-picker v-model="progress_bg.color" @input="setBackground('progress_bg', '.progress')" />
	        						            </b-popover>
	        						        </b-input-group-prepend>
	        						        <b-form-input @keyup.native="setBackground('progress_bg', '.progress')" v-model="progress_bg.color.hex"></b-form-input>
	        						    </b-input-group>
	        						    <label>Прозрачность фона</label>
	        						    <div class="d-flex">
	        						        <div style="width: 60%">
	        						            <range-slider
	        						                class="slider_range"
	        						                min="0"
	        						                max="100"
	        						                v-model="progress_bg.opacity"
	        						                @input="setBackground('progress_bg', '.progress')">
	        						            </range-slider>
	        						        </div>
	        						        <p class="ml-3 range_count" style="width: 40%">{{ progress_bg.opacity }}%</p>
	        						    </div>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Отступы" class="pt-4 pb-2">
	        						<div role="group" class="mb-4">
	        						    <label>Верхний отступ</label>
	        						    <b-input-group append="px">
	        						        <b-form-input type="number" v-model="progress_margin_top"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        						<div role="group">
	        						    <label>Нижний отступ</label>
	        						    <b-input-group append="px">
	        						        <b-form-input type="number" v-model="progress_margin_bottom"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Рамки" class="pt-4 pb-2">
	        						<b-form-checkbox id="checkbox-progress-border" class="mb-3"
	        						                 v-model="progress_border.show" @change="setBorder($event, 'progress_border', '.progress')">
	        						    Стилизовать границы
	        						</b-form-checkbox>
	        						<template v-if="progress_border.show == true">
	        						    <div role="group" class="mb-4">
	        						        <label>Размер границы</label>
	        						        <b-input-group append="px">
	        						            <b-form-input type="number" v-model="progress_border.size" @change="setBorder(true, 'progress_border', '.progress')"></b-form-input>
	        						        </b-input-group>
	        						    </div>
	        						    <div role="group">
	        						        <label>Стиль рамки</label>
	        						        <b-button-group class="d-flex mb-4">
	        						            <b-button style="width: 33.33%" 
	        						                      @click="progress_border.type = 'solid'; setBorder(true, 'progress_border', '.progress')"
	        						                      variant="outline-secondary"
	        						                      :class="progress_border.type == 'solid' ? 'active' : ''">
	        						                <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        						            </b-button>
	        						            <b-button style="width: 33.33%"
	        						                      @click="progress_border.type = 'dashed'; setBorder(true, 'progress_border', '.progress')"
	        						                      variant="outline-secondary"
	        						                      :class="progress_border.type == 'dashed' ? 'active' : ''">
	        						                <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        						            </b-button>
	        						            <b-button style="width: 33.34%"
	        						                      @click="progress_border.type = 'dotted'; setBorder(true, 'progress_border', '.progress')"
	        						                      variant="outline-secondary"
	        						                      :class="progress_border.type == 'dotted' ? 'active' : ''">
	        						                <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        						            </b-button>
	        						        </b-button-group>
	        						    </div>
	        						    <div role="group" class="mb-4">
	        						        <label>Цвет рамки</label>
	        						        <b-input-group class="mb-4">
	        						            <b-input-group-prepend>
	        						                <b-btn variant="primary" id="exPopoverReactive-progress-border">Выбрать цвет</b-btn>
	        						                <b-popover target="exPopoverReactive-progress-border"
	        						                           triggers="click"
	        						                           placement="left">
	        						                    <template slot="title">
	        						                        <sketch-picker v-model="progress_border.color" @input="setBorder(true, 'progress_border', '.progress')" />
	        						                    </template>
	        						                </b-popover>
	        						            </b-input-group-prepend>
	        						            <b-form-input @input="setBorder(true, 'progress_border', '.progress')" v-model="progress_border.color.hex"></b-form-input>
	        						        </b-input-group>
	        						    </div>
	        						</template>
	        						<div role="group">
	        						    <label>Радиус скругления уголков рамки</label>
	        						    <b-input-group append="px">
	        						        <b-form-input type="number" v-model="progress_border.radius"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Тени" class="pt-4 pb-2">
	        						<b-form-checkbox id="checkbox-progress-shadow"
	        						                 v-model="progress_shadow.show" @change="setShadow($event, 'progress_shadow', '.progress')">
	        						    Включить тени
	        						</b-form-checkbox>
	        						<template v-if="progress_shadow.show == true">
	        						<div role="group" class="mt-3">
	        						    <label>Тени (сдвиг по x)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="progress_shadow.x" @change="setShadow(true, 'progress_shadow', '.progress')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Тени (сдвиг по y)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="progress_shadow.y" @change="setShadow(true, 'progress_shadow', '.progress')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Радиус размытия теней</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="progress_shadow.blur" @change="setShadow(true, 'progress_shadow', '.progress')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Цвет тени</label>
	        						    <b-input-group class="mb-4">
	        						        <b-input-group-prepend>
	        						            <b-btn variant="primary" id="exPopoverReactive-progress-shadow">Выбрать цвет</b-btn>
	        						            <b-popover target="exPopoverReactive-progress-shadow"
	        						                       triggers="click"
	        						                       placement="top">
	        						                <template slot="title">
	        						                    <sketch-picker v-model="progress_shadow.color" @input="setShadow(true, 'progress_shadow', '.progress')" />
	        						                </template>
	        						            </b-popover>
	        						        </b-input-group-prepend>
	        						        <b-form-input @input="setShadow(true, 'progress_shadow', '.progress')" v-model="progress_shadow.color.hex"></b-form-input>
	        						    </b-input-group>
	        						    <label>Прозрачность фона</label>
	        						    <div class="d-flex">
	        						        <div style="width: 60%">
	        						            <range-slider
	        						                class="slider_range"
	        						                min="0"
	        						                max="100"
	        						                v-model="progress_shadow.opacity"
	        						                @input="setShadow(true, 'progress_shadow', '.progress')">
	        						            </range-slider>
	        						        </div>
	        						        <p class="ml-4 range_count" style="width: 40%">{{ progress_shadow.opacity }}%</p>
	        						    </div>
	        						</div>
	        						</template>
	        					</b-tab>
	        				</b-tabs>
	        			</b-tab>
	        			<b-tab title="Активная часть" class="pt-3">
	        				<b-tabs class="more_tabs">
	        					<b-tab title="Размер" class="pt-4 pb-2" active>
	        						<div role="group">
	        						    <label>Размер текста ползунка</label>
	        						    <b-input-group append="px">
	        						        <b-form-input type="number" v-model="progress_font_size"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Цвета" class="pt-4 pb-2">
	        						<div role="group" class="mb-4">
	        						    <label>Цвет фона</label>
	        						    <b-input-group>
	        						        <b-input-group-prepend>
	        						            <b-btn variant="primary" id="exPopoverReactive-progressbar-bg">Выбрать цвет</b-btn>
	        						            <b-popover target="exPopoverReactive-progressbar-bg"
	        						                       triggers="click"
	        						                       placement="left">
	        						                <template slot="title">
	        						                    <sketch-picker v-model="progressbar_bg" />
	        						                </template>
	        						            </b-popover>
	        						        </b-input-group-prepend>
	        						        <b-form-input v-model="progressbar_bg.hex"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        						<div role="group">
	        						    <label>Цвет текста</label>
	        						    <b-input-group>
	        						        <b-input-group-prepend>
	        						            <b-btn variant="primary" id="exPopoverReactive-progressbar-color-text">Выбрать цвет</b-btn>
	        						            <b-popover target="exPopoverReactive-progressbar-color-text"
	        						                       triggers="click"
	        						                       placement="top"
	        						                       container="myContainer"
	        						                       ref="popover-color">
	        						                <template slot="title">
	        						                    <sketch-picker v-model="progressbar_color_text" />
	        						                </template>
	        						            </b-popover>
	        						        </b-input-group-prepend>
	        						        <b-form-input v-model="progressbar_color_text.hex"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        						
	        					</b-tab>
	        					<b-tab title="Рамки" class="pt-4 pb-2">
	        						<div role="group">
	        						    <label>Радиус скругления уголков</label>
	        						    <b-input-group append="px">
	        						        <b-form-input type="number" v-model="progressbar_radius"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Тени" class="pt-4 pb-2">
	        						<b-form-checkbox id="checkbox-progressbar-shadow"
	        						                 v-model="progressbar_shadow.show" @change="setShadow($event, 'progressbar_shadow', '.progress-bar')">
	        						    Включить тени
	        						</b-form-checkbox>
	        						<template v-if="progressbar_shadow.show == true">
	        						<div role="group" class="mt-3">
	        						    <label>Тени (сдвиг по x)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="progressbar_shadow.x" @change="setShadow(true, 'progressbar_shadow', '.progress-bar')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Тени (сдвиг по y)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="progressbar_shadow.y" @change="setShadow(true, 'progressbar_shadow', '.progress-bar')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Радиус размытия теней</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="progressbar_shadow.blur" @change="setShadow(true, 'progressbar_shadow', '.progress-bar')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Цвет тени</label>
	        						    <b-input-group class="mb-4">
	        						        <b-input-group-prepend>
	        						            <b-btn variant="primary" id="exPopoverReactive-progressbar-shadow">Выбрать цвет</b-btn>
	        						            <b-popover target="exPopoverReactive-progressbar-shadow"
	        						                       triggers="click"
	        						                       placement="left">
	        						                <template slot="title">
	        						                    <sketch-picker v-model="progressbar_shadow.color" @input="setShadow(true, 'progressbar_shadow', '.progress-bar')" />
	        						                </template>
	        						            </b-popover>
	        						        </b-input-group-prepend>
	        						        <b-form-input @input="setShadow(true, 'progressbar_shadow', '.progress-bar')" v-model="progressbar_shadow.color.hex"></b-form-input>
	        						    </b-input-group>
	        						    <label>Прозрачность фона</label>
	        						    <div class="d-flex">
	        						        <div style="width: 60%">
	        						            <range-slider
	        						                class="slider_range"
	        						                min="0"
	        						                max="100"
	        						                v-model="progressbar_shadow.opacity"
	        						                @input="setShadow(true, 'progressbar_shadow', '.progress-bar')">
	        						            </range-slider>
	        						        </div>
	        						        <p class="ml-3 range_count" style="width: 40%">{{ progressbar_shadow.opacity }}%</p>
	        						    </div>
	        						</div>
	        						</template>
	        					</b-tab>
	        				</b-tabs>
	        			</b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'question-block'">
	        		<b-tabs>
	        		    <b-tab title="Общий блок" class="pt-3">
	        		    	<b-tabs class="more_tabs">
	        		    		<b-tab title="Цвета" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Цвет фона</label>
	        		    			  <b-input-group class="mb-4">
	        		    			    <b-input-group-prepend>
	        		    			        <b-btn variant="primary" id="exPopoverReactive-question-bg">Выбрать цвет</b-btn>
	        		    			        <b-popover target="exPopoverReactive-question-bg"
	        		    			                   triggers="click"
	        		    			                   placement="left">
	        		    			            <template slot="title">
	        		    			            <sketch-picker v-model="question_bg.color" @input="setBackground('question_bg', '.question')" />
	        		    			          </template>
	        		    			        </b-popover>
	        		    			      </b-input-group-prepend>
	        		    			      <b-form-input @input="setBackground('question_bg', '.question')" v-model="question_bg.color.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			  <label>Прозрачность фона</label>
	        		    			  <div class="d-flex">
	        		    			      <div style="width: 60%">
	        		    			          <range-slider
	        		    			              class="slider_range"
	        		    			              min="0"
	        		    			              max="100"
	        		    			              v-model="question_bg.opacity"
	        		    			              @input="setBackground('question_bg', '.question')">
	        		    			          </range-slider>
	        		    			      </div>
	        		    			      <p class="ml-3 range_count" style="width: 40%">{{ question_bg.opacity }}%</p>
	        		    			  </div>
	        		    			</div>
	        		    			<div role="group">
	        		    			    <label>Цвет текста</label>
	        		    			    <b-input-group>
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-block-color-text">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-block-color-text"
	        		    			                       triggers="click"
	        		    			                       placement="top"
	        		    			                       container="myContainer"
	        		    			                       ref="popover-color">
	        		    			                <template slot="title">
	        		    			                    <sketch-picker v-model="question_block_color_text" />
	        		    			                </template>
	        		    			            </b-popover>
	        		    			        </b-input-group-prepend>
	        		    			        <b-form-input v-model="question_block_color_text.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Отступы" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Внутренние отступы (вертикально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_vert"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    			<div role="group">
	        		    			  <label>Внутренние отступы (горизонтально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_horz"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Рамки" class="pt-4 pb-2">
	        		    			<div role="group">
	        		    				<b-form-checkbox id="checkbox-question-border"class="mb-3 d-block"
	        		    				                 v-model="question_border.show" @change="setBorder($event, 'question_border', '.question')">
	        		    				    Стилизовать границы
	        		    				</b-form-checkbox>
	        		    				<template v-if="question_border.show == true">
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Размер границы</label>
	        		    				        <b-input-group append="px">
	        		    				            <b-form-input type="number" v-model="question_border.size" @change="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				    <div role="group">
	        		    				        <label>Стиль рамки</label>
	        		    				        <b-button-group class="d-flex mb-4">
	        		    				            <b-button style="width: 33.33%" 
	        		    				                      @click="question_border.type = 'solid'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'solid' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.33%"
	        		    				                      @click="question_border.type = 'dashed'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dashed' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.34%"
	        		    				                      @click="question_border.type = 'dotted'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dotted' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				        </b-button-group>
	        		    				    </div>
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Цвет рамки</label>
	        		    				        <b-input-group class="mb-4">
	        		    				            <b-input-group-prepend>
	        		    				                <b-btn variant="primary" id="exPopoverReactive-question-border">Выбрать цвет</b-btn>
	        		    				                <b-popover target="exPopoverReactive-question-border"
	        		    				                           triggers="click"
	        		    				                           placement="left">
	  		    				                        <sketch-picker v-model="question_border.color" @input="setBorder(true, 'question_border', '.question')" />
	        		    				                </b-popover>
	        		    				            </b-input-group-prepend>
	        		    				            <b-form-input @input="setBorder(true, 'question_border', '.question')" v-model="question_border.color.hex"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				</template>
	        		    			  <label>Радиус скругления уголков</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_radius"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Тени" class="pt-4 pb-2">
	        		    			<b-form-checkbox id="checkbox-question-shadow"
	        		    			               v-model="question_shadow.show" @change="setShadow($event, 'question_shadow', '.question')">
	        		    			    Включить тени
	        		    			</b-form-checkbox>
	        		    			<template v-if="question_shadow.show == true">
	        		    			  <div role="group" class="mt-3">
	        		    			    <label>Тени (сдвиг по x)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.x" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Тени (сдвиг по y)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.y" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Радиус размытия теней</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.blur" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Цвет тени</label>
	        		    			      <b-input-group class="mb-4">
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-shadow"
	        		    			                       triggers="click"
	        		    			                       placement="left">
	        		    			                <template slot="title">
	        		    			                <sketch-picker v-model="question_shadow.color" @input="setShadow(true, 'question_shadow', '.question')" />
	        		    			              </template>
	        		    			            </b-popover>
	        		    			          </b-input-group-prepend>
	        		    			          <b-form-input @input="setShadow(true, 'question_shadow', '.question')" v-model="question_shadow.color.hex"></b-form-input>
	        		    			      </b-input-group>
	        		    			        <label>Прозрачность фона</label>
	        		    			    <div class="d-flex">
	        		    			        <div style="width: 60%">
	        		    			            <range-slider
	        		    			                class="slider_range"
	        		    			                min="0"
	        		    			                max="100"
	        		    			                v-model="question_shadow.opacity"
	        		    			                @input="setShadow(true, 'question_shadow', '.question')">
	        		    			            </range-slider>
	        		    			        </div>
	        		    			        <p class="ml-4 range_count" style="width: 40%">{{ question_shadow.opacity }}%</p>
	        		    			    </div>
	        		    			  </div>
	        		    			</template>
	        		    		</b-tab>
	        		    	</b-tabs> 
	        		    </b-tab>
	        		    <b-tab title="Вопрос" class="pt-3" active>
	        		    	<b-tabs>
	        		    	    <b-tab title="Номер вопроса" class="pt-3">
	        		    	    	<b-tabs class="more_tabs">
	        		    	    		<b-tab title="Размер" class="pt-4 pb-2" active>
	        		    	    			<div role="group" class="mb-4">
	        		    	    			    <label>Ширина блока</label>
	        		    	    			    <b-input-group append="px">
	        		    	    			        <b-form-input type="number" v-model="question_index_width"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			</div>
	        		    	    			<div role="group">
	        		    	    			    <label>Высота блока</label>
	        		    	    			    <b-input-group append="px">
	        		    	    			        <b-form-input type="number" v-model="question_index_height"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			</div>
	        		    	    		</b-tab>
	        		    	    		<b-tab title="Цвета" class="pt-4 pb-2">
	        		    	    			<div role="group">
	        		    	    			    <label>Цвет фона</label>
	        		    	    			    <b-input-group class="mb-4">
	        		    	    			        <b-input-group-prepend>
	        		    	    			            <b-btn variant="primary" id="exPopoverReactive-question-index-bg">Выбрать цвет</b-btn>
	        		    	    			            <b-popover target="exPopoverReactive-question-index-bg"
	        		    	    			                       triggers="click"
	        		    	    			                       placement="left">
	      		    	    			                    <sketch-picker v-model="question_index_bg.color" @input="setBackground('question_index_bg', '.question-number')" />
	        		    	    			            </b-popover>
	        		    	    			        </b-input-group-prepend>
	        		    	    			        <b-form-input @input="setBackground('question_index_bg', '.question-number')" v-model="question_index_bg.color.hex"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			    <label>Прозрачность фона</label>
	        		    	    			    <div class="d-flex">
	        		    	    			        <div style="width: 60%">
	        		    	    			            <range-slider
	        		    	    			                class="slider_range"
	        		    	    			                min="0"
	        		    	    			                max="100"
	        		    	    			                v-model="question_index_bg.opacity"
	        		    	    			                @input="setBackground('question_index_bg', '.question-number')">
	        		    	    			            </range-slider>
	        		    	    			        </div>
	        		    	    			        <p class="ml-3 range_count" style="width: 40%">{{ question_index_bg.opacity }}%</p>
	        		    	    			    </div>
	        		    	    			</div>
	        		    	    		</b-tab>
	        		    	    		<b-tab title="Текст" class="pt-4 pb-2">
	        		    	    			<div role="group" class="mb-4">
	        		    	    			    <label>Размер текста</label>
	        		    	    			    <b-input-group append="px">
	        		    	    			        <b-form-input type="number" v-model="question_index_fz"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			</div>
	        		    	    			<div role="group">
	        		    	    			    <label>Начертание шрифта</label>
	        		    	    			    <b-button-group class="d-flex">
	        		    	    			        <b-button style="width: 50%" 
	        		    	    			                  @click="question_index_weight = 'normal'"
	        		    	    			                  variant="outline-secondary"
	        		    	    			                  :class="question_index_weight == 'normal' ? 'active' : ''">
	        		    	    			            Нормальный
	        		    	    			        </b-button>
	        		    	    			        <b-button style="width: 50%"
	        		    	    			                  @click="question_index_weight = 'bold'"
	        		    	    			                  variant="outline-secondary"
	        		    	    			                  :class="question_index_weight == 'bold' ? 'active' : ''">
	        		    	    			            Жирный
	        		    	    			        </b-button>
	        		    	    			    </b-button-group>
	        		    	    			</div>
	        		    	    		</b-tab>
	        		    	    		<b-tab title="Рамки" class="pt-4 pb-2">
	        		    	    			<div role="group">
	        		    	    			    <b-form-checkbox id="checkbox-question-index-border"class="mb-3"
	        		    	    			                     v-model="question_index_border.show" @change="setBorder($event, 'question_index_border', '.question-number')">
	        		    	    			        Стилизовать границы
	        		    	    			    </b-form-checkbox>
	        		    	    			    <template v-if="question_index_border.show == true">
	        		    	    			        <div role="group" class="mb-4">
	        		    	    			            <label>Размер границы</label>
	        		    	    			            <b-input-group append="px">
	        		    	    			                <b-form-input type="number" v-model="question_index_border.size" @change="setBorder(true, 'question_index_border', '.question-number')"></b-form-input>
	        		    	    			            </b-input-group>
	        		    	    			        </div>
	        		    	    			        <div role="group">
	        		    	    			            <label>Стиль рамки</label>
	        		    	    			            <b-button-group class="d-flex mb-4">
	        		    	    			                <b-button style="width: 33.33%" 
	        		    	    			                          @click="question_index_border.type = 'solid'; setBorder(true, 'question_index_border', '.question-number')"
	        		    	    			                          variant="outline-secondary"
	        		    	    			                          :class="question_index_border.type == 'solid' ? 'active' : ''">
	        		    	    			                    <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        		    	    			                </b-button>
	        		    	    			                <b-button style="width: 33.33%"
	        		    	    			                          @click="question_index_border.type = 'dashed'; setBorder(true, 'question_index_border', '.question-number')"
	        		    	    			                          variant="outline-secondary"
	        		    	    			                          :class="question_index_border.type == 'dashed' ? 'active' : ''">
	        		    	    			                    <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        		    	    			                </b-button>
	        		    	    			                <b-button style="width: 33.34%"
	        		    	    			                          @click="question_index_border.type = 'dotted'; setBorder(true, 'question_index_border', '.question-number')"
	        		    	    			                          variant="outline-secondary"
	        		    	    			                          :class="question_index_border.type == 'dotted' ? 'active' : ''">
	        		    	    			                    <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        		    	    			                </b-button>
	        		    	    			            </b-button-group>
	        		    	    			        </div>
	        		    	    			        <div role="group" class="mb-4">
	        		    	    			            <label>Цвет рамки</label>
	        		    	    			            <b-input-group class="mb-4">
	        		    	    			                <b-input-group-prepend>
	        		    	    			                    <b-btn variant="primary" id="exPopoverReactive-question-index-border">Выбрать цвет</b-btn>
	        		    	    			                    <b-popover target="exPopoverReactive-question-index-border"
	        		    	    			                               triggers="click"
	        		    	    			                               placement="left"
	        		    	    			                               container="myContainer"
	        		    	    			                               ref="popover-color">
	        		    	    			                        <template slot="title">
	        		    	    			                            <sketch-picker v-model="question_index_border.color" @input="setBorder(true, 'question_index_border', '.question-number')" />
	        		    	    			                        </template>
	        		    	    			                    </b-popover>
	        		    	    			                </b-input-group-prepend>
	        		    	    			                <b-form-input v-model="question_index_border.color.hex" @input="setBorder(true, 'question_index_border', '.question-number')"></b-form-input>
	        		    	    			            </b-input-group>
	        		    	    			        </div>
	        		    	    			    </template>
	        		    	    			    <div role="group">
	        		    	    			        <label>Радиус скругления уголков рамки</label>
	        		    	    			        <b-input-group append="px">
	        		    	    			            <b-form-input type="number" v-model="question_index_border.radius"></b-form-input>
	        		    	    			        </b-input-group>
	        		    	    			    </div>
	        		    	    			</div>
	        		    	    		</b-tab>
	        		    	    		<b-tab title="Тень" class="pt-4 pb-2">
	        		    	    			<b-form-checkbox id="checkbox-question-index-shadow"
	        		    	    			                 v-model="question_index_shadow.show" @change="setShadow($event, 'question_index_shadow', '.question-number')">
	        		    	    			    Включить тени
	        		    	    			</b-form-checkbox>
	        		    	    			<template v-if="question_index_shadow.show == true">
	        		    	    			<div role="group" class="mt-3">
	        		    	    			    <label>Тени (сдвиг по x)</label>
	        		    	    			    <b-input-group append="px" class="mb-3">
	        		    	    			        <b-form-input type="number" v-model="question_index_shadow.x" @change="setShadow(true, 'question_index_shadow', '.question-number')"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			    <label>Тени (сдвиг по y)</label>
	        		    	    			    <b-input-group  append="px" class="mb-3">
	        		    	    			        <b-form-input type="number" v-model="question_index_shadow.y" @change="setShadow(true, 'question_index_shadow', '.question-number')"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			    <label>Радиус размытия теней</label>
	        		    	    			    <b-input-group append="px" class="mb-3">
	        		    	    			        <b-form-input type="number" v-model="question_index_shadow.blur" @change="setShadow(true, 'question_index_shadow', '.question-number')"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			    <label>Цвет тени</label>
	        		    	    			    <b-input-group class="mb-4">
	        		    	    			        <b-input-group-prepend>
	        		    	    			            <b-btn variant="primary" id="exPopoverReactive-question-number-shadow">Выбрать цвет</b-btn>
	        		    	    			            <b-popover target="exPopoverReactive-question-number-shadow"
	        		    	    			                       triggers="click"
	        		    	    			                       placement="left">
	        		    	    			                    <sketch-picker v-model="question_index_shadow.color" @input="setShadow(true, 'question_index_shadow', '.question-number')" />
	        		    	    			            </b-popover>
	        		    	    			        </b-input-group-prepend>
	        		    	    			        <b-form-input @input="setShadow(true, 'question_index_shadow', '.question-number')" v-model="question_index_shadow.color.hex"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			    <label>Прозрачность фона</label>
	        		    	    			    <div class="d-flex">
	        		    	    			        <div style="width: 60%">
	        		    	    			            <range-slider
	        		    	    			                class="slider_range"
	        		    	    			                min="0"
	        		    	    			                max="100"
	        		    	    			                v-model="question_index_shadow.opacity"
	        		    	    			                @input="setShadow(true, 'question_index_shadow', '.question-number')">
	        		    	    			            </range-slider>
	        		    	    			        </div>
	        		    	    			        <p class="ml-4 range_count" style="width: 40%">{{ question_index_shadow.opacity }}%</p>
	        		    	    			    </div>
	        		    	    			</div>
	        		    	    			</template>
	        		    	    		</b-tab>
	        		    	    		<b-tab title="Положение" class="pt-4 pb-2">
	        		    	    			<div role="group" class="mb-4">
	        		    	    			    <label>
	        		    	    			        Переместить положение блока (по y)
	        		    	    			    </label>
	        		    	    			    <b-input-group append="px">
	        		    	    			        <b-form-input type="number" v-model="question_index_top"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			</div>
	        		    	    			<div role="group">
	        		    	    			    <label>
	        		    	    			        Переместить положение блока (по x)
	        		    	    			    </label>
	        		    	    			    <b-input-group append="px">
	        		    	    			        <b-form-input type="number" v-model="question_index_left"></b-form-input>
	        		    	    			    </b-input-group>
	        		    	    			</div>
	        		    	    		</b-tab>
	        		    	    	</b-tabs>
	        		    	    </b-tab>
	        		    	    <b-tab title="Заголовок" class="pt-4 pb-2" active>
	        		    	    	<div role="group" class="mb-4">
	        		    	    		<label>Размер текста</label>
	        		    	    		<b-input-group append="px">
	        		    	    	    	<b-form-input type="number" v-model="question_title_fz"></b-form-input>
	        		    	    		</b-input-group>
	        		    	    	</div>
	        		    	    	<div role="group">
	        		    	    		<label>Начертание шрифта</label>
	        		    	    		<b-button-group class="d-flex">
	        		    	    		    <b-button style="width: 50%" 
	        		    	    		    		  @click="question_title_weight = 'normal'"
	        		    	    		    		  variant="outline-secondary"
	        		    	    		    		  :class="question_title_weight == 'normal' ? 'active' : ''">
	        		    	    		    	Нормальный
	        		    	    			</b-button>
	        		    	    		    <b-button style="width: 50%"
	        		    	    		    		  @click="question_title_weight = 'bold'"
	        		    	    		    		  variant="outline-secondary"
	        		    	    		    		  :class="question_title_weight == 'bold' ? 'active' : ''">
	        		    	    		    	Жирный
	        		    	    			</b-button>
	        		    	    		</b-button-group>
	        		    	    	</div>
	        		    	    </b-tab>
	        		    	</b-tabs>
	        		    </b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'question-button'">
	        		<b-tabs>
	        		    <b-tab title="Общий блок" class="pt-3">
	        		    	<b-tabs class="more_tabs">
	        		    		<b-tab title="Цвета" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Цвет фона</label>
	        		    			  <b-input-group class="mb-4">
	        		    			    <b-input-group-prepend>
	        		    			        <b-btn variant="primary" id="exPopoverReactive-question-bg">Выбрать цвет</b-btn>
	        		    			        <b-popover target="exPopoverReactive-question-bg"
	        		    			                   triggers="click"
	        		    			                   placement="left">
	        		    			            <template slot="title">
	        		    			            <sketch-picker v-model="question_bg.color" @input="setBackground('question_bg', '.question')" />
	        		    			          </template>
	        		    			        </b-popover>
	        		    			      </b-input-group-prepend>
	        		    			      <b-form-input @input="setBackground('question_bg', '.question')" v-model="question_bg.color.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			  <label>Прозрачность фона</label>
	        		    			  <div class="d-flex">
	        		    			      <div style="width: 60%">
	        		    			          <range-slider
	        		    			              class="slider_range"
	        		    			              min="0"
	        		    			              max="100"
	        		    			              v-model="question_bg.opacity"
	        		    			              @input="setBackground('question_bg', '.question')">
	        		    			          </range-slider>
	        		    			      </div>
	        		    			      <p class="ml-3 range_count" style="width: 40%">{{ question_bg.opacity }}%</p>
	        		    			  </div>
	        		    			</div>
	        		    			<div role="group">
	        		    			    <label>Цвет текста</label>
	        		    			    <b-input-group>
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-block-color-text">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-block-color-text"
	        		    			                       triggers="click"
	        		    			                       placement="top"
	        		    			                       container="myContainer"
	        		    			                       ref="popover-color">
	        		    			                <template slot="title">
	        		    			                    <sketch-picker v-model="question_block_color_text" />
	        		    			                </template>
	        		    			            </b-popover>
	        		    			        </b-input-group-prepend>
	        		    			        <b-form-input v-model="question_block_color_text.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Отступы" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Внутренние отступы (вертикально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_vert"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    			<div role="group">
	        		    			  <label>Внутренние отступы (горизонтально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_horz"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Рамки" class="pt-4 pb-2">
	        		    			<div role="group">
	        		    				<b-form-checkbox id="checkbox-question-border"class="mb-3 d-block"
	        		    				                 v-model="question_border.show" @change="setBorder($event, 'question_border', '.question')">
	        		    				    Стилизовать границы
	        		    				</b-form-checkbox>
	        		    				<template v-if="question_border.show == true">
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Размер границы</label>
	        		    				        <b-input-group append="px">
	        		    				            <b-form-input type="number" v-model="question_border.size" @change="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				    <div role="group">
	        		    				        <label>Стиль рамки</label>
	        		    				        <b-button-group class="d-flex mb-4">
	        		    				            <b-button style="width: 33.33%" 
	        		    				                      @click="question_border.type = 'solid'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'solid' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.33%"
	        		    				                      @click="question_border.type = 'dashed'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dashed' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.34%"
	        		    				                      @click="question_border.type = 'dotted'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dotted' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				        </b-button-group>
	        		    				    </div>
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Цвет рамки</label>
	        		    				        <b-input-group class="mb-4">
	        		    				            <b-input-group-prepend>
	        		    				                <b-btn variant="primary" id="exPopoverReactive-question-border">Выбрать цвет</b-btn>
	        		    				                <b-popover target="exPopoverReactive-question-border"
	        		    				                           triggers="click"
	        		    				                           placement="left">
	  		    				                        <sketch-picker v-model="question_border.color" @input="setBorder(true, 'question_border', '.question')" />
	        		    				                </b-popover>
	        		    				            </b-input-group-prepend>
	        		    				            <b-form-input v-model="question_border.color.hex" @input="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				</template>
	        		    			  <label>Радиус скругления уголков</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_radius"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Тени" class="pt-4 pb-2">
	        		    			<b-form-checkbox id="checkbox-question-shadow"
	        		    			               v-model="question_shadow.show" @change="setShadow($event, 'question_shadow', '.question')">
	        		    			    Включить тени
	        		    			</b-form-checkbox>
	        		    			<template v-if="question_shadow.show == true">
	        		    			  <div role="group" class="mt-3">
	        		    			    <label>Тени (сдвиг по x)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.x" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Тени (сдвиг по y)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.y" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Радиус размытия теней</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.blur" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Цвет тени</label>
	        		    			      <b-input-group class="mb-4">
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-shadow"
	        		    			                       triggers="click"
	        		    			                       placement="left">
	        		    			                <template slot="title">
	        		    			                <sketch-picker v-model="question_shadow.color" @input="setShadow(true, 'question_shadow', '.question')" />
	        		    			              </template>
	        		    			            </b-popover>
	        		    			          </b-input-group-prepend>
	        		    			          <b-form-input @input="setShadow(true, 'question_shadow', '.question')" v-model="question_shadow.color.hex"></b-form-input>
	        		    			      </b-input-group>
	        		    			        <label>Прозрачность фона</label>
	        		    			    <div class="d-flex">
	        		    			        <div style="width: 60%">
	        		    			            <range-slider
	        		    			                class="slider_range"
	        		    			                min="0"
	        		    			                max="100"
	        		    			                v-model="question_shadow.opacity"
	        		    			                @input="setShadow(true, 'question_shadow', '.question')">
	        		    			            </range-slider>
	        		    			        </div>
	        		    			        <p class="ml-4 range_count" style="width: 40%">{{ question_shadow.opacity }}%</p>
	        		    			    </div>
	        		    			  </div>
	        		    			</template>
	        		    		</b-tab>
	        		    	</b-tabs> 
	        		    </b-tab>
	        		    <b-tab title="Кнопка" class="pt-3" active>
	        		    	<b-tabs class="more_tabs">
	        		    		<b-tab title="Цвета" class="pt-4 pb-2">
	  		    					<div role="group" class="mb-4">
	  		    						<label>Цвет фона</label>
	  		    				    	<b-input-group class="mb-3">
	  		    				    		<b-input-group-prepend>
	  		    				    		    <b-btn variant="primary" id="exPopoverReactive-button-bg">Выбрать цвет</b-btn>
	  		    				    		    <b-popover target="exPopoverReactive-button-bg" triggers="click" placement="left">
			    				    		    		<sketch-picker v-model="button_bg.color" @input="setBackground('button_bg', '.next-questions')" />
	  		    				    		    </b-popover>
	  		    			    		    </b-input-group-prepend>
	  		    				    	    <b-form-input @input="setBackground('button_bg', '.next-questions')" v-model="button_bg.color.hex"></b-form-input>
	  		    				    	</b-input-group>
	  		    				    	<label>Прозрачность фона</label>
	  		    						<div class="d-flex">
	  		    						    <div style="width: 60%">
	  		    						        <range-slider
	  		    						            class="slider_range"
	  		    						            min="0"
	  		    						            max="100"
	  		    						            v-model="button_bg.opacity"
	  		    						            @input="setBackground('button_bg', '.next-questions')">
	  		    						        </range-slider>
	  		    						    </div>
	  		    						    <p class="ml-3 range_count" style="width: 40%">{{ button_bg.opacity }}%</p>
	  		    						</div>
	  		    					</div>
	  		    			    	<div role="group">
	  		    						<label>Цвет текста</label>
	  		    				    	<b-input-group>
	  		    				    		<b-input-group-prepend>
	  		    				    		    <b-btn variant="primary" id="exPopoverReactive-button-color-text">Выбрать цвет</b-btn>
	  		    				    		    <b-popover target="exPopoverReactive-button-color-text"
	  		    				    		               triggers="click"
	  		    				    		               placement="left">
			    				    		    		<sketch-picker v-model="button_color_text" />
	  		    				    		    </b-popover>
	  		    			    		    </b-input-group-prepend>
	  		    				    	    <b-form-input v-model="button_color_text.hex"></b-form-input>
	  		    				    	</b-input-group>
	  		    			    	</div>
	        		    		</b-tab>
	        		    		<b-tab title="Рамки" class="pt-4 pb-2">
			    				    	<div role="group">
			    				    		<b-form-checkbox id="checkbox-button-border" class="mb-3"
			    				    		                 v-model="button_border.show" @change="setBorder($event, 'button_border', '.next-questions')">
			    					      		Стилизовать границы
			    			    		    </b-form-checkbox>
			    							<template v-if="button_border.show == true">
			    								<div role="group" class="mb-4">
			    									<label>Размер границы</label>
			    									<b-input-group append="px">
			    								    	<b-form-input type="number" v-model="button_border.size" @change="setBorder(true, 'button_border', '.next-questions')"></b-form-input>
			    									</b-input-group>
			    								</div>
			    								<div role="group">
			    									<label>Стиль рамки</label>
			    									<b-button-group class="d-flex mb-4">
			    									    <b-button style="width: 33.33%" 
			    									    		  @click="button_border.type = 'solid'; setBorder(true, 'button_border', '.next-questions')"
			    									    		  variant="outline-secondary"
			    									    		  :class="button_border.type == 'solid' ? 'active' : ''">
			    									    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
			    										</b-button>
			    									    <b-button style="width: 33.33%"
			    									    		  @click="button_border.type = 'dashed'; setBorder(true, 'button_border', '.next-questions')"
			    									    		  variant="outline-secondary"
			    									    		  :class="button_border.type == 'dashed' ? 'active' : ''">
			    									    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
			    										</b-button>
			    									    <b-button style="width: 33.34%"
			    									    		  @click="button_border.type = 'dotted'; setBorder(true, 'button_border', '.next-questions')"
			    									    		  variant="outline-secondary"
			    									    		  :class="button_border.type == 'dotted' ? 'active' : ''">
			    									    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
			    										</b-button>
			    									</b-button-group>
			    								</div>
			    								<div role="group" class="mb-4">
			    									<label>Цвет рамки</label>
			    							    	<b-input-group class="mb-4">
			    							    		<b-input-group-prepend>
			    							    		    <b-btn variant="primary" id="exPopoverReactive-question-index-border">Выбрать цвет</b-btn>
			    							    		    <b-popover target="exPopoverReactive-question-index-border"
			    							    		               triggers="click"
			    							    		               placement="left">
			    							    		      	<template slot="title">
			    							    		    		<sketch-picker v-model="button_border.color" @input="setBorder(true, 'button_border', '.next-questions')" />
			    							    		    	</template>
			    							    		    </b-popover>
			    						    		    </b-input-group-prepend>
			    							    	    <b-form-input v-model="button_border.color.hex" @input="setBorder(true, 'button_border', '.next-questions')"></b-form-input>
			    							    	</b-input-group>
			    								</div>
			    							</template>
			    				    	</div>
			    				    	<div role="group">
			    				    		<label>Радиус скругления уголков рамки</label>
			    				    		<b-input-group append="px">
			    				    	    	<b-form-input type="number" v-model="button_border.radius"></b-form-input>
			    				    		</b-input-group>
			    				    	</div>
	        		    		</b-tab>
	        		    		<b-tab title="Тени" class="pt-4 pb-2">
			    						<div role="group">
			    				    		<b-form-checkbox id="checkbox-button-shadow"
			    				    		                 v-model="button_shadow.show" @change="setShadow($event, 'button_shadow', '.next-questions')">
			    					      		Включить тени
			    			    		    </b-form-checkbox>
			    			    		    <template v-if="button_shadow.show == true">
			    							<div role="group" class="mt-3">
			    								<label>Тени (сдвиг по x)</label>
			    								<b-input-group append="px" class="mb-3">
			    							    	<b-form-input type="number" v-model="button_shadow.x" @change="setShadow(true, 'button_shadow', '.next-questions')"></b-form-input>
			    								</b-input-group>
			    								<label>Тени (сдвиг по y)</label>
			    								<b-input-group append="px" class="mb-3">
			    							    	<b-form-input type="number" v-model="button_shadow.y" @change="setShadow(true, 'button_shadow', '.next-questions')"></b-form-input>
			    								</b-input-group>
			    								<label>Радиус размытия теней</label>
			    								<b-input-group append="px" class="mb-3">
			    							    	<b-form-input type="number" v-model="button_shadow.blur" @change="setShadow(true, 'button_shadow', '.next-questions')"></b-form-input>
			    								</b-input-group>
			    								<label>Цвет тени</label>
			    						    	<b-input-group class="mb-4">
			    						    		<b-input-group-prepend>
			    						    		    <b-btn variant="primary" id="exPopoverReactive-button-shadow">Выбрать цвет</b-btn>
			    						    		    <b-popover target="exPopoverReactive-button-shadow"
			    						    		               triggers="click"
			    						    		               placement="left">
			    						    		      	<template slot="title">
			    						    		    		<sketch-picker v-model="button_shadow.color" @input="setShadow(true, 'button_shadow', '.next-questions')" />
			    						    		    	</template>
			    						    		    </b-popover>
			    					    		    </b-input-group-prepend>
			    						    	    <b-form-input @input="setShadow(true, 'button_shadow', '.next-questions')" v-model="button_shadow.color.hex"></b-form-input>
			    						    	</b-input-group>
			    						    	<label>Прозрачность фона</label>
			    								<div class="d-flex">
	      		    	    			        <div style="width: 60%">
	      		    	    			            <range-slider
	      		    	    			                class="slider_range"
	      		    	    			                min="0"
	      		    	    			                max="100"
	      		    	    			                v-model="button_shadow.opacity"
	      		    	    			                @input="setShadow(true, 'button_shadow', '.next-questions')">
	      		    	    			            </range-slider>
	      		    	    			        </div>
	      		    	    			        <p class="ml-3 range_count" style="width: 40%">{{ button_shadow.opacity }}%</p>
	      		    	    			    </div>
			    							</div>
			    							</template>
			    						</div>	
	        		    		</b-tab>
	        		    	</b-tabs>
	        		    </b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'question-radio'">
	    				<b-tabs>
	        		    <b-tab title="Общий блок" class="pt-3">
	        		    	<b-tabs class="more_tabs">
	        		    		<b-tab title="Цвета" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Цвет фона</label>
	        		    			  <b-input-group class="mb-4">
	        		    			    <b-input-group-prepend>
	        		    			        <b-btn variant="primary" id="exPopoverReactive-question-bg">Выбрать цвет</b-btn>
	        		    			        <b-popover target="exPopoverReactive-question-bg"
	        		    			                   triggers="click"
	        		    			                   placement="left">
	        		    			            <template slot="title">
	        		    			            <sketch-picker v-model="question_bg.color" @input="setBackground('question_bg', '.question')" />
	        		    			          </template>
	        		    			        </b-popover>
	        		    			      </b-input-group-prepend>
	        		    			      <b-form-input @input="setBackground('question_bg', '.question')" v-model="question_bg.color.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			  <label>Прозрачность фона</label>
	        		    			  <div class="d-flex">
	        		    			      <div style="width: 60%">
	        		    			          <range-slider
	        		    			              class="slider_range"
	        		    			              min="0"
	        		    			              max="100"
	        		    			              v-model="question_bg.opacity"
	        		    			              @input="setBackground('question_bg', '.question')">
	        		    			          </range-slider>
	        		    			      </div>
	        		    			      <p class="ml-3 range_count" style="width: 40%">{{ question_bg.opacity }}%</p>
	        		    			  </div>
	        		    			</div>
	        		    			<div role="group">
	        		    			    <label>Цвет текста</label>
	        		    			    <b-input-group>
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-block-color-text">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-block-color-text"
	        		    			                       triggers="click"
	        		    			                       placement="top"
	        		    			                       container="myContainer"
	        		    			                       ref="popover-color">
	        		    			                <template slot="title">
	        		    			                    <sketch-picker v-model="question_block_color_text" />
	        		    			                </template>
	        		    			            </b-popover>
	        		    			        </b-input-group-prepend>
	        		    			        <b-form-input v-model="question_block_color_text.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Отступы" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Внутренние отступы (вертикально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_vert"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    			<div role="group">
	        		    			  <label>Внутренние отступы (горизонтально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_horz"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Рамки" class="pt-4 pb-2">
	        		    			<div role="group">
	        		    				<b-form-checkbox id="checkbox-question-border"class="mb-3 d-block"
	        		    				                 v-model="question_border.show" @change="setBorder($event, 'question_border', '.question')">
	        		    				    Стилизовать границы
	        		    				</b-form-checkbox>
	        		    				<template v-if="question_border.show == true">
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Размер границы</label>
	        		    				        <b-input-group append="px">
	        		    				            <b-form-input type="number" v-model="question_border.size" @change="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				    <div role="group">
	        		    				        <label>Стиль рамки</label>
	        		    				        <b-button-group class="d-flex mb-4">
	        		    				            <b-button style="width: 33.33%" 
	        		    				                      @click="question_border.type = 'solid'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'solid' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.33%"
	        		    				                      @click="question_border.type = 'dashed'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dashed' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.34%"
	        		    				                      @click="question_border.type = 'dotted'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dotted' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				        </b-button-group>
	        		    				    </div>
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Цвет рамки</label>
	        		    				        <b-input-group class="mb-4">
	        		    				            <b-input-group-prepend>
	        		    				                <b-btn variant="primary" id="exPopoverReactive-question-border">Выбрать цвет</b-btn>
	        		    				                <b-popover target="exPopoverReactive-question-border"
	        		    				                           triggers="click"
	        		    				                           placement="left">
	  		    				                        <sketch-picker v-model="question_border.color" @input="setBorder(true, 'question_border', '.question')" />
	        		    				                </b-popover>
	        		    				            </b-input-group-prepend>
	        		    				            <b-form-input v-model="question_border.color.hex" @input="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				</template>
	        		    			  <label>Радиус скругления уголков</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_radius"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Тени" class="pt-4 pb-2">
	        		    			<b-form-checkbox id="checkbox-question-shadow"
	        		    			               v-model="question_shadow.show" @change="setShadow($event, 'question_shadow', '.question')">
	        		    			    Включить тени
	        		    			</b-form-checkbox>
	        		    			<template v-if="question_shadow.show == true">
	        		    			  <div role="group" class="mt-3">
	        		    			    <label>Тени (сдвиг по x)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.x" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Тени (сдвиг по y)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.y" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Радиус размытия теней</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.blur" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Цвет тени</label>
	        		    			      <b-input-group class="mb-4">
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-shadow"
	        		    			                       triggers="click"
	        		    			                       placement="left">
	        		    			                <template slot="title">
	        		    			                <sketch-picker v-model="question_shadow.color" @input="setShadow(true, 'question_shadow', '.question')" />
	        		    			              </template>
	        		    			            </b-popover>
	        		    			          </b-input-group-prepend>
	        		    			          <b-form-input @input="setShadow(true, 'question_shadow', '.question')" v-model="question_shadow.color.hex"></b-form-input>
	        		    			      </b-input-group>
	        		    			        <label>Прозрачность фона</label>
	        		    			    <div class="d-flex">
	        		    			        <div style="width: 60%">
	        		    			            <range-slider
	        		    			                class="slider_range"
	        		    			                min="0"
	        		    			                max="100"
	        		    			                v-model="question_shadow.opacity"
	        		    			                @input="setShadow(true, 'question_shadow', '.question')">
	        		    			            </range-slider>
	        		    			        </div>
	        		    			        <p class="ml-4 range_count" style="width: 40%">{{ question_shadow.opacity }}%</p>
	        		    			    </div>
	        		    			  </div>
	        		    			</template>
	        		    		</b-tab>
	        		    	</b-tabs> 
	        		    </b-tab>
	    				    <b-tab title="Поля" class="pt-3" active>
	    				    	<b-tabs>
	    				    		<b-tab title="Радиокнопки" class="pt-3" active>
	    				    			<b-tabs>
	    				    				<b-tab title="Внешняя часть" active class="pt-3">
	    				    					<b-tabs class="more_tabs">
	    				    						<b-tab title="Цвета" active class="pt-4 pb-2">
				    										<div role="group">
				    												<label>Цвет фона</label>
					    								    	<b-input-group class="mb-4">
					    								    		<b-input-group-prepend>
					    								    		    <b-btn variant="primary" id="exPopoverReactive-radio-bg">Выбрать цвет</b-btn>
					    								    		    <b-popover target="exPopoverReactive-radio-bg"
					    								    		               triggers="click"
					    								    		               placement="left">
				    								    		    		<sketch-picker v-model="radio_bg.color" @input="setBgRoot('radio_bg', '--radio-background')" />
					    								    		    </b-popover>
					    							    		  </b-input-group-prepend>
					    								    	  <b-form-input @input="setBgRoot('radio_bg', '--radio-background')" v-model="radio_bg.color.hex"></b-form-input>
					    								    	</b-input-group>
					    								    	<label>Прозрачность фона</label>
					    											<div class="d-flex">
					    										    <div style="width: 60%">
					    										        <range-slider
					    										            class="slider_range"
					    										            min="0"
					    										            max="100"
					    										            v-model="radio_bg.opacity"
					    										            @input="setBgRoot('radio_bg', '--radio-background')">
					    										        </range-slider>
					    										    </div>
					    										    <p class="ml-3 range_count" style="width: 40%">{{ radio_bg.opacity }}%</p>
					    											</div>
				    										</div>
	    				    						</b-tab>
	    				    						<b-tab title="Рамки" class="pt-4 pb-2">
			    											<div role="group">
			    							    	    		<b-form-checkbox id="checkbox-radio-border"
			    							    	    		                 v-model="radio_border.show" @change="setBorderRoot($event, 'radio_border', '--radio-border')">
			    							    		      		Стилизовать границы
			    								    		    </b-form-checkbox>
			    												<template v-if="radio_border.show == true">
			    													<div role="group" class="mb-4 mt-3">
			    														<label>Размер границы</label>
			    														<b-input-group append="px">
			    													    	<b-form-input type="number" v-model="radio_border.size" @change="setBorderRoot(true, 'radio_border', '--radio-border')"></b-form-input>
			    														</b-input-group>
			    													</div>
			    													<div role="group">
			    														<label>Стиль рамки</label>
			    														<b-button-group class="d-flex mb-4">
			    														    <b-button style="width: 33.33%" 
			    														    		  @click="radio_border.type = 'solid'; setBorderRoot(true, 'radio_border', '--radio-border')"
			    														    		  variant="outline-secondary"
			    														    		  :class="radio_border.type == 'solid' ? 'active' : ''">
			    														    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
			    															</b-button>
			    														    <b-button style="width: 33.33%"
			    														    		  @click="radio_border.type = 'dashed'; setBorderRoot(true, 'radio_border', '--radio-border')"
			    														    		  variant="outline-secondary"
			    														    		  :class="radio_border.type == 'dashed' ? 'active' : ''">
			    														    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
			    															</b-button>
			    														    <b-button style="width: 33.34%"
			    														    		  @click="radio_border.type = 'dotted'; setBorderRoot(true, 'radio_border', '--radio-border')"
			    														    		  variant="outline-secondary"
			    														    		  :class="radio_border.type == 'dotted' ? 'active' : ''">
			    														    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
			    															</b-button>
			    														</b-button-group>
			    													</div>
			    													<div role="group">
			    														<label>Цвет рамки</label>
			    												    	<b-input-group>
			    												    		<b-input-group-prepend>
			    												    		    <b-btn variant="primary" id="exPopoverReactive-question-index-border">Выбрать цвет</b-btn>
			    												    		    <b-popover target="exPopoverReactive-question-index-border"
			    												    		               triggers="click"
			    												    		               placement="left">
		    												    		    		<sketch-picker v-model="radio_border.color" @input="setBorderRoot(true, 'radio_border', '--radio-border')" />
			    												    		    </b-popover>
			    											    		    </b-input-group-prepend>
			    												    	    <b-form-input v-model="radio_border.color.hex" @input="setBorderRoot(true, 'radio_border', '--radio-border')"></b-form-input>
			    												    	</b-input-group>
			    													</div>
			    												</template>
			    											</div>
	    				    						</b-tab>
	    				    						<b-tab title="Тени" class="pt-4 pb-2">
		    								    		<b-form-checkbox id="checkbox-radios-shadow"
		    								    		                 v-model="radio_shadow.show" @change="setShadowRoot($event, 'radio_shadow', '--radio-shadow')">
		    									      		Включить тени
		    							    		    </b-form-checkbox>
		    							    		    <template v-if="radio_shadow.show == true">
				    											<div role="group" class="mt-3">
				    												<label>Тени (сдвиг по x)</label>
				    												<b-input-group append="px" class="mb-3">
				    											    	<b-form-input type="number" v-model="radio_shadow.x" @change="setShadowRoot(true, 'radio_shadow', '--radio-shadow')"></b-form-input>
				    												</b-input-group>
				    												<label>Тени (сдвиг по y)</label>
				    												<b-input-group append="px" class="mb-3">
				    											    	<b-form-input type="number" v-model="radio_shadow.y" @change="setShadowRoot(true, 'radio_shadow', '--radio-shadow')"></b-form-input>
				    												</b-input-group>
				    												<label>Радиус размытия теней</label>
				    												<b-input-group append="px" class="mb-3">
				    											    	<b-form-input type="number" v-model="radio_shadow.blur" @change="setShadowRoot(true, 'radio_shadow', '--radio-shadow')"></b-form-input>
				    												</b-input-group>
				    												<label>Цвет тени</label>
				    										    	<b-input-group class="mb-4">
				    										    		<b-input-group-prepend>
				    										    		    <b-btn variant="primary" id="exPopoverReactive-radio-shadow">Выбрать цвет</b-btn>
				    										    		    <b-popover target="exPopoverReactive-radio-shadow"
				    										    		               triggers="click"
				    										    		               placement="left">
			    										    		    		<sketch-picker v-model="radio_shadow.color" @input="setShadowRoot(true, 'radio_shadow', '--radio-shadow')" />
				    										    		    </b-popover>
				    									    		    </b-input-group-prepend>
				    										    	    <b-form-input @input="setShadowRoot(true, 'radio_shadow', '--radio-shadow')" v-model="radio_shadow.color.hex"></b-form-input>
				    										    	</b-input-group>
				    										    	<label>Прозрачность фона</label>
				    												<div class="d-flex">
				    												    <div style="width: 60%">
				    												        <range-slider
				    												            class="slider_range"
				    												            min="0"
				    												            max="100"
				    												            v-model="radio_shadow.opacity"
				    												            @input="setShadowRoot(true, 'radio_shadow', '--radio-shadow')">
				    												        </range-slider>
				    												    </div>
				    												    <p class="ml-3 range_count" style="width: 40%">{{ radio_shadow.opacity }}%</p>
				    												</div>
			    											</div>
			    											</template>
	    				    						</b-tab>
	    				    						<b-tab title="По наведению" class="pt-3">
	    				    							<b-tabs>
	    				    								<b-tab title="Цвета" class="pt-4 pb-2">
												    				<div role="group">
																		  <label>Цвет фона</label>
																    	<b-input-group class="mb-4">
																    		<b-input-group-prepend>
																    		    <b-btn variant="primary" id="exPopoverReactive-radio-hover-bg">Выбрать цвет</b-btn>
																    		    <b-popover target="exPopoverReactive-radio-hover-bg"
																    		               triggers="click"
																    		               placement="left">
															    		    		<sketch-picker v-model="radio_hover_bg.color" @input="setBgRoot('radio_hover_bg', '--radio-hover-background')" />
																    		    </b-popover>
															    		    </b-input-group-prepend>
																    	    <b-form-input @input="setBgRoot('radio_hover_bg', '--radio-hover-background')" v-model="radio_hover_bg.color.hex"></b-form-input>
																    	</b-input-group>
																    	<label>Прозрачность фона</label>
									  									<div class="d-flex">
									                      <div style="width: 60%">
									                          <range-slider
									                              class="slider_range"
									                              min="0"
									                              max="100"
									                              v-model="radio_hover_bg.opacity"
									                              @input="setBgRoot('radio_hover_bg', '--radio-hover-background')">
									                          </range-slider>
									                      </div>
									                      <p class="ml-3 range_count" style="width: 40%">{{ radio_hover_bg.opacity }}%</p>
									                    </div>
												    				</div>
	    				    								</b-tab>
	    				    								<b-tab title="Тени" class="pt-4 pb-2">
														    		<b-form-checkbox id="checkbox-radios-hover-shadow"
														    		                 v-model="radio_hover_shadow.show" @change="setShadowRoot($event, 'radio_hover_shadow', '--radio-hover-shadow')">
															      		Включить тени
													    		  </b-form-checkbox>
													    		  <template v-if="radio_hover_shadow.show == true">
									    								<div role="group" class="mt-3">
									    									<label>Тени (сдвиг по x)</label>
									    									<b-input-group append="px" class="mb-3">
									    								    	<b-form-input type="number" v-model="radio_hover_shadow.x" @change="setShadowRoot(true, 'radio_hover_shadow', '--radio-hover-shadow')"></b-form-input>
									    									</b-input-group>
									    									<label>Тени (сдвиг по y)</label>
									    									<b-input-group append="px" class="mb-3">
									    								    	<b-form-input type="number" v-model="radio_hover_shadow.y" @change="setShadowRoot(true, 'radio_hover_shadow', '--radio-hover-shadow')"></b-form-input>
									    									</b-input-group>
									    									<label>Радиус размытия теней</label>
									    									<b-input-group append="px" class="mb-3">
									    								    	<b-form-input type="number" v-model="radio_hover_shadow.blur" @change="setShadowRoot(true, 'radio_hover_shadow', '--radio-hover-shadow')"></b-form-input>
									    									</b-input-group>
									    									<label>Цвет тени</label>
									    							    	<b-input-group class="mb-4">
									    							    		<b-input-group-prepend>
									    							    		    <b-btn variant="primary" id="exPopoverReactive-radio-hover-shadow">Выбрать цвет</b-btn>
									    							    		    <b-popover target="exPopoverReactive-radio-hover-shadow"
									    							    		               triggers="click"
									    							    		               placement="left">
								    							    		    		<sketch-picker v-model="radio_hover_shadow.color" @input="setShadowRoot(true, 'radio_hover_shadow', '--radio-hover-shadow')" />
									    							    		    </b-popover>
									    						    		    </b-input-group-prepend>
									    							    	    <b-form-input @input="setShadowRoot(true, 'radio_hover_shadow', '--radio-hover-shadow')" v-model="radio_hover_shadow.color.hex"></b-form-input>
									    							    	</b-input-group>
									    							    	<label>Прозрачность фона</label>
	    																		<div class="d-flex">
	    									                    <div style="width: 60%">
	    									                        <range-slider
	    									                            class="slider_range"
	    									                            min="0"
	    									                            max="100"
	    									                            v-model="radio_hover_shadow.opacity"
	    									                            @input="setShadowRoot(true, 'radio_hover_shadow', '--radio-hover-shadow')">
	    									                        </range-slider>
	    									                    </div>
	    									                    <p class="ml-3 range_count" style="width: 40%">{{ radio_hover_shadow.opacity }}%</p>
	    									                  </div>
									    								</div>
																	  </template>
	    				    								</b-tab>
	    				    							</b-tabs>
	    				    						</b-tab>
	    				    					</b-tabs>
	    				    				</b-tab>
	    				    				<b-tab title="Внутренняя" class="pt-3">
	    				    					<b-tabs class="more_tabs">
	    				    						<b-tab title="Цвета" active class="pt-4 pb-2">
	    							    				<div role="group">
	    													<label>Цвет фона</label>
	    											    	<b-input-group class="mb-4">
	    											    		<b-input-group-prepend>
	    											    		    <b-btn variant="primary" id="exPopoverReactive-radio-before-bg">Выбрать цвет</b-btn>
	    											    		    <b-popover target="exPopoverReactive-radio-before-bg"
	    											    		               triggers="click"
	    											    		               placement="left">
	  											    		    		<sketch-picker v-model="radio_before_bg.color" @input="setBgRoot('radio_before_bg', '--radio-before-background')" />
	    											    		    </b-popover>
	    										    		    </b-input-group-prepend>
	    											    	    <b-form-input @input="setBgRoot('radio_before_bg', '--radio-before-background')" v-model="radio_before_bg.color.hex"></b-form-input>
	    											    	</b-input-group>
	    											    	<label>Прозрачность фона</label>
	    														<div class="d-flex">
	    													    <div style="width: 60%">
	    													        <range-slider
	    													            class="slider_range"
	    													            min="0"
	    													            max="100"
	    													            v-model="radio_before_bg.opacity"
	    													            @input="setBgRoot('radio_before_bg', '--radio-before-background')">
	    													        </range-slider>
	    													    </div>
	    													    <p class="ml-3 range_count" style="width: 40%">{{ radio_before_bg.opacity }}%</p>
	    														</div>
	    							    				</div>
	    				    						</b-tab>
	    				    						<b-tab title="Тени" class="pt-4 pb-2">
											    			<b-form-checkbox id="checkbox-radios-before-shadow"
											    		                 v-model="radio_before_shadow.show" @change="setShadowRoot($event, 'radio_before_shadow', '--radio-before-shadow')">
												      		Включить тени
										    		    </b-form-checkbox>
										    		    <template v-if="radio_before_shadow.show == true">
																<div role="group" class="mt-3">
																	<label>Тени (сдвиг по x)</label>
																	<b-input-group append="px" class="mb-3">
														    	<b-form-input type="number" v-model="radio_before_shadow.x" @change="setShadowRoot(true, 'radio_before_shadow', '--radio-before-shadow')"></b-form-input>
																	</b-input-group>
																	<label>Тени (сдвиг по y)</label>
																	<b-input-group append="px" class="mb-3">
														    	<b-form-input type="number" v-model="radio_before_shadow.y" @change="setShadowRoot(true, 'radio_before_shadow', '--radio-before-shadow')"></b-form-input>
	  															</b-input-group>
	  															<label>Радиус размытия теней</label>
	  															<b-input-group append="px" class="mb-3">
	  														    	<b-form-input type="number" v-model="radio_before_shadow.blur" @change="setShadowRoot(true, 'radio_before_shadow', '--radio-before-shadow')"></b-form-input>
	  															</b-input-group>
	  															<label>Цвет тени</label>
	  													    	<b-input-group class="mb-4">
	  													    		<b-input-group-prepend>
	  													    		    <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	  													    		    <b-popover target="exPopoverReactive-question-shadow"
	  													    		               triggers="click"
	  													    		               placement="left">
	  													    		      	<template slot="title">
	  													    		    		<sketch-picker v-model="radio_before_shadow.color" @input="setShadowRoot(true, 'radio_before_shadow', '--radio-before-shadow')" />
	  													    		    	</template>
	  													    		    </b-popover>
	  												    		    </b-input-group-prepend>
	  													    	    <b-form-input @input="setShadowRoot(true, 'radio_before_shadow', '--radio-before-shadow')" v-model="radio_before_shadow.color.hex"></b-form-input>
	  													    	</b-input-group>
	  													    	<label>Прозрачность фона</label>
	  															<div class="d-flex">
	                                  <div style="width: 60%">
	                                      <range-slider
	                                          class="slider_range"
	                                          min="0"
	                                          max="100"
	                                          v-model="radio_bg.opacity"
	                                          @input="setShadowRoot(true, 'radio_before_shadow', '--radio-before-shadow')">
	                                      </range-slider>
	                                  </div>
	                                  <p class="ml-3 range_count" style="width: 40%">{{ radio_bg.opacity }}%</p>
	                                </div>
	  														</div>
	  														</template>
	    				    						</b-tab>
	    				    						<b-tab title="Отмеченный вариант" class="pt-4 pb-2">
										    				<div role="group" class="mb-3">
																  <label>Цвет фона</label>
														    	<b-input-group class="mb-4">
														    		<b-input-group-prepend>
														    		    <b-btn variant="primary" id="exPopoverReactive-radio-active-bg">Выбрать цвет</b-btn>
														    		    <b-popover target="exPopoverReactive-radio-active-bg"
														    		               triggers="click"
														    		               placement="left">
														    		      	<template slot="title">
														    		    		<sketch-picker v-model="radio_active_bg.color" @input="setBgRoot('radio_active_bg', '--radio-checked')" />
														    		    	</template>
														    		    </b-popover>
													    		    </b-input-group-prepend>
														    	    <b-form-input @input="setBgRoot('radio_active_bg', '--radio-checked')" v-model="radio_active_bg.color.hex"></b-form-input>
														    	</b-input-group>
														    	<label>Прозрачность фона</label>
																	<div class="d-flex">
								                    <div style="width: 60%">
								                        <range-slider
								                            class="slider_range"
								                            min="0"
								                            max="100"
								                            v-model="radio_active_bg.opacity"
								                            @input="setBgRoot('radio_active_bg', '--radio-checked')">
								                        </range-slider>
								                    </div>
								                    <p class="ml-3 range_count" style="width: 40%">{{ radio_active_bg.opacity }}%</p>
								                  </div>
										    				</div>
				    				    				<div role="group">
				    							    		<b-form-checkbox id="checkbox-radios-active-image"
				    							    		                 v-model="radio_active_image" @change="radioActiveImage($event)">
				    								      	Иконка галочки
				    						    		  </b-form-checkbox>
				    				    				</div>
	    				    						</b-tab>
	    				    					</b-tabs>
	    				    				</b-tab>
	    				    			</b-tabs>
	    				    		</b-tab>
	    				    		<b-tab title="Текст. поле" class="pt-3" v-if="questions[questionIndex].addInput == true">
	    				    			<b-tabs class="more_tabs">
	      				    			<b-tab title="Цвета" active class="pt-4 pb-2">
				    								<div role="group" class="mb-3">
				    									<label>Цвет фона</label>
				    						    	<b-input-group class="mb-4">
				    						    		<b-input-group-prepend>
				    					    		    <b-btn variant="primary" id="exPopoverReactive-input-bg">Выбрать цвет</b-btn>
				    					    		    <b-popover target="exPopoverReactive-input-bg"
				    					    		               triggers="click"
				    					    		               placement="right">
			    					    		    		<sketch-picker v-model="input_bg.color" @input="setBackground('input_bg', '.quiz_inputs')" />
				    					    		    </b-popover>
				    				    		    </b-input-group-prepend>
				    					    	    <b-form-input @input="setBackground('input_bg', '.quiz_inputs')" v-model="input_bg.color.hex"></b-form-input>
				    						    	</b-input-group>
				    						    	<label>Прозрачность фона</label>
				    										<div class="d-flex">
				    									    <div style="width: 60%">
				    									        <range-slider
				    									            class="slider_range"
				    									            min="0"
				    									            max="100"
				    									            v-model="input_bg.opacity"
				    									            @input="setBackground('input_bg', '.quiz_inputs')">
				    									        </range-slider>
				    									    </div>
				    									    <p class="ml-3 range_count" style="width: 40%">{{ input_bg.opacity }}%</p>
				    										</div>
				    								</div>
	    								    	<div role="group">
	    				    					  <label>Цвет текста</label>
	    				    			    	<b-input-group>
	    				    			    		<b-input-group-prepend>
	    				    			    		    <b-btn variant="primary" id="exPopoverReactive-input-color-text">Выбрать цвет</b-btn>
	    				    			    		    <b-popover target="exPopoverReactive-input-color-text"
	    				    			    		               triggers="click"
	    				    			    		               placement="left">
	  				    			    		    		<sketch-picker v-model="input_color_text" />
	    				    			    		    </b-popover>
	    				    		    		    </b-input-group-prepend>
	    				    			    	    <b-form-input v-model="input_color_text.hex"></b-form-input>
	    				    			    	</b-input-group>
	    								    	</div>
	      				    			</b-tab>
	      				    			<b-tab title="Текст" class="pt-4 pb-2">
	      				    				<div role="group">
	      				    					<label>Начертание шрифта</label>
	      				    					<b-button-group class="d-flex">
	      				    					    <b-button style="width: 50%" 
	      				    					    		  @click="input_weight = 'normal'"
	      				    					    		  variant="outline-secondary"
	      				    					    		  :class="input_weight == 'normal' ? 'active' : ''">
	      				    					    	Нормальный
	      				    						</b-button>
	      				    					    <b-button style="width: 50%"
	      				    					    		  @click="input_weight = 'bold'"
	      				    					    		  variant="outline-secondary"
	      				    					    		  :class="input_weight == 'bold' ? 'active' : ''">
	      				    					    	Жирный
	      				    						</b-button>
	      				    					</b-button-group>
	      				    				</div>
	      				    			</b-tab>
	      				    			<b-tab title="Рамки" class="pt-4 pb-2">
	    				    					<div role="group" class="mb-3">
	    					    	    		<b-form-checkbox id="checkbox-input-border"
	    					    	    		                 v-model="input_border.show" @change="setBorder($event, 'input_border', '.quiz_inputs')">
	    					    		      		Стилизовать границы
	    						    		    </b-form-checkbox>
	    				    						<template v-if="input_border.show == true">
	    				    							<div role="group" class="mt-3 mb-4">
	    				    								<label>Размер границы</label>
	    				    								<b-input-group append="px">
	    				    							    	<b-form-input type="number" v-model="input_border.size" @change="setBorder(true, 'input_border', '.quiz_inputs')"></b-form-input>
	    				    								</b-input-group>
	    				    							</div>
	    				    							<div role="group">
	    				    								<label>Стиль рамки</label>
	    				    								<b-button-group class="d-flex mb-4">
	    				    								    <b-button style="width: 33.33%" 
	    				    								    		  @click="input_border.type = 'solid'; setBorder(true, 'input_border', '.quiz_inputs')"
	    				    								    		  variant="outline-secondary"
	    				    								    		  :class="input_border.type == 'solid' ? 'active' : ''">
	    				    								    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
	    				    									</b-button>
	    				    								    <b-button style="width: 33.33%"
	    				    								    		  @click="input_border.type = 'dashed'; setBorder(true, 'input_border', '.quiz_inputs')"
	    				    								    		  variant="outline-secondary"
	    				    								    		  :class="input_border.type == 'dashed' ? 'active' : ''">
	    				    								    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
	    				    									</b-button>
	    				    								    <b-button style="width: 33.34%"
	    				    								    		  @click="input_border.type = 'dotted'; setBorder(true, 'input_border', '.quiz_inputs')"
	    				    								    		  variant="outline-secondary"
	    				    								    		  :class="input_border.type == 'dotted' ? 'active' : ''">
	    				    								    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
	    				    									</b-button>
	    				    								</b-button-group>
	    				    							</div>
	    				    							<div role="group" class="mb-4">
	    				    								<label>Цвет рамки</label>
	    				    						    	<b-input-group>
	    				    						    		<b-input-group-prepend>
	    				    						    		    <b-btn variant="primary" id="exPopoverReactive-question-index-border">Выбрать цвет</b-btn>
	    				    						    		    <b-popover target="exPopoverReactive-question-index-border"
	    				    						    		               triggers="click"
	    				    						    		               placement="left">
	  				    						    		    		<sketch-picker v-model="input_border.color" @input="setBorder(true, 'input_border', '.quiz_inputs')" />
	    				    						    		    </b-popover>
	    				    					    		    </b-input-group-prepend>
	    				    						    	    <b-form-input v-model="input_border.color.hex" @input="setBorder(true, 'input_border', '.quiz_inputs')"></b-form-input>
	    				    						    	</b-input-group>
	    				    							</div>
	    				    						</template>
	    				    					</div>
	    				    					<div role="group">
	    				    						<label>Радиус скругления уголков рамки</label>
	    				    						<b-input-group append="px">
	  				    					    	<b-form-input v-model="input_border.radius"></b-form-input>
	    				    						</b-input-group>
	    				    					</div>
	      				    			</b-tab>
	      				    			<b-tab title="Тени" class="pt-4 pb-2">
	    				    					<div role="group">
	    							    		  <b-form-checkbox id="checkbox-input-shadow" 
	    							    		                   v-model="input_shadow.show" @change="setShadow($event, 'input_shadow', '.quiz_inputs')">
	    								      		Включить тени
	    						    		    </b-form-checkbox>
	    						    		    <template v-if="input_shadow.show == true">
	    				    							<div role="group" class="mt-3">
	    				    								<label>Тени (сдвиг по x)</label>
	    				    								<b-input-group append="px" class="mb-3">
	    				    							    	<b-form-input type="number" v-model="input_shadow.x" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
	    				    								</b-input-group>
	    				    								<label>Тени (сдвиг по y)</label>
	    				    								<b-input-group append="px" class="mb-3">
	    				    							    	<b-form-input type="number" v-model="input_shadow.y" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
	    				    								</b-input-group>
	    				    								<label>Радиус размытия теней</label>
	    				    								<b-input-group append="px" class="mb-3">
	    				    							    	<b-form-input type="number" v-model="input_shadow.blur" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
	    				    								</b-input-group>
	    				    								<label>Цвет тени</label>
	    				    						    	<b-input-group class="mb-4">
	    				    						    		<b-input-group-prepend>
	    				    						    		    <b-btn variant="primary" id="exPopoverReactive-input-shadow">Выбрать цвет</b-btn>
	    				    						    		    <b-popover target="exPopoverReactive-input-shadow"
	    				    						    		               triggers="click"
	    				    						    		               placement="left">
	    				    						    		    		<sketch-picker v-model="input_shadow.color" @input="setShadow(true, 'input_shadow', '.quiz_inputs')" />
	    				    						    		    </b-popover>
	    				    					    		    </b-input-group-prepend>
	    				    						    	    <b-form-input @input="setShadow(true, 'input_shadow', '.quiz_inputs')" v-model="input_shadow.color.hex"></b-form-input>
	    				    						    	</b-input-group>
	    				    						    	<label>Прозрачность фона</label>
	    				      								<div class="d-flex">
	    				                          <div style="width: 60%">
	    				                              <range-slider
	    				                                  class="slider_range"
	    				                                  min="0"
	    				                                  max="100"
	    				                                  v-model="input_shadow.opacity"
	    				                                  @input="setShadow(true, 'input_shadow', '.quiz_inputs')">
	    				                              </range-slider>
	    				                          </div>
	    				                          <p class="ml-3 range_count" style="width: 40%">{{ input_shadow.opacity }}%</p>
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
	        	<template v-if="whichPopover == 'question-checkbox'">
	    				<b-tabs>
	      		    <b-tab title="Общий блок" class="pt-3">
	      		    	<b-tabs class="more_tabs">
	      		    		<b-tab title="Цвета" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-3">
	      		    			  <label>Цвет фона</label>
	      		    			  <b-input-group class="mb-4">
	      		    			    <b-input-group-prepend>
	      		    			        <b-btn variant="primary" id="exPopoverReactive-question-bg">Выбрать цвет</b-btn>
	      		    			        <b-popover target="exPopoverReactive-question-bg"
	      		    			                   triggers="click"
	      		    			                   placement="left">
	      		    			            <sketch-picker v-model="question_bg.color" @input="setBackground('question_bg', '.question')" />
	      		    			        </b-popover>
	      		    			      </b-input-group-prepend>
	      		    			      <b-form-input @input="setBackground('question_bg', '.question')" v-model="question_bg.color.hex"></b-form-input>
	      		    			    </b-input-group>
	      		    			  <label>Прозрачность фона</label>
	      		    			  <div class="d-flex">
	      		    			      <div style="width: 60%">
	      		    			          <range-slider
	      		    			              class="slider_range"
	      		    			              min="0"
	      		    			              max="100"
	      		    			              v-model="question_bg.opacity"
	      		    			              @input="setBackground('question_bg', '.question')">
	      		    			          </range-slider>
	      		    			      </div>
	      		    			      <p class="ml-3 range_count" style="width: 40%">{{ question_bg.opacity }}%</p>
	      		    			  </div>
	      		    			</div>
	      		    			<div role="group">
	      		    			    <label>Цвет текста</label>
	      		    			    <b-input-group>
	      		    			        <b-input-group-prepend>
	      		    			            <b-btn variant="primary" id="exPopoverReactive-question-block-color-text">Выбрать цвет</b-btn>
	      		    			            <b-popover target="exPopoverReactive-question-block-color-text"
	      		    			                       triggers="click"
	      		    			                       placement="top"
	      		    			                       container="myContainer"
	      		    			                       ref="popover-color">
	      		    			                <template slot="title">
	      		    			                    <sketch-picker v-model="question_block_color_text" />
	      		    			                </template>
	      		    			            </b-popover>
	      		    			        </b-input-group-prepend>
	      		    			        <b-form-input v-model="question_block_color_text.hex"></b-form-input>
	      		    			    </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Отступы" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-3">
	      		    			  <label>Внутренние отступы (вертикально)</label>
	      		    			  <b-input-group append="px">
	      		    			      <b-form-input type="number" v-model="question_padd_vert"></b-form-input>
	      		    			  </b-input-group>
	      		    			</div>
	      		    			<div role="group">
	      		    			  <label>Внутренние отступы (горизонтально)</label>
	      		    			  <b-input-group append="px">
	      		    			      <b-form-input type="number" v-model="question_padd_horz"></b-form-input>
	      		    			  </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Рамки" class="pt-4 pb-2">
	      		    			<div role="group">
	      		    				<b-form-checkbox id="checkbox-question-border"class="mb-3 d-block"
	      		    				                 v-model="question_border.show" @change="setBorder($event, 'question_border', '.question')">
	      		    				    Стилизовать границы
	      		    				</b-form-checkbox>
	      		    				<template v-if="question_border.show == true">
	      		    				    <div role="group" class="mb-4">
	      		    				        <label>Размер границы</label>
	      		    				        <b-input-group append="px">
	      		    				            <b-form-input type="number" v-model="question_border.size" @change="setBorder(true, 'question_border', '.question')"></b-form-input>
	      		    				        </b-input-group>
	      		    				    </div>
	      		    				    <div role="group">
	      		    				        <label>Стиль рамки</label>
	      		    				        <b-button-group class="d-flex mb-4">
	      		    				            <b-button style="width: 33.33%" 
	      		    				                      @click="question_border.type = 'solid'; setBorder(true, 'question_border', '.question')"
	      		    				                      variant="outline-secondary"
	      		    				                      :class="question_border.type == 'solid' ? 'active' : ''">
	      		    				                <img src="../../static/img/border_solid.png" width="40%" height="auto">
	      		    				            </b-button>
	      		    				            <b-button style="width: 33.33%"
	      		    				                      @click="question_border.type = 'dashed'; setBorder(true, 'question_border', '.question')"
	      		    				                      variant="outline-secondary"
	      		    				                      :class="question_border.type == 'dashed' ? 'active' : ''">
	      		    				                <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	      		    				            </b-button>
	      		    				            <b-button style="width: 33.34%"
	      		    				                      @click="question_border.type = 'dotted'; setBorder(true, 'question_border', '.question')"
	      		    				                      variant="outline-secondary"
	      		    				                      :class="question_border.type == 'dotted' ? 'active' : ''">
	      		    				                <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	      		    				            </b-button>
	      		    				        </b-button-group>
	      		    				    </div>
	      		    				    <div role="group" class="mb-4">
	      		    				        <label>Цвет рамки</label>
	      		    				        <b-input-group class="mb-4">
	      		    				            <b-input-group-prepend>
	      		    				                <b-btn variant="primary" id="exPopoverReactive-question-border">Выбрать цвет</b-btn>
	      		    				                <b-popover target="exPopoverReactive-question-border"
	      		    				                           triggers="click"
	      		    				                           placement="left">
			    				                        <sketch-picker v-model="question_border.color" @input="setBorder(true, 'question_border', '.question')" />
	      		    				                </b-popover>
	      		    				            </b-input-group-prepend>
	      		    				            <b-form-input v-model="question_border.color.hex" @input="setBorder(true, 'question_border', '.question')"></b-form-input>
	      		    				        </b-input-group>
	      		    				    </div>
	      		    				</template>
	      		    			  <label>Радиус скругления уголков</label>
	      		    			  <b-input-group append="px">
	      		    			      <b-form-input type="number" v-model="question_radius"></b-form-input>
	      		    			  </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Тени" class="pt-4 pb-2">
	      		    			<b-form-checkbox id="checkbox-question-shadow"
	      		    			               v-model="question_shadow.show" @change="setShadow($event, 'question_shadow', '.question')">
	      		    			    Включить тени
	      		    			</b-form-checkbox>
	      		    			<template v-if="question_shadow.show == true">
	      		    			  <div role="group" class="mt-3">
	      		    			    <label>Тени (сдвиг по x)</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="question_shadow.x" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Тени (сдвиг по y)</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="question_shadow.y" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Радиус размытия теней</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="question_shadow.blur" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Цвет тени</label>
	      		    			      <b-input-group class="mb-4">
	      		    			        <b-input-group-prepend>
	      		    			            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	      		    			            <b-popover target="exPopoverReactive-question-shadow"
	      		    			                       triggers="click"
	      		    			                       placement="left">
	      		    			                <sketch-picker v-model="question_shadow.color" @input="setShadow(true, 'question_shadow', '.question')" />
	      		    			            </b-popover>
	      		    			          </b-input-group-prepend>
	      		    			          <b-form-input @input="setShadow(true, 'question_shadow', '.question')" v-model="question_shadow.color.hex"></b-form-input>
	      		    			      </b-input-group>
	      		    			        <label>Прозрачность фона</label>
	      		    			    <div class="d-flex">
	      		    			        <div style="width: 60%">
	      		    			            <range-slider
	      		    			                class="slider_range"
	      		    			                min="0"
	      		    			                max="100"
	      		    			                v-model="question_shadow.opacity"
	      		    			                @input="setShadow(true, 'question_shadow', '.question')">
	      		    			            </range-slider>
	      		    			        </div>
	      		    			        <p class="ml-4 range_count" style="width: 40%">{{ question_shadow.opacity }}%</p>
	      		    			    </div>
	      		    			  </div>
	      		    			</template>
	      		    		</b-tab>
	      		    	</b-tabs> 
	      		    </b-tab>
	  				    <b-tab title="Поля" class="pt-3" active>
	  				    	<b-tabs>
	  				    		<b-tab title="Чекбоксы" class="pt-3" active>
	  				    			<b-tabs>
	  				    				<b-tab title="Внешняя часть" active class="pt-3">
	  				    					<b-tabs class="more_tabs">
	  				    						<b-tab title="Цвета" active class="pt-4 pb-2">
	  				    							<div role="group">
	  				    							  <label>Цвет фона</label>
	  				    							    <b-input-group class="mb-4">
	  				    							      <b-input-group-prepend>
	  				    							          <b-btn variant="primary" id="exPopoverReactive-checkbox-bg">Выбрать цвет</b-btn>
	  				    							          <b-popover target="exPopoverReactive-checkbox-bg"
	  				    							                     triggers="click"
	  				    							                     placement="left">
	  				    							            <sketch-picker v-model="checkbox_bg.color" @input="setBgRoot('checkbox_bg', '--checkbox-background')" />
	  				    							          </b-popover>
	  				    							        </b-input-group-prepend>
	  				    							        <b-form-input @input="setBgRoot('checkbox_bg', '--checkbox-background')" v-model="checkbox_bg.color.hex"></b-form-input>
	  				    							    </b-input-group>
	  				    							    <label>Прозрачность фона</label>
	  				    							    <div class="d-flex">
	  				    							      <div style="width: 60%">
	  				    							          <range-slider
	  				    							              class="slider_range"
	  				    							              min="0"
	  				    							              max="100"
	  				    							              v-model="checkbox_bg.opacity"
	  				    							              @input="setBgRoot('checkbox_bg', '--checkbox-background')">
	  				    							          </range-slider>
	  				    							      </div>
	  				    							      <p class="ml-3 range_count" style="width: 40%">{{ checkbox_bg.opacity }}%</p>
	  				    							    </div>
	  				    							</div>
	  				    						</b-tab>
	  				    						<b-tab title="Рамки" active class="pt-4 pb-2">
	  				    							<div role="group">
	  				    							      <b-form-checkbox id="checkbox-checkbox-border" class="mb-3"
	  				    							                       v-model="checkbox_border.show" @change="setBorderRoot($event, 'checkbox_border', '--checkbox-border')">
	  				    							          Стилизовать границы
	  				    							      </b-form-checkbox>
	  				    							  <template v-if="checkbox_border.show == true">
	  				    							    <div role="group" class="mb-4">
	  				    							      <label>Размер границы</label>
	  				    							      <b-input-group append="px">
	  				    							          <b-form-input type="number" v-model="checkbox_border.size" @change="setBorderRoot(true, 'checkbox_border', '--checkbox-border')"></b-form-input>
	  				    							      </b-input-group>
	  				    							    </div>
	  				    							    <div role="group">
	  				    							      <label>Стиль рамки</label>
	  				    							      <b-button-group class="d-flex mb-4">
	  				    							          <b-button style="width: 33.33%" 
	  				    							                @click="checkbox_border.type = 'solid'; setBorderRoot(true, 'checkbox_border', '--checkbox-border')"
	  				    							                variant="outline-secondary"
	  				    							                :class="checkbox_border.type == 'solid' ? 'active' : ''">
	  				    							            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	  				    							        </b-button>
	  				    							          <b-button style="width: 33.33%"
	  				    							                @click="checkbox_border.type = 'dashed'; setBorderRoot(true, 'checkbox_border', '--checkbox-border')"
	  				    							                variant="outline-secondary"
	  				    							                :class="checkbox_border.type == 'dashed' ? 'active' : ''">
	  				    							            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	  				    							        </b-button>
	  				    							          <b-button style="width: 33.34%"
	  				    							                @click="checkbox_border.type = 'dotted'; setBorderRoot(true, 'checkbox_border', '--checkbox-border')"
	  				    							                variant="outline-secondary"
	  				    							                :class="checkbox_border.type == 'dotted' ? 'active' : ''">
	  				    							            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	  				    							        </b-button>
	  				    							      </b-button-group>
	  				    							    </div>
	  				    							    <div role="group" class="mb-4">
	  				    							      <label>Цвет рамки</label>
	  				    							        <b-input-group class="mb-4">
	  				    							          <b-input-group-prepend>
	  				    							              <b-btn variant="primary" id="exPopoverReactive-checkbox-border">Выбрать цвет</b-btn>
	  				    							              <b-popover target="exPopoverReactive-checkbox-border"
	  				    							                         triggers="click"
	  				    							                         placement="left">
	  				    							                <sketch-picker v-model="checkbox_border.color" @input="setBorderRoot(true, 'checkbox_border', '--checkbox-border')" />
	  				    							              </b-popover>
	  				    							            </b-input-group-prepend>
	  				    							            <b-form-input v-model="checkbox_border.color.hex" @input="setBorderRoot(true, 'checkbox_border', '--checkbox-border')"></b-form-input>
	  				    							        </b-input-group>
	  				    							    </div>
	  				    							  </template>
	  				    							</div>
	  				    							<div role="group">
	  				    							  <label>Радиус скругления уголков рамки</label>
	  				    							  <b-input-group append="px">
	  				    							      <b-form-input type="number" v-model="checkbox_border.radius" @input="checkboxRadius()"></b-form-input>
	  				    							  </b-input-group>
	  				    							</div>
	  				    						</b-tab>
	  				    						<b-tab title="Тени" class="pt-4 pb-2">
	  				    							<b-form-checkbox id="checkbox-radio-shadow"
	  				    							               v-model="checkbox_shadow.show" @change="setShadowRoot($event, 'checkbox_shadow', '--checkbox-shadow')">
	  				    							  Включить тени
	  				    							</b-form-checkbox>
	  				    							<template v-if="checkbox_shadow.show == true">
	  				    							  <div role="group" class="mt-3">
	  				    							    <label>Тени (сдвиг по x)</label>
	  				    							    <b-input-group append="px" class="mb-3">
	  				    							        <b-form-input type="number" v-model="checkbox_shadow.x" @change="setShadowRoot(true, 'checkbox_shadow', '--checkbox-shadow')"></b-form-input>
	  				    							    </b-input-group>
	  				    							    <label>Тени (сдвиг по y)</label>
	  				    							    <b-input-group append="px" class="mb-3">
	  				    							        <b-form-input type="number" v-model="checkbox_shadow.y" @change="setShadowRoot(true, 'checkbox_shadow', '--checkbox-shadow')"></b-form-input>
	  				    							    </b-input-group>
	  				    							    <label>Радиус размытия теней</label>
	  				    							    <b-input-group append="px" class="mb-3">
	  				    							        <b-form-input type="number" v-model="checkbox_shadow.blur" @change="setShadowRoot(true, 'checkbox_shadow', '--checkbox-shadow')"></b-form-input>
	  				    							    </b-input-group>
	  				    							    <label>Цвет тени</label>
	  				    							      <b-input-group class="mb-4">
	  				    							        <b-input-group-prepend>
	  				    							            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	  				    							            <b-popover target="exPopoverReactive-question-shadow"
	  				    							                       triggers="click"
	  				    							                       placement="left">
	  				    							              <sketch-picker v-model="checkbox_shadow.color" @input="setShadowRoot(true, 'checkbox_shadow', '--checkbox-shadow')" />
	  				    							            </b-popover>
	  				    							          </b-input-group-prepend>
	  				    							          <b-form-input @input="setShadowRoot(true, 'checkbox_shadow', '--checkbox-shadow')" v-model="checkbox_shadow.color.hex"></b-form-input>
	  				    							      </b-input-group>
	  				    							      <label>Прозрачность фона</label>
	    				    							    <div class="d-flex">
	    				    							        <div style="width: 60%">
	    				    							            <range-slider
	    				    							                class="slider_range"
	    				    							                min="0"
	    				    							                max="100"
	    				    							                v-model="checkbox_shadow.opacity"
	    				    							                @input="setShadowRoot(true, 'checkbox_shadow', '--checkbox-shadow')">
	    				    							            </range-slider>
	    				    							        </div>
	    				    							        <p class="ml-3 range_count" style="width: 40%">{{ checkbox_shadow.opacity }}%</p>
	    				    							    </div>
	  				    							  </div>
	  				    							</template>
	  				    						</b-tab>
	  				    						<b-tab title="По наведению" class="pt-3">
	  				    							<b-tabs class="more_tabs">
	  				    								<b-tab title="Цвета" active class="pt-4 pb-2">
	  				    									<div role="group">
	  				    									  <label>Цвет фона</label>
	  				    									  <b-input-group class="mb-4">
	  				    									    <b-input-group-prepend>
	  				    									        <b-btn variant="primary" id="exPopoverReactive-checkbox-hover-bg">Выбрать цвет</b-btn>
	  				    									        <b-popover target="exPopoverReactive-checkbox-hover-bg"
	  				    									                   triggers="click"
	  				    									                   placement="left">
	  				    									          <sketch-picker v-model="checkbox_hover_bg.color" @input="setBgRoot('checkbox_hover_bg', '--checkbox-hover-background')" />
	  				    									        </b-popover>
	  				    									      </b-input-group-prepend>
	  				    									      <b-form-input @input="setBgRoot('checkbox_hover_bg', '--checkbox-hover-background')" v-model="checkbox_hover_bg.color.hex"></b-form-input>
	  				    									  </b-input-group>
	  				    									  <label>Прозрачность фона</label>
	  				    									  <div class="d-flex">
	  				    									    <div style="width: 60%">
	  				    									        <range-slider
	  				    									            class="slider_range"
	  				    									            min="0"
	  				    									            max="100"
	  				    									            v-model="checkbox_hover_bg.opacity"
	  				    									            @input="setBgRoot('checkbox_hover_bg', '--checkbox-hover-background')">
	  				    									        </range-slider>
	  				    									    </div>
	  				    									    <p class="ml-3 range_count" style="width: 40%">{{ checkbox_hover_bg.opacity }}%</p>
	  				    									  </div>
	  				    									</div>
	  				    								</b-tab>
	  				    								<b-tab title="Тени" active class="pt-4 pb-2">
	  				    									<b-form-checkbox id="checkbox-radio-hover-shadow"
	  				    									                 v-model="checkbox_hover_shadow.show" @change="setShadowRoot($event, 'checkbox_hover_shadow', '--checkbox-hover-shadow')">
	  				    									  Включить тени
	  				    									</b-form-checkbox>
	  				    									<template v-if="checkbox_hover_shadow.show == true">
	  				    									  <div role="group" class="mt-3">
	  				    									    <label>Тени (сдвиг по x)</label>
	  				    									    <b-input-group append="px" class="mb-3">
	  				    									        <b-form-input type="number" v-model="checkbox_hover_shadow.x" @change="setShadowRoot(true, 'checkbox_hover_shadow', '--checkbox-hover-shadow')"></b-form-input>
	  				    									    </b-input-group>
	  				    									    <label>Тени (сдвиг по y)</label>
	  				    									    <b-input-group append="px" class="mb-3">
	  				    									        <b-form-input type="number" v-model="checkbox_hover_shadow.y" @change="setShadowRoot(true, 'checkbox_hover_shadow', '--checkbox-hover-shadow')"></b-form-input>
	  				    									    </b-input-group>
	  				    									    <label>Радиус размытия теней</label>
	  				    									    <b-input-group append="px" class="mb-3">
	  				    									        <b-form-input type="number" v-model="checkbox_hover_shadow.blur" @change="setShadowRoot(true, 'checkbox_hover_shadow', '--checkbox-hover-shadow')"></b-form-input>
	  				    									    </b-input-group>
	  				    									    <label>Цвет тени</label>
	  				    									      <b-input-group class="mb-4">
	  				    									        <b-input-group-prepend>
	  				    									            <b-btn variant="primary" id="exPopoverReactive-checkbox-hover-shadow">Выбрать цвет</b-btn>
	  				    									            <b-popover target="exPopoverReactive-checkbox-hover-shadow"
	  				    									                       triggers="click"
	  				    									                       placement="left">
	  				    									                <sketch-picker v-model="checkbox_hover_shadow.color" @input="setShadowRoot(true, 'checkbox_hover_shadow', '--checkbox-hover-shadow')" />
	  				    									            </b-popover>
	  				    									          </b-input-group-prepend>
	  				    									          <b-form-input @input="setShadowRoot(true, 'checkbox_hover_shadow', '--checkbox-hover-shadow')" v-model="checkbox_hover_shadow.color.hex"></b-form-input>
	  				    									      </b-input-group>
	  				    									      <label>Прозрачность фона</label>
	  				    									      <div class="d-flex">
	  				    									        <div style="width: 60%">
	  				    									            <range-slider
	  				    									                class="slider_range"
	  				    									                min="0"
	  				    									                max="100"
	  				    									                v-model="checkbox_hover_shadow.opacity"
	  				    									                @input="setShadowRoot(true, 'checkbox_hover_shadow', '--checkbox-hover-shadow')">
	  				    									            </range-slider>
	  				    									        </div>
	  				    									        <p class="ml-3 range_count" style="width: 40%">{{ checkbox_hover_shadow.opacity }}%</p>
	  				    									      </div>
	  				    									  </div>
	  				    									</template>
	  				    								</b-tab>
	  				    							</b-tabs>
	  				    						</b-tab>
	  				    					</b-tabs>
	  				    				</b-tab>
	  				    				<b-tab title="Внутренняя" class="pt-3">
	  				    					<b-tabs class="more_tabs">
	  				    						<b-tab title="Цвета" active class="pt-4 pb-2">
	  				    							<div role="group">
	  				    							  <label>Цвет фона</label>
	  				    							  <b-input-group class="mb-4">
	  				    							    <b-input-group-prepend>
	  				    							        <b-btn variant="primary" id="exPopoverReactive-radio-before-bg">Выбрать цвет</b-btn>
	  				    							        <b-popover target="exPopoverReactive-radio-before-bg"
	  				    							                   triggers="click"
	  				    							                   placement="left">
	  				    							            <sketch-picker v-model="checkbox_before_bg.color" @input="setBgRoot('checkbox_before_bg', '--checkbox-before-background')" />
	  				    							        </b-popover>
	  				    							      </b-input-group-prepend>
	  				    							      <b-form-input @input="setBgRoot('checkbox_before_bg', '--checkbox-before-background')" v-model="checkbox_before_bg.color.hex"></b-form-input>
	  				    							  </b-input-group>
	  				    							  <label>Прозрачность фона</label>
	  				    							  <div class="d-flex">
	  				    							    <div style="width: 60%">
	  				    							        <range-slider
	  				    							            class="slider_range"
	  				    							            min="0"
	  				    							            max="100"
	  				    							            v-model="checkbox_before_bg.opacity"
	  				    							            @input="setBgRoot('checkbox_before_bg', '--checkbox-before-background')">
	  				    							        </range-slider>
	  				    							    </div>
	  				    							    <p class="ml-3 range_count" style="width: 40%">{{ checkbox_before_bg.opacity }}%</p>
	  				    							  </div>
	  				    							</div>
	  				    						</b-tab>
	  				    						<b-tab title="Тени" class="pt-4 pb-2">
	  				    							<b-form-checkbox id="checkbox-radio-before-shadow"
	  				    							               v-model="checkbox_before_shadow.show" @change="setShadowRoot($event, 'checkbox_before_shadow', '--checkbox-before-shadow')">
	  				    							  Включить тени
	  				    							</b-form-checkbox>
	  				    							<template v-if="checkbox_before_shadow.show == true">
	  				    							  <div role="group" class="mt-3">
	  				    							    <label>Тени (сдвиг по x)</label>
	  				    							    <b-input-group append="px" class="mb-3">
	  				    							        <b-form-input type="number" v-model="checkbox_before_shadow.x" @change="setShadowRoot(true, 'checkbox_before_shadow', '--checkbox-before-shadow')"></b-form-input>
	  				    							    </b-input-group>
	  				    							    <label>Тени (сдвиг по y)</label>
	  				    							    <b-input-group append="px" class="mb-3">
	  				    							        <b-form-input type="number" v-model="checkbox_before_shadow.y" @change="setShadowRoot(true, 'checkbox_before_shadow', '--checkbox-before-shadow')"></b-form-input>
	  				    							    </b-input-group>
	  				    							    <label>Радиус размытия теней</label>
	  				    							    <b-input-group append="px" class="mb-3">
	  				    							        <b-form-input type="number" v-model="checkbox_before_shadow.blur" @change="setShadowRoot(true, 'checkbox_before_shadow', '--checkbox-before-shadow')"></b-form-input>
	  				    							    </b-input-group>
	  				    							    <label>Цвет тени</label>
	  				    							      <b-input-group class="mb-4">
	  				    							        <b-input-group-prepend>
	  				    							            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	  				    							            <b-popover target="exPopoverReactive-question-shadow"
	  				    							                       triggers="click"
	  				    							                       placement="top"
	  				    							                       container="myContainer"
	  				    							                       ref="popover-color">
	  				    							              <sketch-picker v-model="checkbox_before_shadow.color" @input="setShadowRoot(true, 'checkbox_before_shadow', '--checkbox-before-shadow')" />
	  				    							            </b-popover>
	  				    							          </b-input-group-prepend>
	  				    							          <b-form-input @input="setShadowRoot(true, 'checkbox_before_shadow', '--checkbox-before-shadow')" v-model="checkbox_before_shadow.color.hex"></b-form-input>
	  				    							      </b-input-group>
	  				    							      <label>Прозрачность фона</label>
	  				    							      <div class="d-flex">
	  				    							          <div style="width: 60%">
	  				    							              <range-slider
	  				    							                  class="slider_range"
	  				    							                  min="0"
	  				    							                  max="100"
	  				    							                  v-model="checkbox_before_shadow.opacity"
	  				    							                  @input="setShadowRoot(true, 'checkbox_before_shadow', '--checkbox-before-shadow')">
	  				    							              </range-slider>
	  				    							          </div>
	  				    							          <p class="ml-3 range_count" style="width: 40%">{{ checkbox_before_shadow.opacity }}%</p>
	  				    							      </div>
	  				    							  </div>
	  				    							</template>
	  				    						</b-tab>
	  				    						<b-tab title="Отмеченный вариант" class="pt-4 pb-2">
	  				    							<div role="group" class="mb-3">
	  				    							  <label>Цвет фона</label>
	  				    							  <b-input-group class="mb-3">
	  				    							    <b-input-group-prepend>
	  				    							        <b-btn variant="primary" id="exPopoverReactive-checkbox-active-bg">Выбрать цвет</b-btn>
	  				    							        <b-popover target="exPopoverReactive-checkbox-active-bg"
	  				    							                   triggers="click"
	  				    							                   placement="left">
	  				    							            <sketch-picker v-model="checkbox_active_bg.color" @input="setBgRoot('checkbox_active_bg', '--checkbox-checked')" />
	  				    							        </b-popover>
	  				    							      </b-input-group-prepend>
	  				    							      <b-form-input @input="setBgRoot('checkbox_active_bg', '--checkbox-checked')" v-model="checkbox_active_bg.color.hex"></b-form-input>
	  				    							  </b-input-group>
	  				    							  <label>Прозрачность фона</label>
	  				    							  <div class="d-flex">
	  				    							    <div style="width: 60%">
	  				    							        <range-slider
	  				    							            class="slider_range"
	  				    							            min="0"
	  				    							            max="100"
	  				    							            v-model="checkbox_active_bg.opacity"
	  				    							            @input="setBgRoot('checkbox_active_bg', '--checkbox-checked')">
	  				    							        </range-slider>
	  				    							    </div>
	  				    							    <p class="ml-3 range_count" style="width: 40%">{{ checkbox_active_bg.opacity }}%</p>
	  				    							  </div>
	  				    							</div>
	  				    							<div role="group">
	  				    							  <b-form-checkbox id="checkbox-radio-active-image"
	  				    							                   v-model="checkbox_active_image" @change="checkboxActiveImage($event)">
	  				    							      Иконка галочки
	  				    							    </b-form-checkbox>
	  				    							</div>
	  				    						</b-tab>
	  				    					</b-tabs>
	  				    				</b-tab>
	  				    			</b-tabs>
	  				    		</b-tab>
	  				    		<b-tab title="Текст. поле" class="pt-3" v-if="questions[questionIndex].addInput == true">
	  				    			<b-tabs class="more_tabs">
	    				    			<b-tab title="Цвета" active class="pt-4 pb-2">
			    								<div role="group" class="mb-3">
			    									<label>Цвет фона</label>
			    						    	<b-input-group class="mb-4">
			    						    		<b-input-group-prepend>
			    					    		    <b-btn variant="primary" id="exPopoverReactive-input-bg">Выбрать цвет</b-btn>
			    					    		    <b-popover target="exPopoverReactive-input-bg"
			    					    		               triggers="click"
			    					    		               placement="right">
		    					    		    		<sketch-picker v-model="input_bg.color" @input="setBackground('input_bg', '.quiz_inputs')" />
			    					    		    </b-popover>
			    				    		    </b-input-group-prepend>
			    					    	    <b-form-input @input="setBackground('input_bg', '.quiz_inputs')" v-model="input_bg.color.hex"></b-form-input>
			    						    	</b-input-group>
			    						    	<label>Прозрачность фона</label>
			    										<div class="d-flex">
			    									    <div style="width: 60%">
			    									        <range-slider
			    									            class="slider_range"
			    									            min="0"
			    									            max="100"
			    									            v-model="input_bg.opacity"
			    									            @input="setBackground('input_bg', '.quiz_inputs')">
			    									        </range-slider>
			    									    </div>
			    									    <p class="ml-3 range_count" style="width: 40%">{{ input_bg.opacity }}%</p>
			    										</div>
			    								</div>
	  								    	<div role="group">
	  				    					  <label>Цвет текста</label>
	  				    			    	<b-input-group>
	  				    			    		<b-input-group-prepend>
	  				    			    		    <b-btn variant="primary" id="exPopoverReactive-input-color-text">Выбрать цвет</b-btn>
	  				    			    		    <b-popover target="exPopoverReactive-input-color-text"
	  				    			    		               triggers="click"
	  				    			    		               placement="left">
	  				    			    		    		<sketch-picker v-model="input_color_text" />
	  				    			    		    </b-popover>
	  				    		    		    </b-input-group-prepend>
	  				    			    	    <b-form-input v-model="input_color_text.hex"></b-form-input>
	  				    			    	</b-input-group>
	  								    	</div>
	    				    			</b-tab>
	    				    			<b-tab title="Текст" class="pt-4 pb-2">
	    				    				<div role="group">
	    				    					<label>Начертание шрифта</label>
	    				    					<b-button-group class="d-flex">
	    				    					    <b-button style="width: 50%" 
	    				    					    		  @click="input_weight = 'normal'"
	    				    					    		  variant="outline-secondary"
	    				    					    		  :class="input_weight == 'normal' ? 'active' : ''">
	    				    					    	Нормальный
	    				    						</b-button>
	    				    					    <b-button style="width: 50%"
	    				    					    		  @click="input_weight = 'bold'"
	    				    					    		  variant="outline-secondary"
	    				    					    		  :class="input_weight == 'bold' ? 'active' : ''">
	    				    					    	Жирный
	    				    						</b-button>
	    				    					</b-button-group>
	    				    				</div>
	    				    			</b-tab>
	    				    			<b-tab title="Рамки" class="pt-4 pb-2">
	  				    					<div role="group" class="mb-3">
	  					    	    		<b-form-checkbox id="checkbox-input-border"
	  					    	    		                 v-model="input_border.show" @change="setBorder($event, 'input_border', '.quiz_inputs')">
	  					    		      		Стилизовать границы
	  						    		    </b-form-checkbox>
	  				    						<template v-if="input_border.show == true">
	  				    							<div role="group" class="mt-3 mb-4">
	  				    								<label>Размер границы</label>
	  				    								<b-input-group append="px">
	  				    							    	<b-form-input type="number" v-model="input_border.size" @change="setBorder(true, 'input_border', '.quiz_inputs')"></b-form-input>
	  				    								</b-input-group>
	  				    							</div>
	  				    							<div role="group">
	  				    								<label>Стиль рамки</label>
	  				    								<b-button-group class="d-flex mb-4">
	  				    								    <b-button style="width: 33.33%" 
	  				    								    		  @click="input_border.type = 'solid'; setBorder(true, 'input_border', '.quiz_inputs')"
	  				    								    		  variant="outline-secondary"
	  				    								    		  :class="input_border.type == 'solid' ? 'active' : ''">
	  				    								    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
	  				    									</b-button>
	  				    								    <b-button style="width: 33.33%"
	  				    								    		  @click="input_border.type = 'dashed'; setBorder(true, 'input_border', '.quiz_inputs')"
	  				    								    		  variant="outline-secondary"
	  				    								    		  :class="input_border.type == 'dashed' ? 'active' : ''">
	  				    								    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
	  				    									</b-button>
	  				    								    <b-button style="width: 33.34%"
	  				    								    		  @click="input_border.type = 'dotted'; setBorder(true, 'input_border', '.quiz_inputs')"
	  				    								    		  variant="outline-secondary"
	  				    								    		  :class="input_border.type == 'dotted' ? 'active' : ''">
	  				    								    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
	  				    									</b-button>
	  				    								</b-button-group>
	  				    							</div>
	  				    							<div role="group" class="mb-4">
	  				    								<label>Цвет рамки</label>
	  				    						    	<b-input-group>
	  				    						    		<b-input-group-prepend>
	  				    						    		    <b-btn variant="primary" id="exPopoverReactive-question-index-border">Выбрать цвет</b-btn>
	  				    						    		    <b-popover target="exPopoverReactive-question-index-border"
	  				    						    		               triggers="click"
	  				    						    		               placement="left">
					    						    		    		<sketch-picker v-model="input_border.color" @input="setBorder(true, 'input_border', '.quiz_inputs')" />
	  				    						    		    </b-popover>
	  				    					    		    </b-input-group-prepend>
	  				    						    	    <b-form-input v-model="input_border.color.hex" @input="setBorder(true, 'input_border', '.quiz_inputs')"></b-form-input>
	  				    						    	</b-input-group>
	  				    							</div>
	  				    						</template>
	  				    					</div>
	  				    					<div role="group">
	  				    						<label>Радиус скругления уголков рамки</label>
	  				    						<b-input-group append="px">
					    					    	<b-form-input v-model="input_border.radius"></b-form-input>
	  				    						</b-input-group>
	  				    					</div>
	    				    			</b-tab>
	    				    			<b-tab title="Тени" class="pt-4 pb-2">
	  				    					<div role="group">
	  							    		  <b-form-checkbox id="checkbox-input-shadow" 
	  							    		                   v-model="input_shadow.show" @change="setShadow($event, 'input_shadow', '.quiz_inputs')">
	  								      		Включить тени
	  						    		    </b-form-checkbox>
	  						    		    <template v-if="input_shadow.show == true">
	  				    							<div role="group" class="mt-3">
	  				    								<label>Тени (сдвиг по x)</label>
	  				    								<b-input-group append="px" class="mb-3">
	  				    							    	<b-form-input type="number" v-model="input_shadow.x" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
	  				    								</b-input-group>
	  				    								<label>Тени (сдвиг по y)</label>
	  				    								<b-input-group append="px" class="mb-3">
	  				    							    	<b-form-input type="number" v-model="input_shadow.y" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
	  				    								</b-input-group>
	  				    								<label>Радиус размытия теней</label>
	  				    								<b-input-group append="px" class="mb-3">
	  				    							    	<b-form-input type="number" v-model="input_shadow.blur" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
	  				    								</b-input-group>
	  				    								<label>Цвет тени</label>
	  				    						    	<b-input-group class="mb-4">
	  				    						    		<b-input-group-prepend>
	  				    						    		    <b-btn variant="primary" id="exPopoverReactive-input-shadow">Выбрать цвет</b-btn>
	  				    						    		    <b-popover target="exPopoverReactive-input-shadow"
	  				    						    		               triggers="click"
	  				    						    		               placement="left">
	  				    						    		    		<sketch-picker v-model="input_shadow.color" @input="setShadow(true, 'input_shadow', '.quiz_inputs')" />
	  				    						    		    </b-popover>
	  				    					    		    </b-input-group-prepend>
	  				    						    	    <b-form-input @input="setShadow(true, 'input_shadow', '.quiz_inputs')" v-model="input_shadow.color.hex"></b-form-input>
	  				    						    	</b-input-group>
	  				    						    	<label>Прозрачность фона</label>
	  				      								<div class="d-flex">
	  				                          <div style="width: 60%">
	  				                              <range-slider
	  				                                  class="slider_range"
	  				                                  min="0"
	  				                                  max="100"
	  				                                  v-model="input_shadow.opacity"
	  				                                  @input="setShadow(true, 'input_shadow', '.quiz_inputs')">
	  				                              </range-slider>
	  				                          </div>
	  				                          <p class="ml-3 range_count" style="width: 40%">{{ input_shadow.opacity }}%</p>
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
	        	<template v-if="whichPopover == 'question-text'">
	        		<b-tabs>
	        		    <b-tab title="Общий блок" class="pt-3">
	        		    	<b-tabs class="more_tabs">
	        		    		<b-tab title="Цвета" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Цвет фона</label>
	        		    			  <b-input-group class="mb-4">
	        		    			    <b-input-group-prepend>
	        		    			        <b-btn variant="primary" id="exPopoverReactive-question-bg">Выбрать цвет</b-btn>
	        		    			        <b-popover target="exPopoverReactive-question-bg"
	        		    			                   triggers="click"
	        		    			                   placement="left">
	        		    			            <sketch-picker v-model="question_bg.color" @input="setBackground('question_bg', '.question')" />
	        		    			        </b-popover>
	        		    			      </b-input-group-prepend>
	        		    			      <b-form-input @input="setBackground('question_bg', '.question')" v-model="question_bg.color.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			  <label>Прозрачность фона</label>
	        		    			  <div class="d-flex">
	        		    			      <div style="width: 60%">
	        		    			          <range-slider
	        		    			              class="slider_range"
	        		    			              min="0"
	        		    			              max="100"
	        		    			              v-model="question_bg.opacity"
	        		    			              @input="setBackground('question_bg', '.question')">
	        		    			          </range-slider>
	        		    			      </div>
	        		    			      <p class="ml-3 range_count" style="width: 40%">{{ question_bg.opacity }}%</p>
	        		    			  </div>
	        		    			</div>
	        		    			<div role="group">
	        		    			    <label>Цвет текста</label>
	        		    			    <b-input-group>
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-block-color-text">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-block-color-text"
	        		    			                       triggers="click"
	        		    			                       placement="top"
	        		    			                       container="myContainer"
	        		    			                       ref="popover-color">
	        		    			                <template slot="title">
	        		    			                    <sketch-picker v-model="question_block_color_text" />
	        		    			                </template>
	        		    			            </b-popover>
	        		    			        </b-input-group-prepend>
	        		    			        <b-form-input v-model="question_block_color_text.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Отступы" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Внутренние отступы (вертикально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_vert"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    			<div role="group">
	        		    			  <label>Внутренние отступы (горизонтально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_horz"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Рамки" class="pt-4 pb-2">
	        		    			<div role="group">
	        		    				<b-form-checkbox id="checkbox-question-border"class="mb-3 d-block"
	        		    				                 v-model="question_border.show" @change="setBorder($event, 'question_border', '.question')">
	        		    				    Стилизовать границы
	        		    				</b-form-checkbox>
	        		    				<template v-if="question_border.show == true">
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Размер границы</label>
	        		    				        <b-input-group append="px">
	        		    				            <b-form-input type="number" v-model="question_border.size" @change="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				    <div role="group">
	        		    				        <label>Стиль рамки</label>
	        		    				        <b-button-group class="d-flex mb-4">
	        		    				            <b-button style="width: 33.33%" 
	        		    				                      @click="question_border.type = 'solid'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'solid' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.33%"
	        		    				                      @click="question_border.type = 'dashed'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dashed' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.34%"
	        		    				                      @click="question_border.type = 'dotted'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dotted' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				        </b-button-group>
	        		    				    </div>
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Цвет рамки</label>
	        		    				        <b-input-group class="mb-4">
	        		    				            <b-input-group-prepend>
	        		    				                <b-btn variant="primary" id="exPopoverReactive-question-border">Выбрать цвет</b-btn>
	        		    				                <b-popover target="exPopoverReactive-question-border"
	        		    				                           triggers="click"
	        		    				                           placement="left">
	  		    				                        <sketch-picker v-model="question_border.color" @input="setBorder(true, 'question_border', '.question')" />
	        		    				                </b-popover>
	        		    				            </b-input-group-prepend>
	        		    				            <b-form-input v-model="question_border.color.hex" @input="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				</template>
	        		    			  <label>Радиус скругления уголков</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_radius"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Тени" class="pt-4 pb-2">
	        		    			<b-form-checkbox id="checkbox-question-shadow"
	        		    			               v-model="question_shadow.show" @change="setShadow($event, 'question_shadow', '.question')">
	        		    			    Включить тени
	        		    			</b-form-checkbox>
	        		    			<template v-if="question_shadow.show == true">
	        		    			  <div role="group" class="mt-3">
	        		    			    <label>Тени (сдвиг по x)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.x" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Тени (сдвиг по y)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.y" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Радиус размытия теней</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.blur" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Цвет тени</label>
	        		    			      <b-input-group class="mb-4">
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-shadow"
	        		    			                       triggers="click"
	        		    			                       placement="left">
	        		    			                <sketch-picker v-model="question_shadow.color" @input="setShadow(true, 'question_shadow', '.question')" />
	        		    			            </b-popover>
	        		    			          </b-input-group-prepend>
	        		    			          <b-form-input @input="setShadow(true, 'question_shadow', '.question')" v-model="question_shadow.color.hex"></b-form-input>
	        		    			      </b-input-group>
	        		    			        <label>Прозрачность фона</label>
	        		    			    <div class="d-flex">
	        		    			        <div style="width: 60%">
	        		    			            <range-slider
	        		    			                class="slider_range"
	        		    			                min="0"
	        		    			                max="100"
	        		    			                v-model="question_shadow.opacity"
	        		    			                @input="setShadow(true, 'question_shadow', '.question')">
	        		    			            </range-slider>
	        		    			        </div>
	        		    			        <p class="ml-4 range_count" style="width: 40%">{{ question_shadow.opacity }}%</p>
	        		    			    </div>
	        		    			  </div>
	        		    			</template>
	        		    		</b-tab>
	        		    	</b-tabs> 
	        		    </b-tab>
	        		    <b-tab title="Текст. поле" class="pt-3" active>
	        		    	<b-tabs class="more_tabs">
	  				    			<b-tab title="Цвета" active class="pt-4 pb-2">
		    								<div role="group" class="mb-3">
		    									<label>Цвет фона</label>
		    						    	<b-input-group class="mb-4">
		    						    		<b-input-group-prepend>
		    					    		    <b-btn variant="primary" id="exPopoverReactive-input-bg">Выбрать цвет</b-btn>
		    					    		    <b-popover target="exPopoverReactive-input-bg"
		    					    		               triggers="click"
		    					    		               placement="right">
	    					    		    		<sketch-picker v-model="input_bg.color" @input="setBackground('input_bg', '.quiz_inputs')" />
		    					    		    </b-popover>
		    				    		    </b-input-group-prepend>
		    					    	    <b-form-input @input="setBackground('input_bg', '.quiz_inputs')" v-model="input_bg.color.hex"></b-form-input>
		    						    	</b-input-group>
		    						    	<label>Прозрачность фона</label>
		    										<div class="d-flex">
		    									    <div style="width: 60%">
		    									        <range-slider
		    									            class="slider_range"
		    									            min="0"
		    									            max="100"
		    									            v-model="input_bg.opacity"
		    									            @input="setBackground('input_bg', '.quiz_inputs')">
		    									        </range-slider>
		    									    </div>
		    									    <p class="ml-3 range_count" style="width: 40%">{{ input_bg.opacity }}%</p>
		    										</div>
		    								</div>
									    	<div role="group">
					    					  <label>Цвет текста</label>
					    			    	<b-input-group>
					    			    		<b-input-group-prepend>
					    			    		    <b-btn variant="primary" id="exPopoverReactive-input-color-text">Выбрать цвет</b-btn>
					    			    		    <b-popover target="exPopoverReactive-input-color-text"
					    			    		               triggers="click"
					    			    		               placement="left">
					    			    		    		<sketch-picker v-model="input_color_text" />
					    			    		    </b-popover>
					    		    		    </b-input-group-prepend>
					    			    	    <b-form-input v-model="input_color_text.hex"></b-form-input>
					    			    	</b-input-group>
									    	</div>
	  				    			</b-tab>
	  				    			<b-tab title="Текст" class="pt-4 pb-2">
	  				    				<div role="group">
	  				    					<label>Начертание шрифта</label>
	  				    					<b-button-group class="d-flex">
	  				    					    <b-button style="width: 50%" 
	  				    					    		  @click="input_weight = 'normal'"
	  				    					    		  variant="outline-secondary"
	  				    					    		  :class="input_weight == 'normal' ? 'active' : ''">
	  				    					    	Нормальный
	  				    						</b-button>
	  				    					    <b-button style="width: 50%"
	  				    					    		  @click="input_weight = 'bold'"
	  				    					    		  variant="outline-secondary"
	  				    					    		  :class="input_weight == 'bold' ? 'active' : ''">
	  				    					    	Жирный
	  				    						</b-button>
	  				    					</b-button-group>
	  				    				</div>
	  				    			</b-tab>
	  				    			<b-tab title="Рамки" class="pt-4 pb-2">
					    					<div role="group" class="mb-3">
						    	    		<b-form-checkbox id="checkbox-input-border"
						    	    		                 v-model="input_border.show" @change="setBorder($event, 'input_border', '.quiz_inputs')">
					    		      		Стилизовать границы
							    		    </b-form-checkbox>
					    						<template v-if="input_border.show == true">
					    							<div role="group" class="mt-3 mb-4">
					    								<label>Размер границы</label>
					    								<b-input-group append="px">
					    							    	<b-form-input type="number" v-model="input_border.size" @change="setBorder(true, 'input_border', '.quiz_inputs')"></b-form-input>
					    								</b-input-group>
					    							</div>
					    							<div role="group">
					    								<label>Стиль рамки</label>
					    								<b-button-group class="d-flex mb-4">
					    								    <b-button style="width: 33.33%" 
					    								    		  @click="input_border.type = 'solid'; setBorder(true, 'input_border', '.quiz_inputs')"
					    								    		  variant="outline-secondary"
					    								    		  :class="input_border.type == 'solid' ? 'active' : ''">
					    								    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
					    									</b-button>
					    								    <b-button style="width: 33.33%"
					    								    		  @click="input_border.type = 'dashed'; setBorder(true, 'input_border', '.quiz_inputs')"
					    								    		  variant="outline-secondary"
					    								    		  :class="input_border.type == 'dashed' ? 'active' : ''">
					    								    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
					    									</b-button>
					    								    <b-button style="width: 33.34%"
					    								    		  @click="input_border.type = 'dotted'; setBorder(true, 'input_border', '.quiz_inputs')"
					    								    		  variant="outline-secondary"
					    								    		  :class="input_border.type == 'dotted' ? 'active' : ''">
					    								    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
					    									</b-button>
					    								</b-button-group>
					    							</div>
					    							<div role="group" class="mb-4">
					    								<label>Цвет рамки</label>
					    						    	<b-input-group>
					    						    		<b-input-group-prepend>
					    						    		    <b-btn variant="primary" id="exPopoverReactive-question-index-border">Выбрать цвет</b-btn>
					    						    		    <b-popover target="exPopoverReactive-question-index-border"
					    						    		               triggers="click"
					    						    		               placement="left">
				    						    		    		<sketch-picker v-model="input_border.color" @input="setBorder(true, 'input_border', '.quiz_inputs')" />
					    						    		    </b-popover>
					    					    		    </b-input-group-prepend>
					    						    	    <b-form-input v-model="input_border.color.hex" @input="setBorder(true, 'input_border', '.quiz_inputs')"></b-form-input>
					    						    	</b-input-group>
					    							</div>
					    						</template>
					    					</div>
					    					<div role="group">
					    						<label>Радиус скругления уголков рамки</label>
					    						<b-input-group append="px">
				    					    	<b-form-input v-model="input_border.radius"></b-form-input>
					    						</b-input-group>
					    					</div>
	  				    			</b-tab>
	  				    			<b-tab title="Тени" class="pt-4 pb-2">
					    					<div role="group">
								    		  <b-form-checkbox id="checkbox-input-shadow" 
								    		                   v-model="input_shadow.show" @change="setShadow($event, 'input_shadow', '.quiz_inputs')">
									      		Включить тени
							    		    </b-form-checkbox>
							    		    <template v-if="input_shadow.show == true">
					    							<div role="group" class="mt-3">
					    								<label>Тени (сдвиг по x)</label>
					    								<b-input-group append="px" class="mb-3">
					    							    	<b-form-input type="number" v-model="input_shadow.x" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
					    								</b-input-group>
					    								<label>Тени (сдвиг по y)</label>
					    								<b-input-group append="px" class="mb-3">
					    							    	<b-form-input type="number" v-model="input_shadow.y" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
					    								</b-input-group>
					    								<label>Радиус размытия теней</label>
					    								<b-input-group append="px" class="mb-3">
					    							    	<b-form-input type="number" v-model="input_shadow.blur" @change="setShadow(true, 'input_shadow', '.quiz_inputs')"></b-form-input>
					    								</b-input-group>
					    								<label>Цвет тени</label>
					    						    	<b-input-group class="mb-4">
					    						    		<b-input-group-prepend>
					    						    		    <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
					    						    		    <b-popover target="exPopoverReactive-question-shadow"
					    						    		               triggers="click"
					    						    		               placement="left">
					    						    		    		<sketch-picker v-model="input_shadow.color" @input="setShadow(true, 'input_shadow', '.quiz_inputs')" />
					    						    		    </b-popover>
					    					    		    </b-input-group-prepend>
					    						    	    <b-form-input @input="setShadow(true, 'input_shadow', '.quiz_inputs')" v-model="input_shadow.color.hex"></b-form-input>
					    						    	</b-input-group>
					    						    	<label>Прозрачность фона</label>
					      								<div class="d-flex">
					                          <div style="width: 60%">
					                              <range-slider
					                                  class="slider_range"
					                                  min="0"
					                                  max="100"
					                                  v-model="input_shadow.opacity"
					                                  @input="setShadow(true, 'input_shadow', '.quiz_inputs')">
					                              </range-slider>
					                          </div>
					                          <p class="ml-3 range_count" style="width: 40%">{{ input_shadow.opacity }}%</p>
					                      </div>
					    							</div>
											    </template>
					    					</div>
	  				    			</b-tab>
					    			</b-tabs>
	        		    </b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'question-date'">
	        		<b-tabs>
	        		    <b-tab title="Общий блок" class="pt-3">
	        		    	<b-tabs class="more_tabs">
	        		    		<b-tab title="Цвета" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Цвет фона</label>
	        		    			  <b-input-group class="mb-4">
	        		    			    <b-input-group-prepend>
	        		    			        <b-btn variant="primary" id="exPopoverReactive-question-bg">Выбрать цвет</b-btn>
	        		    			        <b-popover target="exPopoverReactive-question-bg"
	        		    			                   triggers="click"
	        		    			                   placement="left">
	        		    			            <sketch-picker v-model="question_bg.color" @input="setBackground('question_bg', '.question')" />
	        		    			        </b-popover>
	        		    			      </b-input-group-prepend>
	        		    			      <b-form-input @input="setBackground('question_bg', '.question')" v-model="question_bg.color.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			  <label>Прозрачность фона</label>
	        		    			  <div class="d-flex">
	        		    			      <div style="width: 60%">
	        		    			          <range-slider
	        		    			              class="slider_range"
	        		    			              min="0"
	        		    			              max="100"
	        		    			              v-model="question_bg.opacity"
	        		    			              @input="setBackground('question_bg', '.question')">
	        		    			          </range-slider>
	        		    			      </div>
	        		    			      <p class="ml-3 range_count" style="width: 40%">{{ question_bg.opacity }}%</p>
	        		    			  </div>
	        		    			</div>
	        		    			<div role="group">
	        		    			    <label>Цвет текста</label>
	        		    			    <b-input-group>
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-block-color-text">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-block-color-text"
	        		    			                       triggers="click"
	        		    			                       placement="top"
	        		    			                       container="myContainer"
	        		    			                       ref="popover-color">
	        		    			                <template slot="title">
	        		    			                    <sketch-picker v-model="question_block_color_text" />
	        		    			                </template>
	        		    			            </b-popover>
	        		    			        </b-input-group-prepend>
	        		    			        <b-form-input v-model="question_block_color_text.hex"></b-form-input>
	        		    			    </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Отступы" class="pt-4 pb-2">
	        		    			<div role="group" class="mb-3">
	        		    			  <label>Внутренние отступы (вертикально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_vert"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    			<div role="group">
	        		    			  <label>Внутренние отступы (горизонтально)</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_padd_horz"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Рамки" class="pt-4 pb-2">
	        		    			<div role="group">
	        		    				<b-form-checkbox id="checkbox-question-border"class="mb-3 d-block"
	        		    				                 v-model="question_border.show" @change="setBorder($event, 'question_border', '.question')">
	        		    				    Стилизовать границы
	        		    				</b-form-checkbox>
	        		    				<template v-if="question_border.show == true">
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Размер границы</label>
	        		    				        <b-input-group append="px">
	        		    				            <b-form-input type="number" v-model="question_border.size" @change="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				    <div role="group">
	        		    				        <label>Стиль рамки</label>
	        		    				        <b-button-group class="d-flex mb-4">
	        		    				            <b-button style="width: 33.33%" 
	        		    				                      @click="question_border.type = 'solid'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'solid' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.33%"
	        		    				                      @click="question_border.type = 'dashed'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dashed' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				            <b-button style="width: 33.34%"
	        		    				                      @click="question_border.type = 'dotted'; setBorder(true, 'question_border', '.question')"
	        		    				                      variant="outline-secondary"
	        		    				                      :class="question_border.type == 'dotted' ? 'active' : ''">
	        		    				                <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        		    				            </b-button>
	        		    				        </b-button-group>
	        		    				    </div>
	        		    				    <div role="group" class="mb-4">
	        		    				        <label>Цвет рамки</label>
	        		    				        <b-input-group class="mb-4">
	        		    				            <b-input-group-prepend>
	        		    				                <b-btn variant="primary" id="exPopoverReactive-question-border">Выбрать цвет</b-btn>
	        		    				                <b-popover target="exPopoverReactive-question-border"
	        		    				                           triggers="click"
	        		    				                           placement="left">
	  		    				                        <sketch-picker v-model="question_border.color" @input="setBorder(true, 'question_border', '.question')" />
	        		    				                </b-popover>
	        		    				            </b-input-group-prepend>
	        		    				            <b-form-input v-model="question_border.color.hex" @input="setBorder(true, 'question_border', '.question')"></b-form-input>
	        		    				        </b-input-group>
	        		    				    </div>
	        		    				</template>
	        		    			  <label>Радиус скругления уголков</label>
	        		    			  <b-input-group append="px">
	        		    			      <b-form-input type="number" v-model="question_radius"></b-form-input>
	        		    			  </b-input-group>
	        		    			</div>
	        		    		</b-tab>
	        		    		<b-tab title="Тени" class="pt-4 pb-2">
	        		    			<b-form-checkbox id="checkbox-question-shadow"
	        		    			               v-model="question_shadow.show" @change="setShadow($event, 'question_shadow', '.question')">
	        		    			    Включить тени
	        		    			</b-form-checkbox>
	        		    			<template v-if="question_shadow.show == true">
	        		    			  <div role="group" class="mt-3">
	        		    			    <label>Тени (сдвиг по x)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.x" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Тени (сдвиг по y)</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.y" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Радиус размытия теней</label>
	        		    			    <b-input-group append="px" class="mb-3">
	        		    			        <b-form-input type="number" v-model="question_shadow.blur" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	        		    			    </b-input-group>
	        		    			    <label>Цвет тени</label>
	        		    			      <b-input-group class="mb-4">
	        		    			        <b-input-group-prepend>
	        		    			            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	        		    			            <b-popover target="exPopoverReactive-question-shadow"
	        		    			                       triggers="click"
	        		    			                       placement="left">
	        		    			                <sketch-picker v-model="question_shadow.color" @input="setShadow(true, 'question_shadow', '.question')" />
	        		    			            </b-popover>
	        		    			          </b-input-group-prepend>
	        		    			          <b-form-input @input="setShadow(true, 'question_shadow', '.question')" v-model="question_shadow.color.hex"></b-form-input>
	        		    			      </b-input-group>
	        		    			        <label>Прозрачность фона</label>
	        		    			    <div class="d-flex">
	        		    			        <div style="width: 60%">
	        		    			            <range-slider
	        		    			                class="slider_range"
	        		    			                min="0"
	        		    			                max="100"
	        		    			                v-model="question_shadow.opacity"
	        		    			                @input="setShadow(true, 'question_shadow', '.question')">
	        		    			            </range-slider>
	        		    			        </div>
	        		    			        <p class="ml-4 range_count" style="width: 40%">{{ question_shadow.opacity }}%</p>
	        		    			    </div>
	        		    			  </div>
	        		    			</template>
	        		    		</b-tab>
	        		    	</b-tabs> 
	        		    </b-tab>
	        		    <b-tab title="Календарь" class="pt-3" active>
	        		    	<b-tabs>
	        		    		<b-tab title="Блок" class="pt-3">
	        		    			<b-tabs class="more_tabs">
	        		    				<b-tab title="Цвета" active class="pt-4 pb-2">
	        		    					<div role="group" class="mb-3">
	        		    					  <label>Цвет фона</label>
	        		    					  <b-input-group class="mb-4">
	        		    					    <b-input-group-prepend>
	        		    					        <b-btn variant="primary" id="exPopoverReactive-calendar-bg">Выбрать цвет</b-btn>
	        		    					        <b-popover target="exPopoverReactive-calendar-bg"
	        		    					                   triggers="click"
	        		    					                   placement="left">
	        		    					          <sketch-picker v-model="calendar_bg.color" @input="setBackground('calendar_bg', '.calendar')" />
	        		    					        </b-popover>
	        		    					      </b-input-group-prepend>
	        		    					      <b-form-input @input="setBackground('calendar_bg', '.calendar')" v-model="calendar_bg.color.hex"></b-form-input>
	        		    					  </b-input-group>
	        		    					  <label>Прозрачность фона</label>
	        		    					  <div class="d-flex">
	        		    					    <div style="width: 60%">
	        		    					        <range-slider
	        		    					            class="slider_range"
	        		    					            min="0"
	        		    					            max="100"
	        		    					            v-model="calendar_bg.opacity"
	        		    					            @input="setBackground('calendar_bg', '.calendar')">
	        		    					        </range-slider>
	        		    					    </div>
	        		    					    <p class="ml-3 range_count" style="width: 40%">{{ calendar_bg.opacity }}%</p>
	        		    					  </div>
	        		    					</div>
	        		    					<div role="group">
	        		    					  <label>Цвет текста</label>
	        		    					    <b-input-group>
	        		    					      <b-input-group-prepend>
	        		    					          <b-btn variant="primary" id="exPopoverReactive-calendar-color">Выбрать цвет</b-btn>
	        		    					          <b-popover target="exPopoverReactive-calendar-color"
	        		    					                     triggers="click"
	        		    					                     placement="left">
	        		    					              <sketch-picker v-model="calendar_color" />
	        		    					          </b-popover>
	        		    					        </b-input-group-prepend>
	        		    					        <b-form-input v-model="calendar_color.hex"></b-form-input>
	        		    					    </b-input-group>
	        		    					</div>
	        		    				</b-tab>
	        		    				<b-tab title="Рамки" class="pt-4 pb-2">
	        		    					<div role="group" class="mb-3">
	        		    					  <b-form-checkbox id="checkbox-calendar-border"
	        		    					                   v-model="calendar_border.show" @change="setBorder($event, 'calendar_border', '.calendar')">
	      		    					      Стилизовать границы
	        		    					  </b-form-checkbox>
	        		    					  <template v-if="calendar_border.show == true">
	        		    					    <div role="group" class="mb-4 mt-3">
	        		    					      <label>Размер границы</label>
	        		    					      <b-input-group append="px">
	        		    					          <b-form-input type="number" v-model="calendar_border.size" @change="setBorder(true, 'calendar_border', '.calendar')"></b-form-input>
	        		    					      </b-input-group>
	        		    					    </div>
	        		    					    <div role="group">
	        		    					      <label>Стиль рамки</label>
	        		    					      <b-button-group class="d-flex mb-4">
	        		    					          <b-button style="width: 33.33%" 
	        		    					                @click="calendar_border.type = 'solid'; setBorder(true, 'calendar_border', '.calendar')"
	        		    					                variant="outline-secondary"
	        		    					                :class="calendar_border.type == 'solid' ? 'active' : ''">
	        		    					            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        		    					        </b-button>
	        		    					          <b-button style="width: 33.33%"
	        		    					                @click="calendar_border.type = 'dashed'; setBorder(true, 'calendar_border', '.calendar')"
	        		    					                variant="outline-secondary"
	        		    					                :class="calendar_border.type == 'dashed' ? 'active' : ''">
	        		    					            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        		    					        </b-button>
	        		    					          <b-button style="width: 33.34%"
	        		    					                @click="calendar_border.type = 'dotted'; setBorder(true, 'calendar_border', '.calendar')"
	        		    					                variant="outline-secondary"
	        		    					                :class="calendar_border.type == 'dotted' ? 'active' : ''">
	        		    					            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        		    					        </b-button>
	        		    					      </b-button-group>
	        		    					    </div>
	        		    					    <div role="group" class="mb-4">
	        		    					      <label>Цвет рамки</label>
	        		    					        <b-input-group>
	        		    					          <b-input-group-prepend>
	        		    					              <b-btn variant="primary" id="exPopoverReactive-calendar-border">Выбрать цвет</b-btn>
	        		    					              <b-popover target="exPopoverReactive-calendar-border"
	        		    					                         triggers="click"
	        		    					                         placement="left">
	      		    					                  <sketch-picker v-model="calendar_border.color" @input="setBorder(true, 'calendar_border', '.calendar')" />
	        		    					              </b-popover>
	        		    					            </b-input-group-prepend>
	        		    					            <b-form-input v-model="calendar_border.color.hex" @input="setBorder(true, 'calendar_border', '.calendar')"></b-form-input>
	        		    					        </b-input-group>
	        		    					    </div>
	        		    					  </template>
	        		    					</div>
	        		    					<div role="group">
	        		    					  <label>Радиус скругления уголков рамки</label>
	        		    					  <b-input-group append="px">
	        		    					      <b-form-input v-model="calendar_border.radius"></b-form-input>
	        		    					  </b-input-group>
	        		    					</div>
	        		    				</b-tab>
	        		    				<b-tab title="Тени" class="pt-4 pb-2">
	        		    					<b-form-checkbox id="checkbox-calendar-shadow"
	        		    					               v-model="calendar_shadow.show" @change="setShadow($event, 'calendar_shadow', '.calendar')">
	        		    					  Включить тени
	        		    					</b-form-checkbox>
	        		    					<template v-if="calendar_shadow.show == true">
	        		    					  <div role="group" class="mt-3">
	        		    					    <label>Тени (сдвиг по x)</label>
	        		    					    <b-input-group append="px" class="mb-3">
	        		    					        <b-form-input type="number" v-model="calendar_shadow.x" @change="setShadow(true, 'calendar_shadow', '.calendar')"></b-form-input>
	        		    					    </b-input-group>
	        		    					    <label>Тени (сдвиг по y)</label>
	        		    					    <b-input-group append="px" class="mb-3">
	        		    					        <b-form-input type="number" v-model="calendar_shadow.y" @change="setShadow(true, 'calendar_shadow', '.calendar')"></b-form-input>
	        		    					    </b-input-group>
	        		    					    <label>Радиус размытия теней</label>
	        		    					    <b-input-group append="px" class="mb-3">
	        		    					        <b-form-input type="number" v-model="calendar_shadow.blur" @change="setShadow(true, 'calendar_shadow', '.calendar')"></b-form-input>
	        		    					    </b-input-group>
	        		    					    <label>Цвет тени</label>
	        		    					      <b-input-group class="mb-4">
	        		    					        <b-input-group-prepend>
	        		    					            <b-btn variant="primary" id="exPopoverReactive-calendar-shadow">Выбрать цвет</b-btn>
	        		    					            <b-popover target="exPopoverReactive-calendar-shadow"
	        		    					                       triggers="click"
	        		    					                       placement="top"
	        		    					                       container="myContainer"
	        		    					                       ref="popover-color">
	        		    					                <sketch-picker v-model="calendar_shadow.color" @input="setShadow(true, 'calendar_shadow', '.calendar')" />
	        		    					            </b-popover>
	        		    					          </b-input-group-prepend>
	        		    					          <b-form-input @input="setShadow(true, 'calendar_shadow', '.calendar')" v-model="calendar_shadow.color.hex"></b-form-input>
	        		    					      </b-input-group>
	        		    					      <label>Прозрачность фона</label>
	        		    					      <div class="d-flex">
	        		    					          <div style="width: 60%">
	        		    					              <range-slider
	        		    					                  class="slider_range"
	        		    					                  min="0"
	        		    					                  max="100"
	        		    					                  v-model="calendar_shadow.opacity"
	        		    					                  @input="setShadow(true, 'calendar_shadow', '.calendar')">
	        		    					              </range-slider>
	        		    					          </div>
	        		    					          <p class="ml-3 range_count" style="width: 40%">{{ calendar_shadow.opacity }}%</p>
	        		    					      </div>
	        		    					  </div>
	        		    					</template>
	        		    				</b-tab>
	        		    			</b-tabs>
	        		    		</b-tab>
	        		    		<b-tab title="Выбор даты" class="pt-3">
	        		    			<b-tabs class="more_tabs">
	        		    				<b-tab title="При наведении" class="pt-4 pb-2">
	        		    					<div role="group" class="mb-3">
	        		    					  <label>Цвет фона</label>
	        		    					  <b-input-group class="mb-4">
	        		    					    <b-input-group-prepend>
	        		    					        <b-btn variant="primary" id="exPopoverReactive-calendar-hover-bg">Выбрать цвет</b-btn>
	        		    					        <b-popover target="exPopoverReactive-calendar-hover-bg"
	        		    					                   triggers="click"
	        		    					                   placement="left">
	        		    					            <sketch-picker v-model="calendar_hover_bg.color" @input="setBgRoot('calendar_hover_bg', '--calendar-hover-background')" />
	        		    					        </b-popover>
	        		    					      </b-input-group-prepend>
	        		    					      <b-form-input @input="setBgRoot('calendar_hover_bg', '--calendar-hover-background')" v-model="calendar_hover_bg.color.hex"></b-form-input>
	        		    					  </b-input-group>
	        		    					  <label>Прозрачность фона</label>
	        		    					  <div class="d-flex">
	        		    					    <div style="width: 60%">
	        		    					        <range-slider
	        		    					            class="slider_range"
	        		    					            min="0"
	        		    					            max="100"
	        		    					            v-model="calendar_hover_bg.opacity"
	        		    					            @input="setBgRoot('calendar_hover_bg', '--calendar-hover-background')">
	        		    					        </range-slider>
	        		    					    </div>
	        		    					    <p class="ml-3 range_count" style="width: 40%">{{ calendar_hover_bg.opacity }}%</p>
	        		    					  </div>
	        		    					</div>
	        		    					<div role="group">
	        		    					  <label>Цвет текста</label>
	        		    					    <b-input-group>
	        		    					      <b-input-group-prepend>
	        		    					          <b-btn variant="primary" id="exPopoverReactive-calendar-hover-color">Выбрать цвет</b-btn>
	        		    					          <b-popover target="exPopoverReactive-calendar-hover-color"
	        		    					                     triggers="click"
	        		    					                     placement="left">
	        		    					              <sketch-picker v-model="calendar_hover_color" @input="calendarHoverColor()" />
	        		    					          </b-popover>
	        		    					        </b-input-group-prepend>
	        		    					        <b-form-input v-model="calendar_hover_color.hex" @input="calendarHoverColor()"></b-form-input>
	        		    					    </b-input-group>
	        		    					</div>
	        		    				</b-tab>
	        		    				<b-tab title="При отмеченном" class="pt-4 pb-2">
	        		    					<div role="group" class="mb-3">
	        		    					  <label>Цвет фона</label>
	        		    					  <b-input-group class="mb-4">
	        		    					    <b-input-group-prepend>
	        		    					        <b-btn variant="primary" id="exPopoverReactive-calendar-active-bg">Выбрать цвет</b-btn>
	        		    					        <b-popover target="exPopoverReactive-calendar-active-bg"
	        		    					                   triggers="click"
	        		    					                   placement="left">
	        		    					          <sketch-picker v-model="calendar_active_bg.color" @input="setBgRoot('calendar_active_bg', '--calendar-selected')" />
	        		    					        </b-popover>
	        		    					      </b-input-group-prepend>
	        		    					      <b-form-input @input="setBgRoot('calendar_active_bg', '--calendar-selected')" v-model="calendar_active_bg.color.hex"></b-form-input>
	        		    					  </b-input-group>
	        		    					  <label>Прозрачность фона</label>
	        		    					  <div class="d-flex">
	        		    					    <div style="width: 60%">
	        		    					        <range-slider
	        		    					            class="slider_range"
	        		    					            min="0"
	        		    					            max="100"
	        		    					            v-model="calendar_active_bg.opacity"
	        		    					            @input="setBgRoot('calendar_active_bg', '--calendar-selected')">
	        		    					        </range-slider>
	        		    					    </div>
	        		    					    <p class="ml-3 range_count" style="width: 40%">{{ calendar_active_bg.opacity }}%</p>
	        		    					  </div>
	        		    					</div>
	        		    					<div role="group">
	        		    					  <label>Цвет текста</label>
	        		    					  <b-input-group>
	        		    					    <b-input-group-prepend>
	        		    					        <b-btn variant="primary" id="exPopoverReactive-calendar-active-color">Выбрать цвет</b-btn>
	        		    					        <b-popover target="exPopoverReactive-calendar-active-color"
	        		    					                   triggers="click"
	        		    					                   placement="left">
	        		    					            <sketch-picker v-model="calendar_active_color" @input="calendarActiveColor()" />
	        		    					        </b-popover>
	        		    					      </b-input-group-prepend>
	        		    					      <b-form-input v-model="calendar_active_color.hex" @input="calendarActiveColor()"></b-form-input>
	        		    					  </b-input-group>
	        		    					</div>
	        		    				</b-tab>
	        		    			</b-tabs>
	        		    		</b-tab>
	        		    	</b-tabs>
	        		    </b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'question-range'">
	        		<b-tabs>
	      		    <b-tab title="Общий блок" class="pt-3">
	      		    	<b-tabs class="more_tabs">
	      		    		<b-tab title="Цвета" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-3">
	      		    			  <label>Цвет фона</label>
	      		    			  <b-input-group class="mb-4">
	      		    			    <b-input-group-prepend>
	      		    			        <b-btn variant="primary" id="exPopoverReactive-question-bg">Выбрать цвет</b-btn>
	      		    			        <b-popover target="exPopoverReactive-question-bg"
	      		    			                   triggers="click"
	      		    			                   placement="left">
	      		    			            <sketch-picker v-model="question_bg.color" @input="setBackground('question_bg', '.question')" />
	      		    			        </b-popover>
	      		    			      </b-input-group-prepend>
	      		    			      <b-form-input @input="setBackground('question_bg', '.question')" v-model="question_bg.color.hex"></b-form-input>
	      		    			    </b-input-group>
	      		    			  <label>Прозрачность фона</label>
	      		    			  <div class="d-flex">
	      		    			      <div style="width: 60%">
	      		    			          <range-slider
	      		    			              class="slider_range"
	      		    			              min="0"
	      		    			              max="100"
	      		    			              v-model="question_bg.opacity"
	      		    			              @input="setBackground('question_bg', '.question')">
	      		    			          </range-slider>
	      		    			      </div>
	      		    			      <p class="ml-3 range_count" style="width: 40%">{{ question_bg.opacity }}%</p>
	      		    			  </div>
	      		    			</div>
	      		    			<div role="group">
	      		    			    <label>Цвет текста</label>
	      		    			    <b-input-group>
	      		    			        <b-input-group-prepend>
	      		    			            <b-btn variant="primary" id="exPopoverReactive-question-block-color-text">Выбрать цвет</b-btn>
	      		    			            <b-popover target="exPopoverReactive-question-block-color-text"
	      		    			                       triggers="click"
	      		    			                       placement="top"
	      		    			                       container="myContainer"
	      		    			                       ref="popover-color">
	      		    			                <template slot="title">
	      		    			                    <sketch-picker v-model="question_block_color_text" />
	      		    			                </template>
	      		    			            </b-popover>
	      		    			        </b-input-group-prepend>
	      		    			        <b-form-input v-model="question_block_color_text.hex"></b-form-input>
	      		    			    </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Отступы" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-3">
	      		    			  <label>Внутренние отступы (вертикально)</label>
	      		    			  <b-input-group append="px">
	      		    			      <b-form-input type="number" v-model="question_padd_vert"></b-form-input>
	      		    			  </b-input-group>
	      		    			</div>
	      		    			<div role="group">
	      		    			  <label>Внутренние отступы (горизонтально)</label>
	      		    			  <b-input-group append="px">
	      		    			      <b-form-input type="number" v-model="question_padd_horz"></b-form-input>
	      		    			  </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Рамки" class="pt-4 pb-2">
	      		    			<div role="group">
	      		    				<b-form-checkbox id="checkbox-question-border"class="mb-3 d-block"
	      		    				                 v-model="question_border.show" @change="setBorder($event, 'question_border', '.question')">
	      		    				    Стилизовать границы
	      		    				</b-form-checkbox>
	      		    				<template v-if="question_border.show == true">
	      		    				    <div role="group" class="mb-4">
	      		    				        <label>Размер границы</label>
	      		    				        <b-input-group append="px">
	      		    				            <b-form-input type="number" v-model="question_border.size" @change="setBorder(true, 'question_border', '.question')"></b-form-input>
	      		    				        </b-input-group>
	      		    				    </div>
	      		    				    <div role="group">
	      		    				        <label>Стиль рамки</label>
	      		    				        <b-button-group class="d-flex mb-4">
	      		    				            <b-button style="width: 33.33%" 
	      		    				                      @click="question_border.type = 'solid'; setBorder(true, 'question_border', '.question')"
	      		    				                      variant="outline-secondary"
	      		    				                      :class="question_border.type == 'solid' ? 'active' : ''">
	      		    				                <img src="../../static/img/border_solid.png" width="40%" height="auto">
	      		    				            </b-button>
	      		    				            <b-button style="width: 33.33%"
	      		    				                      @click="question_border.type = 'dashed'; setBorder(true, 'question_border', '.question')"
	      		    				                      variant="outline-secondary"
	      		    				                      :class="question_border.type == 'dashed' ? 'active' : ''">
	      		    				                <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	      		    				            </b-button>
	      		    				            <b-button style="width: 33.34%"
	      		    				                      @click="question_border.type = 'dotted'; setBorder(true, 'question_border', '.question')"
	      		    				                      variant="outline-secondary"
	      		    				                      :class="question_border.type == 'dotted' ? 'active' : ''">
	      		    				                <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	      		    				            </b-button>
	      		    				        </b-button-group>
	      		    				    </div>
	      		    				    <div role="group" class="mb-4">
	      		    				        <label>Цвет рамки</label>
	      		    				        <b-input-group class="mb-4">
	      		    				            <b-input-group-prepend>
	      		    				                <b-btn variant="primary" id="exPopoverReactive-question-border">Выбрать цвет</b-btn>
	      		    				                <b-popover target="exPopoverReactive-question-border"
	      		    				                           triggers="click"
	      		    				                           placement="left">
			    				                        <sketch-picker v-model="question_border.color" @input="setBorder(true, 'question_border', '.question')" />
	      		    				                </b-popover>
	      		    				            </b-input-group-prepend>
	      		    				            <b-form-input v-model="question_border.color.hex" @input="setBorder(true, 'question_border', '.question')"></b-form-input>
	      		    				        </b-input-group>
	      		    				    </div>
	      		    				</template>
	      		    			  <label>Радиус скругления уголков</label>
	      		    			  <b-input-group append="px">
	      		    			      <b-form-input type="number" v-model="question_radius"></b-form-input>
	      		    			  </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Тени" class="pt-4 pb-2">
	      		    			<b-form-checkbox id="checkbox-question-shadow"
	      		    			               v-model="question_shadow.show" @change="setShadow($event, 'question_shadow', '.question')">
	      		    			    Включить тени
	      		    			</b-form-checkbox>
	      		    			<template v-if="question_shadow.show == true">
	      		    			  <div role="group" class="mt-3">
	      		    			    <label>Тени (сдвиг по x)</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="question_shadow.x" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Тени (сдвиг по y)</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="question_shadow.y" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Радиус размытия теней</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="question_shadow.blur" @change="setShadow(true, 'question_shadow', '.question')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Цвет тени</label>
	      		    			      <b-input-group class="mb-4">
	      		    			        <b-input-group-prepend>
	      		    			            <b-btn variant="primary" id="exPopoverReactive-question-shadow">Выбрать цвет</b-btn>
	      		    			            <b-popover target="exPopoverReactive-question-shadow"
	      		    			                       triggers="click"
	      		    			                       placement="left">
	      		    			                <sketch-picker v-model="question_shadow.color" @input="setShadow(true, 'question_shadow', '.question')" />
	      		    			            </b-popover>
	      		    			          </b-input-group-prepend>
	      		    			          <b-form-input @input="setShadow(true, 'question_shadow', '.question')" v-model="question_shadow.color.hex"></b-form-input>
	      		    			      </b-input-group>
	      		    			        <label>Прозрачность фона</label>
	      		    			    <div class="d-flex">
	      		    			        <div style="width: 60%">
	      		    			            <range-slider
	      		    			                class="slider_range"
	      		    			                min="0"
	      		    			                max="100"
	      		    			                v-model="question_shadow.opacity"
	      		    			                @input="setShadow(true, 'question_shadow', '.question')">
	      		    			            </range-slider>
	      		    			        </div>
	      		    			        <p class="ml-4 range_count" style="width: 40%">{{ question_shadow.opacity }}%</p>
	      		    			    </div>
	      		    			  </div>
	      		    			</template>
	      		    		</b-tab>
	      		    	</b-tabs> 
	      		    </b-tab>
	      		    <b-tab title="Ползунок" class="pt-3" active>
	      		    	<div role="group" class="mb-4">
	      		    	  <label>Цвет ползунка</label>
	      		    	    <b-input-group>
	      		    	      <b-input-group-prepend>
	      		    	          <b-btn variant="primary" id="exPopoverReactive-range-bg">Выбрать цвет</b-btn>
	      		    	          <b-popover target="exPopoverReactive-range-bg"
	      		    	                     triggers="click"
	      		    	                     placement="left">
	      		    	              <sketch-picker v-model="range_bg" />
	      		    	          </b-popover>
	      		    	        </b-input-group-prepend>
	      		    	        <b-form-input v-model="range_bg.hex"></b-form-input>
	      		    	    </b-input-group>
	      		    	</div>
	      		    	<div role="group" class="mb-4">
	      		    	  <b-form-checkbox id="checkbox-range-shadow" class="mb-3 d-block"
	      		    	                   v-model="range_shadow.show" @change="setShadow($event, 'range_shadow', '.range-positive')">
	      		    	    Включить тени
	      		    	  </b-form-checkbox>
	      		    	  <template v-if="range_shadow.show == true">
	      		    	    <label>Тени (сдвиг по x)</label>
	      		    	    <b-input-group append="px" class="mb-3">
	      		    	        <b-form-input type="number" v-model="range_shadow.x" @change="setShadow(true, 'range_shadow', '.range-positive')"></b-form-input>
	      		    	    </b-input-group>
	      		    	    <label>Тени (сдвиг по y)</label>
	      		    	    <b-input-group append="px" class="mb-3">
	      		    	        <b-form-input type="number" v-model="range_shadow.y" @change="setShadow(true, 'range_shadow', '.range-positive')"></b-form-input>
	      		    	    </b-input-group>
	      		    	    <label>Радиус размытия теней</label>
	      		    	    <b-input-group append="px" class="mb-3">
	      		    	        <b-form-input type="number" v-model="range_shadow.blur" @change="setShadow(true, 'range_shadow', '.range-positive')"></b-form-input>
	      		    	    </b-input-group>
	      		    	    <label>Цвет тени</label>
	      		    	      <b-input-group class="mb-4">
	      		    	        <b-input-group-prepend>
	      		    	            <b-btn variant="primary" id="exPopoverReactive-calendar-shadow">Выбрать цвет</b-btn>
	      		    	            <b-popover target="exPopoverReactive-calendar-shadow"
	      		    	                       triggers="click"
	      		    	                       placement="left">
	      		    	                <sketch-picker v-model="range_shadow.color" @input="setShadow(true, 'range_shadow', '.range-positive')" />
	      		    	            </b-popover>
	      		    	          </b-input-group-prepend>
	      		    	          <b-form-input @input="setShadow(true, 'range_shadow', '.range-positive')" v-model="range_shadow.color.hex"></b-form-input>
	      		    	      </b-input-group>
	      		    	      <label>Прозрачность фона</label>
	      		    	      <div class="d-flex">
	      		    	          <div style="width: 60%">
	      		    	              <range-slider
	      		    	                  class="slider_range"
	      		    	                  min="0"
	      		    	                  max="100"
	      		    	                  v-model="range_shadow.opacity"
	      		    	                  @input="setShadow(true, 'range_shadow', '.range-positive')">
	      		    	              </range-slider>
	      		    	          </div>
	      		    	          <p class="ml-3 range_count" style="width: 40%">{{ range_shadow.opacity }}%</p>
	      		    	      </div>
	      		    	  </template>
	      		    	</div>
	      		    	<div role="group">
	      		    	  <label>Цвет кружочка</label>
	      		    	    <b-input-group>
	      		    	      <b-input-group-prepend>
	      		    	          <b-btn variant="primary" id="exPopoverReactive-range-thumb">Выбрать цвет</b-btn>
	      		    	          <b-popover target="exPopoverReactive-range-thumb"
	      		    	                     triggers="click"
	      		    	                     placement="left">
	      		    	            <sketch-picker v-model="range_thumb" @input="rangeThumb()" />
	      		    	          </b-popover>
	      		    	        </b-input-group-prepend>
	      		    	        <b-form-input v-model="range_thumb.hex" @input="rangeThumb()"></b-form-input>
	      		    	    </b-input-group>
	      		    	</div>
	      		    </b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'gifts'">
	        		<b-tabs class="more_tabs">
	        			<b-tab title="Цвета" class="pt-4 pb-2">
	        				<div role="group" class="mb-3">
	        				  <label>Цвет фона</label>
	        				  <b-input-group class="mb-4">
	        				    <b-input-group-prepend>
	        				        <b-btn variant="primary" id="exPopoverReactive-gift-bg">Выбрать цвет</b-btn>
	        				        <b-popover target="exPopoverReactive-gift-bg"
	        				                   triggers="click"
	        				                   placement="left">
	        				          <sketch-picker v-model="gift_bg.color" @input="setBackground('gift_bg', '.quiz-gifts'); setBackground('gift_bg', '.gift-one')" />
	        				        </b-popover>
	        				      </b-input-group-prepend>
	        				      <b-form-input @input="setBackground('gift_bg', '.quiz-gifts'); setBackground('gift_bg', '.gift-one')" v-model="gift_bg.color.hex"></b-form-input>
	        				  </b-input-group>
	        				  <label>Прозрачность фона</label>
	        				  <div class="d-flex">
	        				      <div style="width: 60%">
	        				          <range-slider
	        				              class="slider_range"
	        				              min="0"
	        				              max="100"
	        				              v-model="gift_bg.opacity"
	        				              @input="setBackground('gift_bg', '.quiz-gifts'); setBackground('gift_bg', '.gift-one')">
	        				          </range-slider>
	        				      </div>
	        				      <p class="ml-3 range_count" style="width: 40%">{{ gift_bg.opacity }}%</p>
	        				  </div>
	        				</div>
	        				<div role="group">
	        				  <label>Цвет текста</label>
	        				    <b-input-group>
	        				      <b-input-group-prepend>
	        				          <b-btn variant="primary" id="exPopoverReactive-gift-color">Выбрать цвет</b-btn>
	        				          <b-popover target="exPopoverReactive-gift-color"
	        				                     triggers="click"
	        				                     placement="left">
	        				              <template slot="title">
	        				              <sketch-picker v-model="gift_color" />
	        				            </template>
	        				          </b-popover>
	        				        </b-input-group-prepend>
	        				        <b-form-input v-model="gift_color.hex"></b-form-input>
	        				    </b-input-group>
	        				</div>
	        			</b-tab>
	        			<b-tab title="Рамки" class="pt-4 pb-2">
	        				<div role="group" class="mb-3">
	        				  <b-form-checkbox id="checkbox-gift-border"
	        				                   v-model="gift_border.show" @change="setBorder($event, 'gift_border', '.quiz-gifts'); setBorder($event, 'gift_border', '.gift-one')">
	        				    Стилизовать границы
	        				  </b-form-checkbox>
	        				  <template v-if="gift_border.show == true">
	        				    <div role="group" class="mt-3 mb-4">
	        				      <label>Размер границы</label>
	        				      <b-input-group append="px">
	        				          <b-form-input type="number" v-model="gift_border.size" @change="setBorder(true, 'gift_border', '.quiz-gifts'); setBorder(true, 'gift_border', '.gift-one')"></b-form-input>
	        				      </b-input-group>
	        				    </div>
	        				    <div role="group">
	        				      <label>Стиль рамки</label>
	        				      <b-button-group class="d-flex mb-4">
	        				          <b-button style="width: 33.33%" 
	        				                @click="gift_border.type = 'solid'; setBorder(true, 'gift_border', '.quiz-gifts'); setBorder(true, 'gift_border', '.gift-one')"
	        				                variant="outline-secondary"
	        				                :class="gift_border.type == 'solid' ? 'active' : ''">
	        				            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        				        </b-button>
	        				          <b-button style="width: 33.33%"
	        				                @click="gift_border.type = 'dashed'; setBorder(true, 'gift_border', '.quiz-gifts'); setBorder(true, 'gift_border', '.gift-one')"
	        				                variant="outline-secondary"
	        				                :class="gift_border.type == 'dashed' ? 'active' : ''">
	        				            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        				        </b-button>
	        				          <b-button style="width: 33.34%"
	        				                @click="gift_border.type = 'dotted'; setBorder(true, 'gift_border', '.quiz-gifts'); setBorder(true, 'gift_border', '.gift-one')"
	        				                variant="outline-secondary"
	        				                :class="gift_border.type == 'dotted' ? 'active' : ''">
	        				            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        				        </b-button>
	        				      </b-button-group>
	        				    </div>
	        				    <div role="group" class="mb-4">
	        				      <label>Цвет рамки</label>
	        				        <b-input-group class="mb-4">
	        				          <b-input-group-prepend>
	        				              <b-btn variant="primary" id="exPopoverReactive-gift-border">Выбрать цвет</b-btn>
	        				              <b-popover target="exPopoverReactive-gift-border"
	        				                         triggers="click"
	        				                         placement="left">
	        				                <sketch-picker v-model="gift_border.color" @input="setBorder(true, 'gift_border', '.quiz-gifts'); setBorder(true, 'gift_border', '.gift-one')" />
	        				              </b-popover>
	        				            </b-input-group-prepend>
	        				            <b-form-input v-model="gift_border.color.hex" @input="setBorder(true, 'gift_border', '.quiz-gifts')"></b-form-input>
	        				        </b-input-group>
	        				    </div>
	        				  </template>
	        				</div>
	        				<div role="group">
	        				  <label>Радиус скругления уголков</label>
	        				  <b-input-group append="px">
	        				      <b-form-input type="number" v-model="gift_border.radius"></b-form-input>
	        				  </b-input-group>
	        				</div>
	        			</b-tab>
	        			<b-tab title="Тени" class="pt-4 pb-2">
	        				<div role="group">
	        				  <b-form-checkbox id="checkbox-gift-shadow" :class="gift_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
	        				                 v-model="gift_shadow.show" @change="setShadow($event, 'gift_shadow', '.quiz-gifts'); setShadow($event, 'gift_shadow', '.gift-one')">
	        				    Включить тени
	        				  </b-form-checkbox>
	        				  <template v-if="gift_shadow.show == true">
	        				    <label>Тени (сдвиг по x)</label>
	        				    <b-input-group append="px" class="mb-3">
	        				        <b-form-input type="number" v-model="gift_shadow.x" @change="setShadow(true, 'gift_shadow', '.quiz-gifts'); setShadow(true, 'gift_shadow', '.gift-one')"></b-form-input>
	        				    </b-input-group>
	        				    <label>Тени (сдвиг по y)</label>
	        				    <b-input-group append="px" class="mb-3">
	        				        <b-form-input type="number" v-model="gift_shadow.y" @change="setShadow(true, 'gift_shadow', '.quiz-gifts'); setShadow(true, 'gift_shadow', '.gift-one')"></b-form-input>
	        				    </b-input-group>
	        				    <label>Радиус размытия теней</label>
	        				    <b-input-group append="px" class="mb-3">
	        				        <b-form-input type="number" v-model="gift_shadow.blur" @change="setShadow(true, 'gift_shadow', '.quiz-gifts'); setShadow(true, 'gift_shadow', '.gift-one')"></b-form-input>
	        				    </b-input-group>
	        				    <label>Цвет тени</label>
	        				      <b-input-group class="mb-4">
	        				        <b-input-group-prepend>
	        				            <b-btn variant="primary" id="exPopoverReactive-gift-shadow">Выбрать цвет</b-btn>
	        				            <b-popover target="exPopoverReactive-gift-shadow"
	        				                       triggers="click"
	        				                       placement="left">
	        				              <sketch-picker v-model="gift_shadow.color" @input="setShadow(true, 'gift_shadow', '.quiz-gifts'); setShadow(true, 'gift_shadow', '.gift-one')" />
	        				            </b-popover>
	        				          </b-input-group-prepend>
	        				          <b-form-input @input="setShadow(true, 'gift_shadow', '.quiz-gifts'); setShadow(true, 'gift_shadow', '.gift-one')" v-model="gift_shadow.color.hex"></b-form-input>
	        				      </b-input-group>
	        				      <label>Прозрачность фона</label>
	        				      <div class="d-flex">
	        				          <div style="width: 60%">
	        				              <range-slider
	        				                  class="slider_range"
	        				                  min="0"
	        				                  max="100"
	        				                  v-model="gift_shadow.opacity"
	        				                  @input="setShadow(true, 'gift_shadow', '.quiz-gifts'); setShadow(true, 'gift_shadow', '.gift-one')">
	        				              </range-slider>
	        				          </div>
	        				          <p class="ml-3 range_count" style="width: 40%">{{ gift_shadow.opacity }}%</p>
	        				      </div>
	        				  </template>
	        				</div>
	        			</b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'result'">
	        		<b-tabs class="more_tabs">
	        			<b-tab title="Цвета" class="pt-4 pb-2">
	        				<div role="group" class="mb-3">
	        				  <label>Цвет фона</label>
	        				  <b-input-group class="mb-3">
	        				    <b-input-group-prepend>
	        				        <b-btn variant="primary" id="exPopoverReactive-result-bg">Выбрать цвет</b-btn>
	        				        <b-popover target="exPopoverReactive-result-bg"
	        				                   triggers="click"
	        				                   placement="left">
	        				            <template slot="title">
	        				            <sketch-picker v-model="result_bg.color" @input="setBackground('result_bg', '.results-header')" />
	        				          </template>
	        				        </b-popover>
	        				      </b-input-group-prepend>
	        				      <b-form-input @input="setBackground('result_bg', '.results-header')" v-model="result_bg.color.hex"></b-form-input>
	        				  </b-input-group>
	        				  <label>Прозрачность фона</label>
	        				  <div class="d-flex">
	        				    <div style="width: 60%">
	        				      <range-slider
	        				          class="slider_range"
	        				          min="0"
	        				          max="100"
	        				          v-model="result_bg.opacity"
	        				          @input="setBackground('result_bg', '.results-header')">
	        				      </range-slider>
	        				    </div>
	        				    <p class="ml-3 range_count" style="width: 40%">{{ result_bg.opacity }}%</p>
	        				  </div>
	        				</div>
	        				<div role="group">
	        				  <label>Цвет текста</label>
	        				    <b-input-group>
	        				      <b-input-group-prepend>
	        				          <b-btn variant="primary" id="exPopoverReactive-result-color">Выбрать цвет</b-btn>
	        				          <b-popover target="exPopoverReactive-result-color"
	        				                     triggers="click"
	        				                     placement="left">
	        				              <template slot="title">
	        				              <sketch-picker v-model="result_color" />
	        				            </template>
	        				          </b-popover>
	        				        </b-input-group-prepend>
	        				        <b-form-input v-model="result_color.hex"></b-form-input>
	        				    </b-input-group>
	        				</div>
	        			</b-tab>
	        			<b-tab title="Текст" class="pt-4 pb-2">
	        				<div role="group" class="mb-4">
	        				  <label>Размер шрифта</label>
	        				  <b-input-group append="px">
	        				      <b-form-input type="number" v-model="result_fz"></b-form-input>
	        				  </b-input-group>
	        				</div>
	        				<div role="group" class="mb-2">
	        				  <label>Горизонтальное выравнивание</label>
	        				  <b-form-select v-model="result_align" 
	        				           :options="result_align_select" />
	        				</div>
	        				<b-form-checkbox id="checkbox-result-header"
	        				                 v-model="result_display">
	        				    Скрыть плашку
	        				</b-form-checkbox>
	        			</b-tab>
	        			<b-tab title="Рамки" class="pt-4 pb-2">
	        				<div role="group">
	        				  <b-form-checkbox id="checkbox-result-border" class="mb-3"
	        				                   v-model="result_border.show" @change="setBorder($event, 'result_border', '.results-header')">
	        				      Стилизовать границы
	        				  </b-form-checkbox>
	        				  <template v-if="result_border.show == true">
	        				    <div role="group" class="mb-4">
	        				      <label>Размер границы</label>
	        				      <b-input-group append="px">
	        				          <b-form-input type="number" v-model="result_border.size" @change="setBorder(true, 'result_border', '.results-header')"></b-form-input>
	        				      </b-input-group>
	        				    </div>
	        				    <div role="group">
	        				      <label>Стиль рамки</label>
	        				      <b-button-group class="d-flex mb-4">
	        				          <b-button style="width: 33.33%" 
	        				                @click="result_border.type = 'solid'; setBorder(true, 'result_border', '.results-header')"
	        				                variant="outline-secondary"
	        				                :class="result_border.type == 'solid' ? 'active' : ''">
	        				            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        				        </b-button>
	        				          <b-button style="width: 33.33%"
	        				                @click="result_border.type = 'dashed'; setBorder(true, 'result_border', '.results-header')"
	        				                variant="outline-secondary"
	        				                :class="result_border.type == 'dashed' ? 'active' : ''">
	        				            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        				        </b-button>
	        				          <b-button style="width: 33.34%"
	        				                @click="result_border.type = 'dotted'; setBorder(true, 'result_border', '.results-header')"
	        				                variant="outline-secondary"
	        				                :class="result_border.type == 'dotted' ? 'active' : ''">
	        				            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        				        </b-button>
	        				      </b-button-group>
	        				    </div>
	        				    <div role="group" class="mb-4">
	        				      <label>Цвет рамки</label>
	        				        <b-input-group class="mb-4">
	        				          <b-input-group-prepend>
	        				              <b-btn variant="primary" id="exPopoverReactive-result-border">Выбрать цвет</b-btn>
	        				              <b-popover target="exPopoverReactive-result-border"
	        				                         triggers="click"
	        				                         placement="left">
	        				                  <template slot="title">
	        				                  <sketch-picker v-model="result_border.color" @input="setBorder(true, 'result_border', '.results-header')" />
	        				                </template>
	        				              </b-popover>
	        				            </b-input-group-prepend>
	        				            <b-form-input v-model="result_border.color.hex" @input="setBorder(true, 'result_border', '.results-header')"></b-form-input>
	        				        </b-input-group>
	        				    </div>
	        				  </template>
	        				</div>
	        				<div role="group">
	        				  <label>Скругление левого края</label>
	        				  <b-input-group append="px" class="mb-3">
	        				      <b-form-input type="number" v-model="result_border.left"></b-form-input>
	        				  </b-input-group>
	        				  <label>Скругление правого края</label>
	        				  <b-input-group append="px">
	        				      <b-form-input type="number" v-model="result_border.right"></b-form-input>
	        				  </b-input-group>
	        				</div>
	        			</b-tab>
	        			<b-tab title="Отступы" class="pt-4 pb-2">
	        				<div role="group">
	        				  <label>Внутренние отступы</label>
	        				  <b-input-group append="px">
	        				      <b-form-input type="number" v-model="result_padding"></b-form-input>
	        				  </b-input-group>
	        				</div>
	        			</b-tab>
	        			<b-tab title="Тени" class="pt-4 pb-2">
	        				<div role="group">
	        				  <b-form-checkbox id="checkbox-result-shadow" :class="result_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
	        				                 v-model="result_shadow.show" @change="setShadow($event, 'result_shadow', '.results-header')">
	        				    Включить тени
	        				  </b-form-checkbox>
	        				  <template v-if="result_shadow.show == true">
	        				    <label>Тени (сдвиг по x)</label>
	        				    <b-input-group append="px" class="mb-3">
	        				        <b-form-input type="number" v-model="result_shadow.x" @change="setShadow(true, 'result_shadow', '.results-header')"></b-form-input>
	        				    </b-input-group>
	        				    <label>Тени (сдвиг по y)</label>
	        				    <b-input-group append="px" class="mb-3">
	        				        <b-form-input type="number" v-model="result_shadow.y" @change="setShadow(true, 'result_shadow', '.results-header')"></b-form-input>
	        				    </b-input-group>
	        				    <label>Радиус размытия теней</label>
	        				    <b-input-group append="px" class="mb-3">
	        				        <b-form-input type="number" v-model="result_shadow.blur" @change="setShadow(true, 'result_shadow', '.results-header')"></b-form-input>
	        				    </b-input-group>
	        				    <label>Цвет тени</label>
	        				      <b-input-group class="mb-4">
	        				        <b-input-group-prepend>
	        				            <b-btn variant="primary" id="exPopoverReactive-result-shadow">Выбрать цвет</b-btn>
	        				            <b-popover target="exPopoverReactive-result-shadow"
	        				                       triggers="click"
	        				                       placement="left">
	        				              <sketch-picker v-model="result_shadow.color" @input="setShadow(true, 'result_shadow', '.results-header')" />
	        				            </b-popover>
	        				          </b-input-group-prepend>
	        				          <b-form-input @input="setShadow(true, 'result_shadow', '.results-header')" v-model="result_shadow.color.hex"></b-form-input>
	        				      </b-input-group>
	        				      <label>Прозрачность фона</label>
	        				      <div class="d-flex">
	        				        <div style="width: 60%">
	        				          <range-slider
	        				              class="slider_range"
	        				              min="0"
	        				              max="100"
	        				              v-model="result_shadow.opacity"
	        				              @input="setShadow(true, 'result_shadow', '.results-header')">
	        				          </range-slider>
	        				        </div>
	        				        <p class="ml-3 range_count" style="width: 40%">{{ result_shadow.opacity }}%</p>
	        				      </div>
	        				  </template>
	        				</div>
	        			</b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'gallery'">
	        		<b-tabs class="three_tabs">
	        			<b-tab title="Блок" class="pt-3">
	        				<b-tabs class="more_tabs">
	        					<b-tab title="Цвета" class="pt-4 pb-2">
	        						<div role="group" class="mb-3">
	        						  <label>Цвет фона</label>
	        						  <b-input-group class="mb-3">
	        						    <b-input-group-prepend>
	        						        <b-btn variant="primary" id="exPopoverReactive-info-bg">Выбрать цвет</b-btn>
	        						        <b-popover target="exPopoverReactive-info-bg"
	        						                   triggers="click"
	        						                   placement="left">
	        						          <sketch-picker v-model="info_bg.color" @input="setBackground('info_bg', '.home-item__info')" />
	        						        </b-popover>
	        						      </b-input-group-prepend>
	        						      <b-form-input @input="setBackground('info_bg', '.home-item__info')" v-model="info_bg.color.hex"></b-form-input>
	        						  </b-input-group>
	        						  <label>Прозрачность фона</label>
	        						  <div class="d-flex">
	        						    <div style="width: 60%">
	        						      <range-slider
	        						          class="slider_range"
	        						          min="0"
	        						          max="100"
	        						          v-model="info_bg.opacity"
	        						          @input="setBackground('info_bg', '.home-item__info')">
	        						      </range-slider>
	        						    </div>
	        						    <p class="ml-3 range_count" style="width: 40%">{{ info_bg.opacity }}%</p>
	        						  </div>
	        						</div>
	        						<div role="group">
	        						  <label>Цвет текста</label>
	        						    <b-input-group>
	        						    <b-input-group-prepend>
	        						        <b-btn variant="primary" id="exPopoverReactive-info-color">Выбрать цвет</b-btn>
	        						        <b-popover target="exPopoverReactive-info-color"
	        						                   triggers="click"
	        						                   placement="left">
	      						            <sketch-picker v-model="info_color" />
	        						        </b-popover>
	        						      </b-input-group-prepend>
	        						      <b-form-input v-model="info_color.hex"></b-form-input>
	        						  </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Рамки" class="pt-4 pb-2">
	        						<div role="group" class="mb-1">
	        						  <b-form-checkbox id="checkbox-info-border" class="mb-3"
	        						                   v-model="info_border.show" @change="setBorder($event, 'info_border', '.home-item__info')">
	        						      Стилизовать границы
	        						  </b-form-checkbox>
	        						  <template v-if="info_border.show == true">
	        						    <div role="group" class="mb-4">
	        						      <label>Размер границы</label>
	        						      <b-input-group append="px">
	        						          <b-form-input type="number" v-model="info_border.size" @change="setBorder(true, 'info_border', '.home-item__info')"></b-form-input>
	        						      </b-input-group>
	        						    </div>
	        						    <div role="group">
	        						      <label>Стиль рамки</label>
	        						      <b-button-group class="d-flex mb-4">
	        						          <b-button style="width: 33.33%" 
	        						                @click="info_border.type = 'solid'; setBorder(true, 'info_border', '.home-item__info')"
	        						                variant="outline-secondary"
	        						                :class="info_border.type == 'solid' ? 'active' : ''">
	        						            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        						        </b-button>
	        						          <b-button style="width: 33.33%"
	        						                @click="info_border.type = 'dashed'; setBorder(true, 'info_border', '.home-item__info')"
	        						                variant="outline-secondary"
	        						                :class="info_border.type == 'dashed' ? 'active' : ''">
	        						            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        						        </b-button>
	        						          <b-button style="width: 33.34%"
	        						                @click="info_border.type = 'dotted'; setBorder(true, 'info_border', '.home-item__info')"
	        						                variant="outline-secondary"
	        						                :class="info_border.type == 'dotted' ? 'active' : ''">
	        						            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        						        </b-button>
	        						      </b-button-group>
	        						    </div>
	        						    <div role="group" class="mb-4">
	        						      <label>Цвет рамки</label>
	        						        <b-input-group class="mb-4">
	        						          <b-input-group-prepend>
	        						              <b-btn variant="primary" id="exPopoverReactive-result-border">Выбрать цвет</b-btn>
	        						              <b-popover target="exPopoverReactive-result-border"
	        						                         triggers="click"
	        						                         placement="left">
	        						                  <sketch-picker v-model="info_border.color" @input="setBorder(true, 'info_border', '.home-item__info')" />
	        						              </b-popover>
	        						            </b-input-group-prepend>
	        						            <b-form-input v-model="info_border.color.hex" @input="setBorder(true, 'info_border', '.home-item__info')"></b-form-input>
	        						        </b-input-group>
	        						    </div>
	        						  </template>
	        						</div>
	        						<div role="group">
	        						  <label>Скругление верхних краёв</label>
	        						  <b-input-group append="px" class="mb-3">
	        						      <b-form-input type="number" v-model="info_border.top"></b-form-input>
	        						  </b-input-group>
	        						  <label>Скругление нижних краёв</label>
	        						  <b-input-group append="px">
	        						      <b-form-input type="number" v-model="info_border.bottom"></b-form-input>
	        						  </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Отступы" class="pt-4 pb-2">
	        						<div role="group">
	        						  <label>Отступ слева</label>
	        						  <b-input-group append="px">
	        						      <b-form-input type="number" v-model="info_padding_left"></b-form-input>
	        						  </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Тени" class="pt-4 pb-2">
	        						<div role="group">
	        						  <b-form-checkbox id="checkbox-info-shadow" :class="info_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
	        						                 v-model="info_shadow.show" @change="setShadow($event, 'info_shadow', '.slider')">
	        						    Включить тени
	        						  </b-form-checkbox>
	        						  <template v-if="info_shadow.show == true">
	        						    <label>Тени (сдвиг по x)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="info_shadow.x" @change="setShadow(true, 'info_shadow', '.slider')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Тени (сдвиг по y)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="info_shadow.y" @change="setShadow(true, 'info_shadow', '.slider')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Радиус размытия теней</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="info_shadow.blur" @change="setShadow(true, 'info_shadow', '.slider')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Цвет тени</label>
	        						      <b-input-group class="mb-4">
	        						        <b-input-group-prepend>
	        						            <b-btn variant="primary" id="exPopoverReactive-info-shadow">Выбрать цвет</b-btn>
	        						            <b-popover target="exPopoverReactive-info-shadow"
	        						                       triggers="click"
	        						                       placement="left">
	      						                <sketch-picker v-model="info_shadow.color" @input="setShadow(true, 'info_shadow', '.slider')" />
	        						            </b-popover>
	        						          </b-input-group-prepend>
	        						          <b-form-input @input="setShadow(true, 'info_shadow', '.slider')" v-model="info_shadow.color.hex"></b-form-input>
	        						      </b-input-group>
	        						      <label>Прозрачность фона</label>
	        						      <div class="d-flex">
	        						        <div style="width: 60%">
	        						          <range-slider
	        						              class="slider_range"
	        						              min="0"
	        						              max="100"
	        						              v-model="info_shadow.opacity"
	        						              @input="setShadow(true, 'info_shadow', '.slider')">
	        						          </range-slider>
	        						        </div>
	        						        <p class="ml-3 range_count" style="width: 40%">{{ info_shadow.opacity }}%</p>
	        						      </div>
	        						  </template>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Плашка" class="pt-4 pb-2">
	        						<b-form-checkbox id="checkbox-result-header"
	        						                 v-model="result_display">
	        						    Скрыть плашку
	        						</b-form-checkbox>
	        					</b-tab>
	        				</b-tabs>
	        			</b-tab>
	        			<b-tab title="Стрелки" class="pt-3">
	        				<b-tabs class="more_tabs">
	        					<b-tab title="Размер" class="pt-4 pb-2">
	        						<div role="group">
	        						  <label>Размер стрелочек</label>
	        						  <b-input-group append="px">
	        						      <b-form-input type="number" v-model="arrows_fz"></b-form-input>
	        						  </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Цвета" class="pt-4 pb-2">
	        						<div role="group" class="mb-3">
	        						  <label>Цвет фона</label>
	        						  <b-input-group class="mb-4">
	        						    <b-input-group-prepend>
	        						        <b-btn variant="primary" id="exPopoverReactive-arrows-bg">Выбрать цвет</b-btn>
	        						        <b-popover target="exPopoverReactive-arrows-bg"
	        						                   triggers="click"
	        						                   placement="left">
	        						          <sketch-picker v-model="arrows_bg.color" @input="setBackground('arrows_bg', '.slider-prev'); setBackground('arrows_bg', '.slider-next')" />
	        						        </b-popover>
	        						      </b-input-group-prepend>
	        						      <b-form-input @input="setBackground('arrows_bg', '.slider-prev'); setBackground('arrows_bg', '.slider-next')" v-model="arrows_bg.color.hex"></b-form-input>
	        						  </b-input-group>
	        						  <label>Прозрачность фона</label>
	        						  <div class="d-flex">
	        						    <div style="width: 60%">
	        						      <range-slider
	        						          class="slider_range"
	        						          min="0"
	        						          max="100"
	        						          v-model="arrows_bg.opacity"
	        						          @input="setBackground('arrows_bg', '.slider-prev'); setBackground('arrows_bg', '.slider-next')">
	        						      </range-slider>
	        						    </div>
	        						    <p class="ml-3 range_count" style="width: 40%">{{ arrows_bg.opacity }}%</p>
	        						  </div>
	        						</div>
	        						<div role="group">
	        						  <label>Цвет стрелочек</label>
	        						    <b-input-group>
	        						      <b-input-group-prepend>
	        						          <b-btn variant="primary" id="exPopoverReactive-arrows-color">Выбрать цвет</b-btn>
	        						          <b-popover target="exPopoverReactive-arrows-color"
	        						                     triggers="click"
	        						                     placement="left">
	        						              <sketch-picker v-model="arrows_color" />
	        						          </b-popover>
	        						        </b-input-group-prepend>
	        						        <b-form-input v-model="arrows_color.hex"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Рамки" class="pt-4 pb-2">
	        						<div role="group" class="mb-1">
	        						  <b-form-checkbox id="checkbox-arrows-border" class="mb-3"
	        						                   v-model="arrows_border.show" @change="setBorder($event, 'arrows_border', '.slider-prev'); setBorder($event, 'arrows_border', '.slider-next')">
	        						      Стилизовать границы
	        						  </b-form-checkbox>
	        						  <template v-if="arrows_border.show == true">
	        						    <div role="group" class="mb-4">
	        						      <label>Размер границы</label>
	        						      <b-input-group append="px">
	        						          <b-form-input type="number" v-model="arrows_border.size" @change="setBorder(true, 'arrows_border', '.slider-prev'); setBorder(true, 'arrows_border', '.slider-next')"></b-form-input>
	        						      </b-input-group>
	        						    </div>
	        						    <div role="group">
	        						      <label>Стиль рамки</label>
	        						      <b-button-group class="d-flex mb-4">
	        						          <b-button style="width: 33.33%" 
	        						                @click="arrows_border.type = 'solid'; setBorder(true, 'arrows_border', '.slider-prev'); setBorder(true, 'arrows_border', '.slider-next')"
	        						                variant="outline-secondary"
	        						                :class="arrows_border.type == 'solid' ? 'active' : ''">
	        						            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        						        </b-button>
	        						          <b-button style="width: 33.33%"
	        						                @click="arrows_border.type = 'dashed'; setBorder(true, 'arrows_border', '.slider-prev'); setBorder(true, 'arrows_border', '.slider-next')"
	        						                variant="outline-secondary"
	        						                :class="arrows_border.type == 'dashed' ? 'active' : ''">
	        						            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        						        </b-button>
	        						          <b-button style="width: 33.34%"
	        						                @click="arrows_border.type = 'dotted'; setBorder(true, 'arrows_border', '.slider-prev'); setBorder(true, 'arrows_border', '.slider-next')"
	        						                variant="outline-secondary"
	        						                :class="arrows_border.type == 'dotted' ? 'active' : ''">
	        						            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        						        </b-button>
	        						      </b-button-group>
	        						    </div>
	        						    <div role="group" class="mb-4">
	        						      <label>Цвет рамки</label>
	        						        <b-input-group class="mb-4">
	        						          <b-input-group-prepend>
	        						              <b-btn variant="primary" id="exPopoverReactive-arrows-border">Выбрать цвет</b-btn>
	        						              <b-popover target="exPopoverReactive-arrows-border"
	        						                         triggers="click"
	        						                         placement="left">
	        						                  <sketch-picker v-model="arrows_border.color" @input="setBorder(true, 'arrows_border', '.slider-prev'); setBorder(true, 'arrows_border', '.slider-next')" />
	        						              </b-popover>
	        						            </b-input-group-prepend>
	        						            <b-form-input v-model="arrows_border.color.hex" @input="setBorder(true, 'arrows_border', '.slider-prev'); setBorder(true, 'arrows_border', '.slider-next')"></b-form-input>
	        						        </b-input-group>
	        						    </div>
	        						  </template>
	        						</div>
	        						<div role="group">
	        						  <label>Радиус скругления уголков</label>
	        						  <b-input-group append="px">
	        						      <b-form-input type="number" v-model="arrows_border.radius"></b-form-input>
	        						  </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Тени" class="pt-4 pb-2">
	        						<div role="group">
	        						  <b-form-checkbox id="checkbox-arrows-shadow"
	        						                 v-model="arrows_shadow.show" @change="setShadow($event, 'arrows_shadow', '.slider-prev'); setShadow($event, 'arrows_shadow', '.slider-next')">
	        						    Включить тени
	        						  </b-form-checkbox>
	        						  <template v-if="arrows_shadow.show == true">
	        						    <label>Тени (сдвиг по x)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="arrows_shadow.x" @change="setShadow(true, 'arrows_shadow', '.slider-prev'); setShadow(true, 'arrows_shadow', '.slider-next')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Тени (сдвиг по y)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="arrows_shadow.y" @change="setShadow(true, 'arrows_shadow', '.slider-prev'); setShadow(true, 'arrows_shadow', '.slider-next')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Радиус размытия теней</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="arrows_shadow.blur" @change="setShadow(true, 'arrows_shadow', '.slider-prev'); setShadow(true, 'arrows_shadow', '.slider-next')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Цвет тени</label>
	        						      <b-input-group class="mb-4">
	        						        <b-input-group-prepend>
	        						            <b-btn variant="primary" id="exPopoverReactive-arrows-shadow">Выбрать цвет</b-btn>
	        						            <b-popover target="exPopoverReactive-arrows-shadow"
	        						                       triggers="click"
	        						                       placement="left">
	        						              <sketch-picker v-model="arrows_shadow.color" @input="setShadow(true, 'arrows_shadow', '.slider-prev'); setShadow(true, 'arrows_shadow', '.slider-next')" />
	        						            </b-popover>
	        						          </b-input-group-prepend>
	        						          <b-form-input @input="setShadow(true, 'arrows_shadow', '.slider-prev'); setShadow(true, 'arrows_shadow', '.slider-next')" v-model="arrows_shadow.color.hex"></b-form-input>
	        						      </b-input-group>
	        						      <label>Прозрачность фона</label>
	        						      <div class="d-flex">
	        						        <div style="width: 60%">
	        						          <range-slider
	        						              class="slider_range"
	        						              min="0"
	        						              max="100"
	        						              v-model="arrows_shadow.opacity"
	        						              @input="setShadow(true, 'arrows_shadow', '.slider-prev'); setShadow(true, 'arrows_shadow', '.slider-next')">
	        						          </range-slider>
	        						        </div>
	        						        <p class="ml-3 range_count" style="width: 40%">{{ arrows_shadow.opacity }}%</p>
	        						      </div>
	        						  </template>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Положение" class="pt-4 pb-2">
	        						<div role="group">
	        						  <label>Положение левой стрелки</label>
	        						  <b-input-group append="px" class="mb-3">
	        						      <b-form-input type="number" v-model="arrows_left"></b-form-input>
	        						  </b-input-group>
	        						  <label>Положение правой стрелки</label>
	        						  <b-input-group append="px" class="mb-3">
	        						      <b-form-input type="number" v-model="arrows_right"></b-form-input>
	        						  </b-input-group>
	        						  <label>Положение стрелок по вертикали</label>
	        						  <b-input-group append="px">
	        						      <b-form-input type="number" v-model="arrows_top"></b-form-input>
	        						  </b-input-group>
	        						</div>
	        					</b-tab>
	        				</b-tabs>
	        			</b-tab>
	        			<b-tab title="Подсказки" class="pt-3">
	        				<b-tabs class="four_tabs">
	        					<b-tab title="Общее" class="pt-4 pb-2">
	        						<div role="group" class="mb-4">
	        							<label>
	        								Переместить положение блока (по x)
	        							</label>
	        							<b-input-group append="px">
	        						    	<b-form-input type="number" v-model="qtip_left"></b-form-input>
	        							</b-input-group>
	        						</div>
	  									<div role="group">
	  										<label>
	  											Переместить положение блока (по y)
	  										</label>
	  										<b-input-group append="px">
	  									    	<b-form-input type="number" v-model="qtip_top"></b-form-input>
	  										</b-input-group>
	  									</div>
	        					</b-tab>
	        					<b-tab title="Картинка" class="pt-3">
	        						<b-tabs class="more_tabs">
	        							<b-tab title="Рамки" class="pt-4 pb-2">
	        								<div role="group">
	        								  <b-form-checkbox id="checkbox-tooltip-image-border" class="mb-3"
	        								                   v-model="tooltip_image_border.show" @change="setBorder($event, 'tooltip_image_border', '.tooltip-image')">
	        								      Стилизовать границы
	        								  </b-form-checkbox>
	        								  <template v-if="tooltip_image_border.show == true">
	        								    <div role="group" class="mb-4">
	        								      <label>Размер границы</label>
	        								      <b-input-group append="px">
	        								          <b-form-input type="number" v-model="tooltip_image_border.size" @change="setBorder(true, 'tooltip_image_border', '.tooltip-image')"></b-form-input>
	        								      </b-input-group>
	        								    </div>
	        								    <div role="group">
	        								      <label>Стиль рамки</label>
	        								      <b-button-group class="d-flex mb-4">
	        								          <b-button style="width: 33.33%" 
	        								                @click="tooltip_image_border.type = 'solid'; setBorder(true, 'tooltip_image_border', '.tooltip-image')"
	        								                variant="outline-secondary"
	        								                :class="tooltip_image_border.type == 'solid' ? 'active' : ''">
	        								            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        								        </b-button>
	        								          <b-button style="width: 33.33%"
	        								                @click="tooltip_image_border.type = 'dashed'; setBorder(true, 'tooltip_image_border', '.tooltip-image')"
	        								                variant="outline-secondary"
	        								                :class="tooltip_image_border.type == 'dashed' ? 'active' : ''">
	        								            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        								        </b-button>
	        								          <b-button style="width: 33.34%"
	        								                @click="tooltip_image_border.type = 'dotted'; setBorder(true, 'tooltip_image_border', '.tooltip-image')"
	        								                variant="outline-secondary"
	        								                :class="tooltip_image_border.type == 'dotted' ? 'active' : ''">
	        								            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        								        </b-button>
	        								      </b-button-group>
	        								    </div>
	        								    <div role="group" class="mb-3">
	        								      <label>Цвет рамки</label>
	        								        <b-input-group>
	        								          <b-input-group-prepend>
	        								              <b-btn variant="primary" id="exPopoverReactive-tooltip-image-border">Выбрать цвет</b-btn>
	        								              <b-popover target="exPopoverReactive-tooltip-image-border"
	        								                         triggers="click"
	        								                         placement="left">
	        								                  <sketch-picker v-model="tooltip_image_border.color" @input="setBorder(true, 'tooltip_image_border', '.tooltip-image')" />
	        								              </b-popover>
	        								            </b-input-group-prepend>
	        								            <b-form-input v-model="tooltip_image_border.color.hex" @input="setBorder(true, 'tooltip_image_border', '.tooltip-image')"></b-form-input>
	        								        </b-input-group>
	        								    </div>
	        								  </template>
	        								</div>
	        								<div role="group">
	        								  <label>Радиус скругления уголков</label>
	        								  <b-input-group append="px">
	        								      <b-form-input type="number" v-model="tooltip_image_border.radius"></b-form-input>
	        								  </b-input-group>
	        								</div>
	        							</b-tab>
	        							<b-tab title="Тени" class="pt-4 pb-2">
	        								<div role="group">
	        								  <b-form-checkbox id="checkbox-tooltip-image-shadow"
	        								                   v-model="tooltip_image_shadow.show" @change="setShadow($event, 'tooltip_image_shadow', '.tooltip-image')">
	        								    Включить тени
	        								  </b-form-checkbox>
	        								  <template v-if="tooltip_image_shadow.show == true">
	        								    <label class="d-block mt-3">Тени (сдвиг по x)</label>
	        								    <b-input-group append="px" class="mb-3">
	        								        <b-form-input type="number" v-model="tooltip_image_shadow.x" @change="setShadow(true, 'tooltip_image_shadow', '.tooltip-image')"></b-form-input>
	        								    </b-input-group>
	        								    <label>Тени (сдвиг по y)</label>
	        								    <b-input-group append="px" class="mb-3">
	        								        <b-form-input type="number" v-model="tooltip_image_shadow.y" @change="setShadow(true, 'tooltip_image_shadow', '.tooltip-image')"></b-form-input>
	        								    </b-input-group>
	        								    <label>Радиус размытия теней</label>
	        								    <b-input-group append="px" class="mb-3">
	        								        <b-form-input type="number" v-model="tooltip_image_shadow.blur" @change="setShadow(true, 'tooltip_image_shadow', '.tooltip-image')"></b-form-input>
	        								    </b-input-group>
	        								    <label>Цвет тени</label>
	        								      <b-input-group class="mb-4">
	        								        <b-input-group-prepend>
	        								            <b-btn variant="primary" id="exPopoverReactive-tooltip-image-shadow">Выбрать цвет</b-btn>
	        								            <b-popover target="exPopoverReactive-tooltip-image-shadow"
	        								                       triggers="click"
	        								                       placement="left">
	        								                <sketch-picker v-model="tooltip_image_shadow.color" @input="setShadow(true, 'tooltip_image_shadow', '.tooltip-image')" />
	        								            </b-popover>
	        								          </b-input-group-prepend>
	        								          <b-form-input @input="setShadow(true, 'tooltip_image_shadow', '.tooltip-image')" v-model="tooltip_image_shadow.color.hex"></b-form-input>
	        								      </b-input-group>
	        								      <label>Прозрачность фона</label>
	        								      <div class="d-flex">
	        								        <div style="width: 60%">
	        								          <range-slider
	        								              class="slider_range"
	        								              min="0"
	        								              max="100"
	        								              v-model="tooltip_image_shadow.opacity"
	        								              @input="setShadow(true, 'tooltip_image_shadow', '.tooltip-image')">
	        								          </range-slider>
	        								        </div>
	        								        <p class="ml-3 range_count" style="width: 40%">{{ tooltip_image_shadow.opacity }}%</p>
	        								      </div>
	        								  </template>
	        								</div>
	        							</b-tab>
	        							<b-tab title="Положение" class="pt-4 pb-2">
	        								<div role="group">
	        								  <label>Положение картинки</label>
	        								  <b-form-select v-model="tooltip_image_align" 
	        								           :options="tooltip_image_align_select" />
	        								</div>
	        							</b-tab>
	        						</b-tabs>
	        					</b-tab>
	        					<b-tab title="Заголовок" class="pt-3">
	        						<b-tabs class="more_tabs">
	        							<b-tab title="Цвета" class="pt-4 pb-2">
	        								<div role="group" class="mb-3">
	        								  <label>Цвет фона</label>
	        								  <b-input-group class="mb-4">
	        								    <b-input-group-prepend>
	        								        <b-btn variant="primary" id="exPopoverReactive-tooltip-title-bg">Выбрать цвет</b-btn>
	        								        <b-popover target="exPopoverReactive-tooltip-title-bg"
	        								                   triggers="click"
	        								                   placement="left">
	        								          <sketch-picker v-model="tooltip_title_bg.color" @input="setBackground('tooltip_title_bg', '.tooltip-title')" />
	        								        </b-popover>
	        								      </b-input-group-prepend>
	        								      <b-form-input @input="setBackground('tooltip_title_bg', '.tooltip-title')" v-model="tooltip_title_bg.color.hex"></b-form-input>
	        								  </b-input-group>
	        								  <label>Прозрачность фона</label>
	        								  <div class="d-flex">
	        								    <div style="width: 60%">
	        								      <range-slider
	        								          class="slider_range"
	        								          min="0"
	        								          max="100"
	        								          v-model="tooltip_title_bg.opacity"
	        								          @input="setBackground('tooltip_title_bg', '.tooltip-title')">
	        								      </range-slider>
	        								    </div>
	        								    <p class="ml-3 range_count" style="width: 40%">{{ tooltip_title_bg.opacity }}%</p>
	        								  </div>
	        								</div>
	        								<div role="group">
	        								  <label>Цвет текста</label>
	        								    <b-input-group>
	        								      <b-input-group-prepend>
	        								          <b-btn variant="primary" id="exPopoverReactive-tooltip-title-color">Выбрать цвет</b-btn>
	        								          <b-popover target="exPopoverReactive-tooltip-title-color"
	        								                     triggers="click"
	        								                     placement="left">
	        								            <sketch-picker v-model="tooltip_title_color" />
	        								          </b-popover>
	        								        </b-input-group-prepend>
	        								        <b-form-input v-model="tooltip_title_color.hex"></b-form-input>
	        								    </b-input-group>
	        								</div>
	        							</b-tab>
	        							<b-tab title="Рамки" class="pt-4 pb-2">
	        								<div role="group">
	        								  <label>Радиус скругления уголков</label>
	        								  <b-input-group append="px">
	        								      <b-form-input type="number" v-model="tooltip_title_radius"></b-form-input>
	        								  </b-input-group>
	        								</div>
	        							</b-tab>
	        							<b-tab title="Тени" class="pt-4 pb-2">
	        								<div role="group">
	        								  <b-form-checkbox id="checkbox-tooltip-title-shadow"
	        								                 v-model="tooltip_title_shadow.show" @change="setShadow($event, 'tooltip_title_shadow', '.tooltip-title')">
	        								    Включить тени
	        								  </b-form-checkbox>
	        								  <template v-if="tooltip_title_shadow.show == true">
	        								    <label class="mt-3 d-block">Тени (сдвиг по x)</label>
	        								    <b-input-group append="px" class="mb-3">
	        								        <b-form-input type="number" v-model="tooltip_title_shadow.x" @change="setShadow(true, 'tooltip_title_shadow', '.tooltip-title')"></b-form-input>
	        								    </b-input-group>
	        								    <label>Тени (сдвиг по y)</label>
	        								    <b-input-group append="px" class="mb-3">
	        								        <b-form-input type="number" v-model="tooltip_title_shadow.y" @change="setShadow(true, 'tooltip_title_shadow', '.tooltip-title')"></b-form-input>
	        								    </b-input-group>
	        								    <label>Радиус размытия теней</label>
	        								    <b-input-group append="px" class="mb-3">
	        								        <b-form-input type="number" v-model="tooltip_title_shadow.blur" @change="setShadow(true, 'tooltip_title_shadow', '.tooltip-title')"></b-form-input>
	        								    </b-input-group>
	        								    <label>Цвет тени</label>
	        								      <b-input-group class="mb-4">
	        								        <b-input-group-prepend>
	        								            <b-btn variant="primary" id="exPopoverReactive-tooltip-title-shadow">Выбрать цвет</b-btn>
	        								            <b-popover target="exPopoverReactive-tooltip-title-shadow"
	        								                       triggers="click"
	        								                       placement="left">
	        								              <sketch-picker v-model="tooltip_title_shadow.color" @input="setShadow(true, 'tooltip_title_shadow', '.tooltip-title')" />
	        								            </b-popover>
	        								          </b-input-group-prepend>
	        								          <b-form-input @input="setShadow(true, 'tooltip_title_shadow', '.tooltip-title')" v-model="tooltip_title_shadow.color.hex"></b-form-input>
	        								      </b-input-group>
	        								      <label>Прозрачность фона</label>
	        								      <div class="d-flex">
	        								        <div style="width: 60%">
	        								          <range-slider
	        								              class="slider_range"
	        								              min="0"
	        								              max="100"
	        								              v-model="tooltip_title_shadow.opacity"
	        								              @input="setShadow(true, 'tooltip_title_shadow', '.tooltip-title')">
	        								          </range-slider>
	        								        </div>
	        								        <p class="ml-3 range_count" style="width: 40%">{{ tooltip_title_shadow.opacity }}%</p>
	        								      </div>
	        								  </template>
	        								</div>
	        							</b-tab>
	        						</b-tabs>
	        					</b-tab>
	        					<b-tab title="Описание" class="pt-3">
	        						<b-tabs class="more_tabs">
	        							<b-tab title="Цвета" class="pt-4 pb-2">
	        								<div role="group" class="mb-3">
	        								  <label>Цвет фона</label>
	        								  <b-input-group class="mb-4">
	        								    <b-input-group-prepend>
	        								        <b-btn variant="primary" id="exPopoverReactive-tooltip-text-bg">Выбрать цвет</b-btn>
	        								        <b-popover target="exPopoverReactive-tooltip-text-bg"
	        								                   triggers="click"
	        								                   placement="left">
	        								          <sketch-picker v-model="tooltip_text_bg.color" @input="setBackground('tooltip_text_bg', '.tooltip-text')" />
	        								        </b-popover>
	        								      </b-input-group-prepend>
	        								      <b-form-input @input="setBackground('tooltip_text_bg', '.tooltip-text')" v-model="tooltip_text_bg.color.hex"></b-form-input>
	        								  </b-input-group>
	        								  <label>Прозрачность фона</label>
	        								  <div class="d-flex">
	        								    <div style="width: 60%">
	        								      <range-slider
	        								          class="slider_range"
	        								          min="0"
	        								          max="100"
	        								          v-model="tooltip_text_bg.opacity"
	        								          @input="setBackground('tooltip_text_bg', '.tooltip-text')">
	        								      </range-slider>
	        								    </div>
	        								    <p class="ml-3 range_count" style="width: 40%">{{ tooltip_text_bg.opacity }}%</p>
	        								  </div>
	        								</div>
	        								<div role="group">
	        								  <label>Цвет текста</label>
	        								    <b-input-group>
	        								      <b-input-group-prepend>
	        								          <b-btn variant="primary" id="exPopoverReactive-tooltip-text-color">Выбрать цвет</b-btn>
	        								          <b-popover target="exPopoverReactive-tooltip-text-color"
	        								                     triggers="click"
	        								                     placement="left">
	        								            <sketch-picker v-model="tooltip_text_color" />
	        								          </b-popover>
	        								        </b-input-group-prepend>
	        								        <b-form-input v-model="tooltip_text_color.hex"></b-form-input>
	        								    </b-input-group>
	        								</div>
	        							</b-tab>
	        							<b-tab title="Рамки" class="pt-4 pb-2">
	        								<div role="group">
	        								  <label>Радиус скругления уголков</label>
	        								  <b-input-group append="px">
	        								      <b-form-input type="number" v-model="tooltip_text_radius"></b-form-input>
	        								  </b-input-group>
	        								</div>
	        							</b-tab>
	        							<b-tab title="Тени" class="pt-4 pb-2">
													<div role="group">
													  <b-form-checkbox id="checkbox-tooltip-text-shadow"
													                 v-model="tooltip_text_shadow.show" @change="setShadow($event, 'tooltip_text_shadow', '.tooltip-text')">
													    Включить тени
													  </b-form-checkbox>
													  <template v-if="tooltip_text_shadow.show == true">
													    <label class="d-block mt-3">Тени (сдвиг по x)</label>
													    <b-input-group append="px" class="mb-3">
													        <b-form-input type="number" v-model="tooltip_text_shadow.x" @change="setShadow(true, 'tooltip_text_shadow', '.tooltip-text')"></b-form-input>
													    </b-input-group>
													    <label>Тени (сдвиг по y)</label>
													    <b-input-group append="px" class="mb-3">
													        <b-form-input type="number" v-model="tooltip_text_shadow.y" @change="setShadow(true, 'tooltip_text_shadow', '.tooltip-text')"></b-form-input>
													    </b-input-group>
													    <label>Радиус размытия теней</label>
													    <b-input-group append="px" class="mb-3">
													        <b-form-input type="number" v-model="tooltip_text_shadow.blur" @change="setShadow(true, 'tooltip_text_shadow', '.tooltip-text')"></b-form-input>
													    </b-input-group>
													    <label>Цвет тени</label>
													      <b-input-group class="mb-4">
													        <b-input-group-prepend>
													            <b-btn variant="primary" id="exPopoverReactive-tooltip-text-shadow">Выбрать цвет</b-btn>
													            <b-popover target="exPopoverReactive-tooltip-text-shadow"
													                       triggers="click"
													                       placement="left">
													                <sketch-picker v-model="tooltip_text_shadow.color" @input="setShadow(true, 'tooltip_text_shadow', '.tooltip-text')" />
													            </b-popover>
													          </b-input-group-prepend>
													          <b-form-input @input="setShadow(true, 'tooltip_text_shadow', '.tooltip-text')" v-model="tooltip_text_shadow.color.hex"></b-form-input>
													      </b-input-group>
													      <label>Прозрачность фона</label>
													      <div class="d-flex">
													        <div style="width: 60%">
													          <range-slider
													              class="slider_range"
													              min="0"
													              max="100"
													              v-model="tooltip_text_shadow.opacity"
													              @input="setShadow(true, 'tooltip_text_shadow', '.tooltip-text')">
													          </range-slider>
													        </div>
													        <p class="ml-3 range_count" style="width: 40%">{{ tooltip_text_shadow.opacity }}%</p>
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
	        	<template v-if="whichPopover == 'video'">
	      			<div role="group" class="mb-4">
	      				<label>Текст над видео</label>
	      				<b-form-input v-model="video_text_text"></b-form-input>
	      			</div>
	      			<div role="group" class="mb-4">
	      				<label>Начертание шрифта</label>
	      				<b-button-group class="d-flex mb-4">
	      				    <b-button style="width: 50%" 
	      				    		  @click="video_text_weight = 'normal'"
	      				    		  variant="outline-secondary"
	      				    		  :class="video_text_weight == 'normal' ? 'active' : ''">
	      				    	Нормальный
	      					</b-button>
	      				    <b-button style="width: 50%"
	      				    		  @click="video_text_weight = 'bold'"
	      				    		  variant="outline-secondary"
	      				    		  :class="video_text_weight == 'bold' ? 'active' : ''">
	      				    	Жирный
	      					</b-button>
	      				</b-button-group>
	      			</div>
							<div role="group" class="mb-4">
								<label>Размер шрифта</label>
								<b-input-group append="px">
							    	<b-form-input type="number" v-model="video_text_fz"></b-form-input>
								</b-input-group>
							</div>
							<div role="group">
								<label>Загрузить иконку</label>
								<b-form-file class="mb-2" @change="uploadIconVideo($event)" placeholder="Загрузить изображение..."></b-form-file>
								<b-form-checkbox id="checkbox-videp-image"
								                 v-model="video_image_display">
								    Скрыть иконку
								</b-form-checkbox>
							</div>
	        	</template>
	        	<template v-if="whichPopover == 'consultant-top'">
	        		<b-tabs>
	      		    <b-tab title="Общий блок" class="pt-3">
	      		    	<b-tabs class="more_tabs">
	      		    		<b-tab title="Цвета" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-3">
	      		    			  <label>Цвет фона</label>
	      		    			  <b-input-group class="mb-4">
	      		    			    <b-input-group-prepend>
	      		    			        <b-btn variant="primary" id="exPopoverReactive-consultant-bg">Выбрать цвет</b-btn>
	      		    			        <b-popover target="exPopoverReactive-consultant-bg"
	      		    			                   triggers="click"
	      		    			                   placement="left">
	      		    			          <sketch-picker v-model="consultant_bg.color" @input="setBackground('consultant_bg', '.consultant')" />
	      		    			        </b-popover>
	      		    			      </b-input-group-prepend>
	      		    			      <b-form-input @input="setBackground('consultant_bg', '.consultant')" v-model="consultant_bg.color.hex"></b-form-input>
	      		    			  </b-input-group>
	      		    			  <label>Прозрачность фона</label>
	      		    			  <div class="d-flex">
	      		    			    <div style="width: 60%">
	      		    			      <range-slider
	      		    			          class="slider_range"
	      		    			          min="0"
	      		    			          max="100"
	      		    			          v-model="consultant_bg.opacity"
	      		    			          @input="setBackground('consultant_bg', '.consultant')">
	      		    			      </range-slider>
	      		    			    </div>
	      		    			    <p class="ml-3 range_count" style="width: 40%">{{ consultant_bg.opacity }}%</p>
	      		    			  </div>
	      		    			</div>
	      		    			<div role="group">
	      		    			  <label>Цвет текста</label>
	      		    			    <b-input-group>
	      		    			      <b-input-group-prepend>
	      		    			        <b-btn variant="primary" id="exPopoverReactive-consultant-color">Выбрать цвет</b-btn>
	      		    			        <b-popover target="exPopoverReactive-consultant-color"
	      		    			                   triggers="click"
	      		    			                   placement="left">
	      		    			            <template slot="title">
	      		    			            <sketch-picker v-model="consultant_color" />
	      		    			          </template>
	      		    			        </b-popover>
	      		    			      </b-input-group-prepend>
	      		    			      <b-form-input v-model="consultant_color.hex"></b-form-input>
	      		    			    </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Рамки" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-3">
	      		    			  <b-form-checkbox id="checkbox-consultant-border" :class="consultant_border.show == true ? 'mb-3' : ''"
	      		    			                   v-model="consultant_border.show" @change="setBorder($event, 'consultant_border', '.consultant')">
	      		    			      Стилизовать границы
	      		    			  </b-form-checkbox>
	      		    			  <template v-if="consultant_border.show == true">
	      		    			    <div role="group" class="mb-4">
	      		    			      <label>Размер границы</label>
	      		    			      <b-input-group append="px">
	      		    			          <b-form-input type="number" v-model="consultant_border.size" @change="setBorder(true, 'consultant_border', '.consultant')"></b-form-input>
	      		    			      </b-input-group>
	      		    			    </div>
	      		    			    <div role="group">
	      		    			      <label>Стиль рамки</label>
	      		    			      <b-button-group class="d-flex mb-4">
	      		    			          <b-button style="width: 33.33%" 
	      		    			                @click="consultant_border.type = 'solid'; setBorder(true, 'consultant_border', '.consultant')"
	      		    			                variant="outline-secondary"
	      		    			                :class="consultant_border.type == 'solid' ? 'active' : ''">
	      		    			            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	      		    			        </b-button>
	      		    			          <b-button style="width: 33.33%"
	      		    			                @click="consultant_border.type = 'dashed'; setBorder(true, 'consultant_border', '.consultant')"
	      		    			                variant="outline-secondary"
	      		    			                :class="consultant_border.type == 'dashed' ? 'active' : ''">
	      		    			            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	      		    			        </b-button>
	      		    			          <b-button style="width: 33.34%"
	      		    			                @click="consultant_border.type = 'dotted'; setBorder(true, 'consultant_border', '.consultant')"
	      		    			                variant="outline-secondary"
	      		    			                :class="consultant_border.type == 'dotted' ? 'active' : ''">
	      		    			            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	      		    			        </b-button>
	      		    			      </b-button-group>
	      		    			    </div>
	      		    			    <div role="group" class="mb-4">
	      		    			      <label>Цвет рамки</label>
	      		    			        <b-input-group class="mb-4">
	      		    			          <b-input-group-prepend>
	      		    			              <b-btn variant="primary" id="exPopoverReactive-consultant-border">Выбрать цвет</b-btn>
	      		    			              <b-popover target="exPopoverReactive-consultant-border"
	      		    			                         triggers="click"
	      		    			                         placement="left">
	      		    			                <sketch-picker v-model="consultant_border.color" @input="setBorder(true, 'consultant_border', '.consultant')" />
	      		    			              </b-popover>
	      		    			            </b-input-group-prepend>
	      		    			            <b-form-input v-model="consultant_border.color.hex" @input="setBorder(true, 'consultant_border', '.consultant')"></b-form-input>
	      		    			        </b-input-group>
	      		    			    </div>
	      		    			  </template>
	      		    			</div>
	      		    			<div role="group">
	      		    			  <label>Скругление краёв</label>
	      		    			  <b-input-group append="px">
	      		    			      <b-form-input type="number" v-model="consultant_border.radius"></b-form-input>
	      		    			  </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Отступы" class="pt-4 pb-2">
	      		    			<div role="group">
	      		    			  <label>Внутринные отступы</label>
	      		    			  <b-form-input type="number" v-model="consultant_padding"></b-form-input>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Тени" class="pt-4 pb-2">
	      		    			<div role="group">
	      		    			  <b-form-checkbox id="checkbox-consultant-shadow" :class="consultant_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
	      		    			                 v-model="consultant_shadow.show" @change="setShadow($event, 'consultant_shadow', '.consultant')">
	      		    			    Включить тени
	      		    			  </b-form-checkbox>
	      		    			  <template v-if="consultant_shadow.show == true">
	      		    			    <label>Тени (сдвиг по x)</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="consultant_shadow.x" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Тени (сдвиг по y)</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="consultant_shadow.y" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Радиус размытия теней</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="consultant_shadow.blur" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Цвет тени</label>
	      		    			      <b-input-group class="mb-4">
	      		    			        <b-input-group-prepend>
	      		    			            <b-btn variant="primary" id="exPopoverReactive-info-shadow">Выбрать цвет</b-btn>
	      		    			            <b-popover target="exPopoverReactive-info-shadow"
	      		    			                       triggers="click"
	      		    			                       placement="left">
	      		    			              <sketch-picker v-model="consultant_shadow.color" @input="setShadow(true, 'consultant_shadow', '.consultant')" />
	      		    			            </b-popover>
	      		    			          </b-input-group-prepend>
	      		    			          <b-form-input @input="setShadow(true, 'consultant_shadow', '.consultant')" v-model="consultant_shadow.color.hex"></b-form-input>
	      		    			      </b-input-group>
	      		    			      <label>Прозрачность фона</label>
	      		    			      <div class="d-flex">
	      		    			        <div style="width: 60%">
	      		    			          <range-slider
	      		    			              class="slider_range"
	      		    			              min="0"
	      		    			              max="100"
	      		    			              v-model="consultant_shadow.opacity"
	      		    			              @input="setShadow(true, 'consultant_shadow', '.consultant')">
	      		    			          </range-slider>
	      		    			        </div>
	      		    			        <p class="ml-3 range_count" style="width: 40%">{{ consultant_shadow.opacity }}%</p>
	      		    			      </div>
	      		    			  </template>
	      		    			</div>
	      		    		</b-tab>
	      		    	</b-tabs>
	      		    </b-tab>
	      		    <b-tab title="Блок с консультантом" class="pt-3" active>
	      		    	<b-tabs>
	      		    		<b-tab title="Фото" class="pt-3">
	      		    			<b-tabs class="more_tabs">
	      		    				<b-tab title="Рамки" class="pt-4 pb-2">
	      		    					<div role="group">
	      		    					  <b-form-checkbox id="checkbox-consultant-image-border" :class="consultant_image_border.show == true ? 'mb-3' : ''"
	      		    					                   v-model="consultant_image_border.show" @change="setBorder($event, 'consultant_image_border', '.expert-img-img')">
	      		    					      Стилизовать границы
	      		    					  </b-form-checkbox>
	      		    					  <template v-if="consultant_image_border.show == true">
	      		    					    <div role="group" class="mb-4">
	      		    					      <label>Размер границы</label>
	      		    					      <b-input-group append="px">
	      		    					          <b-form-input type="number" v-model="consultant_image_border.size" @change="setBorder(true, 'consultant_image_border', '.expert-img-img')"></b-form-input>
	      		    					      </b-input-group>
	      		    					    </div>
	      		    					    <div role="group">
	      		    					      <label>Стиль рамки</label>
	      		    					      <b-button-group class="d-flex mb-4">
	      		    					          <b-button style="width: 33.33%" 
	      		    					                @click="consultant_image_border.type = 'solid'; setBorder(true, 'consultant_image_border', '.expert-img-img')"
	      		    					                variant="outline-secondary"
	      		    					                :class="consultant_image_border.type == 'solid' ? 'active' : ''">
	      		    					            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	      		    					        </b-button>
	      		    					          <b-button style="width: 33.33%"
	      		    					                @click="consultant_image_border.type = 'dashed'; setBorder(true, 'consultant_image_border', '.expert-img-img')"
	      		    					                variant="outline-secondary"
	      		    					                :class="consultant_image_border.type == 'dashed' ? 'active' : ''">
	      		    					            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	      		    					        </b-button>
	      		    					          <b-button style="width: 33.34%"
	      		    					                @click="consultant_image_border.type = 'dotted'; setBorder(true, 'consultant_image_border', '.expert-img-img')"
	      		    					                variant="outline-secondary"
	      		    					                :class="consultant_image_border.type == 'dotted' ? 'active' : ''">
	      		    					            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	      		    					        </b-button>
	      		    					      </b-button-group>
	      		    					    </div>
	      		    					    <div role="group">
	      		    					      <label>Цвет рамки</label>
	      		    					        <b-input-group>
	      		    					          <b-input-group-prepend>
	      		    					              <b-btn variant="primary" id="exPopoverReactive-consultant-image-border">Выбрать цвет</b-btn>
	      		    					              <b-popover target="exPopoverReactive-consultant-image-border"
	      		    					                         triggers="click"
	      		    					                         placement="left">
	      		    					                <sketch-picker v-model="consultant_image_border.color" @input="setBorder(true, 'consultant_image_border', '.expert-img-img')" />
	      		    					              </b-popover>
	      		    					            </b-input-group-prepend>
	      		    					            <b-form-input v-model="consultant_image_border.color.hex" @input="setBorder(true, 'consultant_image_border', '.expert-img-img')"></b-form-input>
	      		    					        </b-input-group>
	      		    					    </div>
	      		    					  </template>
	      		    					</div>
	      		    				</b-tab>
	      		    				<b-tab title="Тени" class="pt-4 pb-2">
	      		    					<div role="group">
	      		    					  <b-form-checkbox id="checkbox-consultant-image-shadow" :class="consultant_image_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
	      		    					                 v-model="consultant_image_shadow.show" @change="setShadow($event, 'consultant_image_shadow', '.expert-img-img')">
	      		    					    Включить тени
	      		    					  </b-form-checkbox>
	      		    					  <template v-if="consultant_image_shadow.show == true">
	      		    					    <label>Тени (сдвиг по x)</label>
	      		    					    <b-input-group append="px" class="mb-3">
	      		    					        <b-form-input type="number" v-model="consultant_image_shadow.x" @change="setShadow(true, 'consultant_image_shadow', '.expert-img-img')"></b-form-input>
	      		    					    </b-input-group>
	      		    					    <label>Тени (сдвиг по y)</label>
	      		    					    <b-input-group append="px" class="mb-3">
	      		    					        <b-form-input type="number" v-model="consultant_image_shadow.y" @change="setShadow(true, 'consultant_image_shadow', '.expert-img-img')"></b-form-input>
	      		    					    </b-input-group>
	      		    					    <label>Радиус размытия теней</label>
	      		    					    <b-input-group append="px" class="mb-3">
	      		    					        <b-form-input type="number" v-model="consultant_image_shadow.blur" @change="setShadow(true, 'consultant_image_shadow', '.expert-img-img')"></b-form-input>
	      		    					    </b-input-group>
	      		    					    <label>Цвет тени</label>
	      		    					      <b-input-group class="mb-4">
	      		    					        <b-input-group-prepend>
	      		    					            <b-btn variant="primary" id="exPopoverReactive-consultant-image-shadow">Выбрать цвет</b-btn>
	      		    					            <b-popover target="exPopoverReactive-consultant-image-shadow"
	      		    					                       triggers="click"
	      		    					                       placement="left">
	      		    					                <template slot="title">
	      		    					                <sketch-picker v-model="consultant_image_shadow.color" @input="setShadow(true, 'consultant_image_shadow', '.expert-img-img')" />
	      		    					              </template>
	      		    					            </b-popover>
	      		    					          </b-input-group-prepend>
	      		    					          <b-form-input @input="setShadow(true, 'consultant_image_shadow', '.expert-img-img')" v-model="consultant_image_shadow.color.hex"></b-form-input>
	      		    					      </b-input-group>
	      		    					      <label>Прозрачность фона</label>
	      		    					      <div class="d-flex">
	      		    					        <div style="width: 60%">
	      		    					          <range-slider
	      		    					              class="slider_range"
	      		    					              min="0"
	      		    					              max="100"
	      		    					              v-model="consultant_image_shadow.opacity"
	      		    					              @input="setShadow(true, 'consultant_image_shadow', '.expert-img-img')">
	      		    					          </range-slider>
	      		    					        </div>
	      		    					        <p class="ml-3 range_count" style="width: 40%">{{ consultant_image_shadow.opacity }}%</p>
	      		    					      </div>
	      		    					  </template>
	      		    					</div>
	      		    				</b-tab>
	      		    			</b-tabs>
	      		    		</b-tab>
	      		    		<b-tab title="Инициалы" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-4">
	      		    				<label>Размер текста с именем</label>
	      		    				<b-form-input type="number" v-model="consultant_top_name_fz"></b-form-input>
	      		    			</div>
	      		    			<div role="group" class="mb-4">
	      		    				<label>Размер текста с должностью</label>
	      		    				<b-form-input type="number" v-model="consultant_top_position_fz"></b-form-input>
	      		    			</div>
	      		    			<div role="group">
	      		    				<label>Верхний отступ</label>
	      		    				<b-form-input type="number" v-model="consultant_top_padding"></b-form-input>
	      		    			</div>
	      		    		</b-tab>
	      		    	</b-tabs>
	      		    </b-tab>
	      		  </b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'consultant-words'">
	        		<b-tabs>
	      		    <b-tab title="Общий блок" class="pt-3">
	      		    	<b-tabs class="more_tabs">
	      		    		<b-tab title="Цвета" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-3">
	      		    			  <label>Цвет фона</label>
	      		    			  <b-input-group class="mb-4">
	      		    			    <b-input-group-prepend>
	      		    			        <b-btn variant="primary" id="exPopoverReactive-consultant-bg">Выбрать цвет</b-btn>
	      		    			        <b-popover target="exPopoverReactive-consultant-bg"
	      		    			                   triggers="click"
	      		    			                   placement="left">
	      		    			          <sketch-picker v-model="consultant_bg.color" @input="setBackground('consultant_bg', '.consultant')" />
	      		    			        </b-popover>
	      		    			      </b-input-group-prepend>
	      		    			      <b-form-input @input="setBackground('consultant_bg', '.consultant')" v-model="consultant_bg.color.hex"></b-form-input>
	      		    			  </b-input-group>
	      		    			  <label>Прозрачность фона</label>
	      		    			  <div class="d-flex">
	      		    			    <div style="width: 60%">
	      		    			      <range-slider
	      		    			          class="slider_range"
	      		    			          min="0"
	      		    			          max="100"
	      		    			          v-model="consultant_bg.opacity"
	      		    			          @input="setBackground('consultant_bg', '.consultant')">
	      		    			      </range-slider>
	      		    			    </div>
	      		    			    <p class="ml-3 range_count" style="width: 40%">{{ consultant_bg.opacity }}%</p>
	      		    			  </div>
	      		    			</div>
	      		    			<div role="group">
	      		    			  <label>Цвет текста</label>
	      		    			    <b-input-group>
	      		    			      <b-input-group-prepend>
	      		    			        <b-btn variant="primary" id="exPopoverReactive-consultant-color">Выбрать цвет</b-btn>
	      		    			        <b-popover target="exPopoverReactive-consultant-color"
	      		    			                   triggers="click"
	      		    			                   placement="left">
	      		    			            <template slot="title">
	      		    			            <sketch-picker v-model="consultant_color" />
	      		    			          </template>
	      		    			        </b-popover>
	      		    			      </b-input-group-prepend>
	      		    			      <b-form-input v-model="consultant_color.hex"></b-form-input>
	      		    			    </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Рамки" class="pt-4 pb-2">
	      		    			<div role="group" class="mb-3">
	      		    			  <b-form-checkbox id="checkbox-consultant-border" :class="consultant_border.show == true ? 'mb-3' : ''"
	      		    			                   v-model="consultant_border.show" @change="setBorder($event, 'consultant_border', '.consultant')">
	      		    			      Стилизовать границы
	      		    			  </b-form-checkbox>
	      		    			  <template v-if="consultant_border.show == true">
	      		    			    <div role="group" class="mb-4">
	      		    			      <label>Размер границы</label>
	      		    			      <b-input-group append="px">
	      		    			          <b-form-input type="number" v-model="consultant_border.size" @change="setBorder(true, 'consultant_border', '.consultant')"></b-form-input>
	      		    			      </b-input-group>
	      		    			    </div>
	      		    			    <div role="group">
	      		    			      <label>Стиль рамки</label>
	      		    			      <b-button-group class="d-flex mb-4">
	      		    			          <b-button style="width: 33.33%" 
	      		    			                @click="consultant_border.type = 'solid'; setBorder(true, 'consultant_border', '.consultant')"
	      		    			                variant="outline-secondary"
	      		    			                :class="consultant_border.type == 'solid' ? 'active' : ''">
	      		    			            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	      		    			        </b-button>
	      		    			          <b-button style="width: 33.33%"
	      		    			                @click="consultant_border.type = 'dashed'; setBorder(true, 'consultant_border', '.consultant')"
	      		    			                variant="outline-secondary"
	      		    			                :class="consultant_border.type == 'dashed' ? 'active' : ''">
	      		    			            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	      		    			        </b-button>
	      		    			          <b-button style="width: 33.34%"
	      		    			                @click="consultant_border.type = 'dotted'; setBorder(true, 'consultant_border', '.consultant')"
	      		    			                variant="outline-secondary"
	      		    			                :class="consultant_border.type == 'dotted' ? 'active' : ''">
	      		    			            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	      		    			        </b-button>
	      		    			      </b-button-group>
	      		    			    </div>
	      		    			    <div role="group" class="mb-4">
	      		    			      <label>Цвет рамки</label>
	      		    			        <b-input-group class="mb-4">
	      		    			          <b-input-group-prepend>
	      		    			              <b-btn variant="primary" id="exPopoverReactive-consultant-border">Выбрать цвет</b-btn>
	      		    			              <b-popover target="exPopoverReactive-consultant-border"
	      		    			                         triggers="click"
	      		    			                         placement="left">
	      		    			                <sketch-picker v-model="consultant_border.color" @input="setBorder(true, 'consultant_border', '.consultant')" />
	      		    			              </b-popover>
	      		    			            </b-input-group-prepend>
	      		    			            <b-form-input v-model="consultant_border.color.hex" @input="setBorder(true, 'consultant_border', '.consultant')"></b-form-input>
	      		    			        </b-input-group>
	      		    			    </div>
	      		    			  </template>
	      		    			</div>
	      		    			<div role="group">
	      		    			  <label>Скругление краёв</label>
	      		    			  <b-input-group append="px">
	      		    			      <b-form-input type="number" v-model="consultant_border.radius"></b-form-input>
	      		    			  </b-input-group>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Отступы" class="pt-4 pb-2">
	      		    			<div role="group">
	      		    			  <label>Внутринные отступы</label>
	      		    			  <b-form-input type="number" v-model="consultant_padding"></b-form-input>
	      		    			</div>
	      		    		</b-tab>
	      		    		<b-tab title="Тени" class="pt-4 pb-2">
	      		    			<div role="group">
	      		    			  <b-form-checkbox id="checkbox-consultant-shadow" :class="consultant_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
	      		    			                 v-model="consultant_shadow.show" @change="setShadow($event, 'consultant_shadow', '.consultant')">
	      		    			    Включить тени
	      		    			  </b-form-checkbox>
	      		    			  <template v-if="consultant_shadow.show == true">
	      		    			    <label>Тени (сдвиг по x)</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="consultant_shadow.x" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Тени (сдвиг по y)</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="consultant_shadow.y" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Радиус размытия теней</label>
	      		    			    <b-input-group append="px" class="mb-3">
	      		    			        <b-form-input type="number" v-model="consultant_shadow.blur" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	      		    			    </b-input-group>
	      		    			    <label>Цвет тени</label>
	      		    			      <b-input-group class="mb-4">
	      		    			        <b-input-group-prepend>
	      		    			            <b-btn variant="primary" id="exPopoverReactive-info-shadow">Выбрать цвет</b-btn>
	      		    			            <b-popover target="exPopoverReactive-info-shadow"
	      		    			                       triggers="click"
	      		    			                       placement="left">
	      		    			              <sketch-picker v-model="consultant_shadow.color" @input="setShadow(true, 'consultant_shadow', '.consultant')" />
	      		    			            </b-popover>
	      		    			          </b-input-group-prepend>
	      		    			          <b-form-input @input="setShadow(true, 'consultant_shadow', '.consultant')" v-model="consultant_shadow.color.hex"></b-form-input>
	      		    			      </b-input-group>
	      		    			      <label>Прозрачность фона</label>
	      		    			      <div class="d-flex">
	      		    			        <div style="width: 60%">
	      		    			          <range-slider
	      		    			              class="slider_range"
	      		    			              min="0"
	      		    			              max="100"
	      		    			              v-model="consultant_shadow.opacity"
	      		    			              @input="setShadow(true, 'consultant_shadow', '.consultant')">
	      		    			          </range-slider>
	      		    			        </div>
	      		    			        <p class="ml-3 range_count" style="width: 40%">{{ consultant_shadow.opacity }}%</p>
	      		    			      </div>
	      		    			  </template>
	      		    			</div>
	      		    		</b-tab>
	      		    	</b-tabs>
	      		    </b-tab>
	      		    <b-tab title="Комментарий" class="pt-3" active>
	      		    	<b-tabs class="more_tabs">
	      		    		<b-tab title="Цвета" class="pt-4 pb-2">
					    				<div role="group" class="mb-3">
												<label>Цвет фона</label>
									    	<b-input-group class="mb-4">
									    		<b-input-group-prepend>
									    		    <b-btn variant="primary" id="exPopoverReactive-consultant-words-bg">Выбрать цвет</b-btn>
									    		    <b-popover target="exPopoverReactive-consultant-words-bg"
									    		               triggers="click"
									    		               placement="left">
									    		      	<template slot="title">
									    		    		<sketch-picker v-model="consultant_words_bg.color" @input="setBackground('consultant_words_bg', '.expert-says')" />
									    		    	</template>
									    		    </b-popover>
								    		    </b-input-group-prepend>
									    	    <b-form-input @input="setBackground('consultant_words_bg', '.expert-says')" v-model="consultant_words_bg.color.hex"></b-form-input>
									    	</b-input-group>
									    	<label>Прозрачность фона</label>
												<div class="d-flex">
												  <div style="width: 60%">
												    <range-slider
												        class="slider_range"
												        min="0"
												        max="100"
												        v-model="consultant_words_bg.opacity"
												        @input="setBackground('consultant_words_bg', '.expert-says')">
												    </range-slider>
												  </div>
												  <p class="ml-3 range_count" style="width: 40%">{{ consultant_words_bg.opacity }}%</p>
												</div>
					    				</div>
			    						<div role="group">
			    							<label>Цвет текста</label>
			    					    	<b-input-group>
			    					    		<b-input-group-prepend>
			    					    		    <b-btn variant="primary" id="exPopoverReactive-consultant-words-color">Выбрать цвет</b-btn>
			    					    		    <b-popover target="exPopoverReactive-consultant-words-color"
			    					    		               triggers="click"
			    					    		               placement="left">
			    					    		      	<template slot="title">
			    					    		    		<sketch-picker v-model="consultant_words_color" />
			    					    		    	</template>
			    					    		    </b-popover>
			    				    		    </b-input-group-prepend>
			    					    	    <b-form-input v-model="consultant_words_color.hex"></b-form-input>
			    					    	</b-input-group>
			    						</div>
	      		    		</b-tab>
	      		    		<b-tab title="Рамки" class="pt-4 pb-2">
	  									<div role="group" class="mb-4">
	  			    	    		<b-form-checkbox id="checkbox-consultant-words-border" :class="consultant_words_border.show == true ? 'mb-3' : ''"
	  			    	    		                 v-model="consultant_words_border.show" @change="setBorder($event, 'consultant_words_border', '.expert-says')">
	  			    		      		Стилизовать границы
	  				    		    </b-form-checkbox>
	  										<template v-if="consultant_words_border.show == true">
	  											<div role="group" class="mb-4">
	  												<label>Размер границы</label>
	  												<b-input-group append="px">
	  											    	<b-form-input type="number" v-model="consultant_words_border.size" @change="setBorder(true, 'consultant_words_border', '.expert-says')"></b-form-input>
	  												</b-input-group>
	  											</div>
	  											<div role="group">
	  												<label>Стиль рамки</label>
	  												<b-button-group class="d-flex mb-4">
	  												    <b-button style="width: 33.33%" 
	  												    		  @click="consultant_words_border.type = 'solid'; setBorder(true, 'consultant_words_border', '.expert-says')"
	  												    		  variant="outline-secondary"
	  												    		  :class="consultant_words_border.type == 'solid' ? 'active' : ''">
	  												    	<img src="../../static/img/border_solid.png" width="40%" height="auto">
	  													</b-button>
	  												    <b-button style="width: 33.33%"
	  												    		  @click="consultant_words_border.type = 'dashed'; setBorder(true, 'consultant_words_border', '.expert-says')"
	  												    		  variant="outline-secondary"
	  												    		  :class="consultant_words_border.type == 'dashed' ? 'active' : ''">
	  												    	<img src="../../static/img/border_dashed.png" width="40%" height="auto">
	  													</b-button>
	  												    <b-button style="width: 33.34%"
	  												    		  @click="consultant_words_border.type = 'dotted'; setBorder(true, 'consultant_words_border', '.expert-says')"
	  												    		  variant="outline-secondary"
	  												    		  :class="consultant_words_border.type == 'dotted' ? 'active' : ''">
	  												    	<img src="../../static/img/border_dotted.png" width="40%" height="auto">
	  													</b-button>
	  												</b-button-group>
	  											</div>
	  											<div role="group" class="mb-4">
	  												<label>Цвет рамки</label>
	  										    	<b-input-group class="mb-4">
	  										    		<b-input-group-prepend>
	  										    		    <b-btn variant="primary" id="exPopoverReactive-consultant-words-border">Выбрать цвет</b-btn>
	  										    		    <b-popover target="exPopoverReactive-consultant-words-border"
	  										    		               triggers="click"
	  										    		               placement="left">
	  									    		    		<sketch-picker v-model="consultant_words_border.color" @input="setBorder(true, 'consultant_words_border', '.expert-says')" />
	  										    		    </b-popover>
	  									    		    </b-input-group-prepend>
	  										    	    <b-form-input v-model="consultant_words_border.color.hex" @input="setBorder(true, 'consultant_words_border', '.expert-says')"></b-form-input>
	  										    	</b-input-group>
	  											</div>
	  										</template>
	  									</div>
			    						<div role="group">
			    							<label>Скругление краёв</label>
												<b-input-group append="px">
											    	<b-form-input type="number" v-model="consultant_words_border.radius"></b-form-input>
												</b-input-group>
			    						</div>
	      		    		</b-tab>
	      		    		<b-tab title="Тени" class="pt-4 pb-2">
		      						<div role="group">
							    			<b-form-checkbox id="checkbox-consultant-words-shadow" :class="consultant_words_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
							    		                 v-model="consultant_words_shadow.show" @change="setShadow($event, 'consultant_words_shadow', '.expert-says')">
								      		Включить тени
						    		    </b-form-checkbox>
						    		    <template v-if="consultant_words_shadow.show == true">
													<label>Тени (сдвиг по x)</label>
													<b-input-group append="px" class="mb-3">
												    	<b-form-input type="number" v-model="consultant_words_shadow.x" @change="setShadow(true, 'consultant_words_shadow', '.expert-says')"></b-form-input>
													</b-input-group>
													<label>Тени (сдвиг по y)</label>
													<b-input-group append="px" class="mb-3">
												    	<b-form-input type="number" v-model="consultant_words_shadow.y" @change="setShadow(true, 'consultant_words_shadow', '.expert-says')"></b-form-input>
													</b-input-group>
													<label>Радиус размытия теней</label>
													<b-input-group append="px" class="mb-3">
												    	<b-form-input type="number" v-model="consultant_words_shadow.blur" @change="setShadow(true, 'consultant_words_shadow', '.expert-says')"></b-form-input>
													</b-input-group>
													<label>Цвет тени</label>
											    	<b-input-group class="mb-4">
											    		<b-input-group-prepend>
											    		    <b-btn variant="primary" id="exPopoverReactive-consultant-words-shadow">Выбрать цвет</b-btn>
											    		    <b-popover target="exPopoverReactive-consultant-words-shadow"
											    		               triggers="click"
											    		               placement="left">
											    		      	<template slot="title">
											    		    		<sketch-picker v-model="consultant_words_shadow.color" @input="setShadow(true, 'consultant_words_shadow', '.expert-says')" />
											    		    	</template>
											    		    </b-popover>
										    		    </b-input-group-prepend>
											    	    <b-form-input @input="setShadow(true, 'consultant_words_shadow', '.expert-says')" v-model="consultant_words_shadow.color.hex"></b-form-input>
											    	</b-input-group>
											    	<label>Прозрачность фона</label>
														<div class="d-flex">
														  <div style="width: 60%">
														    <range-slider
														        class="slider_range"
														        min="0"
														        max="100"
														        v-model="consultant_words_shadow.opacity"
														        @input="setShadow(true, 'consultant_words_shadow', '.expert-says')">
														    </range-slider>
														  </div>
														  <p class="ml-3 range_count" style="width: 40%">{{ consultant_words_shadow.opacity }}%</p>
														</div>
												</template>
											</div>
	      		    		</b-tab>
	      		    	</b-tabs>
	      		    </b-tab>
	      		  </b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'consultant-add'">
	        		<b-tabs>
	        			<b-tab title="Общий блок" class="pt-3">
	        				<b-tabs class="more_tabs">
	        					<b-tab title="Цвета" class="pt-4 pb-2">
	        						<div role="group" class="mb-3">
	        						  <label>Цвет фона</label>
	        						  <b-input-group class="mb-4">
	        						    <b-input-group-prepend>
	        						        <b-btn variant="primary" id="exPopoverReactive-consultant-bg">Выбрать цвет</b-btn>
	        						        <b-popover target="exPopoverReactive-consultant-bg"
	        						                   triggers="click"
	        						                   placement="left">
	        						          <sketch-picker v-model="consultant_bg.color" @input="setBackground('consultant_bg', '.consultant')" />
	        						        </b-popover>
	        						      </b-input-group-prepend>
	        						      <b-form-input @input="setBackground('consultant_bg', '.consultant')" v-model="consultant_bg.color.hex"></b-form-input>
	        						  </b-input-group>
	        						  <label>Прозрачность фона</label>
	        						  <div class="d-flex">
	        						    <div style="width: 60%">
	        						      <range-slider
	        						          class="slider_range"
	        						          min="0"
	        						          max="100"
	        						          v-model="consultant_bg.opacity"
	        						          @input="setBackground('consultant_bg', '.consultant')">
	        						      </range-slider>
	        						    </div>
	        						    <p class="ml-3 range_count" style="width: 40%">{{ consultant_bg.opacity }}%</p>
	        						  </div>
	        						</div>
	        						<div role="group">
	        						  <label>Цвет текста</label>
	        						    <b-input-group>
	        						      <b-input-group-prepend>
	        						        <b-btn variant="primary" id="exPopoverReactive-consultant-color">Выбрать цвет</b-btn>
	        						        <b-popover target="exPopoverReactive-consultant-color"
	        						                   triggers="click"
	        						                   placement="left">
	        						            <template slot="title">
	        						            <sketch-picker v-model="consultant_color" />
	        						          </template>
	        						        </b-popover>
	        						      </b-input-group-prepend>
	        						      <b-form-input v-model="consultant_color.hex"></b-form-input>
	        						    </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Рамки" class="pt-4 pb-2">
	        						<div role="group" class="mb-3">
	        						  <b-form-checkbox id="checkbox-consultant-border" :class="consultant_border.show == true ? 'mb-3' : ''"
	        						                   v-model="consultant_border.show" @change="setBorder($event, 'consultant_border', '.consultant')">
	        						      Стилизовать границы
	        						  </b-form-checkbox>
	        						  <template v-if="consultant_border.show == true">
	        						    <div role="group" class="mb-4">
	        						      <label>Размер границы</label>
	        						      <b-input-group append="px">
	        						          <b-form-input type="number" v-model="consultant_border.size" @change="setBorder(true, 'consultant_border', '.consultant')"></b-form-input>
	        						      </b-input-group>
	        						    </div>
	        						    <div role="group">
	        						      <label>Стиль рамки</label>
	        						      <b-button-group class="d-flex mb-4">
	        						          <b-button style="width: 33.33%" 
	        						                @click="consultant_border.type = 'solid'; setBorder(true, 'consultant_border', '.consultant')"
	        						                variant="outline-secondary"
	        						                :class="consultant_border.type == 'solid' ? 'active' : ''">
	        						            <img src="../../static/img/border_solid.png" width="40%" height="auto">
	        						        </b-button>
	        						          <b-button style="width: 33.33%"
	        						                @click="consultant_border.type = 'dashed'; setBorder(true, 'consultant_border', '.consultant')"
	        						                variant="outline-secondary"
	        						                :class="consultant_border.type == 'dashed' ? 'active' : ''">
	        						            <img src="../../static/img/border_dashed.png" width="40%" height="auto">
	        						        </b-button>
	        						          <b-button style="width: 33.34%"
	        						                @click="consultant_border.type = 'dotted'; setBorder(true, 'consultant_border', '.consultant')"
	        						                variant="outline-secondary"
	        						                :class="consultant_border.type == 'dotted' ? 'active' : ''">
	        						            <img src="../../static/img/border_dotted.png" width="40%" height="auto">
	        						        </b-button>
	        						      </b-button-group>
	        						    </div>
	        						    <div role="group" class="mb-4">
	        						      <label>Цвет рамки</label>
	        						        <b-input-group class="mb-4">
	        						          <b-input-group-prepend>
	        						              <b-btn variant="primary" id="exPopoverReactive-consultant-border">Выбрать цвет</b-btn>
	        						              <b-popover target="exPopoverReactive-consultant-border"
	        						                         triggers="click"
	        						                         placement="left">
	        						                <sketch-picker v-model="consultant_border.color" @input="setBorder(true, 'consultant_border', '.consultant')" />
	        						              </b-popover>
	        						            </b-input-group-prepend>
	        						            <b-form-input v-model="consultant_border.color.hex" @input="setBorder(true, 'consultant_border', '.consultant')"></b-form-input>
	        						        </b-input-group>
	        						    </div>
	        						  </template>
	        						</div>
	        						<div role="group">
	        						  <label>Скругление краёв</label>
	        						  <b-input-group append="px">
	        						      <b-form-input type="number" v-model="consultant_border.radius"></b-form-input>
	        						  </b-input-group>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Отступы" class="pt-4 pb-2">
	        						<div role="group">
	        						  <label>Внутринные отступы</label>
	        						  <b-form-input type="number" v-model="consultant_padding"></b-form-input>
	        						</div>
	        					</b-tab>
	        					<b-tab title="Тени" class="pt-4 pb-2">
	        						<div role="group">
	        						  <b-form-checkbox id="checkbox-consultant-shadow" :class="consultant_shadow.show == true ? 'mb-3 d-block' : 'd-block'"
	        						                 v-model="consultant_shadow.show" @change="setShadow($event, 'consultant_shadow', '.consultant')">
	        						    Включить тени
	        						  </b-form-checkbox>
	        						  <template v-if="consultant_shadow.show == true">
	        						    <label>Тени (сдвиг по x)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="consultant_shadow.x" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Тени (сдвиг по y)</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="consultant_shadow.y" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Радиус размытия теней</label>
	        						    <b-input-group append="px" class="mb-3">
	        						        <b-form-input type="number" v-model="consultant_shadow.blur" @change="setShadow(true, 'consultant_shadow', '.consultant')"></b-form-input>
	        						    </b-input-group>
	        						    <label>Цвет тени</label>
	        						      <b-input-group class="mb-4">
	        						        <b-input-group-prepend>
	        						            <b-btn variant="primary" id="exPopoverReactive-info-shadow">Выбрать цвет</b-btn>
	        						            <b-popover target="exPopoverReactive-info-shadow"
	        						                       triggers="click"
	        						                       placement="left">
	        						              <sketch-picker v-model="consultant_shadow.color" @input="setShadow(true, 'consultant_shadow', '.consultant')" />
	        						            </b-popover>
	        						          </b-input-group-prepend>
	        						          <b-form-input @input="setShadow(true, 'consultant_shadow', '.consultant')" v-model="consultant_shadow.color.hex"></b-form-input>
	        						      </b-input-group>
	        						      <label>Прозрачность фона</label>
	        						      <div class="d-flex">
	        						        <div style="width: 60%">
	        						          <range-slider
	        						              class="slider_range"
	        						              min="0"
	        						              max="100"
	        						              v-model="consultant_shadow.opacity"
	        						              @input="setShadow(true, 'consultant_shadow', '.consultant')">
	        						          </range-slider>
	        						        </div>
	        						        <p class="ml-3 range_count" style="width: 40%">{{ consultant_shadow.opacity }}%</p>
	        						      </div>
	        						  </template>
	        						</div>
	        					</b-tab>
	        				</b-tabs>
	        			</b-tab>
	        			<b-tab title="Доп. поля" active class="pt-3">
	        				<b-tabs class="more_tabs">
	        					<b-tab v-for="(elem, index) in moreConsultantText" :title="'Поле #' + (index + 1)" class="pt-4 pb-2">
	        						<label>Размер текста</label>
	        						<b-form-input type="number" v-model="elem.fz" class="mb-4"></b-form-input>
	        						<label>Начертание шрифта</label>
	        						<b-button-group class="d-flex mb-4">
	        						    <b-button style="width: 50%" 
	        						          @click="elem.fw = 'normal'"
	        						          variant="outline-secondary"
	        						          :class="elem.fw == 'normal' ? 'active' : ''">
	        						      Нормальный
	        						  </b-button>
	        						    <b-button style="width: 50%"
	        						          @click="elem.fw = 'bold'"
	        						          variant="outline-secondary"
	        						          :class="elem.fw == 'bold' ? 'active' : ''">
	        						      Жирный
	        						  </b-button>
	        						</b-button-group>
	        						<label>Нижний отступ</label>
	        						<b-form-input type="number" v-model="elem.mb"></b-form-input>
	        					</b-tab>
	        				</b-tabs>
	        			</b-tab>
	        		</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'bg'">
							<b-tabs>
								<b-tab title="Цвет" active class="pt-4 pb-2">
									<div role="group" class="mb-4">
											<label>Цвет фона</label>
								    	<b-input-group>
								    		<b-input-group-prepend>
								    		    <b-btn variant="primary" id="exPopoverReactive-color">Выбрать цвет</b-btn>
								    		    <b-popover target="exPopoverReactive-color"
								    		               triggers="click"
								    		               placement="left">
							    		    		<sketch-picker v-model="colors" />
								    		    </b-popover>
							    		    </b-input-group-prepend>
								    	    <b-form-input v-model="colors.hex"></b-form-input>
								    	</b-input-group>
									</div>
									<div role="group">
											<label>Цвет текста</label>
								    	<b-input-group>
								    		<b-input-group-prepend>
								    		    <b-btn variant="primary" id="exPopoverReactive-fontcolor">Выбрать цвет</b-btn>
								    		    <b-popover target="exPopoverReactive-fontcolor"
								    		               triggers="click"
								    		               placement="left">
							    		    		<sketch-picker v-model="font_color" />
								    		    </b-popover>
							    		    </b-input-group-prepend>
								    	    <b-form-input v-model="font_color.hex"></b-form-input>
								    	</b-input-group>
									</div>
						  	</b-tab>
						  	<b-tab title="Изображение" class="pt-4 pb-2">
						    	<b-form-file class="mb-3" ref="bg_image_input" placeholder="Загрузить изображение..." @change="uploadBgImage($event)"></b-form-file>
						    	<b-button @click="clearFiles" variant="outline-danger" class="mb-4">Удалить изображение</b-button>
						    	<div role="group" class="mb-3">
						    		<label>Изменить положение</label>
									<b-form-select v-model="bg_position" :options="bg_position_select" />
						    	</div>
				    	    	<div role="group">
				    	    		<b-form-checkbox id="checkbox-overlay" :class="bg_overlay.show == true ? 'mb-3' : ''"
				    	    		                 v-model="bg_overlay.show" @change="bgOverlay($event)">
		    	    		      		Включить затемнение
			    	    		    </b-form-checkbox>
	    					    	<template v-if="bg_overlay.show">
		    					    	<b-input-group class="mb-4">
		    					    		<b-input-group-prepend>
		    					    		    <b-btn variant="primary" id="exPopoverReactive-overlay">Цвет фона</b-btn>
		    					    		    <b-popover target="exPopoverReactive-overlay"
		    					    		               triggers="click"
		    					    		               placement="left">
	    					    		    		<sketch-picker v-model="bg_overlay.color" @input="bgOverlay(true)" />
		    					    		    </b-popover>
		    				    		    </b-input-group-prepend>
		    					    	    <b-form-input v-model="bg_overlay.color.hex" @input="bgOverlay(true)"></b-form-input>
		    					    	</b-input-group>
		    					    	<label>Затемнение</label>
		    					    	<div class="d-flex">
		    					    	  <div style="width: 60%">
		    					    	    <range-slider
		    					    	        class="slider_range"
		    					    	        min="0"
		    					    	        max="100"
		    					    	        v-model="bg_overlay.opacity"
		    					    	        @input="bgOverlay(true)">
		    					    	    </range-slider>
		    					    	  </div>
		    					    	  <p class="ml-3 range_count" style="width: 40%">{{ bg_overlay.opacity }}%</p>
		    					    	</div>
	  					    		</template>
			    	    	</div>
						  	</b-tab>
							</b-tabs>
	        	</template>
	        	<template v-if="whichPopover == 'fonts'">
    				<div role="group" class="pt-3 pb-2">
    					<label>Выберите шрифт</label>
    			    	<b-input-group>
    			    		<b-form-select v-model="selectedFont" :options="allFonts" @change="changeFont($event)"/>
    			    	</b-input-group>
    				</div>
	        	</template>
		        </slot>
	        </section>
	    	</div>
    		<!-- </div> -->
    	</template>

	</div>
</template>

<script>
	import * as fb from 'firebase'

	var today = new Date().toISOString().slice(0, 10),
		arrayToday = today.split('-');

	var d = new Date(parseInt(arrayToday[0]), parseInt(arrayToday[1]) - 1, parseInt(arrayToday[2]));

	import { Container, Draggable } from "vue-smooth-dnd";
	import { Sketch } from 'vue-color';
	import vueSlider from 'vue-slider-component';
	import Drag from '@branu-jp/v-drag';
	import RangeSlider from 'vue-range-slider';
	import 'vue-range-slider/dist/vue-range-slider.css';
	import { Jumper } from 'vue-loading-spinner';
	import ClipLoader from 'vue-spinner/src/ClipLoader.vue';

	export default {
		components: { Container, Draggable, 'sketch-picker': Sketch, vueSlider, Drag, RangeSlider, Jumper, ClipLoader },
		data() {
			return {
				q_spinner: true,
				quiz_name: '',
				addInputError: false,
				addChoiceTypeError: false,
				titleQuestionError: false,
				editAnswerError: false,
				newAnswerError: false,
				editGalleryError: false,
				editGalleryImgError: false,
				newGalleryError: false,
				newGalleryImgError: false,
				allFonts: [],
				selectedFont: 'PT Sans Caption',
		        options: [
		        	{ value: null, text: 'Выберите тип', disabled: true },
		            { value: 'gallery', text: 'Галерея (слайдер)' },
		            { value: 'video', text: 'Видео' },
		            { value: 'consultant', text: 'Консультант' },
		        ],
		        textarea_answer: '',

		        // Quiz-pattern

				questionIndex: 0,
				currentQ: 1,
				questions: [
					{
						question: 'Какую площадь дома Вам хочется? 1',
						choices: ["Второй свет", "Балкон", "Терраса", "Ничего"],
						type: 'checkbox',
						addInput: true,
						placeholder: 'Напишите площадь дома',
						class: 'add-text-square',
						helpTitle: [
							"Металлопластиковые окна", 
							"Виды почвы и их влияние", 
							"Выбор типа черепицы", 
							"Открытая веранда"
						],
						helpText: [
							"Популярны три вида окон: пластиковые окна, деревянные окна с одинарным остеклением или со стеклопакетом.", 
							"Выбирая тип черепицы обратите внимание на эксплуатационные характеристики, стоимость материала и монтажа.", 
							"Вид почвы и план подключения коммуникаций влияет на вид фундамента, который подойдет вашему дому.", 
							"Веранду можно использовать как летнюю столовую и зону отдыха."
						],
						helpImage: ["", "", "", ""],
						forText: 'ffffff',
						forTextPlaceholder: 'Напишите чё-нибудь',
						min: 50,
						max: 100,
						step: 10,
						default: 70
					},
					{
						question: 'Какой дом Вам нужен? 2',
						choices: ["Одноэтажный", "Двухэтажный", "Трехэтажный", "Ничего", "And more"],
						type: 'radio',
						addInput: false,
						placeholder: 'Напишите площадь дома',
						class: 'add-text-circle',
						ifs: ["Второй свет", "Балкон"],
						ifsFrom: 0,
						ifsMode: 'one',
						helpTitle: ["", "", "", "", ""],
						helpText: ["", "", "", "", ""],
						helpImage: [],
						forText: '',
						forTextPlaceholder: '',
						min: 50,
						max: 100,
						step: 1,
						default: 75
					},
					{
						question: 'Сколько нужно спальных комнат? Одноэтажный 3',
						choices: ["1", "2","3", "более 3-х"],
						type: 'radio',
						addInput: false,
						placeholder: 'Напишите площадь дома',
						class: 'add-text-square',
						ifs: ["Трехэтажный"],
						ifsFrom: 1,
						ifsMode: 'one',
						helpTitle: ["", "", "", ""],
						helpText: ["", "", "", ""],
						helpImage: [],
						forText: '',
						forTextPlaceholder: '',
						min: 1,
						max: 100,
						step: 1,
						default: 50
					},
					{
						question: 'Какие нужны дополнительные помещения? Трехэтажный 4',
						choices: ["first option", "second option", "third option", "fourth option"],
						type: 'checkbox',
						addInput: false,
						placeholder: 'Напишите площадь дома',
						class: 'add-text-square',
						helpTitle: ["", "", "", ""],
						helpText: ["", "", "", ""],
						helpImage: [],
						forText: '',
						forTextPlaceholder: '',
						min: 1,
						max: 100,
						step: 1,
						default: 50
					},
					{
						question: 'Когда Вы планируете строительство? Двухэтажный 5',
						choices: ["В течение месяца", "Через 2-4 месяца", "Через полгода"],
						type: 'radio',
						addInput: false,
						placeholder: 'Напишите площадь дома',
						class: 'add-text-square',
						helpTitle: ["", "", ""],
						helpText: ["", "", ""],
						helpImage: [],
						forText: '',
						forTextPlaceholder: '',
						min: 1,
						max: 100,
						step: 1,
						default: 50
					},
					{
						question: 'Какую площадь дома Вам хочется? 6',
						choices: ["Второй свет", "Балкон", "Терраса", "Ничего"],
						type: 'radio',
						addInput: false,
						placeholder: 'Напишите площадь дома',
						class: 'add-text-square',
						/*placeholder: 'Напишите площадь дома',
						class: 'add-text-circle',*/
						helpTitle: ["", "", "", ""],
						helpText: ["", "", "", ""],
						helpImage: [],
						forText: '',
						forTextPlaceholder: '',
						min: 1,
						max: 100,
						step: 1,
						default: 50
					},
					{
						question: 'Какой дом Вам нужен? 7',
						choices: ["Одноэтажный", "Двухэтажный", "Трехэтажный"],
						type: 'radio',
						addInput: true,
						placeholder: 'Напишите площадь дома',
						class: 'add-text-circle',
						helpTitle: ["", "", ""],
						helpText: ["", "", ""],
						helpImage: [],
						forText: '',
						forTextPlaceholder: '',
						min: 1,
						max: 100,
						step: 1,
						default: 50
					}
				],
				config: 'gallery',
				galleryElements: [
					{
						src: '001.jpg',
						title: 'Дом «Инна»',
						more_keys: ['Общая площадь:', 'Внешние размеры:', 'Кол-во комнат:'],
						more_values: ['82,87', '10100x10400', '5'],
						forFilter: ['Не выбрано', 'And more', 'Не выбрано', 'first option', 'Не выбрано', 'Не выбрано', 'Не выбрано']
					},
					{
						src: '002.jpg',
						title: 'Дом «Ксения»',
						more_keys: ['Общая площадь:', 'Внешние размеры:', 'Кол-во комнат:'],
						more_values: ['90,8', '10100x10400', '5'],
						forFilter: ['Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано']
					},
					{
						src: '003.jpg',
						title: 'Дом «Валентина»',
						more_keys: ['Общая площадь:', 'Внешние размеры:', 'Кол-во комнат:'],
						more_values: ['72,4', '10100x10400', '5'],
						forFilter: ['Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано']
					},
					{
						src: '004.jpg',
						title: 'Дом «Гродно»',
						more_keys: ['Общая площадь:', 'Внешние размеры:', 'Кол-во комнат:'],
						more_values: ['179', '10100x10400', '5'],
						forFilter: ['Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано']
					},
					{
						src: '005.jpg',
						title: 'Дом «Бриз»',
						more_keys: ['Общая площадь:', 'Внешние размеры:', 'Кол-во комнат:'],
						more_values: ['107,9', '10100x10400', '5'],
						forFilter: ['Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано', 'Не выбрано']
					}
				],
				youtubePlayer: 'true',
				videoElements: [
					{
						src: '1',
						readySrc: '',
						localSrc: '',
						autoplay: false
					},
					{
						src: '2',
						readySrc: '',
						localSrc: '',
						autoplay: false
					},
					{
						src: '3',
						readySrc: '',
						localSrc: '',
						autoplay: false
					},
					{
						src: '4',
						readySrc: '',
						localSrc: '',
						autoplay: false
					},
					{
						src: '5',
						readySrc: '',
						localSrc: '',
						autoplay: false
					},
					{
						src: '6',
						readySrc: '',
						localSrc: '',
						autoplay: false
					},
					{
						src: '7',
						readySrc: '',
						localSrc: '',
						autoplay: false
					}
				],
				localVideo: null,

				consultantName: 'Казарина Екатерина',
				consultantDescription: 'эксперт по финансированию малого и среднего бизнеса',
				consultantImg: null,
				consultantImgSrc: '',
				moreConsultantText: [
					{
						text: '',
						fz: 16,
						fw: 'normal',
						mb: 0
					}
				],
				consultantElements: [
					{
						words: 'У нас есть архитекторы и дизайнеры интерьеров, которые специализируются на конкретном типе помещения. Мы поможем составить грамотный дизайн-проект.'
					},
					{
						words: 'Для больших помещений мы снижаем стоимость закупки материалов за счет наших партнеров - строительных компаний.'
					},
					{
						words: 'Возможно, вы уже давно интересуетесь интерьером, и пришла пора проанализировать результат. Собирайте понравившиеся интерьеры из журналов, снимки, рисунки. А затем сядьте и разберитесь, что во всех этих картинках, зацепивших ваш взгляд, общего: палитра, стиль, планировка. Выберите тот стиль, который набирает больше всего плюсов.'
					},
					{
						words: 'В бюджет входит стоимость проекта, ремонта, материалов, мебели.'
					},
					{
						words: 'Мы сможем оценить нагруженность своей команды дизайнеров и организовать работу строителей.'
					},
					{
						words: 'У нас в студии 9 из 10 клиентов заказывают авторский надзор. Это создает добавочную стоимость, но избавляет владельца от большого количества проблем и экономит его время.'
					},
					{
						words: 'большого количества проблем и экономит его время.'
					}
				],

				addBlockElements: [
					{
						title: 'Гарантированный подарок',
						img: null,
						src: '',
						name: 'ДОСТУП К ВИДЕО: "КАК ПРАВИЛЬНО ОЦЕНИТЬ И УЧЕСТЬ ПРАВОВЫЕ РИСКИ В СТОИМОСТИ КОМПАНИИ"'
					},
					{
						title: 'Гарантированный подарок',
						img: null,
						src: '',
						name: 'ЧЕК-ЛИСТ: "АУДИТ БИЗНЕСА ПО 31 ПАРАМЕТРУ, ВЛИЯЮЩИХ НА СТОИМОСТЬ КОМПАНИИ"'
					}
				],

				answersFinal: [],
				v_q: '',
				v_qCheck: [],
				v_qChoices: [],
				v_range: 50,
				//
				infoHeight: 0,

				// Всего слайдов
		        sliderAllCount: 0,
		        // Номер активного слайда
		        sliderActive: 1,
		        // Отступ тела со слайдами в контейнере
		        sliderOffsetLeft: 0,
		        // Шаг одного слайда = его длина
		        sliderOffsetStep: 0,

		        //

		        open: false,
		        forceOpen: false,
		        pickedDate: d,
		        curYear: d.getFullYear(),
		        curMonth: d.getMonth(),
		        curDay: d.getDate(),

		        // Edit 

		        styleMode: false,
		        showPopover: false,
		        whichPopover: '',

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
				bg_image: null,
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

				// Others

				loaderCheck: '',
				animation: '',
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
				lastVideoElements: [],
				lastConsultantElements: '',
				customEmails: [],
				readyEmail: [],
				metrika: '',
				analytics: '',
				autoOpenCh: false,
				autoOpen: false,
				exitOpen: false,
				exitOpenOnce: false,
				modal: 'full',
				linkLocation: {
					show: false,
					url: ''
				},
			}
		},
		mounted() {
			let script = document.createElement('script')
			    script.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
			    document.head.appendChild(script)

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
					this.link_color_text = getStyle[0].link_color_text;
				}

				setTimeout(() => {
					this.bgOverlay(this.bg_overlay.show);
					setTimeout(() => {
						this.$el.querySelector('#quiz').style.backgroundImage = this.bg_image_src;
					}, 0);
					this.radioStyleChange();
					this.radioActiveImage(this.radio_active_image);
					this.checkboxRadius();
					this.checkboxActiveImage(this.checkbox_active_image);
					this.calendarHoverColor();
					this.calendarActiveColor();
					this.rangeThumb();
					//
					this.setBackground('progress_bg', '.progress');
					this.setBackground('question_bg', '.question');
					this.setBackground('question_index_bg', '.question-number');
					this.setBackground('button_bg', '.next-questions');
					setTimeout(() => {
						this.setBackground('input_bg', '.quiz_inputs');
					}, 0)
					this.setBackground('calendar_bg', '.calendar');
					//this.setBackground('calendar_active_bg', 'tbody td.selected');
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
					this.setBackground('input_bg', '.quiz_inputs');
					//
					this.setBgRoot('radio_bg', '--radio-background');
					this.setBgRoot('radio_hover_bg', '--radio-hover-background');
					this.setBgRoot('radio_before_bg', '--radio-before-background');
					this.setBgRoot('radio_active_bg', '--radio-checked');
					this.setBgRoot('radio_active_bg', '--radio-hover-shadow');
					this.setBgRoot('checkbox_bg', '--checkbox-background');
					this.setBgRoot('checkbox_hover_bg', '--checkbox-hover-background');
					this.setBgRoot('checkbox_before_bg', '--checkbox-before-background');
					this.setBgRoot('checkbox_active_bg', '--checkbox-checked');
					this.setBgRoot('calendar_hover_bg', '--calendar-hover-background');
					this.setBgRoot('calendar_active_bg', '--calendar-selected');
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

					this.$refs.question_elem[0].classList.add('active');

					this.checkType();

					var firstQ = this.$refs.question;
					firstQ[0].style.display = 'block';

					this.changeProgress;
					this.activeBtn();

					if(this.config == 'gallery') {
						var config = this.$refs.background,
							get_started = this.$refs.started,
							qtip = this.$refs.qtip,
							slider = this.$refs.slider;
						slider.style.display = 'block';

						this.initSlider();
						this.openSlide(this.sliderActive);		 	

						setTimeout(() => {
							this.infoHeight = document.querySelector('.home-item__info').offsetHeight;

							var infoHeight = 420 + this.infoHeight + 'px';

							document.querySelector('.js-slider').style.height = infoHeight;

							for(var i = 0; i < document.querySelectorAll('.home-item__info').length; i++) {
								document.querySelectorAll('.home-item__info')[i].style.bottom = '-' + this.infoHeight + 'px';
							}
						}, 0);

						qtip.style.display = 'none';
					}

				    window.addEventListener('resize', () => {
				     	this.initSlider();
				    	this.openSlide(this.sliderActive);
				    	this.rangeProgress();
				    });

				    if(this.questions[0].type == 'range') {
						this.rangeProgress();
				    }

					if(this.config == 'gallery') {
						this.selectFilter();
						this.selectFilterEdit();
					}

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
						
						this.changeFont(this.selectedFont);
					}, (response) => {
						console.log(response);
					});

					this.q_spinner = false;
				}, 3)	
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
			bgImage() {
				let imagePath = '../../static/questions/';
				let ready = imagePath + this.bg_image.name;

				return ready
			},
			progressBgColor() {
				return 'rgba(' + this.progress_bg_color.rgba.r + ', ' + this.progress_bg_color.rgba.g + ', ' + this.progress_bg_color.rgba.b + ', ' + this.progress_bg_color.rgba.a + ')'
			},
			

			changeProgress() {
				var test = (this.questionIndex + 1) / (this.questions.length + 1) * 100;
				setTimeout(() => {
					test = Math.round(test);
					this.$refs.progress.innerHTML = test + '%';
				}, 0)
				return test + '%'
			},
			filterSlider() {
				var lorem = this.v_q,
					temp = this.v_qChoices,
					filtered = this.galleryElements;

				this.sliderAllCount = filtered.length;
				this.sliderActive = 1;

				return filtered;
			},
			countInfo() {
				return this.galleryElements[0].more_keys.length
			},
			heightInfo() {
				setTimeout(() => {
					this.infoHeight = document.querySelector('.home-item__info').offsetHeight;

					var infoHeight = 420 + this.infoHeight + 'px';

					document.querySelector('.js-slider').style.height = infoHeight;
				}, 0);
			},

			// Date

			showDate: {
			    get() {
			    	let d = this.pickedDate
			        return d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth()) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
			    }
			    },
			    leapYear() {
			      if (this.curYear % 100 === 0) {
			        return this.curYear % 400 === 0
			      } else {
			        return this.curYear % 4 === 0
			      }
			    },
			    dates() {
			      let ret = []
			      let firstDayOfMonth = new Date(this.curYear, this.curMonth, 1)
			      let lastDayOfMonth = new Date(this.curYear, this.curMonth, this.getLastDayOfMonth(this.curMonth))
			      ret.unshift(firstDayOfMonth)
			      for (let d = this.prevDate(firstDayOfMonth); d.getDay() !== 0; d = this.prevDate(d)) {
			        ret.unshift(d)
			      }
			      for (let d = this.nextDate(firstDayOfMonth); d <= lastDayOfMonth; d = this.nextDate(d)) {
			        ret.push(d)
			      }
			      for (let d = this.nextDate(lastDayOfMonth); d.getDay() !== 0; d = this.nextDate(d)) {
			        ret.push(d)
			      }
			      return ret
			    },
			    rows() {
			      return this.dates.reduce(function(p, c, i) {
			        if (i % 7 === 0) {
			          p[p.length] = []
			        }
			        p[p.length - 1].push(c)
			        return p
			      }, [])
			    }
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
			onClosePopover() {
				this.$root.$emit('bv::hide::popover');
			},
			hideModal() {
				this.$refs.addinput.$el.value = '';
		    	this.$root.$emit('bv::hide::modal','modal-add');

		    	for (var i = 0; i < this.$refs.type_choice.querySelectorAll('.type_item').length; i++) {
		    		this.$refs.type_choice.querySelectorAll('.type_item')[i].classList.remove('type_active');
		    	}

		    	this.addInputError = false;
	    		this.addChoiceTypeError = false;
		    },
		    choiceType(index) {
		    	for (var i = 0; i < this.$refs.type_choice.querySelectorAll('.type_item').length; i++) {
		    		this.$refs.type_choice.querySelectorAll('.type_item')[i].classList.remove('type_active');
		    	}

		    	this.$refs.type_choice.querySelectorAll('.type_item')[index].classList.add('type_active');
		    },
		    addQuestion() {
		    	if(this.$refs.addinput.$el.value == '' && this.$refs.type_choice.querySelector('.type_active') == null) {
		    		this.addInputError = true;
		    		this.addChoiceTypeError = true;
		    	} else if(this.$refs.addinput.$el.value == '') {
		    		this.addInputError = true;
		    		this.addChoiceTypeError = false;
		    	} else if(this.$refs.type_choice.querySelector('.type_active') == null) {
		    		this.addInputError = false;
		    		this.addChoiceTypeError = true;
		    	} else {
		    		this.addInputError = false;
		    		this.addChoiceTypeError = false;
		    		
			    	let titleQ = this.$refs.addinput.$el.value,
			    		typeQ = '';

			    	for (var i = 0; i < this.$refs.type_choice.querySelectorAll('.type_item').length; i++) {
			    		if(this.$refs.type_choice.querySelectorAll('.type_item')[i].classList.contains('type_active')) {
			    			switch (i) {
			    				case 0:
			    					typeQ = 'radio'
			    					break;
			    				case 1:
			    					typeQ = 'checkbox'
			    					break;
			    				case 2:
			    					typeQ = 'text'
			    					break;
			    				case 3:
			    					typeQ = 'date'
			    					break;
			    				case 4:
			    					typeQ = 'range'
			    			}
			    		}
			    	}

			    	this.questions.push({
			    		question: titleQ,
			    		type: typeQ,
			    		choices: [],
			    		helpTitle: [],
			    		helpText: [],
			    		helpImage: [],
			    		addInput: false,
			    		class: '',
			    		placeholder: '',
			    		forText: '',
			    		forTextPlaceholder: '',
			    		min: 0,
			    		max: 100,
			    		step: 1,
						default: 50
			    	});

			    	for (var i = 0; i < this.galleryElements.length; i++) {
			    		this.galleryElements[i].forFilter.push('Не выбрано');
			    	}

			    	this.videoElements.push({
						src: '',
						readySrc: '',
						localSrc: '',
						autoplay: false
			    	});

	    	    	this.consultantElements.push({
	    				words: '',
	    	    	});

			    	this.hideModal();
			    	setTimeout(() => {
			    		this.selectFilterNew();

			    		this.setBackground('question_bg', '.question');
			    		this.setBackground('question_index_bg', '.question-number');
			    		this.setBackground('button_bg', '.next-questions');
			    		this.setBackground('input_bg', '.quiz_inputs');
			    		this.setBackground('calendar_bg', '.calendar');
			    		this.setBorder(this.question_border.show, 'question_border', '.question');
			    		this.setBorder(this.question_index_border.show, 'question_index_border', '.question-number');
			    		this.setBorder(this.button_border.show, 'button_border', '.next-questions');
			    		this.setBorder(this.input_border.show, 'input_border', '.quiz_inputs');
			    		this.setBorder(this.calendar_border.show, 'calendar_border', '.calendar');
			    		this.setShadow(this.question_shadow.show, 'question_shadow', '.question');
			    		this.setShadow(this.question_index_shadow.show, 'question_index_shadow', '.question-number');
			    		this.setShadow(this.button_shadow.show, 'button_shadow', '.next-questions');
			    		this.setShadow(this.input_shadow.show, 'input_shadow', '.quiz_inputs');
			    		this.setShadow(this.calendar_shadow.show, 'calendar_shadow', '.calendar');
			    		this.setShadow(this.range_shadow.show, 'range_shadow', '.range-positive');
			    	}, 0)
		    	}

		    	
		    },
			deleteQuestion(index) {
				if(this.$refs.question_elem.length == 2) {
					this.questions.splice(index, 1);
					this.videoElements.splice(index, 1);
					this.consultantElements.splice(index, 1);
					this.$refs.question_elem[0].querySelector('i').style.display = 'none';
				} else {
					this.questions.splice(index, 1);
					this.videoElements.splice(index, 1);
					this.consultantElements.splice(index, 1);
				}
			},
			activeQuestion(index) {
				for (var i = 0; i < this.$refs.question_elem.length; i++) {
					this.$refs.question_elem[i].classList.remove('active');
				}

				this.$refs.question_elem[index].classList.add('active');

				if(this.$refs.question_elem[this.questionIndex] != undefined) {
					this.$refs.question[this.questionIndex].style.display = 'none';
				}

				if(this.questions.length == index) {
					index = index - 1;

					this.questionIndex = index;
					this.$refs.question_elem[index].classList.add('active');
				} else {
					this.questionIndex = index;
					this.$refs.question_elem[index].classList.add('active');
				}
				this.currentQ = index + 1;

				this.$refs.question[this.questionIndex].style.display = 'block';

				if(this.config == 'video' && this.youtubePlayer == 'false') {
					this.$refs.video_local.load();
				}
				this.activeBtn();
				if(this.config == 'gallery') {
					this.hideHelp();
				}
				this.checkType();

				if (this.questions[this.questionIndex].type == 'range') {
					this.v_range = this.questions[this.questionIndex].min;
					this.rangeProgress();
				}

				this.$refs.answer_block[this.questionIndex].id = 'exPopoverReactive-' + this.questions[this.questionIndex].type;
			},
			deleteAnswer(index) {
				this.questions[this.questionIndex].choices.splice(index, 1);
				this.questions[this.questionIndex].helpTitle.splice(index, 1);
				this.questions[this.questionIndex].helpText.splice(index, 1);
				this.questions[this.questionIndex].helpImage.splice(index, 1);

				this.hideHelp();
			},
			confirmAnswer() {
				if(this.$refs.edited_answer.$el.value == '') {
					this.editAnswerError = true;
				} else {
					this.editAnswerError = false;

					let index = this.$refs.modal_answer.$refs.body.getAttribute('data-index'),
						editedAnswer = this.$refs.edited_answer.$el.value;

					let helpTitle = this.$refs.help_title.$el.value,
						helpDesc = this.$refs.help_desc.$el.value;

					this.questions[this.questionIndex].choices.splice(index, 1, editedAnswer);

					this.questions[this.questionIndex].helpTitle.splice(index, 1, helpTitle);
					this.questions[this.questionIndex].helpText.splice(index, 1, helpDesc);

					this.hideModalAnswer();
					this.hideHelp();
				}
			},
			async uploadImgEditHelp(e) {
				let index = this.$refs.modal_answer.$refs.body.getAttribute('data-index');
				let idQuiz = this.$router.history.current.params.id;
				const file = e.target.files[0];

				let helpRef = '';
				await fb.storage().ref(`quiz/${idQuiz}_answer-${this.questionIndex}-${index}`).put(file).then((res) => {
					helpRef = res.metadata.fullPath;
				});

				await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
					this.questions[this.questionIndex].helpImage[index] = url;
				});
			},
			editAnswer(index) {
				this.$root.$emit('bv::show::modal','modal-answer');

				this.$refs.modal_answer.$refs.body.setAttribute('data-index', index);

				document.getElementById('modal-answer').querySelector('input').value = this.questions[this.questionIndex].choices[index];

				let helpTitle = this.$refs.help_title.$el,
					helpDesc = this.$refs.help_desc.$el;

				helpTitle.value = this.questions[this.questionIndex].helpTitle[index];
				helpDesc.value = this.questions[this.questionIndex].helpText[index];
			},
			addAnswer() {
				this.$root.$emit('bv::show::modal','modal-add-answer');
			},
			hideModalAnswer() {
				this.$root.$emit('bv::hide::modal','modal-answer');

				this.editAnswerError = false;
			},
			hideModalAddAnswer() {
				this.$refs.input_new_answer.$el.value = '';
				this.$refs.new_help_title.$el.value = '';
				this.$refs.new_help_desc.$el.value = '';

				this.$root.$emit('bv::hide::modal','modal-add-answer');

				this.newAnswerError = false;
			},
			addNewAnswer() {
				if(this.$refs.input_new_answer.$el.value == '') {
					this.newAnswerError = true;
				} else {
					this.newAnswerError = false;

					let newAnswer = this.$refs.input_new_answer.$el.value,
						newHelpTitle = this.$refs.new_help_title.$el.value,
						newHelpDesc = this.$refs.new_help_desc.$el.value;

					this.questions[this.questionIndex].choices.push(newAnswer);
					this.questions[this.questionIndex].helpTitle.push(newHelpTitle);
					this.questions[this.questionIndex].helpText.push(newHelpDesc);

					this.hideModalAddAnswer();
				}
			},
			async uploadImgNewHelp(e) {
				let index = this.questions[this.questionIndex].helpImage.length;
				let idQuiz = this.$router.history.current.params.id;
				const file = e.target.files[0];

				let helpRef = '';
				await fb.storage().ref(`quiz/${idQuiz}_answer-${this.questionIndex}-${index}`).put(file).then((res) => {
					helpRef = res.metadata.fullPath;
				});

				await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
					this.questions[this.questionIndex].helpImage[index] = url;
					console.log(this.questions[this.questionIndex].helpImage[index]);
				});
			},
			onDrop(dropResult) {
				this.questions[this.questionIndex].choices = this.applyDrag(this.questions[this.questionIndex].choices, dropResult);
				this.questions[this.questionIndex].helpTitle = this.applyDrag(this.questions[this.questionIndex].helpTitle, dropResult);
				this.questions[this.questionIndex].helpText = this.applyDrag(this.questions[this.questionIndex].helpText, dropResult);
				this.questions[this.questionIndex].helpImage = this.applyDrag(this.questions[this.questionIndex].helpImage, dropResult);
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
			showHelp(value) {
				if (this.questions[this.questionIndex].helpText[value] != "" && this.config == 'gallery') {
					this.$refs.qtip.style.display = 'block';

					var help_title = this.questions[this.questionIndex].helpTitle[value],
						help_text = this.questions[this.questionIndex].helpText[value],
						help_image = this.questions[this.questionIndex].helpImage[value];

					this.$refs.tooltipTitle.innerHTML = help_title;
					this.$refs.tooltipText.innerHTML = help_text;
					this.$refs.tooltipImage.style.backgroundImage = 'url(' + help_image + ')';
				}
			},
			hideHelp() {
				if (!(this.questions[this.questionIndex].helpText in this.questions[this.questionIndex])) {
					this.$refs.qtip.style.display = 'none'
				}
			},
			changeQuestion(value) {
				if(value == '') {
					this.titleQuestionError = true;
				} else {
					this.titleQuestionError = false;
				}
				this.questions[this.questionIndex].question = value;
			},
			addFocus() {
				var testing = this.$refs.question[this.questionIndex].querySelectorAll('.magic-radio');

				for (var element of testing) {
			        element.checked = false;
				}

				if(this.$refs.question[this.questionIndex].querySelector('.add-text-square') !== null) {
					this.$refs.question[this.questionIndex].querySelector('.add-text-square').classList.add('input-focused');
				} else if(this.$refs.question[this.questionIndex].querySelector('.add-text-circle') !== null) {
					this.$refs.question[this.questionIndex].querySelector('.add-text-circle').classList.add('input-focused');
				}

				this.$refs.next[this.questionIndex].classList.remove("disabled");
			},
			delFocus() {
				if(this.$refs.question[this.questionIndex].querySelector('.add-text-square') !== null) {
					this.$refs.question[this.questionIndex].querySelector('.add-text-square').classList.remove('input-focused');
				} else if(this.$refs.question[this.questionIndex].querySelector('.add-text-circle') !== null) {
					this.$refs.question[this.questionIndex].querySelector('.add-text-circle').classList.remove('input-focused');
				}
			},
			delFocusCheckbox(e) {
				console.log(e)
				if(this.questions[this.questionIndex].type == 'checkbox' && e == '') {
					this.$refs.question[this.questionIndex].querySelector('.add-text-square').classList.remove('input-focused');
				}
			},
			unFocusedCheckbox(e) {
				if(this.questions[this.questionIndex].type == 'checkbox' && e == '') {
					this.$refs.question[this.questionIndex].querySelector('.add-text-square').classList.remove('input-focused');
				}
			},
			addInput() {
				this.questions[this.questionIndex].addInput = !(this.questions[this.questionIndex].addInput)

				if(this.questions[this.questionIndex].addInput == true) {
					if(this.questions[this.questionIndex].type == 'radio') {
						this.questions[this.questionIndex].class = 'add-text-circle'
					} else {
						this.questions[this.questionIndex].class = 'add-text-square' 
					}
				}

			},
			changePlaceholder(value) {
				this.questions[this.questionIndex].placeholder = value;
			},
			getAnswersFunc(e) {
			    e = e.value || e;

			    this.changeCondQuestion(e);

			    for(var k = 0; k < this.questions[this.questionIndex].ifs.length; k++) {
			    	let select = this.$refs.select_choices[k];

			    	if(select.length > 0) {
						while(select.length > 0) {
							select.remove(select.length - 1);
						}
					}

					let opt = document.createElement('option');
				    opt.value = 'Выберите ответ';
				    opt.innerHTML = 'Выберите ответ';
				    opt.setAttribute('disabled', 'disabled');
				    opt.setAttribute('selected', 'selected');
				    this.$refs.select_choices[k].appendChild(opt);

			    	for(var i = 0; i < this.questions[e].choices.length; i++) {
			    		

			    		let opt = document.createElement('option');

			    	    opt.value = this.questions[e].choices[i];
			    	    opt.innerHTML = this.questions[e].choices[i];
			    	    select.appendChild(opt);
			    	}
			    }
			},
			changeCondAnswer(e, index) {
				this.questions[this.questionIndex].ifs[index] = e.target.value;
			},
			changeCondQuestion(e) {
				this.questions[this.questionIndex].ifsFrom = e;
			},
			addModalCond() {
				this.$root.$emit('bv::show::modal','modal-cond');

				if(this.questions[this.questionIndex].ifs != undefined) {
					let index = 0;

					for(var i = 0; i < this.$refs.select_question.length; i++) {
						let select = this.$refs.select_question[i];
						for(var j = 0; j < this.questionIndex; j++) {
							let opt = document.createElement('option');

						    opt.value = j;
						    if(this.questions[j].type === 'radio') {
						    	opt.innerHTML = this.questions[j].question;
						    	select.appendChild(opt);
						    }
						}
					}

					for(var i = 0; i < this.questions[this.questionIndex].ifs.length; i++) {
						for(var j = 0; j < this.$refs.select_question[i].options.length; j++) {
							if(this.$refs.select_question[i].options[j].value == this.questions[this.questionIndex].ifsFrom) {
								index = j;
								this.$refs.select_question[i].options[j].setAttribute('selected', 'selected');
							}
						}
					}

					this.getAnswersFunc(index);

					for(var i = 0; i < this.questions[this.questionIndex].ifs.length; i++) {
						for(var j = 0; j < this.$refs.select_choices[i].options.length; j++) {
							if(this.$refs.select_choices[i].options[j].value == this.questions[this.questionIndex].ifs[i]) {
								this.$refs.select_choices[i].options[j].setAttribute('selected', 'selected');
							}
						}
					}
				}
			},
			closeModalCond() {
				for(let i = 0; i < this.$refs.select_question.length; i++) {
					let selectQ = this.$refs.select_question[i],
						selectC = this.$refs.select_choices[i];

					if(selectQ.length > 0) {
						while(selectQ.length > 0) {
							selectQ.remove(selectQ.length - 1);
						}
					}

					if(selectC.length > 0) {
						while(selectC.length > 0) {
							selectC.remove(selectC.length - 1);
						}
					}
				}
			},
			addCond() {
				if(this.questions[this.questionIndex].ifs == undefined) {
					this.$set(this.questions[this.questionIndex], 'ifs', [""]);
					this.$set(this.questions[this.questionIndex], 'ifsFrom', 0);
					this.$set(this.questions[this.questionIndex], 'ifsMode', 'one');

					setTimeout(() => {
						let select = this.$refs.select_question[0];

						for(var j = 0; j < this.questionIndex; j++) {
							let opt = document.createElement('option');

						    opt.value = j;
						    if(this.questions[j].type === 'radio') {
						    	opt.innerHTML = this.questions[j].question;
						    	select.appendChild(opt);
						    }
						}

						this.getAnswersFunc(0);
					}, 0)
				} else {
					this.questions[this.questionIndex].ifs.push("");

					setTimeout(() => {
						let select = this.$refs.select_question[this.questions[this.questionIndex].ifs.length - 1];
						for(var j = 0; j < this.questionIndex; j++) {
							let opt = document.createElement('option');

						    opt.value = j;
						    opt.innerHTML = this.questions[j].question;
						    select.appendChild(opt);
						}

						this.getAnswersFunc(0);
					}, 0)
				}
			},
			deleteCond(index) {
				if(this.questions[this.questionIndex].ifs.length > 1) {
					this.questions[this.questionIndex].ifs.splice(index, 1);

					for(var i = 0; i < this.questions[this.questionIndex].ifs.length; i++) {
						for(var j = 0; j < this.$refs.select_choices[i].options.length; j++) {
							if(this.$refs.select_choices[i].options[j].value == this.questions[this.questionIndex].ifs[i]) {
								this.$refs.select_choices[i].options[j].setAttribute('selected', 'selected');
							}
						}
					}
				} else {
					this.$delete(this.questions[this.questionIndex], 'ifs');
					this.$delete(this.questions[this.questionIndex], 'ifsFrom');
					this.$delete(this.questions[this.questionIndex], 'ifsMode');
				}
			},
			changeCondMode(e) {
				this.questions[this.questionIndex].ifsMode = e;
			},
			hideModalCond() {
				this.$root.$emit('bv::hide::modal','modal-cond');
				
				this.closeModalCond();
			},
			checkType() {
				let selectTypesL = this.$refs.select_types.length;

				while(this.$refs.select_types.length > 0) {
					this.$refs.select_types.remove(this.$refs.select_types.length - 1);
				}

				let optionsA = ["Единичный выбор", "Множественный выбор", "Поле для ввода", "Выбор даты", "Ползунок"],
					valuesA = ["radio", "checkbox", "text", "date", "range"];

				for(var j = 0; j < selectTypesL; j++) {
					let opt = document.createElement('option');

				    opt.value = valuesA[j];
				    opt.innerHTML = optionsA[j];
				    this.$refs.select_types.appendChild(opt);
				}

				for(var i = 0; i < this.$refs.select_types.options.length; i++) {
					if(this.$refs.select_types.options[i].value == this.questions[this.questionIndex].type) {
						this.$refs.select_types.options[i].setAttribute('selected', 'selected');
					}
				}
			},
			changeTypeQ(e) {
				this.questions[this.questionIndex].type = e.target.value;

				if(e.target.value == 'radio') {
					this.questions[this.questionIndex].class = 'add-text-circle'
				} else if(e.target.value == 'checkbox') {
					this.questions[this.questionIndex].class = 'add-text-square'
				}

				setTimeout(() => {
					this.activeBtn();
				}, 0);

				if(this.questions[this.questionIndex].type == 'range') {
					this.rangeProgress();
				}
			},
			changeTextValue(e) {
				this.questions[this.questionIndex].forText = e.target.value;
			},
			changeTextPlaceholder(e) {
				this.questions[this.questionIndex].forTextPlaceholder = e.target.value;
			},
			changeMin(e) {
				this.questions[this.questionIndex].min = e.target.value;
				this.v_range = e.target.value;

				this.rangeProgress();
			},
			changeMax(e) {
				this.questions[this.questionIndex].max = e.target.value;
			},
			changeStep(e) {
				this.questions[this.questionIndex].step = e.target.value;
			},
			changeDefalutRange(e) {
				this.questions[this.questionIndex].default = e.target.value;
			},
			rangeProgress() {
				setTimeout(() => {
					if(this.v_range > this.questions[this.questionIndex].max) {
						this.v_range = this.questions[this.questionIndex].max
					}

					if(this.v_range < this.questions[this.questionIndex].min) {
						this.v_range = this.questions[this.questionIndex].min
					}

					let test = (this.v_range - this.questions[this.questionIndex].min) / (this.questions[this.questionIndex].max - this.questions[this.questionIndex].min);

					for (var i = 0; i < this.$refs.range.length; i++) {
						let result = this.$refs.range[i].clientWidth * test;

						document.querySelectorAll('.range-positive')[i].style.width = result + 'px';
					}
				}, 0);		
			},
			fixSlider(e) {
				if(e == 'gallery') {
					setTimeout(() => {
						var config = this.$refs.background,
							get_started = this.$refs.started;
						config.style.backgroundImage = 'none';
						get_started.style.display = 'none';

						var slider = this.$refs.slider,
							qtip = this.$refs.qtip;
						slider.style.display = 'block';
						qtip.style.display = 'none';

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
					}, 0)
				} else {
					setTimeout(() => {
						var config = this.$refs.background,
							get_started = this.$refs.started;
						config.style.backgroundImage = 'none';
						get_started.style.display = 'none';
					}, 0)
				}
			},
			changeYoutubeLink(e) {
				this.videoElements[this.questionIndex].src = e;

				if(e == '') {
					this.videoElements[this.questionIndex].readySrc = '';
				} else {
					let linkParts = e.split('/');
					let link = linkParts[3];

					if(link.includes('watch?v=')) {
						link = link.replace('watch?v=', '');
					}
					
					this.videoElements[this.questionIndex].readySrc = link;
				}
			},
			autoplayOn(e) {
				if(e == true) {
					this.videoElements[this.questionIndex].autoplay = e;

					this.videoElements[this.questionIndex].readySrc += '?autoplay=1';
					this.$refs.video_local.autoplay = true;

					this.$refs.video_local.load();
				} else {
					this.videoElements[this.questionIndex].autoplay = e;

					this.videoElements[this.questionIndex].readySrc = this.videoElements[this.questionIndex].readySrc.replace('?autoplay=1', '');
					this.$refs.video_local.autoplay = false;
					
					this.$refs.video_local.load();
				}
			},
			changeConsultantName(e) {
				this.consultantName = e;
			},
			changeConsultantDesc(e) {
				this.consultantDescription = e;
			},
			changeConsultantWords(e) {
				this.consultantElements[this.questionIndex].words = e;
			},
			changeAddConsultantText(e, index) {
				this.moreConsultantText[index].text = e;
			},
			newConsultantText() {
				this.moreConsultantText.push({
					text: '',
					fz: 16,
					fw: 'normal',
					mb: 0
				})
			},
			deleteConsultantText(index) {
				this.moreConsultantText.splice(index, 1);
			},
			async uploadVideo(e) {
				let idQuiz = this.$router.history.current.params.id;
				const file = e.target.files[0];

				let helpRef = '';
				await fb.storage().ref(`quiz/${idQuiz}_video-${this.questionIndex}`).put(file).then((res) => {
					helpRef = res.metadata.fullPath;
				});

				await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
					this.videoElements[this.questionIndex].localSrc = url;
				}); 

				this.$refs.video_local.load();
			},
			changePlayer(e) {
				this.youtubePlayer = e;
			},
			onDropGallery(dropResult) {
				this.galleryElements = this.applyDrag(this.galleryElements, dropResult);
			},
			deleteElemGallery(index) {
				this.galleryElements.splice(index, 1);
			},
			editGalleryElem(index) {
				this.$root.$emit('bv::show::modal','modal-edit-gallery');

				this.$refs.modal_edit_gallery.$refs.body.setAttribute('data-gallery-index', index);

				let titleGallery = this.$refs.edited_title_gallery.$el;
				titleGallery.value = this.galleryElements[index].title;

				let infoValues = this.$refs.more_gallery_info.querySelectorAll('.gallery_value');
				for (var i = 0; i < infoValues.length; i++) {
					infoValues[i].value = this.galleryElements[index].more_values[i];
				}

				let galleryKeys = this.$refs.more_gallery_info.querySelectorAll('.gallery_key');
				for (var i = 0; i < galleryKeys.length; i++) {
					galleryKeys[i].value = this.galleryElements[0].more_keys[i];
				}

				for (var i = 0; i < this.$refs.edit_select_filter.length; i++) {
					for (var j = 0; j < this.$refs.edit_select_filter[i].$el.options.length; j++) {
						if(this.$refs.edit_select_filter[i].$el.options[j].text == this.galleryElements[index].forFilter[i]) {
							this.$refs.edit_select_filter[i].$el.options[j].selected = true;
						}
					}	
				}
			},
			deleteGalleryInfo(index) {
				for (var i = 0; i < this.galleryElements.length; i++) {
					this.galleryElements[i].more_values.splice(index / 2, 1);
					this.galleryElements[i].more_keys.splice(index / 2, 1);
				}

				setTimeout(() => {
					this.infoHeight = document.querySelector('.home-item__info').offsetHeight;

					var infoHeight = 420 + this.infoHeight + 'px';

					for (var i = 0; i < this.galleryElements.length; i++) {
						this.$refs.info[i].style.bottom = '-' + this.infoHeight + 'px';
					}

					document.querySelector('.js-slider').style.height = infoHeight;
				}, 0);

				let infoValues = this.$refs.more_gallery_info.querySelectorAll('.gallery_value');
				for (var i = 0; i < infoValues.length; i++) {
					infoValues[i].value = this.galleryElements[index].more_values[i];
				}
			},
			addGalleryInfo() {
				for (var i = 0; i < this.galleryElements.length; i++) {
					this.galleryElements[i].more_values.push("");
					this.galleryElements[i].more_keys.push("");
				}
			},
			async uploadImgGallery(e) {
				let index = this.$refs.modal_edit_gallery.$refs.body.getAttribute('data-gallery-index');
				let idQuiz = this.$router.history.current.params.id;
				const file = e.target.files[0];

				let helpRef = '';
				await fb.storage().ref(`quiz/${idQuiz}_gallery-${index}`).put(file).then((res) => {
					helpRef = res.metadata.fullPath;
				});

				await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
					this.galleryElements[index].src = url;
				}); 
			},
			confirmElementGallery() {
				if(this.$refs.edited_title_gallery.$el.value == '' && this.$refs.label_upload_img_gallery.innerHTML == 'Загрузить изображение...') {
					this.editGalleryError = true;
					this.editGalleryImgError = true;
				} else if(this.$refs.edited_title_gallery.$el.value == '') {
					this.editGalleryError = true;
					this.editGalleryImgError = false;
				} else {
					this.editGalleryError = false;
					this.editGalleryImgError = false;

					let index = this.$refs.modal_edit_gallery.$refs.body.getAttribute('data-gallery-index'),
						editedTitle = this.$refs.edited_title_gallery.$el.value,
						galleryKeys = this.$refs.more_gallery_info.querySelectorAll('.gallery_key'),
						galleryValues = this.$refs.more_gallery_info.querySelectorAll('.gallery_value');

					this.galleryElements[index].title = editedTitle;

					for (var i = 0; i < this.galleryElements.length; i++) {
						for (var j = 0; j < galleryKeys.length; j++) {
							this.galleryElements[i].more_keys.splice(j, 1, galleryKeys[j].value);
						}
					}

					for (var i = 0; i < galleryValues.length; i++) {
						this.galleryElements[index].more_values.splice(i, 1, galleryValues[i].value);
					}

					for (var i = 0; i < this.$refs.edit_select_filter.length; i++) {
						for (var j = 0; j < this.$refs.edit_select_filter[i].$el.options.length; j++) {
							if(this.$refs.edit_select_filter[i].$el.options[j].selected == true) {
								this.galleryElements[index].forFilter.splice(i, 1, this.$refs.edit_select_filter[i].$el.options[j].value);
							}
						}	
					}

					this.$root.$emit('bv::hide::modal','modal-edit-gallery');
				}
			},
			hideModalEditGallery() {
				this.$root.$emit('bv::hide::modal','modal-edit-gallery');

				this.editGalleryError = false;
				this.editGalleryImgError = false;
			},
			addElementGallery() {
				this.$root.$emit('bv::show::modal','modal-add-gallery');
			},
			async uploadAddImgGallery(e) {
				this.galleryElements.push({
					src: '',
					title: '',
					more_keys: [],
					more_values: [],
					forFilter: []
				});

				let index = this.galleryElements.length - 1;
				let idQuiz = this.$router.history.current.params.id;
				const file = e.target.files[0];

				let helpRef = '';
				await fb.storage().ref(`quiz/${idQuiz}_gallery-${index}`).put(file).then((res) => {
					helpRef = res.metadata.fullPath;
				});

				await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
					this.galleryElements[index].src = url;
				}); 
			},
			addNewElementGallery() {
				if(this.$refs.add_title_gallery.$el.value == '' && this.$refs.uploadAddImgGallery.$el.children[1].innerHTML == 'Загрузить изображение...') {
					this.newGalleryError = true;
					this.newGalleryImgError = true;
				} else if(this.$refs.add_title_gallery.$el.value == '' && this.$refs.uploadAddImgGallery.$el.children[1].innerHTML !== 'Загрузить изображение...') {
					this.newGalleryError = true;
					this.newGalleryImgError = false;
				} else if(this.$refs.uploadAddImgGallery.$el.children[1].innerHTML == 'Загрузить изображение...' && this.$refs.add_title_gallery.$el.value !== '') {
					this.newGalleryError = false;
					this.newGalleryImgError = true;
				} else {
					this.newGalleryError = false;
					this.newGalleryImgError = false;

					let editedTitle = this.$refs.add_title_gallery.$el.value,
						galleryKeys = this.$refs.add_more_gallery_info.querySelectorAll('.gallery_key'),
						galleryValues = this.$refs.add_more_gallery_info.querySelectorAll('.gallery_value');

					this.galleryElements[this.galleryElements.length - 1].title = editedTitle;

			    	for (var i = 0; i < this.galleryElements.length; i++) {
						for (var j = 0; j < galleryKeys.length; j++) {
							this.galleryElements[i].more_keys.splice(j, 1, galleryKeys[j].value);
						}
					}

					for (var i = 0; i < galleryValues.length; i++) {
						this.galleryElements[this.galleryElements.length - 1].more_values.splice(i, 1, galleryValues[i].value);
					}

					for (var i = 0; i < this.$refs.select_filter.length; i++) {
						let k = this.$refs.select_filter[i].$el.options.selectedIndex,
							value = this.$refs.select_filter[i].$el.options[k].text;

						this.galleryElements[this.galleryElements.length - 1].forFilter.push(value);
					}

					this.hideModalAddGallery();
				}
			},
			hideModalAddGallery() {
				let galleryKeys = this.$refs.add_more_gallery_info.querySelectorAll('.gallery_key'),
					galleryValues = this.$refs.add_more_gallery_info.querySelectorAll('.gallery_value');

				this.$refs.add_title_gallery.$el.value = '';
				this.$refs.uploadAddImgGallery.$el.children[1].innerHTML = 'Загрузить изображение...';

				for (var i = 0; i < galleryValues.length; i++) {
					galleryValues[i].value = '';
				}

				for (var i = 0; i < galleryKeys.length; i++) {
					galleryKeys[i].value = this.galleryElements[0].more_keys[i];
				}

				for (var i = 0; i < this.$refs.select_filter.length; i++) {
					this.$refs.select_filter[i].$el.options[0].selected = true;
				}

				this.$root.$emit('bv::hide::modal','modal-add-gallery');


				setTimeout(() => {
					this.infoHeight = document.querySelector('.home-item__info').offsetHeight;

					var infoHeight = 420 + this.infoHeight + 'px';

					document.querySelector('.js-slider').style.height = infoHeight;

					for(var i = 0; i < document.querySelectorAll('.home-item__info').length; i++) {
						document.querySelectorAll('.home-item__info')[i].style.bottom = '-' + this.infoHeight + 'px';
					}

					this.setBackground('info_bg', '.home-item__info');
					this.setBorder(this.info_border.show, 'info_border', '.home-item__info');
				}, 0);

				this.newGalleryError = false;
				this.newGalleryImgError = false;
			},
			selectFilter() {
				for (var i = 0; i < this.$refs.select_filter.length; i++) {
		    		let opt = document.createElement('option');
		    	    opt.value = 'Не выбрано';
		    	    opt.innerHTML = 'Не выбрано';
		    	    opt.setAttribute('selected', 'selected');

		    		this.$refs.select_filter[i].$el.insertBefore(opt, this.$refs.select_filter[i].$el.firstChild);
			    }
			},
			selectFilterEdit() {
				for (var i = 0; i < this.$refs.edit_select_filter.length; i++) {
		    		let opt = document.createElement('option');
		    	    opt.value = 'Не выбрано';
		    	    opt.innerHTML = 'Не выбрано';
		    	    opt.setAttribute('selected', 'selected');

			    	this.$refs.edit_select_filter[i].$el.insertBefore(opt, this.$refs.edit_select_filter[i].$el.firstChild);
			    }
			},
			selectFilterNew() {
				let opt = document.createElement('option');
		    	opt.value = 'Не выбрано';
	    	    opt.innerHTML = 'Не выбрано';
	    	    opt.setAttribute('selected', 'selected');

	    		this.$refs.select_filter[this.$refs.select_filter.length - 1].$el.insertBefore(opt, this.$refs.select_filter[this.$refs.select_filter.length - 1].$el.firstChild);

				opt = document.createElement('option');
	    	    opt.value = 'Не выбрано';
	    	    opt.innerHTML = 'Не выбрано';
	    	    opt.setAttribute('selected', 'selected');

	    		this.$refs.edit_select_filter[this.$refs.edit_select_filter.length - 1].$el.insertBefore(opt, this.$refs.edit_select_filter[this.$refs.edit_select_filter.length - 1].$el.firstChild);
			},
			hideModalAddBlock() {
				this.$root.$emit('bv::hide::modal','block-config');
			},
			async uploadImgAddBlock(e, index) {
				let idQuiz = this.$router.history.current.params.id;
				const file = e.target.files[0];

				this.addBlockElements[index].img = file;

				let helpRef = '';
				await fb.storage().ref(`quiz/${idQuiz}_gift-${index}`).put(file).then((res) => {
					helpRef = res.metadata.fullPath;
				});

				await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
					this.addBlockElements[index].src = url;
				}); 

				this.$refs.label_src_add_block[index].innerHTML = this.$refs.src_add_block[index].files[0].name;
			},
			confirmAddBlock() {
				for (var i = 0; i < this.addBlockElements.length; i++) {
					this.addBlockElements[i].title = this.$refs.title_add_block[i].$el.value;
				}

				for (var i = 0; i < this.addBlockElements.length; i++) {
					this.addBlockElements[i].name = this.$refs.name_add_block[i].value;
				}

				this.$root.$emit('bv::hide::modal','block-config');
			},
			deleteAddBlock(index) {
				this.addBlockElements.splice(index, 1);
			},
			newAddBlock() {
				this.addBlockElements.push({
					title: '',
					img: null,
					src: '',
					name: ''
				})
			},
			conditional() {
				var condFunc = condWork.bind(this);

				var condResult = [],
					prevAnswer = this.answersFinal[this.questionIndex - 1],
					arrayIfs = this.questions[this.questionIndex].ifs;

				if(this.questions[this.questionIndex - 1].type == 'checkbox') {
					condResult = arrayIfs.filter(function(elem) {
						for(var i = 0; i < prevAnswer.length; i++) {
							return elem == prevAnswer[i];
						}
					});
				} else if(this.questions[this.questionIndex - 1].type == 'radio') {
					condResult = arrayIfs.filter(function(elem) {
						return elem == prevAnswer;
					});
				}

				if(condResult.length > 0) {
					var nextQ = this.$refs.question[this.questionIndex];
					nextQ.style.display = 'block';

					this.activeBtn();
				} else if(condResult.length == 0) {
					arrayIfs = this.questions[this.questionIndex + 1].ifs;

					condFunc(0);
				}

				function condWork(i) {
					if(arrayIfs != undefined) {
						if(this.questions[this.questionIndex - 1].type == 'checkbox') {
							condResult = arrayIfs.filter(function(elem) {
								for(var i = 0; i < prevAnswer.length; i++) {
									return elem == prevAnswer[i];
								}
							});
						} else if(this.questions[this.questionIndex - 1].type == 'radio') {
							condResult = arrayIfs.filter(function(elem) {
								return elem == prevAnswer;
							});
						}

						if(condResult.length > 0) {
							var nextQ = this.$refs.question[this.questionIndex + 1 + i];
							nextQ.style.display = 'block';

							this.questionIndex += 1 + i;

							this.activeBtn(this.questionIndex + 1 + i);
						} else if(condResult.length == 0) {
							arrayIfs = this.questions[this.questionIndex + 2 + i].ifs;

							i++;
							condFunc(i);
						}	
					} else {
						var nextQ = this.$refs.question[this.questionIndex + 1 + i];
						nextQ.style.display = 'block';

						this.questionIndex += 1 + i;

						this.activeBtn(this.questionIndex + 1 + i);
					}
				}
			},
			activeBtn() {
				var testing = this.$refs.question[this.questionIndex].querySelectorAll('input:not(.add-input)'),
					button = this.$refs.next[this.questionIndex];

				if(this.questions[this.questionIndex].addInput == true && (this.questions[this.questionIndex].type == 'radio' || this.questions[this.questionIndex].type == 'checkbox')) {
					var addInput = this.$refs.addtext[0].querySelector('.add-input');

					addInput.addEventListener('change', () => {
						if(this.config == 'gallery') {
							this.changeSlider();
						}
						this.addChoice(this.v_q);
				    	button.classList.remove("disabled");
				    	if(this.config == 'gallery') {
				    		this.heightInfo;

				    		this.initSlider();
				    		this.openSlide(this.sliderActive);
				    	}
					}, false);
				}

				if(testing.length > 1) {
					if(testing[1].type == "range") {
						button.classList.remove("disabled");
					}
				}

				if(testing.length > 0 && testing[0].type == 'text') {
					button.classList.remove("disabled");
				}

				let this_ = this;

				for (var element of testing) {
			    	element.addEventListener('change', function() {
			    		if(this_.config == 'gallery') {
			    			this_.changeSlider();
			    		}
			    		this_.addChoice(this_.v_q);
			        	button.classList.remove("disabled");
			    
			        	if(this.type != 'checkbox' && this_.questions[this_.questionIndex].addInput == true) {
			        		this_.delFocus();
			        	}

			        	if(this_.config == 'gallery') {
			        		this_.heightInfo;

			        		this_.initSlider();
			        		this_.openSlide(this_.sliderActive);
			        	}
			    	}, false);
				}
			},
			checked() {
				var choices = this.$refs.question[this.questionIndex].querySelectorAll('input:not(.add-input)'),
					temp = '',
					tempArray = [];

				for (var element of choices) {
			    	if (element.type == "radio" && element.checked) {
			            temp = element.value;
			        } else if(element.type == "checkbox" && element.checked) {
			        	tempArray.push(element.value);
			        } else if(element.type == "range") {
			        	temp = element.value;
			        } else if(element.type == "text") {
			        	temp = element.value;
			        }
				}

				if(this.questions[this.questionIndex].addInput) {
					var addInput = this.$refs.addtext[0].querySelector('.add-input');
					tempArray.push(addInput.value);
				}

				if(temp != '') {
					return temp
				} else {
					return tempArray
				}
			},
			changeSlider() {
				var config = this.$refs.background,
					get_started = this.$refs.started,
					slider = this.$refs.slider;
				config.style.backgroundImage = 'none';
				get_started.style.display = 'none';
				slider.style.display = 'block';
			},
			addChoice(value) {
				this.v_qChoices[this.questionIndex] = value;
			},
			//

			initSlider() {
			    setTimeout(() => {
			    	// Получаем элементы сладера и его слайдов
			    	var sliderBody = this.$el.querySelector('.js-slider');

			    	// Записываем длину одного слайда для перелистывания
			    	this.sliderOffsetStep = sliderBody.clientWidth;
			    }, 3)
			},
			openSlide: function (id) {
			    if (id > 0 && id <= this.sliderAllCount) {
			    	this.sliderActive = id
			    	// Сдвигаем элемент со слайдами
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

		    // Date

		    changeCurMonth(n) {
	          let temp = this.curMonth + n
	          if (temp < 0) {
	            this.curYear -= 1
	          } else if (temp >= 12) {
	            this.curYear += 1
	          }
	          this.curMonth = ((temp) + 12) % 12
	        },
	        nextDate(d) {
	          let ret = new Date(d.valueOf())
	          ret.setDate(d.getDate() + 1)
	          return ret
	        },
	        prevDate(d) {
	          let ret = new Date(d.valueOf())
	          ret.setDate(d.getDate() - 1)
	          return ret
	        },
	        getLastDayOfMonth(m) {
	          let ret = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	          if (this.leapYear) {
	            ret[1] = 29
	          }
	          return ret[m]
	        },
	        pickDate(d) {
	          this.pickedDate = d
	          this.curMonth = d.getMonth()
	          this.curYear = d.getFullYear()
	        },
	        onFocus () {
	          this.open = true
	          this.forceOpen = false
	        },
	        onBlur () {
	          this.open = this.forceOpen
	        },
	        onMouseDown () {
	          this.forceOpen = true
	        },
	        onMouseUp () {
	          this.forceOpen = false
	        },
	        updatePickedDate(v) {
	          let reg = new RegExp('(\\d{4})-(\\d{2})-(\\d{2})')
	          let m = reg.exec(v)
	          if (m) {
	            let year = parseInt(m[2])
	            let month = parseInt(m[2])
	            let day = parseInt(m[3])
	            if (month > 12 || month < 1) {
	              return
	            }
	            if (day < 1 || day > this.getLastDayOfMonth(month)) {
	              return
	            }
	            this.pickedDate = new Date(m[1], parseInt(m[2]) - 1, m[3])
	            this.curMonth = parseInt(m[2]) - 1
	            this.curYear = parseInt(m[1])
	          }
	        },

	        bgOverlay(e) {
	        	if(e == true) {
	        		let a = this.bg_overlay.opacity / 100;

	        		this.$el.querySelector('section').style.boxShadow = 'inset 0 0 0 2000px rgba(' + this.bg_overlay.color.rgba.r + ',' + this.bg_overlay.color.rgba.g + ',' + this.bg_overlay.color.rgba.b + ',' + a + ')';
	        	} else {
	        		this.$el.querySelector('section').style.boxShadow = '';
	        	}
	        },
	        clearFiles() {
	        	this.$refs.bg_image_input.$el.querySelector('label').innerHTML = 'Загрузить изображение...';

	        	this.bg_image = '';
	        	this.bg_image_src = '';
            },
            async uploadBgImage(e) {
            	let idQuiz = this.$router.history.current.params.id;
            	const file = e.target.files[0];

            	this.bg_image = file;

            	let helpRef = '';
            	await fb.storage().ref(`quiz/${idQuiz}_bgimage`).put(file).then((res) => {
            		helpRef = res.metadata.fullPath;
            	});

            	await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
            		this.bg_image_src = url;
            	});
            },
            async uploadLogo(e) {
            	let idQuiz = this.$router.history.current.params.id;
            	const file = e.target.files[0];

            	this.head_logo = file;

            	let helpRef = '';
            	await fb.storage().ref(`quiz/${idQuiz}_logo`).put(file).then((res) => {
            		helpRef = res.metadata.fullPath;
            	});

            	await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
            		this.head_logo_src = url;
            	}); 
            },
            async uploadConsultantImg(e) {
            	let idQuiz = this.$router.history.current.params.id;
            	const file = e.target.files[0];

            	this.consultantImg = file;

            	let helpRef = '';
            	await fb.storage().ref(`quiz/${idQuiz}_consultant`).put(file).then((res) => {
            		helpRef = res.metadata.fullPath;
            	});

            	await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
            		this.consultantImgSrc = url;
            	}); 
            },
            async uploadIconVideo(e) {
            	let idQuiz = this.$router.history.current.params.id;
            	const file = e.target.files[0];

            	let helpRef = '';
            	await fb.storage().ref(`quiz/${idQuiz}_iconvideo`).put(file).then((res) => {
            		helpRef = res.metadata.fullPath;
            	});

            	await fb.storage().ref().child(helpRef).getDownloadURL().then(url => {
            		this.video_image = url;
            	});
            },
            radioStyleChange(e) {
            	document.documentElement.style.setProperty('--radio-width-height', this.radio_width_and_height + 'px');
            	document.documentElement.style.setProperty('--radio-width-height', this.radio_width_and_height + 'px');
            },
            radioActiveImage(e) {
            	if(e == true) {
            		document.documentElement.style.setProperty('--inputs-check', '');
            	} else {
            		document.documentElement.style.setProperty('--inputs-check', 'none');
            	}
            },
            checkboxRadius() {
            	document.documentElement.style.setProperty('--checkbox-radius', this.checkbox_border.radius + 'px');	
            },
            checkboxActiveImage(e) {
            	let check = this.checkbox_active_image;
            	if(e == true) {
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
            setBackground(myVar, myElem) {
            	let myObject = eval("(" + "this." + myVar + ")"),
            		a = myObject.opacity / 100,
					myElems = this.$el.querySelectorAll(myElem);

				let rgbColors = this.hexToRgb(myObject.color.hex);

            	for (var i = 0; i < myElems.length; i++) {
            		myElems[i].style.backgroundColor = 'rgba(' + rgbColors.r + ',' + rgbColors.g + ',' + rgbColors.b + ',' + a + ')';
            	}
            },
            setBgRoot(myVar, myElem) {
            	let myObject = eval("(" + "this." + myVar + ")"),
            		a = myObject.opacity / 100;

            	let rgbColors = this.hexToRgb(myObject.color.hex);

            	document.documentElement.style.setProperty(myElem, 'rgba(' + rgbColors.r + ',' + rgbColors.g + ',' + rgbColors.b + ',' + a + ')');
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
            setBorderRoot(e, myVar, myElem) {
            	if(e == true) {
            		let myObject = eval("(" + "this." + myVar + ")");
           		
            		document.documentElement.style.setProperty(myElem, myObject.size + 'px ' + myObject.type + ' ' + myObject.color.hex);
            	} else {
            		document.documentElement.style.setProperty(myElem, '');
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
            		for (var i = 0; i < myElems.length; i++) {
            			myElems[i].style.boxShadow = '';
            		}
            	}
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
            closePopover() {
				this.showPopover = false;
        	},
        	targetPopover(e) {
        		//console.log(e);
        		if(e.target == this.$el.querySelector('.modal-backdrop')) {
        			this.showPopover = false;
        		}
        	},
        	showModalPop(e, pos) {
        		if(this.styleMode == true) {
        			this.showPopover = true;

	        		setTimeout(() => {
	        			if((this.whichPopover == 'bg') || (this.whichPopover == 'fonts')) {
	        				this.$el.querySelector('.my_modal_popover').style.top = '50%';
	        				this.$el.querySelector('.my_modal_popover').style.left = '50%';

	        				this.$el.querySelector('.my_modal_popover').style.transform = 'translate(-50%, -50%)';
	        			} else {
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
	        			}
	        		}, 0)
        		}

        		
        	},
        	forWhichPopover(a) {
        		switch (a) {
        			case 'radio':
        				this.whichPopover = 'question-radio'
        				break;
        			case 'checkbox':
        				this.whichPopover = 'question-checkbox'
        				break;
        			case 'text':
        				this.whichPopover = 'question-text'
        				break;
        			case 'date':
        				this.whichPopover = 'question-date'
        				break;
      				case 'range':
        				this.whichPopover = 'question-range'
        				break;
        		}
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
		watch: {
			v_q() {
				if(this.config == 'gallery') {
					this.initSlider();
					this.openSlide(this.sliderActive);
				}
			},
			v_range() {
				this.rangeProgress();
			}
		},
		filters: {
		    formatMonth(m) {
		      return [
		        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
		    	][m]
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

	.mt-3 {
	    margin-top: 45px;
	}

	.question {
	    padding-left: 60px;
	    position: relative;
	}

	.question-number {
	    position: absolute;
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

	.answer-group {
	    margin-bottom: 15px;
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
	    width: 16px;
	    height: 16px;
	    background: var(--radio-before-background);
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 5px;
	    top: 50%;
	    -webkit-transform: translateY(-50%);
	    -ms-transform: translateY(-50%);
	    -o-transform: translateY(-50%);
	    transform: translateY(-50%);
	    /*opacity: 0;*/
	    -webkit-transition: all .3s;
	    transition: all .3s;
	    box-shadow: var(--radio-before-shadow);
	    z-index: 50
	}

	.answer-group input[type="radio"] + label:after {
	    content: '';
	    width: 26px;
	    height: 26px;
	    border: var(--radio-border);
	    background-color: var(--radio-background);
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 0;
	    top: 1px;
	    box-shadow: var(--radio-shadow);
	    -webkit-transition: all .4s;
	    transition: all .4s;
	}

	.answer-group input[type="radio"]:hover + label:after, .answer-group input[type="checkbox"]:hover + label:after {
		background-color: var(--radio-hover-background);
	    box-shadow: var(--radio-hover-shadow);
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
	    font-family: 'Rubik', sans-serif;
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
	    margin-top: 1rem;
	}

	#result .button {
	    max-width: 375px;
	    width: 100%;
	    margin-top: 0.5rem;
	}

	.agreement label {
	    line-height: 15px;
	    font-size: 12px;
	    font-weight: 300;
	    color: #cecece;
	}

	.answer-group .agreement input[type="radio"] + label:before, .answer-group .agreement input[type="checkbox"] + label:before {
	    left: 5px;
	    top: 8px;
	    width: 18px;
	    height: 18px;
	    background: transparent url(../../static/questions/checkmark.png) no-repeat center center !important;
	}

	#result input[type="radio"] + label:after, #result input[type="checkbox"] + label:after {
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

	.slider-next:hover, .slider-prev:hover {
		background-color: #c71835;
	}

	.slider-next i, .slider-prev i {
		font-size: 1.2rem;
		color: #fff;
	}

	.slider {
	    width: 100%;
	    height: 420px;
	    position: relative;
	    overflow-x: hidden;
	    /* box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.06); */
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
	    /* box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.3); */
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
	    width: auto;
	    margin-right: 15px;
	}

	.home-item__info-value {
	    font-weight: bold;
	}

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

	.answer-group input[type="checkbox"]:hover + label:after {
	    background-color: var(--checkbox-hover-background) !important;
	    -webkit-box-shadow: var(--checkbox-hover-shadow) !important;
	    box-shadow: var(--checkbox-hover-shadow) !important;
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

	section input[type="text"]:focus, section input[type="email"]:focus, section input[type="password"]:focus, section select:focus {
	    /* border-bottom: 1px solid #d4a464; */
	}

	input[type=range] {
	    -webkit-appearance: none;
	    width: 80%;
	    position: relative;
	    top: -16px;
	    /* box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.3); */
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
	    background: var(--range-thumb);
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
	    background: #d51f3c;
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
	    background: #ff0;
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
	    background: #ff0;
	    position: absolute;
	    pointer-events: none;
	    z-index: 5;
	    top: -1px;
	    box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.3);
	}

	::-webkit-input-placeholder {
	    color: #999999;
	}

	::-moz-placeholder {
	    color: #999999;
	}

	:-ms-input-placeholder {
	    color: #999999;
	}

	:-moz-placeholder {
	    color: #999999;
	}

	#date-picker {
	    display: inline-block;
	    color: #000;
	}

	.other-month {
	    opacity: 0.45;
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
	    height: 1.5em;
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
		font-weight: bold;
		opacity: 0.75
	}

	table td {
	    width: 2.2em;
	    height: 2em;
	    vertical-align: middle;
	    text-align: center;
	}

	tbody td {
	    cursor: pointer;
	    border-radius: 100%;
	    /* border-radius: 100%; */
	}

	tbody td.selected {
	    background: var(--calendar-selected);
	    color: var(--calendar-color);
	    border-radius: var(--calendar-radius);
	}

	tbody td.selected:hover {
	    background: var(--calendar-selected);
	    color: var(--calendar-color);
	    border-radius: var(--calendar-radius);
	}

	tbody td:hover {
	    background: var(--calendar-hover-background);
	    border-radius: var(--calendar-radius);
	    color: var(--calendar-hover-color);
	}

	.calendar {
	    background-color: #fff;
	    /* border-radius: 12px; */
	    padding: 0.6em 0.6em;
	    position: absolute;
	    top: 100%;
	    z-index: 99;
	}

	.calendar:before {
	    content: '';
	    width: 0;
	    height: 0;
	    border: solid transparent 8px;
	    border-bottom-width: 8px;
	    border-bottom-style: solid;
	    border-bottom-color: var(--calendar-arrow);
	    position: absolute;
	    bottom: 100%;
	    left: 1.5em;
	    display: var(--calendar-arrow-display);
	}

	.calendar .header {
	    margin-bottom: 0.5rem;
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
	    width: 16px;
	    height: 16px;
	    background: var(--radio-before-background);
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 5px;
	    top: 50%;
	    -webkit-transform: translateY(-50%);
	    -ms-transform: translateY(-50%);
	    -o-transform: translateY(-50%);
	    transform: translateY(-50%);
	    -webkit-transition: all .3s;
	    transition: all .3s;
	    z-index: 192;
	    box-shadow: var(--radio-before-shadow);
	}

	.add-text-circle::after {
	    content: '';
	    width: 26px;
	    height: 26px;
	    border: var(--radio-border);
	    background-color: var(--radio-background);
	    border-radius: 50% 50%;
	    position: absolute;
	    left: 0;
	    top: 50%;
	    transform: translateY(-50%);
	    box-shadow: var(--radio-shadow);
	    -webkit-transition: all .4s;
	    transition: all .4s;
	}

	.add-text-square::before {
	    content: '';
	    width: 16px;
	    height: 16px;
	    background: var(--checkbox-before-background);
	    /* background: #000 url(../../static/questions/checkmark.png) no-repeat center center !important; */
	    /* border-radius: 50% 50%; */
	    position: absolute;
	    left: 4px;
	    top: 17px;
	    -webkit-transition: all .3s;
	    transition: all .3s;
	    z-index: 60;
	    box-shadow: var(--checkbox-before-shadow);
	}

	.add-text-square::after {
	    content: '';
	    width: 24px;
	    height: 24px;
	    border: var(--checkbox-border);
	    background-color: var(--checkbox-background);
	    position: absolute;
	    left: 0;
	    top: 50%;
	    transform: translateY(-50%);
	    /* box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8); */
	    -webkit-transition: all .4s;
	    transition: all .4s;
	    box-shadow: var(--checkbox-shadow);
	    border-radius: var(--checkbox-radius);
	}

	.add-text-circle:hover::after, .add-text-square:hover::after {
		background: var(--radio-hover-background);
	    box-shadow: var(--radio-hover-shadow);
	}

	.add-input {
	    margin-left: 48px !important;
	}

	.add-text-circle.input-focused::before {
	    background-color: var(--radio-checked);
	    background-image: var(--inputs-check);
	    background-position: center center;
	    background-repeat: no-repeat;
	}

	.add-text-square.input-focused::before {
	    background: var(--checkbox-checked);
	    background-image: var(--inputs-checkbox-check);
	    background-position: center center;
	    background-repeat: no-repeat;
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

	.expert-img, .expert-info {
	    margin-bottom: 30px;
	}

	.expert-img {
		height: 146.66px;
	}

	.expert-img img {
	    border-radius: 100%;
	    /* border: 3px solid #f3eae3; */
	    /* box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.12); */
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
	    left: 58px;
	    bottom: 100%;
	    z-index: 2;
	    width: 0;
	    height: 0;
	    border-style: solid;
	    border-width: 0 14px 24px 14px;
	    border-color: transparent transparent #ffffff transparent;
	    display: none;
	}*/

	/*.expert-says::after {
	    content: '';
	    position: absolute;
	    left: 58px;
	    bottom: 100%;
	    width: 0;
	    height: 0;
	    border-style: solid;
	    border-width: 0 14px 21px 14px;
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
	    width: auto;
	    height: auto;
	    position: absolute;
	    /* overflow: hidden; */
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
	    font-family: inherit !important;
	}

	.tooltip .tooltip-image {
	    height: 110px;
	    min-width: 110px;
	    max-width: 110px;
	    /* border-radius: 50%; */
	    overflow: hidden;
	    /* box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3); */
	    background-color: #fff;
	    position: relative;
	    z-index: 3200;
	    /* cursor: pointer; */
	    margin-right: 15px;
	}

	.tooltip .tooltip-image-wrapper {
	    width: 100%;
	    height: 100%;
	    /* border-radius: 50%; */
	    background-position: center;
	    background-repeat: no-repeat;
	    background-size: cover;
	}

	.tooltip .tooltip-description {
	    /* margin-left: 15px; */
	}

	.tooltip .tooltip-title {
	    font-size: 18px;
	    font-weight: bold;
	    color: #fff;
	    white-space: nowrap;
	    display: inline-block;
	    background-color: #d51f3d;
	    padding: 6px 18px;
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
	    display: none;
	}

	.tooltip .tooltip-text {
	    width: 280px;
	    margin-top: 5px;
	    font-size: 14px;
	    font-weight: 400;
	    background-color: rgba(255, 255, 255, 0.9);
	    padding: 10px 15px;
	    color: #000;
	    text-align: left;
	    z-index: 3120;
	    /* box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3); */
	}

	/* End */

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

	.gift:nth-child(2) {
	    padding-right: 15px;
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

	iframe {
	    box-shadow: 0px 0px 30px 0px rgba(241, 225, 200, 0.06);
	}

	.styles_change a.btn_to_edit {
		font-size: 1.35rem;
	}

	.styles_change a.collapsed i {
		-webkit-transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		-o-transform: rotate(180deg);
		transform: rotate(180deg);
		padding-right: 0.5rem;
	}

	.vue-slider-component {
		padding: 0 !important;
	}

	.range_count {
		margin-bottom: 0;
	}

	.logo__logo img {
		max-height: 100px;
	}

	.answers {
		position: relative;
	}

	.for_editing {
		transition: .18s;
		cursor: pointer;
		position: relative;
	}

	/*.for_editing:hover {
		/*background-color: rgba(0, 0, 0, 0.15);*/
		/*background-image: url(../../static/questions/paint-palette-and-brush.png);
		background-repeat: no-repeat;
		background-position: center;
		-webkit-background-size: auto 75%;
		background-size: auto 75%;
	}*/

	.editor-overlay:hover {
		/*content: '';
		display: none;
		width: 100%;
		height: 100%;*/
		background-color: rgba(0, 0, 0, 0.15);
		background-image: url(../../static/questions/paint-palette-and-brush.png);
		background-repeat: no-repeat;
		background-position: center;
		-webkit-background-size: auto 75%;
		background-size: auto 75%;
		/*position: absolute;*/
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

	.answers .editor-overlay:hover {
		background-color: rgba(0, 0, 0, 0.15);
		background-image: url(../../static/questions/paint-palette-and-brush.png);
		background-repeat: no-repeat;
		background-position: center;
		-webkit-background-size: auto 36%;
		background-size: auto 36%;
	}

	.quiz-gifts .editor-overlay:hover {
		background-color: rgba(0, 0, 0, 0.15);
		background-image: url(../../static/questions/paint-palette-and-brush.png);
		background-repeat: no-repeat;
		background-position: center;
		-webkit-background-size: auto 24%;
		background-size: auto 24%;
	}

	.slider .editor-overlay:hover {
		background-color: rgba(0, 0, 0, 0.15);
		background-image: url(../../static/questions/paint-palette-and-brush.png);
		background-repeat: no-repeat;
		background-position: center;
		-webkit-background-size: auto 24%;
		background-size: auto 24%;
	}

	.video-block .editor-overlay:hover {
		background-color: rgba(0, 0, 0, 0.15);
		background-image: url(../../static/questions/paint-palette-and-brush.png);
		background-repeat: no-repeat;
		background-position: center;
		-webkit-background-size: auto 24%;
		background-size: auto 24%;
	}

	.head_desc .editor-overlay {
		height: 100%;
	}

	.progress .editor-overlay {
		height: inherit;
		width: 1110px;
	}

	.btn_wrapper {
		position: relative;
	}

	.modal-backdrop {
	    position: fixed;
	    top: 0;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    background-color: rgba(0, 0, 0, 0);
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

	.main_style_change {
		display: flex;
		-webkit-flex-direction: column;
		-moz-flex-direction: column;
		-ms-flex-direction: column;
		-o-flex-direction: column;
		flex-direction: column;
		position: absolute;
		background-color: #fff;
		border-radius: 1rem;
		top: 30px;
		right: 30px;
		border: 1px solid rgba(0,0,0,0.125);
		z-index: 99601;
	}

	.main_style_change div {
		padding: 15px;
		border-radius: 1rem;
	}

	.main_style_change div:hover {
		background-color: #f8f9fa;
	}

	.error {
		padding-top: 6px;
		display: inline-block;
	}

	.type_top {
		height: 32px;
	}

	.img-radio {
		background: url(../../static/img/radio.png) no-repeat center;
		-webkit-background-size: auto 28px;
		background-size: auto 28px;
	}

	.img-checkbox {
		background: url(../../static/img/checkbox.png) no-repeat center;
		-webkit-background-size: auto 28px;
		background-size: auto 28px;
	}

	.img-input {
		background: url(../../static/img/input.png) no-repeat center;
		-webkit-background-size: auto 24px;
		background-size: auto 24px;
	}

	.img-calendar {
		background: url(../../static/img/q_calendar.png) no-repeat center;
		-webkit-background-size: auto 28px;
		background-size: auto 28px;
	}

	.img-range {
		background: url(../../static/img/range.png) no-repeat center;
		-webkit-background-size: auto 20px;
		background-size: auto 20px;
	}

	.type_active .img-radio {
		background: url(../../static/img/radio_white.png) no-repeat center;
		-webkit-background-size: auto 28px;
		background-size: auto 28px;
	}

	.type_active .img-checkbox {
		background: url(../../static/img/checkbox_white.png) no-repeat center;
		-webkit-background-size: auto 28px;
		background-size: auto 28px;
	}

	.type_active .img-input {
		background: url(../../static/img/input_white.png) no-repeat center;
		-webkit-background-size: auto 24px;
		background-size: auto 24px;
	}

	.type_active .img-calendar {
		background: url(../../static/img/calendar_white.png) no-repeat center;
		-webkit-background-size: auto 28px;
		background-size: auto 28px;
	}

	.type_active .img-range {
		background: url(../../static/img/range_white.png) no-repeat center;
		-webkit-background-size: auto 20px;
		background-size: auto 20px;
	}

	.quiz_input_range {
		border-bottom-right-radius: 0px !important;
		border-bottom-left-radius: 0px !important;
	}

	#modal-cond .fa-question-circle {
		font-size: 0.9rem;
	}

	@media screen and (max-width: 1199px) {
	    .questions {
	        padding-right: 15px;
	    }

	    .answer-group input[type="radio"] + label:before {
	    	top: 14px;
	    }

	    .answer-group input[type="checkbox"] + label:before {
	        top: 50%;
	    }

	    #date-picker input {
	        width: 100%;
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

	    .answer-group input[type="radio"] + label:before {
	    	top: 14px;
	    }

	    .answer-group input[type="checkbox"] + label:before {
	        top: 50%;
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

	    .gift-item {
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

	    .gift-item-text {
	        width: 100%;
	        padding-left: 0;
	        margin-top: 15px;
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

	    .answer-group input[type="radio"] + label:before {
	    	top: 14px;
	    }

	    .answer-group input[type="checkbox"] + label:before {
	        top: 50%;
	    }

	    .calendar {
	    	width: 125%;
	    }

	    .video-title img {
	    	display: none;
	    }

	    .answer-group input[type="checkbox"] + label:before {
	        top: 11px;
	    }

	    #progress-bar {
	        font-size: 100% !important;
	    }
	}
</style>