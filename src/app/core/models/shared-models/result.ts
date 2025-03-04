export class Result<T = any>  {
    result!: T;
    success : boolean ;
    message : string ;
    code : number;
}