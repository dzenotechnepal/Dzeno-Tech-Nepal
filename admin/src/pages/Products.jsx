import React, { useEffect, useState } from 'react';
import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { name: '', sku: '', description: '', category: '', price: '', status: 'active', assignedTo: '' };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productResponse, userResponse] = await Promise.all([
        api.get('/products', { params: { search: search || undefined, status: status || undefined, assignedTo: assignedTo || undefined } }),
        api.get('/users', { params: { limit: 100 } }),
      ]);
      setProducts(Array.isArray(productResponse.data.data) ? productResponse.data.data : []);
      const userData = userResponse.data.data;
      setUsers(Array.isArray(userData) ? userData : userData?.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadData, 250);
    return () => clearTimeout(timer);
  }, [search, status, assignedTo]);

  const updateForm = (event) => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const openCreate = () => { setEditingId(null); setForm(emptyForm); setIsModalOpen(true); };
  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({ name: product.name || '', sku: product.sku || '', description: product.description || '', category: product.category || '', price: product.price ?? '', status: product.status || 'active', assignedTo: product.assignedTo?._id || '' });
    setIsModalOpen(true);
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = { ...form, price: Number(form.price || 0), assignedTo: form.assignedTo || undefined };
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      toast.success(editingId ? 'Product updated' : 'Product created');
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      toast.success('Product deleted');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <div className="page-heading"><div><h1>Products</h1><p className="text-secondary">Manage products and assign them to specific users.</p></div><button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Product</button></div>
      <div className="card customer-filters"><div className="customer-search"><Search size={16} className="customer-search-icon" /><input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, SKU or category" /></div><select className="select customer-status-filter" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select><select className="select customer-status-filter" value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}><option value="">All users</option>{users.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}</select></div>
      <div className="card">{loading ? <div className="empty-state">Loading products...</div> : products.length === 0 ? <div className="empty-state"><Package size={36} className="text-secondary" /><h3>No products found</h3><p className="text-secondary">Add a product to start assigning and managing products.</p></div> : <div className="table-container"><table className="table"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Assigned User</th><th>Status</th><th>Actions</th></tr></thead><tbody>{products.map(product => <tr key={product._id}><td className="font-medium">{product.name}<small className="text-secondary" style={{ display: 'block' }}>{product.description || ''}</small></td><td>{product.sku || '—'}</td><td>{product.category || '—'}</td><td>NPR {Number(product.price || 0).toLocaleString('en-NP')}</td><td>{product.assignedTo?.name || 'Unassigned'}</td><td><Badge type={product.status === 'active' ? 'green' : 'gray'}>{product.status}</Badge></td><td><div className="flex gap-2"><button className="btn btn-outline text-xs" onClick={() => openEdit(product)}><Pencil size={13} /> Edit</button><button className="btn btn-outline text-xs" onClick={() => removeProduct(product)} aria-label={`Delete ${product.name}`}><Trash2 size={13} /></button></div></td></tr>)}</tbody></table></div>}</div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Product' : 'Add Product'}><form className="flex flex-col gap-4" onSubmit={saveProduct}><div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Product Name *</label><input className="input" name="name" value={form.name} onChange={updateForm} required /></div><div className="form-group"><label className="form-label">SKU</label><input className="input" name="sku" value={form.sku} onChange={updateForm} /></div></div><div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Category</label><input className="input" name="category" value={form.category} onChange={updateForm} /></div><div className="form-group"><label className="form-label">Price (NPR)</label><input className="input" name="price" type="number" min="0" value={form.price} onChange={updateForm} /></div></div><div className="form-group"><label className="form-label">Assign to User</label><select className="select" name="assignedTo" value={form.assignedTo} onChange={updateForm}><option value="">Unassigned</option>{users.map(user => <option key={user._id} value={user._id}>{user.name} ({user.employeeId || user.email})</option>)}</select></div><div className="form-group"><label className="form-label">Status</label><select className="select" name="status" value={form.status} onChange={updateForm}><option value="active">Active</option><option value="inactive">Inactive</option></select></div><div className="form-group"><label className="form-label">Description</label><textarea className="input" name="description" value={form.description} onChange={updateForm} rows="3" /></div><button type="submit" className="btn btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}</button></form></Modal>
    </div>
  );
};

export default Products;
