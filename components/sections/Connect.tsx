"use client";

import {
  Container,
  Section,
  SectionHeader,
  Card,
  Button,
  CardButton,
} from "@/components/ui";
import { AboutDto } from "@/lib/api-types";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import React, { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  xtwitter: FaXTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  email: FaEnvelope,
};

export function Connect({ about }: { about?: AboutDto | null }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
    alert("Message sent! I'll get back to you soon.");
  };

  const email = about?.links?.email;

  // Map platform keys to branded display names
  const socialNameMap: Record<string, string> = {
    github: "GitHub",
    linkedin: "LinkedIn",
    xtwitter: "X (Twitter)",
    youtube: "YouTube",
    instagram: "Instagram",
  };

  return (
    <Section id="connect" background="secondary">
      <Container>
        <SectionHeader
          subtitle="Connect"
          title="Let's Get in Touch"
          description="Have a question or want to work together? Feel free to reach out!"
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="elevated">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-primary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-primary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-primary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 mb-14"
                  disabled={isSubmitting}
                  rightIcon={<FaPaperPlane className="h-4 w-4" />}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Social Links & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Direct Contact */}
            {email && (
              <Card variant="elevated">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  Direct Contact
                </h3>
                <p className="text-text-secondary mb-6">
                  Prefer email? You can reach me directly at:
                </p>
                <CardButton
                  variant="secondary"
                  href={`mailto:${email}`}
                  leftIcon={<FaEnvelope className="h-5 w-5" />}
                >
                  {email}
                </CardButton>
              </Card>
            )}

            {/* Social Links */}
            <Card variant="elevated">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Find Me On
              </h3>
              <p className="text-text-secondary mb-6">
                Connect with me on social media for updates and more.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {about?.links &&
                  Object.entries(about.links).map(([key, url]) => {
                    if (key === "website" || key === "email" || !url)
                      return null;
                    const IconComponent = iconMap[key.toLowerCase()];
                    const name =
                      socialNameMap[key.toLowerCase()] ||
                      key.charAt(0).toUpperCase() + key.slice(1);

                    return (
                      <CardButton
                        key={key}
                        variant="social"
                        href={url}
                        external={true}
                        leftIcon={
                          IconComponent && (
                            <IconComponent className="h-5 w-5 shrink-0" />
                          )
                        }
                        className="justify-start"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{name}</p>
                          <p className="text-xs hover:text-on-accent/80 truncate">
                            {url.replace(/^https?:\/\/(www\.)?/, "")}
                          </p>
                        </div>
                      </CardButton>
                    );
                  })}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Thanks for checking in
          </h3>
          <p className="text-lg text-text-secondary">
            🧠 Think deeply. Build wisely. Keep your intelligence sharp!
          </p>
        </div>
      </Container>
    </Section>
  );
}
