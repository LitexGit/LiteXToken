pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/TokenVesting.sol';

/**
* token will released by divider like this:
*
* if divider is one month, _cliff is zero, _duration is one year, total vesting token is 12000
*   Jan 30th will not release any token
*   Jan 31st will release 1000
*   Feb 1 will not release any token
*   Feb 28th will release 1000
*   ………………
*   ………………
*   Dec 31st will release 1000
*/
contract LiteXTokenVesting is TokenVesting {

  uint256 public divider;

  function LiteXTokenVesting(address _beneficiary, uint256 _start, uint256 _cliff, uint256 _duration, uint256 _divider, bool _revocable) TokenVesting(_beneficiary, _start, _cliff, _duration, _revocable) public   {
    require(_beneficiary != address(0));
    require(_cliff <= _duration);
    require(_divider <= duration);
    divider = _divider;
  }

  /**
  * @dev Calculates the amount that has already vested.
  * @param token ERC20 token which is being vested
  */
  function vestedAmount(ERC20Basic token) public view returns (uint256) {
    uint256 currentBalance = token.balanceOf(this);
    uint256 totalBalance = currentBalance.add(released[token]);

    if (now < cliff) {
      return 0;
    }

    if (now >= start.add(duration) || revoked[token]) {
      return totalBalance;
    }
    return totalBalance.mul(now.sub(start).div(divider).mul(divider)).div(duration);
  }

}
