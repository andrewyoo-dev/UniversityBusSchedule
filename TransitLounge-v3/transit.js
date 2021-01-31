function start()
{
    //this is just for testing getSchedule and getBothSchedule codes. need to be changed.
    currentTime();
    
    
    busStopsValue = sessionStorage.getItem('BusStopsToDispaly');
    if(busStopsValue == "STA_EWU"){       
        getSchedule(busStopsValue);
    }
    else if(busStopsValue == "STA_ELMPUBWF"){       
        getSchedule(busStopsValue);  
    }
    else{        
        getBothSchedule()
    }

    
    currentValue = sessionStorage.getItem('BrandingTheme');
    if(currentValue == "EWU"){       
        $("link[rel=stylesheet]").attr({href : "transit-EWU.css"});
        sessionStorage.setItem('BrandingTheme', "EWU");
        document.getElementById("imgLogo").src = "EWU.PNG";
        document.getElementById("lblBannerName").innerHTML = ("EWU Bus Arrivals / Departures");
    }
    else{
        $("link[rel=stylesheet]").attr({href : "transit-STA.css"});
        sessionStorage.setItem('BrandingTheme', "STA");
        document.getElementById("imgLogo").src = "STA.PNG";
        document.getElementById("lblBannerName").innerHTML = ("STA Bus Arrivals / Departures");
    }
   // $("#btnEWU").click(getSchedule);
    //$("#btnPUB").click(getSchedule);
   // $("#btnBOTH").click(getBothSchedule);
}

//get bus schedule for one stop.
function getSchedule(busStopsValue)
{    
    //clear schedule list.
    var list = [];

    //RESTful get() call.
    $.get("http://52.88.188.196:8080/api/api/where/arrivals-and-departures-for-stop/"
        + busStopsValue //evt.target.getAttribute("data-stopid")
        + ".json?key=TEST&minutesAfter=60", 
        function(data){ 
            //assigne data to list[].
            getList(data,list); 
            //process list[] to html.
            gotData(list);
        }, "jsonp");

    //set timeout to refresh schedule every 30 seconds.
    setTimeout(function (){ getSchedule(busStopsValue);},30000);
}

//get bus schedule for both stops
function getBothSchedule()
{
    var list = [];

    //assign datas from STA_EWU to the list[].
    $.get("http://52.88.188.196:8080/api/api/where/arrivals-and-departures-for-stop/STA_EWU.json?key=TEST&minutesAfter=60", 
        function(data){ 

            getList(data,list);//first array of datas has been assigned to the list[]

            //append datas from STA_ELMPUBWF to the listp[]
            $.get("http://52.88.188.196:8080/api/api/where/arrivals-and-departures-for-stop/STA_ELMPUBWF.json?key=TEST&minutesAfter=60", 
            function(data){ 

                getList(data,list);//second array of datas has been added to the list[]

                //sort the list on scheduledDepartureTime. closest time will be on top of the list.
                list.sort( function(a,b) { 
                    return a.scheduledDepartureTime - b.scheduledDepartureTime 
                } );

                //use list to append html codes.
                gotData(list);

            }, "jsonp");
        }, "jsonp");

    //set timeout to refresh schedule every 30 seconds.
    setTimeout(getBothSchedule, 30000);
}

//process jsonp data to list[].
function getList(data,list)
{
    for(var ix = 0; ix < data.data.entry.arrivalsAndDepartures.length; ix ++)
    {
        list.push(data.data.entry.arrivalsAndDepartures[ix]);
    }
}



//write list[] to html page.
function gotData(data)
{
    $("#tblArrival").empty();
    $("#tblDeparture").empty();
    for(var ix = 0; ix < data.length && ix < 10; ix ++)
    {
        var arrival;

        if(data[ix].scheduledArrivalTime < data[ix].predictedArrivalTime)
        {
            if(timeRemain(data[ix].predictedArrivalTime) <= 2)
                arrival = "<tr bgcolor='#FFFF00'>";
            else
                arrival = "<tr>";
            arrival += "<td>" + data[ix].routeShortName + " " + data[ix].routeLongName + "</td>";
            arrival += "<td>" + EpochToDate(data[ix].predictedArrivalTime) 
                + " (" + timeRemain(data[ix].predictedArrivalTime) + "mins )</td>"
                + "<td> DELAYED </td>";
        }
        else
        {            
            if(timeRemain(data[ix].scheduledArrivalTime) <= 2)
                arrival = "<tr bgcolor='#FFFF00'>";
            else
                arrival = "<tr>";
            arrival += "<td>" + data[ix].routeShortName + " " + data[ix].routeLongName + "</td>";
            arrival += "<td>" + EpochToDate(data[ix].scheduledArrivalTime) 
                + " (" + timeRemain(data[ix].scheduledArrivalTime) + "mins )</td>"
                + "<td> ONSCHEDULE </td>";
        }
        arrival += "<td>" + data[ix].stopId + "</td>";
        arrival += "</tr>";
        
        $("#tblArrival").append(arrival);

        var departure;
        
        if(data[ix].scheduledDepartureTime < data[ix].predictedDepartureTime)
        {            
            if(timeRemain(data[ix].predictedDepartureTime) <= 2)
                departure = "<tr bgcolor='#FFFF00'>";
            else
                departure = "<tr>";
            departure += "<td>" + data[ix].routeShortName + " " + data[ix].routeLongName + "</td>";
            departure += "<td>" + EpochToDate(data[ix].predictedDepartureTime) 
                + " (" + timeRemain(data[ix].predictedDepartureTime) + "mins )</td>"
                + "<td> DELAYED </td>";
        }
        else
        {            
            if(timeRemain(data[ix].scheduledDepartureTime) <= 2)
                departure = "<tr bgcolor='#FFFF00'>";
            else
                departure = "<tr>";
            departure += "<td>" + data[ix].routeShortName + " " + data[ix].routeLongName + "</td>";
            departure += "<td>" + EpochToDate(data[ix].scheduledDepartureTime) 
                + " (" + timeRemain(data[ix].scheduledDepartureTime) + "mins )</td>"
                + "<td> ONSCHEDULE </td>";
        }
        departure += "<td>" + data[ix].stopId + "</td>";
        departure += "</tr>";

        $("#tblDeparture").append(departure);
    }
}

//convert Epoch time to human time.
function EpochToDate(time)
{
    var date = new Date(time);
    return date.toLocaleTimeString();
}

//current time
function currentTime()
{
    var today = new Date($.now()).toLocaleString();
    document.getElementById("currentTime").innerHTML = today;
    setTimeout(currentTime, 1000);
}

//calculate remain time of arrival/departure to minutes.
function timeRemain(time)
{
    var remain = (time - $.now()) / 60000;
    return remain.toFixed(0);
}

$(document).ready(start);