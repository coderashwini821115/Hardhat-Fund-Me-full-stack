const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config")
describe("FundMe", function () {
    let fundMe
    let deployer
    const priceFeedAddress =
        networkConfig[network.config.chainId]["ethUsdPriceFeed"]
    const sendValue = ethers.parseEther("0.026")
    beforeEach(async () => {
        //to get the  account to connect with fundMe contract
        deployer = (await getNamedAccounts()).deployer
        //to specify which file to deploy from deploy folder

        // await deployments.fixture(["FundMe"])
        // console.log(`deployer is : ${deployer}`)
        // const myContract = await deployments.get("FundMe")
        // fundMe = await ethers.getContractAt(myContract.abi, myContract.address)
        fundMe = await ethers.getContract("FundMe", deployer)
    })
    // describe("constructor", function () {
    //     it("sets the aggregator address correctly", async () => {
    //         const response = await fundMe.getPriceFeed()
    //         // console.log(response)
    //         assert.equal(response, priceFeedAddress)
    //     })
    // })
    describe("fund", function () {
        it("fails if u don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
    })
    it("updates the amount funded data structure", async () => {
        const fundTxResponse = await fundMe.fund({ value: sendValue })
        await fundTxResponse.wait(1)
        const response = await fundMe.getAddressToAmountFunded(deployer)
        // const amountFunded = ethers.BigNumber.from(response)
        assert.equal(response.toString(), sendValue.toString())
    })
    it("adds funder to array of funders", async () => {
        const fundTxResponse = await fundMe.fund({ value: sendValue })
        // await fundTxResponse.wait(1)
        const response = await fundMe.getFunder(0)
        assert.equal(response, deployer)
    })
    it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue })
        await fundMe.withdraw()
        const endingBalance = await ethers.provider.getBalance(fundMe.address)
        assert.equal(endingBalance.toString(), "0")
    })
})
