<template>
	<v-container fluid>
		<v-layout align-center justify-end column fill-height class="border-frame">
			<v-flex xs-12>
				<h2 class="text-xs-center">{{titlemessage}}</h2>
			</v-flex>
			<v-flex xs-12>
				<div class="text-xs-center" v-html="message"></div>
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

<style scoped>
.border-frame{
	border: dotted 1px blue;
}
</style>