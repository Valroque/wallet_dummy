function logIn() {
  window.restoreWallet();
}

function signUp() {
  $('#loginPage').hide();
  $('#wallet').show();
  window.promptSeeds();
}
