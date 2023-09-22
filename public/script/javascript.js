document.addEventListener('DOMContentLoaded', function () {
    fetch('/getCategory')
    .then(response => response.json())
    .then(data => {
        displayCategory(data['data']);
    })

    function displayCategory(category) {
        console.log("category:", category);
        category.forEach((item) => {
            var categoryId = document.createElement("h1");
            categoryId.textContent = item.category_id;

            var categoryName = document.createElement("h1");
            categoryName.textContent = item.category_name;

            header = document.querySelector(".header");
            header.appendChild(categoryId);
            header.appendChild(categoryName);
        })
    }
})