document.addEventListener('DOMContentLoaded', function () {

    let prevSection = 0;

    const navElement = document.querySelectorAll('nav div');
    const navSvg = document.querySelectorAll('nav div svg path');
    const navText = document.querySelectorAll('nav div p');

    const section = document.querySelectorAll('.section');

    navSvg[0].style.fill = "var(--accent-color)";
    navText[0].style.color = "var(--accent-color)";


    navElement.forEach((item, index) => {

        console.log(section[index]);

        if (index >= 1 && index < section.length) {
            section[index].style.display = "none";
        }

        item.addEventListener('click', () => {

            console.log(index);
            console.log(section[index]);
            console.log("prev index " + prevSection)



            section[prevSection].style.opacity = 0;

            setTimeout(() => {
                section[prevSection].style.display = "none";

                navSvg.forEach((item) => {
                    item.style.fill = "var(--secondary-color)";
                })
                navText.forEach((item) => {
                    item.style.color = "var(--secondary-color)";
                })
                navSvg[index].style.fill = "var(--accent-color)";
                navText[index].style.color = "var(--accent-color)";

                section[index].style.display = "flex";
                section[index].style.opacity = 1;

                prevSection = index;

                console.log("after index " + prevSection)

            }, 500)

        })
    })


    const ctx = document.querySelector('.sales-graph');

    const orderStatus = document.querySelector('.status-graph');

    //Chart.defaults.font.family = 'Mitr';
    Chart.defaults.font.size = 16;
    Chart.defaults.font.weight = '400';
    Chart.defaults.color = '#1A1A1A';
    Chart.defaults.plugins.legend.position = 'bottom';
    //Chart.defaults.options.clip = false;

    const legendMargin = {
        id: 'legendMargin',
        beforeInit(chart, legend, options) {
            const fitValue = chart.legend.fit;
            chart.legend.fit = function fit() {
                fitValue.bind(chart.legend)();
                return this.height += 40;
            }
        }
    };

    // Sample data for the chart
    var chartDataMonth = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: 'Monthly Values',
            borderColor: '#67A329',
            data: [500, 800, 600, 900, 700, 1100, 1000, 1100, 950, 800, 1100, 900],
            fill: false
        }],
        options: {
            layout: {
                padding: {
                    left: 20,
                    right: 20
                }
            },
            plugins: {
                annotation: {
                    clip: false,
                },
            }
        },
        plugins: [legendMargin]
    };

    var chartDataYear = {
        labels: ["2020", "2021", "2022", "2023"],
        datasets: [{
            label: 'Yearly Values',
            borderColor: '#67A329',
            data: [600, 900, 700, 1100],
            fill: false
        }]
    };

    // Chart configuration
    var chartConfig = {
        type: 'line',
        data: chartDataMonth,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1200
                }
            },
            ticks: {
                stepSize: 300
            }
        }
    };


    new Chart(ctx, chartConfig);

    var chartDataStatus = {
        labels: ["Sales", "Pending", "Returns"],
        datasets: [{
            label: ' Amount ',
            data: [300, 50, 100],
            backgroundColor: [
                '#67A329',
                '#E8995B',
                '#a32929'
            ],
            hoverOffset: 4
        }]
    };

    var statusChartConfig = {
        type: 'doughnut',
        data: chartDataStatus,
        options: {
            responsive: false,
            maintainAspectRatio: true,
            aspectRatio: 1,
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 20
                    }
                },

            }
        },
        plugins: [legendMargin]
    };

    new Chart(orderStatus, statusChartConfig);

    orderStatus.style.width = "100%";
    orderStatus.style.height = "100%";

    const svgIcon = document.querySelector('.acc-default');
    const imgElement = document.querySelector('.acc-pic');

    if (!imgElement.src || imgElement.src === window.location.href || imgElement.src === 'about:blank') {
        svgIcon.style.display = 'block';
        imgElement.style.display = 'none';
    } else {
        svgIcon.style.display = 'none';
        imgElement.style.display = 'block';
    }


    const profilePic = document.querySelector('.account-picture');

    const changePicWindow = document.querySelector('.change-profile-pic');

    const uploadButton = document.querySelector('.change-profile-pic form button');

    profilePic.addEventListener('click', () => {

        changePicWindow.style.display = "flex";

        setTimeout(() => {
            changePicWindow.style.opacity = 1;
        }, 100)


    })

    uploadButton.addEventListener('click', uploadFile);

    function uploadFile() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        console.log(file.name)

        const allowedTypes = ['.jpeg', '.jpg', '.png', '.webp', '.gif'];

        const isValidFileType = allowedTypes.some(ext => file.name.endsWith(ext));

        if (isValidFileType) {

            const form = new FormData();

            form.append('file', file);

            fetch('/change-profile-pic', {
                method: 'POST',
                body: form
            })
                .then(response => {
                    console.log("File uploaded!")
                })
                .catch(error => {
                    console.log(error);
                })
        } else {
            alert('File is not an image type!');
        }

        setTimeout(() => {
            location.reload();
        }, 400);

    }

    var toolbarOptions = [
        ['bold', 'underline'],

        [{ 'header': 1 }, ['header: 2']],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'header': [1, 2, false] }],
        [{ 'align': [] }],
        ['link', 'image']
    ];


    //Blog

    const createBlog = document.querySelector('.add-blog');
    const blogCreateWrapper = document.querySelector('.blog-creation');
    const blogEditWrapper = document.querySelector('.blog-edit');
    const blogTitle = document.querySelector('.blog-title');


    const createButton = document.querySelector('.blog-creation .creation-button');

    createButton.addEventListener('click', handleBlogCreation);

    createBlog.addEventListener('click', () => {

        blogCreateWrapper.style.display = "flex";

        setTimeout(() => {
            blogCreateWrapper.style.opacity = 1;
        }, 100);
    })

    //Blog content table creation
    function createTable(data) {
        const tbody = document.createElement('tbody');
        const table = document.querySelector('.blog .products-table table');

        data.forEach(blog => {
            const row = document.createElement('tr');

            // Create and populate table data (td) for each field
            const idCell = createTableCell(blog.id, 'blog-id');
            const titleCell = createTableCell(blog.title, 'blog-title');
            const contentCell = createTableCell(blog.content, 'blog-content');
            const authorCell = createTableCell(blog.author, 'blog-author');
            const createDateCell = createTableCell(blog.created_at, 'blog-created');
            const changedDateCell = createTableCell(blog.updated_at, 'blog-updated');

            // Append table data to the table row
            row.appendChild(idCell);
            row.appendChild(titleCell);
            row.appendChild(contentCell);
            row.appendChild(authorCell);
            row.appendChild(createDateCell);
            row.appendChild(changedDateCell);

            // Create and append the SVG icons
            const settingsEditIcons = createSettingsEditIcons(); // Function to create SVG icons

            const settingsCell = document.createElement('td');
            settingsCell.appendChild(settingsEditIcons);
            row.appendChild(settingsCell);

            // Append the row to the table body
            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        //Adding event listeners to settings buttons

        const editButton = document.querySelector('.edit-button');

        const blogSettings = document.querySelectorAll('.blog .edit');

        blogSettings.forEach((parent, index) => {
            const editBlog = parent.firstElementChild;
            //console.log(editBlog);

            editBlog.addEventListener('click', () => {

                const blogId = document.querySelectorAll('.blog-id');
                const blogFormId = document.querySelector('.blog-form-id');
                const blogTitle = document.querySelectorAll('.blog-title');
                console.log(blogTitle[index].textContent);

                const blogContent = document.querySelectorAll('.blog-content');
                console.log(blogContent[index].textContent);

                blogEditWrapper.style.display = "flex";
                blogEditWrapper.style.opacity = 1;

                const blogFormTitle = document.querySelector('.blog-edit .blog-form-title');

                console.log(blogFormTitle);

                const blogEditor = document.querySelector('.blog-edit .editor-container #editor2');

                console.log(blogEditor);

                blogFormId.textContent = blogId[index].textContent;
                blogFormTitle.value = blogTitle[index].textContent;
                //blogEditor.textContent = blogContent[index].textContent;

                // Convert HTML to Quill delta format
                const delta = editor2.clipboard.convert(blogContent[index].textContent);

                // Insert the delta into the Quill editor
                editor2.setContents(delta);

                //insertTextIntoQuill(blogContent[index].textContent);
            })
        })
        // const editBlog = blogSettings.querySelectorAll(':first-child');

        //console.log(editBlog);

        editButton.addEventListener('click', handleBlogEditing);
    }

    function createSettingsEditIcons() {
        const svgEdit = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgEdit.setAttribute("width", "24");
        svgEdit.setAttribute("height", "25");
        svgEdit.setAttribute("viewBox", "0 0 24 25");
        svgEdit.setAttribute("fill", "none");

        const pathEdit = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEdit.setAttribute("d", "M16.474 5.90801L18.592 8.02501M17.836 4.04301L12.109 9.77001C11.8131 10.0655 11.6113 10.442 11.529 10.852L11 13.5L13.648 12.97C14.058 12.888 14.434 12.687 14.73 12.391L20.457 6.66401C20.6291 6.49191 20.7656 6.2876 20.8588 6.06275C20.9519 5.83789 20.9998 5.59689 20.9998 5.35351C20.9998 5.11013 20.9519 4.86913 20.8588 4.64427C20.7656 4.41942 20.6291 4.21511 20.457 4.04301C20.2849 3.87091 20.0806 3.7344 19.8557 3.64126C19.6309 3.54812 19.3899 3.50018 19.1465 3.50018C18.9031 3.50018 18.6621 3.54812 18.4373 3.64126C18.2124 3.7344 18.0081 3.87091 17.836 4.04301Z");
        pathEdit.setAttribute("stroke", "#67A329");
        pathEdit.setAttribute("stroke-width", "2");
        pathEdit.setAttribute("stroke-linecap", "round");
        pathEdit.setAttribute("stroke-linejoin", "round");

        const pathEdit1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEdit1.setAttribute("d", "M19 15.5V18.5C19 19.0304 18.7893 19.5391 18.4142 19.9142C18.0391 20.2893 17.5304 20.5 17 20.5H6C5.46957 20.5 4.96086 20.2893 4.58579 19.9142C4.21071 19.5391 4 19.0304 4 18.5V7.5C4 6.96957 4.21071 6.46086 4.58579 6.08579C4.96086 5.71071 5.46957 5.5 6 5.5H9");
        pathEdit1.setAttribute("stroke", "#67A329");
        pathEdit1.setAttribute("stroke-width", "2");
        pathEdit1.setAttribute("stroke-linecap", "round");
        pathEdit1.setAttribute("stroke-linejoin", "round");

        svgEdit.appendChild(pathEdit);
        svgEdit.appendChild(pathEdit1);

        const svgCheck = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgCheck.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgCheck.setAttribute("width", "24");
        svgCheck.setAttribute("height", "25");
        svgCheck.setAttribute("viewBox", "0 0 24 25");
        svgCheck.setAttribute("fill", "none");

        const pathCheck = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathCheck.setAttribute("d", "M18 16.5H6C4.346 16.5 3 15.154 3 13.5C3 11.846 4.346 10.5 6 10.5H18C19.654 10.5 21 11.846 21 13.5C21 15.154 19.654 16.5 18 16.5ZM6 12.5C5.449 12.5 5 12.949 5 13.5C5 14.051 5.449 14.5 6 14.5H18C18.551 14.5 19 14.051 19 13.5C19 12.949 18.551 12.5 18 12.5H6Z");
        pathCheck.setAttribute("fill", "#67A329");

        svgCheck.appendChild(pathCheck);

        const pElement = document.createElement("p");
        pElement.classList.add("product-settings", "edit");
        pElement.appendChild(svgEdit);
        pElement.appendChild(svgCheck);

        return pElement;
    }


    function createTableCell(value, className) {
        const cell = document.createElement('td');

        const paragraph = document.createElement('p');
        if (value == null) {
            paragraph.textContent = 0;
        } else {
            paragraph.textContent = value;
        }
        paragraph.classList.add(className);

        cell.appendChild(paragraph);
        return cell;
    }


    var editor = new Quill('#editor', {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });

    var editor2 = new Quill('#editor2', {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });

    var Bold = Quill.import('formats/bold');

    class CustomBold extends Bold {
        static create(value) {
            const node = super.create(value);
            node.classList.add('subheader');
            return node;
        }
    }

    Quill.register({
        'formats/bold': CustomBold,
    }, true);



    const logoutButton = document.querySelector('.side nav div:last-child');
    console.log(logoutButton);

    logoutButton.addEventListener('click', () => {
        window.location.href = '/logout';
    })

    const date = document.querySelector('.date');


    const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const d = new Date();
    let month = monthArray[d.getMonth()];
    let dayWeek = dayArray[d.getDay()];
    let dayMonth = d.getDate();

    date.textContent = dayWeek + " " + d.getDate() + " " + month + " " + d.getFullYear();


    // Blog Text
    function getTextWithTags() {
        let editorContent = editor.root.innerHTML;
        return editorContent;
    }

    function getEditedText() {
        let editorContent = editor2.root.innerHTML;
        return editorContent;
    }

    const blogButton = document.querySelector('.blog-btn');
    console.log("BlogBTN " + blogButton);
    blogButton.addEventListener('click', () => {

        fetch('/panel/blog')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                createTable(data);
            })
    })

    //Blog Creation
    function handleBlogCreation(event) {
        const content = getTextWithTags();

        const blogPicture = document.getElementById("blogPicture");
        const picture = blogPicture.files[0];

        const blogFormTitle = document.querySelector('.blog-creation .blog-form-title');
        const title = blogFormTitle.value;

        const author = document.querySelector('.welcome-name');
        const authorName = author.textContent.trim();

        // console.log(picture.name);

        const allowedTypes = ['.jpeg', '.png', '.webp', '.gif'];

        const isValidFileType = allowedTypes.some(ext => picture.name.endsWith(ext));

        if (isValidFileType) {

            const formData = new FormData(); // Create a FormData object

            formData.append('title', title); // Append title
            formData.append('content', content); // Append content
            formData.append('author', authorName); // Append author
            formData.append('file', picture); // Append picture

            fetch('/panel/blog/createBlog', {
                method: 'POST',
                body: formData // Set the body of the request as FormData
            })
                .then(response => {
                    if (response.ok) {
                        alert('Blog created successfully!');
                    } else {
                        alert('Error creating Blog!');
                    }
                })

        } else {
            alert('The file is not a picture!');
        }


    }

    //Blog Editing
    function handleBlogEditing(event) {
        let contentWithTags = getEditedText();
        console.log(contentWithTags); // Output: All text with <p> and <h1> tags

        const blogIdElement = document.querySelector('.blog-form-id');
        const blogFormTitleElement = document.querySelector('.blog-edit .blog-form-title');
        const authorElement = document.querySelector('.welcome-name');

        const url = '/panel/blog/editBlog';

        const data = {
            id: blogIdElement.textContent.trim(),
            title: blogFormTitleElement.value.trim(),
            content: contentWithTags,
            author: authorElement.textContent.trim()
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    alert('Blog updated successfully');
                } else {
                    alert('Error updating Blog');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    //Products section


    var editorDesc = new Quill('#editorDescCreate', {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });

    var editorDetails = new Quill('#editorDetailsCreate', {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });

    var editorDescEdit = new Quill('#editorDescEdit', {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });

    var editorDetailsEdit = new Quill('#editorDetailsEdit', {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });



    const productsButton = document.querySelector('.products-btn');

    let isAdded = false;

    productsButton.addEventListener('click', () => {

        if (!isAdded) {
            fetch('/panel/products/getProducts')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.createElement('tbody');
                    const table = document.querySelector('.products .products-table table');
                    let temp;
                    data.forEach(product => {
                        const row = document.createElement('tr');


                        if (temp != product.product_id) {
                            // Create and populate table data (td) for each field
                            const idCell = createTableCell(product.product_id, 'product-id');
                            const titleCellWrapper = document.createElement('td');
                            const titleCellWrapperDiv = document.createElement('div');
                            const titlePic = document.createElement('img');
                            titlePic.src = product.image_url;
                            titlePic.style.width = "50px";
                            titlePic.style.height = "50px";
                            const titleCell = document.createElement('p');
                            titleCell.classList.add('product-name');
                            titleCell.textContent = product.product_name;
                            const priceCell = createTableCell(product.product_price, 'product-price');
                            const amountCell = createTableCell(product.product_amount_bought_total, 'product-amount');
                            const reducedCell = createTableCell(product.product_price_reduced, 'product-reduced');
                            const inStockCell = createTableCell(product.in_stock, 'product-in-stock');

                            // Append table data to the table row

                            titleCellWrapperDiv.appendChild(titlePic);
                            titleCellWrapperDiv.appendChild(titleCell);
                            titleCellWrapper.appendChild(titleCellWrapperDiv);
                            row.appendChild(idCell);
                            row.appendChild(titleCellWrapper);
                            row.appendChild(priceCell);
                            row.appendChild(amountCell);
                            row.appendChild(reducedCell);
                            row.appendChild(inStockCell);

                            // Create and append the SVG icons
                            const settingsEditIcons = createSettingsEditIcons(); // Function to create SVG icons
                            const settingsCell = document.createElement('td');
                            settingsCell.appendChild(settingsEditIcons);
                            row.appendChild(settingsCell);

                            // Append the row to the table body
                            tbody.appendChild(row);

                            temp = product.product_id;
                        } else return;
                    });

                    table.appendChild(tbody);
                })
            fetch('/panel/products')
                .then(response => response.json())
                .then(data => {
                    console.log(data.sizes);
                    console.log(data.categories);

                    console.log("HELLO");
                    const sizeWrapper = document.querySelectorAll('.product-size-wrapper');
                    sizeWrapper.forEach((wrapper) => {
                        data.sizes.forEach((item) => {
                            const input = document.createElement('input');
                            input.type = 'checkbox';
                            input.name = 'size';
                            input.value = item.size_value;
                            const label = document.createElement('label');
                            label.textContent = item.size_value;
                            label.setAttribute("for", "size");
                            const div = document.createElement('div');

                            div.appendChild(input);
                            div.appendChild(label);

                            wrapper.appendChild(div);
                        })
                    });

                    const categoryWrapper = document.querySelectorAll('.product-category-wrapper');
                    categoryWrapper.forEach((wrapper) => {
                        data.categories.forEach((item) => {
                            const input = document.createElement('input');
                            input.type = 'checkbox';
                            input.name = 'category';
                            input.value = item.category_name;
                            const label = document.createElement('label');
                            label.textContent = item.category_name;
                            label.setAttribute("for", "category");
                            const div = document.createElement('div');

                            div.appendChild(input);
                            div.appendChild(label);

                            wrapper.appendChild(div);
                        })

                    })

                    const removeProductButton = document.querySelectorAll('.products .products-table .product-settings svg:nth-child(2)');

                    removeProductButton.forEach((item, index) => {

                        item.addEventListener('click', () => {

                            const productRemove = document.querySelector('.remove-product-wrapper');

                            productRemove.style.display = "block";
                            productRemove.style.opacity = 1;

                            const removeButton = document.querySelector('.remove-product-wrapper .remove-button');

                            const cancelButton = document.querySelector('.remove-product-wrapper .button');

                            const productId = document.querySelectorAll('.products .products-table table tbody .product-id');

                            const removeProductId = productId[index].textContent;

                            console.log(removeProductId);

                            removeButton.addEventListener('click', () => {

                                fetch(`/panel/products/removeProduct/${removeProductId}`)
                                    .then(() => {

                                        console.log(removeProductId);
                                        windows.location.reload();
                                    })
                                    .catch(() => {
                                        console.log("Failed!");
                                    })

                            })

                            cancelButton.addEventListener('click', () => {
                                productRemove.style.opacity = 0;

                                setTimeout(() => {
                                    productRemove.style.display = "none";
                                }, 400);
                            })


                            const addCategory = document.querySelector('.product-edit .add-category');

                            const addCategoryWrapper = document.querySelector('.add-category-wrapper');

                            addCategory.addEventListener('click', () => {
                                addCategoryWrapper.style.display = "flex";
                                addCategoryWrapper.style.opacity = 1;

                                const closeBtn = document.querySelector('.add-category-wrapper .close-btn');

                                closeBtn.addEventListener('click', () => {
                                    addCategoryWrapper.style.opacity = 0;

                                    setTimeout(() => {
                                        addCategoryWrapper.style.display = "none";
                                    }, 400);
                                })
                            })

                        })

                    })

                    //Edit Product Button Creation with EventListeners

                    const editProductButton = document.querySelectorAll('.products .products-table .product-settings svg:first-child');

                    editProductButton.forEach((item, index) => {

                        item.addEventListener('click', () => {

                            const productEdit = document.querySelector('.product-edit');

                            productEdit.style.display = "block";
                            productEdit.style.opacity = 1;

                            const closeBtn = document.querySelector('.product-edit .close-btn');

                            closeBtn.addEventListener('click', () => {
                                productEdit.style.opacity = 0;

                                setTimeout(() => {
                                    productEdit.style.display = "none";
                                }, 400);
                            })

                            const addSize = document.querySelector('.product-edit .add-size');

                            const addSizeWrapper = document.querySelector('.add-size-wrapper');

                            addSize.addEventListener('click', () => {
                                addSizeWrapper.style.display = "flex";
                                addSizeWrapper.style.opacity = 1;

                                const closeBtn = document.querySelector('.add-size-wrapper .close-btn');

                                closeBtn.addEventListener('click', () => {
                                    addSizeWrapper.style.opacity = 0;

                                    setTimeout(() => {
                                        addSizeWrapper.style.display = "none";
                                    }, 400);
                                })

                                const submitBtn = document.querySelector('.add-size-wrapper .button');

                                submitBtn.addEventListener('click', addSizeHandler)
                            })

                            const addCategory = document.querySelector('.product-edit .add-category');

                            const addCategoryWrapper = document.querySelector('.add-category-wrapper');

                            addCategory.addEventListener('click', () => {
                                addCategoryWrapper.style.display = "flex";
                                addCategoryWrapper.style.opacity = 1;

                                const closeBtn = document.querySelector('.add-category-wrapper .close-btn');

                                closeBtn.addEventListener('click', () => {
                                    addCategoryWrapper.style.opacity = 0;

                                    setTimeout(() => {
                                        addCategoryWrapper.style.display = "none";
                                    }, 400);
                                })

                                const submitBtn = document.querySelector('.add-category-wrapper .button');

                                submitBtn.addEventListener('click', addCategoryHandler);
                            })

                            //Adding Data into Fields

                            const productId = document.querySelectorAll('.products .products-table table tbody .product-id');

                            const editProductId = productId[index].textContent;

                            fetch(`/panel/products/getProduct/${editProductId}`)
                                .then((data) => {

                                    console.log(data);

                                })

                            const editTitle = document.querySelector('.product-form-title');
                            const editPrice = document.querySelector('.product-form-price');


                        })

                    })

                })

            isAdded = true;
        }

        const addProductButton = document.querySelector('.add-a-product');



        addProductButton.addEventListener('click', () => {

            const productCreation = document.querySelector('.product-creation');

            productCreation.style.display = "block";
            productCreation.style.opacity = 1;

            const closeBtn = document.querySelector('.product-creation .close-btn');

            closeBtn.addEventListener('click', () => {
                productCreation.style.opacity = 0;

                setTimeout(() => {
                    productCreation.style.display = "none";
                }, 400);
            })

            const addSize = document.querySelector('.product-creation .add-size');

            const addSizeWrapper = document.querySelector('.add-size-wrapper');

            addSize.addEventListener('click', () => {
                addSizeWrapper.style.display = "flex";
                addSizeWrapper.style.opacity = 1;

                const closeBtn = document.querySelector('.add-size-wrapper .close-btn');

                closeBtn.addEventListener('click', () => {
                    addSizeWrapper.style.opacity = 0;

                    setTimeout(() => {
                        addSizeWrapper.style.display = "none";
                    }, 400);
                })

                const submitBtn = document.querySelector('.add-size-wrapper .button');

                submitBtn.addEventListener('click', addSizeHandler)
            })

            const addCategory = document.querySelector('.product-creation .add-category');

            const addCategoryWrapper = document.querySelector('.add-category-wrapper');

            addCategory.addEventListener('click', () => {
                addCategoryWrapper.style.display = "flex";
                addCategoryWrapper.style.opacity = 1;

                const closeBtn = document.querySelector('.add-category-wrapper .close-btn');

                closeBtn.addEventListener('click', () => {
                    addCategoryWrapper.style.opacity = 0;

                    setTimeout(() => {
                        addCategoryWrapper.style.display = "none";
                    }, 400);
                })

                const submitBtn = document.querySelector('.add-category-wrapper .button');

                submitBtn.addEventListener('click', addCategoryHandler);
            })


            const createProductBtn = document.querySelector('.product-creation .creation-button');

            createProductBtn.addEventListener('click', handleProductCreation);

        })




        const imgCheckBox = document.querySelectorAll('.img-box div input');
        const imgDiv = document.querySelectorAll('.img-box div');
        const images = document.querySelectorAll('.img-box div img');

        imgDiv.forEach((item, index) => {
            let isHovering = false;
            let isChecked = false;

            item.addEventListener('mouseenter', () => {
                isHovering = true;
                showCheckbox(index);
            });

            item.addEventListener('mouseleave', () => {
                isHovering = false;
                hideCheckbox(index);
            });

            imgCheckBox[index].addEventListener('mouseenter', () => {
                isHovering = true;
                showCheckbox(index);
            });

            imgCheckBox[index].addEventListener('click', () => {
                if (imgCheckBox[index].checked) {
                    isChecked = true; // Set isHovering to true when the checkbox is checked
                    images[index].style.filter = "brightness(50%)";
                } else {
                    isChecked = false; // Set isHovering to false when the checkbox is unchecked
                    images[index].style.filter = "brightness(100%)";
                }
            });

            function showCheckbox(index) {
                imgCheckBox[index].style.display = 'block';
                imgCheckBox[index].style.opacity = 1;
            }

            function hideCheckbox(index) {
                if (!isHovering) {
                    if (!isChecked) {
                        imgCheckBox[index].style.opacity = 0;
                        setTimeout(() => {
                            imgCheckBox[index].style.display = 'none';
                        }, 400);

                    }
                }
            }
        })

    })


    function getText(textEditor) {
        let editorContent = textEditor.root.innerHTML;
        return editorContent;
    }

    function handleProductCreation(event) {

        const productPicture = document.getElementById("productPicture");
        const picture = productPicture.files;

        const pictureArray = [];
        for (let i = 0; i < picture.length; i++) {
            const file = picture[i];
            pictureArray.push({ name: file.name });
            // Optionally, you can access other file properties like file.type, file.size, etc.
        }

        const productFormTitle = document.querySelector('.product-creation .product-form-title');
        const title = productFormTitle.value;

        console.log(title);


        const productFormPrice = document.querySelector('.product-creation .product-form-price');
        const price = productFormPrice.value;

        console.log(price);

        const productSize = document.querySelectorAll('.product-creation .product-size-wrapper div input');

        let sizeArray = [];

        productSize.forEach((item) => {

            if (item.checked) {
                sizeArray.push(item.value);
            }

        })

        console.log(sizeArray);

        const productCategory = document.querySelectorAll('.product-creation .product-category-wrapper div input');

        let categoryArray = [];

        productCategory.forEach((item) => {

            if (item.checked) {
                categoryArray.push(item.value);
            }

        })

        console.log(categoryArray);

        const description = getText(editorDesc);
        const details = getText(editorDetails);

        console.log(description);
        console.log(details);


        // picture.forEach((item) => {

        console.log(picture);

        // })

        const allowedTypes = ['.jpeg', '.jpg', '.png', '.webp', '.gif'];

        const areAllValidFiles = pictureArray.every(item => {
            return allowedTypes.some(ext => item.name.toLowerCase().endsWith(ext));
        });

        if (areAllValidFiles) {

            const formData = new FormData(); // Create a FormData object

            formData.append('title', title);
            formData.append('price', price);
            for (let i = 0; i < sizeArray.length; i++) {
                const size = sizeArray[i];
                formData.append('size', size); // Append each file to the FormData object
            }
            for (let i = 0; i < categoryArray.length; i++) {
                const category = categoryArray[i];
                formData.append('category', category); // Append each file to the FormData object
            }
            formData.append('description', description);
            formData.append('details', details);
            for (let i = 0; i < picture.length; i++) {
                const file = picture[i];
                formData.append('file', file); // Append each file to the FormData object
            }

            fetch('/panel/products/addProduct', {
                method: 'POST',
                body: formData // Set the body of the request as FormData
            })
                .then(response => {
                    if (response.ok) {
                        alert('Product created successfully!');
                        window.location.reload();
                    } else {
                        alert('Error creating product!');
                    }
                })

        } else {
            alert('The file is not a picture!');
        }


    }

    function addSizeHandler(event) {

        const sizeValue = document.querySelector('.product-size-value');

        const url = '/panel/products/addProductSizes';

        const data = {
            size: sizeValue.value.trim()
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                const status = document.querySelector('.status-size');
                if (response.ok) {
                    status.textContent = "Successfully added size!";
                    status.classList.add('in-stock');
                    status.classList.remove('out-of-stock');
                } else {
                    status.textContent = "Error adding  size!";
                    status.classList.remove('in-stock');
                    status.classList.add('out-of-stock');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        const inputWrapper = document.querySelectorAll('.product-size-wrapper');

        inputWrapper.forEach((item) => {

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'size';
            input.value = sizeValue.value;
            const label = document.createElement('label');
            label.textContent = sizeValue.value;
            label.setAttribute("for", "size");
            const div = document.createElement('div');
            div.appendChild(input);
            div.appendChild(label);
            item.appendChild(div);
        })


        const addSizeWrapper = document.querySelector('.add-size-wrapper');

        setTimeout(() => {

            addSizeWrapper.style.opacity = 0;

            setTimeout(() => {
                addSizeWrapper.style.display = "none";
            }, 400);

        }, 800);

    }

    function addCategoryHandler(event) {

        const categoryValue = document.querySelector('.product-category-value');

        const url = '/panel/products/addProductCategory';

        const data = {
            category: categoryValue.value.trim()
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                const status = document.querySelector('.status-category');
                if (response.ok) {
                    status.textContent = "Successfully added category!";
                    status.classList.add('in-stock');
                    status.classList.remove('out-of-stock');
                } else {
                    status.textContent = "Error adding  category!";
                    status.classList.remove('in-stock');
                    status.classList.add('out-of-stock');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });


        const inputWrapper = document.querySelectorAll('.product-category-wrapper');

        inputWrapper.forEach((item) => {

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'category';
            input.value = categoryValue.value;
            const label = document.createElement('label');
            label.textContent = categoryValue.value;
            label.setAttribute("for", "category");
            const div = document.createElement('div');
            div.appendChild(input);
            div.appendChild(label);
            item.appendChild(div);
        })

        const addCategoryWrapper = document.querySelector('.add-category-wrapper');

        setTimeout(() => {

            addCategoryWrapper.style.opacity = 0;

            setTimeout(() => {
                addCategoryWrapper.style.display = "none";
            }, 400);

        }, 800);

    }




})