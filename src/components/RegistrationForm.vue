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
						:rules="[rules.required, rules.name, rules.length]"
						label="Имя"
						required></v-text-field>
					<v-text-field
						v-model="registrationData.surname"
						:rules="[rules.length]"
						label="Фамилия"></v-text-field>
					<v-text-field
						v-model="registrationData.email"
						:rules="[rules.required, rules.email]"
						label="e-mail"
						required></v-text-field>
					<v-text-field
						v-model="registrationData.company"
						:rules="[rules.company, rules.length]"
						label="Компания"></v-text-field>
					<v-text-field
						v-model="registrationData.position"
						:rules="[rules.company, rules.length]"
						label="Должность"></v-text-field>
					<v-text-field
						v-model="registrationData.phone"
						:rules="[rules.phone]"
						label="Телефон"></v-text-field>
					
					<!-- Согласие на использование данных -->
					<v-checkbox
						v-model="isConsent"
						label="Согласны на обработку персональных данных">
					</v-checkbox>

					<v-btn
							:disabled="!this.valid || !this.isConsent"
							color="success"
							@click="validate">Зарегистрироваться</v-btn>
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
				required: v => !!v || "Обязательно для заполнения!",
				name: v => /[a-zA-zа-яА-Я]/.test(v) || "В имени должны быть тольо символы",
				email: v => {
					const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					return emailPattern.test(v)
				},
				phone: v => (/(\+\d{7,12})$/.test(v) || !v) || "Первый символ '+', далее - код страны, города/оператора мобильной связи, номер",
				company: v => (/[a-zA-zА-Яа-яЁё.\s]/.test(v) || !v) || "",
				length: v => (v && v.length <= 50 || !v) || "Количество символов превышает 50"
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
					this.message = 'Регистрация прошла успешно!'
				} else {
					this.message = 'Данные регистрации не были сохранены.'
				}
			})
			.catch(error => {
				if (error.response) {
						// ответ получен, но ошибка
						this.message = 'Status: ' + error.response.status + '\nОшибка: ' + error.response.data
					} else if (error.request) {
						// запрос выполнен, но ответ не получен
						this.message = 'Ответ от сервера не получен!'
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