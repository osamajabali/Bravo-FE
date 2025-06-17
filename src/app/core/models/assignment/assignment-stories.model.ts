import { PaginationFilter } from "../shared-models/pagination.model";

export class AssignmentStories extends PaginationFilter {
  readingSubLevelId: number; 
}

export class Story {
    authorName: string;
    coverImageUrl: string;
    pagesCount: number;
    publisherName: string;
    storyId: number;
    title: string;
    wordsCount: number;
}

export class StoryPaginationResponse extends PaginationFilter {
    stories : Story[];
}