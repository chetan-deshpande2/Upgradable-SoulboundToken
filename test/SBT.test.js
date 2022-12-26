const { ethers } = require("hardhat")
const { expect } = require("chai")
const { utils, Wallet } = require('ethers')
const { getSignature } = require('../lib/genrateSig')

const MetaData =
    "https://gateway.pinata.cloud/ipfs/QmcFc5kmpbRvhoQjfUfR2PmUotJQsz3s83rt22529xnvcB";

let Certificate, certificate, owner, addr1, addr2;

const privateKey =
    "1f5deadd9e3e400c6f1139a9b43e328cecfec331285a89d78eb25a96f77e07b8";

const Name = "Certificate"
const Symbol = "CTS"
const Version = "V1"
let signer

const getLatestBlock = async () => {
    const getCurrentBlock = await ethers.provider.getBlockNumber();
    const getBlock = (await ethers.provider.getBlock(getCurrentBlock)).timestamp;
    return getBlock
}
const getChainId = async () => {
    const getId = await ethers.provider.getNetwork()
    return getId.chainId
}

const genrateCompactSigature = async (signer, ...args) => {
    console.log("===>", args.owner)
    const signatureValues = await toTypedSignature(...args)

    // const signature = await signer._signTypedData(signatureValues.domain, signatureValues.types, signatureValues.agreement);
    // const { compact } = utils.splitSignature(signature);
    // return compact;

}

const toTypedSignature = async (
    getAddressOfContract, owner, addr2, chainId
) => {
    console.log("=============>", getAddressOfContract, owner.address, addr2.address, chainId)
    const types = {
        Agreement: [
            { name: "active", type: "address" },
            { name: "passive", type: "address" },
            { name: "tokenURI", type: "string" },
        ],
    };
    const domain = {
        name: Name,
        version: Version,
        chainId: chainId,
        verifyingContract: getAddressOfContract,
    };

    const agreement = {
        active: addr1.address,
        passive: addr2.address,
        tokenURI: MetaData,
    };

    return { types, agreement, domain }
}




describe("Certifications ", async () => {
    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        signer = new ethers.Wallet(privateKey)

        Certificate = await ethers.getContractFactory("Certificate")
        certificate = await Certificate.deploy(Name, Symbol, Version)
    })

    describe("Has Properties", () => {
        it("Should Have Correct Name & Symbol", async () => {
            const getName = await certificate.connect(owner).name()
            const getSymbol = await certificate.connect(owner).symbol()
            expect(getName).to.equal(Name)
            expect(getSymbol).to.equal(Symbol)
        })
    })

    describe("Give Certificate", () => {
        it("should able to give certificate", async () => {
            const chainId = await getChainId()
            const getAddressOfContract = certificate.address
            const args = [getAddressOfContract, chainId, owner, addr2]
            const getSign = await genrateCompactSigature(signer, ...args)
            // console.log(getSign)


        })

    })

})

