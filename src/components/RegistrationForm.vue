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
			<v-form
						ref=form
						v-model="valid"
						:lazy-validation="lazy">
				<!-- Поля -->
				<v-text-field
						v-model="registrationData.name"
						:rules="nameRules"
						label="Имя"
						required></v-text-field>

				<v-text-field
						v-model="registrationData.surname"
						:rules="nameRules"
						label="Фамилия"></v-text-field>
				
				<v-text-field
						v-model="registrationData.email"
						:rules="emailRules"
						label="e-mail"
						required></v-text-field>

				<v-text-field
						v-model="registrationData.company"
						label="Компания"></v-text-field>
				
				<v-text-field
						v-model="registrationData.phone"
						:rules="phoneRules"
						label="Компания"></v-text-field>

				<v-select
						v-model="registrationData.companyemployeesqty"
						:items="items"
						labels="Сотрудников в компании"></v-select>

			</v-form>
		</div>
	</div>
</template>

<script>
export default {
	name: 'registration-form',
	props: {
		eventInfo: Object,
		idparams: Object
	},
	data() {
		return {
			valid: true,
			lazy: true,
			nameRules: [],
			emailRules:[],
			phoneRules:[],
			items: [],
			
			registrationData: {
				eventid: idparams.eventGuid,
				personid: idparams.personGuid,
				name: '',
				surname: '',
				email: '',
				company: '',
				phone: '',
				companyemployeesqty: ''
			}
		}
	},
	methods: {
		// Сохранить регистрационные данные
		saveRegistrationData() {
			
		}
	}
}
</script>

<style>
.registration-layout {
	display: flex;
	flex-direction: row;
}
</style>