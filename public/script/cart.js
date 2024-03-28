
import { loadStripe } from "https://cdn.skypack.dev/@stripe/stripe-js";

document.addEventListener('DOMContentLoaded', () => {

    fetch('/getCart')
        .then(response => response.json())
        .then((data) => {
            console.log(data);

            if (data.length == 0) {
                var cartEmpty = document.createElement("div");
                cartEmpty.classList.add("empty-cart");

                const header = document.createElement('h2');
                header.textContent = "Looks like your cart is empty";

                const galleryButton = document.createElement('a');
                galleryButton.classList.add('button');
                galleryButton.textContent = "Go to gallery";
                galleryButton.href = '/gallery';

                const cartWrapper = document.querySelector('.cart-wrapper');

                cartEmpty.appendChild(header);
                cartEmpty.appendChild(galleryButton);
                cartWrapper.appendChild(cartEmpty);

            } else {

                const productData = data.map(item => ({
                    id: item.product_id,
                    product_name: item.product_name,
                    quantity: item.quantity,
                    size_value: item.size_value
                }));

                fetch('/getCartData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                })
                    .then(response => response.json())
                    .then((data) => {

                        console.log("test", data);

                        let temp = 0;

                        data.forEach(item => {

                            var cartItem = document.createElement("div");
                            cartItem.classList.add("cart-item");
                            var cartItemPhone = document.createElement("div");
                            cartItemPhone.classList.add("cart-item-phone");

                            // Create the info wrapper div
                            var infoWrapper = document.createElement("div");
                            infoWrapper.classList.add("info-wrapper");
                            var infoWrapperPhone = document.createElement("div");
                            infoWrapperPhone.classList.add("info-wrapper");

                            // Create the image wrapper div
                            var imageWrapper = document.createElement("div");
                            imageWrapper.classList.add("image-wrapper");
                            var imageWrapperPhone = document.createElement("div");
                            imageWrapperPhone.classList.add("image-wrapper");

                            // Create the image element
                            var productImage = document.createElement("img");
                            productImage.classList.add("product-image");
                            productImage.src = item.image_url;
                            var productImagePhone = document.createElement("img");
                            productImagePhone.classList.add("product-image");
                            productImagePhone.src = item.image_url;

                            // Append the image to the image wrapper
                            imageWrapper.appendChild(productImage);
                            imageWrapperPhone.appendChild(productImagePhone);

                            // Create the description wrapper div
                            var descWrapper = document.createElement("div");
                            descWrapper.classList.add("desc-wrapper");
                            var descWrapperPhone = document.createElement("div");
                            descWrapperPhone.classList.add("desc-wrapper");

                            // Create the product name paragraph
                            var productName = document.createElement("p");
                            productName.classList.add("product-name", "subheader");
                            productName.textContent = item.product_name;
                            var productNamePhone = document.createElement("p");
                            productNamePhone.classList.add("product-name", "subheader");
                            productNamePhone.textContent = item.product_name;

                            // Create the product price paragraph
                            var productPrice = document.createElement("p");
                            productPrice.classList.add("product-price");

                            var productPricePhone = document.createElement("p");
                            productPricePhone.classList.add("product-price");

                            // Create the product reduced price paragraph
                            var productReducedPrice = document.createElement("p");
                            productReducedPrice.classList.add("product-price-reduced");

                            var productReducedPricePhone = document.createElement("p");
                            productReducedPricePhone.classList.add("product-price-reduced");

                            if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                                productPrice.textContent = `$${item.product_price_reduced}`;
                                productReducedPrice.textContent = `$${item.product_price}`;

                                const calculation = item.product_price_reduced * item.quantity;
                                const calculationReduced = item.product_price * item.quantity;

                                productPricePhone.textContent = `$${calculation.toFixed(2)}`;
                                productReducedPricePhone.textContent = `$${calculationReduced.toFixed(2)}`;
                            } else {
                                productPrice.textContent = `$${item.product_price}`;
                                productPricePhone.textContent = `$${item.product_price}`;

                                const calculation = item.product_price * item.quantity;

                                productPricePhone.textContent = `$${calculation.toFixed(2)}`;
                            }

                            // Create the product size paragraph
                            var productSize = document.createElement("p");
                            productSize.classList.add("product-size");
                            productSize.textContent = item.size_value;

                            var productSizePhone = document.createElement("p");
                            productSizePhone.classList.add("product-size");
                            productSizePhone.textContent = item.size_value;

                            // Append the paragraphs to the description wrapper

                            const priceWrapper = document.createElement('div');
                            priceWrapper.classList.add('price-wrapper');
                            const priceWrapperPhone = document.createElement('div');
                            priceWrapperPhone.classList.add('price-wrapper');

                            var removeWrapperPhone = document.createElement("div");
                            removeWrapperPhone.classList.add("row");

                            var removeButtonPhone = document.createElement("p");
                            removeButtonPhone.classList.add("remove-button");
                            removeButtonPhone.textContent = "Remove";

                            var quantityPhone = document.createElement("input");
                            quantityPhone.setAttribute('type', 'number');
                            quantityPhone.setAttribute('min', '1');
                            quantityPhone.setAttribute('max', '10');
                            quantityPhone.classList.add("quantity");
                            quantityPhone.value = item.quantity;

                            // Append the quantity paragraph to the quantity wrapper
                            removeWrapperPhone.appendChild(quantityPhone);
                            removeWrapperPhone.appendChild(removeButtonPhone);

                            descWrapper.appendChild(productName);
                            priceWrapper.appendChild(productPrice);
                            priceWrapper.appendChild(productReducedPrice);
                            descWrapper.appendChild(priceWrapper);
                            descWrapper.appendChild(productSize);

                            descWrapperPhone.appendChild(productNamePhone);
                            priceWrapperPhone.appendChild(productPricePhone);
                            priceWrapperPhone.appendChild(productReducedPricePhone);
                            descWrapperPhone.appendChild(priceWrapperPhone);
                            descWrapperPhone.appendChild(productSizePhone);
                            descWrapperPhone.appendChild(removeWrapperPhone);

                            // Append the image wrapper and description wrapper to the info wrapper
                            infoWrapper.appendChild(imageWrapper);
                            infoWrapper.appendChild(descWrapper);

                            infoWrapperPhone.appendChild(imageWrapperPhone);
                            infoWrapperPhone.appendChild(descWrapperPhone);

                            // Create the quantity wrapper div
                            var quantityWrapper = document.createElement("div");
                            quantityWrapper.classList.add("quantity-wrapper");

                            // Create the quantity paragraph
                            var quantity = document.createElement("input");
                            quantity.setAttribute('type', 'number');
                            quantity.setAttribute('min', '1');
                            quantity.setAttribute('max', '10');
                            quantity.classList.add("quantity");
                            quantity.value = item.quantity;

                            quantityWrapper.appendChild(quantity);

                            // Create the total wrapper div
                            var totalWrapper = document.createElement("div");
                            totalWrapper.classList.add("total-wrapper");

                            // Create the total paragraph
                            var total = document.createElement("p");
                            total.classList.add("total");
                            if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                                const calculation = item.product_price_reduced * item.quantity;
                                total.textContent = `$${calculation.toFixed(2)}`;
                            } else {
                                const calculation = item.product_price * item.quantity;
                                total.textContent = `$${calculation.toFixed(2)}`;
                            }

                            quantity.addEventListener('change', () => {
                                const newQuantity = quantity.value;

                                quantityPhone.value = newQuantity;

                                if (quantity.value > 10) {
                                    quantity.value = 10;
                                }

                                temp = 0;

                                if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                                    const calculation = item.product_price_reduced * newQuantity;
                                    total.textContent = `$${calculation.toFixed(2)}`;

                                    const calculationReduced = item.product_price * newQuantity;

                                    console.log(productPricePhone);

                                    total.textContent = `$${calculation.toFixed(2)}`;

                                    productPricePhone.textContent = `$${calculation.toFixed(2)}`;
                                    productReducedPricePhone.textContent = `$${calculationReduced.toFixed(2)}`;

                                    totalPrice();

                                } else {
                                    const calculation = item.product_price * newQuantity;
                                    total.textContent = `$${calculation.toFixed(2)}`;

                                    productPricePhone.textContent = `$${calculation.toFixed(2)}`;

                                    totalPrice();
                                }

                            })

                            quantityPhone.addEventListener('change', () => {
                                console.log("TEST");
                                const newQuantity = quantityPhone.value;

                                quantity.value = newQuantity;

                                if (quantityPhone.value > 10) {
                                    quantityPhone.value = 10;
                                }

                                temp = 0;

                                if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                                    const calculation = item.product_price_reduced * newQuantity;
                                    const calculationReduced = item.product_price * newQuantity;

                                    console.log(productPricePhone);

                                    total.textContent = `$${calculation.toFixed(2)}`;

                                    productPricePhone.textContent = `$${calculation.toFixed(2)}`;
                                    productReducedPricePhone.textContent = `$${calculationReduced.toFixed(2)}`;

                                    totalPrice();

                                } else {
                                    const calculation = item.product_price * newQuantity;
                                    productPricePhone.textContent = `$${calculation.toFixed(2)}`;

                                    total.textContent = `$${calculation.toFixed(2)}`;

                                    console.log(productPricePhone, calculation);

                                    totalPrice();
                                }

                            })
                            // Append the total paragraph to the total wrapper
                            totalWrapper.appendChild(total);

                            // Create the remove wrapper div
                            var removeWrapper = document.createElement("div");
                            removeWrapper.classList.add("remove-wrapper");

                            // Create the remove button paragraph
                            var removeButton = document.createElement("p");
                            removeButton.classList.add("remove-button");
                            removeButton.textContent = "Remove";

                            var removeButtonSpan = document.createElement("span");

                            removeButton.appendChild(removeButtonSpan);

                            removeButton.addEventListener('click', () => {
                                removeFromCart(item, removeButton)
                            });
                            removeButtonPhone.addEventListener('click', () => {
                                removeFromCart(item, removeButtonPhone)
                            });

                            // Append the remove button paragraph to the remove wrapper
                            removeWrapper.appendChild(removeButton);

                            // Append all wrappers to the cart item div
                            cartItem.appendChild(infoWrapper);
                            cartItem.appendChild(quantityWrapper);
                            cartItem.appendChild(totalWrapper);
                            cartItem.appendChild(removeWrapper);

                            cartItemPhone.appendChild(infoWrapperPhone);

                            // Append the cart item to the body or any other desired parent element
                            const cartItemWrapper = document.querySelector('.cart-wrapper');
                            cartItemWrapper.appendChild(cartItem);
                            cartItemWrapper.appendChild(cartItemPhone);

                        })

                        totalPrice();

                        const applyCouponButton = document.querySelector('.coupon-wrapper .button');

                        applyCouponButton.addEventListener('click', () => {
                            const couponCode = document.querySelector('.coupon-wrapper .coupon').value;

                            const quantity = document.querySelectorAll('.quantity-wrapper input');

                            let quantityAmount = 0;

                            quantity.forEach(item => {
                                quantityAmount += +item.value;
                            })

                            console.log(quantityAmount);
                            console.log(couponCode);

                            const itemCount = document.querySelectorAll('.cart-item');

                            console.log(itemCount.length);

                            let totalCartPrice = 0;

                            const productName = []

                            data.forEach((item, index) => {

                                productName.push(item.product_name);

                                if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                                    totalCartPrice += (item.product_price_reduced * quantity[index].value)
                                } else {
                                    totalCartPrice += (item.product_price * quantity[index].value)
                                }
                            })

                            console.log(totalCartPrice);
                            console.log(productName);

                            const formData = new FormData();

                            formData.append('code', couponCode);
                            formData.append('quantity', quantityAmount);
                            formData.append('productCount', itemCount.length);
                            for (let i = 0; i < productName.length; i++) {
                                formData.append('name', productName[i]);
                            }
                            formData.append('total', totalCartPrice);

                            fetch(`/applyCoupon`, {
                                method: 'POST',
                                body: formData
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data)

                                    if (data === 'Invalid coupon code!') {
                                        const coupon = document.querySelector('.coupon-wrapper input');
                                        coupon.addEventListener('click', () => {
                                            coupon.removeAttribute("style");
                                            coupon.classList.remove('placeholder');
                                        })
                                        coupon.value = "";
                                        coupon.classList.add('placeholder');
                                        coupon.setAttribute("placeholder", `${data}`);
                                        coupon.style.borderColor = "var(--red-color)";

                                    } else {

                                        const subtotal = document.querySelector('.subtotal-price');
                                        const total = document.querySelector('.total-price');

                                        subtotal.textContent = `$${data.toFixed(2)}`;
                                        total.textContent = `$${data.toFixed(2)}`;

                                    }

                                })
                                .catch(err => console.log(err))
                        })

                        const checkoutButton = document.querySelector('.checkout-box2 .button');

                        checkoutButton.addEventListener('click', () => {

                            let cartVisible = false;
                            let cartVisiblePhone = false;

                            const cartItems = document.querySelectorAll('.cart-item');
                            const cartItemsPhone = document.querySelectorAll('.cart-item-phone');

                            cartItems.forEach(item => {
                                if (isElementVisible(item)) {
                                    cartVisible = true;
                                } else {
                                    cartVisible = false;
                                }

                            })


                            cartItemsPhone.forEach(item => {
                                if (isElementVisible(item)) {
                                    cartVisiblePhone = true;
                                } else {
                                    cartVisiblePhone = false;
                                }

                                console.log(cartVisiblePhone)
                            })
                            if (cartVisible) {
                                const quantity = document.querySelectorAll('.cart-item .quantity-wrapper input');

                                console.log("cartVisible");

                                const quantityArray = [];
                                quantity.forEach(item => {
                                    quantityArray.push(item.value);
                                })
                                checkoutHandler(quantityArray, data);

                            } else if (cartVisiblePhone) {

                                const quantity = document.querySelectorAll('.cart-item-phone .row input');

                                const quantityArray = [];
                                quantity.forEach(item => {
                                    quantityArray.push(item.value);
                                })
                                checkoutHandler(quantityArray, data);

                            }

                        })

                    })
                    .catch(err => console.log(err))

            }

        })



    async function checkoutHandler(quantity, data) {
        console.log(quantity, data);

        const checkoutData = [];

        quantity.forEach((item, index) => {
            checkoutData.push({ product_id: data[index].product_id, product_name: data[index].product_name, quantity: item, size_value: data[index].size_value });
        })

        console.log(checkoutData);

        const stripe = await loadStripe("pk_test_51Oz0TyP1klN1xJaKPs3Ca1DKd2WE1c4u9GnPq7JpDBgdCWaOhR2rqOhfpY9fq2ntoeD3WCTKmh3s4JvHrEGXozPU00R7JTxQyJ");

        fetch('/proceed-to-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkoutData)
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data.id)


                const result = stripe.redirectToCheckout({
                    sessionId: data.id
                })

                if (result.error) {
                    console.log(results.error);
                }

            })


    }

    function isElementVisible(el) {

        if (!(el instanceof Element)) {
            console.error('Invalid element:', el);
            return false; // Return false if the argument is not an Element
        }

        const style = window.getComputedStyle(el);
        return (
            style.display !== 'none'
        );
    }

    function removeFromCart(item, removeButton) {
        const productToRemove = [{ id: item.product_id, product_name: item.product_name, size_value: item.size_value }];

        fetch('/remove-from-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productToRemove)
        })
            .then(response => {
                if (response.ok) {
                    console.log("success");
                    const row = removeButton.closest('.cart-item') || removeButton.closest('.cart-item-phone');
                    console.log(row);
                    row.style.opacity = 0;
                    setTimeout(() => {
                        row.remove();

                        window.location.reload();

                        totalPrice();

                        if (!document.querySelector('.cart-item')) {
                            var cartEmpty = document.createElement("div");
                            cartEmpty.classList.add("empty-cart");

                            const header = document.createElement('h2');
                            header.textContent = "Looks like your cart is empty";

                            const galleryButton = document.createElement('a');
                            galleryButton.classList.add('button');
                            galleryButton.textContent = "Go to gallery";
                            galleryButton.href = '/gallery';

                            const cartWrapper = document.querySelector('.cart-wrapper');

                            cartEmpty.appendChild(header);
                            cartEmpty.appendChild(galleryButton);
                            cartWrapper.appendChild(cartEmpty);
                        }
                    }, 400)
                }
            })
            .catch(err => console.log(err))
    }


    function totalPrice() {

        let temp = 0;

        const subtotal = document.querySelector('.subtotal-price');
        const totalPrice = document.querySelector('.total-price');

        const allTotal = document.querySelectorAll('.total-wrapper .total');

        allTotal.forEach(price => {

            const priceTotal = parseFloat(price.textContent.substring(1))

            temp += priceTotal;
        })

        subtotal.textContent = `$${temp.toFixed(2)}`;
        totalPrice.textContent = `$${temp.toFixed(2)}`;

    }
})