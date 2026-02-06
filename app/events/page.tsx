import { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { api } from "@/lib/api";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { EventList } from "./_components/EventList";

export const metadata: Metadata = {
  title: "Events | Dileepa Bandara",
  description:
    "Explore my past and upcoming events, conference talks, workshops, and podcast appearances on web development and software engineering topics.",
};

export default async function EventsPage() {
  const events = (await api.getEvents()) || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-bg-primary">
        <Container>
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <FaCalendarAlt className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Events
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              Conference talks, workshops, meetups, and podcast appearances
              where I share knowledge and insights with the tech community.
            </p>
            <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
              Back to Home
            </Button>
          </div>

          {/* Events List (Search & Sort) */}
          <EventList initialEvents={events} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
