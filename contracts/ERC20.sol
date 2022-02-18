// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ERC20 {
    string public name;
    string public symbol;
    uint256 totalTokens;

    mapping (address => uint) balances;
    mapping (address => mapping(address => uint256)) allowed;
    constructor(string memory _name, string memory _symbol, uint256 _totalTokens){
        name = _name;
        symbol = _symbol;
        totalTokens = _totalTokens;
        //creater of the contract has the initial tokens
        balances[msg.sender] = totalTokens;
    }

    event Transfer(address sender, address receiver, uint256 amount);
    event Approval(address owner, address receiver, uint256 amount);

    function totalSupply() external view returns(uint256){
       return totalTokens;
    }

    function balanceOf(address account) external view returns(uint256){
        return balances[account];
    }

    //functions for providing access to 3rd parties to withdraw from the account
    function approve(address receiver, uint256 amount) external returns(bool){
        require(msg.sender != receiver, "you are not allowed to send tokens to yourself");
        allowed[msg.sender][receiver] = amount;
        emit Approval(msg.sender, receiver, amount);
        return true;
    }
    //check if the 3rd party transfer is allowed
    function allowance(address sender, address receiver) external view returns(uint256){
        return allowed[sender][receiver];
    }
    //3rd party transaction, payment made between two accounts through you
    function transferFrom(address owner, address receiver, uint256 amount) external returns(bool){
        require(balances[owner] >= amount, "your balance is insufficient");
        require(allowed[owner][msg.sender] >= amount, 
        "you are not allowed to withdraw more than allowed");

        balances[owner] -= amount;
        allowed[owner][msg.sender] -= amount;
        balances[receiver] += amount;
        emit Transfer(owner, receiver, amount);

        return true;
    }

    function transfer(address receiver, uint256 amount) external payable returns(bool){
        require(balances[msg.sender] >= amount, "insufficent balance");

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Transfer(msg.sender,  receiver, amount);
        return true;
    }
    
}
