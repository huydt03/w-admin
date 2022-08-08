(()=>{

	const MENU = {
		HOME: 'DashBroad',
		USERS: 'Users'
	}

	let vue = new Vue({
		el: '#app',
		data: {
			app: {
				title: MENU.HOME,
				menu: MENU
			}
			
		},
		methods: {
			menu_select: item=> { vue.app.title = item }
		}
	});

})();