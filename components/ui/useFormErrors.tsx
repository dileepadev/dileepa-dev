"use client";

import { useCallback, useId, useState } from "react";
import { CircleAlert } from "lucide-react";

/** What to say when a field is empty, and when it holds the wrong kind of value. */
export interface FieldMessages {
  missing: string;
  invalid?: string;
}

type Field = HTMLInputElement | HTMLTextAreaElement;

/**
 * The site's own form validation messages (v2.1.0 draft).
 *
 * The forms used to lean on the browser for this: a required field left
 * empty raised the browser's own bubble - a different shape, font and
 * wording in every browser, none of them this site's. The rules stay the
 * browser's (`required`, `type="email"`, read through the constraint
 * validation API), so nothing is checked twice; what changes is how a
 * failure is shown:
 *
 * - the form is `noValidate`, so no bubble appears;
 * - on submit every field is checked, each failure is written under its
 *   field in the error colour, and focus moves to the first one;
 * - a message is tied to its field with `aria-describedby` and the field is
 *   marked `aria-invalid`, so a screen reader hears it on focus;
 * - once shown, a message follows the field as it is edited and clears the
 *   moment the value is acceptable - it is not re-checked before a first
 *   submit, so nobody is told off for a field they have not reached.
 *
 * `messages` is keyed by each field's `name`.
 */
export function useFormErrors(messages: Record<string, FieldMessages>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prefix = useId();

  const messageFor = useCallback(
    (field: Field): string | null => {
      if (field.validity.valid) return null;
      const copy = messages[field.name];
      if (field.validity.valueMissing) {
        return copy?.missing ?? "Fill in this field.";
      }
      return copy?.invalid ?? copy?.missing ?? "Check this field.";
    },
    [messages],
  );

  /** Checks every field; shows what failed and focuses the first. */
  const validate = useCallback(
    (form: HTMLFormElement): boolean => {
      const next: Record<string, string> = {};
      let first: Field | null = null;
      for (const element of Array.from(form.elements)) {
        if (
          !(element instanceof HTMLInputElement) &&
          !(element instanceof HTMLTextAreaElement)
        ) {
          continue;
        }
        if (!element.willValidate || !element.name) continue;
        const message = messageFor(element);
        if (message) {
          next[element.name] = message;
          first ??= element;
        }
      }
      setErrors(next);
      first?.focus();
      return first === null;
    },
    [messageFor],
  );

  const recheck = useCallback(
    (event: React.FormEvent<Field>) => {
      const field = event.currentTarget;
      setErrors((current) => {
        if (!(field.name in current)) return current;
        const message = messageFor(field);
        if (message === current[field.name]) return current;
        const next = { ...current };
        if (message) next[field.name] = message;
        else delete next[field.name];
        return next;
      });
    },
    [messageFor],
  );

  const errorId = (name: string) => `${prefix}-${name}-error`;

  /** Spread onto a field: links it to its message and re-checks it on edit. */
  const fieldProps = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? errorId(name) : undefined,
    onInput: recheck,
  });

  /** The message under a field, or nothing. Inline, so it can sit in a label. */
  const errorFor = (name: string) =>
    errors[name] ? (
      <span id={errorId(name)} className="field-error">
        <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {errors[name]}
      </span>
    ) : null;

  const clear = useCallback(() => setErrors({}), []);

  return { validate, fieldProps, errorFor, clear };
}
