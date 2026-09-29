import React from 'react';
import { Package } from 'lucide-react';

const Products = () => (
  <div>
    <div className="page-heading">
      <div>
        <h1>Products</h1>
        <p className="text-secondary">Manage products and service offerings.</p>
      </div>
      <button className="btn btn-primary" disabled>Add Product</button>
    </div>
    <div className="card empty-state">
      <Package size={36} className="text-secondary" />
      <h3>No products yet</h3>
      <p className="text-secondary">Product records will appear here once product management is connected.</p>
    </div>
  </div>
);

export default Products;
