import React from "react";
import "./balances.css";

function AllBalance({ accounts, balances }) {
    return (
        <table>
            <tbody>
                <tr>
                    <th>Accounts</th>
                    <th>Balances</th>
                </tr>
                {accounts.map((address, index) => (
                    <tr key={index}>
                        <td>{address}</td>
                        <td>{balances[index]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default AllBalance;
