<template>
	<div class="registration-layout">
		<!-- Информация о событии -->
		<div>
			Event Title: {{eventInfo.eventTitle}}
			<br>
			Event date: {{eventInfo.eventDate}}
			<br>
			Event time: {{eventInfo.eventTime}}
		</div>
		<!-- форма регистрации -->
		<div v-if="!message">
			<v-form
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
						v-model="registrationData.phone"
						:rules="[rules.phone]"
						label="Телефон"></v-text-field>

				<v-select
						v-model="registrationData.companyemployeesqty"
						:items="items"
						labels="Сотрудников в компании"></v-select>

				<v-btn
						:disabled="!valid"
						color="success"
						@click="validate">Зарегистрироваться</v-btn>

			</v-form>
		</div>

		<!-- Сообщение -->
		<message v-if="message" :message="message"></message>

	</div>
</template>

<script>

import axios from 'axios'
import Message from '../components/Message'

export default {
	name: 'registration-form',
	props: [ 'eventInfo', 'idparams' ],
	components: {
		Message
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
			items: [
				'1-100',
				'100 - 1000',
				'1000 - 5000',
				'5000 - 10000'
			],
			
			registrationData: {
				name: '',
				surname: '',
				email: '',
				company: '',
				phone: '',
				companyemployeesqty: ''
			},
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

<style>
.registration-layout {
	display: flex;
	flex-direction: row;
}
</style>