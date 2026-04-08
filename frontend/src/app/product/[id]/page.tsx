import { MENU } from '@/lib/data';
import ProductClientPage from './ProductClientPage';

export function generateStaticParams() {
    const allProducts = Object.values(MENU).flat();
    return allProducts.map(p => ({
        id: encodeURIComponent(p.name)
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProductClientPage id={id} />;
}
