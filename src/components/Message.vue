<template>
	<v-container fluid>
		<v-card >
			<v-layout align-center justify-end column fill-height>
				<h2 class="text-xs-center">{{message}}</h2>
			</v-layout>
		</v-card>
	</v-container>
</template>

<script>
export default {
	name: 'message',
	props: ['message'],
	data() {
		return {
		}
	},
	created() {
	}
}
</script>

<style>

</style>