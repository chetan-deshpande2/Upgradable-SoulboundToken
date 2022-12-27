const { ethers } = require("hardhat")
const { expect } = require("chai")
const { utils, Wallet } = require('ethers')
const { getSignature } = require('../lib/genrateSig')

const MetaData =
    "https://gateway.pinata.cloud/ipfs/QmcFc5kmpbRvhoQjfUfR2PmUotJQsz3s83rt22529xnvcB";

let Certificate, certificate, owner, issuer, claimant;

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

const genrateCompactSigature = async (issuer) => {
    const signatureValues = await toTypedSignature()

    const signature = await issuer._signTypedData(signatureValues.domain, signatureValues.types, signatureValues.agreement);
    const { compact } = utils.splitSignature(signature);
    return compact;


}

const toTypedSignature = async () => {
    const chianId = await getChainId()
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
        chainId: chianId,
        verifyingContract: certificate.address,
    };

    const agreement = {
        active: claimant.address,
        passive: issuer.address,
        tokenURI: MetaData,
    };

    return { types, agreement, domain }
}




describe("Certifications ", async () => {
    beforeEach(async () => {
        [owner, issuer, claimant] = await ethers.getSigners();
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

    describe("Match Hash", () => {
        it("Should Match Off-Chain Hash with On-Chain Hash", async () => {
            const typedData = await toTypedSignature()
            const offChainHash = utils._TypedDataEncoder.hash(
                typedData.domain, typedData.types, typedData.agreement
            )
            const onChainHash = await certificate._getHash(typedData.agreement.active, typedData.agreement.passive, typedData.agreement.tokenURI)
            expect(offChainHash).to.equal(onChainHash)
        })

    })

    describe("Give Certificate", () => {
        it("should able to give certificate", async () => {
            const getSign = await genrateCompactSigature(issuer)
            const typedData = await toTypedSignature()
            console.log(getSign)
            const giveCertificate = await certificate.connect(claimant).give(typedData.agreement.passive, typedData.agreement.tokenURI, getSign)


        })

    })



})

