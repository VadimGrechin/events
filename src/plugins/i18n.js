import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const	messages = {
		ru: {
			message: {
				errorPage: {
					error: 'Ошибка!!!',
					linkisnotcorrect: 'Некорректная ссылка!',
				},
				registrationPage: {
					hasnoparams: 'В ссылке нет параметров!',
					paramIsWrong: 'Параметр в ссылке некорректен!',
					paramsAreWrong: 'Параметры в ссылке некорректны!',
					secondparamIsWrong: 'Второй параметр в ссылке не корректен!',
					firstparamIsWrong: 'Первый параметр в ссылке не корректен!',
					linkhasnotcorrespondin: 'Ссылка не связана ни с одним из событий!',
					serverhasnoresponse: 'Ответ от сервера не получен!',
					responsebuterror: 'Код ответа: {errorresponsestatus}\nОшибка: {errorresponsedata}',
					youhaveregistration: 'Вы уже зарегистрированы!',
				},
				registrationForm: {
					name: 'Имя',
					surname: 'Фамилия',
					company: 'Компания',
					position: 'Должность',
					phone: 'Телефон',
					consentprocessingpersdata: 'Я согласен на обработку персональных данных',
					registrate: 'Зарегистрироваться',
					oblygatorytofulfill: 'Обязательно для заполнения!',
					namehasconsistsletteronly: 'В имени должны быть только буквы',
					wronemail: "Некоректный e-mail!",
					rightcompanyname: "Допустимы буквы, цифры, символы: '.', '-', '&'",
					rightpositionname: "Допустимы буквы, цифры, символы: '.', '-'",
					rightphonevalue: "Первый символ '+', далее - код страны, города/оператора мобильной связи, номер",
					linehasmore50symbols: 'Количество символов превышает 50',
					linehasmore100symbols: 'Количество символов превышает 100',
					registrationsuccess: 'Регистрация прошла успешно!',
					registratonfailed: 'Данные регистрации не были сохранены.',
				}	
			}
		},
		uk: {
			message: {
				errorPage: {
					error: 'Помилка!!!',
					linkisnotcorrect: 'Некоректне посилання!',
				},
				registrationPage: {
					hasnoparams: 'В посиланні відсутні параметри!',
					paramIsWrong: 'Параметр в посиланні некоректний!',
					paramsAreWrong: 'Параметри в посиланні некоректні!',
					secondparamIsWrong: 'Другий параметр в посиланні некоректний!',
					firstparamIsWrong: 'Перший параметр в посиланні некорекний!',
					linkhasnotcorrespondin: "Посилання не пов'язане з жодною подією!",
					serverhasnoresponse: 'Відповідь від сервера не отримана!',
					responsebuterror: 'Код відповіді: {errorresponsestatus}\nПомилка: {errorresponsedata}',
					youhaveregistration: 'Ви вже зареєстровані!',
				},
				registrationForm: {
					name: "Ім'я",
					surname: 'Прізвище',
					company: 'Компанія',
					position: 'Посада',
					phone: 'Телефон',
					consentprocessingpersdata: 'Я згоден на обробку персональних даних',
					registrate: 'Зареєструватися',
					oblygatorytofulfill: "Обов'язково для заповнення!",
					namehasconsistsletteronly: 'В імені мають бути лише літери',
					wronemail: "Некоректний e-mail!",
					rightcompanyname: "Дозволені літери, цифры, символы: '.', '-', '&'",
					rightpositionname: "Дозволені літери, цифры, символы: '.', '-'",
					rightphonevalue: "Перший символ '+', далі - код країни, міста/оператора мобільного зв'язку, номер",
					linehasmore50symbols: 'Кількість символів перевищує 50',
					linehasmore100symbols: 'Кількість символів перевищує 100',
					registrationsuccess: 'Реєстрація пройшла успішно!',
					registratonfailed: 'Дані реєстрації не були збережені.',
				},
			}
		}
	}

export const i18n = new VueI18n({
	fallbackLocale: 'ru',
	messages
})