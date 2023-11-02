document.addEventListener('DOMContentLoaded', () => {


    const imageSize = document.querySelectorAll('.button-size');

    imageSize.forEach((item) => {
        item.addEventListener('click', () => {

            imageSize.forEach((item) => {
                if(item.classList.contains('selected')){
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