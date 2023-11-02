document.addEventListener('DOMContentLoaded', () => {

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if(entry.isIntersecting){
            if(entry.target.classList.contains('faq-row')){
                setTimeout(function () {
                    entry.target.classList.add('scrollAnimate');
                }, 500)
            }else {
                entry.target.classList.add('scrollAnimate');
            }
        }
    })
})


const hiddenElements = document.querySelectorAll('.hidden');
const hiddenElementsMoveUp = document.querySelectorAll('.hiddenBot');
const hiddenElementsMoveRight = document.querySelectorAll('.hiddenLeft');


hiddenElements.forEach((el) => observer.observe(el));
hiddenElementsMoveUp.forEach((el) => observer.observe(el));
hiddenElementsMoveRight.forEach((el) => observer.observe(el));

})