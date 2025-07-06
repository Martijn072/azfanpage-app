import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Heart, Star, ExternalLink, MapPin, Phone, Mail, Clock } from "lucide-react";

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
    tagline: "Slimme websites. Lokale kracht.",
    fullDescription: "072DESIGN is een webdesignbureau uit Alkmaar, gespecialiseerd in het ontwerpen, bouwen en onderhouden van professionele WordPress-websites. Al meer dan tien jaar helpt 072DESIGN ondernemers, organisaties en creatievelingen om online op te vallen met maatwerk oplossingen. Van strakke onepagers tot complexe webshops — altijd met oog voor snelheid, gebruiksvriendelijkheid en resultaat. 072DESIGN is diep geworteld in de regio. De naam zegt het al: 072 staat niet alleen voor Alkmaar, maar ook voor lokale betrokkenheid. Klanten waarderen de persoonlijke aanpak, het strategisch meedenken en de no-nonsense mentaliteit die typisch is voor Noord-Holland.",
    website: "https://072design.nl",
    phone: "072-303-0072",
    email: "info@072design.nl",
    address: "Alkmaar, Noord-Holland",
    hours: "Ma-Vr: 9:00-17:00",
    partnershipReason: "Bij 072DESIGN geloven we in de kracht van lokale initiatieven. AZFanpage is uitgegroeid tot hét onafhankelijke supportersplatform van Alkmaar en omstreken — een plek waar liefde voor AZ en journalistieke kwaliteit samenkomen. Als Alkmaars bedrijf zijn we trots om dit platform te ondersteunen, zodat het advertentievrij en onafhankelijk kan blijven. Want echte supporters verdienen echte verhalen."
  },
  {
    id: "voltvast",
    name: "VoltVast",
    description: "Energieopslag voor thuis. VoltVast helpt huishoudens grip te krijgen op hun eigen energie.",
    logo: "/placeholder.svg",
    tier: "premium",
    since: "2024",
    category: "Energie",
    tagline: "Jouw energie, jouw regels.",
    fullDescription: "VoltVast maakt thuisbatterijen toegankelijk voor iedereen. Wij leveren advies, installatie en slimme technologie om energie op te slaan en optimaal te gebruiken. Zo ben je minder afhankelijk van het net, verlaag je je energiekosten én draag je bij aan een duurzamer Nederland. Vanuit Noord-Holland werken we met lokale installateurs en persoonlijke begeleiding. Of je nu zonnepanelen hebt of niet — met een thuisbatterij van VoltVast haal je het maximale uit jouw stroom. Transparant, betrouwbaar en toekomstgericht.",
    website: "https://voltvast.nl",
    phone: "072-888-8888",
    email: "info@voltvast.nl",
    address: "Noord-Holland",
    hours: "Ma-Vr: 8:00-18:00",
    partnershipReason: "VoltVast staat voor onafhankelijkheid, en dat herkennen we ook in AZFanpage. Als supporter wil je eerlijke verhalen lezen, vrij van commerciële belangen. Daarom dragen wij graag bij aan een platform dat met hart en ziel verslag doet van de club. Bovendien zijn veel van onze klanten echte AZ'ers — dat verbindt."
  },
  {
    id: "dutch-balance",
    name: "Dutch Balance",
    description: "Natuurproducten voor balans. Dutch Balance biedt hoogwaardige supplementen voor lichaam en geest.",
    logo: "/placeholder.svg",
    tier: "premium",
    since: "2024",
    category: "Gezondheid",
    tagline: "In balans met de natuur.",
    fullDescription: "Dutch Balance richt zich op natuurlijke gezondheid. We bieden een zorgvuldig samengesteld assortiment aan vitamines, paddenstoelextracten en CBD-producten — allemaal gericht op het ondersteunen van je immuunsysteem, energiehuishouding en mentale balans. Onze producten zijn puur, transparant en ontwikkeld met aandacht voor kwaliteit. Van cordyceps tot lion's mane en CBD-olie: alles wat we aanbieden sluit aan bij een gezonde en bewuste levensstijl. Dutch Balance is ontstaan vanuit de overtuiging dat de natuur ons waardevolle tools geeft om beter in ons vel te zitten.",
    website: "https://dutchbalance.nl",
    phone: "020-123-4567",
    email: "info@dutchbalance.nl",  
    address: "Nederland",
    hours: "Ma-Vr: 9:00-17:00",
    partnershipReason: "Gezondheid, balans en betrokkenheid vormen de kern van Dutch Balance. AZFanpage laat diezelfde betrokkenheid zien — richting de club én richting de community. Wij geloven in onafhankelijke, eerlijke content en ondersteunen graag een platform dat met liefde voor AZ en respect voor de lezer opereert. Omdat mentale én fysieke gezondheid ook begint met een goede dosis verbondenheid."
  }
];

export default function PartnerDetail() {
  const [activeTab, setActiveTab] = useState("home");
  const { partnerId } = useParams();
  const navigate = useNavigate();

  const partner = partnersData.find(p => p.id === partnerId);

  if (!partner) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-headline-lg mb-4">Partner niet gevonden</h1>
            <Button onClick={() => navigate("/partners")}>
              Terug naar Partners
            </Button>
          </div>
        </main>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  const handleWebsiteClick = () => {
    window.open(partner.website, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/partners")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar Partners
        </Button>

        {/* Partner Header */}
        <Card className="mb-8">
          <CardHeader className="text-center pb-6">
            {partner.tier === "premium" && (
              <div className="flex justify-center mb-4">
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                  <Star className="w-4 h-4 mr-1" />
                  Premium Partner
                </Badge>
              </div>
            )}
            
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-xl flex items-center justify-center">
              <Building2 className="w-12 h-12 text-muted-foreground" />
            </div>
            
            <CardTitle className="text-headline-lg font-headline text-card-foreground mb-2">
              {partner.name}
            </CardTitle>
            
            <div className="flex items-center justify-center gap-4 text-body-sm text-muted-foreground">
              <Badge variant="outline">{partner.category}</Badge>
              <span>Partner sinds {partner.since}</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <CardDescription className="text-center text-body-md leading-relaxed text-muted-foreground">
              {partner.fullDescription}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Partnership Reason */}
        <Card className="mb-8 bg-gradient-to-br from-az-red/5 to-az-red/10 dark:from-az-red/10 dark:to-az-red/20 
                         border-az-red/20">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-az-red" />
              <CardTitle className="text-headline-sm text-card-foreground">
                Waarom zij AZFanpage steunen
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-body-md leading-relaxed text-card-foreground italic">
              "{partner.partnershipReason}"
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-headline-sm text-card-foreground">
              Contact & Bezoekgegevens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-az-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-card-foreground">Adres</p>
                    <p className="text-body-sm text-muted-foreground">{partner.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-az-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-card-foreground">Openingstijden</p>
                    <p className="text-body-sm text-muted-foreground">{partner.hours}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-az-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-card-foreground">Telefoon</p>
                    <a 
                      href={`tel:${partner.phone}`}
                      className="text-body-sm text-az-red hover:underline"
                    >
                      {partner.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-az-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-card-foreground">Email</p>
                    <a 
                      href={`mailto:${partner.email}`}
                      className="text-body-sm text-az-red hover:underline"
                    >
                      {partner.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Website CTA */}
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-headline-sm font-semibold text-card-foreground mb-4">
              Ontdek meer over {partner.name}
            </h3>
            <Button 
              onClick={handleWebsiteClick}
              className="bg-az-red hover:bg-red-700 text-white"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Bezoek website
            </Button>
            <p className="text-body-sm text-muted-foreground mt-4">
              Opent in nieuwe tab
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}