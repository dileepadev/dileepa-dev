import type { Metadata } from "next";
import Link from "next/link";
import { Container, PagePath, Section } from "@/components/ui";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How your information is collected, used, and protected when you visit dileepa.dev or interact with its forms and comments.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <Section>
      <Container>
        <div className="mb-2">
          <PagePath path="/privacy" />
        </div>
        <div className="section-label">Legal</div>
        <h1>Privacy policy</h1>
        <p className="section-intro">
          A clear, straightforward explanation of what data is collected, how it
          is handled, and why.
        </p>

        <div className="font-mono text-label text-fg-muted mt-2 mb-8">
          Last updated: August 2026
        </div>

        <article className="prose max-w-3xl">
          <h2>Overview</h2>
          <p>
            dileepa.dev is a personal engineering portfolio, technical blog, and
            project showcase operated by Dileepa Bandara.
          </p>
          <p>
            I value your privacy and believe in collecting only the minimum
            amount of information necessary to run this website, reply to
            inquiries, and foster healthy discussions on blog posts. I do not
            sell, rent, or trade your personal data with third parties.
          </p>

          <h2>Data collected through forms</h2>
          <p>
            This website provides two interactive features where you may choose
            to submit personal information:
          </p>

          <h3>1. Contact form</h3>
          <p>
            When you send a message through the contact form on the homepage, the
            following fields are collected:
          </p>
          <ul>
            <li>
              <strong>Name:</strong> To address you properly in correspondence.
            </li>
            <li>
              <strong>Email address:</strong> To send a direct reply to your
              inquiry.
            </li>
            <li>
              <strong>Subject and message:</strong> The details of your
              inquiry, project proposal, or question.
            </li>
          </ul>
          <p>
            <strong>How it is used:</strong> Contact messages are transmitted
            securely to my private backend API and stored solely so I can read
            and reply to your inquiry. Your address is never added to marketing
            lists, newsletters, or third-party mailing systems.
          </p>

          <h3>2. Blog comments</h3>
          <p>
            When participating in discussions on blog posts, you may submit a
            comment with the following information:
          </p>
          <ul>
            <li>
              <strong>Name (required):</strong> Displayed publicly alongside
              your comment.
            </li>
            <li>
              <strong>Email address (optional):</strong> Kept strictly private.
              Your email is never displayed on the website, never exposed via
              the public API, and only used internally for spam prevention or
              essential verification.
            </li>
            <li>
              <strong>Comment content (required):</strong> Displayed publicly as
              part of the post discussion thread.
            </li>
          </ul>
          <p>
            A hidden honeypot field is utilized to filter out automated spam
            bots.
          </p>

          <h2>Reactions and page views</h2>
          <p>
            When you react to a blog post or view a page, an aggregate counter is
            incremented on the backend. This data is entirely anonymous and does
            not collect or track your identity, IP address, or personal details.
          </p>

          <h2>Local storage and cookies</h2>
          <p>
            This site does not use invasive advertising or tracking cookies.
          </p>
          <p>
            The website uses browser <code>localStorage</code> solely for
            essential user interface preferences:
          </p>
          <ul>
            <li>
              <code>dileepa-theme</code>: Remembers your selected colour theme
              (dark or light mode) across visits.
            </li>
          </ul>
          <p>
            This data never leaves your browser and can be cleared at any time
            through your browser settings.
          </p>

          <h2>Analytics and performance telemetry</h2>
          <p>
            To understand overall site health, popular articles, and technical
            performance, privacy-focused analytics services are utilized:
          </p>
          <ul>
            <li>
              <strong>Vercel Analytics & Speed Insights:</strong> Provides
              anonymized Core Web Vitals and aggregate pageview counts without
              persistent device fingerprinting or cookies.
            </li>
            <li>
              <strong>Google Analytics:</strong> Configured for aggregate traffic
              analysis with IP anonymization enabled.
            </li>
            <li>
              <strong>Microsoft Clarity:</strong> Provides anonymous behavioral
              telemetry and heatmaps to identify usability bottlenecks and
              improve site navigation.
            </li>
          </ul>

          <h2>Third-party services and external links</h2>
          <p>
            This website links to external platforms such as GitHub, LinkedIn,
            YouTube, and X. Embedded videos or external repositories have their
            own independent privacy policies and terms. Image assets are served
            via Cloudinary CDN to ensure fast delivery.
          </p>

          <h2>Data retention and your rights</h2>
          <p>
            You have the right to ask for a copy of any personal data you have
            submitted, or to request that your comments or contact messages be
            updated or permanently deleted from our database.
          </p>
          <p>
            If you would like to request removal of a comment or have questions
            regarding your information, please reach out directly:
          </p>
          <ul>
            <li>
              Email:{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
            </li>
            <li>
              Website:{" "}
              <Link href="/#contact">Contact section on homepage</Link>
            </li>
          </ul>
        </article>
      </Container>
    </Section>
  );
}
