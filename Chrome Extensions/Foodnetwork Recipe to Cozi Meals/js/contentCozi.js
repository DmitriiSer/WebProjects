//var m = "Foodnetwork Recipe to Cozi Meals: ";
var m = "FRtoCM: ";
console.debug(m + "'contentCozi.js' script was loaded");

function insertTextAtCursor(text) {
    var el = document.activeElement;
    var val = el.value;
    var endIndex;
    var range;
    var doc = el.ownerDocument;
    if (typeof el.selectionStart === 'number' &&
        typeof el.selectionEnd === 'number') {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length;
    } else if (doc.selection !== 'undefined' && doc.selection.createRange) {
        el.focus();
        range = doc.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}

//variables for ingredients and directions
var title = null,
    description = null,
    link = null,
    ingredients = null,
    directions = null;
var buttonNewElem = function() { return document.getElementById("buttonNew"); },
    buttonSaveElem = function() { return document.getElementById("buttonSave"); },
    titleElem = function(props) {
        var elem = document.getElementById("RecipeViewForm_name");
        elem = elem.getElementsByTagName("input")[0];
        if (props.selected)
            elem.select();
        return elem;
    },
    linkElem = function(props) {
        var elem = document.getElementById("RecipeViewForm_url");
        elem = elem.getElementsByTagName("input")[0];
        if (props.selected)
            elem.select();
        return elem;
    },
    ingredientsElem = function(props) {
        var elem = document.getElementById("RecipeViewForm_ingredients");
        elem = elem.getElementsByClassName("AutoSizeTextBox")[0];
        elem = elem.getElementsByTagName("textarea")[0];
        if (props.selected)
            elem.select();
        return elem;
    },
    directionsElem = function(props) {
        var elem = document.getElementById("RecipeViewForm_preparation");
        elem = elem.getElementsByClassName("AutoSizeTextBox")[0];
        elem = elem.getElementsByTagName("textarea")[0];
        if (props.selected)
            elem.select();
        return elem;
    }

function waitUntilNotNull(action, done, interval, timeout) {
    if (interval === undefined || typeof interval != 'number')
        interval = 500;
    if (timeout === undefined || typeof timeout != 'number')
        timeout = 15000;
    var timer = setInterval(function() {
        if (timeout <= 0) {
            clearInterval(timer);
            done(false);
        }
        timeout -= interval;
        if (action() != null) {
            clearInterval(timer);
            done(true);            
        }
    }, interval);
}

//send requests for all the fields of a meal
//wait for 'title' to be filled
waitUntilNotNull(function() {
    chrome.extension.sendRequest({ get: "title" }, function(response) { 
        if (response != null) { title = response; }
    });
    return title;
});
//wait for 'link' to be filled
waitUntilNotNull(function() {
    chrome.extension.sendRequest({ get: "link" }, function(response) {
        if (response != null) { link = response; }
    });
    return link; 
});
//wait for 'ingredients' to be filled
waitUntilNotNull(function() {
    chrome.extension.sendRequest({ get: "ingredients" }, function(response) {
        if (response != null) { ingredients = response; }
    });
    return ingredients;
});
//wait for 'directions' to be filled
waitUntilNotNull(function() {
    chrome.extension.sendRequest({ get: "directions" }, function(response) {
        if (response != null) { directions = response; }
    });
    return directions;
});

//timer timeouts
var timerTimeout = 15000;
//wait for all the fields would be filled
var timer = setInterval(function() {
    if (timerTimeout <= 0)
        clearInterval(timer);
    timerTimeout -= 500;
    var button = buttonNewElem();
    //check if all the fields are not null
    if ((title != null) &&
        (link != null) &&
        (ingredients != null) &&
        (directions != null) &&
        (button != undefined)) {
        try {
            //
            button.click();
            //insert title
            titleElem({ selected : true});
            insertTextAtCursor(title);
            //insert link
            linkElem({ selected : true});
            insertTextAtCursor(link);
            //insert ingredients
            ingredientsElem({ selected : true});
            insertTextAtCursor(ingredients);
            //insert directions
            directionsElem({ selected : true});
            insertTextAtCursor(directions);
            //press Save button
            button = buttonSaveElem();
            button.click();
            //clear waiting timer
            clearInterval(timer);
        } catch(e) {
            console.error(e);
            clearInterval(timer);
        }
    }
}, 500);