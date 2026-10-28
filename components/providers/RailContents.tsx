"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Heading } from "@/lib/mdx";

/**
 * The page's table of contents, handed to the profile rail (v2.1.0 draft).
 *
 * The rail lives in the root layout and the headings live in the post, so a
 * post renders `<RailContents headings={...} />` and the rail reads them back
 * with `useRailContents()`. The post clears them when it unmounts, so the
 * next page gets the ordinary rail.
 */

const ContentsContext = createContext<Heading[] | null>(null);
const SetContentsContext = createContext<(headings: Heading[] | null) => void>(
  () => {},
);

export function RailContentsProvider({ children }: { children: ReactNode }) {
  const [headings, setHeadings] = useState<Heading[] | null>(null);
  return (
    <SetContentsContext.Provider value={setHeadings}>
      <ContentsContext.Provider value={headings}>
        {children}
      </ContentsContext.Provider>
    </SetContentsContext.Provider>
  );
}

export function useRailContents(): Heading[] | null {
  return useContext(ContentsContext);
}

export function RailContents({ headings }: { headings: Heading[] }) {
  const setHeadings = useContext(SetContentsContext);
  useEffect(() => {
    setHeadings(headings);
    return () => setHeadings(null);
  }, [headings, setHeadings]);
  return null;
}
