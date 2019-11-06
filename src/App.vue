<template>
  <v-app>
    <v-content fluid>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>

import axios from 'axios'
import {i18n} from './plugins/i18n.js'

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    //
    eventid: '',
    eventInfo: null
  }),
  created() {
    i18n.locale = this.$route.query ? this.$route.query.lang : 'ru'
    this.eventid = this.$route.params.eventGuid
  },
  mounted() {

  },
	methods: {
    getEventInfo(eventid) {
			axios.post(window.myConfig.WsUrl, {
				calcId: "_REGFORM.GETEVENTINFO",
				args: JSON.stringify({ eventGuid: eventid}),
				ticket: ''
			})
			.then(response => {
				this.eventInfo = JSON.parse(response.data.d)
				if (!this.eventInfo) {
					//this.message = 'Ссылка не связана ни с одним из событий!'
          this.message = this.$t('message.registrationPage.linkhasnotcorrespondin')
          this.$router.push({name: 'message', params: {message: this.message}})
				}
				})
			.catch(error => {
				this.error = error
				if (error.response) {
						// ответ получен, но ошибка
            this.message = this.$t('message.registrationPage.responsebuterror', {'errorresponsestatus': error.response.status, 'errorresponsedata': error.response.data})
					} else if (error.request) {
						// запрос выполнен, но ответ не получен
            this.message = this.$t('message.registrationPage.serverhasnoresponse')
            
					} else {
						this.message = error.message
          }
          this.$router.push({name: 'message', params: {message: this.message}})
			})
		},
	}
};
</script>

<style>
svg {
	width: 100%;
	height: 100%;
}
#logoWrapper {
	font-size: 28px;
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none;
}
</style>
