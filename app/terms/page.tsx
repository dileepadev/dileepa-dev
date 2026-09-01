import type { Metadata } from "next";
import Link from "next/link";
import { Container, PagePath, Section } from "@/components/ui";
import { PAGES, SITE_CONFIG } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: PAGES.terms.meta.title,
  description: PAGES.terms.meta.description,
  path: "/terms",
});

export default function TermsOfServicePage() {
  return (
    <Section>
      <Container>
        <div className="mb-2">
          <PagePath path="/terms" />
        </div>
        <div className="section-label">{PAGES.terms.label}</div>
        <h1>{PAGES.terms.title}</h1>
        <p className="section-intro">{PAGES.terms.intro}</p>

        <div className="font-mono text-label text-fg-muted mt-2 mb-8">
          Last updated: 1 September 2026
        </div>

        <article className="prose max-w-3xl">
          <h2>1. Introduction</h2>
          <p>
            Welcome to dileepa.dev. By accessing or using this website, you
            agree to comply with and be bound by these Terms of Service. If you
            disagree with any part of these terms, please discontinue use of the
            site.
          </p>

          <h2>2. Use of content</h2>
          <p>
            The written articles, guides, essays, photographs, and event
            summaries published on this site are created by Dileepa Bandara
            unless stated otherwise.
          </p>
          <ul>
            <li>
              You are welcome to read, link to, and quote short excerpts with
              appropriate attribution and a link back to the original source.
            </li>
            <li>
              Republishing entire blog posts or substantial portions of the site
              without prior written consent is prohibited.
            </li>
          </ul>

          <h2>3. Open source code and samples</h2>
          <p>
            Code snippets shared in blog posts, tutorials, and repositories
            linked from this site are generally made available under permissive
            open source licenses (such as MIT or Apache 2.0) specified in their
            respective repositories.
          </p>
          <p>
            All code samples are provided &quot;as is&quot; for educational
            demonstration. You are responsible for testing, validating, and
            securing any code before using it in production systems.
          </p>

          <h2>4. User conduct and acceptable use</h2>
          <p>
            When submitting inquiries through the contact form or participating
            in the blog comment sections, you agree to:
          </p>
          <ul>
            <li>
              Provide genuine messages and constructive, civil contributions.
            </li>
            <li>
              Not submit malicious code, scripts, automated bot submissions, or
              harmful links.
            </li>
            <li>
              Not post content that is defamatory, harassing, unlawful, or
              promotional spam.
            </li>
          </ul>
          <p>
            Comments are not reviewed before they appear. They publish
            immediately, behind a rate limit and a spam honeypot rather than a
            queue, and moderation happens afterwards: I may hide, edit, or
            delete any comment that breaks the guidelines above, without prior
            notice. Hiding a comment is reversible and leaves the replies
            underneath it intact; deleting one is permanent.
          </p>

          <h2>5. Disclaimers and limitation of liability</h2>
          <p>
            The content on this website reflects personal technical insights,
            research, and opinions. While I strive for technical precision,
            information is provided without warranties of completeness,
            accuracy, or fitness for a particular purpose.
          </p>
          <p>
            In no event shall Dileepa Bandara be liable for any direct,
            indirect, incidental, or consequential damages resulting from the
            use of or inability to use the information, guides, or software
            presented on this site.
          </p>

          <h2>6. Third-party links</h2>
          <p>
            This website includes hyperlinks to third-party services and
            platforms (such as GitHub, LinkedIn, YouTube, and X). These links
            are provided solely for reference and convenience. I have no control
            over and assume no responsibility for the content, privacy
            practices, or availability of any third-party websites.
          </p>

          <h2>7. Changes to terms</h2>
          <p>
            These terms may be updated periodically to reflect site updates or
            legal requirements. Any updates will be posted on this page with an
            updated &quot;Last updated&quot; date.
          </p>

          <h2>8. Contact information</h2>
          <p>
            If you have any questions regarding these Terms of Service, please
            get in touch:
          </p>
          <ul>
            <li>
              Email:{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
            </li>
            <li>
              Contact form: <Link href="/#contact">dileepa.dev/#contact</Link>
            </li>
            <li>
              Privacy policy:{" "}
              <Link href="/privacy">What this site collects, and why</Link>
            </li>
          </ul>
        </article>
      </Container>
    </Section>
  );
}
