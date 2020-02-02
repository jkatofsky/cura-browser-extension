
//chrome.browserAction.setBadgeText({text: 'ON'});
///chrome.browserAction.setBadgeBackgroundColor({color: '#FF1654'});

chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // That fires when a page's URL contains a 'g' ...
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher( {
                        pageUrl: { hostEquals: 'www.rbcroyalbank.com', schemes: ['https'] },
                    })
                ],
                // And shows the extension's page action.
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });
});


chrome.pageAction.onClicked.addListener(function(tab) {
    function httpGet(theUrl) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }
    var response = httpGet("https://mchacks-cura.appspot.com/actions/RBC");
    var opt1 = { type: "basic", title: "cura", message: response, iconUrl: "icon48.png"}
    var opt2 = { type: "list", title: "cura", message: "would you like?", iconUrl: "icon48.png"}
    chrome.notifications.create(opt1);
    var myNotificationID = null;

    /* For demonstration purposes, the notification creation
    * is attached to the browser-action's `onClicked` event.
    * Change according to your needs. */
    function buttonNotif(){
        chrome.notifications.create("", {
            type:    "basic",
            iconUrl: "icon48.png",
            title:   "cura",
            message: "Flight inbound... Would you like\nsome cash in that currency?",
            buttons: [{
                title: "Yes, please"
            }, {
                title: "No, thanks"
            }]
        }, function(id) {
            myNotificationID = id;
        });

    /* Respond to the user's clicking one of the buttons */
    chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
        if (notifId === myNotificationID) {
            if (btnIdx === 0) {
                window.open("https://mchacks-cura.appspot.com/confirmations/RBC");
            }
        }
    });
}
setTimeout(function() { buttonNotif(); }, 5000)

});

/*
chrome.browserAction.onClicked.addListener(function() {
chrome.tabs.create({url: 'index.html'});
});
*/
