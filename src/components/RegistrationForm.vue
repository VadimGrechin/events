<template>
	<div class="registration-layout">
		<!-- Информация о событии -->
		<div>
			Event: {{eventInfo.eventTitle}}
			<br>
			Event date: {{eventInfo.eventDate}}
		</div>
		<!-- форма регистрации -->
		<div>
			Форма регистрации
		</div>
	</div>
</template>

<script>
export default {
	name: 'registration-form',
	props: {
		eventInfo: Object
	}
}
</script>

<style>
.registration-layout {
	display: flex;
	flex-direction: row;
}
</style>