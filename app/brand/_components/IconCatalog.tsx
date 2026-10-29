import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  Folder,
  FolderGit2,
  FolderOpen,
  FolderSearch,
  Globe,
  GraduationCap,
  Hash,
  History,
  House,
  ImageIcon,
  Layers,
  Link2,
  List,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageSquare,
  MessagesSquare,
  Mic,
  Moon,
  Network,
  PenLine,
  Presentation,
  RefreshCw,
  Reply,
  RotateCcw,
  Rss,
  Search,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  SmilePlus,
  Sparkles,
  Sun,
  Tag,
  Terminal,
  Ticket,
  Users,
  Video,
  X,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { Subsection } from "@/components/ui";
import {
  IconAiEngineering,
  IconCommunityBuilding,
  IconOpenSource,
  IconPublicSpeaking,
  IconTechnicalVideos,
  IconTechnicalWriting,
  type PillarIconComponent,
} from "@/components/icons/PillarIcons";
import { SOCIAL_ICONS } from "@/lib/social-icons";

/**
 * Every icon the site draws, on one page (v2.1.0 draft).
 *
 * The interface set is Lucide, listed by where it is used. When a component
 * starts importing a new icon, add it here too - the catalog is only useful
 * while it is the whole set.
 */

type Entry = [icon: LucideIcon, name: string, use: string];

const INTERFACE_ICONS: { title: string; icons: Entry[] }[] = [
  {
    title: "Navigation and direction",
    icons: [
      [House, "House", "Home, in the rail"],
      [Menu, "Menu", "Open the mobile nav"],
      [X, "X", "Close, clear, remove a filter"],
      [ChevronDown, "ChevronDown", "Dropdowns, submenus, contents"],
      [ChevronRight, "ChevronRight", "Sitemap tree"],
      [ArrowRight, "ArrowRight", "Internal link buttons"],
      [ArrowLeft, "ArrowLeft", "Back to all posts, in the rail"],
      [ArrowUpRight, "ArrowUpRight", "External links in lists"],
      [ArrowUp, "ArrowUp", "Back to top"],
      [ArrowDown, "ArrowDown", "Load more"],
      [ArrowUpDown, "ArrowUpDown", "Sort"],
      [ExternalLink, "ExternalLink", "External link buttons"],
    ],
  },
  {
    title: "Actions",
    icons: [
      [Mail, "Mail", "Email, get in touch"],
      [Send, "Send", "Send a message"],
      [Reply, "Reply", "Reply to a comment"],
      [Copy, "Copy", "Copy code, hex, snippets"],
      [Check, "Check", "Copied, selected"],
      [Download, "Download", "Download an asset"],
      [Share2, "Share2", "Share a post"],
      [Link2, "Link2", "Copy a link"],
      [Search, "Search", "Search fields"],
      [SlidersHorizontal, "SlidersHorizontal", "Filters"],
      [RotateCcw, "RotateCcw", "Retry after an error"],
      [RefreshCw, "RefreshCw", "Reconnect when offline"],
      [ZoomIn, "ZoomIn", "Open an image full size"],
      [SmilePlus, "SmilePlus", "Add a reaction"],
      [Sun, "Sun", "Switch to light"],
      [Moon, "Moon", "Switch to dark"],
    ],
  },
  {
    title: "Content and records",
    icons: [
      [Calendar, "Calendar", "Dates"],
      [Clock, "Clock", "Reading time, duration"],
      [History, "History", "Past events"],
      [Sparkles, "Sparkles", "Upcoming, independent host"],
      [Ticket, "Ticket", "Registration"],
      [Megaphone, "Megaphone", "Event type"],
      [Presentation, "Presentation", "Slides"],
      [Video, "Video", "Videos, recordings"],
      [Mic, "Mic", "Talks"],
      [PenLine, "PenLine", "Writing"],
      [Users, "Users", "Communities, audience"],
      [Building2, "Building2", "Host, organisation"],
      [MapPin, "MapPin", "Location"],
      [Briefcase, "Briefcase", "Work, role"],
      [FolderGit2, "FolderGit2", "Projects"],
      [Globe, "Globe", "Website"],
      [Eye, "Eye", "Views"],
      [MessageSquare, "MessageSquare", "Comments"],
      [Terminal, "Terminal", "Code blocks, curl hint"],
      [Code2, "Code2", "Source, project pages"],
      [FileText, "FileText", "Pages, documents"],
      [FileCode, "FileCode", "System files"],
      [Folder, "Folder", "Sitemap folder"],
      [FolderOpen, "FolderOpen", "Open sitemap folder"],
      [FolderSearch, "FolderSearch", "No results"],
      [Hash, "Hash", "Page sections"],
      [Tag, "Tag", "Release, tags"],
      [Rss, "Rss", "Feed"],
      [List, "List", "Table of contents"],
      [Layers, "Layers", "The About section mark"],
      [BriefcaseBusiness, "BriefcaseBusiness", "The Work section mark"],
      [GraduationCap, "GraduationCap", "The Education section mark"],
      [Network, "Network", "The Community section mark"],
      [MessagesSquare, "MessagesSquare", "The Contact section mark"],
      [ImageIcon, "ImageIcon", "Image placeholder"],
    ],
  },
  {
    title: "States",
    icons: [
      [CheckCircle2, "CheckCircle2", "Do"],
      [XCircle, "XCircle", "Don't"],
      [AlertCircle, "AlertCircle", "Error"],
      [ShieldCheck, "ShieldCheck", "Fallback active"],
    ],
  },
];

/**
 * The homepage's section marks, in page order: each section's icon drawn as a
 * dotted line on the hero's dot grid in the panel's top-right corner. Angular
 * shapes only, and never an icon the section already uses.
 */
const SECTION_MARKS: [LucideIcon, string, string][] = [
  [Layers, "About", "Layers - systems across the stack"],
  [BriefcaseBusiness, "Work", "BriefcaseBusiness - where I have worked"],
  [GraduationCap, "Education", "GraduationCap - academic background"],
  [Network, "Community", "Network - bringing developers together"],
  [MessagesSquare, "Contact", "MessagesSquare - let us talk"],
];

const PILLAR_ICONS: [PillarIconComponent, string][] = [
  [IconAiEngineering, "AI engineering"],
  [IconOpenSource, "Open source"],
  [IconPublicSpeaking, "Public speaking"],
  [IconTechnicalWriting, "Technical writing"],
  [IconTechnicalVideos, "Technical videos"],
  [IconCommunityBuilding, "Community building"],
];

/**
 * The icon-only buttons, drawn at their real size. Every one is a circle - a
 * capsule as wide as it is tall - at the one stroke weight, so the sizes are
 * the only thing that varies. A specimen rather than the live control: several
 * are fixed to the viewport or live inside a dialog, and would not sit still
 * on this page.
 */
const ICON_BUTTONS: {
  label: string;
  icon: LucideIcon;
  box: number;
  glyph: number;
}[] = [
  { label: "Icon button", icon: Copy, box: 40, glyph: 16 },
  { label: "Icon button, small", icon: Copy, box: 32, glyph: 14 },
  { label: "Theme (rail photo)", icon: Moon, box: 40, glyph: 16 },
  { label: "Back to top", icon: ArrowUp, box: 40, glyph: 16 },
  { label: "Home (rail)", icon: House, box: 38, glyph: 16 },
  { label: "Theme (nav, rail)", icon: Sun, box: 36, glyph: 16 },
  { label: "Menu (mobile nav)", icon: Menu, box: 36, glyph: 16 },
  { label: "Close (image viewer)", icon: X, box: 32, glyph: 14 },
  { label: "Clear (search)", icon: X, box: 26, glyph: 14 },
];

export const INTERFACE_ICON_COUNT = INTERFACE_ICONS.reduce(
  (total, group) => total + group.icons.length,
  0,
);

function Caption({ name, use }: { name: string; use: string }) {
  return (
    <span className="min-w-0">
      <span className="block font-mono text-label text-fg">{name}</span>
      <span className="block text-label text-fg-muted">{use}</span>
    </span>
  );
}

const tile = "tile flex items-center gap-3 p-4";

export function IconCatalog() {
  return (
    <div className="space-y-8 mt-6">
      {INTERFACE_ICONS.map((group) => (
        <Subsection key={group.title} title={group.title}>
          <ul className="grid grid-cols-1 @xl/section:grid-cols-2 @4xl/section:grid-cols-3 gap-2">
            {group.icons.map(([Icon, name, use]) => (
              <li key={name} className={tile}>
                <Icon className="h-5 w-5 shrink-0 text-fg" aria-hidden="true" />
                <Caption name={name} use={use} />
              </li>
            ))}
          </ul>
        </Subsection>
      ))}

      <Subsection title="Icon buttons">
        <ul className="grid grid-cols-2 @xl/section:grid-cols-3 @4xl/section:grid-cols-4 gap-2">
          {ICON_BUTTONS.map(({ label, icon: Icon, box, glyph }) => (
            <li
              key={label}
              className="tile flex flex-col items-center gap-3 p-4 text-center"
            >
              <span
                className="inline-flex items-center justify-center rounded-full border border-border-strong bg-bg-surface text-fg"
                style={{ width: box, height: box }}
                aria-hidden="true"
              >
                <Icon style={{ width: glyph, height: glyph }} />
              </span>
              <Caption
                name={label}
                use={`${box}px circle · ${glyph}px glyph`}
              />
            </li>
          ))}
        </ul>
      </Subsection>

      <Subsection title="Section marks">
        <ul className="grid grid-cols-1 @xl/section:grid-cols-2 @4xl/section:grid-cols-3 gap-2">
          {SECTION_MARKS.map(([Icon, section, note]) => (
            <li key={section} className="tile p-4 space-y-3">
              <div className="section-mark" aria-hidden="true">
                <Icon />
              </div>
              <Caption name={section} use={note} />
            </li>
          ))}
        </ul>
      </Subsection>

      <Subsection title="Pillar marks">
        <ul className="grid grid-cols-1 @xl/section:grid-cols-2 @4xl/section:grid-cols-3 gap-2">
          {PILLAR_ICONS.map(([Icon, name]) => (
            <li key={name} className={tile}>
              <Icon className="h-6 w-6 shrink-0 text-fg" aria-hidden="true" />
              <Caption name={name} use="About, pillar cards" />
            </li>
          ))}
        </ul>
      </Subsection>

      <Subsection title="Social marks">
        <ul className="grid grid-cols-1 @xl/section:grid-cols-2 @4xl/section:grid-cols-3 gap-2">
          {SOCIAL_ICONS.map(({ icon: Icon, label }) => (
            <li key={label} className={tile}>
              <Icon className="h-5 w-5 shrink-0 text-fg" aria-hidden="true" />
              <Caption name={label} use="Rail, hero, footer" />
            </li>
          ))}
        </ul>
      </Subsection>

      <div className="text-small text-fg-muted pt-3 border-t border-border-strong/40">
        Lucide · 16px in controls and beside body text, 14px in small buttons
        and beside small text, 32px as an empty-state illustration · one stroke
        weight, 1.75, everywhere · always currentColor, never a colour of its
        own · a homepage section mark is the section&apos;s icon at 160px, drawn
        as a dotted line on the hero&apos;s dot grid in the panel&apos;s
        top-right corner
      </div>
    </div>
  );
}
