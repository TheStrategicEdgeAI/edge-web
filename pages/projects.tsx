import Link from 'next/link';

/**
 * Projects page
 *
 * Lists the user's saved strategy projects.  In this lightweight
 * implementation we simply display a placeholder list.  In a full
 * application you would fetch project metadata from your backend and
 * allow users to open, duplicate, or delete entries.
 */
export default function Projects() {
  const projects: { name: string; type: string; updated: string }[] = [];
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/" legacyBehavior>
        <a style={{ marginBottom: '1rem', display: 'inline-block', color: '#0070f3' }}>&larr; Back to home</a>
      </Link>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>My Projects</h1>
      {projects.length === 0 ? (
        <p>You haven't saved any projects yet. Start by designing a strategy or generating code.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Type</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj, idx) => (
              <tr key={idx}>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{proj.name}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{proj.type}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{proj.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}