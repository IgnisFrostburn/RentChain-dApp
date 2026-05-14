import { properties } from '@/data/mockData';
import PropertyDetail from '@/components/PropertyDetail';

interface PropertyDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
    const { id } = await params;
    const property = properties.find((p) => p.id === Number.parseInt(id));
    return <PropertyDetail property={property} />;
}
