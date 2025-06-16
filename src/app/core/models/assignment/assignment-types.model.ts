export class AssignmentTypes {
    assignmentTypeId: number;
    name: string;
    order: number;
    iconUrl: string;
}

export class AssignmentRecipientTypes {
    assignmentRecipientTypeId: number;
    name: string;
    order: number;
    selected: boolean = false;
}