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

			<v-flex md6 xs12>
				<v-container>
						<v-flex>
							<!-- форма регистрации -->
							<v-form v-if="!message"
										ref=form
										v-model="valid"
										:lazy-validation="lazy">

								<h3 class="form-head-message">
									{{$t('message.registrationForm.obligatoryFieldMessage')}}
								</h3>

								<v-text-field
									v-model="registrationData.name"
									:rules="[rules.required(registrationData.name, warnings.obligatoryWriteIn), rules.name(registrationData.name, warnings.nameMastConsistsLettersOnly), rules.length50(registrationData.name, warnings.lineHasMore50symbols)]"
									:label="$t('message.registrationForm.name') + ' *'"
									required></v-text-field>
								<v-text-field
									v-model="registrationData.surname"
									:rules="[rules.required(registrationData.surname, warnings.obligatoryWriteIn), rules.length50(registrationData.surname, warnings.lineHasMore50symbols)]"
									:label="$t('message.registrationForm.surname') + ' *'"></v-text-field>
								<v-text-field
									v-model="registrationData.email"
									:rules="[rules.required(registrationData.email, warnings.obligatoryWriteIn), rules.required(registrationData.email, warnings.obligatoryWriteIn), rules.email(registrationData.email, warnings.wronEmail)]"
									label="e-mail *"
									required></v-text-field>
								<v-text-field
									v-model="registrationData.company"
									:rules="[rules.required(registrationData.company, warnings.obligatoryWriteIn), rules.length100(registrationData.company, warnings.lineHasMore100symbols)]"
									:label="$t('message.registrationForm.company') + ' *'"></v-text-field>
								<v-text-field
									v-model="registrationData.position"
									:rules="[rules.required(registrationData.position, warnings.obligatoryWriteIn), rules.length100(registrationData.position, warnings.lineHasMore100symbols)]"
									:label="$t('message.registrationForm.position') + ' *'"></v-text-field>

								<div v-bind:class="{phoneValid: phoneIsValid, phoneNotValid: !phoneIsValid }">{{$t('message.registrationForm.phone') + ' *'}}</div>
								<!-- Номер телефона -->
								<VuePhoneNumberInput 
									v-model="phoneNumber"
									size="lg"
									required
									color="#FF3907"
									:default-country-code="defaultCountry"
									:only-countries="countriesList"
									:error="hasErrorActive"
									:translations="translations"
									@update="phoneUpdate" />

								<!-- Согласие на использование данных -->
								<v-checkbox
									v-model="isConsent"
									:label="$t('message.registrationForm.consentProcessingPersData')">
								</v-checkbox>

								<!-- reCAPTCHA -->
								<vue-recaptcha 
									ref="recaptcha"
									:sitekey="sitekey"
									@verify="captchaResponse"
									@expired="onCaptchaExpired"></vue-recaptcha>

								<v-btn class="mt-2"
										:disabled="!(valid && isConsent && phoneIsValid && captchaVerify)"
										color="success"
										@click="registrate">{{$t('message.registrationForm.registrate')}}</v-btn>

							</v-form>
						</v-flex>
				</v-container>

				<!-- Сообщение -->
				<message v-if="message" :titlemessage="message" :message="messageContent"></message>
			</v-flex>
		</v-layout>
	</v-container>

</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import Message from '../components/Message'
import VueRecaptcha from 'vue-recaptcha'

import {getCountryCode, getCountryCodeByPhone, deleteDialCode} from '../helpers/phoneNumber.js'

import VuePhoneNumberInput from 'vue-phone-number-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'

Vue.component('vue-phone-number-input', VuePhoneNumberInput)

export default {
	name: 'registration-form',
	props: [ 'eventInfo', 'personInfo', 'idparams' ],
	components: {
		Message,
		VueRecaptcha,
		VuePhoneNumberInput
	},
	created() {
		this.lang = window.myConfig.lang

		this.warnings.obligatoryWriteIn = this.$t('message.registrationForm.obligatoryWriteIn')
		this.warnings.nameMastConsistsLettersOnly = this.$t('message.registrationForm.nameMastConsistsLettersOnly')
		this.warnings.wronEmail = this.$t('message.registrationForm.wronEmail')
		this.warnings.rightPhoneNumber = this.$t('message.registrationForm.rightPhoneNumber')
		this.warnings.rightCompanyName = this.$t('message.registrationForm.rightCompanyName')
		this.warnings.rightPositionName = this.$t('message.registrationForm.rightPositionName')
		this.warnings.lineHasMore50symbols = this.$t('message.registrationForm.lineHasMore50symbols')
		this.warnings.lineHasMore100symbols = this.$t('message.registrationForm.lineHasMore100symbols')

		this.translations.countrySelectorLabel = this.$t('message.registrationForm.countrySelectorLabel')
		this.translations.countrySelectorError = this.$t('message.registrationForm.countrySelectorError')
		this.translations.phoneNumberLabel = this.$t('message.registrationForm.phoneNumberLabel')
		this.translations.example = this.$t('message.registrationForm.example')
	},
	mounted() {
		// Если есть персональные данные заполнить форму
		if (this.personInfo) {
			this.registrationData.name = this.personInfo.name
			this.registrationData.surname = this.personInfo.surname
			this.registrationData.email = this.personInfo.email
			this.registrationData.company = this.personInfo.company
			this.registrationData.position = this.personInfo.position
			// по коду страны номера телефона определить код страны и установить страну по умолчанию
			//var phoneNumber = '+380445356060'
			const country = getCountryCodeByPhone(this.personInfo.phone) // getCountryCodeByPhone(phoneNumber)
			this.defaultCountry = country ? country.iso2 : window.myConfig.defaultCountry
			// удалить из номера код страны
			this.phoneNumber = deleteDialCode(this.personInfo.phone, this.defaultCountry) // deleteDialCode(phoneNumber, this.defaultCountry)
			// eslint-disable-next-line
			//console.log(this.phoneNumber)
		} else {
			getCountryCode(this.setCountry)
		}
	},
	data: () => ({
		phoneNumber: null,
		defaultCountry: 'UA',
		countriesList: ['UA','RU','BY','KZ','PL'],
		translations: {
			countrySelectorLabel: '',
      countrySelectorError: '',
      phoneNumberLabel: '',
      example: ''
		},
		hasErrorActive: false,
		phoneData: {},
		lang: '',
		valid: true,
		lazy: false,
		rules: {
			required: (v, msg) => !!v || msg,
			name: (v, msg) => /[a-zA-Zа-яА-ЯІіЇїЄєҐґ' ]/.test(v) || msg,
			email: (v, msg) => {
				const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				return emailPattern.test(v) || msg
			},
			phone: (v, msg) => (/(\+[\d ()-]{10,})$/.test(v) || !v) || msg,
			company: (v, msg) => (/^[0-9a-zA-ZА-Яа-яЁёІіЇїЄєҐґ]*([0-9a-zA-ZА-Яа-яЁёІіЇїЄєҐґ' &]|-|\.)*$/.test(v) || !v) || msg,
			position: (v, msg) => (/^[0-9a-zA-ZА-Яа-яЁёІіЇїЄєҐґ]*([0-9a-zA-ZА-Яа-яЁёІіЇїЄєҐґ' ]|-|\.)*$/.test(v) || !v) || msg,
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
		messageContent: '',
		token: '',
		isVerified: false,
		isSended: false
	}) ,
	methods: {
		setCountry(countryCode) {
			this.defaultCountry = countryCode
		},
		phoneUpdate( payload ) {
			this.phoneData = payload
			this.registrationData.phone = this.phoneData.formattedNumber
		},
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
						this.message = this.$t('message.registrationPage.responsebuterror', {'errorresponsestatus': error.response.status, 'errorresponsedata': error.response.data})
					} else if (error.request) {
						// запрос выполнен, но ответ не получен
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
			this.isSended = true
			this.saveRegistrationData()
		},

		// Сохранить регистрационные данные _REGFORM.SAVEREGISTRATIONDATA
		saveRegistrationData() {
			var params = JSON.stringify({ 
				eventGuid: this.idparams.eventid,
				personGuid: this.idparams.personid,
				personData: this.registrationData,
				lang: this.lang})

			axios.post(window.myConfig.WsUrl, {
				calcId: '_REGFORM.SAVEREGISTRATIONDATA',
				args: params,
				ticket: ''
			})
			.then(response => {
				var resp = JSON.parse(response.data.d)
				var isSaved = resp.success
				if (isSaved) {
					//this.message = 'Регистрация прошла успешно!'
					this.message = this.$t('message.registrationForm.registrationSuccess')
					this.messageContent = this.$t('message.registrationForm.registrationSuccessAdd')
				} else {
					//this.message = 'Данные регистрации не были сохранены.'
					if(resp.message) {
						this.message = resp.message
					} else {
						this.message = this.$t('message.registrationPage.youHaveRegistration')
					}
				}
			})
			.catch(error => {
				if (error.response) {
						// ответ получен, но ошибка
						this.message = this.$t('message.registrationPage.responseButError', {'errorresponsestatus': error.response.status, 'errorresponsedata': error.response.data})
					} else if (error.request) {
						// запрос выполнен, но ответ не получен
						this.message = this.$t('message.registrationPage.serverNotResponse')
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
		},
		phoneIsValid() {
			return this.phoneData.isValid ? this.phoneData.isValid : false
		}
	}
}
</script>

<style scoped>
.text-word-wrap {
	word-break: normal;
}
.form-head-message {
	margin-top: 1em;
	margin-bottom: 1em; 
}
.phoneValid {
	color: rgba(0, 0, 0, 0.87)
}
.phoneNotValid {
	color: red;
}
</style>