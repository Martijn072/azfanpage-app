import { useState } from 'react';
import { TemplateSelector, TemplateType } from '@/components/visuals/TemplateSelector';
import { VisualPreview } from '@/components/visuals/VisualPreview';
import { BackgroundUploader } from '@/components/visuals/BackgroundUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Visuals = () => {
  const [selected, setSelected] = useState<TemplateType>('result');
  const [playerName, setPlayerName] = useState('');
  const [tagline, setTagline] = useState('');
  const [headline, setHeadline] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [statValue, setStatValue] = useState('');
  const [statLabel, setStatLabel] = useState('');
  const [question, setQuestion] = useState('');
  const [backgrounds, setBackgrounds] = useState<Record<TemplateType, string | null>>({
    result: null,
    preview: null,
    standings: null,
    matchday: null,
    player: null,
    quote: null,
    breaking: null,
    stat: null,
    gameday: null,
    poll: null,
  });

  const handleUpload = (url: string) => {
    setBackgrounds((prev) => ({ ...prev, [selected]: url }));
  };

  const handleRemove = () => {
    setBackgrounds((prev) => ({ ...prev, [selected]: null }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-app-title font-headline text-foreground">Visuals</h1>
        <p className="text-app-body text-muted-foreground mt-1">
          Genereer social media-afbeeldingen met live wedstrijddata
        </p>
      </div>

      <TemplateSelector selected={selected} onSelect={setSelected} />

      <BackgroundUploader
        backgroundImage={backgrounds[selected]}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />

      {(selected === 'player' || selected === 'quote') && (
        <div className="flex gap-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="playerName">Spelernaam</Label>
            <Input id="playerName" placeholder="bijv. Vangelis Pavlidis" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="tagline">{selected === 'quote' ? 'Citaat' : 'Tagline'}</Label>
            <Input id="tagline" placeholder={selected === 'quote' ? 'bijv. Dit was onze beste wedstrijd' : 'bijv. Hat-trick hero'} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
        </div>
      )}

      {selected === 'breaking' && (
        <div className="flex gap-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" placeholder="bijv. Pavlidis tekent bij tot 2028" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="subtitle">Subtitel</Label>
            <Input id="subtitle" placeholder="bijv. Transfernieuws" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
        </div>
      )}

      {selected === 'stat' && (
        <div className="flex gap-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="statValue">Getal / waarde</Label>
            <Input id="statValue" placeholder="bijv. 100" value={statValue} onChange={(e) => setStatValue(e.target.value)} />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="statLabel">Beschrijving</Label>
            <Input id="statLabel" placeholder="bijv. Goals voor AZ" value={statLabel} onChange={(e) => setStatLabel(e.target.value)} />
          </div>
        </div>
      )}

      {selected === 'poll' && (
        <div className="space-y-1.5">
          <Label htmlFor="question">Vraag / stelling</Label>
          <Input id="question" placeholder="bijv. Wordt AZ kampioen dit seizoen?" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </div>
      )}

      <VisualPreview
        template={selected}
        backgroundImage={backgrounds[selected]}
        playerName={playerName}
        tagline={tagline}
        headline={headline}
        subtitle={subtitle}
        statValue={statValue}
        statLabel={statLabel}
        question={question}
      />
    </div>
  );
};

export default Visuals;
