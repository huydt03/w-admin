const app = (()=>{

	const PATH = {
		LOGIN: '/',
		LOGED: '/admin.html'
	}
	function EventHandle(a,b){let c={};function d(b){Object.defineProperty(a,b,{set:function(a){if("function"==typeof a){let d=a.name||"__";c[b]=c[b]||{},c[b][d]=c[b][d]||[],c[b][d].push(a)}else throw"handle is not a function"}}),Object.defineProperty(a.handle,b,{get:function(){var a;return a=b,Object.freeze({fire(d){for(let e in c[a]){let b=c[a][e];for(let f in b)b[f](d)}},remove(b){b=b||"__",delete c[a][b]},clear(){c[a]={}}})}})}return a.handle={add(a){for(let b in a)d(a[b])},listen(b,c){d(b),a[b]=c}},!function(){for(let a in b)d(b[a])}(),a}
	function createStorage(a){let c=JSON.parse(localStorage.getItem(a))??{},d=()=>{localStorage.setItem(a,JSON.stringify(c))},e={get:a=>c[a],set(a,b){c[a]=b,d()},remove(a){delete c[a],d()},destroy(){localStorage.removeItem(a)},clear(){c={},d()}},b={};return!function(){for(let a in e)Object.defineProperty(b,a,{get:function(){return e[a]}})}(),b}
	function Ajax(){let b=["onSuccess","onError"],a={},c,d=new XMLHttpRequest,e={get(a,b={},c=function(){}){g(a,b,"GET",c)},post(a,b={},c=function(){}){g(a,b,"POST",c)},put(a,b={},c=function(){}){g(a,b,"PUT",c)},delete(a,b={},c=function(){}){g(a,b,"DELETE",c)}};function f(c,d){var a,e=[];for(a in c)if(c.hasOwnProperty(a)){var g=d?d+"["+a+"]":a,b=c[a];e.push(null!==b&&"object"==typeof b?f(b,g):encodeURIComponent(g)+"="+encodeURIComponent(b))}return e.join("&")}function g(g,a={},h="GET",i=function(){}){d.onload=function(){if(4==this.readyState&&200==this.status){let a=JSON.parse(this.responseText);i(a),c.onSuccess.fire(a)}else c.onError.fire({status:this.status,message:this.responseText})},d.open(h,g,!0),d.setRequestHeader("Content-type","application/x-www-form-urlencoded");let b=a._header;for(let e in b)d.setRequestHeader(e,b[e]);delete a._header,d.send(f(a))}return!function(){for(let d in c=EventHandle(a,b).handle,e)Object.defineProperty(a,d,{get:function(){return e[d]}})}(),a}
	function Auth(){

		const URI = 'http://localhost/LumenApi/public/api';

		let authStorage = new createStorage('auth');

		let ajax = new Ajax;

		let profile;

		let self = {profile}

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

			ajax.onError = function(e){
				console.dir(e);
			};

			// if(self.token)
			// 	self.refresh_token();

		}
		init()

		return self;
	}

	let auth = new Auth;

	if(!auth.token && window.location.pathname != PATH.LOGIN)
		window.location = PATH.LOGIN;
	else if(auth.token && window.location.pathname == PATH.LOGIN)
		window.location = PATH.LOGED;

	return {auth, Ajax, createStorage, EventHandle}
})();
