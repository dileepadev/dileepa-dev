"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, MessagesSquare, Send } from "lucide-react";
import { IndexSection, useFormErrors } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import type { About } from "@/lib/api-types";
import { SECTIONS, SITE_CONFIG } from "@/lib/constants";
import { paragraphs } from "@/lib/format";

/** The contact form's validation copy - see `useFormErrors`. */
const FIELD_MESSAGES = {
  name: { missing: "Enter your name." },
  email: {
    missing: "Enter your email address, so I can reply.",
    invalid: "Enter an email address like jane@example.com.",
  },
  subject: { missing: "Add a subject." },
  message: { missing: "Write your message." },
};

export function Contact({ about }: { about: About | null }) {
  const [sending, setSending] = useState(false);
  const { validate, fieldProps, errorFor, clear } =
    useFormErrors(FIELD_MESSAGES);
  const email = about?.links?.email || SITE_CONFIG.email;
  const connectParagraphs = paragraphs(about?.connect);
  const intro = connectParagraphs[0] ?? SECTIONS.contact.intro;
  const additionalCopy = connectParagraphs.slice(1);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validate(form)) return;
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
      clear();
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
    <IndexSection
      id="contact"
      art={MessagesSquare}
      label={SECTIONS.contact.label}
      title={SECTIONS.contact.title}
      intro={intro}
    >
      <div className="contact-panel">
        <div className="contact-info">
          {additionalCopy.length > 0 && (
            <div className="section-copy section-intro -mt-2 mb-6">
              {additionalCopy.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          <a className="contact-email" href={`mailto:${email}`}>
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{email}</span>
          </a>

          {/* The link-in-bio page. It used to sit in the footer's Elsewhere
            column, which Projects now occupies; here it is beside the address,
            which is where a reader is already looking for a way through. */}
          <p className="contact-links">
            Social profiles and everything else:{" "}
            <a
              href={SITE_CONFIG.linksUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              links.dileepa.dev
            </a>
          </p>
        </div>
        <form className="form" onSubmit={onSubmit} noValidate>
          <label>
            <span>
              Name{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </span>
            <input
              type="text"
              name="name"
              {...fieldProps("name")}
              autoComplete="name"
              placeholder="Jane Doe"
              disabled={sending}
              required
            />
            {errorFor("name")}
          </label>
          <label>
            <span>
              Email{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </span>
            <input
              type="email"
              name="email"
              {...fieldProps("email")}
              autoComplete="email"
              placeholder="jane@example.com"
              disabled={sending}
              required
            />
            {errorFor("email")}
          </label>
          <label>
            <span>
              Subject{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </span>
            <input
              type="text"
              name="subject"
              {...fieldProps("subject")}
              placeholder="Project inquiry, speaking, etc."
              disabled={sending}
              required
            />
            {errorFor("subject")}
          </label>
          <label>
            <span>
              Message{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </span>
            <textarea
              name="message"
              {...fieldProps("message")}
              rows={5}
              placeholder="Tell me about your project, idea, or questions…"
              disabled={sending}
              required
            />
            {errorFor("message")}
          </label>
          {/* Names the action, not "Submit". Design system §8. */}
          <button
            className="btn btn--primary inline-flex items-center gap-2"
            type="submit"
            disabled={sending}
          >
            <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{sending ? "Sending…" : "Send message"}</span>
          </button>
        </form>
      </div>
    </IndexSection>
  );
}
