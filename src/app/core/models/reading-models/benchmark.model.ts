export class Benchmark{
    highLevel : BenchmarkLevel;
    lowLevel : BenchmarkLevel;
}

export class BenchmarkLevel{
    label: BenchmarkLabel;
    students :BenchmarkStudents[];
}

export class BenchmarkLabel{
    iconUrl : string;
    labelName : string;
}

export class BenchmarkStudents{
    fullName : string;
    levelName : string;
    studentId : number;
selected: any;
}