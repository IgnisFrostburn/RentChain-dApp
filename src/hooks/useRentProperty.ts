import { useState } from "react";
import { sendLovelace } from "@/utils/transaction";
import { Property } from "@/types/property";

interface UseRentPropertyProps {
	property: Property;
	wallet: any;
	walletAddress: string | null;
	isRentedByOthers: boolean;
	setTxHash: (hash: string | null) => void;
	setIsSubmitted: (submitted: boolean) => void;
	setTxStatus: (status: string) => void;
}

export function useRentProperty({
	property,
	wallet,
	walletAddress,
	isRentedByOthers,
	setTxHash,
	setIsSubmitted,
	setTxStatus,
}: UseRentPropertyProps) {
	const [isPending, setIsPending] = useState(false);

	const handlePayment = async () => {
		if (!wallet || !property || !walletAddress) return;

		// Guard: Already rented
		if (isRentedByOthers || property.status === "Rented") {
			alert("This property is already rented.");
			return;
		}

		try {
			setIsPending(true);
			// Pass metadataCID to link this payment to the property on-chain
			const hash = await sendLovelace(
				wallet,
				property.landlordAddress,
				(property.depositADA * 1000000).toString(),
				property.metadataIpfsHash,
			);

			console.log("[useRentProperty] Transaction submitted:", hash);

			// Persist txHash locally so it survives refresh
			localStorage.setItem(`pendingTx_${property.id}_${walletAddress}`, hash);

			setTxHash(hash);
			setIsSubmitted(true);
			setTxStatus("pending");
		} catch (error) {
			console.error("Payment error:", error);
			alert("Error processing payment. See console for details.");
		} finally {
			setIsPending(false);
		}
	};

	return {
		isPending,
		handlePayment,
	};
}
