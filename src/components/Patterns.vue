<template>
  <b-container fluid class="main_content">
    <h2 class="mb-5">Выберите стиль квиза</h2>
    <b-row>
      <b-col md="6" xl="4">
        <b-card
          img-src="../../static/img/bg-img.jpg"
          img-alt="Image"
          img-top
          tag="article"
          class="mb-5"
        >
          <b-row>
            <b-col>
              <b-button variant="primary" class="mr-3 mt-1 mb-1" @click="createQuiz('design')">
                <span>Выбрать</span>
              </b-button>
              <b-button
                class="btn-outline-primary mt-1 mb-1"
                @click="lookQuiz('-LajdJ-NW5lF0YX2WJ6S')"
              >
                <span>Посмотреть</span>
                <i class="far fa-eye ml-2"></i>
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col md="6" xl="4">
        <b-card
          img-src="../../static/questions/MHA.JR_201708_038.jpg"
          img-alt="Image"
          img-top
          tag="article"
          class="mb-5"
        >
          <b-row>
            <b-col>
              <b-button variant="primary" class="mr-3 mt-1 mb-1" @click="createQuiz('house')">
                <span>Выбрать</span>
              </b-button>
              <b-button
                class="btn-outline-primary mt-1 mb-1"
                @click="lookQuiz('-LajfeEs38ETWbwLTab2')"
              >
                <span>Посмотреть</span>
                <i class="far fa-eye ml-2"></i>
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col md="6" xl="4">
        <b-card
          img-src="../../static/questions/sport.jpg"
          img-alt="Image"
          img-top
          tag="article"
          class="mb-5"
        >
          <b-row>
            <b-col>
              <b-button variant="primary" class="mr-3 mt-1 mb-1" @click="createQuiz('product')">
                <span>Выбрать</span>
              </b-button>
              <b-button
                class="btn-outline-primary mt-1 mb-1"
                @click="lookQuiz('-LajfsbQjl_AckPv9rSH')"
              >
                <span>Посмотреть</span>
                <i class="far fa-eye ml-2"></i>
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import patternDesign from '@/patterns/design.js';
import patternHouse from '@/patterns/house.js';
import patternProduct from '@/patterns/product.js';

	export default {
		data() {
			return {
        router: ''
			}
		},
    mounted() {
      this.router = this.$router;
    },
    methods: {
      createQuiz(style) {
        let dataForQuizzes = {
            "quiz_name": "Новый квиз",
            "metrika": "",
            "analytics": "",
            "questions": [
                {
                    "question": "Первый вопрос (радиокнопки)",
                    "choices": [
                        "Первый ответ",
                        "Второй ответ",
                        "Очередной ответ"
                    ],
                    "type": "radio",
                    "addInput": true,
                    "placeholder": "Какая-то подсказка",
                    "class": "add-text-circle",
                    "helpTitle": [
                        "Заголовок подсказки",
                        "Заголовок подсказки",
                        "Заголовок подсказки"
                    ],
                    "helpText": [
                        "Текст подсказки",
                        "Текст подсказки",
                        "Текст подсказки"
                    ],
                    "helpImage": [
                        "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_answer-0-0?alt=media&token=77c10cef-4df0-4ec9-b000-e379a3c14dc8",
                        "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_answer-0-1?alt=media&token=38e2b97c-7cd8-436c-aeb7-00ef6d542101",
                        "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_answer-0-2?alt=media&token=20ee0f9d-9817-4928-9d9c-bab7828bbcda",
                        "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_answer-0-4?alt=media&token=8564a7e6-3c39-447d-a511-ef79209dd24e"
                    ],
                    "forText": "Значение по умолчанию",
                    "forTextPlaceholder": "Подсказка для поля",
                    "min": "1",
                    "max": 100,
                    "step": "1",
                    "default": 70
                },
                {
                    "question": "2-ой (чекбоксы)",
                    "type": "checkbox",
                    "choices": [
                        "Первый вариант",
                        "Второй вариант",
                        "Третий вариант"
                    ],
                    "helpTitle": [
                        "",
                        "",
                        ""
                    ],
                    "helpText": [
                        "",
                        "",
                        ""
                    ],
                    "helpImage": [
                        
                    ],
                    "addInput": true,
                    "class": "add-text-square",
                    "placeholder": "Какая-то подсказка",
                    "forText": "",
                    "forTextPlaceholder": "",
                    "min": 0,
                    "max": 100,
                    "step": 1,
                    "default": 50
                },
                {
                    "question": "3-ий (текст. поле)",
                    "type": "text",
                    "choices": [
                        
                    ],
                    "helpTitle": [
                        
                    ],
                    "helpText": [
                        
                    ],
                    "helpImage": [
                        
                    ],
                    "addInput": false,
                    "class": "",
                    "placeholder": "",
                    "forText": "Значение по умолчанию",
                    "forTextPlaceholder": "Подсказка для поля",
                    "min": 0,
                    "max": 100,
                    "step": 1,
                    "default": 50
                },
                {
                    "question": "4-ый (выбор даты)",
                    "type": "date",
                    "choices": [
                        
                    ],
                    "helpTitle": [
                        
                    ],
                    "helpText": [
                        
                    ],
                    "helpImage": [
                        
                    ],
                    "addInput": false,
                    "class": "",
                    "placeholder": "",
                    "forText": "",
                    "forTextPlaceholder": "",
                    "min": 0,
                    "max": 100,
                    "step": 1,
                    "default": 50
                },
                {
                    "question": "5-ый (ползунок)",
                    "type": "range",
                    "choices": [
                        
                    ],
                    "helpTitle": [
                        
                    ],
                    "helpText": [
                        
                    ],
                    "helpImage": [
                        
                    ],
                    "addInput": false,
                    "class": "",
                    "placeholder": "",
                    "forText": "",
                    "forTextPlaceholder": "",
                    "min": 0,
                    "max": 100,
                    "step": 1,
                    "default": 50
                }
            ],
            "config": "gallery",
            "galleryElements": [
                {
                    "src": "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_gallery-0?alt=media&token=e07237e5-9382-47a1-bc1f-d9b906a220db",
                    "title": "Первый для примера",
                    "more_keys": [
                        "Доп. заголовок"
                    ],
                    "more_values": [
                        "и к нему описание"
                    ],
                    "forFilter": [
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано"
                    ]
                },
                {
                    "src": "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_gallery-1?alt=media&token=7ab6e6b9-7956-4ec1-b82b-20a4e25f0385",
                    "title": "Второй",
                    "more_keys": [
                        "Доп. заголовок"
                    ],
                    "more_values": [
                        "Доп. описание"
                    ],
                    "forFilter": [
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано"
                    ]
                },
                {
                    "src": "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_gallery-2?alt=media&token=3d016565-c877-491d-83ed-c161ae055480",
                    "title": "Третий",
                    "more_keys": [
                        "Доп. заголовок"
                    ],
                    "more_values": [
                        "Доп. описание"
                    ],
                    "forFilter": [
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано"
                    ]
                },
                {
                    "src": "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_gallery-3?alt=media&token=8dd7745d-5d7a-45c3-afcb-0e978f385f9c",
                    "title": "Четвертый",
                    "more_keys": [
                        "Доп. заголовок"
                    ],
                    "more_values": [
                        "Доп. описание"
                    ],
                    "forFilter": [
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано"
                    ]
                },
                {
                    "src": "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_gallery-4?alt=media&token=def96a90-df81-4d6d-a260-a90db59daa26",
                    "title": "Пятый",
                    "more_keys": [
                        "Доп. заголовок"
                    ],
                    "more_values": [
                        "Доп. описание"
                    ],
                    "forFilter": [
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано",
                        "Не выбрано"
                    ]
                }
            ],
            "youtubePlayer": "true",
            "videoElements": [
                {
                    "src": "",
                    "readySrc": "?autoplay=1",
                    "localSrc": "",
                    "autoplay": true
                },
                {
                    "src": "",
                    "readySrc": "",
                    "localSrc": "",
                    "autoplay": false
                },
                {
                    "src": "",
                    "readySrc": "",
                    "localSrc": "",
                    "autoplay": false
                },
                {
                    "src": "",
                    "readySrc": "",
                    "localSrc": "",
                    "autoplay": false
                },
                {
                    "src": "",
                    "readySrc": "",
                    "localSrc": "",
                    "autoplay": false
                }
            ],
            "localVideo": null,
            "consultantName": "Имя и фамилия",
            "consultantDescription": "Должность консультанта",
            "consultantImgSrc": "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_consultant?alt=media&token=bab6b329-ac5b-41cc-8eff-6b1ba97314c0",
            "moreConsultantText": [
                {
                    "text": "Пример дополнительного текста",
                    "fz": "16",
                    "fw": "bold",
                    "mb": "6"
                },
                {
                    "text": "Можно оставить важную информацию",
                    "fz": 16,
                    "fw": "normal",
                    "mb": 0
                }
            ],
            "consultantElements": [
                {
                    words: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов.'
                },
                {
                    words: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов.'
                },
                {
                    words: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов.'
                },
                {
                    words: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов.'
                },
                {
                    words: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов.'
                }
            ],
            "addBlockElements": [
                {
                    "title": "Заголовок блока",
                    "img": {
                        
                    },
                    "src": "https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/quiz%2F-L_Rgy9J1mbURi9K48ce_gift-0?alt=media&token=c4a882b8-9d75-44ff-bbed-84892453b01b",
                    "name": "Подробное описание этого блока"
                }
            ],
            "v_range": 0,
            "infoHeight": 62,
            "sliderAllCount": 5,
            "sliderActive": 1,
            "sliderOffsetLeft": 0,
            "sliderOffsetStep": 540,
            "lastVideoElements": [
                {
                    "src": "",
                    "readySrc": "",
                    "localSrc": "",
                    "autoplay": false
                }
            ],
            "lastConsultantElements": 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов.',
            "resultTitleQ": "Остался последний шаг. Заберите результаты теста и подарки!",
            "resultDescQ": "Вы гарантировано получите: ",
            "resultAddGifts": "Сравнительная таблица поставщиков услуг",
            "addGiftsList": [
                "Преимущество №1",
                "Преимущество №2",
                "Преимущество №3"
            ],
            "btnText": "Забрать результаты",
            "politicsUrl": "",
            "inputs": [
                {
                    "show": false,
                    "type": "text",
                    "name": "Имя",
                    "placeholder": "Как к вам обращаться?",
                    "required": true
                },
                {
                    "show": true,
                    "type": "text",
                    "name": "Телефон",
                    "placeholder": "Введите ваш номер телефона",
                    "required": false
                },
                {
                    "show": false,
                    "type": "email",
                    "name": "Email",
                    "placeholder": "Электронный ящик для отправки расчета",
                    "required": false
                }
            ],
            "phoneMask": "",
            "selectMask": null,
            "readyMask": "",
            "userInputPhone": "",
            "messengerLink": [
                {
                    "name": "Telegram",
                    "src": "telegram_btn.png",
                    "show": true,
                    "label": "Введите номер или логин Telegram",
                    "placeholder": "+7 (999) 999-99-99"
                },
                {
                    "name": "Viber",
                    "src": "viber_btn.png",
                    "show": true,
                    "label": "Введите номер Viber",
                    "placeholder": "+7 (999) 999-99-99"
                },
                {
                    "name": "WhatsApp",
                    "src": "whatsapp_btn.png",
                    "show": true,
                    "label": "Введите номер WhatsApp",
                    "placeholder": "+7 (999) 999-99-99"
                },
                {
                    "name": "Messenger",
                    "src": "messenger_btn.png",
                    "show": true,
                    "label": "Введите логин или id Messenger",
                    "placeholder": "login"
                },
                {
                    "name": "VK",
                    "src": "vk_btn.png",
                    "show": true,
                    "label": "Введите логин или id VK",
                    "placeholder": "id123456789"
                }
            ],
            "messengerBtnText": "Забрать результаты",
            "messengersTitle": "Куда присылать результаты?",
            "animation": true,
            "loaderCheck": "",
            "customEmails": [
                {
                    "name": this.$store.getters.user.email,
                    "active": true
                }
            ],
            "readyEmail": [
                this.$store.getters.user.email
            ],
            "autoOpenCh": false,
            "autoOpen": false,
            "exitOpen": false,
            "exitOpenOnce": true,
            "modal": "full",
            "linkLocation": {
                "show": false,
                "url": ""
            }
        }

        let styleForQuizzes = {};
        console.log(patternDesign);
        switch (style) {
          case 'design':
            styleForQuizzes = patternDesign;
            break;
          case 'house':
            styleForQuizzes = patternHouse;
            break;
          case 'product':
            styleForQuizzes = patternProduct;
            break;
        }

        let dataForQuiz = {
              owner: this.$store.state.user.user.id,
              name: 'Новый квиз',
              questions: JSON.stringify(dataForQuizzes),
              styles: JSON.stringify(styleForQuizzes)
            };

        $.ajax({
          type: 'POST',
            url: 'https://myquiz-9b908.firebaseio.com/quizzes.json',
            data: JSON.stringify(dataForQuiz),
            success: (data, textStatus, request, response) => {
              this.router.push({ path: `/edit/${data.name}/questions` })
            },
            error: (request, textStatus, errorThrown, response) => {    
            }
        });
      },
      lookQuiz(id) {
        function loadCSS(hf) {
            var ms=document.createElement("link");ms.rel="stylesheet";
            ms.href=hf;document.getElementsByTagName("head")[0].appendChild(ms);
        }
        loadCSS("https://firebasestorage.googleapis.com/v0/b/myquiz-9b908.appspot.com/o/qlead.css?alt=media&token=5035e9cb-e409-4342-b958-28c0e9913591");

        function Qlead() {
            this.openQuiz = function() {
                document.querySelectorAll('.qlead-modal')[0].classList.add('qlead-modal-open');
                document.querySelectorAll('body')[0].classList.add('qlead-body-modal-open');
            }

            this.closeQuiz = function() {
                document.querySelectorAll('.qlead-modal')[0].classList.remove('qlead-modal-open');
                document.querySelectorAll('body')[0].classList.remove('qlead-body-modal-open');

                document.querySelectorAll('.qlead-modal')[0].remove();
            }

            this.init = function(obj) {
                var e = document.createElement('div');
                    e.classList.add('qlead-modal');

                if(obj.modal === 'full') {
                    e.innerHTML = '<iframe src="https://app.qlead.in/quiz/?id=' + obj.id + '" width="100%" height="100%" frameborder="0"></iframe><button onclick="this.closeQuiz" type="button" aria-label="Close" class="qlead-modal-close">×</button>';
                    document.body.appendChild(e);
                } else {
                    e.innerHTML = '<div class="qlead-really-modal"><iframe src="https://app.qlead.in/quiz/?id=' + obj.id + '" width="100%" height="100%" frameborder="0"></iframe></div><button type="button" aria-label="Close" class="qlead-modal-close">×</button>';
                    document.body.appendChild(e);
                }
                
                if(obj.autoOpen !== false && typeof(obj.autoOpen) === 'number') {
                    setTimeout(() => {
                        document.querySelectorAll('.qlead-modal')[0].classList.add('qlead-modal-open');
                        document.querySelectorAll('body')[0].classList.add('qlead-body-modal-open');
                    }, obj.autoOpen * 1000)
                }

                if(obj.exitOpen === true) {
                    if(obj.exitOpenOnce === true) {
                        if(!window.localStorage.getItem('quizModal')) {
                            document.addEventListener("mouseleave", function(e) {
                                if(e.clientY < 0) {
                                    document.querySelectorAll('.qlead-modal')[0].classList.add('qlead-modal-open');
                                    document.querySelectorAll('body')[0].classList.add('qlead-body-modal-open');

                                    if(obj.exitOpenOnce === true) {
                                        window.localStorage.setItem('quizModal', 'true');
                                    }
                                }
                            });
                        }
                    } else {
                        document.addEventListener("mouseleave", function(e) {
                            if(e.clientY < 0) {
                                document.querySelectorAll('.qlead-modal')[0].classList.add('qlead-modal-open');
                                document.querySelectorAll('body')[0].classList.add('qlead-body-modal-open');
                            }
                        });
                    }
                }
            }
        }

        //
        var qlead = new Qlead;
                qlead.init({
                    id: id, 
                    autoOpen: false, 
                    exitOpen: false, 
                    exitOpenOnce: false, 
                    modal: 'modal' 
                });
                document.querySelector('.qlead-modal-close').addEventListener("click", qlead.closeQuiz); 

        document.querySelectorAll('.qlead-modal')[0].classList.add('qlead-modal-open');
        document.querySelectorAll('body')[0].classList.add('qlead-body-modal-open');
      }
    }
	}
</script>

<style>
.select_empty_pattern {
  background-color: #fff;
  height: calc(100% - 3rem);
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.select_empty_pattern button {
  height: 100%;
  font-size: 2rem;
  white-space: normal;
}

.qlead-modal-close {
  border: none;
  left: calc(100% - 60px) !important;
  cursor: pointer;
}

@media (max-width: 575.98px) {
  .select_empty_pattern button {
    font-size: 1.5rem;
  }
}
</style>