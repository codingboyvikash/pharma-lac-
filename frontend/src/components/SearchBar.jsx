import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="input-group table-search">
      <span className="input-group-text"><FiSearch /></span>
      <input className="form-control" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
