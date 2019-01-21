var BASE_URL = "http://api.511.org/Traffic/Events?format=json&api_key=";
var endpoint = new String();

const generateEndpoint = async file => {
    const response = await fetch(file);
    const API_KEY = await response.text();
    endpoint = BASE_URL + API_KEY;
    console.log(endpoint);
}
generateEndpoint("apikey.txt");

var template = "templates/traffic-event.html"

var lastFetchTime = new Date();

function dateSort(a, b) {
    return new Date(a["updated"]).getTime() - new Date(b["updated"]).getTime();
}

function dateFilter(a){
    return new Date(a["updated"]).getTime() > lastFetchTime.getTime();
}

function prependEventRow(eventData) {
    $.get(template, function(templateHtml){
        var updated = new Date(eventData["updated"]);
        var created = new Date(eventData["created"]);

        var tree = $("<tbody>" + templateHtml + "</tbody>");
        tree.find('#event-updated').html( updated.toLocaleString() );
        tree.find('#event-created').html( created.toLocaleString() );
        tree.find('#event-headline').html( eventData["headline"] );
        tree.find('#event-type').html( eventData["event_type"] );
        tree.find('#event-status').html( eventData["status"] );
        htmlSource = tree.html();
        $('#events').prepend( htmlSource );
    },'html');
}

function fetchData(){
    $.ajax({
        type: 'GET',
        url: endpoint,
        async: true,
        beforeSend: function (xhr) {
            if (xhr && xhr.overrideMimeType) {
                xhr.overrideMimeType('application/json;charset=utf-8');
            }
        },
        dataType: 'json',
        success: function (data) {
            tempFetchTime = new Date(Date.now());
            console.log("Fetch at: " + tempFetchTime.toLocaleTimeString());
            filteredEvents = data["events"].filter(dateFilter);
            filteredEvents.sort(dateSort);
            console.log(filteredEvents);

            $.each(filteredEvents, function(i, eventData) {
                prependEventRow(eventData);
            });
            lastFetchTime = tempFetchTime;
        },
        complete: function(data) {
            console.log("Request complete")
        }
    });
}

$(document).ready(function(){

    //Get complete JSON data for the first time
    $.getJSON(endpoint, function(data){
        lastFetchTime = new Date(Date.now());
        console.log("First fetch: " + lastFetchTime.toLocaleTimeString() );
        sortedEvents = data["events"].sort(dateSort);

        $.each(sortedEvents, function(i, eventData) {
            prependEventRow(eventData);
        });
    });
    setInterval(fetchData, 60000);
});