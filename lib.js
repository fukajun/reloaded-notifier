var input = document.getElementById('filter_url');
var url = localStorage['filter_url'] || null;
input.value = url;
input.addEventListener('keyup', function() {
  localStorage['filter_url'] = this.value;
});

// Timeout
var input_timeout = document.getElementById('notify_timeout');
var timeout = localStorage['notify_timeout'] || null;
input_timeout.value = timeout;
input_timeout.addEventListener('keyup', function() {
  localStorage['notify_timeout'] = this.value;
});

// Load event
var input_loading_event = document.getElementById('loading_event');
var loading_event = localStorage['loading_event'] || 'off';
input_loading_event.value = loading_event;
input_loading_event.addEventListener('keyup', function() {
  localStorage['loading_event'] = this.value || 'off';
});

// Complete event
var input_complete_event = document.getElementById('complete_event');
var complete_event = localStorage['complete_event'] || 'off';
input_complete_event.value = complete_event;
input_complete_event.addEventListener('keyup', function() {
  localStorage['complete_event'] = this.value || 'off';
});
