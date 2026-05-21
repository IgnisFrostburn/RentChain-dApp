import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true, // Recommended for IPFS/decentralized apps
		remotePatterns: [
			{
				protocol: "https",
				hostname: "ipfs.io",
				pathname: "/ipfs/**",
			},
			{
				protocol: "https",
				hostname: "gateway.pinata.cloud",
				pathname: "/ipfs/**",
			},
			{
				protocol: "https",
				hostname: "nftstorage.link",
				pathname: "/ipfs/**",
			}
		],
	},
	webpack: (config) => {
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
			layers: true,
			topLevelAwait: true,
		};

		config.module.rules.push({
			test: /\.wasm$/,
			type: "webassembly/async",
		});

		config.output.webassemblyModuleFilename =
			"../static/wasm/[modulehash].wasm";

		return config;
	},
};

export default nextConfig;
