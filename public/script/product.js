

document.addEventListener('DOMContentLoaded', () => {

    const url = window.location.href;

    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;

    const fetchUrl = path.substring(path.lastIndexOf("/") + 1);

    console.log(fetchUrl);

    fetch(`/getProduct/${fetchUrl}`)
        .then(response => response.json())
        .then((data) => {
            console.log(data);

            console.log(data[0].product_id);

            const title = document.querySelector('.description-wrapper .title');

            title.textContent = data[0].product_name;

            const sizeValueArray = data[3].map(item => ({
                id: item.id,
                product_price: item.product_price,
                product_price_reduced: item.product_price_reduced,
                size_value: item.size_value
            }))

            const quantityBox = document.querySelector('.quantity');

            const price = document.querySelector('.price p:first-child');
            const priceReduced = document.querySelector('.price .price-reduced');

            const productSize = document.querySelector('.product-size');

            sizeValueArray.forEach((item, index) => {

                const sizeButton = document.createElement('p');
                sizeButton.classList.add('button-size');
                sizeButton.textContent = item.size_value;

                if (index === 0) {
                    sizeButton.classList.add('selected');
                    if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                        price.textContent = `$${item.product_price_reduced}`;
                        priceReduced.textContent = `$${item.product_price}`;
                    } else {
                        price.textContent = `$${item.product_price}`;
                    }
                }

                sizeButton.addEventListener('click', () => {

                    price.style.opacity = 0;
                    priceReduced.style.opacity = 0;
                    setTimeout(() => {
                        if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                            price.textContent = `$${item.product_price_reduced}`;
                            priceReduced.textContent = `$${item.product_price}`;
                        } else {
                            price.textContent = `$${item.product_price}`;
                            priceReduced.textContent = ``;
                        }
                        price.style.opacity = 1;
                        priceReduced.style.opacity = 1;
                    }, 400)


                })
                productSize.appendChild(sizeButton);

            })

            const description = document.querySelector('.description-row .description');
            description.innerHTML = data[0].description;

            const details = document.querySelector('.description-row .details');
            details.innerHTML = data[0].details;

            const imagePath = data[1].map(item => item.image_url);

            let isDone = true;

            imagePath.forEach((item, index) => {

                const smallImageWrapper = document.querySelector('.small-image');
                const imageWrapper = document.querySelector('.image-wrapper');
                const imageContainer = document.querySelector('.big-image');

                const products = document.querySelector('.products');

                const productCountElement = document.createElement('span');
                if (index === 0) {
                    productCountElement.classList.add('product-main');
                    productCountElement.style.backgroundColor = 'var(--accent-color)';
                } else
                    productCountElement.style.backgroundColor = 'var(--primary-shade)';


                const productCount = document.querySelector('.products-count');

                productCount.appendChild(productCountElement);

                if (index === 0) {
                    const mainImg = document.createElement('img');
                    mainImg.classList.add('image-main');
                    mainImg.src = '../' + item;
                    imageContainer.appendChild(mainImg);
                    imageWrapper.appendChild(imageContainer);

                    const product = document.createElement('div');
                    product.classList.add('product', 'product-main');

                    const phoneMainImg = document.createElement('img');
                    phoneMainImg.src = '../' + item;
                    product.appendChild(phoneMainImg);
                    products.appendChild(product);


                } else {

                    const img = document.createElement('img');
                    img.src = '../' + item;
                    smallImageWrapper.appendChild(img);

                    const product = document.createElement('div');
                    product.classList.add('product');


                    img.addEventListener('click', () => {

                        if (isDone) {

                            isDone = false;

                            const mainPic = document.querySelector('.image-main');

                            let tempsrc = mainPic.src;

                            mainPic.style.opacity = 0;
                            img.style.opacity = 0;

                            setTimeout(() => {
                                mainPic.src = img.src;
                                img.src = tempsrc;

                                mainPic.style.opacity = 1;
                                img.style.opacity = 1;

                                isDone = true;
                            }, 400)

                        }
                    })

                    const phoneImg = document.createElement('img');
                    phoneImg.src = '../' + item;
                    product.appendChild(phoneImg);
                    products.appendChild(product);

                }



            })


            const imageSize = document.querySelectorAll('.button-size');

            const mainImage = document.querySelector('.product-main');
            const productWrapper = document.querySelector('.products');

            productWrapper.style.height = mainImage.clientHeight + "px";

            imageSize.forEach((item) => {
                item.addEventListener('click', () => {

                    imageSize.forEach((item) => {
                        if (item.classList.contains('selected')) {
                            item.classList.remove('selected');
                        }
                    })
                    item.classList.add('selected');
                })

            })



            const descRow = document.querySelectorAll('.description-row');
            const descButton = document.querySelectorAll('.description-question img');
            const descAnswer = document.querySelectorAll('.description-answer');
            const descQuestion = document.querySelectorAll(".description-question");

            let descRowHeight = 0;
            let descAnswerHeight = 0;

            let descInitialRowHeight = 0;


            //Delay for the description section
            setTimeout(function () {

                descRow.forEach((item, index) => {
                    console.log(index);

                    descInitialRowHeight = descQuestion[index].scrollHeight;

                    console.log("Initial Height: " + descInitialRowHeight);

                    descRow[index].style.height = descInitialRowHeight + "px";

                    let toggleHeight = true;

                    item.addEventListener('click', () => {
                        descRowHeight = descRow[index].clientHeight;
                        descAnswerHeight = descAnswer[index].clientHeight;

                        console.log("descRowHeight: " + descRowHeight);
                        console.log("descAnswerHeight: " + descAnswerHeight);

                        descButton[index].classList.toggle("description-button-rotate");

                        if (toggleHeight) {
                            console.log("Expanding...");
                            descRow[index].style.height = descAnswerHeight + descRowHeight + 20 + "px";

                            toggleHeight = false;
                        } else {
                            console.log("Collapsing...");
                            descRow[index].style.height = descInitialRowHeight + "px";
                            toggleHeight = true;
                        }
                    });
                });

            }, 500);



            const products = document.querySelector('.products');
            const product = document.querySelectorAll('.product');
            const productCount = document.querySelectorAll('.products-count span');

            productCount[0].style.backgroundColor = "var(--accent-color)";

            var currentProduct = 0;
            var transformPosition = -200;
            var transformPositionPhone = -130;
            var lastScrollLeft = 0;
            var isSliding = false;

            //Carousel for Mobile Device

            if (window.innerWidth < 480) {

                console.log(currentProduct);

                const slider = document.querySelector('.products'),
                    slides = Array.from(document.querySelectorAll('.product'))

                // set up our state
                let isDragging = false,
                    startPos = 0,
                    currentTranslate = 0,
                    prevTranslate = 0,
                    animationID,
                    currentIndex = 0,
                    currentPosition = 0,
                    prevProduct = 0;
                let hasMoved = false;


                // add our event listeners
                slides.forEach((slide, index) => {
                    const slideImage = slide.querySelector('img')
                    // disable default image drag
                    slideImage.addEventListener('touchstart', (e) => e.preventDefault())
                    // pointer events
                    slide.addEventListener('touchstart', pointerDown(index))
                    slide.addEventListener('touchend', pointerUp)
                    slide.addEventListener('touchmove', pointerMove)
                })

                // make responsive to viewport changes
                window.addEventListener('resize', setPositionByIndex)
                window.addEventListener('resize', setSize)

                // prevent menu popup on long press
                window.oncontextmenu = function (event) {
                    event.preventDefault()
                    event.stopPropagation()
                    return false
                }

                // use a HOF so we have index in a closure
                function pointerDown(index) {
                    return function (event) {
                        event.preventDefault()
                        currentIndex = index
                        startPos = event.touches[0].clientX
                        isDragging = true
                        animationID = requestAnimationFrame(animation)
                        hasMoved = false;
                    }
                }

                function pointerMove(event) {
                    event.preventDefault();
                    if (isDragging) {
                        currentPosition = event.touches[0].clientX
                        currentTranslate = prevTranslate + currentPosition - startPos

                    }
                }

                function pointerUp() {
                    cancelAnimationFrame(animationID)
                    isDragging = false
                    const movedBy = currentTranslate - prevTranslate

                    // if moved enough negative then snap to next slide if there is one
                    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1

                    // if moved enough positive then snap to previous slide if there is one
                    if (movedBy > 100 && currentIndex > 0) currentIndex -= 1
                    setPositionByIndex()

                    isSliding = false;

                }

                function animation() {
                    setSliderPosition()
                    if (isDragging) requestAnimationFrame(animation)
                }

                function setSize() {
                    productWrapper.style.height = mainImage.clientHeight + "px";
                }

                function setPositionByIndex() {

                    currentTranslate = currentIndex * -window.innerWidth
                    if (currentIndex > slides.length - 1)
                        return;

                    if (Math.abs(prevTranslate - currentTranslate) === Math.abs(window.innerWidth)) {
                        hasMoved = true;
                        setElementAtributes();
                    }
                    prevTranslate = currentTranslate

                    setSliderPosition()
                }

                function setSliderPosition() {
                    slider.style.transform = `translateX(${currentTranslate}px)`

                }

                function setElementAtributes() {

                    if (hasMoved) {
                        hasMoved = false;

                        if (!isSliding) {
                            isSliding = true;

                            if (currentPosition - startPos > 0 && currentProduct > 0) {

                                prevProduct = currentProduct;
                                currentProduct--;

                                slides[prevProduct].classList.remove('product-main');
                                productCount[prevProduct].style.backgroundColor = "var(--gray-color)";
                                slides[currentProduct].classList.add('product-main');
                                productCount[currentProduct].style.backgroundColor = "var(--accent-color)";


                            } else if ((currentPosition - startPos) < 0 && currentProduct < slides.length - 1) {
                                prevProduct = currentProduct;
                                currentProduct++;

                                slides[prevProduct].classList.remove('product-main');
                                productCount[prevProduct].style.backgroundColor = "var(--gray-color)";
                                slides[currentProduct].classList.add('product-main');
                                productCount[currentProduct].style.backgroundColor = "var(--accent-color)";
                            }
                        }
                    }

                }

            }

            const addToCart = document.querySelector('.description-wrapper .button-wrapper .button');

            addToCart.addEventListener('click', () => {

                const productId = data[0].product_id;
                const productName = data[0].product_name;
                const quantity = quantityBox.value;
                const productSize = document.querySelector('.product-size .selected').textContent;

                console.log(productId, productName, quantity, productSize);

                const formData = new FormData();

                formData.append('id', productId);
                formData.append('name', productName);
                formData.append('quantity', quantity);
                formData.append('size', productSize);

                fetch('/add-to-cart', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => {
                        const status = document.querySelector('.add-to-cart-status');

                        status.style.display = "block";
                        status.style.opacity = 1;

                        if (response.ok) {

                            response.json().then((data) => {
                                console.log("Success")
                                status.textContent = data.message;
                                status.classList.add('in-stock');
                                status.classList.remove('out-of-stock');
                            })

                            setTimeout(() => {
                                status.style.opacity = 0;
                                setTimeout(() => {
                                    status.style.display = "none";
                                }, 400)
                            }, 1000)

                        } else {
                            response.json().then((data) => {
                                console.log("Success")
                                status.textContent = data.message;
                                status.classList.add('out-of-stock');
                                status.classList.remove('in-stock');
                            })

                            setTimeout(() => {
                                status.style.opacity = 0;
                                setTimeout(() => {
                                    status.style.display = "none";
                                }, 400)
                            }, 1000)
                        }
                    })
                    .catch(err => console.log(err))


            })


        })

})