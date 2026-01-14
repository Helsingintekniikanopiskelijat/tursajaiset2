import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EventService } from './event.service';
import { TeamService } from 'src/app/services/team.service';
import { MessagesService } from './messages.service';
import { BarService } from './bar.service';
import { RegionService } from './region.service';
import { ScoreDataService } from './score-data.service';
import { AdminLogService } from './admin-log.service';
import { Status } from 'src/app/models/site-message.model';
import { TursasEvent } from 'src/app/models/tursas-event.model';
import { Bar } from 'src/app/models/bar.model';
import { Region } from 'src/app/models/region.model';
import { Team } from 'src/app/models/team.model';
import { ScoreData } from 'src/app/models/score-data.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  public log$ = new Subject<string>();

  constructor(
    private eventService: EventService,
    private teamService: TeamService,
    private messageService: MessagesService,
    private barService: BarService,
    private regionService: RegionService,
    private scoreDataService: ScoreDataService,
    private adminLogService: AdminLogService
  ) { }

  private log(message: string) {
    this.log$.next(message);
  }

  async runAllTests() {
    this.log('Järjestelmätestit käynnistetään... 🧪');
    
    // Test data holders for cleanup
    let eventId: string | undefined;
    let regionId: string | undefined;
    let barId: string | undefined;
    let bonusBarId: string | undefined;
    let teamIds: string[] = [];
    let success = false;

    // To store original scores for verification
    const originalTeamScores: { [teamId: string]: { bars: { [barId: string]: number }, bonusBar?: number } } = {};

    try {
      // 1. Create a new event
      const testEventName = 'SYSTEM_TEST_EVENT_' + new Date().getTime();
      const testEvent: TursasEvent = {
        name: testEventName,
        date: new Date(),
        active: true 
      };
      await this.eventService.addTursasEvent(testEvent);
      await this.wait(2000);
      
      const eventSnapshot = await this.eventService.db.collection('events', ref => ref.where('name', '==', testEventName)).get().toPromise();
      if (eventSnapshot.empty) throw new Error('Tapahtumaa ei löytynyt!');
      eventId = eventSnapshot.docs[0].id;
      this.log('Vaihe 1: Tapahtuma luotu');

      // 2. Add two new bars (regular and bonus)
      const testBar: Bar = {
        name: 'TEST_BAR_' + new Date().getTime(),
        score: 0,
        adminEmail: 'test@example.com',
        googleLink: 'http://google.com',
        hint: { finn: 'Viite', eng: 'Hint' },
        revealed: false,
        finnish: true
      };
      await this.barService.addBar(testBar);
      
      const testBonusBar: Bar = {
        name: 'TEST_BONUS_BAR_' + new Date().getTime(),
        score: 0,
        adminEmail: 'test@example.com',
        googleLink: 'http://google.com',
        hint: { finn: 'Bonus Viite', eng: 'Bonus Hint' },
        revealed: false,
        finnish: true
      };
      await this.barService.addBar(testBonusBar);

      await this.wait(2000);

      const barSnapshot = await this.barService.db.collection('bars', ref => ref.where('name', '==', testBar.name)).get().toPromise();
      if (barSnapshot.empty) throw new Error('Testibaaria ei löytynyt!');
      barId = barSnapshot.docs[0].id;
      testBar.id = barId;

      const bonusBarSnapshot = await this.barService.db.collection('bars', ref => ref.where('name', '==', testBonusBar.name)).get().toPromise();
      if (bonusBarSnapshot.empty) throw new Error('Testibonusbaaria ei löytynyt!');
      bonusBarId = bonusBarSnapshot.docs[0].id;
      testBonusBar.id = bonusBarId;

      this.log('Vaihe 2: Baarit luotu');

      // 3. Create new region and add the regular bar to that region
      const testRegion: Region = {
        regionCode: 'TEST_REGION',
        bars: [testBar] 
      };
      await this.regionService.addRegion(testRegion);
      await this.wait(2000);

      const regionSnapshot = await this.regionService.db.collection('regions', ref => ref.where('regionCode', '==', testRegion.regionCode)).get().toPromise();
      if (regionSnapshot.empty) throw new Error('Testialuetta ei löytynyt!');
      regionId = regionSnapshot.docs[0].id;
      testRegion.id = regionId;
      this.log('Vaihe 3: Alue luotu ja baari lisätty');

      // 4. Create 10 teams to event using ALL regions (including existing ones)
      this.log('Vaihe 4: Luodaan 10 tiimiä käyttäen kaikkia alueita...');
      
      const allRegions = await this.regionService.getRegions().pipe(take(1)).toPromise();
      if (!allRegions || allRegions.length === 0) throw new Error('Alueita ei löytynyt!');

      for (let i = 0; i < 10; i++) {
        const regionIndex = i % allRegions.length;
        const region = allRegions[regionIndex];

        const team: Team = {
          loginId: 9000 + i,
          totalScore: 0,
          bars: region.bars, 
          numberOfBarsInRegion: region.bars.length,
          regionName: region.regionCode,
          name: `Testi Tiimi ${i} (${region.regionCode})`
        };
        await this.teamService.addTeam(eventId, team);
      }
      await this.wait(2000);

      const teams = await this.teamService.getTeams(eventId).pipe(take(1)).toPromise();
      if (teams.length !== 10) throw new Error(`Odotettiin 10 tiimiä, löytyi ${teams.length}`);
      teams.forEach(t => { if (t.id) teamIds.push(t.id); });
      this.log('Vaihe 4: Tiimit luotu');

      // 5. Use barservice to find the bars and make sure that the bar info in team data is the same
      const testRegionTeam = teams.find(t => t.regionName === testRegion.regionCode);
      if (!testRegionTeam) throw new Error('Tiimiä ei löytynyt testialueelta!');
      
      const teamTestBar = testRegionTeam.bars.find(b => b.id === barId);
      if (!teamTestBar) throw new Error('Testibaaria ei löytynyt testialueen tiimistä!');
      if (teamTestBar.name !== testBar.name) throw new Error('Tiimin baarin nimi ei vastaa testibaarin nimeä!');
      
      this.log('Vaihe 5: Baaritiedot tarkistettu tiimitiedoista');

      // 6. Give score between 50-120 to ALL bars for each team and add score data
      this.log('Vaihe 6: Lisätään pisteitä ja bonusbaareja...');
      
      for (const team of teams) {
        if (team.id) {
            originalTeamScores[team.id] = { bars: {} };
        }

        // 6a. Score all regular bars
        if (team.bars && team.bars.length > 0) {
          for (const bar of team.bars) {
             const score = Math.floor(Math.random() * (120 - 50 + 1) + 50);
             bar.score = score;
             bar.scoreComment = 'Testipisteet';
             if (bar.id && team.id) {
                originalTeamScores[team.id].bars[bar.id] = score; // Store original score
             }
             
             const scoreData: ScoreData = {
                adminEmail: 'test@example.com',
                barName: bar.name,
                score: score,
                scoreComment: 'Testipisteet',
                time: new Date(),
                teamId: team.id,
                teamName: team.name || ''
              };
              await this.scoreDataService.addScoreData(scoreData, eventId);
          }
        }

        // 6b. Add Bonus Bar (50% chance)
        if (Math.random() > 0.5) {
            const bonusScore = Math.floor(Math.random() * (100 - 50 + 1) + 50); // Bonus bar max 100
            const bonusBarInstance = { ...testBonusBar, score: bonusScore, scoreComment: 'Bonus Testipisteet' };
            team.bonusBar = bonusBarInstance;
            if (team.id) {
                originalTeamScores[team.id].bonusBar = bonusScore; // Store original bonus score
            }

             const scoreData: ScoreData = {
                adminEmail: 'test@example.com',
                barName: bonusBarInstance.name,
                score: bonusScore,
                scoreComment: 'Bonus Testipisteet',
                time: new Date(),
                teamId: team.id,
                teamName: team.name || ''
              };
              await this.scoreDataService.addScoreData(scoreData, eventId);
        }

        await this.teamService.updateTeam(eventId, team);
      }
      this.log('Vaihe 6: Pisteet ja bonusbaarit lisätty');

      // 7. Update bar info (change name)
      const newBarName = testBar.name + '_PÄIVITETTY';
      testBar.name = newBarName;
      await this.barService.updateBar(testBar);
      
      await this.barService.updateAllBarsInfo([testBar]);
      
      await this.wait(3000); 
      this.log('Vaihe 7: Baaritiedot päivitetty ja synkronointi käynnistetty');

      // 8. Check that the change was made to teams bar array AND scores did not reset
      const updatedTeams = await this.teamService.getTeams(eventId).pipe(take(1)).toPromise();
      
      let verifiedCount = 0;
      let bonusBarVerificationCount = 0;

      for (const team of updatedTeams) {
        // Verify regular bars
        if (!team.id) throw new Error('Tiimin ID puuttuu vahvistuksessa');
        const teamOriginalData = originalTeamScores[team.id];
        if (!teamOriginalData) throw new Error(`Alkuperäisiä pisteitä ei löytynyt tiimille ${team.id}`);

        for (const bar of team.bars) {
          if (!bar.id) throw new Error('Baarin ID puuttuu vahvistuksessa');
          const originalScore = teamOriginalData.bars[bar.id];
          if (originalScore === undefined) {
             throw new Error(`Alkuperäistä pistettä ei löytynyt baarille ${bar.name} tiimissä ${team.id}`);
          }
          
          if (bar.id === barId) {
            // This is our test bar, verify name change and score persistence
            if (bar.name !== newBarName) {
              throw new Error(`Baarin nimi ei päivittynyt tiimille ${team.id}. Odotettiin ${newBarName}, saatiin ${bar.name}`);
            }
            if (bar.score !== originalScore) {
              throw new Error(`Pisteet nollautuivat tai virheelliset tiimille ${team.id} baarissa ${bar.name}. Odotettiin ${originalScore}, saatiin ${bar.score}`);
            }
            verifiedCount++;
          } else {
            // Other regular bars, only verify score persistence
            if (bar.score !== originalScore) {
              throw new Error(`Pisteet nollautuivat tai virheelliset tiimille ${team.id} baarissa ${bar.name}. Odotettiin ${originalScore}, saatiin ${bar.score}`);
            }
          }
        }

        // Verify bonus bar if present
        if (team.bonusBar && teamOriginalData.bonusBar !== undefined) {
            if (team.bonusBar.score !== teamOriginalData.bonusBar) {
                throw new Error(`Bonusbaarin pisteet nollautuivat tai virheelliset tiimille ${team.id}. Odotettiin ${teamOriginalData.bonusBar}, saatiin ${team.bonusBar.score}`);
            }
            bonusBarVerificationCount++;
        } else if (!team.bonusBar && teamOriginalData.bonusBar !== undefined) {
            // Bonus bar was there, but now it's gone
            throw new Error(`Bonusbaari katosi tiimiltä ${team.id}`);
        }
      }
      
      if (verifiedCount === 0) throw new Error('Yhtään tiimiä ei löytynyt testibaarilla päivitysten vahvistamiseen');
      this.log(`Bonusbaareja tarkistettu: ${bonusBarVerificationCount}/10`);
      
      this.log('Vaihe 8: Vahvistettu baaritietojen päivitys ja pisteiden säilyminen');

      success = true;

    } catch (error) {
      console.error(error);
      this.log('Järjestelmätestit epäonnistuivat ❌: ' + error);
    } finally {
      this.log('Siivotaan...');
      if (barId) await this.barService.deleteBar(barId);
      if (bonusBarId) await this.barService.deleteBar(bonusBarId);
      if (regionId) await this.regionService.deleteRegion(regionId);
      
      if (eventId) {
        // Delete teams
        for (const tid of teamIds) {
          await this.teamService.deleteTeam(eventId, tid);
        }

        // Delete ScoreData
        const scores = await this.scoreDataService.getAllScoreData(eventId).pipe(take(1)).toPromise();
        if (scores) {
          for (const score of scores) {
            if (score.id) await this.scoreDataService.deleteScoreData(score.id, eventId);
          }
        }

        // Delete Logs
        const logs = await this.adminLogService.getAllLogs(eventId).pipe(take(1)).toPromise();
        if (logs) {
          for (const log of logs) {
            if (log.id) await this.adminLogService.deleteLog(log.id, eventId);
          }
        }

        await this.eventService.deleteTursasEvent(eventId);
      }
      this.log('Siivous valmis');
      
      if (success) {
        this.log('Kaikki järjestelmätestit läpäisty! ✅');
      }
    }
  }

  private wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
