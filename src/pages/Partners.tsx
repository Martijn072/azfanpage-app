import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PartnerCard } from "@/components/PartnerCard";
import { useState } from "react";
import { Building2, Heart } from "lucide-react";

// Partners data
const partnersData = [
  {
    id: "072design",
    name: "072DESIGN",
    description: "Webdesign uit Alkmaar. 072DESIGN bouwt slimme websites voor ondernemers die online willen groeien.",
    logo: "/placeholder.svg",
    tier: "premium",
    since: "2024",
    category: "Webdesign",
    tagline: "Slimme websites. Lokale kracht."
  },
  {
    id: "voltvast",
    name: "VoltVast",
    description: "Energieopslag voor thuis. VoltVast helpt huishoudens grip te krijgen op hun eigen energie.",
    logo: "/placeholder.svg",
    tier: "premium",
    since: "2024",
    category: "Energie",
    tagline: "Jouw energie, jouw regels."
  },
  {
    id: "dutch-balance",
    name: "Dutch Balance",
    description: "Natuurproducten voor balans. Dutch Balance biedt hoogwaardige supplementen voor lichaam en geest.",
    logo: "/placeholder.svg",
    tier: "premium",
    since: "2024",
    category: "Gezondheid",
    tagline: "In balans met de natuur."
  }
];

export default function Partners() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-8 h-8 text-az-red" />
            <h1 className="text-headline-lg font-headline text-foreground">
              AZFanpage Partners
            </h1>
          </div>
          
          <p className="text-body-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
            Dankzij onze partners blijft AZFanpage advertentievrij
          </p>
          
          <div className="bg-gradient-to-br from-az-red/5 to-az-red/10 dark:from-az-red/10 dark:to-az-red/20 
                          rounded-xl p-6 border border-az-red/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-az-red" />
              <h2 className="text-headline-sm font-semibold text-foreground">
                Partners die onze missie steunen
              </h2>
            </div>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Deze lokale bedrijven maken onze onafhankelijke berichtgeving mogelijk. 
              Samen houden we AZFanpage onafhankelijk en zorgen we voor een advertentievrije ervaring 
              voor alle AZ supporters.
            </p>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnersData.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 py-8 border-t border-border">
          <p className="text-body-sm text-muted-foreground mb-2">
            Interesse om AZFanpage partner te worden?
          </p>
          <p className="text-body-sm text-muted-foreground">
            Neem contact met ons op via onze sociale media kanalen
          </p>
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}