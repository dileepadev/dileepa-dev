"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitBranch } from "lucide-react";
import { FaGithub } from "@/components/icons/SocialIcons";
import { Container, Lockup } from "@/components/ui";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";
import { SOCIAL_ICONS } from "@/lib/social-icons";
import type { About } from "@/lib/api-types";
import { cn } from "@/lib/utils";

export function Footer({ about }: { about?: About | null }) {
  const pathname = usePathname();
  const links = about?.links;
  const socials = SOCIAL_ICONS.map((icon) => ({
    ...icon,
    href: links?.[icon.key],
  })).filter((icon): icon is typeof icon & { href: string } =>
    Boolean(icon.href),
  );

  const isLinkActive = (href: string) => {
    if (href.startsWith("http") || href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
                {socials.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                    >
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="footer-col">
              {/* Column titles are mono — they are labels, not headings. */}
              <div className="footer-col-title">{column.title}</div>
              {column.links.map((link) => {
                const active = isLinkActive(link.href);
                return link.isExternal ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(active && "is-active")}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(active && "is-active")}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {SITE_CONFIG.author}
          </span>
          <div className="footer-meta">
            <Link
              href="/brand"
              className={cn(isLinkActive("/brand") && "is-active text-brand")}
            >
              Brand
            </Link>
            <span className="text-border-strong" aria-hidden="true">
              /
            </span>
            <Link
              href="/privacy"
              className={cn(isLinkActive("/privacy") && "is-active text-brand")}
            >
              Privacy
            </Link>
            <span className="text-border-strong" aria-hidden="true">
              /
            </span>
            <Link
              href="/terms"
              className={cn(isLinkActive("/terms") && "is-active text-brand")}
            >
              Terms
            </Link>
            <span className="text-border-strong" aria-hidden="true">
              /
            </span>
            <Link
              href="/sitemap"
              className={cn(isLinkActive("/sitemap") && "is-active text-brand")}
            >
              Sitemap
            </Link>
            <span className="text-border-strong" aria-hidden="true">
              /
            </span>
            <a
              href={SITE_CONFIG.repository}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="inline-flex items-center gap-1.5"
            >
              <FaGithub className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Source</span>
            </a>
            <span className="text-border-strong" aria-hidden="true">
              /
            </span>
            <a
              href={`${SITE_CONFIG.repository}/tree/${SITE_CONFIG.branch}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View branch ${SITE_CONFIG.branch} on GitHub`}
              className="inline-flex items-center gap-1.5"
            >
              <GitBranch
                className="h-3.5 w-3.5 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>v{SITE_CONFIG.version}</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
