function tabUpdateNotify(tab, icon_url, title, message, timeout){
  if(typeof timeout === 'undefined') timeout = 0;

  var popup = webkitNotifications.createNotification(icon_url, title, message);
  if(timeout != 0) {
    popup.show();
    setTimeout(function(){
      popup.close();
    }, timeout);
  }
  popup.onclick = function() {
    chrome.windows.update(tab.windowId, {focused: true})
    chrome.tabs.update(tab.id, {active: true})
  };
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var filter_url = localStorage['filter_url'] || '';
  var pattern = filter_url;
  if(filter_url.length != 0 && !tab.url.match(pattern)) {
    return;
  }

  var status = changeInfo.status;
  var title = status;
  var icon_url = tab.favIconUrl;
  var message = tab.title.replace("\n", '') + "\n" + tab.url.replace("\n", '');
  if( status == 'complete') {
    tabUpdateNotify(tab, icon_url, title, message, 1000);
  }
});
