document.addEventListener('DOMContentLoaded', function () {


    //Favourites Carousel

    fetch('/getFavourites')
        .then(response => response.json())
        .then((data) => {

            console.log(data);
            data.forEach((item, index) => {
                // Create the main div element with the specified classes
                const mainDiv = document.createElement('div');
                mainDiv.classList.add('product', 'hidden', 'scrollAnimate');

                // Create the image element and set its src attribute
                const img = document.createElement('img');
                img.src = item.image_url_1;

                img.addEventListener('mouseenter', () => {
                    if (item.image_url_2 !== null) {

                        img.style.opacity = 0.2; // Fade out the image

                        // Change the image source after the fade-out transition completes
                        setTimeout(function () {
                            img.src = item.image_url_2; // Change to the new image source
                        }, 400); // Adjust this value to match the transition duration

                        // Fade in the new image after a short delay
                        setTimeout(function () {
                            img.style.opacity = 1;
                        }, 400); // Adjust this value to match the delay + transition duration

                    }


                })


                img.addEventListener('mouseleave', () => {

                    if (img.src !== item.image_url_1) {
                        img.style.opacity = 0.2; // Fade out the image

                        // Change the image source after the fade-out transition completes
                        setTimeout(function () {
                            img.src = item.image_url_1; // Change to the new image source
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
                priceParagraph1.textContent = `From $${item.product_price}`;

                // Create the second price paragraph element with the specified class and text content
                const priceParagraph2 = document.createElement('p');
                priceParagraph2.classList.add('price-reduced', 'blk-shade');
                if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                    priceParagraph2.textContent = `$${item.product_price_reduced}`;
                }

                // Append the price paragraph elements to the price div element
                priceDiv.appendChild(priceParagraph1);
                priceDiv.appendChild(priceParagraph2);

                // Append the image, subheader, and price div elements to the main div element
                mainDiv.appendChild(img);
                mainDiv.appendChild(subheader);
                mainDiv.appendChild(priceDiv);

                mainDiv.addEventListener('click', () => {
                    fetch(`/getProduct/${item.product_id}`)
                        .then(console.log("Success"))
                        .catch(err => console.log(err))
                })

                // Append the main div element to the desired parent element in the document
                const parentElement = document.querySelector('.products'); // Replace 'parent-element-class' with the actual class of the parent element
                parentElement.appendChild(mainDiv);

                const productCountElement = document.createElement('span');
                if (index === 0) {
                    mainDiv.classList.add('product-main');
                    productCountElement.style.backgroundColor = 'var(--accent-color)';
                } else
                    productCountElement.style.backgroundColor = 'var(--primary-color)';

                const productCountParent = document.querySelector('.products-count');

                productCountParent.appendChild(productCountElement);




            })

            const products = document.querySelector('.products');
            const product = document.querySelectorAll('.product');
            const productCount = document.querySelectorAll('.products-count span');

            const buttonBack = document.querySelector('.button-back');
            const buttonNext = document.querySelector('.button-next');


            const mainImage = document.querySelector('.product-main');
            const productWrapper = document.querySelector('.products');

            productWrapper.style.height = mainImage.clientHeight + "px";

            productCount[0].style.backgroundColor = "var(--accent-color)";


            var currentProduct = 0;
            var transformPosition = -200;
            var transformPositionPhone = -130;
            var lastScrollLeft = 0;
            var isSliding = false;

            buttonBack.style.display = "none";

            buttonBack.addEventListener('click', function () {

                if (currentProduct != 0) {

                    product[currentProduct].classList.remove('product-main');
                    productCount[currentProduct].style.backgroundColor = "var(--primary-color)";
                    currentProduct--;
                    product[currentProduct].classList.add('product-main');
                    productCount[currentProduct].style.backgroundColor = "var(--accent-color)";
                    transformPosition += 400;
                    console.log(transformPosition);
                    product.forEach((item) => {

                        item.style.transform = "translate(" + transformPosition + "px)";
                    })
                    if (currentProduct === 0) {
                        buttonBack.style.display = "none";
                    } else {
                        buttonBack.style.display = "flex";
                        buttonNext.style.display = "flex";
                    }
                } else {
                    return;
                }

            })

            buttonNext.addEventListener('click', function () {

                if (currentProduct < product.length - 1) {
                    product[currentProduct].classList.remove('product-main');
                    productCount[currentProduct].style.backgroundColor = "var(--primary-color)";
                    currentProduct++;
                    product[currentProduct].classList.add('product-main');
                    productCount[currentProduct].style.backgroundColor = "var(--accent-color)";
                    transformPosition -= 400;
                    console.log(transformPosition);
                    product.forEach((item) => {

                        item.style.transform = "translate(" + transformPosition + "px)";
                    })
                    if (currentProduct === product.length - 1) {
                        buttonNext.style.display = "none";
                    } else {
                        buttonNext.style.display = "flex";
                        buttonBack.style.display = "flex";
                    }
                } else {
                    return;
                }

            })


            //Carousel for Mobile Device

            if (window.innerWidth < 480) {


                const heroImage = document.querySelector('.hero-picture');

                heroImage.src = "images/hero-phone.png";

                const slider = document.querySelector('.products'),
                    slides = Array.from(document.querySelectorAll('.product'))

                // set up our state
                let isDragging = false,
                    startPos = 0,
                    currentTranslate = 0,
                    prevTranslate = 0,
                    animationID,
                    currentIndex = 0,
                    currentPosition = 0;
                let hasMoved = false;
                prevProduct = 0;

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
                                productCount[prevProduct].style.backgroundColor = "var(--primary-color)";
                                slides[currentProduct].classList.add('product-main');
                                productCount[currentProduct].style.backgroundColor = "var(--accent-color)";


                            } else if ((currentPosition - startPos) < 0 && currentProduct < slides.length - 1) {
                                prevProduct = currentProduct;
                                currentProduct++;

                                slides[prevProduct].classList.remove('product-main');
                                productCount[prevProduct].style.backgroundColor = "var(--primary-color)";
                                slides[currentProduct].classList.add('product-main');
                                productCount[currentProduct].style.backgroundColor = "var(--accent-color)";
                            }
                        }
                    }

                }

            }
        })




    //FAQ section


    const faqRow = document.querySelectorAll('.faq-row');
    const faqButton = document.querySelectorAll('.faq-question img');
    const faqAnswer = document.querySelectorAll('.faq-answer');
    const faqQuestion = document.querySelectorAll(".faq-question");

    let faqRowHeight = 0;
    let faqAnswerHeight = 0;

    let faqInitialRowHeight = 0;


    //Delay for the FAQ section
    setTimeout(function () {

        faqRow.forEach((item, index) => {

            faqInitialRowHeight = faqQuestion[index].scrollHeight;

            faqRow[index].style.height = faqInitialRowHeight + "px";

            let toggleHeight = true;

            item.addEventListener('click', () => {
                faqRowHeight = faqRow[index].clientHeight;
                faqAnswerHeight = faqAnswer[index].clientHeight;

                faqButton[index].classList.toggle("faq-button-rotate");

                if (toggleHeight) {
                    faqRow[index].style.height = faqAnswerHeight + faqRowHeight + 20 + "px";

                    toggleHeight = false;
                } else {
                    faqRow[index].style.height = faqInitialRowHeight + "px";
                    toggleHeight = true;
                }
            });
        });

    }, 500);




});