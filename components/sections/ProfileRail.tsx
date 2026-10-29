"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, House, Mail } from "lucide-react";
import { TocList } from "@/components/blog/TableOfContents";
import { useRailContents } from "@/components/providers/RailContents";
import { LinkButton, ThemeToggle } from "@/components/ui";
import type { About } from "@/lib/api-types";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { portrait as portraitUrl } from "@/lib/format";
import { SOCIAL_ICONS } from "@/lib/social-icons";
import { cn } from "@/lib/utils";
import { hashOf, MORE_LINKS, useScrollSpy } from "./Navbar";

/**
 * The long pages whose rail turns into their table of contents, and the way
 * back from each. A blog post - not the index, not a tag listing - goes back
 * to all posts; the brand reference has nowhere particular to go back to.
 */
const CONTENTS_PAGES: {
  route: RegExp;
  back?: { href: string; label: string };
}[] = [
  {
    route: /^\/blog\/(?!tags\/)[^/]+\/?$/,
    back: { href: "/blog", label: "All posts" },
  },
  { route: /^\/brand\/?$/ },
];

/**
 * The profile rail (v2.1.0 draft).
 *
 * On a wide screen every page sits beside this card: who, what, how to reach
 * them, and the whole navigation. It replaces the floating nav there - the
 * nav still renders, and CSS hides it at the width the rail takes over, so a
 * phone keeps the menu it has always had. Section links follow the same
 * scroll position the nav did, and the explore links the current route.
 */
export function ProfileRail({ about }: { about: About | null }) {
  const pathname = usePathname();
  const active = useScrollSpy(pathname === "/");
  // Home reads as current on the homepage until a section takes over.
  const isHome = pathname === "/" && active === null;

  const name = about?.name ?? SITE_CONFIG.name;
  const role = about?.title ?? "";
  const portrait = portraitUrl(about?.images) || "/profile/v2.webp";
  const socials = SOCIAL_ICONS.map((icon) => ({
    ...icon,
    href: about?.links?.[icon.key],
  })).filter((icon): icon is typeof icon & { href: string } =>
    Boolean(icon.href),
  );

  const contentsPage = CONTENTS_PAGES.find((page) => page.route.test(pathname));
  if (contentsPage) {
    return (
      <ContentsRail
        name={name}
        role={role}
        portrait={portrait}
        back={contentsPage.back}
      />
    );
  }

  return (
    <aside className="rail" aria-label="Profile and navigation">
      {/* Style F: the photo runs edge to edge across the top of the card,
          with the theme switch on its corner. */}
      <div className="rail-media">
        <div className="rail-theme">
          <ThemeToggle />
        </div>
        <Image
          className="rail-photo"
          src={portrait}
          alt={name}
          width={640}
          height={512}
          sizes="304px"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="rail-body">
        <div>
          <p className="rail-name">{name}</p>
          {role && (
            <p className="rail-role">
              {role}
              {about?.location && <>, {about.location}</>}
            </p>
          )}
          {about?.status && (
            <p className="rail-status">
              <span className="hero-status-dot" aria-hidden="true" />
              {about.status}
            </p>
          )}
        </div>

        <div className="rail-actions">
          <LinkButton href="/#contact">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Get in touch</span>
          </LinkButton>
        </div>

        <nav className="rail-nav" aria-label="Site">
          <ul>
            <li>
              <Link
                href="/#top"
                className={cn(
                  "rail-link rail-link--icon",
                  isHome && "is-active",
                )}
                aria-label="Home"
                title="Home"
                aria-current={isHome ? "page" : undefined}
              >
                <House className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
            {NAV_LINKS.map((link) => {
              const isCurrent =
                pathname === "/" && hashOf(link.href) === active;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn("rail-link", isCurrent && "is-active")}
                    aria-current={isCurrent ? "true" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul>
            {MORE_LINKS.map((link) => {
              const isCurrent = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn("rail-link", isCurrent && "is-active")}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {socials.length > 0 && (
          <ul className="socials rail-socials" aria-label="Find me on">
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

/**
 * The rail on a long page - a blog post, the brand reference: the page's
 * table of contents.
 *
 * The photo shrinks to an avatar beside the name and the section pills give
 * way to the contents, so the article gets the width a third column used to
 * take. The mode follows the route, so the server renders this shape and
 * nothing jumps on load; the headings arrive from the post a moment later.
 */
function ContentsRail({
  name,
  role,
  portrait,
  back,
}: {
  name: string;
  role: string;
  portrait: string;
  back?: { href: string; label: string };
}) {
  const headings = useRailContents();

  return (
    <aside className="rail rail--contents" aria-label="Profile and contents">
      <div className="rail-id">
        <Image
          className="rail-avatar"
          src={portrait}
          alt=""
          width={96}
          height={96}
          sizes="48px"
        />
        <div className="min-w-0">
          <p className="rail-id-name">{name}</p>
          {role && <p className="rail-role">{role}</p>}
        </div>
        <ThemeToggle />
      </div>

      {headings && headings.length >= 2 && (
        <nav className="rail-toc" aria-label="On this page">
          <p className="rail-toc-title">On this page</p>
          <TocList headings={headings} variant="rail" />
        </nav>
      )}

      <nav className="rail-foot" aria-label="Site">
        <ul>
          <li>
            <Link
              href="/#top"
              className="rail-link rail-link--icon"
              aria-label="Home"
              title="Home"
            >
              <House className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
          {back && (
            <li>
              <Link href={back.href} className="rail-link rail-link--with-icon">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {back.label}
              </Link>
            </li>
          )}
          <li>
            <Link href="/#contact" className="rail-link">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
