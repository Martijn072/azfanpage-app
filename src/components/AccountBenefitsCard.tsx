
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Smartphone, Clock, Bell, User, Shield, AlertCircle } from "lucide-react";

const AccountBenefitsCard = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Mail,
      title: "Email notificaties",
      description: "Ontvang belangrijke updates via email"
    },
    {
      icon: Smartphone,
      title: "Push notificaties",
      description: "Directe meldingen op je apparaat"
    },
    {
      icon: Clock,
      title: "Stille uren",
      description: "Stel tijden in wanneer je geen notificaties wilt"
    },
    {
      icon: Bell,
      title: "Gepersonaliseerde instellingen",
      description: "Kies precies welke notificaties je wilt ontvangen"
    },
    {
      icon: User,
      title: "Persoonlijk profiel",
      description: "Beheer je voorkeuren en instellingen"
    },
    {
      icon: Shield,
      title: "Veilige opslag",
      description: "Je voorkeuren worden veilig bewaard"
    }
  ];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary">
          Log in met je account
        </CardTitle>
        <CardDescription className="text-lg">
          Ontgrendel alle notificatie-opties en personaliseer je ervaring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Tijdelijke melding over registratie */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Nieuwe account aanmaken is tijdelijk niet beschikbaar. Log in met je bestaande account.
            </p>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="w-full max-w-xs"
          >
            Inloggen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountBenefitsCard;
