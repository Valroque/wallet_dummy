var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var addr,
  prvt_key,
  secretSeed;

var EC = elliptic.ec;
var ec = new EC('secp256k1');
var Mnemonic = require('bitcore-mnemonic');


function createWallet(seedPhrase) {
  var keyPair = ec.genKeyPair();
  var compact = false;
  var pubKey = keyPair.getPublic(compact, 'hex').slice(2);
  var pubKeyWordArray = CryptoJS.enc.Hex.parse(pubKey);
  var hash = CryptoJS.SHA3(pubKeyWordArray, { outputLength: 256 });
  var address = hash.toString(CryptoJS.enc.Hex).slice(24);

  confirm('Note your Private Key :' + keyPair.getPrivate().toString(16))
  confirm('Note your Wallet Address : ' + '0x' + address);
}
window.createWallet = createWallet;

function addressFromPrivateKey(privKey) {
  var keyPair = ec.genKeyPair();
  keyPair._importPrivate(privKey, 'hex');
  var compact = false;
  var pubKey = keyPair.getPublic(compact, 'hex').slice(2);
  var pubKeyWordArray = CryptoJS.enc.Hex.parse(pubKey);
  var hash = CryptoJS.SHA3(pubKeyWordArray, { outputLength: 256 });
  var address = hash.toString(CryptoJS.enc.Hex).slice(24);
  return address;
}

function restoreWallet() {
  var addressLogin = $('#addressLogin').val();
  var password = $('#password').val();
  var seedPhrase = $('#seed').val();
  var privateKeyLogin = $('#privateKeyLogin').val();

  //if(!lightwallet.keystore.isSeedValid(seedPhrase)) {
    var computed_address = '0x' + addressFromPrivateKey(privateKeyLogin);
    console.log(computed_address);
    if(addressLogin == computed_address) {
      $('#loginPage').hide();
      $('#wallet').show();
      return;
    } else {
      $('info').val('Entered details are invalid!');
      return;
    }
  // } else {
  //   lightwallet.keystore.createVault({
  //     password: password,
  //     seedPhrase: seedPhrase, // Optionally provide a 12-word seed phrase
  //     // salt: fixture.salt,     // Optionally provide a salt.
  //                                // A unique salt will be generated otherwise.
  //     hdPathString: "m/44'/60'/0'/0"    // Optional custom HD Path String
  //   }, function (err, ks) {
  //     if(err) {
  //       $('#info').val('Some Error has occured!!');
  //     } else {
  //       ks.keyFromPassword(password, function (err, pwDerivedKey) {
  //         if(err) {
  //           console.log('Some Error has occured!!');
  //         }
  //         ks.generateNewAddress(pwDerivedKey, 1);
  //         addr = ks.getAddresses()[0];
  //         if(addr == addressLogin) {
  //           $('#loginPage').hide();
  //           $('#wallet').show();
  //           lightwallet.ks = ks;
  //         } else {
  //           $('#info').val('Entered details are invalid');
  //           return;
  //         }
  //       });
  //     }
  //   });
  // }
}
window.restoreWallet = restoreWallet;

function getAddresses() {
  console.log(web3.eth.accounts);
}

function transfer() {
  var sender = $('#sender').val();
  var receiver = $('#receiver').val();
  var identifier = $('#identifier').val();
  var amount = $('#amount').val();
  if(sender == '0x' + lightwallet.keystore._computeAddressFromPrivKey(identifier)) {
    web3.eth.sendTransaction({from:sender, to:receiver, value:amount })
    console.log('Successful Transfer!');
  } else {
    console.log('Private Key or Seed does not identify your sender\'s address provided');
  }
}

function getBalance() {
  var account = $('#address').val();
  var privateKey = $('#privateKey').val();

  if(address == account) {
    console.log(web3.eth.getBalance(account).toString(10));
  } else {
    $('#info').val('Sorry the address/key is not valid.\n Else if you used privateKey to login plaese use private key only!!');
  }
}

function realPrivateKey() {
  keystore.exportPrivateKey(address, pwDerivedKey)
}

function promptSeeds() {
  var seed = new Mnemonic(Mnemonic.Words.ENGLISH);
  var seedPhrase = seed.phrase;
  var hdMastExtPrivKey = seed.toHDPrivateKey('', 'testnet');

  // Derived External HD Private Key:
  var hdExternalPrivKey = hdMastExtPrivKey.derive("m/44'/60'/0'/0/0");

  // Derived External Private Key:
  var myExternalPrivKey = hdExternalPrivKey.privateKey;

  // Derived External Public Key:
  var myExternalPublKey = myExternalPrivKey.publicKey;

  // Derived External Public Address:
  var myExternalAddress = myExternalPublKey.toAddress();

  confirm('Please note the Seed Words :\n' + seedPhrase);
  confirm('Please note the Private Key :\n' + myExternalPrivKey);
  confirm('Please note the wallet Address :\n' + myExternalAddress.toString());
}
window.promptSeeds = promptSeeds;

function onReady() {
  if($('#loginPage').is(':visible')) {
    $('#wallet').hide();
  }
}
$(onReady)
