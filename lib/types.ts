// Shared types that are not API records. API records come from
// `lib/api-types.ts`, generated against `openapi.json`.

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}
