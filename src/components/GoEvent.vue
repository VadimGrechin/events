<template>
	<message v-if="messageTitle" :titlemessage="messageTitle" :message="messageContent"></message>
</template>

<script>
import axios from 'axios'
import Message from '../components/Message'

export default {
	name: 'goevent',
	components: {Message},
	data() {
		return {
			eventGuid: '',
			personGuid: '',
			messageTitle: null,
			messageContent: null
		}
	},
	created() {
		// выполнить анализ параметров строки запроса
		this.eventGuid = this.$route.params.eventGuid
		this.personGuid = this.$route.params.personGuid ? this.$route.params.personGuid : ''

		// Проверить параметры
		var paramsResult = this.checkParams(this.eventGuid , this.personGuid)
		switch (paramsResult) {
			case 'eventGuidMissing':
				this.messageTitle = 'В ссылке отсутствует параметр!'
				break;
			case 'eventGuidWrong':
				this.messageTitle = 'Параметр в ссылке некорректен!'
				break;
			case 'personGuidWrong':
				this.personGuid = ''
				this.getEventLink(this.eventGuid , this.personGuid)
				break;
			case 'ok':
				// получить ссылку на event
				this.getEventLink(this.eventGuid , this.personGuid)
				break;
		}
	},
	methods: {
		// 
		getEventLink: function (eventGuid, personGuid) {
			axios.post(window.myConfig.WsUrl, {
				calcId: '_REGFORM.GOEVENT',
				args: JSON.stringify({eventGuid, personGuid}),
				ticket: ''
			})
			.then( response => {
				var resp = JSON.parse(response.data.d)
				if (resp.success) {
					var link = resp.link
					if (link) {
						window.location = link
					} else {
						this.messageTitle = 'Ссылка сейчас недоступна!'
					}
				} else {
					this.messageTitle = resp.message
				}
			})
			.catch(error => {
				if (error.response) {
					this.messageContent = 'Status: ' + error.response.status + '<br>' + error.response.header
				} else if (error.request) {
					this.messageContent = error.request
				} else {
					this.messageContent = error.message
				}
				this.messageTitle = 'Ошибка!'
			})
		},
		checkParams: function(eventGuid, personGuid) {
			var eventidIsCorrect = false
			var personidIsCorrect  = false
			var personidIsMissing = true
			// Параметр отсутствует 
			if (eventGuid) {
				eventidIsCorrect = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(eventGuid)
			} else {
				return 'eventGuidMissing'
			}

			if (personGuid) {
				personidIsCorrect = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(personGuid)
				personidIsMissing = false
			}
			// Корректность параметров
			if (eventidIsCorrect) {
				if (personidIsMissing) {
					return 'ok'
				} else {
					if (personidIsCorrect) {
						return 'ok'
					} else {
						return 'personGuidWrong'
					}
				}
			} else {
				return 'eventGuidWrong'
			}
		}
	}
}
</script>

<style>

</style>