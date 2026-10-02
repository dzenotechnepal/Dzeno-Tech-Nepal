import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Send } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const EmailEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/users", { params: { limit: 100 } });
      const data = response.data.data;
      setEmployees(Array.isArray(data) ? data : data?.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchEmployees(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return employees;
    return employees.filter((employee) =>
      [employee.name, employee.email, employee.employeeId, employee.designation]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [employees, searchTerm]);

  const toggleEmployee = (employeeId) => {
    setSelectedIds((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId],
    );
  };

  const toggleVisibleEmployees = () => {
    const visibleIds = filteredEmployees.map((employee) => employee._id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    );
  };

  const sendEmail = async (event) => {
    event.preventDefault();
    if (selectedIds.length === 0) {
      toast.error("Select at least one employee");
      return;
    }

    try {
      setSending(true);
      const response = await api.post("/email/send", {
        userIds: selectedIds,
        subject,
        message,
      });
      toast.success(`Email sent to ${response.data.data.recipientCount} employee(s)`);
      setSubject("");
      setMessage("");
      setSelectedIds([]);
    } catch (error) {
      const failed = error.response?.data?.data?.failedRecipients || [];
      const detail = failed.length ? ` Failed: ${failed.map((item) => item.email).join(", ")}` : "";
      toast.error(`${error.response?.data?.message || "Email could not be sent"}${detail}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Email Employees</h1>
          <p className="text-secondary">Select company employees and send a message from the company email.</p>
        </div>
        <button className="btn btn-outline" onClick={fetchEmployees} disabled={loading}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3>Select Recipients</h3>
              <p className="text-secondary text-sm">{selectedIds.length} employee(s) selected</p>
            </div>
            <button className="btn btn-outline text-xs" onClick={toggleVisibleEmployees} disabled={loading || filteredEmployees.length === 0}>
              {filteredEmployees.length > 0 && filteredEmployees.every((employee) => selectedIds.includes(employee._id)) ? "Clear Visible" : "Select Visible"}
            </button>
          </div>

          <div style={{ position: "relative", marginBottom: "12px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input className="input" style={{ paddingLeft: "36px" }} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, email, ID..." />
          </div>

          <div className="email-recipient-list">
            {loading ? <p className="text-secondary">Loading employees...</p> : filteredEmployees.length === 0 ? <p className="text-secondary">No employees found.</p> : filteredEmployees.map((employee) => (
              <label className="email-recipient" key={employee._id}>
                <input type="checkbox" checked={selectedIds.includes(employee._id)} onChange={() => toggleEmployee(employee._id)} />
                {employee.avatar ? <img className="employee-avatar" src={employee.avatar} alt="" /> : <span className="employee-avatar employee-avatar-fallback">{employee.name?.slice(0, 2).toUpperCase()}</span>}
                <span className="email-recipient-details"><strong>{employee.name}</strong><small>{employee.email}</small></span>
              </label>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Compose Email</h3>
          <form className="flex flex-col gap-4" onSubmit={sendEmail}>
            <div className="form-group"><label className="form-label" htmlFor="email-subject">Subject</label><input id="email-subject" className="input" value={subject} onChange={(event) => setSubject(event.target.value)} required placeholder="Company update" /></div>
            <div className="form-group"><label className="form-label" htmlFor="email-message">Message</label><textarea id="email-message" className="input" rows="12" value={message} onChange={(event) => setMessage(event.target.value)} required placeholder="Write your message..." /></div>
            <button type="submit" className="btn btn-primary w-full" disabled={sending || selectedIds.length === 0}>
              <Send size={16} /> {sending ? "Sending..." : `Send to ${selectedIds.length || "selected"} employee(s)`}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default EmailEmployees;
