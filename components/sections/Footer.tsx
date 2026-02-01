import Link from 'next/link';
import { Container, IconButton } from '@/components/ui';
import { NAV_LINKS, EXTERNAL_LINKS, SOCIAL_LINKS, SITE_CONFIG } from '@/lib/constants';
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram, FaEnvelope, FaHeart } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const iconMap: Record<string, React.ElementType> = {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
  FaEnvelope,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-white">
      <Container>
        <div className="py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block text-2xl font-bold mb-4">
                {SITE_CONFIG.name.split(' ')[0]}
                <span className="text-accent-blue">.</span>
              </Link>
              <p className="text-gray-400 max-w-md mb-6">
                {SITE_CONFIG.description}
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.slice(0, 5).map((social) => {
                  const IconComponent = iconMap[social.icon];
                  return (
                    <IconButton
                      key={social.name}
                      href={social.href}
                      external={true}
                      variant='ghost'
                      className="hover:text-accent-blue hover:bg-transparent"
                      aria-label={social.name}
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
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
                      className="text-gray-400 hover:text-white transition-colors"
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
                      className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                      {link.label}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue">
                        Soon
                      </span>
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
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <FaHeart className="h-4 w-4 text-red-500" /> using Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
