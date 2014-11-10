var testName = document.getElementById('testName').textContent;
if (testName !== 'server') {
  stem.fail('No test info on server stem func');
}
else {
  stem.ok('');
}
