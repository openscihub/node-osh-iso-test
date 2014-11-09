var route = document.getElementById('route').textContent;
if (route !== '/server') {
  iso.fail('No test info on server iso func');
}
else {
  iso.ok('');
}
