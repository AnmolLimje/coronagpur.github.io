//Deployment
HOSTAPI = "https://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/getData";
HOSTAPI_Delta = "https://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/getDeltaData";
HOSTAPI_History = "https://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/getHistoryCollection";

HOSTAPI_NMC_TodayCase = "https://anmolhub.online/service/wcf/CoroNagpurOfficial/CoroNagpur/getTodayCases";
HOSTAPI_NMC_AreaWise = "https://anmolhub.online/service/wcf/CoroNagpurOfficial/CoroNagpur/getAreaWiseCasesList";

//Debugging
//HOSTAPI = "http://localhost:50385/CoronavirusIndia.svc/getData";
//HOSTAPI_Delta = "http://localhost:50385/CoronavirusIndia.svc/getDeltaData";
//HOSTAPI_History = "http://localhost:50385/CoronavirusIndia.svc/getHistoryCollection";

body = document.querySelector("body");

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
            //total = document.querySelector('#total');

            active.innerHTML = nagpurdata.active;
            cured.innerHTML = nagpurdata.recovered;
            infected.innerHTML = nagpurdata.confirmed;
            death.innerHTML = nagpurdata.deceased;
            //total.innerHTML = (nagpurdata.active + nagpurdata.recovered + nagpurdata.confirmed + nagpurdata.deceased);

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

            message = "Last Updated On: ";
            if (nagpurdata.Updated == null) {
                message = "Not Updated Yet";
            } else {
                message += nagpurdata.Updated;
            }
            last_update.innerHTML = message;
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

fetch(HOSTAPI_NMC_TodayCase)
    .then((response) => {
        response.json().then((data) => {
            nagpurdata = data;
            //console.log(data);

            total_active = document.querySelector("#nmc_total_active");
            positive = document.querySelector("#nmc_positive");
            recovered = document.querySelector("#nmc_recovered");
            negative = document.querySelector("#nmc_negative");
            death = document.querySelector('#nmc_death');
            positive_commulative = document.querySelector("#nmc_positive_commulative");
            recovered_commulative = document.querySelector("#nmc_recovered_commulative");
            negative_commulative = document.querySelector("#nmc_negative_commulative");
            death_commulative = document.querySelector("#nmc_death_commulative");
            update = document.querySelector("#nmc_last_update");

            total_active.innerHTML = nagpurdata.TOTAL_ACTIVE;
            positive.innerHTML = nagpurdata.TODAY_POSITIVES;
            recovered.innerHTML = nagpurdata.TODAY_RECOVERED;
            negative.innerHTML = nagpurdata.TODAY_NEGATIVES;
            death.innerHTML = nagpurdata.TODAY_DEATHS;
            positive_commulative.innerHTML = nagpurdata.TOTAL_POSITIVES_COMMULATIVE;
            recovered_commulative.innerHTML = nagpurdata.TOTAL_RECOVERED_COMMULATIVE;
            negative_commulative.innerHTML = nagpurdata.TOTAL_NEGATIVES_COMMULATIVE;
            death_commulative.innerHTML = nagpurdata.TOTAL_DEATHS_COMMULATIVE;
            update.innerHTML += ": " + nagpurdata.UPDATED_DATE;
        })
    })

fetch(HOSTAPI_NMC_AreaWise)
    .then((response) => {
        response.json().then((data) => {
            nagpurdata = data;
            pieLabels=[];
            pieDatas=[];
            //console.log(data);
            tableBody = document.querySelector("#areaWiseData");
            for (let index = 0; index < nagpurdata.length; index++) {
                pieLabels[index]=nagpurdata[index].AREA_NAME;
                pieDatas[index]=nagpurdata[index].ACTIVE;
                //console.log(nagpurdata[index]);
                tableBody.innerHTML += "<tr>"
                    + "<th scope='row'><span class='table - td - title'>" + nagpurdata[index].AREA_NAME + "</th>"
                    + "<td><span class='table - td - title'>" + nagpurdata[index].ACTIVE + "</td>"
                    + "<td><span class='table - td - title'>" + nagpurdata[index].TOTAL_DEATH + "</td>"
                    + "<td><span class='table - td - title'>" + nagpurdata[index].TOTAL_RECOVERED + "</td>"
                    + "</tr>";
            }

            // For a Doughnut chart
            Chart.pluginService.register({
                beforeDraw: function(chart) {
                  if (chart.config.options.elements.center) {
                    // Get ctx from string
                    var ctx = chart.chart.ctx;
              
                    // Get options from the center object in options
                    var centerConfig = chart.config.options.elements.center;
                    var fontStyle = centerConfig.fontStyle || 'Arial';
                    var txt = centerConfig.text;
                    var color = centerConfig.color || '#000';
                    var maxFontSize = centerConfig.maxFontSize || 75;
                    var sidePadding = centerConfig.sidePadding || 20;
                    var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
                    // Start with a base font of 30px
                    ctx.font = "30px " + fontStyle;
              
                    // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    var stringWidth = ctx.measureText(txt).width;
                    var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
              
                    // Find out how much the font can grow in width.
                    var widthRatio = elementWidth / stringWidth;
                    var newFontSize = Math.floor(30 * widthRatio);
                    var elementHeight = (chart.innerRadius * 2);
              
                    // Pick a new font size so it will not be larger than the height of label.
                    var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
                    var minFontSize = centerConfig.minFontSize;
                    var lineHeight = centerConfig.lineHeight || 25;
                    var wrapText = false;
              
                    if (minFontSize === undefined) {
                      minFontSize = 20;
                    }
              
                    if (minFontSize && fontSizeToUse < minFontSize) {
                      fontSizeToUse = minFontSize;
                      wrapText = true;
                    }
              
                    // Set font settings to draw it correctly.
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    ctx.font = fontSizeToUse + "px " + fontStyle;
                    ctx.fillStyle = color;
              
                    if (!wrapText) {
                      ctx.fillText(txt, centerX, centerY);
                      return;
                    }
              
                    var words = txt.split(' ');
                    var line = '';
                    var lines = [];
              
                    // Break words up into multiple lines if necessary
                    for (var n = 0; n < words.length; n++) {
                      var testLine = line + words[n] + ' ';
                      var metrics = ctx.measureText(testLine);
                      var testWidth = metrics.width;
                      if (testWidth > elementWidth && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                      } else {
                        line = testLine;
                      }
                    }
              
                    // Move the center up depending on line height and number of lines
                    centerY -= (lines.length / 2) * lineHeight;
              
                    for (var n = 0; n < lines.length; n++) {
                      ctx.fillText(lines[n], centerX, centerY);
                      centerY += lineHeight;
                    }
                    //Draw text in center
                    ctx.fillText(line, centerX, centerY);
                  }
                }
              });

            var ctx = document.getElementById('mypiechart').getContext('2d');
            var myPieChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: pieLabels,
                    datasets: [{
                        label: '# of Active Cases',
                        data: pieDatas,
                        backgroundColor: [
                            'rgba(200,200, 200, 0.6)',
                            'rgba(200, 0, 0, 0.6)',
                            'rgba(0, 200,0, 0.6)',
                            'rgba(0, 0, 200, 0.6)',
                            'rgba(200,200 ,0, 0.6)',
                            'rgba(0, 200, 200, 0.6)',
                            'rgba(200, 0, 200, 0.6)',
                            'rgba(100, 0, 0, 0.5)',
                            'rgba(0, 100, 0, 0.5)',
                            'rgba(0, 0, 100, 0.5)',
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    //For doughnut chart
                    elements: {
                        center: {
                          text: 'Active Cases',
                          color: '#FF6384', // Default is #000000
                          fontStyle: 'Arial', // Default is Arial
                          sidePadding: 20, // Default is 20 (as a percentage)
                          minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
                          lineHeight: 25 // Default is 25 (in px), used for when text wraps
                        }
                    }
                 }
            });

        })
    })