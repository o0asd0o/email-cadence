"use client";

import { useState } from "react";

interface CadenceEditorProps {
  defaultValue: string;
  onSubmit: (json: string) => Promise<void>;
  submitLabel: string;
}

export function CadenceEditor({
  defaultValue,
  onSubmit,
  submitLabel,
}: CadenceEditorProps) {
  const [json, setJson] = useState(defaultValue);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setMessage("");
    setSubmitting(true);
    try {
      JSON.parse(json); // validate
      await onSubmit(json);
      setMessage("Success!");
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <textarea value={json} onChange={(e) => setJson(e.target.value)} />
      <br />
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}
    </div>
  );
}
