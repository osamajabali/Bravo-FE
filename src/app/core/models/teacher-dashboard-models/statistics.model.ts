import { StatisticsEnum } from "../shared-models/enums";

export class Statistics {
    courseSectionId: number;
    type: StatisticsEnum;
    id: number;
}

export class StatisticsResponse {
    backgroundColor: string;
    borderColor: string;
    iconUrl: string;
    labelName: string;
    value: string;
}  