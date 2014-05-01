function tabUpdateNotify(tab, icon_url, title, message, timeout){
  if(typeof timeout === 'undefined') timeout = 0;

  var popup = webkitNotifications.createNotification(icon_url, title, message);
  popup.show();
  if(timeout != 0) {
    setTimeout(function(){
      popup.cancel();
    }, timeout);
  }
  popup.onclick = function() {
    chrome.windows.update(tab.windowId, {focused: true})
    chrome.tabs.update(tab.id, {active: true})
  };
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
