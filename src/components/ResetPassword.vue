<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col class="text-center">
        <b-card title="Сброс пароля" style="max-width: 30rem;" class="m-auto p-3 mt-10">
          <b-form @submit.prevent="onSubmit" class="mt-5">
            {{ error }}
            <b-alert variant="danger" :show="notFound" class="mt-3">Данный email не найден.</b-alert>
            <b-form-group id="exampleInputGroup1" label="Email" label-for="exampleInput1">
              <b-form-input
                id="exampleInput1"
                type="email"
                v-model="email"
                placeholder="example@gmail.com"
                size="lg"
                name="Email"
                v-validate="'required|email'"
              ></b-form-input>
              <span class="text-danger error">{{ errors.first('Email') }}</span>
            </b-form-group>

            <b-button
              type="submit"
              variant="success"
              class="btn-block mb-3"
              size="lg"
            >Сбросить пароль</b-button>
          </b-form>
        </b-card>
        <div class="mt-5 to_reg mb-5">
          <b-link href="#" to="/login">Назад</b-link>
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
      notFound: false
    }
  },
  computed: {
    error() {
      let signal = this.$store.getters.error

      if (
        signal ===
        'There is no user record corresponding to this identifier. The user may have been deleted.'
      ) {
        this.notFound = true
      }
    }
  },
  methods: {
    onSubmit() {
      let email = this.email

      this.$store
        .dispatch('forgotPassword', email)
        .then(() => {
          setTimeout(() => {
            let signal = this.$store.getters.error

            if (
              signal ===
              'There is no user record corresponding to this identifier. The user may have been deleted.'
            ) {
              //
            } else {
              this.$store.commit('setError', 'Reset sent')
              this.$router.push('/login')
            }
          }, 3000)
        })
        .catch(error => {})
    }
  }
}
</script>

<style>
.mt-10 {
  margin-top: 144px !important;
}
</style>