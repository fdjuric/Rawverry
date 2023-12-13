document.addEventListener('DOMContentLoaded', () => {

    const button = document.querySelector('.button');


    function handleSubmit(event) {

        // Prevent the default form submission
        event.preventDefault();



        // Get form data
        const email = document.querySelector('input[name="email"]').value;

        const wrapper = document.querySelector(".register-wrapper form");
        const reset = document.querySelector(".reset");
        const backButton = document.querySelector(".back-button");

        backButton.addEventListener('click', () => {
            window.location.href = '/';
        })

        wrapper.style.display="none";
        reset.classList.add("reset-show");
        // Send form data to the server using AJAX
        const xhr = new XMLHttpRequest();

        xhr.open('POST', '/forgot-password', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log("Success!");
            } else {
                alert('Error sending email');
            }
        };

        xhr.send(`&email=${email}`);
    }


    button.addEventListener('click', handleSubmit);
})