function login(e) {
	 e.preventDefault();
	  const formData = new FormData(e.target);
	  const formProps = Object.fromEntries(formData);
	  app.auth.login(formProps);
}