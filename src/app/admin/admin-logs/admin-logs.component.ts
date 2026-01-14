import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {take} from 'rxjs/operators';
import {AdminLog} from 'src/app/models/admin-log.model';
import {Bar} from 'src/app/models/bar.model';
import {AdminLogService} from 'src/app/services/admin-services/admin-log.service';
import {Status} from 'src/app/models/site-message.model';
import {Team} from 'src/app/models/team.model';
import {BarService} from 'src/app/services/admin-services/bar.service';
import {EventService} from 'src/app/services/admin-services/event.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {ScoreDataService} from 'src/app/services/admin-services/score-data.service';
import {TeamService} from 'src/app/services/team.service';

@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['../admin-styles-2.css', '../admin-styles.css', './admin-logs.component.css']
})
export class AdminLogsComponent implements OnInit {
  logs?: any[];
  allLogs?: any[];
  bars?: Bar[];
  selectedType: string = '';
  selectedBar: string = '';
  viewMode: 'list' | 'chart' | 'stats' = 'list';
  chartMode: 'visits' | 'average' = 'visits';
  barStats: {barName: string, count: number, average: number}[] = [];
  teams: Team[] = [];
  globalStats = {
    totalPointsGiven: 0,
    teamsParticipated: 0,
    averageScore: 0,
    bonusBarPercentage: 0,
    loppurastiPercentage: 0
  };

  static cache = {
    timestamp: 0,
    logs: [] as any[],
    scores: [] as any[],
    teams: [] as Team[]
  };

  constructor(private adminLogService: AdminLogService, private eventService: EventService, private scoreDataService: ScoreDataService, private barService: BarService, private teamService: TeamService, private messageService: MessagesService) { }

  ngOnInit() {
    this.barService.getBars().subscribe(bars => this.bars = bars);

    this.eventService.getActiveTursasEvent().subscribe(events => {
      if (events.length > 0) {
        const eventId = events[0].id!;

        // Check cache (1 minute validity)
        if (Date.now() - AdminLogsComponent.cache.timestamp < 60000 && AdminLogsComponent.cache.logs.length > 0) {
          this.processData(AdminLogsComponent.cache.logs, AdminLogsComponent.cache.scores, AdminLogsComponent.cache.teams);
        } else {
          const logs$ = this.adminLogService.getAllLogs(eventId).pipe(take(1));
          const scores$ = this.scoreDataService.getAllScoreData(eventId).pipe(take(1));

          combineLatest([logs$, scores$]).subscribe(([logs, scores]) => {
            this.teamService.getTeams(eventId).pipe(take(1)).subscribe(teams => {
              // Update Cache
              AdminLogsComponent.cache.logs = logs;
              AdminLogsComponent.cache.scores = scores;
              AdminLogsComponent.cache.teams = teams;
              AdminLogsComponent.cache.timestamp = Date.now();

              this.messageService.add({message: 'Tiedot päivitetty', status: Status.Success});
              this.processData(logs, scores, teams);
            });
          });
        }
      } else {
        this.logs = [];
        this.allLogs = [];
      }
    });
  }

  processData(logs: any[], scores: any[], teams: Team[]) {
    const mappedLogs = logs.map(l => ({
      ...l,
      type: 'admin'
    }));

    const mappedScores = scores.map(s => {
      let details = `Tiimi: ${s.teamName || '?'} (${s.teamId || '?'}) - Baari: ${s.barName}, Pisteet: ${s.score}`
      if (s.scoreComment) {
        details += `, Kommentti: ${s.scoreComment}`
      }
      return {
        id: s.id,
        timestamp: s.time,
        adminEmail: s.adminEmail,
        action: 'Pisteiden lisäys',
        details: details,
        type: 'score',
        barName: s.barName,
        score: s.score
      }
    });

    this.allLogs = [...mappedLogs, ...mappedScores].sort((a, b) => {
      const timeA = this.getTime(a.timestamp);
      const timeB = this.getTime(b.timestamp);
      return timeB - timeA;
    });
    this.applyFilter();
    this.calculateStats();

    this.teams = teams;
    this.calculateGlobalStats();
  }

  toggleView(mode: 'list' | 'chart' | 'stats') {
    this.viewMode = mode;
  }

  toggleChartMode() {
    this.chartMode = this.chartMode === 'visits' ? 'average' : 'visits';
    this.sortBarStats();
  }

  calculateStats() {
    const stats = new Map<string, {count: number, totalScore: number}>();
    this.allLogs?.forEach(log => {
      if (log.type === 'score' && log.barName) {
        const current = stats.get(log.barName) || {count: 0, totalScore: 0};
        current.count++;
        current.totalScore += (log.score || 0);
        stats.set(log.barName, current);
      }
    });
    this.barStats = Array.from(stats.entries()).map(([barName, data]) => ({
      barName,
      count: data.count,
      average: data.count > 0 ? Math.round(data.totalScore / data.count) : 0
    }));
    this.sortBarStats();
  }

  sortBarStats() {
    if (this.chartMode === 'visits') {
      this.barStats.sort((a, b) => b.count - a.count);
    } else {
      this.barStats.sort((a, b) => b.average - a.average);
    }
  }

  calculateGlobalStats() {
    const scores = this.allLogs?.filter(l => l.type === 'score') || [];
    this.globalStats.totalPointsGiven = scores.length;
    
    let totalScoreSum = 0;
    scores.forEach(s => totalScoreSum += (s.score || 0));
    this.globalStats.averageScore = scores.length > 0 ? Math.round(totalScoreSum / scores.length) : 0;

    const participatingTeams = this.teams.filter(t => {
      const hasName = t.name !== undefined && t.name !== '';
      const hasFuksiStatus = t.fuksiStatus !== undefined;
      const hasPoints = (t.bars && t.bars.some(b => b.score > 0)) || (t.bonusBar && t.bonusBar.score > 0);
      return hasName || hasFuksiStatus || hasPoints;
    });

    this.globalStats.teamsParticipated = participatingTeams.length;

    // Use participatingTeams.length for percentage calculations instead of total teams?
    // Usually percentages should be based on active participants.
    const baseCount = this.globalStats.teamsParticipated;

    const bonusTeams = this.teams.filter(t => t.bonusBar && t.bonusBar.score > 0).length;
    this.globalStats.bonusBarPercentage = baseCount > 0 ? Math.round((bonusTeams / baseCount) * 100) : 0;

    const loppurastiTeams = this.teams.filter(t => t.bars.some(b => b.name.toLowerCase().includes('loppurasti') && b.score > 0)).length;
    this.globalStats.loppurastiPercentage = baseCount > 0 ? Math.round((loppurastiTeams / baseCount) * 100) : 0;
  }

  applyFilter() {
    if (!this.allLogs) return;
    this.logs = this.allLogs.filter(log => {
      const typeMatch = this.selectedType === '' || log.type === this.selectedType;
      
      let barMatch = true;
      if (this.selectedBar) {
        if (log.type === 'score') {
          barMatch = log.barName === this.selectedBar;
        } else {
          barMatch = false; 
        }
      }

      return typeMatch && barMatch;
    });
  }

  getTime(timestamp: any): number {
    if (timestamp && timestamp.seconds) {
      return timestamp.seconds * 1000;
    } else if (timestamp instanceof Date) {
      return timestamp.getTime();
    }
    return 0;
  }

  parseDate(timestamp: any) {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString('fi');
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString('fi');
    }
    return '';
  }
}
