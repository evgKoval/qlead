<template>
	<b-container class="bv-example-row">
	    <b-row>
	        <b-col class="text-center">
	        	<h1 class="mb-5 mt-5">Вход</h1>
				<b-card title="Войдите в ваш аккаунт"
				        style="max-width: 30rem;"
				        class="m-auto p-3">
				    
					<b-form @submit.prevent="onSubmit" v-if="show" class="mt-5">
						{{ error }}
					  <b-alert variant="success" :show="accountReady" class="mt-3">Аккаунт зарегистрирован</b-alert>
					  <b-alert variant="success" :show="resetSent" class="mt-3">Письмо о сбросе пароля отправлено</b-alert>
					  <b-alert variant="danger" :show="invalidPassword" class="mt-3">Неверный пароль или email</b-alert>
					  <b-alert variant="danger" :show="isNotAuth" class="mt-3">Войдите сначала в аккаунт</b-alert>
				      <b-form-group id="exampleInputGroup1"
				                    label="Email"
				                    label-for="exampleInput1"
				                    class="mb-4">
				        <b-form-input id="exampleInput1"
				                      type="email"
				                      v-model="email"
				                      placeholder="example@gmail.com"
				                      size="lg"
				                      name="Email"
				                      v-validate="'required|email'">
				        </b-form-input>
				        <span class="text-danger error">{{ errors.first('Email') }}</span>
				      </b-form-group>
				      <b-form-group id="exampleInputGroup2" label="Пароль" label-for="exampleInput2"class="mb-4">
				        <b-form-input id="exampleInput2"
				                      type="password"
				                      v-model="password"
				                      name="Пароль"
				                      size="lg"
				                      v-validate="'required'">
				        </b-form-input>
				        <span class="text-danger error">{{ errors.first('Пароль') }}</span>
				      </b-form-group>

				      <b-button type="submit" variant="success" class="btn-block mt-4 mb-3" size="lg">Войти</b-button>
				      <b-link href="#" to="/reset">Забыли пароль?</b-link>
				    </b-form>
				</b-card>
				<div class="mt-5 to_reg mb-5">
					<span>Еще нет аккаунта?</span>
					<b-link href="#" to="/registration">Зарегистрируйтесь</b-link>
				</div>
	        </b-col>
	    </b-row>
	</b-container>
</template>

<script>
	export default {
		data () {
		    return {
				email: '',
				password: '',
				show: true,
				invalidPassword: false,
				accountReady: false,
				isNotAuth: false,
				resetSent: false,
		    }
		  },
		  mounted() {
		  	this.$store.commit('clearError');

		  	function $_GET(key) {
		  	    var s = window.location.search;
		  	    s = s.match(new RegExp(key + '=([^&=]+)'));
		  	    return s ? s[1] : false;
		  	};
		  	let quizID = $_GET('message');

		  	if(quizID === 'isnotauth') {
		  		this.isNotAuth = true
		  	}
		  },
		  computed: {
		  	error() {
		  		let signal = this.$store.getters.error;

		  		if(signal === 'The password is invalid or the user does not have a password.') {
		  			this.invalidPassword = true;
		  		} else if(signal === 'Account ready') {
		  			this.accountReady = true;
		  		} else if(signal === 'Reset sent') {
					this.resetSent = true;
		  		}
		  	}
		  },
		  methods: {
		    onSubmit(evt) {
		    	const user = {
		    		email: this.email,
		    		password: this.password
		    	}

		    	evt.preventDefault();

	    	    this.$store.dispatch('loginUser', user)
	    	    	.then(data => {
	    	    		this.$router.push('/quizzes')
	    	    	})
	    	    	.catch(error => {
	    	    		console.log(error);
	    	    		console.log(error.code);
	    	    		if(error.code === 'auth/wrong-password') {
	    	    			console.log('pppp');
	    	    			this.invalidPassword = true;
	    	    		}
	    	    	})
		    },

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

	.error {
		padding-top: 6px;
		padding-left: 3px;
		display: inline-block;
	}
</style>