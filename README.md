# LiteXToken
LiteX token plan and Vesting Lock plan

This project includes two smart contracts of Ethereum for litex.io.

1. <a href="https://github.com/litexio/LiteXToken/blob/master/contracts/LiteXToken.sol">LiteXToken</a>: a token mechanism which is not mintable, not burnable with fixed amount.
2. <a href="https://github.com/litexio/LiteXToken/blob/master/contracts/LiteXTokenVesting.sol">LiteXTokenVesting</a>: a lock mechanism for ERC20 tokens, inherit from TokenVesting of 
<a href="https://github.com/OpenZeppelin/zeppelin-solidity">Zeppelin-Solidity</a>. 
It implements token shares lock by stages.
