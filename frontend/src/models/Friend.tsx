export class Friend {
  constructor(
    public name: string | null,
    public image: string | null,
    public email: string,
    //public accepted: boolean | null,
    public subscription_cost: number,
    public isowner: boolean,
    public group_id?: string,
    //public accepted_date?: Date,
    public balance?: number
  ) {}
}
