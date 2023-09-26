document.addEventListener("DOMContentLoaded", function () {


    const unsubscribe = document.querySelector(".unsubscribe-button");

    unsubscribe.addEventListener('click', () => {
        const link = window.location.pathname;
        const pathSegments = link.split('confirm/');

        // Get the part after the last '/'
        const lastSegment = pathSegments[pathSegments.length - 1];

        fetch(`/unsubscribe/${lastSegment}`)
        .then(() => {
            window.location.href= `/unsubscribe/${lastSegment}`;
        })
        .catch(() => {
            console.log("failed");
        })

    })
})