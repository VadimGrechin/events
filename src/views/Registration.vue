<template>
	<div class="registration-layout">
		<!-- Регистрация -->
		<RegistrationForm v-if="goRegistration"></RegistrationForm>
		<!-- сообщение -->
		<Message v-if="showMessage" :message="message"></Message>
	</div>
</template>

<script>

import RegistrationForm from '../components/RegistrationForm'
import Message from '../components/Message'

export default {
	name: 'regi',
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
			goRegistration: false,
			showMessage: false,
			message: ''
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
			// case '':
			// 	break;
			default:
				this.showMessage = false
				this.goRegistration = true
		}
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
			
		}
	}
}
</script>

<style>

</style>