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
			eventLink: null,
			messageTitle: null,
			messageContent: null
		}
	},
	created() {
		// выполнить анализ параметров строки запроса
		this.eventGuid = this.$route.params.eventGuid
		this.personGuid = this.$route.params.personGuid ? this.$route.params.personGuid : ''

		// получить ссылку на event
		this.getEventLink(this.eventGuid , this.personGuid)
	},
	methods: {
		// 
		getEventLink: function (eventGuid, personGuid) {
			// eslint-disable-next-line
			debugger
			axios.post(window.myConfig.WsUrl, {
				calcId: '_REGFORM.GOEVENT',
				args: JSON.stringify({eventGuid, personGuid}),
				ticket: ''
			})
			.then( response => {
				var link = response.data.d
				if (link) {
					window.location = link
				} else {
					this.messageTitle = 'Мероприятие завершено!'
				}
			})
			.catch(error => {
				this.messageTitle = 'Ошибка!'
				this.messageContent = error.message
			})
		}
	}
}
</script>

<style>

</style>