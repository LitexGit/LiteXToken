// Specifically request an abstraction for MetaCoin
var MetaCoin = artifacts.require("LiteXToken");

contract('LiteXToken', function(accounts) {
  it("should put 2 billion LiteXToken in the first account", async function() {

    const instance = await MetaCoin.deployed();
    const balance = await instance.balanceOf.call(accounts[0]);
    assert.equal(balance.toNumber(), 20*10**8*10**18, "2 billion wasn't in the first account");

  });
  it("should send coin correctly", async function() {

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var amount = (10*10**8*10**18);
    var balance;

    const meta = await MetaCoin.deployed();

    balance = await meta.balanceOf.call(account_one);
    var account_one_starting_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_two);
    var account_two_starting_balance = balance.toNumber();

    const result = await meta.transfer(account_two, amount, {from: account_one});
    var eventEmitted = false;
    for(var i in result.logs){

      if(result.logs[i].event === 'Transfer'){
        eventEmitted = true;
      }
    }
    assert.equal(eventEmitted, true, "Transfer event not emit");

    balance = await meta.balanceOf.call(account_one);
    var account_one_ending_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_two);
    var account_two_ending_balance = balance.toNumber();

    assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");


  });

  it("should transfer token from another approved account correctly", async function(){

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];
    var account_three = accounts[2];


    var amount = 9;
    var balance;

    const meta = await MetaCoin.deployed();

    balance = await meta.balanceOf.call(account_one);
    var account_one_starting_balance = balance.toNumber();
    console.log('account_one_starting_balance is ', account_one_starting_balance );
    balance = await meta.balanceOf.call(account_two);
    var account_two_starting_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_three);
    var account_three_starting_balance = balance.toNumber();

    console.log(account_one_starting_balance);

    var result = await meta.approve(account_two, amount);

    var eventEmitted = false;
    for(var i in result.logs){

      if(result.logs[i].event === 'Approval'){
        eventEmitted = true;
      }
    }
    assert.equal(eventEmitted, true, "Approve event not emit");



    result = await meta.transferFrom(account_one, account_three, amount, {from: account_two});
    eventEmitted = false;
    for(var i in result.logs){

      if(result.logs[i].event === 'Transfer'){
        eventEmitted = true;
      }
    }
    assert.equal(eventEmitted, true, "Transfer event not emit");



    balance = await meta.balanceOf.call(account_one);
    var account_one_ending_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_two);
    var account_two_ending_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_three);
    var account_three_ending_balance = balance.toNumber();

    assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the approval");
    assert.equal(account_two_ending_balance, account_two_starting_balance, "Amount wasn't correctly from sender");
    assert.equal(account_three_ending_balance, account_three_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  });

  it("will not transfer from another unapproved account", async function(){

    var account_one = accounts[0];
    var account_two = accounts[1];
    var account_three = accounts[2];

    var amount = 10;
    var balance;

    const meta = await MetaCoin.deployed();

    balance = await meta.balanceOf.call(account_one);
    var account_one_starting_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_two);
    var account_two_starting_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_three);
    var account_three_starting_balance = balance.toNumber();

    await meta.approve(account_two, amount - 1);
    await meta.transferFrom(account_one, account_three, amount, {from: account_two});

    balance = await meta.balanceOf.call(account_one);
    var account_one_ending_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_two);
    var account_two_ending_balance = balance.toNumber();
    balance = await meta.balanceOf.call(account_three);
    var account_three_ending_balance = balance.toNumber();

    assert.equal(account_one_ending_balance, account_one_starting_balance, "Amount wasn't correctly taken from the approval");
    assert.equal(account_two_ending_balance, account_two_starting_balance, "Amount wasn't correctly from sender");
    assert.equal(account_three_ending_balance, account_three_starting_balance, "Amount wasn't correctly sent to the receiver");
  });

  it("will not receive any ether", async function(){
    const meta = await MetaCoin.deployed();
    var account_one = accounts[0];
    var balance_before = web3.eth.getBalance(account_one).toNumber();
    const result = await meta.sendTransaction({from:account_one, value: 1*10**18});

    const tx_fee = result.receipt.gasUsed * 10 ** 11;
    // console.log(result.receipt, tx_fee);
    // const tx_fee = result.

    var balance_contract = web3.eth.getBalance(meta.address).toNumber();
    var balance_after= web3.eth.getBalance(account_one).toNumber();

    assert.equal(balance_before, balance_after + tx_fee, "send ether to contract will not fail");
    assert.equal(balance_contract, 0, "send ether to contract will not fail");

  });

});
