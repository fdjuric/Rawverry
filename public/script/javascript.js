document.addEventListener('DOMContentLoaded', function () {

 /* window.onload = function() {
    setTimeout(function(){
      window.scrollTo(0, 0);
    }, 0);
  } */
  fetch('/getCategory')
    .then(response => response.json())
    .then(data => {
      displayCategory(data['data']);
    })

  fetch('/sessionCount')
  .then(response => response.json());

  function displayCategory(category) {
    console.log("category:", category);
    category.forEach((item) => {
      var categoryId = document.createElement("h1");
      categoryId.textContent = item.category_id;

      var categoryName = document.createElement("h1");
      categoryName.textContent = item.category_name;

      header = document.querySelector("header");
      header.appendChild(categoryId);
      header.appendChild(categoryName);
    })
  }


  //Phone menu with animation

  var isOpen = false;

  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".phone-menu");
  const hamburgerPath1 = document.querySelector(".path1");
  const hamburgerPath2 = document.querySelector(".path2");
  const hamburgerPath3 = document.querySelector(".path3");

  hamburger.addEventListener("click", function () {
    if (!isOpen) {
      setTimeout(function () {
        menu.classList.toggle("phone-menu-open");
        hamburgerPath1.classList.toggle("path1-animate");
        hamburgerPath2.classList.toggle("path2-animate");
        hamburgerPath3.classList.toggle("path3-animate");
      }, 50);
    } else if (isOpen) {
      menu.classList.toggle("phone-menu-open");
      setTimeout(function () {
        hamburgerPath1.classList.toggle("path1-animate");
        hamburgerPath2.classList.toggle("path2-animate");
        hamburgerPath3.classList.toggle("path3-animate");

      }, 500);
    }
  })


  //Newsletter subscription with status
  const email = document.querySelector(".newsletter");
  const sub = document.querySelector(".send");
  const newsletterStatus = document.querySelector(".newsletter-status");

  sub.addEventListener('click', (event) => {
    event.preventDefault();
    const emailData = email.value;
    const newsletterStatusData = newsletterStatus.textContent;
    console.log("Status " + newsletterStatusData);
    if (validateEmail(emailData)) {
      fetch('/insertNewsletter', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailData, newsletterStatusData }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error");
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            // Do something for a successful subscription
            newsletterStatus.textContent = "Check your email to confirm!";
            newsletterStatus.classList.remove("newsletter-status-failed");
            newsletterStatus.classList.add("newsletter-status-success");
          } else {
            // Do something for an unsuccessful subscription
            newsletterStatus.textContent = "Email already exists!";
            newsletterStatus.classList.remove("newsletter-status-success");
            newsletterStatus.classList.add("newsletter-status-failed");
          }
        })
        .catch(error => {
          console.error(error);
          alert("Oops! Something went wrong. Please try again later.");
        });
    } else {
      newsletterStatus.textContent = "Invalid email address!";
      newsletterStatus.classList.remove("newsletter-status-success");
      newsletterStatus.classList.add("newsletter-status-failed");
    }
  });



  const productLink = document.querySelectorAll('.product');

  productLink.forEach((item) => {

    item.addEventListener('click', () => {
      window.location.href= '/products';
    })
  })



  //Checking if the email format is correct
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

})