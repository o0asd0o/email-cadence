"use client";

import type { Cadence } from "@cadence/shared";

interface CadenceListProps {
  cadences: Cadence[];
}

export function CadenceList({ cadences }: CadenceListProps) {
  if (cadences.length === 0) {
    return <p>No cadences yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Steps</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {cadences.map((c) => (
          <tr key={c.id}>
            <td>
              <code>{c.id}</code>
            </td>
            <td>{c.name}</td>
            <td>{c.steps?.length ?? 0}</td>
            <td>
              <a href={`/cadences/${c.id}`}>Edit</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
