import { useState } from 'react';
import { TemplateSelector, TemplateType } from '@/components/visuals/TemplateSelector';
import { VisualPreview } from '@/components/visuals/VisualPreview';

const Visuals = () => {
  const [selected, setSelected] = useState<TemplateType>('result');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-app-title font-headline text-foreground">Visuals</h1>
        <p className="text-app-body text-muted-foreground mt-1">
          Genereer social media-afbeeldingen met live wedstrijddata
        </p>
      </div>

      <TemplateSelector selected={selected} onSelect={setSelected} />

      <VisualPreview template={selected} />
    </div>
  );
};

export default Visuals;
