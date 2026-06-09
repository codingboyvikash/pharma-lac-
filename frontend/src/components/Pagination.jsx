export default function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null;
  return (
    <nav className="d-flex justify-content-end">
      <ul className="pagination mb-0">
        {Array.from({ length: pagination.pages }, (_, index) => index + 1).map((page) => (
          <li key={page} className={`page-item ${page === pagination.page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPage(page)}>{page}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
