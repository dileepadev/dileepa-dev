import { Metadata } from "next";
import { Container, Button, Card, Badge } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { api } from "@/lib/api";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Communities | Dileepa Bandara",
  description:
    "All tech communities, meetups, and mentorship programs I've contributed to.",
};

export default async function CommunitiesPage() {
  const apiCommunities = (await api.getCommunities()) || [];
  const communities = apiCommunities.sort((a, b) => {
    // Put current communities first then alphabetically
    if ((a.current ? 1 : 0) !== (b.current ? 1 : 0))
      return (b.current ? 1 : 0) - (a.current ? 1 : 0);
    return (a.name || "").localeCompare(b.name || "");
  });

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

          {/* Communities Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
            {communities.map((community) => (
              <Card
                key={community._id}
                variant="elevated"
                hover
                className="h-full flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue relative overflow-hidden">
                    {community.logo ? (
                      <>
                        <div className="dark:hidden w-full h-full relative">
                          <Image
                            src={community.logo.light}
                            alt={community.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="hidden dark:block w-full h-full relative">
                          <Image
                            src={community.logo.dark}
                            alt={community.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      </>
                    ) : (
                      <FaUsers className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-primary line-clamp-2">
                      {community.name}
                    </h3>
                    <p className="text-accent-blue font-medium">
                      {community.role}
                    </p>
                    <p className="text-text-secondary mt-2 text-sm">
                      {community.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto border-t border-border-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={community.current ? "success" : "default"}
                        size="sm"
                      >
                        {community.current ? "Current" : "Past"}
                      </Badge>
                      {community.period && (
                        <span className="text-xs text-text-muted">
                          {community.period}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {communities.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                No communities yet
              </h2>
              <p className="text-text-secondary mb-6">
                Check back later for community contributions and meetups.
              </p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
