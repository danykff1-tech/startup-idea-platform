import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy – Idealike',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors mb-10"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Overview</h2>
          <p>
            Idealike ("we", "us", or "our") operates the website at idealike.vercel.app (the "Service").
            This Privacy Policy explains how we collect, use, and protect your personal information
            when you use our Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
          <p>We collect the following information when you use Idealike:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account information:</strong> Your name and email address when you sign in with Google.</li>
            <li><strong>Usage data:</strong> Which ideas you view, how many ideas you view per day, and your bookmarked ideas.</li>
            <li><strong>Payment information:</strong> Subscription status and billing details processed by Lemon Squeezy. We do not store your credit card information directly.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and personalize the Service (e.g., your daily curated ideas).</li>
            <li>To manage your account and subscription status.</li>
            <li>To enforce usage limits on the Free plan.</li>
            <li>To save your bookmarked ideas (Pro plan).</li>
            <li>To communicate important updates about the Service.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Google OAuth:</strong> For authentication. Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Google&apos;s Privacy Policy</a>.</li>
            <li><strong>Supabase:</strong> For database and authentication infrastructure.</li>
            <li><strong>Lemon Squeezy:</strong> For payment processing. Subject to <a href="https://www.lemonsqueezy.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Lemon Squeezy&apos;s Privacy Policy</a>.</li>
            <li><strong>Vercel:</strong> For website hosting.</li>
            <li><strong>OpenAI:</strong> For AI-powered idea analysis.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Data Retention</h2>
          <p>
            We retain your account data for as long as your account is active.
            If you delete your account, we will delete your personal data within 30 days.
            Aggregated or anonymized data may be retained indefinitely.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Cancel your subscription at any time.</li>
          </ul>
          <p>
            To exercise these rights, please contact us at the email below.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Cookies</h2>
          <p>
            We use cookies solely for authentication purposes (to keep you logged in).
            We do not use tracking or advertising cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Children&apos;s Privacy</h2>
          <p>
            Idealike is not directed at children under the age of 13.
            We do not knowingly collect personal information from children.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time.
            We will notify you of significant changes by updating the date at the top of this page.
            Continued use of the Service after changes constitutes acceptance of the new policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:idealikehelp@gmail.com" className="underline hover:text-foreground">
              idealikehelp@gmail.com
            </a>
          </p>
        </section>

      </div>
    </main>
  )
}
