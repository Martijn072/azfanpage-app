
import { useState } from 'react';
import { useAZTeamId, useAZFixtures, useNextAZFixture } from '@/hooks/useFootballApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const FootballApiTest = () => {
  const [showTest, setShowTest] = useState(false);
  
  const { data: teamId, isLoading: teamLoading, error: teamError } = useAZTeamId();
  const { data: fixtures, isLoading: fixturesLoading, error: fixturesError } = useAZFixtures(teamId, 5);
  const { data: nextFixture, isLoading: nextLoading, error: nextError } = useNextAZFixture(teamId);

  if (!showTest) {
    return (
      <div className="p-4">
        <Button 
          onClick={() => setShowTest(true)}
          className="bg-az-red hover:bg-red-700 text-white"
        >
          Test API-Football Integratie
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API-Football Test Resultaten</h2>
        <Button 
          onClick={() => setShowTest(false)}
          variant="outline"
        >
          Verberg Test
        </Button>
      </div>

      {/* Team ID Test */}
      <Card>
        <CardHeader>
          <CardTitle>1. AZ Team ID Zoeken</CardTitle>
        </CardHeader>
        <CardContent>
          {teamLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Zoeken naar AZ team...</span>
            </div>
          )}
          {teamError && (
            <div className="text-red-600">
              <strong>Error:</strong> {teamError.message}
            </div>
          )}
          {teamId && (
            <div className="text-green-600">
              <strong>✅ Succes!</strong> AZ Team ID: {teamId}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fixtures Test */}
      <Card>
        <CardHeader>
          <CardTitle>2. Laatste 5 AZ Wedstrijden</CardTitle>
        </CardHeader>
        <CardContent>
          {fixturesLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Laden van wedstrijden...</span>
            </div>
          )}
          {fixturesError && (
            <div className="text-red-600">
              <strong>Error:</strong> {fixturesError.message}
            </div>
          )}
          {fixtures && fixtures.length > 0 && (
            <div className="space-y-2">
              <div className="text-green-600">
                <strong>✅ Succes!</strong> {fixtures.length} wedstrijden gevonden:
              </div>
              {fixtures.slice(0, 3).map((fixture, index) => (
                <div key={fixture.fixture.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">
                    {fixture.teams.home.name} vs {fixture.teams.away.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Score: {fixture.goals.home} - {fixture.goals.away}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(fixture.fixture.date).toLocaleDateString('nl-NL')}
                  </div>
                </div>
              ))}
              <details className="mt-4">
                <summary className="cursor-pointer text-blue-600 hover:underline">
                  Bekijk volledige API response
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                  {JSON.stringify(fixtures[0], null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Fixture Test */}
      <Card>
        <CardHeader>
          <CardTitle>3. Volgende AZ Wedstrijd</CardTitle>
        </CardHeader>
        <CardContent>
          {nextLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Laden van volgende wedstrijd...</span>
            </div>
          )}
          {nextError && (
            <div className="text-red-600">
              <strong>Error:</strong> {nextError.message}
            </div>
          )}
          {nextFixture && (
            <div className="space-y-2">
              <div className="text-green-600">
                <strong>✅ Succes!</strong> Volgende wedstrijd gevonden:
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold">
                  {nextFixture.teams.home.name} vs {nextFixture.teams.away.name}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(nextFixture.fixture.date).toLocaleDateString('nl-NL')} om{' '}
                  {new Date(nextFixture.fixture.date).toLocaleTimeString('nl-NL', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {nextFixture.league.name}
                </div>
              </div>
              <details className="mt-4">
                <summary className="cursor-pointer text-blue-600 hover:underline">
                  Bekijk volledige API response
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                  {JSON.stringify(nextFixture, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Console Logs Info */}
      <Card>
        <CardHeader>
          <CardTitle>4. Console Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Open de Developer Tools (F12) en bekijk het Console tabblad voor gedetailleerde API call logs.
            Alle API requests en responses worden daar gelogd voor debugging.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
