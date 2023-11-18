document.addEventListener('DOMContentLoaded', () => {

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            //console.log(entry)
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('faq-row')) {
                    return;
                } else {
                    entry.target.classList.add('scrollAnimate');
                }
            }
        })
    })

const faqObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                faqRow.forEach((item) => {
                    item.classList.add('scrollAnimate');
                }); 

            }, 500);

            setTimeout(() => {
                faqRow.forEach((item) => {
                    item.style.transitionDelay = '0s';
                })
            }, 600)
        }
    });
});


    const hiddenElements = document.querySelectorAll('.hidden');
    const hiddenElementsMoveUp = document.querySelectorAll('.hiddenBot');
    const hiddenElementsMoveRight = document.querySelectorAll('.hiddenLeft');

    const faqWrapper = document.querySelector('.faq-wrapper');
    const faqRow = document.querySelectorAll('.faq-row');

    hiddenElements.forEach((el) => observer.observe(el));
    hiddenElementsMoveUp.forEach((el) => observer.observe(el));
    hiddenElementsMoveRight.forEach((el) => observer.observe(el));
    faqObserver.observe(faqWrapper);
})