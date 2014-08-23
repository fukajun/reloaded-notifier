var tabInfoList = {}
function tabUpdateNotify(tab, icon_url, title, message, timeout){
  if(typeof timeout === 'undefined') timeout = 0;

  var tempolaryId = new Date().getTime() + "";
  var options = {
    type: "basic",
    title: title,
    message: message,
    iconUrl: 'icon_on.png'
  }
  var onclicked = function(id) {
    tab = tabInfoList[id]
    chrome.windows.update(tab.windowId, {focused: true})
    chrome.tabs.update(tab.id, {active: true})
  };
  var oncreated = function(id) {
    tabInfoList[id] = tab
    if(timeout != 0) {
      setTimeout(function(){
        chrome.notifications.clear(tempolaryId, function(){});
      }, timeout);
    }
  }
  var onclosed = function(id) {
    delete tabInfoList[id]
  }
  chrome.notifications.create(tempolaryId, options, oncreated);
  chrome.notifications.onClicked.addListener(onclicked);
  chrome.notifications.onClosed.addListener(onclosed);
}

function isMatchUrlPattern(url) {
  var filter_url = localStorage['filter_url'] || '';
  var pattern = filter_url;
  if(filter_url.length != 0 && !url.match(pattern)) {
    return false;
  } else {
    return true;
  }
}
function updateExtensionIcon(){
  chrome.tabs.getSelected(null, function(tab) {
    var image_name = '';
    imageName = isMatchUrlPattern(tab.url) ? 'icon_on.png' : 'icon_off.png';
    chrome.browserAction.setIcon({path: imageName});
  });
}

chrome.tabs.onSelectionChanged.addListener(function(tabId, changeInfo){
  updateExtensionIcon();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  updateExtensionIcon();
  if(!isMatchUrlPattern(tab.url)) {
    return;
  }

  var status = changeInfo.status;
  var title = status;
  var icon_url = tab.favIconUrl;
  var message = tab.title.replace("\n", '') + "\n" + tab.url.replace("\n", '');
  var notify_timeout = localStorage['notify_timeout'] || 10000;
  var loading_event = localStorage['loading_event'] || 'off';
  var complete_event = localStorage['complete_event'] || 'off';
  if( complete_event == 'on' && status == 'complete') {
    tabUpdateNotify(tab, icon_url, title, message, notify_timeout);
  }
  if( loading_event == 'on' && status == 'loading') {
    tabUpdateNotify(tab, icon_url, title, message, notify_timeout);
  }
});
