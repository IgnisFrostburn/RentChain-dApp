import { useState, useEffect } from "react";
import { TransactionTrackingService } from "@/services/TransactionTrackingService";
import { Property } from "@/types/property";

export function useTransactionTracker(property: Property | undefined, walletAddress: string | null) {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [txStatus, setTxStatus] = useState<string>("pending");
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [isRentedByOthers, setIsRentedByOthers] = useState(false);
	const [txHash, setTxHash] = useState<string | null>(null);

	// Check for existing pending transaction on mount
	useEffect(() => {
		if (!property?.id || !walletAddress) return;

		const checkPersistentTx = async () => {
			const savedTx = localStorage.getItem(`pendingTx_${property.id}_${walletAddress}`);
			if (savedTx) {
				console.log(`[useTransactionTracker] Found saved tx hash: ${savedTx}`);

				// 1. Immediately restore the UI to "Syncing" state
				setTxHash(savedTx);
				setIsSubmitted(true);
				setTxStatus("pending");

				// 2. Verify status with DB in the background
				const status = await TransactionTrackingService.checkInitialStatus(savedTx);
				if (status === "confirmed") {
					setIsConfirmed(true);
					localStorage.removeItem(`pendingTx_${property.id}_${walletAddress}`);
				} else if (status === "failed") {
					setTxStatus("failed");
				} else if (status === "pending") {
					setTxStatus("pending");
				}
			}
		};

		checkPersistentTx();
	}, [property, walletAddress]);

	// Real-time listener for transaction status updates
	useEffect(() => {
		if (!txHash || isConfirmed) return;

		console.log(`[useTransactionTracker] Subscribing to updates for tx: ${txHash}`);
		const channel = TransactionTrackingService.subscribeToStatus(txHash, (status) => {
			console.log("[useTransactionTracker] Status update received:", status);
			setTxStatus(status);

			if (status === "confirmed" && property) {
				setIsConfirmed(true);
				if (walletAddress) {
					localStorage.removeItem(`pendingTx_${property.id}_${walletAddress}`);
					// Local tracking for UI consistency
					const rentedByWallet = JSON.parse(
						localStorage.getItem(`rentedProperties_${walletAddress}`) || "[]",
					);
					if (!rentedByWallet.includes(property.metadataIpfsHash || property.id)) {
						rentedByWallet.push(property.metadataIpfsHash || property.id);
						localStorage.setItem(
							`rentedProperties_${walletAddress}`,
							JSON.stringify(rentedByWallet),
						);
					}
				}
			} else if (status === "failed" && property && walletAddress) {
				localStorage.removeItem(`pendingTx_${property.id}_${walletAddress}`);
			}
		});

		// Fallback Polling (Every 15s) in case Realtime is blocked or fails
		const interval = setInterval(async () => {
			if (isConfirmed) return;

			console.log("[useTransactionTracker] Fallback status check...");
			const status = await TransactionTrackingService.checkInitialStatus(txHash);

			if (status) {
				setTxStatus(status);
				if (status === "confirmed" && property && walletAddress) {
					setIsConfirmed(true);
					localStorage.removeItem(`pendingTx_${property.id}_${walletAddress}`);
					clearInterval(interval);
				} else if (status === "failed" && property && walletAddress) {
					localStorage.removeItem(`pendingTx_${property.id}_${walletAddress}`);
					clearInterval(interval);
				}
			}
		}, 10000);

		return () => {
			TransactionTrackingService.unsubscribe(channel);
			clearInterval(interval);
		};
	}, [txHash, walletAddress, property, isConfirmed]);

	useEffect(() => {
		const checkRentalStatus = async () => {
			if (!property?.metadataIpfsHash || !walletAddress) return;

			try {
				// Fetch all rented CIDs from the blockchain via our API
				const response = await fetch("/api/rentals");
				if (response.ok) {
					const rentedCIDs = await response.json();
					const isRentedOnChain = rentedCIDs.includes(property.metadataIpfsHash);

					if (isRentedOnChain) {
						const myRentals = JSON.parse(
							localStorage.getItem(`rentedProperties_${walletAddress}`) || "[]",
						);
						if (
							myRentals.includes(property.id) ||
							myRentals.includes(property.metadataIpfsHash)
						) {
							setIsConfirmed(true);
						} else {
							setIsRentedByOthers(true);
						}
					}
				}
			} catch (error) {
				console.error("Error checking rental status:", error);
			}
		};

		checkRentalStatus();
	}, [property, walletAddress]);

	return {
		isSubmitted,
		setIsSubmitted,
		txStatus,
		setTxStatus,
		isConfirmed,
		isRentedByOthers,
		txHash,
		setTxHash,
	};
}
