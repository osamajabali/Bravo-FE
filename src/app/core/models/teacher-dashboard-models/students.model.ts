import { PaginationFilter } from "../shared-models/pagination.model";

export class Student {
    studentName: string;
    currentLevelId: number;
    isMastered: boolean;
    isInProgress: boolean;
  }
  
  export class Level {
    levelId: number;
    levelName: string;
    students: Student[];
  }
  
  export class LevelPagination extends PaginationFilter {
    students : Level[];
  }