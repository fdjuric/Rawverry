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

    function uploadFile(){
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
})