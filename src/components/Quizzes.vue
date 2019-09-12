<template>
  <b-container fluid class="main_content">
    <b-row>
      <b-col lg="6">
        <b-button
          type="button"
          variant="primary"
          class="btn-block create_quiz mb-5"
          to="patterns"
        >Создать квиз +</b-button>

        <!-- <jumper v-if="loading"></jumper> -->

        <clip-loader :loading="loadingQ" v-if="loadingQ" :size="'75px'"></clip-loader>

        <b-card
          v-for="quiz of quizzes"
          :key="quiz.id"
          :title="quiz.name"
          tag="article"
          class="mb-5"
          v-else
        >
          <b-row>
            <b-col sm="6">
              <b-button :to="'/edit/' + quiz.id + '/questions'" variant="primary">
                <span>Редактировать</span>
                <i class="far fa-edit ml-2"></i>
              </b-button>
            </b-col>
            <b-col class="text-right my_text-left" sm="6">
              <b-button-group>
                <b-button
                  variant="outline-primary"
                  title="Скопировать"
                  @click="copyQuiz(quiz.name, quiz.questions, quiz.styles)"
                >
                  <i class="far fa-clone"></i>
                </b-button>
                <b-button variant="outline-primary" title="Удалить" @click="deleteQuiz(quiz.id)">
                  <i class="far fa-trash-alt"></i>
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <hr />
          <b-row>
            <b-col class="my_row">
              <div class="orders">
                <i class="far fa-dot-circle"></i>
                {{ getCount(quiz.id) | plural }}
              </div>
              <div>
                <b-link :to="{ name: 'orders', query: { from: quiz.name } }">Подробный отчет</b-link>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col>
        <clip-loader :loading="loadingO" v-if="loadingO" :size="'75px'" style="margin-top: 130px"></clip-loader>

        <b-card title="Последние заявки" tag="article" v-else>
          <div class="text-center pt-3 pb-3" v-if="orders.length === 0">Заявок пока нет</div>
          <div class="table-responsive-sm" v-else>
            <table aria-busy="false" aria-colcount="3" aria-rowcount="5" class="table b-table">
              <thead>
                <tr>
                  <th aria-colindex="index" class v-for="(field, index) in fields">{{ field }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class v-for="(item, index) in orders">
                  <td aria-colindex="1" class>{{ item.name }}</td>
                  <td aria-colindex="2" class>{{ item.phone }}</td>
                  <td aria-colindex="3">
                    <b-button
                      :variant="item.btn"
                      class="btn-block"
                      ref="btnStatus"
                      :id="'exPopoverReactive' + index"
                    >{{ item.status }}</b-button>
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
                          @click="changeStatus($event, index, item.id, 'light', item.name, item.phone, item.email, item.quiz_from, item.quiz_url, item.question, item.answers, item.date, item.quiz_id)"
                          class="btn-block"
                        >Новое обращение</b-button>
                        <b-button
                          variant="success"
                          @click="changeStatus($event, index, item.id, 'success', item.name, item.phone, item.email, item.quiz_from, item.quiz_url, item.question, item.answers, item.date, item.quiz_id)"
                          class="btn-block"
                        >Обработано</b-button>
                        <b-button
                          variant="warning"
                          @click="changeStatus($event, index, item.id, 'warning', item.name, item.phone, item.email, item.quiz_from, item.quiz_url, item.question, item.answers, item.date, item.quiz_id)"
                          class="btn-block"
                        >Думает...</b-button>
                        <b-button
                          variant="danger"
                          @click="changeStatus($event, index, item.id, 'danger', item.name, item.phone, item.email, item.quiz_from, item.quiz_url, item.question, item.answers, item.date, item.quiz_id)"
                          class="btn-block"
                        >Отказано</b-button>
                      </div>
                    </b-popover>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr v-if="orders.length !== 0" />
          <div class="text-center" v-if="orders.length !== 0">
            <b-link to="orders" class="text-center">Перейти ко всем заявкам</b-link>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  components: { ClipLoader },
  data() {
    return {
      fields: ['Имя', 'Телефон', 'Статус']
    }
  },
  created() {
    this.$store.dispatch('getQuizzes')
    this.$store.dispatch('getOrders')

    this.$store.commit('setLoadingQ', true)
    this.$store.commit('setLoadingO', true)
  },
  computed: {
    quizzes() {
      return this.$store.getters.myQuizzes
    },
    orders() {
      return this.$store.getters.fiveOrders
    },
    loadingQ() {
      return this.$store.getters.loadingQ
    },
    loadingO() {
      return this.$store.getters.loadingO
    }
  },
  methods: {
    getCount(id) {
      let count = 0,
        orders = this.$store.getters.orders

      for (var i = 0; i < orders.length; i++) {
        if (orders[i].quiz_id === id) {
          count++
        }
      }

      return count
    },
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
          error: function(request, textStatus, errorThrown, response) {
            //
          }
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
    deleteQuiz(i) {
      let urlAPI = 'https://myquiz-9b908.firebaseio.com/quizzes/' + i + '.json',
        this_ = this

      $.ajax({
        type: 'DELETE',
        url: urlAPI,
        success: function(data, textStatus, request, response) {
          this_.$store.dispatch('getQuizzes')
        },
        error: function(request, textStatus, errorThrown, response) {
          //
        }
      })
    },
    copyQuiz(name, question, styles) {
      let dataForAjax = {
        name: name,
        questions: question,
        styles: styles,
        owner: this.$store.state.user.user.id
      }

      let this_ = this

      $.ajax({
        type: 'POST',
        url: 'https://myquiz-9b908.firebaseio.com/quizzes.json',
        data: JSON.stringify(dataForAjax),
        success: function(data, textStatus, request, response) {
          this_.$store.dispatch('getQuizzes')
        },
        error: function(request, textStatus, errorThrown, response) {}
      })
    }
  },
  filters: {
    plural(s) {
      function declOfNum(number, titles) {
        let cases = [2, 0, 1, 1, 1, 2]
        return titles[
          number % 100 > 4 && number % 100 < 20
            ? 2
            : cases[number % 10 < 5 ? number % 10 : 5]
        ]
      }

      return s + ' ' + declOfNum(s, ['заявка', 'заявки', 'заявок'])
    }
  }
}
</script>

<style>
.main_content {
  padding: 3rem;
  flex-grow: 1;
}

.card-img-top {
  height: 16rem;
}

.my_row {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
}

.my_row div {
  margin-right: 1.5rem;
}

.create_quiz {
  font-size: 2rem;
  padding: 1rem;
  white-space: normal;
}

.table th {
  border-top: none;
}

.table {
  margin-bottom: 0;
}

.btn_status {
  padding: 9px 12px;
  text-align: center;
  border-radius: 6px;
}

.table td,
.table th {
  vertical-align: middle;
}

.v-clip {
  border-width: 6px !important;
  border-color: #4da1ff #4da1ff transparent !important;
}

@media (max-width: 1199.98px) {
  .table {
    font-size: 0.9rem;
  }
}

@media (max-width: 575.98px) {
  .table {
    font-size: 0.8rem;
  }

  .main_content {
    padding: 1.5rem;
  }

  .statistics {
    display: none;
  }

  .my_text-left {
    text-align: left !important;
    padding-top: 1rem;
  }
}
</style>
