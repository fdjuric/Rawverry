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

                        data.forEach(item => {

                            var cartItem = document.createElement("div");
                            cartItem.classList.add("cart-item");

                            // Create the info wrapper div
                            var infoWrapper = document.createElement("div");
                            infoWrapper.classList.add("info-wrapper");

                            // Create the image wrapper div
                            var imageWrapper = document.createElement("div");
                            imageWrapper.classList.add("image-wrapper");

                            // Create the image element
                            var productImage = document.createElement("img");
                            productImage.classList.add("product-image");
                            productImage.src = item.image_url;

                            // Append the image to the image wrapper
                            imageWrapper.appendChild(productImage);

                            // Create the description wrapper div
                            var descWrapper = document.createElement("div");
                            descWrapper.classList.add("desc-wrapper");

                            // Create the product name paragraph
                            var productName = document.createElement("p");
                            productName.classList.add("product-name", "subheader");
                            productName.textContent = item.product_name;

                            // Create the product price paragraph
                            var productPrice = document.createElement("p");
                            productPrice.classList.add("product-price");

                            // Create the product reduced price paragraph
                            var productReducedPrice = document.createElement("p");
                            productReducedPrice.classList.add("product-price-reduced");

                            if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                                productPrice.textContent = `$${item.product_price_reduced}`;
                                productReducedPrice.textContent = `$${item.product_price}`;
                            } else {
                                productPrice.textContent = `$${item.product_price}`;
                            }

                            // Create the product size paragraph
                            var productSize = document.createElement("p");
                            productSize.classList.add("product-size");
                            productSize.textContent = item.size_value;

                            // Append the paragraphs to the description wrapper

                            const priceWrapper = document.createElement('div');
                            priceWrapper.classList.add('price-wrapper');

                            descWrapper.appendChild(productName);
                            priceWrapper.appendChild(productPrice);
                            priceWrapper.appendChild(productReducedPrice);
                            descWrapper.appendChild(priceWrapper);
                            descWrapper.appendChild(productSize);

                            // Append the image wrapper and description wrapper to the info wrapper
                            infoWrapper.appendChild(imageWrapper);
                            infoWrapper.appendChild(descWrapper);

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

                            // Append the quantity paragraph to the quantity wrapper
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

                                if (item.product_price_reduced !== null && item.product_price_reduced !== '0.00') {
                                    const calculation = item.product_price_reduced * newQuantity;
                                    total.textContent = `$${calculation.toFixed(2)}`;
                                } else {
                                    const calculation = item.product_price * newQuantity;
                                    total.textContent = `$${calculation.toFixed(2)}`;
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
                                            const row = removeButton.closest('.cart-item');
                                            console.log(row);
                                            row.style.opacity = 0;
                                            setTimeout(() => {
                                                row.remove();
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
                            })

                            // Append the remove button paragraph to the remove wrapper
                            removeWrapper.appendChild(removeButton);

                            // Append all wrappers to the cart item div
                            cartItem.appendChild(infoWrapper);
                            cartItem.appendChild(quantityWrapper);
                            cartItem.appendChild(totalWrapper);
                            cartItem.appendChild(removeWrapper);

                            // Append the cart item to the body or any other desired parent element
                            const cartItemWrapper = document.querySelector('.cart-wrapper');
                            cartItemWrapper.appendChild(cartItem);

                        })


                    })
                    .catch(err => console.log(err))

            }

        })
})