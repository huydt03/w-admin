(()=>{
	const loader = document.getElementById('loader');
	const modal = document.getElementById('modal');
	let modal_container = modal.querySelector('.modal-container');

	function add_message(message){
		modal_container.innerHTML += message + '<br />';
	}

	// Ajax
	auth.ajax.onError = function(e){
		loader.style.display = null;
		if(!e.message)
			return;
		let messages = JSON.parse(e.message);
		modal.style.display = 'flex';
		modal_container.innerHTML = '';
		for(let k in messages){
			if(typeof messages[k] == 'object')
				for(let i in messages[k])
					add_message(messages[k][i]);
			else
				add_message(messages[k]);
		}
	}

	auth.ajax.onBeforeAction = function(){
		loader.style.display = null;
		modal.style.display = null;
		loader.style.display = 'flex';
	}

	auth.ajax.onAfterAction = function(){
		loader.style.display = null;
	}

	// FormValidate
	new $.FormValidate(document.getElementsByTagName('form')).onFieldValidated = function(e){
		const dom = e.el.parentElement;
		if(e.result === true){
			dom.setAttribute('validated', true);
			dom.removeAttribute('data-validate');
		}
		else if(e.result === 1){
			dom.removeAttribute('validated');
			dom.removeAttribute('data-validate');
		}
		else{
			if(e.result)
				dom.setAttribute('data-validate', e.result);
			dom.setAttribute('validated', false);
		}
	}

})();