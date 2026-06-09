import { useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Toast from '../components/Toast.jsx';
import useDebounce from '../hooks/useDebounce.js';
import { fetchList, removeItem } from '../redux/slices/crudSlice.js';
import api from '../services/api.js';
import { imageUrl } from '../utils/format.js';

const emptyProduct = {
  productName: '',
  categoryId: '',
  brandId: '',
  shortDescription: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '',
  sku: '',
  tags: '',
  featured: false,
  trending: false,
  status: true,
  mainImage: null,
  galleryImages: []
};

export default function Products() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [prereq, setPrereq] = useState({ categoryCount: 0, brandCount: 0, canCreate: false });
  const [options, setOptions] = useState({ categories: [], brands: [] });
  const [previews, setPreviews] = useState({ main: '', gallery: [] });
  const debounced = useDebounce(search);
  const dispatch = useDispatch();
  const state = useSelector((store) => store.crud.products || {});
  const load = () => dispatch(fetchList({ resource: 'products', page, search: debounced }));

  useEffect(() => { load(); }, [dispatch, page, debounced]);
  useEffect(() => {
    Promise.all([
      api.get('/products/prerequisites'),
      api.get('/categories', { params: { limit: 100 } }),
      api.get('/brands', { params: { limit: 100 } })
    ]).then(([rules, categories, brands]) => {
      setPrereq(rules.data);
      setOptions({ categories: categories.data.data, brands: brands.data.data });
    });
  }, []);

  const disabled = !prereq.canCreate;

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'galleryImages') value.forEach((file) => data.append('galleryImages', file));
      else if (key === 'mainImage' && value) data.append('mainImage', value);
      else data.append(key, value);
    });
    if (editing) await api.put(`/products/${editing}`, data);
    else await api.post('/products', data);
    setForm(emptyProduct);
    setEditing(null);
    setPreviews({ main: '', gallery: [] });
    setToast(`Product ${editing ? 'updated' : 'created'} successfully`);
    load();
  };

  const edit = (product) => {
    setEditing(product._id);
    setForm({
      ...emptyProduct,
      productName: product.productName,
      categoryId: product.categoryId?._id || product.categoryId,
      brandId: product.brandId?._id || product.brandId,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      sku: product.sku,
      tags: product.tags?.join(', ') || '',
      featured: product.featured,
      trending: product.trending,
      status: product.status
    });
    setPreviews({ main: imageUrl(product.mainImage), gallery: (product.galleryImages || []).map(imageUrl) });
  };

  const confirmDelete = async () => {
    await dispatch(removeItem({ resource: 'products', id: selected._id }));
    setSelected(null);
    setToast('Product deleted successfully');
  };

  return (
    <>
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="page-title"><h2>Product Management</h2><SearchBar value={search} onChange={setSearch} placeholder="Search products" /></div>
      {prereq.categoryCount === 0 && <div className="alert alert-warning">Please create Category first.</div>}
      {prereq.brandCount === 0 && <div className="alert alert-warning">Please create Brand first.</div>}
      <form className="form-panel mb-4" onSubmit={submit}>
        <div className="panel-header"><h5>{editing ? 'Edit Product' : 'Add Product'}</h5></div>
        <div className="row g-3">
          <div className="col-md-4"><input className="form-control" placeholder="Product Name" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required /></div>
          <div className="col-md-4"><select className="form-select" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required><option value="">Category</option>{options.categories.map((item) => <option key={item._id} value={item._id}>{item.categoryName}</option>)}</select></div>
          <div className="col-md-4"><select className="form-select" value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} required><option value="">Brand</option>{options.brands.map((item) => <option key={item._id} value={item._id}>{item.brandName}</option>)}</select></div>
          <div className="col-md-6"><textarea className="form-control" rows="2" placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></div>
          <div className="col-md-6"><textarea className="form-control" rows="2" placeholder="Full Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
          <div className="col-md-3"><input className="form-control" type="number" min="0" placeholder="Discount Price" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" type="number" min="0" placeholder="Stock Quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Tags comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
          <div className="col-md-4"><input className="form-control" type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; setForm({ ...form, mainImage: file }); setPreviews({ ...previews, main: file ? URL.createObjectURL(file) : '' }); }} /></div>
          <div className="col-md-4"><input className="form-control" type="file" accept="image/*" multiple onChange={(e) => { const files = Array.from(e.target.files); setForm({ ...form, galleryImages: files }); setPreviews({ ...previews, gallery: files.map((file) => URL.createObjectURL(file)) }); }} /></div>
          <div className="col-12 d-flex gap-3 flex-wrap">
            {['featured', 'trending', 'status'].map((key) => <div className="form-check form-switch" key={key}><input className="form-check-input" type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} /><label className="form-check-label text-capitalize">{key === 'status' ? 'Active Status' : `${key} Product`}</label></div>)}
          </div>
          <div className="col-12 d-flex gap-2 flex-wrap">
            {previews.main && <img src={previews.main} className="image-preview" alt="Main preview" />}
            {previews.gallery.map((src) => <img key={src} src={src} className="image-preview" alt="Gallery preview" />)}
          </div>
        </div>
        <button className="btn btn-primary mt-3" disabled={disabled}><FiPlus /> {editing ? 'Update' : 'Add'} Product</button>
      </form>
      <div className="table-panel">
        {state.loading ? <Loader /> : (
          <div className="table-responsive"><table className="table align-middle">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
            <tbody>{(state.items || []).map((item) => (
              <tr key={item._id}><td>{item.mainImage ? <img src={imageUrl(item.mainImage)} className="table-thumb" alt="" /> : '-'}</td><td>{item.productName}</td><td>{item.categoryId?.categoryName}</td><td>{item.brandId?.brandName}</td><td>{item.discountPrice || item.price}</td><td>{item.stock}</td><td>{item.status ? 'Active' : 'Inactive'}</td><td className="text-end"><button className="icon-action" onClick={() => edit(item)}><FiEdit2 /></button><button className="icon-action danger" onClick={() => setSelected(item)}><FiTrash2 /></button></td></tr>
            ))}</tbody>
          </table></div>
        )}
        <Pagination pagination={state.pagination} onPage={setPage} />
      </div>
      <ConfirmModal show={!!selected} message={`Delete ${selected?.productName}?`} onCancel={() => setSelected(null)} onConfirm={confirmDelete} />
    </>
  );
}
