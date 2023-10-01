document.addEventListener('DOMContentLoaded', function () {


    const button = document.querySelector('.send-button');

    function handleSubmit(event) {

        // Prevent the default form submission
        event.preventDefault();

        // Get form data
        const name = document.querySelector('input[name="name-field"]').value;
        const email = document.querySelector('input[name="email-field"]').value;
        const message = document.querySelector('textarea[name="message-field"]').value;

        // Send form data to the server using AJAX
        const xhr = new XMLHttpRequest();

        xhr.open('POST', '/sendEmail', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = () => {
            if (xhr.status === 200) {
                alert('Email sent successfully');
            } else {
                alert('Error sending email');
            }
        };

        xhr.send(`name=${name}&email=${email}&message=${message}`);
    }


    button.addEventListener("click", handleSubmit);


});
