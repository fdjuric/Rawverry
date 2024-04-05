document.addEventListener('DOMContentLoaded', () => {


    fetch('/getBlogs')
        .then(response => response.json())
        .then(data => {
            console.log(data)

            const blogMain = document.querySelector('.blog-wrapper .blog-row1');
            const blogSec = document.querySelector('.blog-wrapper .blog-row2');

            data.forEach((item, index) => {

                if (index < 2) {

                    // Create blog entry container
                    const blogEntry = document.createElement('div');
                    blogEntry.classList.add('blog-entry');

                    // Create image wrapper
                    const imageWrapper = document.createElement('div');
                    imageWrapper.classList.add('image-wrapper');

                    // Create image element
                    const image = document.createElement('img');
                    image.classList.add('blog-image');
                    image.src = item.image_url;

                    // Append image to image wrapper
                    imageWrapper.appendChild(image);

                    // Create additional wrapper
                    const additionalWrapper = document.createElement('div');
                    additionalWrapper.classList.add('additional-wrapper');

                    // Create author wrapper
                    const authorWrapper = document.createElement('div');
                    authorWrapper.classList.add('author-wrapper');

                    // Create account picture
                    const accountPicture = document.createElement('div');
                    accountPicture.classList.add('account-picture');
                    if (item.author_picture === null)
                        accountPicture.innerHTML = `<svg class="acc-default" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" style="display: block;">
                            <path d="M17.4987 17.5C15.8945 17.5 14.5213 16.9288 13.3789 15.7864C12.2365 14.6441 11.6654 13.2708 11.6654 11.6666C11.6654 10.0625 12.2365 8.68922 13.3789 7.54685C14.5213 6.40449 15.8945 5.83331 17.4987 5.83331C19.1029 5.83331 20.4761 6.40449 21.6185 7.54685C22.7609 8.68922 23.332 10.0625 23.332 11.6666C23.332 13.2708 22.7609 14.6441 21.6185 15.7864C20.4761 16.9288 19.1029 17.5 17.4987 17.5ZM5.83203 29.1666V25.0833C5.83203 24.2569 6.04495 23.4971 6.47078 22.8039C6.89661 22.1107 7.46148 21.5823 8.16536 21.2187C9.67231 20.4653 11.2036 19.8999 12.7591 19.5227C14.3147 19.1455 15.8945 18.9573 17.4987 18.9583C19.1029 18.9583 20.6827 19.1469 22.2383 19.5241C23.7938 19.9014 25.3251 20.4662 26.832 21.2187C27.5369 21.5833 28.1022 22.1122 28.5281 22.8054C28.9539 23.4986 29.1663 24.2579 29.1654 25.0833V29.1666H5.83203ZM8.7487 26.25H26.2487V25.0833C26.2487 24.816 26.1816 24.5729 26.0474 24.3541C25.9133 24.1354 25.7373 23.9653 25.5195 23.8437C24.207 23.1875 22.8824 22.6955 21.5456 22.3679C20.2088 22.0403 18.8598 21.876 17.4987 21.875C16.1376 21.875 14.7886 22.0393 13.4518 22.3679C12.115 22.6965 10.7904 23.1885 9.47786 23.8437C9.25911 23.9653 9.08266 24.1354 8.94849 24.3541C8.81432 24.5729 8.74773 24.816 8.7487 25.0833V26.25ZM17.4987 14.5833C18.3008 14.5833 18.9877 14.2975 19.5593 13.7258C20.131 13.1541 20.4163 12.4678 20.4154 11.6666C20.4154 10.8646 20.1295 10.1777 19.5579 9.60602C18.9862 9.03435 18.2998 8.74901 17.4987 8.74998C16.6966 8.74998 16.0097 9.03581 15.4381 9.60748C14.8664 10.1791 14.5811 10.8655 14.582 11.6666C14.582 12.4687 14.8679 13.1556 15.4395 13.7273C16.0112 14.2989 16.6976 14.5843 17.4987 14.5833Z" fill="var(--accent-color)"></path>
                        </svg>`;
                    else {
                        const authorPic = document.createElement('img');
                        authorPic.src = item.author_picture;
                    }

                    // Create author name
                    const authorName = document.createElement('p');
                    authorName.classList.add('author-name');
                    authorName.textContent = item.author;

                    // Append account picture and author name to author wrapper
                    authorWrapper.appendChild(accountPicture);
                    authorWrapper.appendChild(authorName);

                    // Create date wrapper
                    const dateWrapper = document.createElement('div');
                    dateWrapper.classList.add('date-wrapper');

                    // Create date icon
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svg.setAttribute("width", "24");
                    svg.setAttribute("height", "25");
                    svg.setAttribute("viewBox", "0 0 24 25");
                    svg.setAttribute("fill", "none");

                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M8 14.5C7.71667 14.5 7.479 14.404 7.287 14.212C7.095 14.02 6.99933 13.7827 7 13.5C7 13.2167 7.096 12.979 7.288 12.787C7.48 12.595 7.71733 12.4993 8 12.5C8.28333 12.5 8.521 12.596 8.713 12.788C8.905 12.98 9.00067 13.2173 9 13.5C9 13.7833 8.904 14.021 8.712 14.213C8.52 14.405 8.28267 14.5007 8 14.5ZM12 14.5C11.7167 14.5 11.479 14.404 11.287 14.212C11.095 14.02 10.9993 13.7827 11 13.5C11 13.2167 11.096 12.979 11.288 12.787C11.48 12.595 11.7173 12.4993 12 12.5C12.2833 12.5 12.521 12.596 12.713 12.788C12.905 12.98 13.0007 13.2173 13 13.5C13 13.7833 12.904 14.021 12.712 14.213C12.52 14.405 12.2827 14.5007 12 14.5ZM16 14.5C15.7167 14.5 15.479 14.404 15.287 14.212C15.095 14.02 14.9993 13.7827 15 13.5C15 13.2167 15.096 12.979 15.288 12.787C15.48 12.595 15.7173 12.4993 16 12.5C16.2833 12.5 16.521 12.596 16.713 12.788C16.905 12.98 17.0007 13.2173 17 13.5C17 13.7833 16.904 14.021 16.712 14.213C16.52 14.405 16.2827 14.5007 16 14.5ZM3 22.5V4.5H6V2.5H8V4.5H16V2.5H18V4.5H21V22.5H3ZM5 20.5H19V10.5H5V20.5Z");
                    path.setAttribute("fill", "#67A329");

                    svg.appendChild(path);


                    // Create date
                    const date = document.createElement('p');
                    date.classList.add('date');
                    date.textContent = formatDate(item.updated_at);

                    // Append date icon and date to date wrapper
                    dateWrapper.appendChild(svg);
                    dateWrapper.appendChild(date);

                    // Append author wrapper and date wrapper to additional wrapper
                    additionalWrapper.appendChild(authorWrapper);
                    additionalWrapper.appendChild(dateWrapper);

                    // Create blog name
                    const blogName = document.createElement('h1');
                    blogName.classList.add('blog-name');
                    blogName.textContent = item.title;

                    // Create blog description
                    const blogDescription = document.createElement('p');
                    blogDescription.classList.add('blog-description');
                    blogDescription.textContent = item.description;

                    // Append all elements to blog entry container
                    blogEntry.appendChild(imageWrapper);
                    blogEntry.appendChild(additionalWrapper);
                    blogEntry.appendChild(blogName);
                    blogEntry.appendChild(blogDescription);

                    // Append blog entry container to the document body or any other desired parent element
                    blogMain.appendChild(blogEntry);

                    blogEntry.addEventListener('click', () => {
                       window.location.href = `/blog/${item.title}`; 
                    })

                } else {

                    // Create blog entry container
                    const blogEntry = document.createElement('div');
                    blogEntry.classList.add('blog-entry');

                    // Create image wrapper
                    const imageWrapper = document.createElement('div');
                    imageWrapper.classList.add('image-wrapper');

                    // Create image element
                    const image = document.createElement('img');
                    image.classList.add('blog-image');
                    image.src = item.image_url;

                    // Append image to image wrapper
                    imageWrapper.appendChild(image);

                    // Create additional wrapper
                    const additionalWrapper = document.createElement('div');
                    additionalWrapper.classList.add('additional-wrapper');

                    // Create author wrapper
                    const authorWrapper = document.createElement('div');
                    authorWrapper.classList.add('author-wrapper');

                    // Create account picture
                    const accountPicture = document.createElement('div');
                    accountPicture.classList.add('account-picture');
                    if (item.author_picture === null)
                        accountPicture.innerHTML = `<svg class="acc-default" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" style="display: block;">
                             <path d="M17.4987 17.5C15.8945 17.5 14.5213 16.9288 13.3789 15.7864C12.2365 14.6441 11.6654 13.2708 11.6654 11.6666C11.6654 10.0625 12.2365 8.68922 13.3789 7.54685C14.5213 6.40449 15.8945 5.83331 17.4987 5.83331C19.1029 5.83331 20.4761 6.40449 21.6185 7.54685C22.7609 8.68922 23.332 10.0625 23.332 11.6666C23.332 13.2708 22.7609 14.6441 21.6185 15.7864C20.4761 16.9288 19.1029 17.5 17.4987 17.5ZM5.83203 29.1666V25.0833C5.83203 24.2569 6.04495 23.4971 6.47078 22.8039C6.89661 22.1107 7.46148 21.5823 8.16536 21.2187C9.67231 20.4653 11.2036 19.8999 12.7591 19.5227C14.3147 19.1455 15.8945 18.9573 17.4987 18.9583C19.1029 18.9583 20.6827 19.1469 22.2383 19.5241C23.7938 19.9014 25.3251 20.4662 26.832 21.2187C27.5369 21.5833 28.1022 22.1122 28.5281 22.8054C28.9539 23.4986 29.1663 24.2579 29.1654 25.0833V29.1666H5.83203ZM8.7487 26.25H26.2487V25.0833C26.2487 24.816 26.1816 24.5729 26.0474 24.3541C25.9133 24.1354 25.7373 23.9653 25.5195 23.8437C24.207 23.1875 22.8824 22.6955 21.5456 22.3679C20.2088 22.0403 18.8598 21.876 17.4987 21.875C16.1376 21.875 14.7886 22.0393 13.4518 22.3679C12.115 22.6965 10.7904 23.1885 9.47786 23.8437C9.25911 23.9653 9.08266 24.1354 8.94849 24.3541C8.81432 24.5729 8.74773 24.816 8.7487 25.0833V26.25ZM17.4987 14.5833C18.3008 14.5833 18.9877 14.2975 19.5593 13.7258C20.131 13.1541 20.4163 12.4678 20.4154 11.6666C20.4154 10.8646 20.1295 10.1777 19.5579 9.60602C18.9862 9.03435 18.2998 8.74901 17.4987 8.74998C16.6966 8.74998 16.0097 9.03581 15.4381 9.60748C14.8664 10.1791 14.5811 10.8655 14.582 11.6666C14.582 12.4687 14.8679 13.1556 15.4395 13.7273C16.0112 14.2989 16.6976 14.5843 17.4987 14.5833Z" fill="var(--accent-color)"></path>
                         </svg>`;
                    else {
                        const authorPic = document.createElement('img');
                        authorPic.src = item.author_picture;
                    }

                    // Create author name
                    const authorName = document.createElement('p');
                    authorName.classList.add('author-name');
                    authorName.textContent = item.author;

                    // Append account picture and author name to author wrapper
                    authorWrapper.appendChild(accountPicture);
                    authorWrapper.appendChild(authorName);

                    // Create date wrapper
                    const dateWrapper = document.createElement('div');
                    dateWrapper.classList.add('date-wrapper');

                    // Create date icon
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svg.setAttribute("width", "24");
                    svg.setAttribute("height", "25");
                    svg.setAttribute("viewBox", "0 0 24 25");
                    svg.setAttribute("fill", "none");

                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M8 14.5C7.71667 14.5 7.479 14.404 7.287 14.212C7.095 14.02 6.99933 13.7827 7 13.5C7 13.2167 7.096 12.979 7.288 12.787C7.48 12.595 7.71733 12.4993 8 12.5C8.28333 12.5 8.521 12.596 8.713 12.788C8.905 12.98 9.00067 13.2173 9 13.5C9 13.7833 8.904 14.021 8.712 14.213C8.52 14.405 8.28267 14.5007 8 14.5ZM12 14.5C11.7167 14.5 11.479 14.404 11.287 14.212C11.095 14.02 10.9993 13.7827 11 13.5C11 13.2167 11.096 12.979 11.288 12.787C11.48 12.595 11.7173 12.4993 12 12.5C12.2833 12.5 12.521 12.596 12.713 12.788C12.905 12.98 13.0007 13.2173 13 13.5C13 13.7833 12.904 14.021 12.712 14.213C12.52 14.405 12.2827 14.5007 12 14.5ZM16 14.5C15.7167 14.5 15.479 14.404 15.287 14.212C15.095 14.02 14.9993 13.7827 15 13.5C15 13.2167 15.096 12.979 15.288 12.787C15.48 12.595 15.7173 12.4993 16 12.5C16.2833 12.5 16.521 12.596 16.713 12.788C16.905 12.98 17.0007 13.2173 17 13.5C17 13.7833 16.904 14.021 16.712 14.213C16.52 14.405 16.2827 14.5007 16 14.5ZM3 22.5V4.5H6V2.5H8V4.5H16V2.5H18V4.5H21V22.5H3ZM5 20.5H19V10.5H5V20.5Z");
                    path.setAttribute("fill", "#67A329");

                    svg.appendChild(path);


                    // Append path to SVG
                    svg.appendChild(path);


                    // Create date
                    const date = document.createElement('p');
                    date.classList.add('date');
                    date.textContent = formatDate(item.updated_at);

                    // Append date icon and date to date wrapper
                    dateWrapper.appendChild(svg);
                    dateWrapper.appendChild(date);

                    // Append author wrapper and date wrapper to additional wrapper
                    additionalWrapper.appendChild(authorWrapper);
                    additionalWrapper.appendChild(dateWrapper);

                    // Create blog name
                    const blogName = document.createElement('h1');
                    blogName.classList.add('blog-name');
                    blogName.textContent = item.title;

                    // Create blog description
                    const blogDescription = document.createElement('p');
                    blogDescription.classList.add('blog-description');
                    blogDescription.textContent = item.description;

                    // Append all elements to blog entry container
                    blogEntry.appendChild(imageWrapper);
                    blogEntry.appendChild(additionalWrapper);
                    blogEntry.appendChild(blogName);
                    blogEntry.appendChild(blogDescription);

                    // Append blog entry container to the document body or any other desired parent element
                    blogSec.appendChild(blogEntry);
                }
            })


        })

    function formatDate(dateString) {
        // Split the date string by the '.' separator
        const parts = dateString.split('.');

        // Parse the day, month, and year from the parts array
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        // Create an array of month names
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Get the month name based on the month number
        const monthName = monthNames[month - 1];

        // Return the formatted date string
        return `${day} ${monthName}, ${year}`;
    }

})