const { utils, Wallet } = require('ethers')


const genrateCompactSigature = async (signer, types, domain, agreement) => {
    const signature = await signer._signTypedData(domain, types, agreement);
    const { compact } = utils.splitSignature(signature);
    return compact;

}

exports.getSignature = async (passiveAddress, passivePrivateKey, Name, Version, MetaData, singerAddress, chainId, getAddressOfContract) => {

    console.log("===========>", passiveAddress, passivePrivateKey, Name, Version, MetaData, singerAddress, chainId, getAddressOfContract)
    const signer1 = new Wallet(passivePrivateKey);
    const addressOfSigner = signer1.address;
    console.log(addressOfSigner)

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
        active: singerAddress,
        passive: passiveAddress,
        tokenURI: MetaData,
    };
    const compactSignature = await genrateCompactSigature(signer1,
        types,
        domain,
        agreement)
    return { addressOfSigner, compactSignature }



}
