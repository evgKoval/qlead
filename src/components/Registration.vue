<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col class="text-center">
        <h1 class="mb-5 mt-5">Регистрация</h1>
        <b-card title="Создайте свой аккаунт" style="max-width: 30rem;" class="m-auto p-3">
          <b-form @submit="onSubmit" class="mt-5">
            {{ error }}
            <b-alert
              variant="danger"
              :show="alreadyUsed"
              class="mt-3"
            >Данный email уже зарегистрирован</b-alert>
            <b-form-group
              id="exampleInputGroup1"
              label="Email"
              label-for="exampleInput1"
              class="mb-4"
            >
              <b-form-input
                id="exampleInput1"
                type="email"
                v-model="email"
                required
                placeholder="example@gmail.com"
                size="lg"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="exampleInputGroup2"
              label="Пароль"
              label-for="exampleInput2"
              class="mb-4"
            >
              <b-form-input
                id="exampleInput2"
                type="password"
                v-model="password"
                required
                size="lg"
              ></b-form-input>
            </b-form-group>

            <b-button
              type="submit"
              variant="success"
              class="btn-block mt-4 mb-3"
              size="lg"
            >Создать аккаунт</b-button>
            <p class="agreement">
              Предоставляя ваши контактные данные, вы соглашаетесь на обработку персональной информации в соответствии с
              <b-link href="#">пользовательским соглашением</b-link>
            </p>
          </b-form>
        </b-card>
        <div class="mt-5 to_reg mb-5">
          <span>У вас есть аккаунт?</span>
          <b-link href="#" to="/login">Войти</b-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      alreadyUsed: false
    }
  },
  mounted() {
    this.$store.commit('clearError')
  },
  computed: {
    error() {
      let signal = this.$store.getters.error
      console.log(signal)

      if (
        signal === 'The email address is already in use by another account.'
      ) {
        this.alreadyUsed = true
      }
    }
  },
  methods: {
    onSubmit(evt) {
      const user = {
        email: this.email,
        password: this.password
      }

      evt.preventDefault()

      this.$store
        .dispatch('registerUser', user)
        .then(() => {
          setTimeout(() => {
            let signal = this.$store.getters.error

            if (
              signal ===
              'The email address is already in use by another account.'
            ) {
            } else {
              this.$store.commit('setError', 'Account ready')
              this.$router.push('/login')
            }
          }, 1000)
        })
        .catch(error => {})
    }
  }
}
</script>

<style>
body {
  font-family: 'Rubik', sans-serif;
  background-color: #f8f9fb;
  color: #02182b;
}

form {
  text-align: left;
}

.to_reg a {
  font-size: 1.5rem;
  margin-left: 0.5rem;
}

.agreement {
  font-size: 0.87rem;
}
</style>