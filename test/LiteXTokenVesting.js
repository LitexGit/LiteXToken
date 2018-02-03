import EVMRevert from './helpers/EVMRevert';
import latestTime from './helpers/latestTime';
import { increaseTimeTo, duration } from './helpers/increaseTime';

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const LiteXToken = artifacts.require('LiteXToken');
const TokenVesting = artifacts.require('LiteXTokenVesting');

contract('LiteXTokenVesting', function ([_, owner, beneficiary]) {
  const amount = new BigNumber(1000);

  beforeEach(async function () {
    this.token = await LiteXToken.new({ from: owner });

    this.start = latestTime() + duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliff = duration.days(1);
    this.duration = duration.days(1080);
    this.divider = duration.days(30);

    this.vesting = await TokenVesting.new(beneficiary, this.start, this.cliff, this.duration, this.divider, true, { from: owner });

    await this.token.transfer(this.vesting.address, amount, {from: owner});

    console.log(this.start, this.cliff, this.duration, this.divider, amount);
    // await this.token.mint(this.vesting.address, amount, { from: owner });
  });

  it('cannot be released before cliff', async function () {
    await this.vesting.release(this.token.address).should.be.rejectedWith(EVMRevert);
  });

  it('can be released after cliff', async function () {
    await increaseTimeTo(this.start + this.cliff + duration.weeks(1));
    await this.vesting.release(this.token.address).should.be.fulfilled;
  });

  it('should release proper amount after cliff', async function () {
    await increaseTimeTo(this.start + this.cliff);

    const { receipt } = await this.vesting.release(this.token.address);
    const releaseTime = web3.eth.getBlock(receipt.blockNumber).timestamp;

    const balance = await this.token.balanceOf(beneficiary);
    console.log('releaseTime is ', releaseTime, balance);

    // console.log('=====', amount.mul((releaseTime - this.start).div(this.divider).floor()), amount.mul((releaseTime - this.start).div(this.divider).floor()).mul(this.divider).div(this.duration).floor());


    balance.should.bignumber.equal(amount.mul(new BigNumber(releaseTime - this.start).div(this.divider).floor()).mul(this.divider).div(this.duration).floor());
  });

  it('should linearly release tokens during vesting period', async function () {
    const vestingPeriod = this.duration - this.cliff;
    const checkpoints = 4;

    for (let i = 1; i <= checkpoints; i++) {
      const now = this.start + this.cliff + i * (vestingPeriod / checkpoints);
      await increaseTimeTo(now);

      await this.vesting.release(this.token.address);
      const balance = await this.token.balanceOf(beneficiary);
      const expectedVesting = amount.mul(new BigNumber(now - this.start).div(this.divider).floor()).mul(this.divider).div(this.duration).floor();
      console.log('expectedVesting is ', expectedVesting);

      balance.should.bignumber.equal(expectedVesting);
    }
  });

  it('should have released all after end', async function () {
    await increaseTimeTo(this.start + this.duration);
    await this.vesting.release(this.token.address);
    const balance = await this.token.balanceOf(beneficiary);
    balance.should.bignumber.equal(amount);
  });

  it('should be revoked by owner if revocable is set', async function () {
    await this.vesting.revoke(this.token.address, { from: owner }).should.be.fulfilled;
  });

  it('should fail to be revoked by owner if revocable not set', async function () {
    const vesting = await TokenVesting.new(beneficiary, this.start, this.cliff, this.duration, this.divider, false, { from: owner });
    await vesting.revoke(this.token.address, { from: owner }).should.be.rejectedWith(EVMRevert);
  });

  it('should return the non-vested tokens when revoked by owner', async function () {
    await increaseTimeTo(this.start + this.cliff + duration.weeks(12));

    const vested = await this.vesting.vestedAmount(this.token.address);

    const beforeBalance = await this.token.balanceOf(owner);

    await this.vesting.revoke(this.token.address, { from: owner });

    const ownerBalance = await this.token.balanceOf(owner);
    ownerBalance.should.bignumber.equal(new BigNumber(beforeBalance.toNumber()).sub(vested));
  });

  it('should keep the vested tokens when revoked by owner', async function () {
    await increaseTimeTo(this.start + this.cliff + duration.weeks(12));

    const vestedPre = await this.vesting.vestedAmount(this.token.address);

    await this.vesting.revoke(this.token.address, { from: owner });

    const vestedPost = await this.vesting.vestedAmount(this.token.address);

    vestedPre.should.bignumber.equal(vestedPost);
  });

  it('should fail to be revoked a second time', async function () {
    await increaseTimeTo(this.start + this.cliff + duration.weeks(12));

    await this.vesting.vestedAmount(this.token.address);

    await this.vesting.revoke(this.token.address, { from: owner });

    await this.vesting.revoke(this.token.address, { from: owner }).should.be.rejectedWith(EVMRevert);
  });
});
