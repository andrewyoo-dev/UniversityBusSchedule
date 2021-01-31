
//var list = [];

function start()
{   
    
    sessionStorage.setItem('BusStopsToDispaly', "STA_EWU");    
    $("#btnConfirm").click(confirmed);
}


var currentValue;
function handleClick(myRadio) {
    
    currentValue = myRadio.value;
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
}

var currentStopsValue;
function handleClick_Stops(myStopsRadios) {
    
    currentValue = myStopsRadios.value;
    if(currentValue == "STA_EWU"){       
        sessionStorage.setItem('BusStopsToDispaly', currentValue);   
    }
    else if(currentValue == "STA_ELMPUBWF"){       
        sessionStorage.setItem('BusStopsToDispaly', currentValue);   
    }
    else{        
        sessionStorage.setItem('BusStopsToDispaly', currentValue); 
    }
}

function confirmed(){
    window.location.href = "transit.html";
        
}
$(document).ready(start);