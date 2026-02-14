"use client";

import type { Enrollment } from "@cadence/shared";

interface EnrollmentListProps {
  enrollments: Enrollment[];
}

export function EnrollmentList({ enrollments }: EnrollmentListProps) {
  if (enrollments.length === 0) {
    return <p>No enrollments yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cadence</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {enrollments.map((e) => (
          <tr key={e.id}>
            <td>
              <code>{e.id}</code>
            </td>
            <td>{e.cadenceId}</td>
            <td>{e.contactEmail}</td>
            <td>
              <a href={`/enrollments/${e.id}`}>View Status</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
