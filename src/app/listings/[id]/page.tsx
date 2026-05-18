'use client';

import { useState, useEffect } from 'react';
import { properties as mockProperties } from '@/data/mockData';
import PropertyDetail from '@/components/PropertyDetail';
import { useParams } from 'next/navigation';

export default function PropertyDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // Combine mock data with minted data from localStorage
        const mintedProperties = JSON.parse(localStorage.getItem('mintedProperties') || '[]');
        const allProperties = [...mockProperties, ...mintedProperties];
        
        const found = allProperties.find((p) => p.id.toString() === id);
        setProperty(found);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <PropertyDetail property={property} />;
}
