export class Skills{
    activated: number;
    domainId: number;
    inActive: number;
    name: string;
    quickSkills : QuickSkills[]
}

export class QuickSkills{
    name : string;
    skillId : number;
}

export class SkillsDomain{
    domains : Skills[];
}