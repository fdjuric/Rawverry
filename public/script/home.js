document.addEventListener('DOMContentLoaded', function () {


    //Favourites Carousel

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

    buttonBack.style.display= "none";


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
            if(currentProduct === 0){
                buttonBack.style.display= "none";
            }else {
                buttonBack.style.display= "flex";
                buttonNext.style.display= "flex";
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
            if(currentProduct === product.length -1){
                buttonNext.style.display= "none";
            }else {
                buttonNext.style.display= "flex";
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