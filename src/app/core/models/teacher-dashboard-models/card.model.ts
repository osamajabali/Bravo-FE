
export class CardRequest {
  courseSectionId: number;
  learningOutcomeId : number;
  resourceTypeId  : number;
}
export class CardResponse {
  count: number;
  iconUrl: string;
  name: string;
  resourceTypeId: number;
}