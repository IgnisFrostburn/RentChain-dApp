import { useEffect, useState, useCallback } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	useMapEvents,
	useMap,
} from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import {
	Layers,
	Map as MapIcon,
	Satellite,
	Maximize2,
	Minimize2,
	Trash2,
} from "lucide-react";

// Fix for default marker icon in Leaflet + Next.js
const icon = L.icon({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

interface MapProps {
	center?: [number, number];
	zoom?: number;
	onLocationChange?: (lat: number | null, lng: number | null) => void;
	onAddressChange?: (address: string) => void;
	interactive?: boolean;
	location?: [number, number];
}

const TILE_LAYERS = {
	dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
	satellite:
		"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
	normal: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

function SearchField({
	onLocationChange,
	onAddressChange,
}: {
	onLocationChange?: (lat: number | null, lng: number | null) => void;
	onAddressChange?: (address: string) => void;
}) {
	const map = useMap();

	useEffect(() => {
		const provider = new OpenStreetMapProvider();

		// @ts-ignore
		const searchControl = new GeoSearchControl({
			provider: provider,
			style: "bar",
			showMarker: false, // Don't show the buggy default marker
			showPopup: false,
			autoClose: true,
			retainZoomLevel: false,
			animateZoom: true,
			keepResult: true,
			searchLabel: "Search location...",
			position: "topright",
		});

		map.addControl(searchControl);

		// @ts-ignore
		map.on("geosearch/showlocation", (result: any) => {
			const { x, y, label } = result.location;

			// Center the map exactly on the result
			map.flyTo([y, x], 17);

			if (onLocationChange) {
				onLocationChange(y, x);
			}
			if (onAddressChange) {
				onAddressChange(label);
			}
		});

		return () => {
			map.removeControl(searchControl);
		};
	}, [map, onLocationChange, onAddressChange]);

	return null;
}

function LocationMarker({
	onLocationChange,
	onAddressChange,
	interactive,
	location,
	isExpanded,
}: {
	onLocationChange?: (lat: number | null, lng: number | null) => void;
	onAddressChange?: (address: string) => void;
	interactive?: boolean;
	location?: [number, number];
	isExpanded: boolean;
}) {
	const map = useMap();

	// Force map to recalculate size when expanding/collapsing
	useEffect(() => {
		setTimeout(() => {
			map.invalidateSize();
		}, 300);
	}, [isExpanded, map]);

	const reverseGeocode = useCallback(
		async (lat: number, lng: number) => {
			try {
				const res = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
				);
				const data = await res.json();
				if (data && data.display_name && onAddressChange) {
					onAddressChange(data.display_name);
				}
			} catch (error) {
				console.error("Reverse geocoding error:", error);
			}
		},
		[onAddressChange],
	);

	useEffect(() => {
		if (location) {
			const latLng = L.latLng(location[0], location[1]);
			map.flyTo(latLng, map.getZoom());
		}
	}, [location, map]);

	useMapEvents({
		click(e) {
			if (interactive) {
				if (onLocationChange) {
					onLocationChange(e.latlng.lat, e.latlng.lng);
				}
				reverseGeocode(e.latlng.lat, e.latlng.lng);
			}
		},
	});

	return location ? (
		<Marker
			position={location}
			icon={icon}
		/>
	) : null;
}

export default function Map({
	center = [10.3157, 123.8854],
	zoom = 13,
	onLocationChange,
	onAddressChange,
	interactive = true,
	location,
}: MapProps) {
	const [mapType, setMapType] = useState<keyof typeof TILE_LAYERS>("dark");
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleMapType = () => {
		setMapType((prev) => {
			if (prev === "dark") return "satellite";
			if (prev === "satellite") return "normal";
			return "dark";
		});
	};

	const wrapperClass = isExpanded
		? "fixed inset-4 md:inset-10 z-[9999] rounded-[2rem] md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] border-2 border-blue-500/30"
		: "h-full w-full relative rounded-2xl border border-white/10 shadow-inner";

	return (
		<div
			className={`${wrapperClass} overflow-hidden bg-[#030303] transition-all duration-500`}>
			<MapContainer
				center={location || center}
				zoom={zoom}
				scrollWheelZoom={interactive}
				style={{ height: "100%", width: "100%", background: "#030303" }}
				className="z-0">
				<TileLayer
					key={mapType}
					attribution={
						mapType === "satellite" ? "Esri" : "&copy; OpenStreetMap"
					}
					url={TILE_LAYERS[mapType]}
				/>

				{interactive && (
					<SearchField
						onLocationChange={onLocationChange}
						onAddressChange={onAddressChange}
					/>
				)}

				<LocationMarker
					onLocationChange={onLocationChange}
					onAddressChange={onAddressChange}
					interactive={interactive}
					location={location}
					isExpanded={isExpanded}
				/>
			</MapContainer>

			{/* Custom Controls UI */}
			<div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
				{/* Expand Button */}
				<button
					onClick={(e) => {
						e.preventDefault();
						setIsExpanded(!isExpanded);
					}}
					className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center group"
					title={isExpanded ? "Collapse Map" : "Expand Map"}>
					{isExpanded ? (
						<Minimize2 className="w-5 h-5" />
					) : (
						<Maximize2 className="w-5 h-5" />
					)}
					<span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block ml-2 transition-all">
						{isExpanded ? "Minimize" : "Expand"}
					</span>
				</button>

				{/* Remove Pin Button */}
				{interactive && location && (
					<button
						onClick={(e) => {
							e.preventDefault();
							if (onLocationChange) onLocationChange(null, null);
							if (onAddressChange) onAddressChange("");
						}}
						className="p-3 bg-red-600/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-red-500 transition-all shadow-xl flex items-center justify-center group"
						title="Remove Pin">
						<Trash2 className="w-5 h-5" />
						<span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block ml-2 transition-all">
							Remove Pin
						</span>
					</button>
				)}
			</div>

			{/* Map Type Toggle UI */}
			<div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
				<button
					onClick={(e) => {
						e.preventDefault();
						toggleMapType();
					}}
					className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl text-white hover:bg-blue-600 transition-all shadow-xl flex items-center gap-2 group"
					title="Toggle Map View">
					{mapType === "dark" ? (
						<Satellite className="w-5 h-5" />
					) : mapType === "satellite" ? (
						<MapIcon className="w-5 h-5" />
					) : (
						<Layers className="w-5 h-5" />
					)}
					<span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block transition-all">
						{mapType === "dark"
							? "Satellite"
							: mapType === "satellite"
								? "Default"
								: "Dark"}
					</span>
				</button>
			</div>
		</div>
	);
}
