import type { Metadata } from "next";
import Link from "next/link";
import { Container, PagePath, Section } from "@/components/ui";
import { PAGES, SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: PAGES.privacy.meta.title,
  description: PAGES.privacy.meta.description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <Section>
      <Container>
        <div className="mb-2">
          <PagePath path="/privacy" />
        </div>
        <div className="section-label">{PAGES.privacy.label}</div>
        <h1>{PAGES.privacy.title}</h1>
        <p className="section-intro">{PAGES.privacy.intro}</p>

        <div className="font-mono text-label text-fg-muted mt-2 mb-8">
          Last updated: 1 September 2026
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
            over HTTPS to my private backend API, stored so I can read and reply
            to your inquiry, and delivered to my inbox by Resend, a transactional
            email provider. Your address is never added to marketing lists,
            newsletters, or third-party mailing systems.
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
            A hidden honeypot field is used to filter out automated spam bots,
            and the comment form is rate limited.
          </p>
          <p>
            Each comment is also stored with an opaque key derived from your IP
            address, described under{" "}
            <a href="#pseudonymous-keys">reactions and page views</a> below. It
            is what lets me see that several comments came from the same person
            when moderating a thread.
          </p>

          <h2 id="pseudonymous-keys">Reactions and page views</h2>
          <p>
            Viewing a post and reacting to one each increment a counter shown on
            that post. Neither asks you for anything, but neither is fully
            anonymous either, and the difference is worth being precise about.
          </p>
          <p>
            To count a reader once rather than once per refresh — and to let you
            change a reaction rather than add a second one — the backend has to
            recognise a repeat request. It does that by hashing your IP address
            together with a server-side secret and the post identifier, and
            storing only the result. Your IP address itself is never written
            down, and the stored value cannot be reversed into an address or
            matched against one held anywhere else.
          </p>
          <p>
            That makes this data pseudonymous rather than anonymous, so it is
            described as such here:
          </p>
          <ul>
            <li>
              <strong>Views:</strong> one key per reader per post, deleted
              automatically 24 hours after it is written. Only the aggregate
              count outlives it.
            </li>
            <li>
              <strong>Reactions:</strong> one key per reader per post, kept for
              as long as the reaction is, so returning to a post shows you the
              reaction you chose.
            </li>
            <li>
              <strong>Comments:</strong> the same construction without the post
              identifier, stored alongside the comment.
            </li>
          </ul>
          <p>
            Your IP address is also read — and not stored — to rate limit the
            contact form and the comment form, which is what keeps both usable.
          </p>

          <h2>Cookies and browser storage</h2>
          <p>
            This site sets no advertising, retargeting, or ad-personalisation
            cookies, and nothing it stores is sold or shared for marketing.
          </p>
          <p>
            It does set analytics cookies. Google Analytics and Microsoft
            Clarity each write their own first-party cookies to tell a returning
            visit from a new one — <code>_ga</code> and <code>_ga_*</code> for
            the former, <code>_clck</code> and <code>_clsk</code> for the
            latter. Vercel Analytics and Speed Insights set none.
          </p>
          <p>
            The site&apos;s own storage stays in your browser and is never sent
            anywhere:
          </p>
          <ul>
            <li>
              <code>localStorage</code> → <code>dileepa-theme</code>: remembers
              your selected colour theme (dark or light) across visits, and
              across dileepa.dev and links.dileepa.dev.
            </li>
            <li>
              <code>sessionStorage</code> → <code>viewed:&lt;post&gt;</code>:
              notes which posts this tab has already counted a view for, so a
              refresh does not send a request the backend would discard anyway.
              It is cleared when you close the tab.
            </li>
          </ul>
          <p>
            All of it can be cleared at any time through your browser settings,
            and blocking site storage entirely does not break the site.
          </p>

          <h2>Analytics and performance telemetry</h2>
          <p>
            Three services measure site health, which articles get read, and how
            the pages perform. Two of them are aggregate-only; the third watches
            how a page is used, and is described as such rather than filed under
            &quot;privacy-focused&quot;:
          </p>
          <ul>
            <li>
              <strong>Vercel Analytics &amp; Speed Insights:</strong> anonymised
              Core Web Vitals and aggregate pageview counts, with no cookies and
              no persistent device fingerprint.
            </li>
            <li>
              <strong>Google Analytics:</strong> aggregate traffic analysis. It
              runs as GA4, which does not log or store full IP addresses. The
              site&apos;s own configuration is page-view measurement and nothing
              more — no advertising or ad-personalisation features are added on
              top of it.
            </li>
            <li>
              <strong>Microsoft Clarity:</strong> heatmaps and session replays —
              a reconstruction of clicks, scrolling, and pointer movement, used
              to find usability problems. Clarity masks page text and form input
              by default, so what you type is not captured.
            </li>
          </ul>
          <p>
            All three load only on the deployed site. Nothing is sent from a
            local development build.
          </p>

          <h2>Third-party services and external links</h2>
          <p>
            This website links to external platforms such as GitHub, LinkedIn,
            YouTube, and X. Embedded videos and external repositories have their
            own independent privacy policies and terms.
          </p>
          <p>
            Where anything you submit actually ends up, in full: the website is
            hosted on Vercel, its API on FastAPI Cloud, and both contact
            messages and comments are stored in MongoDB Atlas. Contact messages
            are additionally delivered by email through Resend. Images are
            served from Cloudinary. There is no other processor.
          </p>

          <h2>Data retention</h2>
          <p>How long each thing is kept:</p>
          <ul>
            <li>
              <strong>Contact messages:</strong> kept until I delete them, so a
              conversation can be picked up later.
            </li>
            <li>
              <strong>Comments:</strong> kept for as long as the post is
              published, unless you ask for yours to be removed. Hiding a
              comment is reversible; deleting one is not.
            </li>
            <li>
              <strong>View keys:</strong> deleted automatically 24 hours after
              they are written.
            </li>
            <li>
              <strong>Reaction keys:</strong> deleted when the reaction is
              cleared.
            </li>
          </ul>

          <h2>Your rights</h2>
          <p>
            You can ask for a copy of any personal data you have submitted, or
            ask that your comments or contact messages be corrected or
            permanently deleted. I handle those requests myself and there is no
            form to fill in — an email is enough.
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

          <h2>Changes to this policy</h2>
          <p>
            This policy is updated when the site changes what it collects,
            rather than on a schedule. Any update is published on this page with
            a new &quot;Last updated&quot; date above it.
          </p>
        </article>
      </Container>
    </Section>
  );
}
