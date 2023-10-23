document.addEventListener('DOMContentLoaded', () => {



    const button = document.querySelector('form button');

    const password = document.querySelector('input[name="password"]');
    const repeatPassword = document.querySelector('input[name="repeat-password"]');


    repeatPassword.addEventListener('input', (event) => {

        if(password.value === repeatPassword.value) {
            repeatPassword.style.borderColor = 'var(--accent-color)';
            button.disabled = false;
        }else {
            repeatPassword.style.borderColor = 'var(--red-color)';
            button.disabled = true;
        }

    })

    button.addEventListener('click', () => {

        const wrapper = document.querySelector(".reset-wrapper form");
        const reset = document.querySelector(".reset");
        const backButton = document.querySelector(".back-button");

        backButton.addEventListener('click', () => {
            window.location.href = '/login';
        })

        wrapper.style.display="none";
        reset.classList.add("reset-show");
    })


})