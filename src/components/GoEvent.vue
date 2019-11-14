<template>
	<message v-if="messageTitle" :titlemessage="messageTitle" :message="messageContent"></message>
</template>

<script>
import axios from 'axios'
import Message from '../components/Message'
import {testGuid} from '../helpers/chekcer.js'
import {getIntIP, getExtIP, getClientData} from '../helpers/clientinfo.js'

export default {
	name: 'goevent',
	components: {Message},
	data() {
		return {
			eventGuid: '',
			personGuid: '',
			clientInfo: {
				intIP: '',
				extIP: '',
				os: '',
				browser: '',
				mobile: '',
				fullUserAgent: ''
			},
			messageTitle: null,
			messageContent: null,
			timeEnd: false
		}
	},
	created() {
		document.title = 'Подключение к мероприятию'
		// выполнить анализ параметров строки запроса
		this.eventGuid = this.$route.params.eventGuid
		this.personGuid = this.$route.params.personGuid ? this.$route.params.personGuid : ''
		var paramsResult = this.checkParams(this.eventGuid , this.personGuid)
		switch (paramsResult) {
			case 'eventGuidMissing':
				this.messageTitle = 'В ссылке отсутствует параметр!'
				break;
			case 'eventGuidWrong':
				this.messageTitle = 'Параметр в ссылке некорректен!'
				break;
			case 'personGuidWrong':
				this.getClientInfo()
				//this.sendClientInfo(this.eventGuid , this.personGuid, this.clientInfo)
				//this.personGuid = ''
				//this.getEventLink(this.eventGuid , this.personGuid)
				break;
			case 'ok':
				this.getClientInfo()
				//this.sendClientInfo(this.eventGuid , this.personGuid, this.clientInfo)
				//this.getEventLink(this.eventGuid , this.personGuid)
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
				eventidIsCorrect = testGuid(eventGuid)
			} else {
				return 'eventGuidMissing'
			}

			if (personGuid) {
				personidIsCorrect = testGuid(personGuid)
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
						this.personGuid = ''
						return 'personGuidWrong'
					}
				}
			} else {
				return 'eventGuidWrong'
			}
		},
		getClientInfo() {
			this.clientInfo = getClientData()
			let context = this
			getIntIP()
			.then(function (response) {
				context.clientInfo.intIP = response ? response : 'unavailable'
			})

			getExtIP()
			.then(function (response) {
				context.clientInfo.extIP = response ? response : 'unavailable'
			})
			var timeout = window.myConfig.timeout
			setTimeout(this.sendClientInfo, timeout, this.eventGuid , this.personGuid, this.clientInfo)
			// while (!(this.clientInfo.intIP && this.clientInfo.extIP)) {
			// 	if (this.timeEnd) {
			// 		this.clientInfo.intIP = 'unavailabel'
			// 		this.clientInfo.extIP = 'unavailabel'
			// 		break
			// 	}
			// }

			// let context = this
			// getIntIPa()
			// .then(result => {
			// 	context.clientInfo.intIP = result
			// 	getExtIP().then( result =>
			// 		context.clientInfo.extIP = result
			// 	)
			// 	})

			// this.clientInfo.extIP = getExtIP()
			// получить информацию о браузере и ОС
			// getClientData(this.info)
			// getClientData()
			// .then(result => {
			// 	context.clientInfo = result
			// })
		},
		sendClientInfo(eventGuid , personGuid, clientInfo) {
			alert(JSON.stringify(clientInfo))
			axios.post(window.myConfig.WsUrl, {
				calcId: '_REGFORM.SAVECLIENTINFO',
				args: JSON.stringify({eventGuid , personGuid, clientInfo}),
				ticket: ''
			})
			this.getEventLink(eventGuid, personGuid)
		}
	}
}
</script>

<style>

</style>