import { Injectable } from '@angular/core';
import { Stats } from '../models/stats.model';


@Injectable({
  providedIn: 'root',
})
export class StatsService {
  getStats(): Stats {
    return {
      activeSkills: {title:'Active Skills', completed: 14, unCompleted: 50 },
      totalSkills: {title:'Total Skills', completed: 564, unCompleted: 1000 },
      masteredSkills: {title:'Mastered Skills', completed: 2, unCompleted: 10 },
      skills: [
        { name: 'Reading', inactive: 30, activated: 70 },
        { name: 'Grammar', inactive: 30, activated: 70 },
        { name: 'Spelling', inactive: 30, activated: 70 },
        { name: 'Writing', inactive: 30, activated: 70 },
      ],
    };
  }
}
