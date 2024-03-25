document.addEventListener('DOMContentLoaded', () => {

    fetch('/getCart')
    .then(response => response.json())
    .then((data) => {
        console.log(data);
    })
})