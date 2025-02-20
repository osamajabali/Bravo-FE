import { Injectable } from '@angular/core';
export interface Stats {
  activeSkills: number;
  totalSkills: number;
  masteredSkills: number;
  skills: Skill[];
}
export interface Skill {
  name: string;
  inductive: number;
  activated: number;
}
@Injectable({
  providedIn: 'root',
})
export class StatsService {
  getStats(): Stats {
    return {
      activeSkills: 14,
      totalSkills: 564,
      masteredSkills: 2,
      skills: [
        { name: 'Reading', inductive: 432, activated: 8 },
        { name: 'Grammar', inductive: 432, activated: 8 },
        { name: 'Spelling', inductive: 432, activated: 8 },
        { name: 'Writing', inductive: 432, activated: 8 },
      ],
    };
  }
}
