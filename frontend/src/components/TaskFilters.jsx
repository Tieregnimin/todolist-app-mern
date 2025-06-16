import { useState } from "react";

function TaskFilters({ onSearch, onStatusFilter, onSort }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  const handleStatus = (e) => {
    const value = e.target.value;
    setStatus(value);
    onStatusFilter(value);
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSort(value);
    onSort(value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
      <input
        type="text"
        placeholder="🔍 Rechercher une tâche..."
        value={search}
        onChange={handleSearch}
        className="px-3 py-2 border rounded w-full sm:w-1/3"
      />

      <select onChange={handleStatus} value={status} className="px-2 py-2 border rounded">
        <option value="all">Toutes</option>
        <option value="completed">Terminées</option>
        <option value="pending">En cours</option>
      </select>

      <select onChange={handleSort} value={sort} className="px-2 py-2 border rounded">
        <option value="">Trier par...</option>
        <option value="deadline">Échéance</option>
        <option value="priority">Priorité</option>
      </select>
    </div>
  );
}

export default TaskFilters;
