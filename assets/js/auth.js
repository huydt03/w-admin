const auth = (()=> {
	function Auth(){

		// const URI = 'http://localhost/LumenApi/public/api';
		const URI = 'http://20.214.166.135/public/api';

		let authStorage = new $.createStorage('auth');

		let ajax = new $.Ajax;

		let profile;

		let self = {profile, ajax}

		let fns = {
			login(data, callback = function(){}){
				let {username, email, password} = data;
				ajax.post(URI+'/login', {
					username, password, email
				}, function(data){
					authStorage.set('token', data.access_token);
					callback();
					window.location = PATH.LOGED;
				});
			},
			refresh_token(){
				ajax.post(URI+'/refresh', {_header: {Authorization: 'bearer '+ self.token}}, function(data){
					authStorage.set('token', data.access_token);
					profile = data.user;
				});
			},
			logout: (callback = function(){})=> {
				authStorage.remove('token');
				if(typeof callback === 'function')
					callback();
				window.location = PATH.LOGIN;
			}
		}

		function init(){

			for(let k in fns){
				Object.defineProperty(self, k, {
					get: function(){ return fns[k]; }
				});
			}

			Object.defineProperty(self, 'token', {
				get: function(){ return authStorage.get('token'); }
			});

			Object.defineProperty(self, 'profile', {
				get: function(){ return profile; }
			});

			// if(self.token)
			// 	self.refresh_token();

		}
		init()

		return self;
	}

	const PATH = {
		LOGIN: '/w-admin/',
		LOGED: '/w-admin/admin.html'
	}


	let auth = new Auth;

	if(!auth.token && window.location.pathname != PATH.LOGIN)
		window.location = PATH.LOGIN;
	else if(auth.token && window.location.pathname == PATH.LOGIN)
		window.location = PATH.LOGED;

	return auth;

})();


