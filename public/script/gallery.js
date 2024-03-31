document.addEventListener('DOMContentLoaded', () => {


    fetch('/getCategories')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        const categoryWrapper = document.querySelector('.category-wrapper');

        data.forEach(element => {
            const div = document.createElement('div');
            div.classList.add('category');
            const a = document.createElement('a');
            const url = element.category_name.split(' ').join('-');
            a.href = 'gallery/' + url.toLowerCase();
            const div1 = document.createElement('div');
            div1.style.backgroundImage = `url(${element.category_image})`;
            div1.style.backgroundSize = `cover`;
            div1.style.backgroundRepeat = "no-repeat";
            div1.style.backgroundPosition = "center center";
            const div2 = document.createElement('div');
            const h1 = document.createElement('h1');
            h1.textContent = element.category_name;

            div.appendChild(a);
            div.appendChild(div1);
            div.appendChild(div2);
            div.appendChild(h1);

            categoryWrapper.appendChild(div);

        });
    })
})