import { useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";
import { chainAiInstance } from "../../integration/chain-ai.api";
import {
  StyledChatArea,
  StyledMessageContainer,
  StyledMessageComponent,
  StyledChatBotContainer,
  StyledInputContainer,
  StyledTextArea,
  StyledSendButton,
  StyledDateLabel,
  StyledDateLabelContainer,
  StyledDisclaimer,
} from "./styles";
import { InputType, Message } from "./interfaces";
import { MessageLabel } from "./MessageLabel";
import { MessageContent } from "./MessageContent";
import { JsonMessage } from "./JsonMessage";
import {
  ChainAiApiResponse,
  ChainAiApiResponseError,
} from "../../integration/chain-ai.interface";
import { getChatStartDate } from "../../helpers/chat.helpers";
import { Alert, Button } from "antd";

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [context, setContext] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);


  const chatStartDate = getChatStartDate(messages);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install it.");
      }
  
      // Explicitly request account access every time
      const accounts = await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
  
      // After requesting permissions, retrieve the accounts again
      const updatedAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
  
      if (updatedAccounts.length > 0) {
        setWalletAddress(updatedAccounts[0]); // Save the connected wallet address
        addMessage(
          `Wallet connected: ${updatedAccounts[0]}`,
          InputType.Bot,
          false
        );
      } else {
        throw new Error("No accounts found. Please try again.");
      }
    } catch (error: any) {
      addMessage(
        `Failed to connect wallet: ${error.message || "Unknown error"}`,
        InputType.Bot,
        false
      );
    }
  };
  

  const addMessage = (
    text: string,
    type: InputType,
    isLoading: boolean,
    isJson: boolean = false,
    isMagicLink: boolean = false
  ): void => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, type, isLoading, isJson, isMagicLink, timestamp: new Date() },
    ]);
  };

  const updateBotResponse = (response: ChainAiApiResponse): void => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const lastBotIdx = newMessages.findIndex(
        (msg) => msg.isLoading && msg.type === InputType.Bot
      );

      if (lastBotIdx !== -1) {
        const result = response.results[0]?.data;
        if (result) {
          if ("magicLink" in result) {
            newMessages[lastBotIdx] = {
              text: result.magicLink as string,
              type: InputType.Bot,
              isJson: false,
              isLoading: false,
              timestamp: new Date(),
              isMagicLink: true,
            };
          } else {
            newMessages[lastBotIdx] = {
              text: JSON.stringify(result, null, 2),
              type: InputType.Bot,
              isJson: true,
              isLoading: false,
              timestamp: new Date(),
            };
          }

          if (response.results[0]?.status) {
            newMessages.push({
              text: response.results[0].status,
              type: InputType.Bot,
              isJson: false,
              isLoading: false,
              timestamp: new Date(),
            });
          }

          if (response.finalResponse) {
            newMessages.push({
              text: response.finalResponse,
              type: InputType.Bot,
              isJson: false,
              isLoading: false,
              timestamp: new Date(),
            });
          }
        } else {
          newMessages[lastBotIdx] = {
            ...newMessages[lastBotIdx],
            text: response.finalResponse || response.status || "Unknown status",
            isLoading: false,
          };
        }
      }
      return newMessages;
    });

    if (response.context) {
      setContext((prevContext) => {
        const newContext = [...prevContext, ...response.context];
        return newContext.length > 10 ? newContext.slice(-10) : newContext;
      });
    }
  };

  const handleError = (error: ChainAiApiResponseError): void => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.isLoading && msg.type === InputType.Bot
          ? {
              ...msg,
              text: error.response.data.error,
              isLoading: false,
            }
          : msg
      )
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    addMessage(userInput, InputType.User, false);
    setInput("");

    // Check for "generate an invoice" and trigger MetaMask interaction
    if (userInput.toLowerCase().includes("generate an invoice")) {
      addMessage("Preparing transaction...", InputType.Bot, true);
      await handleGenerateInvoice();
      return;
    }

    addMessage("Typing...", InputType.Bot, true);

    try {
      const response = await chainAiInstance.sendQuery(userInput, context);
      updateBotResponse(response);
    } catch (e) {
      const error = e as ChainAiApiResponseError;
      handleError(error);
    }
  };

  // MetaMask Interaction Function
  const handleGenerateInvoice = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install it.");
      }
  
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      // Switch to the desired Ethereum chain (e.g., Sepolia testnet)
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // 0xaa36a7 = Sepolia testnet
      });
  
      // Get user account
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const senderAddress = accounts[0];
  
      // Send a transaction (example values)
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: senderAddress,
            to: "0x49C2E4DB36D3AC470ad072ddC17774257a043097", // Replace with a valid address
            value: "0x2386F26FC10000", // 0.01 ETH in hexadecimal
            gas: "0x5208", // 21000 gas limit
          },
        ],
      });
  
      // Notify user the transaction is being processed
      addMessage(
        `Generaating Invoice...`,
        InputType.Bot,
        false
      );
  
      // Wait for transaction confirmation
      const confirmed = await waitForTransactionConfirmation(txHash);
  
      if (confirmed) {
        // Add the invoice details to the chat
        addMessage(
          `Invoice #1\n\nCreated\n\nFrom:\n0x486BEa6B90243d2Ff3EE2723a47605C3361c3d95\n\nBilled to:\n${senderAddress}\n\nPayment Chain:\nsepolia\n\nInvoice Currency:\nFAU\n\nSettlement Currency:\nFAU\n\nDescription\tQty\tUnit \tDiscount\tTax\tAmount\n  For Loan\nSettlements\t1\t1\t0\t1\t0\t1`,
          InputType.Bot,
          false,
          false
        );
  
        // Add the transaction hash as a clickable link
        // addMessage(
        //   `Pay Transaction: https://invoicing.request.network/`,
        //   InputType.Bot,
        //   false,
        //   false,
        //   true
        //);
      }
    } catch (error: any) {
      addMessage(
        `Transaction failed: ${error.message || "Unknown error occurred"}`,
        InputType.Bot,
        false
      );
    }
  };
  
  // Helper function to wait for transaction confirmation
  const waitForTransactionConfirmation = async (txHash: string) => {
    while (true) {
      try {
        const receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        });
  
        if (receipt && receipt.status) {
          return true; // Transaction confirmed
        }
  
        // Wait for a while before checking again
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        console.error("Error checking transaction status:", error);
        break;
      }
    }
  
    return false; // Transaction failed or never confirmed
  };
  

  return (
    <StyledChatBotContainer>
    <button className="wallet-connect" onClick={connectWallet}>
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>
      <StyledChatArea>
        <StyledDateLabelContainer>
          {chatStartDate && <StyledDateLabel>{chatStartDate}</StyledDateLabel>}
        </StyledDateLabelContainer>
        {messages.map((msg, index) => (
          <StyledMessageContainer key={index} message={msg}>
            <MessageLabel type={msg.type} isJson={msg.isJson} />
            <StyledMessageComponent message={msg}>
              {msg.isMagicLink ? (
                <Alert
                  message="Transaction Ready"
                  description={
                    <div>
                      <p>Click the button below to sign the transaction:</p>
                      <Button type="primary" href={msg.text} target="_blank">
                        Sign Transaction
                      </Button>
                    </div>
                  }
                  type="info"
                  showIcon
                />
              ) : msg.isJson ? (
                <JsonMessage text={msg.text} />
              ) : (
                <MessageContent message={msg} />
              )}
            </StyledMessageComponent>
          </StyledMessageContainer>
        ))}
      </StyledChatArea>
      <StyledInputContainer>
        <StyledTextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
          onKeyPress={handleKeyPress}
          placeholder="Message AI Agent"
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <StyledSendButton onClick={handleSend} icon={<ArrowUpOutlined />} />
      </StyledInputContainer>
      <StyledDisclaimer>Powered by Request Network</StyledDisclaimer>
    </StyledChatBotContainer>
  );
}
