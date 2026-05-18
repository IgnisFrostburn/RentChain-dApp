/**
 * IPFS Utility for generating gateway URLs
 */

// List of reliable public IPFS gateways
const GATEWAYS = [
	"https://gateway.pinata.cloud/ipfs/",
	"https://nftstorage.link/ipfs/",
	"https://cloudflare-ipfs.com/ipfs/",
	"https://ipfs.io/ipfs/",
	"https://dweb.link/ipfs/",
];

/**
 * Converts an IPFS hash (CID) or ipfs:// URL into a gateway URL.
 * Defaults to Pinata for better reliability in restricted networks.
 */
export const getIpfsUrl = (hash?: string): string => {
	if (!hash) return "";

	// Remove ipfs:// prefix if it exists
	const cleanHash = hash.replace(/^ipfs:\/\//, "");

	// If it's already a full URL, return it
	if (cleanHash.startsWith("http")) return cleanHash;

	// Use Pinata as the primary gateway as it often resolves better
	return `${GATEWAYS[0]}${cleanHash}`;
};
