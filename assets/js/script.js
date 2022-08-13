function login(e) {
	e.preventDefault();
	e.target.blur();
	const formData = new FormData(e.target);
	const formProps = Object.fromEntries(formData);
	auth.login(formProps);
}