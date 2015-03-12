var testName = document.getElementById('testName').textContent;
if (testName !== 'server') {
  iso.fail('No test info on server iso func');
}
else {
  iso.ok('');
}
