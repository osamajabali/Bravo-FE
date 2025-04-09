import { PaginationFilter } from "../shared-models/pagination.model";

export class LevelReadingResponse {
    name: string ;
    orderNumber: number ;
    readingSubLevelId: number ;
    studentsCount: number ;
  }
export class LevelReadingResponseArray extends PaginationFilter {
    subLevels : LevelReadingResponse[];
  }
  