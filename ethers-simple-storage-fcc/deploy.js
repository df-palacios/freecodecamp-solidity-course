const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()
async function main() {
    //RPC server endpoint:  http://127.0.0.1:7545
    //chainId: 1337, put this in ganache
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8",
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy() //stop here, wait for contract to deploy!
    await contract.deployTransaction.wait(1)
    console.log(`Contract Address: ${contract.address}`)
    //get number
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`)
    const transactionResponse = await contract.store("10")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`Updated favorite number is: ${updatedFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
