App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('LiteXToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var LiteXTokenArtifact = data;
      App.contracts.LiteXToken = TruffleContract(LiteXTokenArtifact);

      // Set the provider for our contract.
      App.contracts.LiteXToken.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances();
    });


    $.getJSON('LiteXTimelock.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var LiteXTokenArtifact = data;
      App.contracts.LiteXTimelock = TruffleContract(LiteXTokenArtifact);

      // Set the provider for our contract.
      App.contracts.LiteXTimelock.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances();
    });

    // $.getJSON('BMC.json', function(data) {
    //   // Get the necessary contract artifact file and instantiate it with truffle-contract.
    //   var LiteXTokenArtifact = data;
    //   App.contracts.BMC= TruffleContract(LiteXTokenArtifact);

    //   // Set the provider for our contract.
    //   App.contracts.BMC.setProvider(App.web3Provider);

    //   App.contracts.BMC.deployed().then(function(instance){
    //     console.log(instance);
    //   });
    //   // Use our contract to retieve and mark the adopted pets.
    //   return App.getBalances();
    // });




    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var LiteXTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.LiteXToken.deployed().then(function(instance) {
        LiteXTokenInstance = instance;

        return LiteXTokenInstance.transfer(toAddress, amount, {from: account});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function(adopters, account) {
    console.log('Getting balances...');

    var LiteXTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];


      console.log('Account is ', account);
      // console.dir(account);

      App.contracts.LiteXToken.deployed().then(function(instance) {
        LiteXTokenInstance = instance;

        console.log('LiteXTokenInstance', LiteXTokenInstance.address)
        return LiteXTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        console.log('balance is ', balance);
        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
