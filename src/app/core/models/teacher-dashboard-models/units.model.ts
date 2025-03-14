import { PaginationFilter } from "../shared-models/pagination.model";

export interface Unit {
  sortOrder: number;
  unitId: number;
  unitLabelName: string;
  unitName: string;
}

export interface UnitsPagination extends PaginationFilter {
  units : Unit[]
}