import { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { api } from "@/lib/api";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import { CommunityList } from "./_components/CommunityList";

export const metadata: Metadata = {
  title: "Communities | Dileepa Bandara",
  description:
    "All tech communities, meetups, and mentorship programs I've contributed to.",
};

export default async function CommunitiesPage() {
  const communities = (await api.getCommunities()) || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-bg-primary">
        <Container>
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <FaUsers className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Tech Communities
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              Meetups, organizing, mentorship, and community contributions
              I&apos;ve been involved with.
            </p>
            <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
              Back to Home
            </Button>
          </div>

          {/* Communities List (Search & Sort) */}
          <CommunityList communities={communities} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
