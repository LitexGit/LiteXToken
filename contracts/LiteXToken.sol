pragma solidity ^0.4.18;


import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract LiteXToken is StandardToken {

  string public name = "LiteXToken";
  string public symbol = "LXT";
  uint8 public decimals = 18;
  uint public INITIAL_SUPPLY = 20*10**8; // 2 billion tokens

  function LiteXToken() public {
    totalSupply_ = INITIAL_SUPPLY*10**uint256(decimals);
    balances[msg.sender] = totalSupply_;
  }

  function() public payable{
    revert();
  }

  /* function slice1(uint256 total, uint256 endTime, uint256 start, uint256 duration, uint256 divider) public pure returns (uint256){
    return total.mul(endTime.sub(start).div(divider).mul(divider)).div(duration);
  } */

}
