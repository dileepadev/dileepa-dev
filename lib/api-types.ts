/**
 * The API's types, named.
 *
 * `lib/api-schema.ts` is generated from `openapi.json` by `openapi-typescript`
 * and is not edited by hand. It is accurate but unreadable — every type is a
 * path through `components["schemas"]`. This file gives the shapes the app
 * actually uses their real names, and is the only place that reaches into the
 * generated file.
 *
 * Regenerate both after an API change:
 *
 *     npm run api:types
 *
 * If a name here stops resolving, the API changed shape. That is the point:
 * the spec wins, and this file is where the break surfaces.
 */

import type { components } from "./api-schema";

type Schemas = components["schemas"];

// --- Resources -------------------------------------------------------------

export type About = Schemas["About"];
export type Experience = Schemas["Experience"];
export type Education = Schemas["Education"];
export type Tool = Schemas["Tool"];
export type Community = Schemas["Community"];
export type Video = Schemas["Video"];
export type Project = Schemas["Project"];
export type EventRecord = Schemas["Event"];
export type BlogPost = Schemas["BlogPost"];

// --- Shared shapes ---------------------------------------------------------

// FastAPI emits `-Input` and `-Output` variants for any model used in both a
// request and a response: the two differ where a field has a default. Reading
// is always the `-Output` side.
export type Image = Schemas["Image"];
export type Logo = Schemas["Logo"];
export type Seo = Schemas["Seo-Output"];
export type Series = Schemas["Series"];
export type Period = Schemas["Period"];
export type Metric = Schemas["Metric"];

export type ProjectLinks = Schemas["ProjectLinks-Output"];
export type GalleryItem = Schemas["GalleryItem"];
export type ProjectStatus = Project["status"];

export type Speaker = Schemas["Speaker-Output"];
export type Photo = Schemas["Photo"];
export type Recording = Schemas["Recording-Output"];
export type Slides = Schemas["Slides"];
export type EventLink = Schemas["EventLink"];
export type Location = Schemas["Location-Output"];
/** The conference or meetup series an event ran under, not the event itself. */
export type Host = Schemas["Host-Output"];
export type EventStatus = EventRecord["status"];
export type EventType = EventRecord["type"];
export type EventFormat = EventRecord["format"];

/**
 * One photo, carrying the event it came from.
 *
 * The gallery is a flat grid across every event, but a photo without its
 * event is a picture of nobody doing nothing — the caption needs the title
 * and the date, so they travel with it.
 */
export interface GalleryPhoto extends Photo {
  eventSlug: string;
  eventTitle: string;
  eventDate: string | null;
}

// --- Envelopes -------------------------------------------------------------

/**
 * Every collection endpoint returns this. There is no second shape — a caller
 * that can page one resource can page all of them.
 */
export interface Page<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

/** The error body, on every endpoint. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// --- Requests --------------------------------------------------------------

export type ContactRequest = Schemas["ContactRequest"];
export type ContactResult = Schemas["ContactResult"];
