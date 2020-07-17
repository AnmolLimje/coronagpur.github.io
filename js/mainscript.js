HOSTAPI = "http://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/getData";
HOSTAPI_Delta = "http://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/getDeltaData";
HOSTAPI_History = "http://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/getHistoryCollection";

body = document.querySelector("body");


/*window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: ""
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            indexLabelFontSize: 16,
            dataPoints: [
                { y: 1, indexLabel: "\u2193 lowest", markerColor: "DarkSlateGrey", markerType: "cross" },
                { y: 2 },
                { y: 10 },
                { y: 20 },
                { y: 45 },
                { y: 50 },
                { y: 48 },
                { y: 48 },
                { y: 41 },
                { y: 50 },
                { y: 121 },
                { y: 127, indexLabel: "\u2191 highest", markerColor: "red", markerType: "triangle" }
            ]
        }]
    });
    chart.render();
}*/

fetch(HOSTAPI)
    .then((response) => {
        response.json().then((data) => {
            //nagpurdata = data.Maharashtra.districtData.Nagpur;
            nagpurdata = data;
            //console.log(data);

            active = document.querySelector("#active");
            cured = document.querySelector("#cured");
            infected = document.querySelector("#infected");
            death = document.querySelector("#death");
            total = document.querySelector('#total');

            active.innerHTML = nagpurdata.active;
            cured.innerHTML = nagpurdata.recovered;
            infected.innerHTML = nagpurdata.confirmed;
            death.innerHTML = nagpurdata.deceased;
            total.innerHTML = (nagpurdata.active + nagpurdata.recovered + nagpurdata.confirmed + nagpurdata.deceased);

            //document.body.innerHTML = JSON.stringify(nagpurdata);
        })
    })

fetch(HOSTAPI_Delta)
    .then((response) => {
        response.json().then((data) => {
            nagpurdata = data;
            //console.log(data);

            //Daily New Cases
            last_update = document.querySelector("#last_update");
            infected_newcase = document.querySelector("#infected_newcase");
            cured_newcase = document.querySelector("#cured_newcase");
            death_newcase = document.querySelector("#death_newcase");

            last_update.innerHTML = "Last Updated On: " + nagpurdata.Updated;
            cured_newcase.innerHTML = nagpurdata.delta_recovered;
            infected_newcase.innerHTML = nagpurdata.delta_confirmed;
            death_newcase.innerHTML = nagpurdata.delta_deceased;

            //document.body.innerHTML = JSON.stringify(nagpurdata);

            body.style.opacity = 1;
            body.style.background = 'url(null)';
        })
    })

fetch(HOSTAPI_History)
    .then((response) => {
        response.json().then((data) => {
            nagpurdata = data;
            //console.log(data);
            _CaseDate = [];
            _deltaConfirmed = [];
            _deltaDeceased = [];
            _deltaRecovered = [];

            CaseMax = 0;
            CaseMin = 0;
            for (let index = 0; index < data.length; index++) {
                const CaseDate = data[index].CaseDate;
                const delta_confirmed = data[index].delta_confirmed;
                const delta_deceased = data[index].delta_deceased;
                const delta_recovered = data[index].delta_recovered;

                //SetMax
                if (delta_confirmed > CaseMax) {
                    CaseMax = delta_confirmed;
                }
                //SetMin
                if (delta_confirmed < CaseMin) { CaseMin = delta_confirmed; }
                //console.log(CaseDate);
                //console.log(delta_confirmed);
                _CaseDate[index] = CaseDate;
                _deltaConfirmed[index] = delta_confirmed;
                _deltaDeceased[index] = delta_deceased;
                _deltaRecovered[index] = delta_recovered;
            }

            //Confirmed Cases
            var ctx = document.getElementById('confirmed_cases').getContext("2d");
            var data = {
                labels: _CaseDate,
                datasets: [
                    {
                        label: "Confirmed Cases",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: _deltaConfirmed,
                        spanGaps: false,
                    }
                ]
            };

            var options = {
                responsive: true,
                title: {
                    display: true,
                    position: "top",
                    text: 'History of Daily Confirmed Cases',
                    fontSize: 18,
                    fontColor: "#111"
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            var multistringText = ['Confirmed Cases: ' + tooltipItems.yLabel];
                            //multistringText.push('Confirmed Cases');
                            /*multistringText.push(tooltipItems.index + 1);
                            multistringText.push('One more Item');*/
                            return multistringText;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 16
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (label, index, labels) {
                                if (Math.floor(label) === label) {
                                    return label;
                                }
                            }
                        }
                    }]

                }
            };
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });


            //Daily Death Cases
            var ctxDeath = document.getElementById('death_cases').getContext("2d");
            var dataDeath = {
                labels: _CaseDate,
                datasets: [
                    {
                        label: "Death Cases",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(219,113,113,0.4)",
                        borderColor: "rgba(219,113,113,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(219,113,113,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(219,113,113,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: _deltaDeceased,
                        spanGaps: false,
                    }
                ]
            };

            var optionsDeath = {
                responsive: true,
                title: {
                    display: true,
                    position: "top",
                    text: 'History of Daily Death Cases',
                    fontSize: 18,
                    fontColor: "#111"
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            var multistringText = ['Death Cases: ' + tooltipItems.yLabel];
                            return multistringText;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#FF0000",
                        fontSize: 16
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (label, index, labels) {
                                if (Math.floor(label) === label) {
                                    return label;
                                }
                            }
                        }
                    }]

                }
            };
            var myLineChart = new Chart(ctxDeath, {
                type: 'line',
                data: dataDeath,
                options: optionsDeath
            });


            //Daily recovered Cases
            var ctxRecovered = document.getElementById('recovered_cases').getContext("2d");
            var dataRecovered = {
                labels: _CaseDate,
                datasets: [
                    {
                        label: "Recovered Cases",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(126,223,143,0.4)",
                        borderColor: "rgba(126,223,143,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(126,223,143,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(126,223,143,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: _deltaRecovered,
                        spanGaps: false,
                    }
                ]
            };

            var optionsRecovered = {
                responsive: true,
                title: {
                    display: true,
                    position: "top",
                    text: 'History of Daily Recovered Cases',
                    fontSize: 18,
                    fontColor: "#111"
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            var multistringText = ['Recovered Cases: ' + tooltipItems.yLabel];
                            //multistringText.push('Confirmed Cases');
                            /*multistringText.push(tooltipItems.index + 1);
                            multistringText.push('One more Item');*/
                            return multistringText;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 16
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (label, index, labels) {
                                if (Math.floor(label) === label) {
                                    return label;
                                }
                            }
                        }
                    }]

                }
            };
            var myLineChart = new Chart(ctxRecovered, {
                type: 'line',
                data: dataRecovered,
                options: optionsRecovered
            });

        })
    })