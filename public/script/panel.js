document.addEventListener('DOMContentLoaded', function () {


    const ctx = document.querySelector('.sales-graph');

    const orderStatus = document.querySelector('.status-graph');

    Chart.defaults.font.family = 'Mitr';
    Chart.defaults.font.size = 16;
    Chart.defaults.font.weight = '400';
    Chart.defaults.color = '#1A1A1A';
    Chart.defaults.plugins.legend.position = 'bottom';
    //Chart.defaults.options.clip = false;

    const legendMargin = {
        id: 'legendMargin',
        beforeInit(chart, legend, options) {
            const fitValue = chart.legend.fit;
            chart.legend.fit = function fit(){
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
            clip: false
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
                    max: 1400
                }
            }
        }
    };


    new Chart(ctx, chartConfig);

    var chartDataStatus = {
        labels: ["Sales", "Pending", "Returns"],
        datasets: [{
            label: 'Value ',
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
        plugins: [legendMargin]
    };

    new Chart(orderStatus, statusChartConfig);


})