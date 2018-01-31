var LiteXToken = artifacts.require("LiteXToken");
var LiteXTimelock = artifacts.require("LiteXTimelock");

var LiteXTokenVesting = artifacts.require("LiteXTokenVesting");

module.exports = async function(deployer) {

  // deployer.deploy(LiteXToken).then(()=>{
  //   var instance = LiteXToken;
  //   console.log('LiteXToken is ', instance.address);
  //   return deployer.deploy(LiteXTimelock, instance.address);
  // });

  deployer.deploy(LiteXToken);
  deployer.deploy(LiteXTokenVesting, account_three, Math.floor(new Date().getTime()/1000), 0, 1000, 100, true);

 };
