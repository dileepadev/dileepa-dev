import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

/**
 * The social icon set.
 *
 * Inline paths rather than an icon package: this is six fixed marks that never
 * change, and pulling a 1,500-icon dependency in to render them costs more than
 * it saves. `key` names the field on the API's `about.links` that supplies the
 * URL, so an icon with no link configured is simply not rendered.
 */
export interface SocialIcon {
  label: string;
  key:
    | "github"
    | "linkedin"
    | "xtwitter"
    | "youtube"
    | "instagram"
    | "facebook";
  icon: IconType;
}

export const SOCIAL_ICONS: SocialIcon[] = [
  { label: "GitHub", key: "github", icon: FaGithub },
  { label: "LinkedIn", key: "linkedin", icon: FaLinkedin },
  { label: "X", key: "xtwitter", icon: FaXTwitter },
  { label: "YouTube", key: "youtube", icon: FaYoutube },
  { label: "Instagram", key: "instagram", icon: FaInstagram },
  { label: "Facebook", key: "facebook", icon: FaFacebook },
];
