const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("deploying, please wait");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment(1);
  console.log(`Contract Address: ${contract.target}`);

 
  // console.log("lets deploy with only transaction data");
  // const nonce = await wallet.getNonce()
  // const tx = {
  //     nonce: nonce,
  //     gasPrice: 20000000000,
  //     gasLimit:1000000,
  //     to: null,
  //     value: 0,
  //     data: "0x608060405234801561001057600080fd5b50610771806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80632e64cec11461005c5780636057361d1461007a5780638bab8dd5146100965780639e7a13ad146100c6578063bc832d4e146100f7575b600080fd5b610064610113565b604051610071919061052a565b60405180910390f35b610094600480360381019061008f9190610411565b61011c565b005b6100b060048036038101906100ab91906103c8565b610126565b6040516100bd919061052a565b60405180910390f35b6100e060048036038101906100db9190610411565b610154565b6040516100ee929190610545565b60405180910390f35b610111600480360381019061010c919061043e565b610210565b005b60008054905090565b8060008190555050565b6002818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b6001818154811061016457600080fd5b906000526020600020906002020160009150905080600001549080600101805461018d9061063e565b80601f01602080910402602001604051908101604052809291908181526020018280546101b99061063e565b80156102065780601f106101db57610100808354040283529160200191610206565b820191906000526020600020905b8154815290600101906020018083116101e957829003601f168201915b5050505050905082565b600160405180604001604052808481526020018381525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190805190602001906102769291906102a0565b5050508160028260405161028a9190610513565b9081526020016040518091039020819055505050565b8280546102ac9061063e565b90600052602060002090601f0160209004810192826102ce5760008555610315565b82601f106102e757805160ff1916838001178555610315565b82800160010185558215610315579182015b828111156103145782518255916020019190600101906102f9565b5b5090506103229190610326565b5090565b5b8082111561033f576000816000905550600101610327565b5090565b60006103566103518461059a565b610575565b90508281526020810184848401111561037257610371610704565b5b61037d8482856105fc565b509392505050565b600082601f83011261039a576103996106ff565b5b81356103aa848260208601610343565b91505092915050565b6000813590506103c281610724565b92915050565b6000602082840312156103de576103dd61070e565b5b600082013567ffffffffffffffff8111156103fc576103fb610709565b5b61040884828501610385565b91505092915050565b6000602082840312156104275761042661070e565b5b6000610435848285016103b3565b91505092915050565b600080604083850312156104555761045461070e565b5b6000610463858286016103b3565b925050602083013567ffffffffffffffff81111561048457610483610709565b5b61049085828601610385565b9150509250929050565b60006104a5826105cb565b6104af81856105d6565b93506104bf81856020860161060b565b6104c881610713565b840191505092915050565b60006104de826105cb565b6104e881856105e7565b93506104f881856020860161060b565b80840191505092915050565b61050d816105f2565b82525050565b600061051f82846104d3565b915081905092915050565b600060208201905061053f6000830184610504565b92915050565b600060408201905061055a6000830185610504565b818103602083015261056c818461049a565b90509392505050565b600061057f610590565b905061058b8282610670565b919050565b6000604051905090565b600067ffffffffffffffff8211156105b5576105b46106d0565b5b6105be82610713565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b82818337600083830152505050565b60005b8381101561062957808201518184015260208101905061060e565b83811115610638576000848401525b50505050565b6000600282049050600182168061065657607f821691505b6020821081141561066a576106696106a1565b5b50919050565b61067982610713565b810181811067ffffffffffffffff82111715610698576106976106d0565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61072d816105f2565b811461073857600080fd5b5056fea2646970667358221220fdf33ee8306b1c4bc27ab89869573a3b0dbd3bc924017a8bfac2176c12b7c9ab64736f6c63430008070033",
  //     chainId: 1337,
  // };
  // const sentTxResponse = await wallet.sendTransaction(tx);
  // await sentTxResponse.wait(1);
  // console.log(sentTxResponse);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite number: ${currentFavoriteNumber.toString()}`);
  const transactionResponse = await contract.store("10");
  const transactionReciept = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`updated favorite number: ${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
