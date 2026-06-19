import Link from 'next/link';
import { type Product, formatPrice } from '@/data/products';
import './productcard.css';

/**
 * Server-rendered, CSS-driven card. Pure hover (no JS) so a 30-item grid stays
 * cheap. The pedestal "object" stands in for the product's 3D/photo asset.
 */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="pcard"
      style={{ ['--pc-accent' as string]: product.accent, ['--pc-i' as string]: index }}
      data-cursor="View"
      aria-label={`${product.name}, ${formatPrice(product.priceMinor)}`}
    >
      <div className="pcard__stage">
        <div className="pcard__glow" />
        <div className="pcard__object" />
        <div className="pcard__shadow" />
        {product.badge && <span className="pcard__badge">{product.badge}</span>}
        <span className="pcard__cta">View piece →</span>
      </div>
      <div className="pcard__body">
        <p className="pcard__collection">{product.collectionName}</p>
        <h3 className="pcard__name">{product.name}</h3>
        <p className="pcard__price">{formatPrice(product.priceMinor)}</p>
      </div>
    </Link>
  );
}
