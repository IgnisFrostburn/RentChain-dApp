export interface Property {
    id: number;
    title: string;
    location: string;
    lat: number;
    lng: number;
    rentADA: number;
    depositADA: number;
    description: string;
    imageIpfsHash: string;
    metadataIpfsHash?: string;
    status: 'Available' | 'Rented';
    landlordAddress: string;
    propertyType: string;
    leaseTerm: string;
}

export interface RentalMetadata {
    name: string;
    description: string;
    address: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    rentADA: number;
    depositADA: number;
    landlordAddress: string;
    image: string; // ipfs://...
    status: string;
    propertyType: string;
    leaseTerm: string;
    version: string;
}

/**
 * Clean logic for handling Property Metadata transformations.
 */
export class PropertyMetadata {
    /**
     * Converts a Property object to the standard RentalMetadata format.
     */
    static fromProperty(property: Property): RentalMetadata {
        return {
            name: property.title,
            description: property.description,
            address: property.location,
            coordinates: {
                latitude: property.lat,
                longitude: property.lng,
            },
            rentADA: property.rentADA,
            depositADA: property.depositADA,
            landlordAddress: property.landlordAddress,
            image: `ipfs://${property.imageIpfsHash}`,
            status: property.status,
            propertyType: property.propertyType,
            leaseTerm: property.leaseTerm,
            version: "1.0.0"
        };
    }

    /**
     * Prepares a JSON File object for IPFS upload.
     */
    static toFile(metadata: RentalMetadata): File {
        const jsonString = JSON.stringify(metadata, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        return new File([blob], 'metadata.json', { type: 'application/json' });
    }
}
