import React, { useEffect, useState } from "react";
import { ExternalLink, FileSignature, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const emptyForm = {
  employeeId: "",
  contractNumber: "",
  type: "employment",
  startDate: "",
  endDate: "",
  status: "draft",
  salary: "",
  terms: "",
};
const types = ["employment", "consultancy", "internship", "temporary", "other"];
const statuses = ["draft", "active", "expired", "terminated"];

const Contracts = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(["admin", "superadmin", "ceo"]);
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const requests = [
        api.get("/contracts", {
          params: {
            search: search || undefined,
            status: status || undefined,
            type: type || undefined,
            employeeId: employeeId || undefined,
          },
        }),
      ];
      if (isAdmin) requests.push(api.get("/users", { params: { limit: 100 } }));
      const [contractResponse, employeeResponse] = await Promise.all(requests);
      setContracts(Array.isArray(contractResponse.data.data) ? contractResponse.data.data : []);
      const userData = employeeResponse?.data?.data;
      setEmployees(Array.isArray(userData) ? userData : userData?.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadData, 250);
    return () => clearTimeout(timer);
  }, [search, status, type, employeeId, isAdmin]);

  const updateForm = (event) =>
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };
  const openEdit = (contract) => {
    setEditingId(contract._id);
    setForm({
      employeeId: contract.employeeId?._id || "",
      contractNumber: contract.contractNumber || "",
      type: contract.type || "employment",
      startDate: contract.startDate ? new Date(contract.startDate).toISOString().slice(0, 10) : "",
      endDate: contract.endDate ? new Date(contract.endDate).toISOString().slice(0, 10) : "",
      status: contract.status || "draft",
      salary: contract.salary ?? "",
      terms: contract.terms || "",
    });
    setIsModalOpen(true);
  };

  const saveContract = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        salary: Number(form.salary || 0),
        endDate: form.endDate || undefined,
      };
      if (editingId) await api.put(`/contracts/${editingId}`, payload);
      else await api.post("/contracts", payload);
      toast.success(editingId ? "Contract updated" : "Contract created");
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save contract");
    } finally {
      setSaving(false);
    }
  };

  const terminateContract = async (contract) => {
    if (
      !window.confirm(`Terminate the contract for ${contract.employeeId?.name || "this employee"}?`)
    )
      return;
    try {
      await api.put(`/contracts/${contract._id}`, {
        ...contract,
        employeeId: contract.employeeId?._id,
        startDate: new Date(contract.startDate).toISOString().slice(0, 10),
        endDate: contract.endDate
          ? new Date(contract.endDate).toISOString().slice(0, 10)
          : undefined,
        status: "terminated",
        salary: contract.salary || 0,
      });
      toast.success("Contract terminated");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to terminate contract");
    }
  };

  const removeContract = async (contract) => {
    if (!window.confirm("Delete this contract permanently?")) return;
    try {
      await api.delete(`/contracts/${contract._id}`);
      toast.success("Contract deleted");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete contract");
    }
  };

  const uploadDocument = async (contractId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = new FormData();
      payload.append("document", file);
      await api.post(`/contracts/${contractId}/documents`, payload);
      toast.success("Document uploaded");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload document");
    } finally {
      event.target.value = "";
    }
  };

  const removeDocument = async (contractId, documentId) => {
    if (!window.confirm("Delete this contract document?")) return;
    try {
      await api.delete(`/contracts/${contractId}/documents/${documentId}`);
      toast.success("Document deleted");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete document");
    }
  };

  const badgeType = (value) =>
    value === "active" ? "green" : value === "terminated" || value === "expired" ? "red" : "yellow";

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Contracts</h1>
          <p className="text-secondary">
            Manage employment, consultancy, internship, and other employee contracts.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Contract
        </button>
      </div>
      <div className="card customer-filters">
        <div className="customer-search">
          <Search size={16} className="customer-search-icon" />
          <input
            className="input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search employee or contract number"
          />
        </div>
        <select
          className="select customer-status-filter"
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
        >
          <option value="">All employees</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </select>
        <select
          className="select customer-status-filter"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="">All types</option>
          {types.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          className="select customer-status-filter"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="card">
        {loading ? (
          <div className="empty-state">Loading contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="empty-state">
            <FileSignature size={36} className="text-secondary" />
            <h3>No contracts found</h3>
            <p className="text-secondary">No contracts are available for your account.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contract No.</th>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Documents</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract._id}>
                    <td className="font-medium">
                      {contract.employeeId?.name || "—"}
                      <small className="text-secondary" style={{ display: "block" }}>
                        {contract.employeeId?.employeeId || ""}
                      </small>
                    </td>
                    <td>{contract.contractNumber || "—"}</td>
                    <td style={{ textTransform: "capitalize" }}>{contract.type}</td>
                    <td>
                      {new Date(contract.startDate).toLocaleDateString("en-NP")} -{" "}
                      {contract.endDate
                        ? new Date(contract.endDate).toLocaleDateString("en-NP")
                        : "Open-ended"}
                    </td>
                    <td>NPR {Number(contract.salary || 0).toLocaleString("en-NP")}</td>
                    <td>
                      <Badge type={badgeType(contract.status)}>{contract.status}</Badge>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        {(contract.documents || []).map((document) => (
                          <div key={document._id} className="flex items-center gap-1">
                            <a
                              className="text-accent-blue text-xs"
                              href={document.url}
                              target="_blank"
                              rel="noreferrer"
                              title={document.name}
                            >
                              <ExternalLink size={13} /> {document.name}
                            </a>
                            {isAdmin && (
                              <button
                                type="button"
                                className="text-danger text-xs"
                                onClick={() => removeDocument(contract._id, document._id)}
                                aria-label={`Delete ${document.name}`}
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                        {isAdmin && (
                          <label
                            className="btn btn-outline text-xs"
                            style={{ width: "fit-content", cursor: "pointer" }}
                          >
                            <Upload size={13} /> Upload
                            <input
                              type="file"
                              accept="application/pdf,.doc,.docx,image/jpeg,image/png"
                              hidden
                              onChange={(event) => uploadDocument(contract._id, event)}
                            />
                          </label>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-outline text-xs"
                            onClick={() => openEdit(contract)}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          {contract.status !== "terminated" && (
                            <button
                              className="btn btn-outline text-xs"
                              onClick={() => terminateContract(contract)}
                            >
                              Terminate
                            </button>
                          )}
                          <button
                            className="btn btn-outline text-xs"
                            onClick={() => removeContract(contract)}
                            aria-label="Delete contract"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Contract" : "Add Contract"}
      >
        <form className="flex flex-col gap-4" onSubmit={saveContract}>
          <div className="form-group">
            <label className="form-label">Employee *</label>
            <select
              className="select"
              name="employeeId"
              value={form.employeeId}
              onChange={updateForm}
              required
            >
              <option value="">Select employee...</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.employeeId || employee.email})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Contract Number</label>
              <input
                className="input"
                name="contractNumber"
                value={form.contractNumber}
                onChange={updateForm}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="select" name="type" value={form.type} onChange={updateForm}>
                {types.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                className="input"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={updateForm}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                className="input"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={updateForm}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="select" name="status" value={form.status} onChange={updateForm}>
                {statuses.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Salary / Rate</label>
              <input
                className="input"
                type="number"
                min="0"
                name="salary"
                value={form.salary}
                onChange={updateForm}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Terms and Notes</label>
            <textarea
              className="input"
              name="terms"
              value={form.terms}
              onChange={updateForm}
              rows="4"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Contract" : "Save Contract"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Contracts;
