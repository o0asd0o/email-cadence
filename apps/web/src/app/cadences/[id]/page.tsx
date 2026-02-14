"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Cadence } from "@cadence/shared";
import { getCadence, updateCadence } from "@/lib/api";
import { CadenceEditor } from "@/components/CadenceEditor";

export default function EditCadencePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [json, setJson] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const cadence = await getCadence(id);
        setJson(JSON.stringify(cadence, null, 2));
      } catch (err) {
        setError(
          `Error loading cadence: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async (jsonStr: string) => {
    const parsed = JSON.parse(jsonStr);
    await updateCadence(id, parsed);
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        <strong>{error}</strong>
      </p>
    );

  return (
    <div>
      <h1>Edit Cadence: {id}</h1>
      <CadenceEditor
        defaultValue={json}
        onSubmit={handleSave}
        submitLabel="Save"
      />
      <a href="/cadences">
        <button type="button">Back</button>
      </a>
    </div>
  );
}
