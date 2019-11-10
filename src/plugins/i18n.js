import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const	messages = {
		ru: {
			message: {
				errorPage: {
					error: 'Ошибка!!!',
					linkIsWrong: 'Некорректная ссылка!',
				},
				registrationPage: {
					linkHasNoParams: 'В ссылке нет параметров!',
					paramIsWrong: 'Параметр в ссылке некорректен!',
					paramsAreWrong: 'Параметры в ссылке некорректны!',
					secondParamIsWrong: 'Второй параметр в ссылке не корректен!',
					firstParamIsWrong: 'Первый параметр в ссылке не корректен!',
					linkHasNotCorrespondin: 'Ссылка не связана ни с одним из событий!',
					serverNotResponse: 'Ответ от сервера не получен!',
					responseButError: 'Код ответа: {errorresponsestatus}\nОшибка: {errorresponsedata}',
					youHaveRegistration: 'Вы уже зарегистрированы!',
				},
				registrationForm: {
					name: 'Имя',
					surname: 'Фамилия',
					company: 'Компания',
					position: 'Должность',
					phone: 'Телефон',
					consentProcessingPersData: 'Я согласен на обработку персональных данных',
					registrate: 'Зарегистрироваться',
					obligatoryWriteIn: 'Обязательно для заполнения!',
					nameMastConsistsLettersOnly: 'В имени должны быть только буквы',
					wronEmail: "Некоректный e-mail!",
					rightCompanyName: "Допустимы буквы, цифры, символы: '.', '-', '&'",
					rightPositionName: "Допустимы буквы, цифры, символы: '.', '-'",
					rightPhoneNumber: "Первый символ '+', далее - код страны, города/оператора мобильной связи, номер",
					lineHasMore50symbols: 'Количество символов превышает 50',
					lineHasMore100symbols: 'Количество символов превышает 100',
					registrationSuccess: 'Регистрация прошла успешно!',
					registratonFailed: 'Данные регистрации не были сохранены.',
				}	
			}
		},
		uk: {
			message: {
				errorPage: {
					error: 'Помилка!!!',
					linkIsWrong: 'Некоректне посилання!',
				},
				registrationPage: {
					linkHasNoParams: 'В посиланні відсутні параметри!',
					paramIsWrong: 'Параметр в посиланні некоректний!',
					paramsAreWrong: 'Параметри в посиланні некоректні!',
					secondParamIsWrong: 'Другий параметр в посиланні некоректний!',
					firstParamIsWrong: 'Перший параметр в посиланні некорекний!',
					linkHasNotCorrespondin: "Посилання не пов'язане з жодною подією!",
					serverNotResponse: 'Відповідь від сервера не отримана!',
					responseButError: 'Код відповіді: {errorresponsestatus}\nПомилка: {errorresponsedata}',
					youHaveRegistration: 'Ви вже зареєстровані!',
				},
				registrationForm: {
					name: "Ім'я",
					surname: 'Прізвище',
					company: 'Компанія',
					position: 'Посада',
					phone: 'Телефон',
					consentProcessingPersData: 'Я згоден на обробку персональних даних',
					registrate: 'Зареєструватися',
					obligatoryWriteIn: "Обов'язково для заповнення!",
					nameMastConsistsLettersOnly: 'В імені мають бути лише літери',
					wronEmail: "Некоректний e-mail!",
					rightCompanyName: "Дозволені літери, цифры, символы: '.', '-', '&'",
					rightPositionName: "Дозволені літери, цифры, символы: '.', '-'",
					rightPhoneNumber: "Перший символ '+', далі - код країни, міста/оператора мобільного зв'язку, номер",
					lineHasMore50symbols: 'Кількість символів перевищує 50',
					lineHasMore100symbols: 'Кількість символів перевищує 100',
					registrationSuccess: 'Реєстрація пройшла успішно!',
					registratonFailed: 'Дані реєстрації не були збережені.',
				},
			}
		}
	}

export const i18n = new VueI18n({
	fallbackLocale: 'ru',
	silentFallbackWarn: true,
	messages
})