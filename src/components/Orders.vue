<template>
  <b-container fluid class="main_content">
    <b-row>
      <b-col>
        <b-card title="Полный отчет всех заявок" tag="article">
          <b-form inline class="mb-4 mt-4">
            <label class="sr-only" for="inlineFormInputName2">Поиск по имени</label>
            <b-input
              class="mb-2 mt-2 mr-sm-3"
              id="inlineFormInputName2"
              placeholder="Поиск по имени"
              v-model="nameFilter"
              @keydown.native="sortParam = 'name'"
            />
            <label class="sr-only" for="inlineFormInputGroupDate">От</label>
            <div class="input-group datepicker mb-2 mt-2 mr-sm-3">
              <v-date-picker v-model="selectedDate" :attributes="attrs" mode="range"></v-date-picker>
            </div>
            <b-form-select v-model="selected" :options="options" class="mb-2 mt-2 mr-sm-3" />
            <label class="sr-only" for="inlineFormInputGroupFrom">Откуда</label>
            <b-input-group left="@" class="mb-2 mt-2 mr-sm-3">
              <b-input
                id="inlineFormInputGroupFrom"
                placeholder="Откуда"
                v-model="fromFilter"
                @keydown.native="sortParam = 'from'"
              />
            </b-input-group>
            <b-button
              type="reset"
              @click="resetInputs()"
              class="btn-outline-danger mb-2 mt-2"
            >Сбросить</b-button>
          </b-form>
          <clip-loader :loading="loadingO" v-if="loadingO" :size="'50px'" style="margin-top: 30px"></clip-loader>
          <div class="table-responsive-sm" v-else>
            <table aria-busy="false" aria-colcount="3" aria-rowcount="5" class="table b-table">
              <thead>
                <tr>
                  <th :aria-colindex="index" v-for="(field, index) in fields">{{ field }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class v-for="(order, index) in sortedList">
                  <td aria-colindex="1">{{ order.name }}</td>
                  <td aria-colindex="2">{{ order.phone }}</td>
                  <td aria-colindex="3">
                    <b-button
                      :variant="order.btn"
                      class="btn-block"
                      ref="btnStatus"
                      :id="'exPopoverReactive' + index"
                    >{{ order.status }}</b-button>
                    <b-popover
                      :target="'exPopoverReactive' + index"
                      triggers="click"
                      placement="auto"
                      container="myContainer"
                      ref="popover"
                    >
                      <template slot="title">
                        <b-btn @click="onClose" class="close" aria-label="Close">
                          <span class="d-inline-block" aria-hidden="true">&times;</span>
                        </b-btn>Изменить статус
                      </template>
                      <div>
                        <b-button
                          variant="light"
                          @click="changeStatus($event, index, order.id, 'light', order.name, order.phone, order.email, order.quiz_from, order.quiz_url, order.question, order.answers, order.date, order.quiz_id)"
                          class="btn-block"
                        >Новое обращение</b-button>
                        <b-button
                          variant="success"
                          @click="changeStatus($event, index, order.id, 'success', order.name, order.phone, order.email, order.quiz_from, order.quiz_url, order.question, order.answers, order.date, order.quiz_id)"
                          class="btn-block"
                        >Обработано</b-button>
                        <b-button
                          variant="warning"
                          @click="changeStatus($event, index, order.id, 'warning', order.name, order.phone, order.email, order.quiz_from, order.quiz_url, order.question, order.answers, order.date, order.quiz_id)"
                          class="btn-block"
                        >Думает...</b-button>
                        <b-button
                          variant="danger"
                          @click="changeStatus($event, index, order.id, 'danger', order.name, order.phone, order.email, order.quiz_from, order.quiz_url, order.question, order.answers, order.date, order.quiz_id)"
                          class="btn-block"
                        >Отказано</b-button>
                      </div>
                    </b-popover>
                  </td>
                  <td aria-colindex="4">{{ order.quiz_from }}</td>
                  <td aria-colindex="5">
                    <b-link href="#">
                      <span
                        class="d-none d-xl-block"
                        v-b-modal.modal1
                        @click="curOrder = order.id"
                      >Открыть карточку клиента</span>
                      <span class="d-xl-none" v-b-modal.modal1>Подробнее</span>
                    </b-link>
                  </td>
                  <td aria-colindex="6">
                    <b-button
                      variant="outline-primary"
                      @click="deleteOrder(order.id)"
                      title="Удалить"
                    >
                      <i class="far fa-trash-alt"></i>
                    </b-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              class="text-center mt-3"
              v-show="filteredEmpty"
            >{{ nameFilter === '' && fromFilter === '' && selected === null ? 'Заявок пока нет' : 'Совпадений не найдено' }}</p>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-modal id="modal1" title="Карточка клиента" ok-only size="lg">
      <div v-for="(order, index) in orders">
        <b-row>
          <template v-if="order.mesName === undefined || order.mesName === ''">
            <b-col xl="2">
              <strong>Имя:</strong>
            </b-col>
            <b-col xl="10">
              <p>{{ order.name }}</p>
            </b-col>
            <b-col xl="2">
              <strong>Телефон:</strong>
            </b-col>
            <b-col xl="10">
              <p>{{ order.phone }}</p>
            </b-col>
            <b-col xl="2">
              <strong>Email:</strong>
            </b-col>
            <b-col xl="10">
              <p>{{ order.email }}</p>
            </b-col>
          </template>
          <template v-if="order.mesName && order.mesName !== ''">
            <b-col xl="2">
              <strong>Мессенджер:</strong>
            </b-col>
            <b-col xl="10">
              <img
                :src="order.mesName === 'VK' ? '../../static/img/vk_btn.png' :
      						       order.mesName === 'WhatsApp' ? '../../static/img/whatsapp_btn.png' :
      						       order.mesName === 'Viber' ? '../../static/img/viber_btn.png' :
      						       order.mesName === 'Telegram' ? '../../static/img/telegram_btn.png' :
      						       order.mesName === 'Messenger' ? '../../static/img/messenger_btn.png' :
      						       'undefined'"
                height="18"
                width="18"
              />
              <span>{{ order.mesName }} —</span>
              <span>{{ order.mesValue }}</span>
            </b-col>
          </template>
          <b-col xl="2">
            <strong>Статус:</strong>
          </b-col>
          <b-col xl="10">
            <p>{{ order.status }}</p>
          </b-col>
          <b-col xl="2">
            <strong>Откуда:</strong>
          </b-col>
          <b-col xl="10">
            <p>{{ order.quiz_from }}</p>
          </b-col>
          <b-col xl="12">
            <hr />
          </b-col>
          <b-col xl="12">
            <div
              v-for="(count, index, key) in order.question"
              :class="index + 1 != order.answers.length ? 'mb-3' : ''"
            >
              <p>{{ count }}:</p>
              <strong>{{ order.answers[index] | toString }}</strong>
            </div>
          </b-col>
          <b-col xl="12">
            <hr />
          </b-col>
          <b-col xl="2">
            <strong>Создано:</strong>
          </b-col>
          <b-col xl="10">
            <p>{{ order.date | toDate }}</p>
          </b-col>
          <b-col xl="2">
            <strong>Адрес:</strong>
          </b-col>
          <b-col xl="10">
            <p>{{ order.quiz_url }}</p>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  components: { ClipLoader },
  data() {
    return {
      nameFilter: '',
      fromFilter: '',
      startDate: '',
      endDate: '',
      curOrder: 0,
      lorem: 0,
      fields: ['Имя', 'Телефон', 'Статус', 'Откуда', '', ''],
      selected: null,
      options: [
        { value: null, text: 'Сортировка по статусу', disabled: true },
        { value: 'Все', text: 'Все' },
        { value: 'Новое обращение', text: 'Новое обращение' },
        { value: 'Обработано', text: 'Обработано' },
        { value: 'Думает...', text: 'Думает...' },
        { value: 'Отказано', text: 'Отказано' }
      ],
      filteredEmpty: false,
      attrs: [
        {
          //key: 'today',
          //dates: new Date(),
        }
      ],
      selectedDate: {
        start: new Date(2019, 2, 1),
        end: new Date(2019, 11, 31)
      }
    }
  },
  created() {
    this.$store.dispatch('getOrders')
    this.$store.dispatch('getQuizzes')

    this.$store.commit('setLoadingO', true)
  },
  mounted() {
    function $_GET(key) {
      var s = window.location.search
      s = s.match(new RegExp(key + '=([^&=]+)'))
      return s ? s[1] : false
    }
    let quizID = $_GET('from')

    if (decodeURI(quizID) != 'false') {
      this.fromFilter = decodeURI(quizID)
      console.log(this.fromFilter)
    }
  },
  computed: {
    orders() {
      let sliced = this.lorem
      sliced = {}
      sliced = this.$store.getters.orders.filter(order => {
        return order.id == this.curOrder
      })
      return sliced
    },
    filtered() {
      return this.$store.getters.orders.filter(order => {
        return order.name.toLowerCase().includes(this.nameFilter.toLowerCase())
      })
    },
    sortedList() {
      let filtered = [{}]
      this.filteredEmpty = false

      if (this.nameFilter != '') {
        filtered = this.$store.getters.orders.filter(order => {
          return order.name
            .toLowerCase()
            .includes(this.nameFilter.toLowerCase())
        })
      }

      if (this.fromFilter != '') {
        if (
          Object.keys(filtered).length == 1 &&
          Object.keys(filtered[0]).length == 0
        ) {
          filtered = this.$store.getters.orders.filter(order => {
            return order.quiz_from
              .toLowerCase()
              .includes(this.fromFilter.toLowerCase())
          })
        } else {
          filtered = filtered.filter(order => {
            return order.quiz_from
              .toLowerCase()
              .includes(this.fromFilter.toLowerCase())
          })
        }
      }

      if (this.selected != null) {
        if (this.selected == 'Все') {
          if (Object.keys(filtered).length == 1) {
            filtered = this.$store.getters.orders
          } else {
            filtered = filtered.filter(order => {
              return order.status != this.selected
            })
          }
        } else {
          if (
            Object.keys(filtered).length == 1 &&
            Object.keys(filtered[0]).length == 0
          ) {
            filtered = this.$store.getters.orders.filter(order => {
              return order.status == this.selected
            })
          } else {
            filtered = filtered.filter(order => {
              return order.status == this.selected
            })
          }
        }
      }

      let endDay = Date.parse(this.selectedDate.end)
      let endDayReady = endDay + 86400000

      if (
        Object.keys(filtered).length == 1 &&
        Object.keys(filtered[0]).length == 0
      ) {
        filtered = this.$store.getters.orders.filter(data => {
          return (
            new Date(data.date) >= this.selectedDate.start &&
            new Date(data.date) <= new Date(endDayReady)
          )
        })
      } else {
        filtered = filtered.filter(data => {
          return (
            new Date(data.date) >= this.selectedDate.start &&
            new Date(data.date) <= new Date(endDayReady)
          )
        })
      }

      if (Object.keys(filtered).length == 1) {
        if (
          this.nameFilter == '' &&
          this.fromFilter == '' &&
          this.startDate == '' &&
          this.endDate == '' &&
          this.selected == null
        ) {
          return this.$store.getters.orders
        } else {
          return filtered
        }
      } else if (filtered.length == 0) {
        this.filteredEmpty = true
        return filtered
      } else {
        return filtered
      }
    },
    loadingO() {
      return this.$store.getters.loadingO
    }
  },
  methods: {
    onClose() {
      this.$root.$emit('bv::hide::popover')
    },
    changeStatus(
      e,
      index,
      i,
      status,
      name,
      phone,
      email,
      quiz_name,
      quiz_url,
      questions,
      answers,
      date,
      quiz_id
    ) {
      let this_ = this

      function APIstatus(i, status, text) {
        let urlAPI = 'https://myquiz-9b908.firebaseio.com/orders/' + i + '.json'

        let dataForStatus = {
          name: name,
          phone: phone,
          email: email,
          status: text,
          btn: status,
          quiz_from: quiz_name,
          quiz_url: quiz_url,
          question: JSON.stringify(questions),
          answers: JSON.stringify(answers),
          date: date,
          quiz_id: quiz_id
        }

        $.ajax({
          type: 'PUT',
          url: urlAPI,
          data: JSON.stringify(dataForStatus),
          success: function(data, textStatus, request, response) {
            this_.$store.dispatch('getOrders')
          },
          error: function(request, textStatus, errorThrown, response) {}
        })
      }

      this.$refs.btnStatus[index].className = `btn btn-block btn-${status}`
      switch (status) {
        case 'light':
          this.$refs.btnStatus[index].innerText = 'Новое обращение'
          APIstatus(i, status, 'Новое обращение')
          break
        case 'success':
          this.$refs.btnStatus[index].innerText = 'Обработано'
          APIstatus(i, status, 'Обработано')
          break
        case 'warning':
          this.$refs.btnStatus[index].innerText = 'Думает...'
          APIstatus(i, status, 'Думает...')
          break
        case 'danger':
          this.$refs.btnStatus[index].innerText = 'Отказано'
          APIstatus(i, status, 'Отказано')
          break
      }
      this.$root.$emit('bv::hide::popover')
    },
    deleteOrder(i) {
      let urlAPI = 'https://myquiz-9b908.firebaseio.com/orders/' + i + '.json'

      let this_ = this

      $.ajax({
        type: 'DELETE',
        url: urlAPI,
        success: function(data, textStatus, request, response) {
          this_.$store.dispatch('getOrders')
        },
        error: function(request, textStatus, errorThrown, response) {
          console.log(response)
        }
      })

      this.lorem++
    },
    resetInputs() {
      this.nameFilter = ''
      this.fromFilter = ''
      this.selected = null
      this.selectedDate = {
        start: new Date(2019, 2, 1),
        end: new Date(2019, 11, 31)
      }
    }
  },
  filters: {
    toString(string) {
      if (Array.isArray(string)) {
        return string.join(', ')
      } else {
        return string
      }
    },
    toDate(a) {
      let date_time = a.split('T')
      let normalDate = date_time[0].split('-')

      let readyDate = normalDate[2] + '.' + normalDate[1] + '.' + normalDate[0]

      function getTimeZone() {
        var offset = new Date().getTimezoneOffset(),
          o = Math.abs(offset)
        return o / 60
      }
      let normalTime = date_time[1].split(':')
      let readyTime =
        parseInt(normalTime[0]) + getTimeZone() + ':' + normalTime[1]

      return readyDate + ' в ' + readyTime
    }
  }
}
</script>

<style scoped>
.popover-container input {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.c-day-background {
  background-color: #4da1ff !important;
}

.btn-outline-danger:hover {
  color: #fff;
}

#modal1 p {
  margin-bottom: 0;
}

td[aria-colindex='6'] {
  text-align: right;
}

.table td,
.table th {
  vertical-align: middle;
}

@media screen and (max-width: 991.98px) {
  td[aria-colindex='4'],
  th[aria-colindex='3'] {
    display: none;
  }

  .table {
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 767.98px) {
  td[aria-colindex='6'],
  th[aria-colindex='5'] {
    display: none;
  }

  .btn {
    font-size: 1rem;
  }
}
</style>