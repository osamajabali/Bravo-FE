import { PaginationFilter } from "../shared-models/pagination.model";

export class SublevelReading {
    authorName: string;
    coverUrl: string;
    pagesCount: string;
    publisherName: string;
    storyId: number = 319;
    title: string;
}

export class SublevelReadingResponse extends PaginationFilter {
    stories : SublevelReading[];
}