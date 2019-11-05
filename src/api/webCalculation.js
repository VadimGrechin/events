import axios from 'axios'

export default {
	methods: {
		runCalculation(params) {
			/// eslint-disable-next-line
			// debugger
			// axios.default.withCredentials = true;
			// url: "https://m.it.ua/ws/WebService.asmx/Execute"
			axios({
				method: "post",
				url: window.myConfig.WsUrl,
				headers: {'content-type': 'application/json'},
				data: {
					calcId: params.serviceName, //"_REGFORM.GETEVENTINFO",
					args: JSON.stringify(params.parameters),
					ticket: ""
				}
			})
				.then(function (response) {
					// handle success
					params.onSuccess(response.data);
				})
				.catch(function (error) {
					// handle error
					if (params.onError) {
						params.onError(error);
					}
					alert(error);
				});
		},
	}
}