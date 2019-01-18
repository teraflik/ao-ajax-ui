# AO-AJAX-UI
Designing a prototype UI for scheduled fetching of logs from an API. Tested using Traffic Data API from [511.org](http://511.org)

# Components

## index.html
Primary homepage, includes following css/js libraries:
* [Bootstrap v4.2](https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css)
* [Font Awesome v4.7](https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css)
* [jQuery v3.3.1](https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js)
* [main.css](#main.css)
* [main.js](#main.js)

The event logs are displayed under `<tbody id="events">`.

## main.css
Some custom styles for the webpage. Nothing much.


## main.js
Does the job of sending request to the API endpoint defined by `var endpoint = "http://api.511.org/Traffic/Events?format=json&api_key="+API_KEY;` where the `API_KEY` is generated post registration.

#### 1. prependEventRow(eventData)
Takes an event data as argument and prepends it to the start of the log table.

#### 2. fetchData()
Sends ajax request to the API endpoint and filters the response data based on lastFetchTime to prepend updated entries only

#### 3. $(document).ready function
Initiates `lastFetchTime` with the current time upon recieving JSON Response. Then sorts the json event data on `"updated"` attribute. Then sets the `fetchData()` function to execute every 1 minute.

```javascript
$.getJSON(endpoint, function(data){
    lastFetchTime = new Date(Date.now());
    sortedEvents = data["events"];
    sortedEvents.sort(dateSort);
    $.each(sortedEvents, function(i, eventData) {
        prependEventRow(eventData);
    }); });
setInterval(fetchData, 60000);
```