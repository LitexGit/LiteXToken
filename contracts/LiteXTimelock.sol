pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
// import "./LiteXToken.sol";

/**
 * @title TokenTimelock
 * @dev TokenTimelock is a token holder contract that will allow a
 * beneficiary to extract the tokens after a given release time
 */
contract LiteXTimelock {
  using SafeERC20 for ERC20Basic;

  // ERC20 basic token contract being held
  ERC20Basic public token;

  // beneficiary of tokens after they are released
  address public beneficiary;

  // timestamp when token release is enabled
  uint256 public releaseTime;

  uint256 public totalSupply;

//   function LiteXTimeLock (ERC20Basic _token, address _beneficiary, uint256 _releaseTime) public {
  function LiteXTimelock (ERC20Basic _token) public {
    // require(_releaseTime > now);
    token = _token;
    beneficiary = 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef;
    releaseTime = block.timestamp + 120;
    totalSupply = token.totalSupply();
  }

  function now1() public view returns (uint256 ctime1) {
    uint256 ctime = block.timestamp;
    return ctime;
  }

  function releaseOf() public view returns (uint256 balance) {
    uint256 amount = token.balanceOf(this);
    return amount;
  }

  /**
   * @notice Transfers tokens held by timelock to beneficiary.
   */
  function release() public {
    require(now >= releaseTime);

    uint256 amount = token.balanceOf(this);
    require(amount > 0);

    token.safeTransfer(beneficiary, amount);
  }
}
