const { ethers } = require("hardhat")
const { expect } = require("chai")
const { getSignature } = require('../lib/genrateSig')

const MetaData =
    "https://gateway.pinata.cloud/ipfs/QmcFc5kmpbRvhoQjfUfR2PmUotJQsz3s83rt22529xnvcB";

let Certificate, certificate, singer, addr1, addr2;

const passiveAddress = "0x0f6A79A579658E401E0B81c6dde1F2cd51d97176"
const passivePrivateKey =
    "0xad54bdeade5537fb0a553190159783e45d02d316a992db05cbed606d3ca36b39";

const Name = "Certificate"
const Symbol = "CTS"
const Version = "V1"

const getLatestBlock = async () => {
    const getCurrentBlock = await ethers.provider.getBlockNumber();
    return getCurrentBlock
}
const getChainId = async () => {
    const getId = await ethers.provider.getNetwork()
    return getId.chainId
}

describe("Certifications ", async () => {
    beforeEach(async () => {
        [singer, addr1, addr2] = await ethers.getSigners();
        Certificate = await ethers.getContractFactory("Certificate")
        certificate = await Certificate.deploy(Name, Symbol, Version)
    })

    describe("Has Properties", () => {
        it("Should Have Correct Name & Symbol", async () => {
            const getName = await certificate.connect(singer).name()
            const getSymbol = await certificate.connect(singer).symbol()
            expect(getName).to.equal(Name)
            expect(getSymbol).to.equal(Symbol)
        })
    })

    describe("Give Certificate", () => {
        it("should able to give certificate", async () => {
            const chainId = await getChainId()
            const getAddressOfContract = (certificate.address).toString()
            const singerAddress = (singer.address).toString()
            const getSign = await getSignature(passiveAddress, passivePrivateKey, Name, Version, MetaData, singerAddress, chainId, getAddressOfContract)

        })

    })




})