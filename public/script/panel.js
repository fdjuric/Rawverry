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

        console.log(fileInput.files)

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
    }

    var toolbarOptions = [
        ['bold', 'underline'],

        [{ 'header': 1 }, ['header: 2']],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
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


    const createButton = document.querySelector('.creation-button');

    createButton.addEventListener('click', handleBlogCreation);

    createBlog.addEventListener('click', () => {

        blogCreateWrapper.style.display = "flex";

        setTimeout(() => {
            blogCreateWrapper.style.opacity = 1;
        }, 100);
    })


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


    function createTable(data) {
        const tbody = document.createElement('tbody');
        const table = document.querySelector('.blog .products-table table');

        data.forEach(blog => {
            const row = document.createElement('tr');

            // Create and populate table data (td) for each field
            const idCell = createTableCell(blog.id, 'id');
            const titleCell = createTableCell(blog.title, 'title');
            const contentCell = createTableCell(blog.content, 'content');
            const authorCell = createTableCell(blog.author, 'author');
            const createDateCell = createTableCell(blog.created_at, 'create-date');
            const changedDateCell = createTableCell(blog.updated_at, 'changed-date');

            // Append table data to the table row
            row.appendChild(idCell);
            row.appendChild(titleCell);
            row.appendChild(contentCell);
            row.appendChild(authorCell);
            row.appendChild(createDateCell);
            row.appendChild(changedDateCell);

            // Append the row to the table body
            tbody.appendChild(row);
        });

        table.appendChild(tbody);


    }
    function createTableCell(value, className) {
        const cell = document.createElement('td');
        cell.classList.add(className);
    
        const paragraph = document.createElement('p');
        paragraph.textContent = value;
    
        cell.appendChild(paragraph);
        return cell;
    }
        function handleBlogCreation(event) {
            let contentWithTags = getTextWithTags();
            console.log(contentWithTags); // Output: All text with <p> and <h1> tags


            const blogFormTitle = document.querySelector('.blog-creation .blog-form-title');

            const author = document.querySelector('.welcome-name');

            const xhr = new XMLHttpRequest();

            xhr.open('POST', '/panel/blog/createBlog', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onload = () => {
                if (xhr.status === 200) {
                    alert('Blog created succesfully');
                } else {
                    alert('Error creating Blog');
                }
            };

            xhr.send(`title=${encodeURIComponent(blogFormTitle.value)}&content=${encodeURIComponent(contentWithTags)}&author=${encodeURIComponent(author.textContent.trim())}`);

        }

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



    })