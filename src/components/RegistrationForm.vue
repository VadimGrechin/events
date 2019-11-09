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
						:rules="[rules.required(registrationData.name, warnings.oblygatorytofulfill), rules.name(registrationData.name, warnings.namehasconsistsletteronly), rules.length50(registrationData.name, warnings.linehasmore50symbols)]"
						:label="$t('message.registrationForm.name')"
						required></v-text-field>
					<v-text-field
						v-model="registrationData.surname"
						:rules="[rules.length50(registrationData.surname, warnings.linehasmore50symbols)]"
						:label="$t('message.registrationForm.surname')"></v-text-field>
					<v-text-field
						v-model="registrationData.email"
						:rules="[rules.required(registrationData.email, warnings.oblygatorytofulfill), rules.email(registrationData.email, warnings.wronemail)]"
						label="e-mail"
						required></v-text-field>
					<v-text-field
						v-model="registrationData.company"
						:rules="[rules.company(registrationData.company, warnings.rightcompanyname), rules.length100(registrationData.company, warnings.linehasmore100symbols)]"
						:label="$t('message.registrationForm.company')"></v-text-field>
					<v-text-field
						v-model="registrationData.position"
						:rules="[rules.position(registrationData.position, warnings.rightpositionname), rules.length100(registrationData.position, warnings.linehasmore100symbols)]"
						:label="$t('message.registrationForm.position')"></v-text-field>
					<v-text-field
						v-model="registrationData.phone"
						:rules="[rules.phone(registrationData.phone, warnings.rightphonevalue)]"
						:label="$t('message.registrationForm.phone')"></v-text-field>
					
					<!-- Согласие на использование данных -->
					<v-checkbox
						v-model="isConsent"
						:label="$t('message.registrationForm.consentprocessingpersdata')">
					</v-checkbox>

					<v-btn
							:disabled="!this.valid || !this.isConsent"
							color="success"
							@click="validate">{{$t('message.registrationForm.registrate')}}</v-btn>
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

export default {
	name: 'registration-form',
	props: [ 'eventInfo', 'personInfo', 'idparams' ],
	components: {
		Message
	},
	created() {
		this.warnings.oblygatorytofulfill = this.$t('message.registrationForm.oblygatorytofulfill')
		this.warnings.namehasconsistsletteronly = this.$t('message.registrationForm.namehasconsistsletteronly')
		this.warnings.wronemail = this.$t('message.registrationForm.wronemail')
		this.warnings.rightphonevalue = this.$t('message.registrationForm.rightphonevalue')
		this.warnings.rightcompanyname = this.$t('message.registrationForm.rightcompanyname')
		this.warnings.rightpositionname = this.$t('message.registrationForm.rightpositionname')
		this.warnings.linehasmore50symbols = this.$t('message.registrationForm.linehasmore50symbols')
		this.warnings.linehasmore100symbols = this.$t('message.registrationForm.linehasmore100symbols')
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
			warnings: {
			},
			registrationData: {
				name: '',
				surname: '',
				email: '',
				company: '',
				phone: '',
				position: ''
			},
			isConsent: false,
			message: ''
	}) ,
	methods: {
		// Сохранить регистрационные данные
		validate(){
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
					this.message = this.$t('message.registrationForm.registrationsuccess')
				} else {
					//this.message = 'Данные регистрации не были сохранены.'
					this.message = this.$t('message.registrationForm.registratonfailed')
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
	}
}
</script>

<style >
.text-word-wrap {
	word-break: normal;
}
</style>