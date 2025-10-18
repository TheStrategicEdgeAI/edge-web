import Link from 'next/link';

/**
 * Dashboard page
 *
 * A simple dashboard shell listing quick actions and saved projects.  In a real
 * implementation this would require authentication and API calls to fetch
 * user data.
 */
export default function Dashboard() {
  const savedProjects: { name: string; lastEdited: string; type: string }[] = [];
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dashboard</h1>
      <p style={{ marginBottom: '1rem' }}>Welcome back! Choose an assistant to continue or manage your projects below.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/evaluate" legacyBehavior>
          <a style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <h3>Evaluate</h3>
            <p>Analyze market conditions</p>
          </a>
        </Link>
        <Link href="/design" legacyBehavior>
          <a style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <h3>Design</h3>
            <p>Craft your strategy rules</p>
          </a>
        </Link>
        <Link href="/generate" legacyBehavior>
          <a style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <h3>Generate</h3>
            <p>Generate code artifacts</p>
          </a>
        </Link>
        <Link href="/evolve" legacyBehavior>
          <a style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <h3>Evolve</h3>
            <p>Analyze performance & improve</p>
          </a>
        </Link>
      </div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>My Saved Projects</h2>
      {savedProjects.length === 0 ? (
        <p>No projects yet — start designing your first strategy above!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Type</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Last Edited</th>
            </tr>
          </thead>
          <tbody>
            {savedProjects.map((proj, idx) => (
              <tr key={idx}>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{proj.name}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{proj.type}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{proj.lastEdited}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}