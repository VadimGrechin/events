import axios from 'axios'

export default {
	methods: {
		runCalculation(params) {
			axios({
				method: "post",
				url: window.myConfig.WsUrl,
				headers: {'content-type': 'application/json'},
				data: {
					calcId: params.serviceName,
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