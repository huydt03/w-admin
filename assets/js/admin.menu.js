function JSMenu(menu, options = {}){

	const EVENTS = [
		'onItemAction',
		'onItemInit'
	];

	let query_key = options.query_key || 'label';

	let isPopState;

	let currAction;

	function menuItem(id, data, action = null, parent = null){

		const EVENTS = [
			'onBeforeAction',
			'onAfterAction',
		];

		const {label, slug} = data;

		let self = {id, label: label || data, slug};

		let _handle;

		let _action;

		let _pushState;

		function grand_parent(parent = self){
			if(!parent.parent)
				return [[parent._id, parent.label, parent.slug, parent.action]];
			return [...grand_parent(parent.parent), [parent._id, parent.label, parent.slug, parent.action]];
		}

		function init(){

			_handle = $.EventHandle(self, EVENTS).handle;

			delete self.handle;

			_action = function(e){
				if(currAction == self)
					return;
				currAction = self;
				_handle.onBeforeAction.fire(self);
				if(isPopState && !e.isPopState)
					window.history.pushState(self.id, self.label, `?${query_key}=${self[query_key]}`);
				handle.onItemAction.fire(self);
				if(typeof action == 'function')
					action(e, self);
				_handle.onAfterAction.fire(self);
			}
				
			Object.defineProperties(self, {
				id: { get: function(){ let p_id = parent? parent.id: ''; return p_id + id + ''; } },
				_id: { get: function(){ return id; } },
				action: { 
					get: function(){ return _action; },
					set: function(value){ if(typeof action == 'function'); action = value }
				},
				parent: { 
					get: function(){ return parent; },
					set: function(value){
						parent = value;
					}
				},
				grand_parent: { get: function(){ return grand_parent(); } }
			});

		}init();

		return self;
	}

	let handle;

	let result;

	let root = {};

	let self = {};

	function initMenu(arr, parent = null, _items = {}){
		if(parent)
			parent.childs = {};
		for(let i in arr){
			let item = new menuItem(i, arr[i][0], arr[i][2] || arr[i][1], parent);
			handle.onItemInit.fire(item);
			_items[item.id] = item;
			if(parent && parent.childs)
				parent.childs[item.id] = item;
			else
				root[item.id] = item;
			if(typeof arr[i][1] == 'object'){
				initMenu(arr[i][1], item, _items);
			}
		}

		return _items;
	}

	function findItem(key, value, items = result){
		for(let i in items){
			let item = items[i];
			if(item[key] == value)
				return item;
		}
		return false;
	}

	function findItemByLabel(label){
		return findItem('label', label);
	}

	function findItemBySlug(slug){
		return findItem('slug', slug);
	}

	function findItemById(id, items = result){
		return items[id];
	}

	let find = {
		label: findItemByLabel,
		slug: findItemBySlug,
		id: findItemById
	}

	function action_from_url(){
		const params = new Proxy(new URLSearchParams(window.location.search), {
		  get: (searchParams, prop) => searchParams.get(prop),
		});
		let item = find[query_key](params[query_key]);
		item.action({isPopState: true});
	}

	function init(){
		handle = $.EventHandle(self, EVENTS).handle;
		result = initMenu(menu);

		Object.defineProperties(self, {
			data: { get: function(){ return root; } },
			init: { get: function(){ return initMenu; } },
			isPopState: {
				get: function(){ return isPopState; },
				set: function(value){
					if(value) window.onpopstate = action_from_url;
					else window.onpopstate = null;
					isPopState = value;
				}
			},
			action_from_url: { get: function(){ return action_from_url; } },
			findItemById: { get: function(){ return findItemById; } },
			findItemByLabel: { get: function(){ return findItemByLabel; } },
			findItemBySlug: { get: function(){ return findItemBySlug; } },
		})

		self.isPopState = (options.isPopState !== false);

		delete self.handle;
	}
	init();

	return self;
}