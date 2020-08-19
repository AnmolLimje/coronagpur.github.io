//Visitors Impressions
//Deployment
HOSTAPI_GetTotalVisitors = "https://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/getTotalVisitorsCount";
HOSTAPI_GetVisitors = "https://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/getVisitorsCount";
HOSTAPI_analytics = "https://anmolhub.online/services/wcf/CoronavirusIndia/CoronavirusIndia.svc/visitidentification";

//Developement
//HOSTAPI_GetVisitors = "http://localhost:50385/CoronavirusIndia.svc/getVisitorsCount";
//HOSTAPI_analytics = "http://localhost:50385/CoronavirusIndia.svc/visitidentification";

footerVisitors = document.querySelector("#footerVisitors");
footerVisitors.innerHTML = "Daily Visitors: 0";

//https://api.ipify.org?format=json
function getValue() {
    return new Promise((resolve, reject) => {
        fetch("https://api.ipify.org?format=json", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((response) => {
            response.json().then((data) => {
                //console.log("Running IP: ");
                //console.log(data);

                return resolve(data);
            })
        }).catch((err) => {
            return reject("Error Fetch");
        })
    })
}

function setVisitors(IP) {
    return new Promise((resolve, reject) => {
        fetch(HOSTAPI_analytics, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ "Platform": navigator.platform, "UserAgent": navigator.userAgent, "IPAddress": IP })
        }).then((response) => {
            response.json().then((data) => {
                console.log("Loaded");
                return data;
            })
        }).catch((err) => {
            return reject("Error Fetch Visitors");
        })
    })
}

const doWork = async () => {
    const data = await getValue();
    const visitorCount = await setVisitors(data.ip);
    console.log("Done Sending Data");

    //console.log(visitorCount.Visitors);
    //console.log(data.ip);
    return data;
}

doWork().then((result) => {
    //console.log("Final");
    //console.log(result);
}).catch((err) => {
    console.log(err);
})


fetch(HOSTAPI_GetTotalVisitors)
    .then((response) => {
        response.json().then((data) => {
            //console.log("Visitors: ");
            //console.log(data.Visitors);
            footerVisitors.innerHTML = "Visitors: " + data.Visitors;
        })
    })