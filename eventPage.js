function notify(icon_url, title, message, timeout){
  if(typeof timeout === 'undefined') timeout = 0;

  var popup = webkitNotifications.createNotification(icon_url, title, message);
  if(timeout != 0) {
    popup.show();
    setTimeout(function(){
      popup.close();
    }, timeout);
  }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var pattern = /localhost/i;
  if(!tab.url.match(pattern)) {
    //return;
  }

  var status = changeInfo.status;
  var title = status;
  var icon_url = tab.favIconUrl;
  var message = tab.title.replace("\n", '') + "\n" + tab.url.replace("\n", '');
  if( status == 'complete' || status == 'loading') {
    var timeout = changeInfo.status != 'complete' ? 1000 : 5000
    notify(icon_url, title, message, timeout);
  }
});
