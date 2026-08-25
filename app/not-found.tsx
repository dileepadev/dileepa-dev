import { Container, LinkButton, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="section-label">404</div>
        <h1>That page is not here</h1>
        <p className="mt-4 text-fg-muted">
          The link may be out of date, or the page may have moved. The blog,
          projects and events are all reachable from the navigation.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/">Go to the homepage</LinkButton>
          <LinkButton href="/blog" variant="secondary">
            Read the blog
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
