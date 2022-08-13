(()=>{

	const MENU = [
		['DashBroad'],
		['Users',
			[
				[{label: 'User List', age: 1}, function(){}],
				['Add User', function(){}]
			]
		],
		['Groups',
			[
				['Group List',
					[
						['Preview', function(){ }]
					],
					function(){}
				],
				['Add Group', function(){}]
			]
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
				id: 0,
				name: null
			}
			
		},
		methods: {
		}
	});

	menu.onItemAction = function(e) {
		vue.app.title = e.label;
		vue.app.grand_parent = e.grand_parent;
		vue.page.id 	= e.id;
		vue.page.name 	= e.label;
	}

	menu.action_by_query_key();


})();