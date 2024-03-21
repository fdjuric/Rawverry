document.addEventListener('DOMContentLoaded', function () {

    let prevSection = 0;

    const removePrices = [];
    const sizeIds = [];

    const navElement = document.querySelectorAll('nav div:not(:last-child)');
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

        const allowedTypes = ['.jpeg', '.jpg', '.JPG', '.png', '.webp', '.gif'];

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

                    setTimeout(() => {
                        location.reload();
                    }, 400);
                })
                .catch(error => {
                    console.log(error);
                })
        } else {
            alert('File is not an image type!');
        }

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

            console.log(blog);
            const row = document.createElement('tr');

            const titleCellWrapper = document.createElement('td');
            const titleCellWrapperDiv = document.createElement('div');
            const titleCellImgWrapper = document.createElement('div');
            titleCellImgWrapper.classList.add('title-picture');
            if (blog.image_url !== null) {
                const titlePic = document.createElement('img');
                titlePic.src = blog.image_url;
                titlePic.style.width = "50px";
                titlePic.style.height = "50px";
                titlePic.style.borderRadius = "50%";
                titleCellWrapperDiv.appendChild(titlePic);
            } else {
                const titlePic = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                titlePic.setAttribute("class", "acc-default");
                titlePic.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                titlePic.setAttribute("width", "35");
                titlePic.setAttribute("height", "35");
                titlePic.setAttribute("viewBox", "0 0 35 35");
                titlePic.setAttribute("fill", "none");
                titlePic.setAttribute("style", "display: block;");

                // Create the path element
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M17.4987 17.5C15.8945 17.5 14.5213 16.9288 13.3789 15.7864C12.2365 14.6441 11.6654 13.2708 11.6654 11.6666C11.6654 10.0625 12.2365 8.68922 13.3789 7.54685C14.5213 6.40449 15.8945 5.83331 17.4987 5.83331C19.1029 5.83331 20.4761 6.40449 21.6185 7.54685C22.7609 8.68922 23.332 10.0625 23.332 11.6666C23.332 13.2708 22.7609 14.6441 21.6185 15.7864C20.4761 16.9288 19.1029 17.5 17.4987 17.5ZM5.83203 29.1666V25.0833C5.83203 24.2569 6.04495 23.4971 6.47078 22.8039C6.89661 22.1107 7.46148 21.5823 8.16536 21.2187C9.67231 20.4653 11.2036 19.8999 12.7591 19.5227C14.3147 19.1455 15.8945 18.9573 17.4987 18.9583C19.1029 18.9583 20.6827 19.1469 22.2383 19.5241C23.7938 19.9014 25.3251 20.4662 26.832 21.2187C27.5369 21.5833 28.1022 22.1122 28.5281 22.8054C28.9539 23.4986 29.1663 24.2579 29.1654 25.0833V29.1666H5.83203ZM8.7487 26.25H26.2487V25.0833C26.2487 24.816 26.1816 24.5729 26.0474 24.3541C25.9133 24.1354 25.7373 23.9653 25.5195 23.8437C24.207 23.1875 22.8824 22.6955 21.5456 22.3679C20.2088 22.0403 18.8598 21.876 17.4987 21.875C16.1376 21.875 14.7886 22.0393 13.4518 22.3679C12.115 22.6965 10.7904 23.1885 9.47786 23.8437C9.25911 23.9653 9.08266 24.1354 8.94849 24.3541C8.81432 24.5729 8.74773 24.816 8.7487 25.0833V26.25ZM17.4987 14.5833C18.3008 14.5833 18.9877 14.2975 19.5593 13.7258C20.131 13.1541 20.4163 12.4678 20.4154 11.6666C20.4154 10.8646 20.1295 10.1777 19.5579 9.60602C18.9862 9.03435 18.2998 8.74901 17.4987 8.74998C16.6966 8.74998 16.0097 9.03581 15.4381 9.60748C14.8664 10.1791 14.5811 10.8655 14.582 11.6666C14.582 12.4687 14.8679 13.1556 15.4395 13.7273C16.0112 14.2989 16.6976 14.5843 17.4987 14.5833Z");
                path.setAttribute("fill", "var(--accent-color)");

                // Append the path to the SVG
                titlePic.appendChild(path);

                // Append the SVG to the body
                titleCellImgWrapper.appendChild(titlePic);
                titleCellWrapperDiv.appendChild(titleCellImgWrapper);
            }

            const titleCell = document.createElement('p');
            titleCell.classList.add('blog-title');
            titleCell.textContent = blog.title;
            titleCellWrapperDiv.appendChild(titleCell);

            titleCellWrapper.appendChild(titleCellWrapperDiv);

            const titleCellAuthorWrapper = document.createElement('td');
            const titleCellAuthorWrapperDiv = document.createElement('div');
            const titleCellAuthorImgWrapper = document.createElement('div');
            titleCellAuthorImgWrapper.classList.add('account-picture');
            if (blog.author_picture !== null) {
                const titlePic = document.createElement('img');
                titlePic.src = blog.author_picture;
                titlePic.style.width = "50px";
                titlePic.style.height = "50px";
                titlePic.style.borderRadius = "50%";
                titleCellAuthorWrapperDiv.appendChild(titlePic);
            } else {
                const titlePic = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                titlePic.setAttribute("class", "acc-default");
                titlePic.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                titlePic.setAttribute("width", "35");
                titlePic.setAttribute("height", "35");
                titlePic.setAttribute("viewBox", "0 0 35 35");
                titlePic.setAttribute("fill", "none");
                titlePic.setAttribute("style", "display: block;");

                // Create the path element
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M17.4987 17.5C15.8945 17.5 14.5213 16.9288 13.3789 15.7864C12.2365 14.6441 11.6654 13.2708 11.6654 11.6666C11.6654 10.0625 12.2365 8.68922 13.3789 7.54685C14.5213 6.40449 15.8945 5.83331 17.4987 5.83331C19.1029 5.83331 20.4761 6.40449 21.6185 7.54685C22.7609 8.68922 23.332 10.0625 23.332 11.6666C23.332 13.2708 22.7609 14.6441 21.6185 15.7864C20.4761 16.9288 19.1029 17.5 17.4987 17.5ZM5.83203 29.1666V25.0833C5.83203 24.2569 6.04495 23.4971 6.47078 22.8039C6.89661 22.1107 7.46148 21.5823 8.16536 21.2187C9.67231 20.4653 11.2036 19.8999 12.7591 19.5227C14.3147 19.1455 15.8945 18.9573 17.4987 18.9583C19.1029 18.9583 20.6827 19.1469 22.2383 19.5241C23.7938 19.9014 25.3251 20.4662 26.832 21.2187C27.5369 21.5833 28.1022 22.1122 28.5281 22.8054C28.9539 23.4986 29.1663 24.2579 29.1654 25.0833V29.1666H5.83203ZM8.7487 26.25H26.2487V25.0833C26.2487 24.816 26.1816 24.5729 26.0474 24.3541C25.9133 24.1354 25.7373 23.9653 25.5195 23.8437C24.207 23.1875 22.8824 22.6955 21.5456 22.3679C20.2088 22.0403 18.8598 21.876 17.4987 21.875C16.1376 21.875 14.7886 22.0393 13.4518 22.3679C12.115 22.6965 10.7904 23.1885 9.47786 23.8437C9.25911 23.9653 9.08266 24.1354 8.94849 24.3541C8.81432 24.5729 8.74773 24.816 8.7487 25.0833V26.25ZM17.4987 14.5833C18.3008 14.5833 18.9877 14.2975 19.5593 13.7258C20.131 13.1541 20.4163 12.4678 20.4154 11.6666C20.4154 10.8646 20.1295 10.1777 19.5579 9.60602C18.9862 9.03435 18.2998 8.74901 17.4987 8.74998C16.6966 8.74998 16.0097 9.03581 15.4381 9.60748C14.8664 10.1791 14.5811 10.8655 14.582 11.6666C14.582 12.4687 14.8679 13.1556 15.4395 13.7273C16.0112 14.2989 16.6976 14.5843 17.4987 14.5833Z");
                path.setAttribute("fill", "var(--accent-color)");

                // Append the path to the SVG
                titlePic.appendChild(path);

                // Append the SVG to the body
                titleCellAuthorImgWrapper.appendChild(titlePic);
                titleCellAuthorWrapperDiv.appendChild(titleCellAuthorImgWrapper);
            }

            const titleAuthorCell = document.createElement('p');
            titleAuthorCell.classList.add('blog-author');
            titleAuthorCell.textContent = blog.author;
            titleCellAuthorWrapperDiv.appendChild(titleAuthorCell);
            titleCellAuthorWrapper.appendChild(titleCellAuthorWrapperDiv);

            // Create and populate table data (td) for each field
            const idCell = createTableCell(blog.id, 'blog-id');
            const contentCell = createTableCell(blog.content, 'blog-content');
            const createDateCell = createTableCell(blog.created_at, 'blog-created');
            const changedDateCell = createTableCell(blog.updated_at, 'blog-updated');

            // Append table data to the table row

            console.log(titleCellWrapper);
            console.log(titleCellAuthorWrapper);

            row.appendChild(idCell);
            row.appendChild(titleCellWrapper);
            row.appendChild(contentCell);
            row.appendChild(titleCellAuthorWrapper);
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

        const editButton = document.querySelector('.blog-edit .edit-button');

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

            const deleteBlog = parent.lastElementChild;

            deleteBlog.addEventListener('click', () => {
                const removeBlogWrapper = document.querySelector('.remove-blog-wrapper');

                const row = parent.closest('tr');

                console.log(row);

                removeBlogWrapper.style.display = "flex";
                removeBlogWrapper.style.opacity = 1;

                const blogIds = row.querySelector('.blog-id');

                console.log(blogIds);

                const blogId = blogIds.textContent;

                console.log(blogId);

                const removeButton = document.querySelector('.remove-blog-wrapper .remove-button');
                removeButton.addEventListener('click', () => {

                    fetch(`/panel/blog/removeBlog/${blogId}`)
                        .then(response => {
                            if (response.ok) {
                                const status = document.querySelector('.remove-blog-wrapper .status-category');
                                status.textContent = "Successfully removed blog!";
                                status.classList.add('in-stock');

                                const wrapper = document.querySelector('.remove-blog-wrapper');

                                row.remove();

                                setTimeout(() => {
                                    wrapper.style.opacity = 0;
                                    setTimeout(() => {
                                        wrapper.style.display = "none";
                                        status.textContent = "";
                                    }, 400)
                                }, 400)

                                console.log(blogId);


                                //window.location.reload();
                            } else {
                                const status = document.querySelector('.remove-blog-wrapper .status-category');
                                status.textContent = "Error removing blog!";
                                status.classList.add('out-of-stock');
                                console.log("Failed!");
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        })

                })



                const cancelButton = document.querySelector('.remove-blog-wrapper .button:last-child');
                cancelButton.addEventListener('click', () => {
                    removeBlogWrapper.style.opacity = 0;

                    setTimeout(() => {
                        removeBlogWrapper.style.display = "none";
                    }, 400);
                })
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
        svgEdit.classList.add('edit');

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



    const logoutButton = document.querySelector('.log-out-btn');
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

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
        console.log(formattedDate);

        const content = getTextWithTags();

        const blogPicture = document.getElementById("blogPicture");
        const picture = blogPicture.files[0];

        const blogFormTitle = document.querySelector('.blog-creation .blog-form-title');
        const title = blogFormTitle.value;

        // console.log(picture.name);

        const allowedTypes = ['.jpeg', '.jpg', '.png', '.webp', '.gif'];

        const isValidFileType = allowedTypes.some(ext => picture.name.endsWith(ext));

        if (isValidFileType) {

            const formData = new FormData(); // Create a FormData object

            formData.append('title', title); // Append title
            formData.append('content', content); // Append content
            formData.append('file', picture); // Append picture
            formData.append('date', formattedDate);

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

        const url = '/panel/blog/editBlog';

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
        console.log(formattedDate);

        const formData = new FormData();

        formData.append('id', blogIdElement.textContent);
        formData.append('title', blogFormTitleElement.value);
        formData.append('content', contentWithTags);
        formData.append('date', formattedDate);

        fetch(url, {
            method: 'POST',
            body: formData
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

                            const date = product.date_col;
                            //const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
                            //console.log(formattedDate);

                            const dateEdited = product.date_edited;
                            // const formattedEditedDate = dateEdited.toISOString().slice(0, 19).replace("T", " ");
                            console.log(dateEdited);

                            const amountCell = createTableCell(product.product_amount_bought_total, 'product-amount');
                            const inStockCell = createTableCell(product.in_stock, 'product-in-stock');
                            const createdCell = createTableCell(date, 'product-date');
                            const editedCell = createTableCell(dateEdited, 'product-date-edited');
                            const editedByCell = createTableCell(product.edited_by, 'product-date-editedby');

                            // Append table data to the table row

                            titleCellWrapperDiv.appendChild(titlePic);
                            titleCellWrapperDiv.appendChild(titleCell);
                            titleCellWrapper.appendChild(titleCellWrapperDiv);
                            row.appendChild(idCell);
                            row.appendChild(titleCellWrapper);
                            row.appendChild(amountCell);
                            row.appendChild(inStockCell);
                            row.appendChild(createdCell);
                            row.appendChild(editedCell);
                            row.appendChild(editedByCell);

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
                    const sizeWrapper = document.querySelector('.product-creation .product-form-price-wrapper .product-size-wrapper');

                    const select = document.createElement('select');
                    select.name = "size";
                    select.classList.add('product-size');

                    data.sizes.forEach((item) => {

                        const option = document.createElement('option');
                        option.setAttribute('value', item.size_value);
                        option.textContent = item.size_value;
                        select.appendChild(option);
                    })

                    const option = document.createElement('option');
                    option.setAttribute('value', 'remove-size');
                    option.textContent = 'Remove a size';

                    select.appendChild(option);
                    const option1 = document.createElement('option');
                    option1.setAttribute('value', 'add-size');
                    option1.textContent = 'Add a size';

                    select.appendChild(option1);
                    sizeWrapper.appendChild(select);


                    const sizeSelector = document.querySelectorAll('.product-form-price-wrapper .product-size-wrapper .product-size');

                    const addSizeWrapper = document.querySelector('.add-size-wrapper');
                    const removeSizeWrapper = document.querySelector('.remove-size-wrapper')

                    console.log(sizeSelector);
                    sizeSelector.forEach((selector) => {

                        console.log(selector);

                        selector.addEventListener('change', () => {

                            if (selector.value === 'add-size') {

                                selector.selectedIndex = 0;
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

                                submitBtn.addEventListener('click', addSizeHandler);
                            } else if (selector.value === 'remove-size') {
                                const removeSizeInputs = document.querySelector('.remove-size-inputs');
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

                                    removeSizeInputs.appendChild(div);
                                })

                                selector.selectedIndex = 0;
                                removeSizeWrapper.style.display = "flex";
                                removeSizeWrapper.style.opacity = 1;

                                const closeBtn = document.querySelector('.remove-size-wrapper .close-btn');

                                closeBtn.addEventListener('click', () => {
                                    removeSizeWrapper.style.opacity = 0;

                                    setTimeout(() => {
                                        removeSizeWrapper.style.display = "none";
                                        while (removeSizeInputs.firstChild) {
                                            removeSizeInputs.removeChild(removeSizeInputs.firstChild);
                                        }
                                    }, 400);
                                })

                                const submitBtn = document.querySelector('.remove-size-wrapper .button');

                                submitBtn.addEventListener('click', removeSizeHandler);
                            }
                        })
                    })

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

                            const row = item.closest('tr');

                            console.log(row);

                            productRemove.style.display = "flex";
                            productRemove.style.opacity = 1;

                            const removeButton = document.querySelector('.remove-product-wrapper .remove-button');

                            const cancelButton = document.querySelector('.remove-product-wrapper .button:last-child');

                            const productId = document.querySelectorAll('.products .products-table table tbody .product-id');

                            const removeProductId = productId[index].textContent;

                            console.log(removeProductId);

                            removeButton.addEventListener('click', () => {

                                fetch(`/panel/products/removeProduct/${removeProductId}`)

                                    .then(response => {
                                        if (response.ok) {
                                            const status = document.querySelector('.remove-product-wrapper .status-category');
                                            status.textContent = "Successfully removed product!";
                                            status.classList.add('in-stock');

                                            const wrapper = document.querySelector('.remove-product-wrapper');

                                            row.remove();

                                            setTimeout(() => {
                                                wrapper.style.opacity = 0;
                                                setTimeout(() => {
                                                    wrapper.style.display = "none";
                                                }, 400)
                                            }, 400)

                                            console.log(removeProductId);


                                            windows.location.reload();
                                        } else {
                                            const status = document.querySelector('.remove-product-wrapper .status-category');
                                            status.textContent = "Error removing product!";
                                            status.classList.add('out-of-stock');
                                            console.log("Failed!");
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })

                            })

                            cancelButton.addEventListener('click', () => {
                                productRemove.style.opacity = 0;

                                setTimeout(() => {
                                    productRemove.style.display = "none";
                                }, 400);
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


                                    const editCategories = document.querySelectorAll('.edit-product .product-category-wrapper div input');

                                    editCategories.forEach(input => {

                                        input.checked = false;

                                    })

                                    const priceRows = document.querySelectorAll('.product-edit .product-form-price-row');
                                    for (let i = 0; i < priceRows.length; i++) {
                                        priceRows[i].remove();
                                    }

                                    const productPictures = document.querySelector('.edit-product .img-wrapper .img-box');

                                    while (productPictures.firstChild) {
                                        productPictures.removeChild(productPictures.firstChild);
                                    }
                                }, 400);
                            })

                            const addCategory = document.querySelector('.product-edit .add-category');
                            const addCategoryWrapper = document.querySelector('.add-category-wrapper');

                            const removeCategory = document.querySelector('.product-edit .remove-category');
                            const removeCategoryWrapper = document.querySelector('.remove-category-wrapper');
                            const removeCategoryInputs = document.querySelector('.remove-category-inputs');

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

                            removeCategory.addEventListener('click', () => {
                                removeCategoryWrapper.style.display = "flex";
                                removeCategoryWrapper.style.opacity = 1;

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

                                    removeCategoryInputs.appendChild(div);
                                })

                                const closeBtn = document.querySelector('.remove-category-wrapper .close-btn');

                                closeBtn.addEventListener('click', () => {
                                    removeCategoryWrapper.style.opacity = 0;

                                    setTimeout(() => {
                                        removeCategoryWrapper.style.display = "none";
                                        while (removeCategoryInputs.firstChild) {
                                            removeCategoryInputs.removeChild(removeCategoryInputs.firstChild);
                                        }
                                    }, 400);
                                })

                                const submitBtn = document.querySelector('.remove-category-wrapper .button');

                                submitBtn.addEventListener('click', removeCategoryHandler);
                            })

                            //Adding Data into Fields

                            const tr = item.closest('tr');
                            const productId = tr.querySelector('.product-id');

                            const editProductId = productId.textContent;

                            fetch(`/panel/products/getProduct/${editProductId}`)
                                .then(response => response.json())
                                .then((dat) => {
                                    console.log(dat);

                                    const editTitle = document.querySelector('.edit-product .product-form-title');
                                    const editCategories = document.querySelectorAll('.edit-product .product-category-wrapper div input');

                                    editTitle.value = dat[0].product_name;

                                    const sizeValueArray = dat[3].map(item => ({
                                        id: item.id,
                                        product_price: item.product_price,
                                        product_price_reduced: item.product_price_reduced,
                                        size_value: item.size_value
                                    }));
                                    console.log(sizeValueArray);
                                    console.log(Array.isArray(sizeValueArray));

                                    sizeValueArray.forEach((item) => {
                                        addPriceSizeHandlerEdit(data, item);
                                    })

                                    const categoryValueArray = dat[2].map(item => item.category_name);
                                    console.log(categoryValueArray);
                                    console.log(Array.isArray(categoryValueArray));


                                    const imagePath = dat[1].map(item => item.image_url);

                                    console.log(imagePath);

                                    editCategories.forEach(input => {
                                        if (categoryValueArray.includes(input.value)) {
                                            input.checked = true;
                                        }
                                    })


                                    editorDescEdit.root.innerHTML = dat[0].description;
                                    editorDetailsEdit.root.innerHTML = dat[0].details;

                                    const productPictures = document.querySelector('.edit-product .img-wrapper .img-box');

                                    imagePath.forEach((item, index) => {

                                        const div = document.createElement('div');
                                        const checkbox = document.createElement('input');
                                        checkbox.type = "checkbox";
                                        checkbox.name = "image";
                                        checkbox.value = index;
                                        checkbox.style.display = "none";
                                        checkbox.style.opacity = "0";
                                        const image = document.createElement('img');
                                        image.width = "100";
                                        image.height = "100";
                                        image.src = item;

                                        div.appendChild(checkbox);
                                        div.appendChild(image);
                                        productPictures.appendChild(div);

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

                                    const confirmEditButton = document.querySelector('.edit-product .edit-button');

                                    confirmEditButton.addEventListener('click', () => {

                                        const productId = dat[0].product_id;
                                        const oldTitle = dat[0].product_name;

                                        console.log(removePrices);

                                        let categoryArray = [];

                                        editCategories.forEach((item) => {

                                            if (item.checked) {
                                                categoryArray.push(item.value);
                                            }

                                        })

                                        const removeImagesCheckbox = document.querySelectorAll('.edit-product .img-wrapper .img-box div input');
                                        const removeImages = document.querySelectorAll('.edit-product .img-wrapper .img-box div img');

                                        const removeImagesArray = [];

                                        removeImagesCheckbox.forEach((item, index) => {

                                            if (item.checked) {

                                                const imageUrl = removeImages[index].src;

                                                const newUrl = new URL(imageUrl);
                                                removeImagesArray.push(newUrl.pathname);

                                            }
                                        })

                                        console.log(removeImagesArray);

                                        const productPicture = document.getElementById('productPictureEdit');
                                        const picture = productPicture.files;

                                        const pictureArray = [];
                                        for (let i = 0; i < picture.length; i++) {
                                            const file = picture[i];
                                            pictureArray.push({ name: file.name });
                                            // Optionally, you can access other file properties like file.type, file.size, etc.
                                        }

                                        const formData = new FormData();

                                        const productFormWrapper = document.querySelectorAll('.product-edit .product-form-price-row');

                                        const newSizes = [];
                                        const changedSizes = [];

                                        productFormWrapper.forEach((item, index) => {
                                            if (item.classList.contains('temp')) {
                                                const price = item.querySelector('.product-form-price');
                                                const priceReduced = item.querySelector('.product-form-price-reduced');
                                                const size = item.querySelector('.product-size');
                                                newSizes.push({ price: price.value, priceReduced: priceReduced.value, size: size.value })
                                            } else if (item.classList.contains('changed')) {
                                                const price = item.querySelector('.product-form-price');
                                                const priceReduced = item.querySelector('.product-form-price-reduced');
                                                const size = item.querySelector('.product-size');
                                                changedSizes.push({ id: sizeIds[index].id, price: price.value, priceReduced: priceReduced.value, size: size.value });
                                            }
                                        })

                                        formData.append('title', oldTitle);
                                        formData.append('newTitle', editTitle.value);

                                        formData.append('id', productId);
                                        for (let i = 0; i < picture.length; i++) {
                                            const file = picture[i];
                                            formData.append('file', file); // Append each file to the FormData object
                                        }

                                        for (let i = 0; i < removeImagesArray.length; i++) {
                                            formData.append('removePics', removeImagesArray[i]);
                                        }

                                        removePrices.forEach(item => {
                                            formData.append('removePrices[]', JSON.stringify(item));
                                        })

                                        newSizes.forEach(item => {
                                            formData.append('newSizes[]', JSON.stringify(item))
                                        })

                                        changedSizes.forEach(item => {
                                            formData.append('changedSizes[]', JSON.stringify(item));
                                        })

                                        categoryValueArray.forEach(item => {
                                            formData.append('oldCategories', item)
                                        })

                                        categoryArray.forEach(item => {
                                            formData.append('categories', item);
                                        })

                                        formData.append('description', editorDescEdit.root.innerHTML);
                                        formData.append('details', editorDetailsEdit.root.innerHTML);

                                        const currentDate = new Date();
                                        const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
                                        console.log(formattedDate);

                                        formData.append('date', formattedDate);

                                        console.log(formData);

                                        fetch('/panel/products/editProduct', {
                                            method: 'POST',
                                            body: formData,
                                        })
                                            .then(response => {
                                                if (response.ok) {
                                                    alert('Product edited successfully!');

                                                    productEdit.style.opacity = 0;

                                                    setTimeout(() => {
                                                        productEdit.style.display = "none";

                                                        const editSizes = document.querySelectorAll('.edit-product .product-form-price-wrapper');
                                                        const editCategories = document.querySelectorAll('.edit-product .product-category-wrapper div input')

                                                        editSizes.forEach(item => {
                                                            item.remove();
                                                        })
                                                        editCategories.forEach(input => {

                                                            input.checked = false;

                                                        })

                                                        const productPictures = document.querySelector('.edit-product .img-wrapper .img-box');

                                                        while (productPictures.firstChild) {
                                                            productPictures.removeChild(productPictures.firstChild);
                                                        }
                                                    }, 400);

                                                } else {
                                                    alert('Error editing product!');
                                                }
                                            })
                                            .catch(err => console.log(err));
                                    });
                                })
                                .catch(err => console.log(err));




                        })

                    })

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
                                const priceRows = document.querySelectorAll('.product-creation .product-form-price-row');
                                for (let i = 1; i < priceRows.length; i++) {
                                    priceRows[i].remove();
                                }
                            }, 400);
                        })

                        const addSizeCreate = document.querySelector('.product-creation .add-size');

                        addSizeCreate.addEventListener('click', () => {
                            console.log(data);
                            addPriceSizeHandlerCreate(data, addSizeCreate);
                        })

                        const addCategory = document.querySelector('.product-creation .add-category');
                        const removeCategory = document.querySelector('.product-creation .remove-category');

                        const addCategoryWrapper = document.querySelector('.add-category-wrapper');
                        const removeCategoryWrapper = document.querySelector('.remove-category-wrapper');

                        const removeCategoryInputs = document.querySelector('.remove-category-inputs');

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

                        removeCategory.addEventListener('click', () => {
                            removeCategoryWrapper.style.display = "flex";
                            removeCategoryWrapper.style.opacity = 1;

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

                                removeCategoryInputs.appendChild(div);
                            })

                            const closeBtn = document.querySelector('.remove-category-wrapper .close-btn');

                            closeBtn.addEventListener('click', () => {
                                removeCategoryWrapper.style.opacity = 0;

                                setTimeout(() => {
                                    removeCategoryWrapper.style.display = "none";
                                }, 400);
                            })

                            const submitBtn = document.querySelector('.remove-category-wrapper .button');

                            submitBtn.addEventListener('click', removeCategoryHandler);
                        })


                        const createProductBtn = document.querySelector('.product-creation .creation-button');

                        createProductBtn.addEventListener('click', handleProductCreation);

                    })

                })

            isAdded = true;
        }




    })


    function getText(textEditor) {
        let editorContent = textEditor.root.innerHTML;
        return editorContent;
    }

    function handleProductCreation(event) {

        const form = document.querySelector('.create-product');



        if (form.checkValidity()) {

            const categories = document.querySelectorAll('.product-creation .product-category-wrapper div input');

            const isChecked = Array.from(categories).some(checkbox => checkbox.checked);

            console.log(isChecked);

            if (isChecked) {
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

                const productFormPrice = document.querySelectorAll('.product-creation .product-form-price');
                const productFormPriceReduced = document.querySelectorAll('.product-creation .product-form-price-reduced');
                const productSize = document.querySelectorAll('.product-creation .product-size-wrapper .product-size');

                const pricePerSizeArray = [];

                for (let i = 0; i < productFormPrice.length; i++) {
                    pricePerSizeArray.push({ price: productFormPrice[i].value, priceReduced: productFormPriceReduced[i].value, size: productSize[i].value });
                }

                console.log(pricePerSizeArray[0].price);

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

                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
                console.log(formattedDate);


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
                    for (let i = 0; i < pricePerSizeArray.length; i++) {
                        const size = pricePerSizeArray[i];
                        console.log(size);
                        formData.append('price[]', JSON.stringify(size)); // Append each file to the FormData object
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

                    formData.append('date', formattedDate);

                    console.log(formattedDate);

                    fetch('/panel/products/addProduct', {
                        method: 'POST',
                        body: formData // Set the body of the request as FormData
                    })
                        .then(response => {
                            if (response.ok) {
                                alert('Product added successfully!');

                                const productCreation = document.querySelector('.product-creation');

                                productCreation.style.opacity = 0;

                                setTimeout(() => {
                                    productCreation.style.display = "none";

                                    const editSizes = document.querySelectorAll('.product-creation .product-form-price-wrapper');
                                    const editCategories = document.querySelectorAll('.product-creation .product-category-wrapper div input')

                                    editSizes.forEach(item => {
                                        item.remove();
                                    })
                                    editCategories.forEach(input => {

                                        input.checked = false;

                                    })

                                }, 400);
                            } else {
                                alert('Error creating product!');
                            }
                        })

                } else {
                    alert('The file is not a picture!');
                }
            } else {
                alert('Please fill the remaining fields!');
            }



        } else {
            alert('Please fill the remaining fields');
        }




    }


    const manageAccountsBtn = document.querySelector('.manage-accounts-btn');

    let areAccountsAdded = false;

    manageAccountsBtn.addEventListener('click', () => {

        if (!areAccountsAdded) {
            fetch('/panel/manageAccounts')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.createElement('tbody');
                    const table = document.querySelector('.manage-accounts .products-table table');
                    let temp;
                    data.forEach(account => {
                        const row = document.createElement('tr');
                        console.log('Account');
                        if (temp != account.id) {
                            // Create and populate table data (td) for each field

                            console.log('AccountID');
                            const idCell = createTableCell(account.id, 'account-id');
                            const titleCellWrapper = document.createElement('td');
                            const titleCellWrapperDiv = document.createElement('div');
                            const titleCellImgWrapper = document.createElement('div');
                            titleCellImgWrapper.classList.add('account-picture');
                            if (account.picture_path !== null) {
                                const titlePic = document.createElement('img');
                                titlePic.src = account.picture_path;
                                titlePic.style.width = "50px";
                                titlePic.style.height = "50px";
                                titlePic.style.borderRadius = "50%";
                                titleCellWrapperDiv.appendChild(titlePic);
                            } else {
                                const titlePic = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                                titlePic.setAttribute("class", "acc-default");
                                titlePic.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                                titlePic.setAttribute("width", "35");
                                titlePic.setAttribute("height", "35");
                                titlePic.setAttribute("viewBox", "0 0 35 35");
                                titlePic.setAttribute("fill", "none");
                                titlePic.setAttribute("style", "display: block;");

                                // Create the path element
                                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                                path.setAttribute("d", "M17.4987 17.5C15.8945 17.5 14.5213 16.9288 13.3789 15.7864C12.2365 14.6441 11.6654 13.2708 11.6654 11.6666C11.6654 10.0625 12.2365 8.68922 13.3789 7.54685C14.5213 6.40449 15.8945 5.83331 17.4987 5.83331C19.1029 5.83331 20.4761 6.40449 21.6185 7.54685C22.7609 8.68922 23.332 10.0625 23.332 11.6666C23.332 13.2708 22.7609 14.6441 21.6185 15.7864C20.4761 16.9288 19.1029 17.5 17.4987 17.5ZM5.83203 29.1666V25.0833C5.83203 24.2569 6.04495 23.4971 6.47078 22.8039C6.89661 22.1107 7.46148 21.5823 8.16536 21.2187C9.67231 20.4653 11.2036 19.8999 12.7591 19.5227C14.3147 19.1455 15.8945 18.9573 17.4987 18.9583C19.1029 18.9583 20.6827 19.1469 22.2383 19.5241C23.7938 19.9014 25.3251 20.4662 26.832 21.2187C27.5369 21.5833 28.1022 22.1122 28.5281 22.8054C28.9539 23.4986 29.1663 24.2579 29.1654 25.0833V29.1666H5.83203ZM8.7487 26.25H26.2487V25.0833C26.2487 24.816 26.1816 24.5729 26.0474 24.3541C25.9133 24.1354 25.7373 23.9653 25.5195 23.8437C24.207 23.1875 22.8824 22.6955 21.5456 22.3679C20.2088 22.0403 18.8598 21.876 17.4987 21.875C16.1376 21.875 14.7886 22.0393 13.4518 22.3679C12.115 22.6965 10.7904 23.1885 9.47786 23.8437C9.25911 23.9653 9.08266 24.1354 8.94849 24.3541C8.81432 24.5729 8.74773 24.816 8.7487 25.0833V26.25ZM17.4987 14.5833C18.3008 14.5833 18.9877 14.2975 19.5593 13.7258C20.131 13.1541 20.4163 12.4678 20.4154 11.6666C20.4154 10.8646 20.1295 10.1777 19.5579 9.60602C18.9862 9.03435 18.2998 8.74901 17.4987 8.74998C16.6966 8.74998 16.0097 9.03581 15.4381 9.60748C14.8664 10.1791 14.5811 10.8655 14.582 11.6666C14.582 12.4687 14.8679 13.1556 15.4395 13.7273C16.0112 14.2989 16.6976 14.5843 17.4987 14.5833Z");
                                path.setAttribute("fill", "var(--accent-color)");

                                // Append the path to the SVG
                                titlePic.appendChild(path);

                                // Append the SVG to the body
                                titleCellImgWrapper.appendChild(titlePic);
                                titleCellWrapperDiv.appendChild(titleCellImgWrapper);
                            }
                            const titleCell = document.createElement('p');
                            titleCell.classList.add('account-name');
                            titleCell.textContent = account.user_name;

                            const emailCell = createTableCell(account.user_email, 'account-email');
                            const joinedCell = createTableCell(account.date_col, 'account-date-joined');
                            const roleCell = createTableCell(account.account_role, 'account-role');

                            // Append table data to the table row
                            titleCellWrapperDiv.appendChild(titleCell);
                            titleCellWrapper.appendChild(titleCellWrapperDiv);
                            row.appendChild(idCell);
                            row.appendChild(titleCellWrapper);
                            row.appendChild(emailCell);
                            row.appendChild(joinedCell);
                            row.appendChild(roleCell);

                            // Create and append the SVG icons
                            const settingsEditIcons = createSettingsEditIcons(); // Function to create SVG icons
                            const settingsCell = document.createElement('td');
                            settingsCell.appendChild(settingsEditIcons);
                            row.appendChild(settingsCell);

                            // Append the row to the table body
                            tbody.appendChild(row);

                            temp = account.id;
                        } else return;
                    });

                    table.appendChild(tbody);
                })
            fetch(`/panel/manageAccounts/getAccountRoles`)
                .then(response => response.json())
                .then(data => {
                    const sizeWrapper = document.querySelector('.account-creation .create-account');

                    const accountRoleWrapper = document.querySelector('.account-creation .create-account .account-role-wrapper');

                    const select = document.createElement('select');
                    select.name = "role";
                    select.classList.add('account-role');

                    data.forEach((item) => {

                        const option = document.createElement('option');
                        option.setAttribute('value', item);
                        option.textContent = item;
                        select.appendChild(option);
                    })

                    accountRoleWrapper.appendChild(select);

                    const removeAccountButton = document.querySelectorAll('.manage-accounts .products-table .product-settings svg:nth-child(2)');

                    removeAccountButton.forEach((item, index) => {

                        item.addEventListener('click', () => {

                            const accountRemove = document.querySelector('.remove-account-wrapper');

                            const row = item.closest('tr');

                            console.log(row);

                            accountRemove.style.display = "flex";
                            accountRemove.style.opacity = 1;

                            const removeButton = document.querySelector('.remove-account-wrapper .remove-button');

                            const cancelButton = document.querySelector('.remove-account-wrapper .button:last-child');

                            const productId = document.querySelectorAll('.manage-accounts .products-table table tbody .account-id');

                            const removeAccountId = productId[index].textContent;

                            console.log(removeAccountId);

                            removeButton.addEventListener('click', () => {

                                fetch(`/panel/manageAccounts/removeAccount/${removeAccountId}`)

                                    .then(response => {
                                        if (response.ok) {
                                            const status = document.querySelector('.remove-account-wrapper .status-category');
                                            status.textContent = "Successfully removed Account!";
                                            status.classList.add('in-stock');

                                            const wrapper = document.querySelector('.remove-account-wrapper');

                                            row.remove();

                                            setTimeout(() => {
                                                wrapper.style.opacity = 0;
                                                setTimeout(() => {
                                                    wrapper.style.display = "none";
                                                }, 400)
                                            }, 400)

                                            console.log(removeAccountId);


                                            windows.location.reload();
                                        } else {
                                            const status = document.querySelector('.remove-account-wrapper .status-category');
                                            status.textContent = "Error removing account!";
                                            status.classList.add('out-of-stock');
                                            console.log("Failed!");
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })

                            })

                            cancelButton.addEventListener('click', () => {
                                accountRemove.style.opacity = 0;

                                setTimeout(() => {
                                    accountRemove.style.display = "none";
                                }, 400);
                            })

                        })

                    })

                    //Edit Product Button Creation with EventListeners

                    const editAccountButton = document.querySelectorAll('.manage-accounts .products-table .product-settings svg:first-child');

                    editAccountButton.forEach((item, index) => {

                        item.addEventListener('click', () => {

                            const accountEdit = document.querySelector('.account-edit');

                            accountEdit.style.display = "block";
                            accountEdit.style.opacity = 1;

                            const closeBtn = document.querySelector('.account-edit .close-btn');

                            closeBtn.addEventListener('click', () => {
                                accountEdit.style.opacity = 0;

                                setTimeout(() => {
                                    accountEdit.style.display = "none";

                                    const priceRows = document.querySelectorAll('.product-edit .product-form-price-row');
                                    for (let i = 0; i < priceRows.length; i++) {
                                        priceRows[i].remove();
                                    }

                                    const productPictures = document.querySelector('.edit-product .img-wrapper .img-box');

                                    while (productPictures.firstChild) {
                                        productPictures.removeChild(productPictures.firstChild);
                                    }
                                }, 400);
                            })

                            //Adding Data into Fields

                            const tr = item.closest('tr');
                            const accountId = tr.querySelector('.account-id');

                            const editAccountId = accountId.textContent;

                            fetch(`/panel/manageAccounts/getAccount/${editAccountId}`)
                                .then(response => response.json())
                                .then((dat) => {

                                    const editName = document.querySelector('.account-edit .account-form-username');
                                    const editEmail = document.querySelector('.account-edit .account-form-email');

                                    console.log(editName);
                                    editName.value = dat[0].user_name;
                                    editEmail.value = dat[0].user_email;

                                    const accountRoleWrapper = document.querySelector('.account-edit .edit-account .account-role-wrapper');

                                    const select = document.createElement('select');
                                    select.name = "role";
                                    select.classList.add('account-role');

                                    data.forEach((item) => {

                                        const option = document.createElement('option');
                                        option.setAttribute('value', item);
                                        option.textContent = item;
                                        select.appendChild(option);

                                    })

                                    const optionToSelect = Array.from(select.options).find((option) => option.value === dat[0].account_role);
                                    select.selectedIndex = Array.from(select.options).indexOf(optionToSelect);

                                    accountRoleWrapper.appendChild(select);


                                    const confirmEditButton = document.querySelector('.account-edit .edit-account .edit-button');

                                    confirmEditButton.addEventListener('click', () => {

                                        const formData = new FormData();

                                        const accountId = dat[0].id;

                                        const username = editName.value;
                                        const email = editEmail.value;

                                        const role = document.querySelector('.account-edit .edit-account .account-role');

                                        const accountRole = role.value;

                                        console.log(accountId, username, email, accountRole);

                                        if (validateEmail(email)) {



                                            formData.append('id', accountId);
                                            formData.append('username', username);
                                            formData.append('email', email);
                                            formData.append('role', accountRole);


                                            console.log(formData);

                                            fetch('/panel/manageAccounts/editAccount', {
                                                method: 'POST',
                                                body: formData
                                            })
                                                .then(response => {
                                                    if (response.ok) {
                                                        alert('Account edited successfully!');

                                                        accountEdit.style.opacity = 0;

                                                        setTimeout(() => {
                                                            accountEdit.style.display = "none";

                                                        }, 400);

                                                    } else {
                                                        alert('Error editing Account!');
                                                    }
                                                })
                                                .catch(err => console.log(err));

                                        } else {
                                            editEmail.style.borderColor = "var(--red-color)";
                                            alert('Incorrect email format!');
                                        }

                                    });
                                })
                                .catch(err => console.log(err));

                        })

                    })

                    const addAccountButton = document.querySelector('.add-an-account');

                    addAccountButton.addEventListener('click', () => {

                        const accountCreation = document.querySelector('.account-creation');

                        accountCreation.style.display = "block";
                        accountCreation.style.opacity = 1;

                        const closeBtn = document.querySelector('.account-creation .close-btn');

                        closeBtn.addEventListener('click', () => {
                            accountCreation.style.opacity = 0;

                            setTimeout(() => {
                                accountCreation.style.display = "none";
                            }, 400);
                        })

                        const createAccountBtn = document.querySelector('.account-creation .creation-button');

                        createAccountBtn.addEventListener('click', handleAccountCreation);

                    })

                })

            areAccountsAdded = true;
        }

    })

    const backupDataBtn = document.querySelector('.backup-btn');

    backupDataBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/panel/createBackup');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;

            const contentDispositionHeader = response.headers.get('Content-Disposition');

            const fileName = contentDispositionHeader.match(/filename="([^"]+)"/);

            a.download = fileName[1];
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        }

    })

    function handleAccountCreation() {

        const emailField = document.querySelector('.create-account .account-form-email');
        const role = document.querySelector('.create-account .account-role');

        console.log(emailField.value);
        console.log(role.value);

        if (!validateEmail(emailField.value)) {
            alert('Insert a valid email address!');
        } else {

            const formData = new FormData();

            formData.append('email', emailField.value);
            formData.append('role', role.value);

            fetch('/panel/manageAccounts/createAccount', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Successfully created account!')
                    } else {
                        response.json().then((data) => {
                            alert(data.message);
                        })
                    }
                })

        }

    }

    function addPriceSizeHandlerEdit(data, item) {

        sizeIds.push(item);
        const productPriceWrapper = document.querySelector('.product-edit .product-form-price-wrapper');
        const wrapper = document.createElement('div');
        wrapper.classList.add('product-form-price-row');

        const input = document.createElement('input');
        input.classList.add('product-form-price');
        input.placeholder = "ex. 399.99";
        input.setAttribute('required', true);
        input.setAttribute('type', 'number');
        input.value = item.product_price;

        const inputDiv = document.createElement('div');
        inputDiv.classList.add('input-wrapper');
        const inputTitle = document.createElement('p');
        inputTitle.textContent = "Price";

        inputDiv.appendChild(inputTitle);
        inputDiv.appendChild(input);

        const input1 = document.createElement('input');
        input1.classList.add('product-form-price-reduced');
        input1.placeholder = "ex. 399.99";
        input1.setAttribute('type', 'number');
        input1.value = item.product_price_reduced;

        const input1Div = document.createElement('div');
        input1Div.classList.add('input-wrapper');
        const input1Title = document.createElement('p');
        input1Title.textContent = "Reduced Price";

        input1Div.appendChild(input1Title);
        input1Div.appendChild(input1);

        const sizeWrapper = document.createElement('div');
        sizeWrapper.classList.add('product-size-wrapper');

        const select = document.createElement('select');
        select.name = "size";
        select.classList.add('product-size');

        data.sizes.forEach((item) => {

            const option = document.createElement('option');
            option.setAttribute('value', item.size_value);
            option.textContent = item.size_value;
            select.appendChild(option);
        })

        const optionToSelect = Array.from(select.options).find((option) => option.value === item.size_value);
        select.selectedIndex = Array.from(select.options).indexOf(optionToSelect);

        const option = document.createElement('option');
        option.setAttribute('value', 'remove-size');
        option.textContent = 'Remove a size';

        select.appendChild(option);
        const option1 = document.createElement('option');
        option1.setAttribute('value', 'add-size');
        option1.textContent = 'Add a size';

        select.appendChild(option1);
        sizeWrapper.appendChild(select);

        const sizeDiv = document.createElement('div');
        sizeDiv.classList.add('add-product');
        sizeDiv.classList.add('add-size');

        const div = document.createElement('div');
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("viewBox", "0 0 20 20");
        svg.setAttribute("fill", "none");

        // Create path element
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M10 17.5C8.62167 17.5 7.5 16.3783 7.5 15L7.54417 12.4558L5.015 12.5C3.62167 12.5 2.5 11.3783 2.5 10C2.5 8.62167 3.62167 7.5 5 7.5L7.54417 7.455L7.5 5.015C7.5 3.62167 8.62167 2.5 10 2.5C11.3783 2.5 12.5 3.62167 12.5 5L12.5458 7.455L15.015 7.5C16.3783 7.5 17.5 8.62167 17.5 10C17.5 11.3783 16.3783 12.5 15 12.5L12.5458 12.4558L12.5 15.015C12.5 16.3783 11.3783 17.5 10 17.5ZM9.16667 10.8333V15.015C9.16667 15.4592 9.54083 15.8333 10 15.8333C10.4592 15.8333 10.8333 15.4592 10.8333 15V10.8333H15.015C15.4592 10.8333 15.8333 10.4592 15.8333 10C15.8333 9.54083 15.4592 9.16667 15 9.16667H10.8333V5C10.8333 4.52583 10.4592 4.16667 10 4.16667C9.54083 4.16667 9.16667 4.54083 9.16667 5V9.16667H5C4.52583 9.16667 4.16667 9.54083 4.16667 10C4.16667 10.4592 4.54083 10.8333 5 10.8333H9.16667Z");
        path.setAttribute("fill", "#67A329");


        const sizeDiv1 = document.createElement('div');
        sizeDiv1.classList.add('add-product');
        sizeDiv1.classList.add('remove-size');

        const div1 = document.createElement('div');

        const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg1.setAttribute("width", "20");
        svg1.setAttribute("height", "20");
        svg1.setAttribute("viewBox", "0 0 24 25");
        svg1.setAttribute("fill", "none");

        // Create path element
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M18 16.5H6C4.346 16.5 3 15.154 3 13.5C3 11.846 4.346 10.5 6 10.5H18C19.654 10.5 21 11.846 21 13.5C21 15.154 19.654 16.5 18 16.5ZM6 12.5C5.449 12.5 5 12.949 5 13.5C5 14.051 5.449 14.5 6 14.5H18C18.551 14.5 19 14.051 19 13.5C19 12.949 18.551 12.5 18 12.5H6Z");
        path1.setAttribute("fill", "#67A329");

        // Append path to the SVG element
        svg.appendChild(path);
        svg1.appendChild(path1);

        div1.appendChild(svg1);
        div.appendChild(svg);
        sizeDiv1.appendChild(div1);
        sizeDiv.appendChild(div);

        wrapper.appendChild(inputDiv);
        wrapper.appendChild(input1Div);
        wrapper.appendChild(sizeWrapper);
        wrapper.appendChild(sizeDiv);
        wrapper.appendChild(sizeDiv1);
        productPriceWrapper.appendChild(wrapper);

        input.addEventListener('input', () => {
            handleInputChange(input);
        });
        input1.addEventListener('input', () => {
            handleInputChange(input1);
        });
        select.addEventListener('change', () => {
            handleInputChange(select);
        });

        sizeDiv.addEventListener('click', () => {
            addPriceSizeHandlerCreate(data, sizeDiv);
        });

        sizeDiv1.addEventListener('click', () => {
            removePriceHandler(sizeDiv1, productPriceWrapper);
        })

        const buttons = document.querySelectorAll('.product-edit .product-form-price-wrapper .add-size');
        const buttonToRemove = document.querySelectorAll('.product-edit .product-form-price-wrapper .remove-size');
        buttonToRemove[0].style.display = "none";
        for (let i = 0; i < buttons.length - 1; i++) {
            buttons[i].style.display = "none";
        }

    }

    function handleInputChange(input) {

        const parent = input.closest('.product-form-price-row');
        parent.classList.add('changed');

    }

    function addPriceSizeHandlerCreate(data, button) {

        button.style.display = "none";
        const productPriceWrapper = button.closest('.product-form-price-wrapper');
        const wrapper = document.createElement('div');
        wrapper.classList.add('product-form-price-row');

        const input = document.createElement('input');
        input.classList.add('product-form-price');
        input.placeholder = "ex. 399.99";
        input.setAttribute('required', true);
        input.setAttribute('type', 'number');

        const inputDiv = document.createElement('div');
        inputDiv.classList.add('input-wrapper');
        const inputTitle = document.createElement('p');
        inputTitle.textContent = "Price";

        inputDiv.appendChild(inputTitle);
        inputDiv.appendChild(input);

        const input1 = document.createElement('input');
        input1.classList.add('product-form-price-reduced');
        input1.setAttribute('type', 'number');
        input1.placeholder = "ex. 399.99";

        const input1Div = document.createElement('div');
        input1Div.classList.add('input-wrapper');
        const input1Title = document.createElement('p');
        input1Title.textContent = "Reduced Price";

        input1Div.appendChild(input1Title);
        input1Div.appendChild(input1);

        const sizeWrapper = document.createElement('div');
        sizeWrapper.classList.add('product-size-wrapper');

        const select = document.createElement('select');
        select.name = "size";
        select.classList.add('product-size');

        data.sizes.forEach((item) => {

            const option = document.createElement('option');
            option.setAttribute('value', item.size_value);
            option.textContent = item.size_value;
            select.appendChild(option);
        })

        const option = document.createElement('option');
        option.setAttribute('value', 'remove-size');
        option.textContent = 'Remove a size';

        select.appendChild(option);
        const option1 = document.createElement('option');
        option1.setAttribute('value', 'add-size');
        option1.textContent = 'Add a size';

        select.appendChild(option1);
        sizeWrapper.appendChild(select);

        const sizeDiv = document.createElement('div');
        sizeDiv.classList.add('add-product');
        sizeDiv.classList.add('add-size');

        const div = document.createElement('div');
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("viewBox", "0 0 20 20");
        svg.setAttribute("fill", "none");

        // Create path element
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M10 17.5C8.62167 17.5 7.5 16.3783 7.5 15L7.54417 12.4558L5.015 12.5C3.62167 12.5 2.5 11.3783 2.5 10C2.5 8.62167 3.62167 7.5 5 7.5L7.54417 7.455L7.5 5.015C7.5 3.62167 8.62167 2.5 10 2.5C11.3783 2.5 12.5 3.62167 12.5 5L12.5458 7.455L15.015 7.5C16.3783 7.5 17.5 8.62167 17.5 10C17.5 11.3783 16.3783 12.5 15 12.5L12.5458 12.4558L12.5 15.015C12.5 16.3783 11.3783 17.5 10 17.5ZM9.16667 10.8333V15.015C9.16667 15.4592 9.54083 15.8333 10 15.8333C10.4592 15.8333 10.8333 15.4592 10.8333 15V10.8333H15.015C15.4592 10.8333 15.8333 10.4592 15.8333 10C15.8333 9.54083 15.4592 9.16667 15 9.16667H10.8333V5C10.8333 4.52583 10.4592 4.16667 10 4.16667C9.54083 4.16667 9.16667 4.54083 9.16667 5V9.16667H5C4.52583 9.16667 4.16667 9.54083 4.16667 10C4.16667 10.4592 4.54083 10.8333 5 10.8333H9.16667Z");
        path.setAttribute("fill", "#67A329");


        const sizeDiv1 = document.createElement('div');
        sizeDiv1.classList.add('add-product');
        sizeDiv1.classList.add('remove-size');
        sizeDiv1.classList.add('temp');
        wrapper.classList.add('temp');


        const div1 = document.createElement('div');

        const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg1.setAttribute("width", "20");
        svg1.setAttribute("height", "20");
        svg1.setAttribute("viewBox", "0 0 24 25");
        svg1.setAttribute("fill", "none");

        // Create path element
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M18 16.5H6C4.346 16.5 3 15.154 3 13.5C3 11.846 4.346 10.5 6 10.5H18C19.654 10.5 21 11.846 21 13.5C21 15.154 19.654 16.5 18 16.5ZM6 12.5C5.449 12.5 5 12.949 5 13.5C5 14.051 5.449 14.5 6 14.5H18C18.551 14.5 19 14.051 19 13.5C19 12.949 18.551 12.5 18 12.5H6Z");
        path1.setAttribute("fill", "#67A329");

        // Append path to the SVG element
        svg.appendChild(path);
        svg1.appendChild(path1);

        div1.appendChild(svg1);
        div.appendChild(svg);
        sizeDiv1.appendChild(div1);
        sizeDiv.appendChild(div);

        wrapper.appendChild(inputDiv);
        wrapper.appendChild(input1Div);
        wrapper.appendChild(sizeWrapper);
        wrapper.appendChild(sizeDiv);
        wrapper.appendChild(sizeDiv1);
        productPriceWrapper.appendChild(wrapper);

        sizeDiv.addEventListener('click', () => {
            addPriceSizeHandlerCreate(data, sizeDiv);
        })

        sizeDiv1.addEventListener('click', () => {
            removePriceHandler(sizeDiv1, productPriceWrapper);
        })
    }

    function removePriceHandler(button, wrapper) {

        const parent = button.closest('.product-form-price-row');

        const siblings = document.querySelectorAll('.product-form-price-row');

        const index = Array.from(siblings).indexOf(parent);

        console.log(index - 1);

        sizeIds.splice(index - 1);

        console.log(sizeIds);

        const priceValue = parent.querySelector('.product-form-price').value;
        const priceReducedValue = parent.querySelector('.product-form-price-reduced').value;
        const sizeValue = parent.querySelector('.product-size').value;

        console.log(priceValue);
        console.log(sizeValue);

        if (button.classList.contains('temp')) {
            parent.remove();
        } else {
            removePrices.push({ price: priceValue, priceReduced: priceReducedValue, size: sizeValue });
            parent.remove();
            console.log(removePrices);
        }
        const buttons = wrapper.querySelectorAll('.add-size');
        console.log(buttons);
        const buttonToAdd = buttons[buttons.length - 1];
        console.log(buttonToAdd);
        buttonToAdd.style.display = "flex";
        const buttonToRemove = wrapper.querySelectorAll('.remove-size');
        buttonToRemove[0].style.display = "none";
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

        select = document.querySelectorAll('.product-size-wrapper .product-size');

        select.forEach((item) => {

            const option = document.createElement('option');
            option.setAttribute('value', data.size);
            option.textContent = data.size;
            item.appendChild(option);

            const optionToRemove = Array.from(item.options).find((option) => option.value === 'remove-size');
            const optionToRemove1 = Array.from(item.options).find((option) => option.value === 'add-size');

            item.removeChild(optionToRemove);
            item.removeChild(optionToRemove1);

            const option1 = document.createElement('option');
            option1.setAttribute('value', 'remove-size');
            option1.textContent = 'Remove a size';
            item.appendChild(option1);

            const option2 = document.createElement('option');
            option2.setAttribute('value', 'add-size');
            option2.textContent = 'Add a size';
            item.appendChild(option2);


        })



        const addSizeWrapper = document.querySelector('.add-size-wrapper');

        setTimeout(() => {

            addSizeWrapper.style.opacity = 0;

            setTimeout(() => {
                addSizeWrapper.style.display = "none";
            }, 400);

        }, 800);

    }

    function removeSizeHandler(event) {

        const sizes = document.querySelectorAll('.remove-size-inputs div input');

        const selectContainer = document.querySelectorAll('.product-size-wrapper .product-size');

        const removeSizes = [];

        sizes.forEach((item) => {
            if (item.checked) {
                removeSizes.push(item.value)

                selectContainer.forEach((container) => {
                    const optionToRemove = Array.from(container.options).find((option) => option.value === item.value);
                    container.removeChild(optionToRemove);
                })
            }
        })

        const formData = new FormData();

        for (i = 0; i < removeSizes.length; i++) {
            console.log(removeSizes[i]);
            formData.append('sizes', removeSizes[i]);
        }

        console.log(formData);

        fetch('/panel/products/removeSizes', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                formData.delete('sizes');
                const status = document.querySelector('.remove-size-wrapper .status-size');
                if (response.ok) {
                    status.textContent = "Successfully removed!";
                    status.classList.add('in-stock');
                    status.classList.remove('out-of-stock');
                } else {
                    status.textContent = "Error removing sizes!";
                    status.classList.remove('in-stock');
                    status.classList.add('out-of-stock');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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

    function removeCategoryHandler(event) {
        const categories = document.querySelectorAll('.remove-category-inputs div input');

        const removeCategories = [];

        categories.forEach((item) => {
            if (item.checked) {
                removeCategories.push(item.value);
            }
        });

        removeCategories.forEach((value) => {
            const inputToRemove = document.querySelector(`.product-category-wrapper div input[value="${value}"]`);

            if (inputToRemove) {
                const div = inputToRemove.closest('div');
                div.parentNode.removeChild(div);
            }
        });

        const formData = new FormData();

        for (i = 0; i < removeCategories.length; i++) {
            console.log(removeCategories[i]);
            formData.append('categories', removeCategories[i]);
        }

        console.log(formData);

        fetch('/panel/products/removeCategories', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                const status = document.querySelector('.remove-category-wrapper .status-category');
                if (response.ok) {
                    status.textContent = "Successfully removed!";
                    status.classList.add('in-stock');
                    status.classList.remove('out-of-stock');
                    setTimeout(() => {

                        const wrapper = document.querySelector('.remove-category-wrapper');

                        wrapper.style.opacity = 0;

                        setTimeout(() => {

                            wrapper.style.display = "none";

                        }, 400)


                    }, 400);
                } else {
                    status.textContent = "Error removing sizes!";
                    status.classList.remove('in-stock');
                    status.classList.add('out-of-stock');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });



    }


    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    }

    const sendNewsletter = document.querySelector('.newsletter .newsletter-form .creation-button');

    sendNewsletter.addEventListener('click', () => {
        const content = document.getElementById('newsletterFile')

        if (content.files.length > 0) {
            const fr = new FileReader();

            fr.onload = function () {
                // The content of the file is available in fr.result
                const fileContent = fr.result;

                const formData = new FormData();

                const title = document.querySelector('.newsletter-form .newsletter-form-title');

                console.log(fileContent);

                formData.append('newsletter', fileContent);
                formData.append('title', title.value);

                fetch('/panel/newsletter/sendNewsletter', {
                    method: 'POST',
                    body: formData
                })
                    .then(() => {
                        console.log("success");
                    })
                    .catch(err => console.log(err))
            };

            // Read the content of the selected file as text
            fr.readAsText(content.files[0]);
        } else {
            console.warn("No file selected");
        }

    })


})