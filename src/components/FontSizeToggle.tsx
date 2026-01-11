import { useFontSize, FontSize } from '@/contexts/FontSizeContext';
import { cn } from '@/lib/utils';

const FontSizeToggle = () => {
  const { fontSize, setFontSize } = useFontSize();

  const sizes: { value: FontSize; label: string; className: string }[] = [
    { value: 'small', label: 'A', className: 'text-sm' },
    { value: 'medium', label: 'A', className: 'text-base' },
    { value: 'large', label: 'A', className: 'text-lg' },
  ];

  return (
    <div 
      className="flex items-center gap-0.5 bg-muted rounded-lg p-1"
      role="group"
      aria-label="Tekstgrootte aanpassen"
    >
      {sizes.map((size) => (
        <button
          key={size.value}
          onClick={() => setFontSize(size.value)}
          className={cn(
            'px-2.5 py-1.5 rounded-md transition-all duration-200 font-headline',
            size.className,
            fontSize === size.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={fontSize === size.value}
          aria-label={`Tekstgrootte ${size.value === 'small' ? 'klein' : size.value === 'medium' ? 'normaal' : 'groot'}`}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
};

export default FontSizeToggle;
