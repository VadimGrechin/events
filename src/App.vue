<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <img src="./assets/logo.png" alt="" height="34px" srcset="">
        <span>IT-Enterprise</span>
        <span class="font-weight-light"> Регистрация</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
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
