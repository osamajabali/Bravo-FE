import { PaginationFilter } from "../shared-models/pagination.model";

export class Unit {
  sortOrder: number;
  unitId: number;
  unitLabelName: string;
  unitName: string;
}

export class UnitPayload extends PaginationFilter {
  courseSectionId: number;
  semesterId: number;

}

export class UnitsPagination extends PaginationFilter {
  units: Unit[]
}

