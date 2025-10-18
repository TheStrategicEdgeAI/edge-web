import Link from 'next/link';

/**
 * Settings page
 *
 * Placeholder for account settings.  A real implementation would show
 * the user's current plan, usage statistics, and a button to manage
 * billing via Stripe.  You might also list API keys or allow the
 * user to update profile details here.
 */
export default function Settings() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/" legacyBehavior>
        <a style={{ marginBottom: '1rem', display: 'inline-block', color: '#0070f3' }}>&larr; Back to home</a>
      </Link>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Account Settings</h1>
      <p style={{ maxWidth: '600px' }}>
        This page will let you view your subscription details, manage your payment
        method, and update account preferences.  We’re still working on this
        functionality—check back soon!
      </p>
    </main>
  );
}