"use client";

import { useState } from "react";

interface UpdateCadenceFormProps {
  initialSteps: string;
  onUpdate: (stepsJson: string) => Promise<void>;
}

export function UpdateCadenceForm({
  initialSteps,
  onUpdate,
}: UpdateCadenceFormProps) {
  const [stepsJson, setStepsJson] = useState(initialSteps);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async () => {
    setMessage("");
    setSubmitting(true);
    try {
      JSON.parse(stepsJson); // validate
      await onUpdate(stepsJson);
      setMessage("Cadence updated – workflow will adopt new steps.");
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p>
        Edit the steps below and click &quot;Update&quot; to signal the running
        workflow.
      </p>
      <textarea
        value={stepsJson}
        onChange={(e) => setStepsJson(e.target.value)}
      />
      <br />
      <button onClick={handleUpdate} disabled={submitting}>
        {submitting ? "Updating..." : "Update Cadence"}
      </button>
      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}
    </div>
  );
}
