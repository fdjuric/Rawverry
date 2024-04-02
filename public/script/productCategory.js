document.addEventListener('DOMContentLoaded', () => {

    
    const url = window.location.href;

    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;

    const fetchUrl = path.substring(path.lastIndexOf("/") + 1);

    console.log(fetchUrl);

    fetch(`/getGalleryData/${fetchUrl}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        const productData = []

        data.forEach((item,index) => {
            if(index !== 0)
            productData.push(item);
        })

        console.log(productData);

        const header = document.querySelector('.hero-text h1');
        const subheader = document.querySelector('.hero-text .subheader');
        header.textContent = data[0].category_header;
        subheader.textContent = data[0].category_subheader;

        const backgroundImg = document.querySelector('.hero-wrapper');

        console.log(data[0].category_image);

        backgroundImg.style.backgroundImage = `url(../${data[0].category_image})`;
        backgroundImg.style.backgroundSize = 'cover';
        backgroundImg.style.backgroundRepeat = 'no-repeat';
        backgroundImg.style.backgroundPosition = 'left';
        
        productData.forEach((item, index) => {
            // Create the main div element with the specified classes
            const mainDiv = document.createElement('div');
            mainDiv.classList.add('product');

            // Create the image element and set its src attribute
            const img = document.createElement('img');
            img.src = '../' + item.image_url_1;

            let imgSource = img.src;

            img.addEventListener('mouseover', () => {
                if (item.image_url_2 !== null) {

                    img.style.opacity = 0.2; // Fade out the image

                    // Change the image source after the fade-out transition completes
                    setTimeout(function () {
                        img.src = '../' + item.image_url_2; // Change to the new image source
                    }, 400); // Adjust this value to match the transition duration

                    // Fade in the new image after a short delay
                    setTimeout(function () {
                        img.style.opacity = 1;
                    }, 400); // Adjust this value to match the delay + transition duration

                }

            })

            img.addEventListener('mouseout', () => {

                if (img.src !== imgSource) {
                    img.style.opacity = 0.2; // Fade out the image

                    // Change the image source after the fade-out transition completes
                    setTimeout(function () {
                        img.src = '../' + item.image_url_1; // Change to the new image source
                    }, 400); // Adjust this value to match the transition duration

                    // Fade in the new image after a short delay
                    setTimeout(function () {
                        img.style.opacity = 1;
                    }, 400); // Adjust this value to match the delay + transition duration
                }
            })

            // Create the paragraph element with the specified class and text content
            const subheader = document.createElement('p');
            subheader.classList.add('subheader', 'blk');
            subheader.textContent = item.product_name;

            // Create the price div element
            const priceDiv = document.createElement('div');
            priceDiv.classList.add('price');

            // Create the first price paragraph element with the specified class and text content
            const priceParagraph1 = document.createElement('p');
            priceParagraph1.classList.add('paragraph-bold', 'blk');

            // Create the second price paragraph element with the specified class and text content
            const priceParagraph2 = document.createElement('p');
            priceParagraph2.classList.add('price-reduced', 'blk-shade');
            if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                priceParagraph1.textContent = `From $${item.product_price_reduced}`;
                priceParagraph2.textContent = `$${item.product_price}`;
            } else {
                priceParagraph1.textContent = `From $${item.product_price}`;
            }

            // Append the price paragraph elements to the price div element
            priceDiv.appendChild(priceParagraph1);
            priceDiv.appendChild(priceParagraph2);

            // Append the image, subheader, and price div elements to the main div element
            mainDiv.appendChild(img);
            mainDiv.appendChild(subheader);
            mainDiv.appendChild(priceDiv);

            mainDiv.addEventListener('click', () => {

                console.log("test " + item.product_id);

                const productName = item.product_name;
                const formmatedName = productName.replace(/\s+/g, "-");
                console.log(formmatedName);

                fetch(`/product/${formmatedName}`)
                    .then(() => {
                        window.location.href = `/product/${formmatedName}`;
                    })
                    .catch(err => console.error(err));

            })

            mainDiv.addEventListener('touchend', () => {

                if (movePosition === 0) {

                    console.log("test " + item.product_id);

                    const productName = item.product_name;
                    const formmatedName = productName.replace(/\s+/g, "-");
                    console.log(formmatedName);

                    fetch(`/product/${formmatedName}`)
                        .then(() => {
                            window.location.href = `/product/${formmatedName}`;
                        })
                        .catch(err => console.error(err));

                }

                movePosition = 0;

            })

            // Append the main div element to the desired parent element in the document
            const parentElement = document.querySelector('.products'); // Replace 'parent-element-class' with the actual class of the parent element
            parentElement.appendChild(mainDiv);
        })
    })
    .catch(err => console.log(err))








})