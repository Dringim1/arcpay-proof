import { useState } from "react";
import { BrowserProvider, Contract, parseUnits, isAddress } from "ethers";

const ARC_CHAIN_ID = 5042;
const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";

const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

function App() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("");
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("");
  const [txHash, setTxHash] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("No Web3 wallet detected. Please install MetaMask.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      const networkInfo = await provider.getNetwork();
      const chainId = Number(networkInfo.chainId);

      setWallet(accounts[0]);

      if (chainId !== ARC_CHAIN_ID) {
        setNetwork(`Chain ID: ${chainId}`);
        setStatus("Please switch your wallet to Arc Mainnet.");
        return;
      }

      setNetwork("Arc Mainnet");

      const usdc = new Contract(USDC_ADDRESS, USDC_ABI, provider);
      const rawBalance = await usdc.balanceOf(accounts[0]);
      const formattedBalance = Number(rawBalance) / 1_000_000;

      setBalance(formattedBalance.toFixed(2));
      setStatus("Wallet connected to Arc Mainnet.");
    } catch (error) {
      console.error(error);
      setStatus("Wallet connection was cancelled or failed.");
    }
  };

  const handlePayment = async () => {
    setTxHash("");

    if (!wallet) {
      setStatus("Please connect your wallet first.");
      return;
    }

    if (network !== "Arc Mainnet") {
      setStatus("Please connect your wallet to Arc Mainnet first.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setStatus("Please enter a valid USDC amount.");
      return;
    }

    if (!recipient || !isAddress(recipient)) {
      setStatus("Please enter a valid Ethereum wallet address.");
      return;
    }

    if (Number(amount) > Number(balance)) {
      setStatus("Insufficient USDC balance.");
      return;
    }

    try {
      setStatus("Preparing USDC transaction...");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const usdc = new Contract(USDC_ADDRESS, USDC_ABI, signer);
      const amountInUnits = parseUnits(amount, 6);

      setStatus("Please confirm the transaction in your wallet...");

      const tx = await usdc.transfer(recipient, amountInUnits);

      setTxHash(tx.hash);
      setStatus("Transaction submitted. Waiting for confirmation...");

      await tx.wait();

      setStatus("Payment confirmed on Arc Mainnet.");

      const updatedBalance = await usdc.balanceOf(wallet);
      setBalance((Number(updatedBalance) / 1_000_000).toFixed(2));
    } catch (error) {
      console.error(error);

      if (error?.code === "ACTION_REJECTED") {
        setStatus("Transaction cancelled in wallet.");
      } else {
        setStatus("Transaction failed. Please try again.");
      }
    }
  };

  const explorerUrl = txHash
    ? `https://arc-scan.org/tx/${txHash}`
    : "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.35), transparent 30%), radial-gradient(circle at 85% 15%, rgba(20, 184, 166, 0.3), transparent 28%), linear-gradient(135deg, #07111f, #0f172a 55%, #083344)",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#17202a",
      }}
    >
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h1
            style={{
              marginBottom: "8px",
              color: "white",
              fontSize: "36px",
            }}
          >
            ArcPay Proof
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              marginTop: 0,
            }}
          >
            Verifiable USDC payment proof on Arc
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
          }}
        >
          {!wallet ? (
            <button
              onClick={connectWallet}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <div
              style={{
                background: "#f7f8fa",
                padding: "18px",
                borderRadius: "14px",
                marginBottom: "22px",
                border: "1px solid #eaecf0",
              }}
            >
              <p style={{ margin: "0 0 8px" }}>
                <strong>Wallet</strong>
              </p>

              <p
                style={{
                  margin: "0 0 14px",
                  wordBreak: "break-all",
                  fontSize: "13px",
                  color: "#475467",
                }}
              >
                {wallet}
              </p>

              <p style={{ margin: "7px 0" }}>
                <strong>Network:</strong> {network}
              </p>

              <p style={{ margin: "7px 0" }}>
                <strong>USDC Balance:</strong> {balance} USDC
              </p>
            </div>
          )}

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "bold",
            }}
          >
            Recipient
          </label>

          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "16px",
              boxSizing: "border-box",
              border: "1px solid #d0d5dd",
              borderRadius: "10px",
              fontSize: "14px",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "bold",
            }}
          >
            Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.000001"
            placeholder="0.00 USDC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "18px",
              boxSizing: "border-box",
              border: "1px solid #d0d5dd",
              borderRadius: "10px",
              fontSize: "14px",
            }}
          />

          <button
            onClick={handlePayment}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              background: "#17202a",
              color: "white",
            }}
          >
            Send USDC & Create Proof
          </button>

          {status && (
            <div
              style={{
                marginTop: "18px",
                padding: "12px",
                background: "#f7f8fa",
                borderRadius: "10px",
                fontSize: "14px",
              }}
            >
              {status}
            </div>
          )}

          {txHash && (
            <div
              style={{
                marginTop: "25px",
                border: "1px solid #d0d5dd",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  padding: "22px",
                  background: "#17202a",
                  color: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      opacity: 0.75,
                      letterSpacing: "1px",
                    }}
                  >
                    PAYMENT PROOF
                  </div>

                  <div
                    style={{
                      background: "#16a34a",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    CONFIRMED
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  {amount} USDC
                </div>

                <div
                  style={{
                    marginTop: "7px",
                    fontSize: "13px",
                    opacity: 0.7,
                  }}
                >
                  Verified payment on Arc Mainnet
                </div>
              </div>

              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    padding: "13px",
                    background: "#f7f8fa",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#667085",
                      marginBottom: "5px",
                    }}
                  >
                    NETWORK
                  </div>
                  <strong>Arc Mainnet</strong>
                </div>

                <div
                  style={{
                    padding: "13px",
                    background: "#f7f8fa",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#667085",
                      marginBottom: "5px",
                    }}
                  >
                    RECIPIENT
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      wordBreak: "break-all",
                    }}
                  >
                    {recipient}
                  </div>
                </div>

                <div
                  style={{
                    padding: "13px",
                    background: "#f7f8fa",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#667085",
                      marginBottom: "5px",
                    }}
                  >
                    TRANSACTION HASH
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      wordBreak: "break-all",
                    }}
                  >
                    {txHash}
                  </div>
                </div>

                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "13px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    marginTop: "18px",
                    background: "#17202a",
                    color: "white",
                  }}
                >
                  Verify on ArcScan ↗
                </a>
              </div>
            </div>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.65)",
            fontSize: "13px",
            marginTop: "20px",
          }}
        >
          Built with USDC on Arc Mainnet
        </p>
      </div>
    </div>
  );
}

export default App;