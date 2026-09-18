# ArcPay Proof

ArcPay Proof is a small Web3 payment proof application built to demonstrate verifiable USDC payments on Arc Mainnet.

The app connects a user's wallet, reads their USDC balance, sends USDC to a recipient, waits for the transaction to be confirmed, and displays a payment proof containing the network, recipient, transaction hash, and a link to verify the transaction on ArcScan.

## Live Demo

https://arcpay-proof-git-master-arc-pay-proof.vercel.app

## What Arc Is Used For

ArcPay Proof uses Arc Mainnet as the blockchain settlement layer for USDC payments.

The application uses Arc Mainnet to:

* Connect a user's wallet
* Read the user's USDC balance
* Send USDC transactions
* Confirm transactions on-chain
* Provide a verifiable transaction hash

## How It Works

1. Connect a wallet to Arc Mainnet.
2. Enter the recipient's wallet address.
3. Enter the USDC amount.
4. Confirm the transaction in the wallet.
5. Wait for the Arc Mainnet transaction to be confirmed.
6. View the resulting payment proof.
7. Verify the transaction using ArcScan.

## Example Transaction

A real USDC payment was tested on Arc Mainnet during development.

Transaction hash:

`0x8347974616adb72d93c31084bf5bb13e5604c34ce9ae635c2059a8ab49c27c29`

## Tech Stack

* React
* Vite
* JavaScript
* ethers.js
* USDC on Arc Mainnet

## Arc Mainnet

* Chain ID: `5042`
* USDC contract: `0x3600000000000000000000000000000000000000`

## Project Purpose

ArcPay Proof is a proof-of-concept demonstrating how a simple application can use USDC on Arc Mainnet to create a transparent and verifiable payment experience.

## Repository

https://github.com/Dringim1/arcpay-proof
