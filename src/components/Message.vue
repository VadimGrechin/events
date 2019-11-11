<template>
	<v-container fluid>
		<v-layout align-center justify-end column fill-height>
			<v-flex xs-12>
				<h2 class="text-xs-center">{{titlemessage}}</h2>
				<div class="text-xs-center">{{message}}</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	name: 'message',
	props: ['titlemessage', 'message'],
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