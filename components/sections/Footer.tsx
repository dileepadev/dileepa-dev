import Link from "next/link";
import { Container, Lockup } from "@/components/ui";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";
import { SOCIAL_ICONS } from "@/lib/social-icons";
import type { About } from "@/lib/api-types";

export function Footer({ about }: { about?: About | null }) {
  const links = about?.links;
  const socials = SOCIAL_ICONS.map((icon) => ({
    ...icon,
    href: links?.[icon.key],
  })).filter((icon): icon is typeof icon & { href: string } =>
    Boolean(icon.href),
  );

  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div>
            {/* Not a link to `/` here: the footer's lockup sits at the bottom
                of the page a reader is already on. */}
            <Lockup href="/#top" />
            <p className="footer-tagline">{SITE_CONFIG.description}</p>

            {socials.length > 0 && (
              <div className="socials">
                {socials.map((icon) => (
                  <a
                    key={icon.label}
                    href={icon.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={icon.label}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={icon.path} />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="footer-col">
              {/* Column titles are mono — they are labels, not headings. */}
              <div className="footer-col-title">{column.title}</div>
              {column.links.map((link) =>
                link.isExternal ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {SITE_CONFIG.author}
          </span>
          <div className="footer-meta">
            <a
              href={SITE_CONFIG.repository}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={SOCIAL_ICONS[0].path} />
              </svg>
              <span>Source</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
