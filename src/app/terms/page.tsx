import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service – Idealike',
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors mb-10"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Idealike ("Service"), you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Description of Service</h2>
          <p>
            Idealike is an AI-powered business idea curation platform that collects, analyzes, and
            presents startup ideas to help entrepreneurs and builders discover opportunities.
            The Service offers a Free plan and a Pro subscription plan.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. User Accounts</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must sign in with a valid Google account to access the Service.</li>
            <li>You are responsible for maintaining the security of your account.</li>
            <li>You must not share your account with others.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Free Plan</h2>
          <p>
            The Free plan provides access to 3 curated ideas per day.
            Additional idea views beyond this limit require upgrading to the Pro plan.
            Free plan features may change at our discretion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Pro Subscription</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>The Pro plan is billed at $15 per month via Lemon Squeezy.</li>
            <li>Your subscription renews automatically each month unless cancelled.</li>
            <li>You may cancel your subscription at any time through the customer portal.</li>
            <li>Cancellation takes effect at the end of the current billing period.</li>
            <li>We do not offer refunds for partial months of service.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Content and Ideas</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ideas presented on Idealike are curated from public sources and analyzed by AI.</li>
            <li>We do not guarantee the accuracy, completeness, or commercial viability of any idea.</li>
            <li>Content is for informational purposes only and does not constitute business, legal, or financial advice.</li>
            <li>You use the ideas at your own risk. Idealike is not responsible for any business decisions made based on our content.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Prohibited Use</h2>
          <p>You may not:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Scrape, crawl, or systematically download content from the Service.</li>
            <li>Resell or redistribute the content without our written permission.</li>
            <li>Attempt to bypass usage limits or access restrictions.</li>
            <li>Use the Service for any unlawful purpose.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Intellectual Property</h2>
          <p>
            All content, design, and software of the Service is owned by Idealike or its licensors.
            The AI-generated analysis and curation are proprietary to Idealike.
            You may not reproduce or distribute our content without prior written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" without warranties of any kind.
            We do not warrant that the Service will be uninterrupted, error-free, or that
            the ideas presented will lead to successful business outcomes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Idealike shall not be liable for any
            indirect, incidental, special, or consequential damages arising from your use
            of the Service, including but not limited to loss of profits or business opportunities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time.
            We will notify users of significant changes by updating the date at the top of this page.
            Continued use of the Service after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">12. Contact</h2>
          <p>
            For questions about these Terms, please contact us at:{' '}
            <a href="mailto:idealikehelp@gmail.com" className="underline hover:text-foreground">
              idealikehelp@gmail.com
            </a>
          </p>
        </section>

      </div>
    </main>
  )
}
