import { forwardRef } from 'react';
import { Fixture } from '@/types/footballApi';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface GamedayTemplateProps {
  fixture: Fixture | null;
  backgroundImage?: string | null;
}

export const GamedayTemplate = forwardRef<HTMLDivElement, GamedayTemplateProps>(
  ({ fixture, backgroundImage }, ref) => {
    if (!fixture) {
      return (
        <div ref={ref} style={{ width: 1080, height: 1080 }} className="bg-[#0F1117] flex items-center justify-center">
          <p className="text-[#9CA3AF] text-xl">Geen wedstrijddata beschikbaar</p>
        </div>
      );
    }

    return (
      <div ref={ref} style={{ width: 1080, height: 1080 }} className="relative overflow-hidden">
        {backgroundImage ? (
          <img src={backgroundImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="absolute inset-0 bg-[#0F1117]" />
        )}

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)' }}
        />

        {/* Red top bar */}
        <div className="absolute top-0 left-0 right-0 h-[6px] z-10" style={{ background: 'linear-gradient(90deg, #DB0021 0%, #DB0021 60%, transparent 100%)' }} />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-10 px-16">
          {/* MATCHDAY header */}
          <span
            className="text-[#DB0021] font-headline font-black uppercase tracking-[0.3em]"
            style={{ fontSize: 56 }}
          >
            Matchday
          </span>

          {/* Teams & time */}
          <div className="flex items-center justify-center gap-12 w-full">
            <div className="flex flex-col items-center gap-4">
              <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="h-32 w-32 object-contain" />
              <span className="text-white text-2xl font-headline font-semibold text-center">{fixture.teams.home.name}</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-headline font-bold" style={{ fontSize: 72 }}>
                {format(new Date(fixture.fixture.date), 'HH:mm')}
              </span>
              <span className="text-white/80 text-2xl font-body capitalize">
                {format(new Date(fixture.fixture.date), 'EEEE d MMMM', { locale: nl })}
              </span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="h-32 w-32 object-contain" />
              <span className="text-white text-2xl font-headline font-semibold text-center">{fixture.teams.away.name}</span>
            </div>
          </div>

          {/* Venue & league */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/70 text-xl font-body">
              {fixture.fixture.venue?.name}
            </span>
            <span className="text-white/50 text-lg font-body">
              {fixture.league.name} · {fixture.league.round}
            </span>
          </div>
        </div>

        {/* Logo */}
        <div className="absolute top-14 right-10 z-10">
          <img src="/images/az-fanpage-logo.png" alt="AZ Fanpage" className="h-20 w-auto opacity-80" />
        </div>
      </div>
    );
  }
);

GamedayTemplate.displayName = 'GamedayTemplate';
