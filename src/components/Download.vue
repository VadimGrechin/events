<template>
	<v-content>
		<a v-if="link" :href="link"></a>
		<message v-if="messageTitle" :titlemessage="messageTitle" :message="messageContent"></message>
	</v-content>
</template>

<script>
import axios from 'axios'
import Message from './Message'

export default {
	name: '',
	data() {
		return {
			link: '',
			messageTitle: '',
			messageContent: ''
		}
	},
	created() {
		// получить параметры строки запроса
		
	},
	metods: {

	}
}
</script>

<style>

</style>