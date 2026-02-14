export default function HomePage() {
  return (
    <div>
      <h1>Email Cadence Manager</h1>
      <p>A Temporal.io-powered email cadence workflow system.</p>
      <ul>
        <li>
          <a href="/cadences">Manage Cadences</a> &ndash; Create and edit
          cadence definitions
        </li>
        <li>
          <a href="/enrollments">Manage Enrollments</a> &ndash; Start workflows
          and monitor progress
        </li>
      </ul>
    </div>
  );
}
