<template>
  <v-app>
    <v-content fluid>
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>

import {i18n} from './plugins/i18n.js'

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    //
  }),
  created() {
    var lang = ''
    try {
      lang = this.$route.query ? this.$route.query.lang.toLowerCase() : 'ru'
    } catch (error) {
      lang = 'ru'
    }
    i18n.locale = lang
    window.myConfig.lang = lang
  },
  mounted() {
    var title = ''
    var routeName = this.$route.name
    switch (routeName) {
      case 'registrationknown':
      case 'registrationnew':
      case 'noparams':
        title = this.$t('windowTitle.registration')
        break
      case 'goevent':
        title = this.$t('windowTitle.linkToEvent')
        break
      case 'download':
        title = 'Download'
        break
    }
    document.title = title
  },

	methods: {
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
