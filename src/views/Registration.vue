<template>
	<v-container>
		<v-layout column>
			<!-- Название события -->
			<v-flex xs-12 v-if="eventInfo">
				<h2 class="text-md-center text-sm-center text-xs-center">
					{{eventInfo.eventTitle}}</h2>
			</v-flex>
			<v-layout my-1 row>
				<!-- Регистрация -->
				<registration-form v-if="goRegistration && eventInfo && personInfoComp !== undefined" 
												:event-info="eventInfo"
												:person-info="personInfoComp"
												:idparams="params"></registration-form>
				<!-- сообщение/ сообщение об ошибке -->
				<message v-if="showMessage" :message="message"></message>
			</v-layout>
		</v-layout>
	</v-container>
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
			personInfo: undefined,
			isRegistered: false,
			skipRegistrationCheck: false
		}
	},
	created() {
		this.params.eventid = this.$route.params.eventGuid
		this.params.personid = this.$route.params.personGuid

		var paramsCheckResult = this.checkParams(this.params)
		
		this.showMessage = true
		switch (paramsCheckResult) {
			case 'noparams':
				this.message = this.$t('message.registrationPage.linkHasNoParams')
				// this.message = 'В ссылке нет параметров!'
				break;
			case 'parameternotcorrect':
				// this.message = 'Параметр в ссылке некорректен!'
				this.message = this.$t('message.registrationPage.paramIsWrong')
				break;
			case 'bothparamsnotcorrect':
				//this.message = 'Параметры в ссылке некорректны!'
				this.message = this.$t('message.registrationPage.paramsAreWrong')
				break;
			case 'secondparamnotcorrect':
				//this.message = 'Второй параметр в ссылке не корректен!'
				this.message = this.$t('message.registrationPage.secondParamIsWrong')
				break;
			case 'firstparamnotcorrect':
				//this.message = 'Первый параметр в ссылке не корректен!'
				this.message = this.$t('message.registrationPage.firstParamIsWrong')
				break;
			case 'nosecondparams':
				this.showMessage = false
				this.goRegistration = true
				this.skipRegistrationCheck = true
				this.personInfo = null
				break;
			case 'ok':
				this.showMessage = false
				this.goRegistration = true
				break;
			default: break;
		}
		if(!this.showMessage) {
			this.getEventInfo(this.params.eventid)
		}
	},

	mounted() {
	},
	methods: {
		// Проверить параметры строки запроса
		checkParams(params) {
			// Наличие параметров и корректность параметров
			var eventidIsCorrect = false
			var personidIsCorrect  = false
			if (!params.eventid && !params.personid) {
				return 'noparams'
			}
			if (params.eventid && !params.personid) {
				eventidIsCorrect = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(params.eventid)
				if (eventidIsCorrect) {
					return 'nosecondparams'
				} else {
					return 'parameternotcorrect' 
				}
			}
			
			eventidIsCorrect = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(params.eventid)
			personidIsCorrect = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(params.personid)
			
			if (!eventidIsCorrect && !personidIsCorrect) {
				return 'bothparamsnotcorrect'
			}
			if (!eventidIsCorrect && personidIsCorrect) {
				return 'firstparamnotcorrect'
			}
			if (eventidIsCorrect && !personidIsCorrect) {
				return 'secondparamnotcorrect'
			}
			return 'ok'
		},
		// Получить информция о событии _REGFORM.GETEVENTINFO
		getEventInfo(eventid) {
			axios.post(window.myConfig.WsUrl, {
				calcId: "_REGFORM.GETEVENTINFO",
				args: JSON.stringify({ eventGuid: eventid}),
				ticket: ''
			})
			.then(response => {
				this.eventInfo = JSON.parse(response.data.d)
				if (this.eventInfo) {
					this.goRegistration = true
					this.showMessage = false
					if (!this.skipRegistrationCheck) {
						this.hasRegistered(this.params.eventid, this.params.personid)
					}
				} else {
					this.goRegistration = false
					this.showMessage = true
					//this.message = 'Ссылка не связана ни с одним из событий!'
					this.message = this.$t('message.registrationPage.linkHasNotCorrespondin')
				}
				})
			.catch(error => {
				this.error = error
				this.goRegistration = false
				this.showMessage = true
				if (error.response) {
						// ответ получен, но ошибка
						// this.message = 'Status: ' + error.response.status + '\nОшибка: ' + error.response.data
						this.message = this.$t('message.registrationPage.responseButError', {'errorresponsestatus': error.response.status, 'errorresponsedata': error.response.data})
					} else if (error.request) {
						// запрос выполнен, но ответ не получен
						//this.message = 'Ответ от сервера не получен!'
						this.message = this.$t('message.registrationPage.serverNotResponse')
					} else {
						this.message = error.message
					}
			})
		},

		// Вызвать веб-расчет _REGFORM.HASREGISRATION
		hasRegistered ( eventid, personid ) {
			axios.post(window.myConfig.WsUrl, {
				calcId: '_REGFORM.HASREGISRATION',
				args: JSON.stringify({ eventGuid: eventid, personGuid: personid}),
				ticket: ''
			})
			.then( response => {
				// aeslint-disable-next-line
				//debugger
				this.personInfo = JSON.parse(response.data.d)
				this.isRegistered = this.personInfo.isRegistered
				//this.isRegistered = response.data.d === 'True' ? true : false
				if(this.isRegistered) {
					this.goRegistration = false
					this.showMessage = true
					//this.message = 'Вы уже зарегистрированы!'
					this.message = this.$t('message.registrationPage.youHaveRegistration')
					this.personInfo = null
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
						//this.message = 'Status: ' + error.response.status + '\nОшибка: ' + error.response.data
						this.message = this.$t('message.registrationPage.responseButError', {'errorresponsestatus': error.response.status, 'errorresponsedata': error.response.data})
					} else if (error.request) {
						// запрос выполнен, но ответ не получен
						//this.message = 'Ответ от сервера не получен!'
						this.message = this.$t('message.registrationPage.serverNotResponse')
					} else {
						this.message = error.message
					}
			})
		},
	},
	computed: {
		eventInfoData() {
			return this.eventInfo
		},
		goToRegistration() {
			return this.goRegistration
		},
		personInfoComp() {
			return this.personInfo
		}
	}
}
</script>

<style>
.light-gray-color {
	background: #fafafa
}
</style>