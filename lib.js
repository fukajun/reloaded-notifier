var input = document.getElementById('filter_url');
var url = localStorage['filter_url'];
input.value = url;
input.addEventListener('keyup', function() {
  localStorage['filter_url'] = this.value;
  console.debug(localStorage['filter_url']);
});
