<template>
	<v-container>
		<v-layout wrap justify-space-between>
			<v-flex md5 xs12>
				<v-card>
					<!-- Информация о событии -->
					<v-card-title primary title>
						<div v-html="eventInfo.eventDescription"></div>
					</v-card-title>
				</v-card>
			</v-flex>
			<v-flex md6 xs12 >
				<!-- форма регистрации -->
				<v-form v-if="!message"
							ref=form
							v-model="valid"
							:lazy-validation="lazy">
					<!-- Поля -->
					<v-text-field
						v-model="registrationData.name"
						:rules="[rules.required(registrationData.name, warnings.obligatoryWriteIn), rules.name(registrationData.name, warnings.nameMastConsistsLettersOnly), rules.length50(registrationData.name, warnings.lineHasMore50symbols)]"
						:label="$t('message.registrationForm.name')"
						required></v-text-field>
					<v-text-field
						v-model="registrationData.surname"
						:rules="[rules.length50(registrationData.surname, warnings.lineHasMore50symbols)]"
						:label="$t('message.registrationForm.surname')"></v-text-field>
					<v-text-field
						v-model="registrationData.email"
						:rules="[rules.required(registrationData.email, warnings.obligatoryWriteIn), rules.email(registrationData.email, warnings.wronEmail)]"
						label="e-mail"
						required></v-text-field>
					<v-text-field
						v-model="registrationData.company"
						:rules="[rules.company(registrationData.company, warnings.rightCompanyName), rules.length100(registrationData.company, warnings.lineHasMore100symbols)]"
						:label="$t('message.registrationForm.company')"></v-text-field>
					<v-text-field
						v-model="registrationData.position"
						:rules="[rules.position(registrationData.position, warnings.rightPositionName), rules.length100(registrationData.position, warnings.lineHasMore100symbols)]"
						:label="$t('message.registrationForm.position')"></v-text-field>
					<v-text-field
						v-model="registrationData.phone"
						:rules="[rules.phone(registrationData.phone, warnings.rightPhoneNumber)]"
						:label="$t('message.registrationForm.phone')"></v-text-field>
					
					<!-- Согласие на использование данных -->
					<v-checkbox
						v-model="isConsent"
						:label="$t('message.registrationForm.consentProcessingPersData')">
					</v-checkbox>

					<!-- reCAPTCHA -->
					<vue-recaptcha v-if="valid && isConsent"
						ref="recaptcha"
						:sitekey="sitekey"
						@verify="captchaResponse"
						@expired="onCaptchaExpired"></vue-recaptcha>

					<v-btn
							:disabled="!(valid && isConsent && captchaVerify)"
							color="success"
							@click="registrate">{{$t('message.registrationForm.registrate')}}</v-btn>
				</v-form>
				<!-- Сообщение -->
				<message v-if="message" :message="message"></message>
			</v-flex>
		</v-layout>
	</v-container>

</template>

<script>
import axios from 'axios'
import Message from '../components/Message'
import VueRecaptcha from 'vue-recaptcha'

export default {
	name: 'registration-form',
	props: [ 'eventInfo', 'personInfo', 'idparams' ],
	components: {
		Message,
		VueRecaptcha
	},
	created() {
		this.warnings.obligatoryWriteIn = this.$t('message.registrationForm.obligatoryWriteIn')
		this.warnings.nameMastConsistsLettersOnly = this.$t('message.registrationForm.nameMastConsistsLettersOnly')
		this.warnings.wronEmail = this.$t('message.registrationForm.wronEmail')
		this.warnings.rightPhoneNumber = this.$t('message.registrationForm.rightPhoneNumber')
		this.warnings.rightCompanyName = this.$t('message.registrationForm.rightCompanyName')
		this.warnings.rightPositionName = this.$t('message.registrationForm.rightPositionName')
		this.warnings.lineHasMore50symbols = this.$t('message.registrationForm.lineHasMore50symbols')
		this.warnings.lineHasMore100symbols = this.$t('message.registrationForm.lineHasMore100symbols')
	},
	mounted() {
		// Если есть персональные данные заполнить форму
		if (this.personInfo) {
			this.registrationData.name = this.personInfo.name
			this.registrationData.surname = this.personInfo.surname
			this.registrationData.email = this.personInfo.email
			this.registrationData.company = this.personInfo.company
			this.registrationData.position = this.personInfo.position
			this.registrationData.phone = this.personInfo.phone
		}
	},
	updated() {
		if (!this.valid) {
			this.isConsent = false
		}
	},
	data: () => ({
			valid: true,
			lazy: false,
			rules: {
				required: (v, msg) => !!v || msg,
				name: (v, msg) => /[a-zA-zа-яА-Я]/.test(v) || msg,
				email: (v, msg) => {
					const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					return emailPattern.test(v) || msg
				},
				phone: (v, msg) => (/(\+\d{7,12})$/.test(v) || !v) || msg,
				company: (v, msg) => (/^[0-9a-zA-zА-Яа-яЁё]*[0-9a-zA-zА-Яа-яЁё -&][A-Za-z0-9 -&.]*$/.test(v) || !v) || msg,
				position: (v, msg) => (/^[0-9a-zA-zА-Яа-яЁё]*[0-9a-zA-zА-Яа-яЁё -][A-Za-z0-9 -.]*$/.test(v) || !v) || msg,
				length50: (v, msg) => (v && v.length <= 50 || !v) || msg,
				length100: (v, msg) => (v && v.length <= 100 || !v) || msg,
			},
			isConsent: false,
			warnings: {},
			registrationData: {
				name: '',
				surname: '',
				email: '',
				company: '',
				phone: '',
				position: ''
			},
			message: '',
			token: '',
			isVerified: false
	}) ,
	methods: {
		// reCAPTCHA response
		captchaResponse(recaptchaToken) {
			this.token = recaptchaToken
			// выполнить проверку на сервере
			var params = JSON.stringify({recaptchaToken})

			axios.post(window.myConfig.WsUrl, {
				calcId: '_REGFORM.VERIFYUSER',
				args: params,
				ticket: ''
			})
			.then( response => {
				this.isVerified = response.data.d === 'True' ? true : false
			})
			.catch( error => {
				if (error.response) {
						// ответ получен, но ошибка
						//this.message = 'Status: ' + error.response.status + '\nОшибка: ' + error.response.data
						this.message = this.$t('message.registrationPage.responsebuterror', {'errorresponsestatus': error.response.status, 'errorresponsedata': error.response.data})
					} else if (error.request) {
						// запрос выполнен, но ответ не получен
						//this.message = 'Ответ от сервера не получен!'
						this.message = this.$t('message.registrationPage.serverhasnoresponse')
					} else {
						this.message = error.message
					}
			})
		},
		onCaptchaExpired() {
			this.$refs.recaptcha.reset()
		},

		// Сохранить регистрационные данные
		registrate(){
			if (this.$refs.form.validate()) {
				this.snackbar = true
			}
			this.saveRegistrationData()
		},

		// Вызвать веб-расчет _REGFORM.SAVEREGISTRATIONDATA
		saveRegistrationData() {
			var params = JSON.stringify({ 
				eventGuid: this.idparams.eventid,
				personGuid: this.idparams.personid,
				personData: this.registrationData})

			axios.post(window.myConfig.WsUrl, {
				calcId: '_REGFORM.SAVEREGISTRATIONDATA',
				args: params,
				ticket: ''
			})
			.then(response => {
				var isSaved = response.data.d === 'True' ? true : false
				if (isSaved) {
					//this.message = 'Регистрация прошла успешно!'
					this.message = this.$t('message.registrationForm.registrationSuccess')
				} else {
					//this.message = 'Данные регистрации не были сохранены.'
					this.message = this.$t('message.registrationForm.registratonFailed')
				}
			})
			.catch(error => {
				if (error.response) {
						// ответ получен, но ошибка
						//this.message = 'Status: ' + error.response.status + '\nОшибка: ' + error.response.data
						this.message = this.$t('message.registrationPage.responsebuterror', {'errorresponsestatus': error.response.status, 'errorresponsedata': error.response.data})
					} else if (error.request) {
						// запрос выполнен, но ответ не получен
						//this.message = 'Ответ от сервера не получен!'
						this.message = this.$t('message.registrationPage.serverhasnoresponse')
					} else {
						this.message = error.message
					}
			})
		}
	},
	computed: {
		sitekey() {
			return window.myConfig.sitekey
		},
		captchaVerify() {
			return this.isVerified
		}
	}
}
</script>

<style >
.text-word-wrap {
	word-break: normal;
}
</style>