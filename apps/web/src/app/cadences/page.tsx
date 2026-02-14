"use client";

import { useState, useEffect, useCallback } from "react";
import type { Cadence } from "@cadence/shared";
import { createCadence, getCadences } from "@/lib/api";
import { CadenceEditor } from "@/components/CadenceEditor";
import { CadenceList } from "@/components/CadenceList";

const DEFAULT_CADENCE = JSON.stringify(
  {
    name: "Welcome Flow",
    steps: [
      { id: "1", type: "SEND_EMAIL", subject: "Welcome", body: "Hello there" },
      { id: "2", type: "WAIT", seconds: 10 },
      {
        id: "3",
        type: "SEND_EMAIL",
        subject: "Follow up",
        body: "Checking in",
      },
    ],
  },
  null,
  2,
);

export default function CadencesPage() {
  const [cadences, setCadences] = useState<Cadence[]>([]);

  const loadCadences = useCallback(async () => {
    try {
      setCadences(await getCadences());
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadCadences();
  }, [loadCadences]);

  const handleCreate = async (json: string) => {
    const parsed = JSON.parse(json);
    await createCadence(parsed);
    await loadCadences();
  };

  return (
    <div>
      <h1>Cadences</h1>

      <h2>Create Cadence</h2>
      <CadenceEditor
        defaultValue={DEFAULT_CADENCE}
        onSubmit={handleCreate}
        submitLabel="Create Cadence"
      />

      <h2>Existing Cadences</h2>
      <CadenceList cadences={cadences} />
    </div>
  );
}
