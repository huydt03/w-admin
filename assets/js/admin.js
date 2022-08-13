(()=>{

	const MENU = [
		['DashBroad', function(){
		}],
		['Users',
			[
				['User List', function(){}],
				['Add User', function(){}]
			],
			function(){}
		],
		['Groups',
			[
				['GroupList',
					[
						['Preview', function(){}]
					], function(){}
				],
				['Add Group', function(){}]
			],
			function(){}
		]
	]

	let menu = JSMenu(MENU);

	var vue = new Vue({
		el: '#app',
		data: {
			app: {
				title: menu.data[0].label,
				grand_parent: menu.data[0].grand_parent,
				menu: menu.data
			},
			page: {
				name: null
			}
			
		},
		methods: {
		}
	});

	menu.onItemAction = function(e) {
		vue.app.title = e.label;
		vue.app.grand_parent = e.grand_parent;
		vue.page.name = e.label;
	}

	menu.action_from_url();


})();