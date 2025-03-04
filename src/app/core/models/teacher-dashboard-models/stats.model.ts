export interface Stats {
  learningOutcomeStatsId: number;
  name: string;
  value: number;
  percentageValue: number;
}

export interface Skill {
  name: string;
  inactive: number;
  activated: number;
}

export class StatsRequest {
  subjectId: number;
  sectionId: number;
}
export class learningOutcomesStats {
  learningOutcomesStats : Stats[]
}

