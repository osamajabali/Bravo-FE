import { PaginationFilter } from "../shared-models/pagination.model";

export class StorySummarry{
    courseSectionId: number;
    storyId: number;
    }
    
    export class StoryPages extends PaginationFilter {
        storyId : number;
    }

    export class StoryPageResponse {
        audioUrl: string;
        htmlContent: string;
        order: number;
        storyPageId: number;
    }
    export class StoryPageResponseArray extends PaginationFilter {
        pages : StoryPageResponse [] = [];
    }