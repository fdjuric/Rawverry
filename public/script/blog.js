document.addEventListener('DOMContentLoaded', () => {


    fetch('/getBlogs')
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
})