pragma solidity ^0.4.18;


import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract LiteXToken is StandardToken {

  string public name = "LiteXToken";
  string public symbol = "LXT";
  uint8 public decimals = 18;
  uint INITIAL_SUPPLY = 20*10**8; // 2 billion tokens

  function LiteXToken() public {
    totalSupply_ = INITIAL_SUPPLY*10**uint256(decimals);
    balances[msg.sender] = totalSupply_;
  }

  function() public payable{
    revert();
  }


}
