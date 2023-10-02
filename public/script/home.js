document.addEventListener('DOMContentLoaded', function () { 

const products = document.querySelector('.products');
const product = document.querySelectorAll('.product');
const productCount = document.querySelectorAll('.products-count span');

const buttonBack = document.querySelector('.button-back');
const buttonNext = document.querySelector('.button-next');

productCount[0].style.backgroundColor="var(--accent-color)";

var currentProduct = 0;
var transformPosition = -200;


buttonBack.addEventListener('click', function() {

    if(currentProduct != 0) {

    product[currentProduct].classList.remove('product-main');
    productCount[currentProduct].style.backgroundColor="var(--primary-color)";
    currentProduct--;
    product[currentProduct].classList.add('product-main');
    productCount[currentProduct].style.backgroundColor="var(--accent-color)";
    transformPosition += 400;
    console.log(transformPosition);
    product.forEach( (item) => {

        item.style.transform = "translate(" + transformPosition  + "px)";
    })
    }else {
        return;
    }

})

buttonNext.addEventListener('click', function() {

    if(currentProduct < product.length-1) {
    product[currentProduct].classList.remove('product-main');
    productCount[currentProduct].style.backgroundColor="var(--primary-color)";
    currentProduct++;
    product[currentProduct].classList.add('product-main');
    productCount[currentProduct].style.backgroundColor="var(--accent-color)";
    transformPosition -= 400;
    console.log(transformPosition);
    product.forEach( (item) => {

        item.style.transform = "translate(" + transformPosition  + "px)";
    })
    }else {
        return;
    }

})









});