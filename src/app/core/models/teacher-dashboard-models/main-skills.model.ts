export class Skills{
    activeSkills: number;
    domainId: number;
    inActiveSkills: number;
    name: string;
    quickSkills : QuickSkills[]
}

export class QuickSkills{
    name : string;
    skillId : number;
    isEnabled : boolean;
}

export class SkillsDomain{
    domains : Skills[];
}