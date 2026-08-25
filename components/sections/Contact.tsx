"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Container, Section, SectionHeading } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import type { About } from "@/lib/api-types";
import { SECTIONS, SITE_CONFIG } from "@/lib/constants";

export function Contact({ about }: { about: About | null }) {
  const [sending, setSending] = useState(false);
  const email = about?.links?.email || SITE_CONFIG.email;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setSending(true);
    try {
      await api.sendMessage({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      toast.success("Message sent. I will reply to the address you gave.");
      form.reset();
    } catch (error) {
      // The API writes its error messages to be shown to a person, so the
      // message is surfaced rather than replaced with a generic one.
      const message =
        error instanceof ApiError
          ? error.message
          : `The message could not be sent. Try again, or email ${email} directly.`;
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Section id="contact">
      <Container>
        <SectionHeading {...SECTIONS.contact} />

        <a className="contact-email" href={`mailto:${email}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {email}
        </a>

        <form className="form" onSubmit={onSubmit}>
          <label>
            <span>
              Name{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </span>
            <input type="text" name="name" autoComplete="name" required />
          </label>
          <label>
            <span>
              Email{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </span>
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label>
            <span>
              Subject{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </span>
            <input type="text" name="subject" required />
          </label>
          <label>
            <span>
              Message{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </span>
            <textarea name="message" required />
          </label>
          {/* Names the action, not "Submit". Design system §8. */}
          <button className="btn btn--primary" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </Container>
    </Section>
  );
}
