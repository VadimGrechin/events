<template>
	<div class="registration-layout">
		<!-- Название события -->
		<div v-if="eventInfo">
			<h2>Регистрация: {{eventInfo.eventTitle}}</h2>
		</div>
		<!-- Регистрация -->
		<registration-form v-if="goToRegistration && eventInfoData" 
											:event-info="eventInfo"
											:idparams="params"></registration-form>
		<!-- сообщение/ сообщение об ошибке -->
		<message v-if="showMessage" :message="message"></message>
		
	</div>
</template>

<script>

import axios from 'axios'
import RegistrationForm from '../components/RegistrationForm'
import Message from '../components/Message'

export default {
	name: 'registration',
	components: {
		RegistrationForm,
		Message
	},
	data() {
		return {
			params: {
				eventid: null,
				personid: null
			},
			error: null,
			errorMessage: null,
			goRegistration: false,
			showMessage: false,
			message: '',
			eventInfo: null,
			isRegistered: false
		}
	},
	created() {
		this.params.eventid = this.$route.params.eventGuid
		this.params.personid = this.$route.params.personGuid

		var paramsCheckResult = this.checkParams(this.params)
		
		this.showMessage = true
		switch (paramsCheckResult) {
			case 'noparams':
				this.message = 'В ссылке нет параметров!'
				break;
			case 'nosecondparams':
				this.message = 'В ссылке нет второго параметра!'
				break;
			case 'bothparamsnotcorrect':
				this.message = 'Параметры в ссылке некорректны!'
				break;
			case 'secondparamnotcorrect':
				this.message = 'Второй параметр в ссылке не корректен!'
				break;
			case 'firstparamnotcorrect':
				this.message = 'Первый параметр в ссылке не корректен!'
				break;
			case 'eventnotfound':
				this.message = 'Ссылка не связана ни с одним из событий!'
				break;
			case 'personhasregistration':
				this.message = 'Вы уже зарегистрированы на событие!'
				break;
			case 'ok':
				//this.showMessage = false
				//this.goRegistration = true
				// Сущесвования события и факт регистрации персоны: запросы к веб-расчетам
				//// eslint-disable-next-line
				// debugger
				//this.getEventInfo(this.params.eventid)
				// if (!this.eventInfoData && !this.error) {
				// 	return 'eventnotfound'
				// }
				//this.hasRegistered(this.params.eventid, this.params.personid)
				// if (isRegistered) {
				// 	return 'personhasregistration'
				// }
				break;
			default: break;
		}
	},

	mounted() {
		this.getEventInfo(this.params.eventid)
		this.hasRegistered(this.params.eventid, this.params.personid)
	},
	methods: {
		// Проверить параметры строки запроса
		checkParams(params) {
			// Наличие параметров
			if (!params.eventid && !params.personid) {
				return 'noparams'
			}
			if (params.eventid && !params.personid) {
				return 'nosecondparams'
			}
			// корректность параметров 
			var eventidIsCorrect = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(params.eventid)
			var personidIsCorrect = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(params.personid)
			if (!eventidIsCorrect && !personidIsCorrect) {
				return 'bothparamsnotcorrect'
			}
			if (eventidIsCorrect && !personidIsCorrect) {
				return 'secondparamnotcorrect'
			}
			if (!eventidIsCorrect && personidIsCorrect) {
				return 'firstparamnotcorrect'
			}
			// Сущесвования события и факт регистрации персоны: запросы к веб-расчетам
			//// eslint-disable-next-line
			// debugger
			//this.getEventInfo(this.params.eventid)
			// if (!this.eventInfoData && !this.error) {
			// 	return 'eventnotfound'
			// }
			//this.hasRegistered(this.params.eventid, this.params.personid)
			// if (isRegistered) {
			// 	return 'personhasregistration'
			// }
			return 'ok'
		},
		// Вызвать веб-расчет _REGFORM.GETEVENTINFO
		getEventInfo(eventid) {
			axios.post(window.myConfig.WsUrl, {
				calcId: "_REGFORM.GETEVENTINFO",
				args: JSON.stringify({ eventGuid: eventid}),
				ticket: ''
			})
			.then(response => {
				this.eventInfo = JSON.parse(response.data.d)
				this.goRegistration = true
				this.showMessage = false
				})
			.catch(error => {
				this.error = error
				this.goRegistration = false
				this.showMessage = true
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

			// this.runCalculation({
			// 	serviceName: "_REGFORM.GETEVENTINFO",
			// 	parameters: { eventGuid: eventid},
			// 	onSuccess: function(data) {
			// 		// eslint-disable-next-line
			// 		debugger
			// 		this.eventInfo = JSON.parse(data.d)
			// 		this.goRegistration = true,
			// 		this.showMessage = false
			// 		this.errorMessage = 'Проверка!!!'
			// 		// eslint-disable-next-line
			// 		console.log(this.eventInfo.eventTitle + '\n' + this.goRegistration + '\n' + this.showMessage)
			// 	},
			// 	onError: function(error) {
			// 		this.error = error
			// 		this.showMessage = true
			// 		this.goRegistration = false
			// 		this.eventInfo = null
			// 		if (error.response) {
			// 			// ответ получен, но ошибка
			// 			this.message = 'Status: ' + error.response.status + '\nОшибка: ' + error.response.data
			// 		} else if (error.request) {
			// 			// запрос выполнен, но ответ не получен
			// 			this.message = "Ответ от сервера не получен!"
			// 		} else {
			// 			this.message = error.message
			// 		}
			// 	}
			// })
			// 
			// ## Stub --->
			// if (eventid === '8a583d06-4920-4cdc-bcdd-ef2d32463a81') {
			// 	return {
			// 		eventTitle: 'Вебинар',
			// 		eventDate: '2019-12-31',
			// 		eventTime: '23:30',
			// 		eventDesriprion: 'Будет по-новогоднему весело!'
			// 	}
			// } else {
			// 	return null
			// }
			// ## Stub <---
		},

		// Вызвать веб-расчет _REGFORM.HASREGISRATION
		hasRegistered ( eventid, personid ) {
			axios.post(window.myConfig.WsUrl, {
				calcId: '_REGFORM.HASREGISRATION',
				args: JSON.stringify({ eventGuid: eventid, personGuid: personid}),
				ticket: ''
			})
			.then( response => {
				// eslint-disable-next-line
				// debugger
				this.isRegistered = response.data.d === 'True' ? true : false
				if(this.isRegistered) {
					this.goRegistration = false
					this.showMessage = true
					this.message = 'Вы уже зарегистрированы!'
				} else {
					this.goRegistration = true
					this.showMessage = false
				}
			})
			.catch(error => {
				this.error = error
				this.goRegistration = false
				this.showMessage = true
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

			// this.runCalculation({
			// 	serviceName: "",
			// 	parameters: {eventGuid: eventid, personGuid: personid},
			// 	onSuccess: function() {

			// 	},
			// 	onError: function() {
			// 	}
			// })
			// if (personid === '8a583d06-4920-4cdc-bcdd-ef2d32463a81') {
			// 	this.isRegistered = true
			// 	this.message = 'Вы уже зарегистрированы на событие!'
			// 	this.showMessage = true
			// 	this.goRegistration = false
			// } else {
			// 	this.isRegistered = false
			// 	this.showMessage = false
			// 	this.goRegistration = true
			// }
		}
	},
	computed: {
		eventInfoData() {
			return this.eventInfo
		},
		goToRegistration() {
			return this.goRegistration
		}
	}
}
</script>

<style>

</style>