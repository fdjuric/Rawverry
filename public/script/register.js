document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('.register-wrapper .register .button').addEventListener('click', function (event) {
        event.preventDefault();

        const urlValue = window.location.href;

        const urlToken = urlValue.split('/register/').pop();

        const formData = new FormData();

        const username = document.querySelector('.name-field');
        const password = document.querySelector('.password-field');

        formData.append('username', username.value);
        formData.append('password', password.value)
        
        const url = `/register/${urlToken}`;

        fetch(url, {
            method: 'POST',
            body: formData,
        })
        .then()
        .catch(error => {
            console.error('Error:', error);
        });
    });
})