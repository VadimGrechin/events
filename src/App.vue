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

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    //
  }),
  created() {
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
