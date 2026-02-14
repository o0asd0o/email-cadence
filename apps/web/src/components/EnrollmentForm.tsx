"use client";

import { useState } from "react";

import type { Cadence } from "@cadence/shared";

interface EnrollmentFormProps {
  cadences: Cadence[];
  onEnroll: (cadenceId: string, contactEmail: string) => Promise<void>;
}

export function EnrollmentForm({ cadences, onEnroll }: EnrollmentFormProps) {
  const [cadenceId, setCadenceId] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setMessage("");
    if (!cadenceId || !contactEmail) {
      setMessage("Please provide both cadence ID and contact email.");
      return;
    }
    setSubmitting(true);
    try {
      await onEnroll(cadenceId, contactEmail);
      setMessage("Enrollment created!");
      setCadenceId("");
      setContactEmail("");
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <label>
          Cadence ID:{" "}
          <select
            value={cadenceId}
            onChange={(e) => setCadenceId(e.target.value)}
          >
            <option value="">-- select --</option>
            {cadences.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} – {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginTop: "0.5rem" }}>
        <label>
          Contact Email:{" "}
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </label>
      </div>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Starting..." : "Start Workflow"}
      </button>
      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}
    </div>
  );
}
