import Link from "next/link";
import { Container, IconButton } from "@/components/ui";
import { NAV_LINKS, EXTERNAL_LINKS } from "@/lib/constants";
import { AboutDto } from "@/lib/api-types";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const iconMap: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  xtwitter: FaXTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  email: FaEnvelope,
};

export function Footer({ about }: { about?: AboutDto | null }) {
  const currentYear = new Date().getFullYear();

  // Use data from API or defaults/empty
  const name = about?.name || "Dileepa Bandara";
  const description = about?.tagline || "Personal Developer Portfolio";

  return (
    <footer className="bg-brand-dark text-white border-t border-accent-blue/20">
      <Container>
        <div className="py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block text-2xl font-bold mb-4">
                {name.split(" ")[0]}
                <span className="text-accent-blue">.</span>
              </Link>
              <p className="text-white/80 max-w-md mb-6">{description}</p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {about?.links &&
                  Object.entries(about.links).map(([key, url]) => {
                    // Filter out non-socials
                    if (key === "website" || key === "email" || !url)
                      return null;

                    const platformKey = key.toLowerCase();
                    const IconComponent = iconMap[platformKey];

                    if (!IconComponent) return null;

                    return (
                      <IconButton
                        key={key}
                        href={url}
                        external={true}
                        variant="ghost"
                        className="text-white/80 transition-colors duration-500 hover:text-accent-blue hover:bg-transparent"
                        aria-label={key}
                      >
                        <IconComponent className="h-4 w-4 text-white/80 transition-colors duration-500" />
                      </IconButton>
                    );
                  })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors duration-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* External Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Explore</h4>
              <ul className="space-y-3">
                {EXTERNAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors duration-500 inline-flex items-center gap-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/80 text-sm text-center md:text-left">
              © {currentYear} {name}. All rights reserved.
            </p>
            <p className="text-white/80 text-sm flex items-center gap-1">
              Made with <FaHeart className="h-4 w-4 text-red-500" /> using
              Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
