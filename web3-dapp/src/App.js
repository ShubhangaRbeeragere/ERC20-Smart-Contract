/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Web3 from "web3";
import ABI from "./abi.json";
import SelectAccount from "./components/accountInfo/selectAccount";
import AllBalance from "./components/balances/allBalance";

function App() {
    //for selecting 'from' account with options
    const [account, setAccount] = useState({
        selected: "",
        options: [],
        balance: null,
    });

    //for selecting 'to' account with options
    const [toAccount, setToAccount] = useState({
        selected: "",
        options: [],
        amount: 1000,
    });
    //for getting all the accounts and balances
    const [allAccounts, setAllAccounts] = useState({
        accounts: [],
        balances: [],
    });

    //initialize the smart contract
    let web3 = new Web3("HTTP://127.0.0.1:7546");
    let contract = new web3.eth.Contract(
        ABI,
        "0xe13A661eabb2565274A3F04E61320BDcC741Db3B"
    );
    //get all the accounts
    let getAccounts = async () => {
        let accountData = [];
        try {
            accountData = await web3.eth.getAccounts();
            setAccount({
                ...account,
                options: accountData,
                selected: accountData[0],
            });
            setToAccount({
                ...toAccount,
                options: accountData,
                selected: accountData[0],
            });
        } catch (err) {
            console.log(err);
        }
    };
    //get the balance of the account
    let getBalance = (address) => {
        contract.methods
            .balanceOf(address)
            .call()
            .then((data) => setAccount({ ...account, balance: data }));
    };

    //get all the balance of all the accounts
    //in the smart contract
    let getAllBalance = async () => {
        try {
            let accounts = await web3.eth.getAccounts();
            let accountBalance;
            let allAccounts = [];
            let accountBalances = [];
            for (let account of accounts) {
                accountBalance = await contract.methods
                    .balanceOf(account)
                    .call();
                accountBalances.push(accountBalance);
                allAccounts.push(account);
            }
            // console.log(`accounts: ${allAccounts}\nbalance: ${accountBalances}\n`);
            setAllAccounts({
                accounts: allAccounts,
                balances: accountBalances,
            });
        } catch (err) {
            console.error(err);
        }
    };
    let transfer = (from, to, amount) => {
        contract.methods
            .transfer(to, amount)
            .send({ from: from, value: "1000" })
            .on("receipt", (data) => {
                console.log(data);
                getAllBalance();
            })
            .on("error", (err, receipt) => {
                if (err) {
                    console.error(
                        "error--=====----\n",
                        err,
                        "\nerror--=====----"
                    );
                } else console.error(receipt);
            });
    };
    ///////////////////////////////////////////////////////////
    useEffect(() => {
        getAccounts();
        getAllBalance();
    }, []);

    //this is for displaying table of accounts and balances
    useEffect(() => {
        if (account.selected.length > 0) {
            getBalance(account.selected);
        }
    }, [account.selected]);

    //get all the accounts in the smart contract

    return (
        <div className="App">
            <p>select Account:</p>
            {account && (
                <SelectAccount account={account} setAccount={setAccount} />
            )}

            <p>balance:</p>
            {account.balance}

            <p>all Accounts</p>
            <AllBalance
                accounts={allAccounts.accounts}
                balances={allAccounts.balances}
            />

            <p>select Account to send token:</p>
            {toAccount && (
                <>
                    <SelectAccount
                        account={toAccount}
                        setAccount={setToAccount}
                    />
                    <input
                        type="number"
                        value={toAccount.amount}
                        onChange={(e) => {
                            e.target.value > 0
                                ? setToAccount({
                                      ...toAccount,
                                      amount: e.target.value,
                                  })
                                : setToAccount({
                                      ...toAccount,
                                      amount: 0,
                                  });
                        }}
                    />
                    <button
                        onClick={() => {
                            transfer(
                                account.selected,
                                toAccount.selected,
                                toAccount.amount
                            );
                        }}
                    >
                        Send
                    </button>
                </>
            )}
        </div>
    );
}

export default App;
