<template>
	<v-container fluid>
		<v-layout align-center justify-end column fill-height>
			<v-flex xs-12>
				<h2 class="text-xs-center">{{message}}</h2>
			</v-flex>
		</v-layout>
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