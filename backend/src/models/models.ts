export class Subscription {
  constructor(public name: string, public image: string, public cost: number, public billing_date: string) {}
}
export class Group {
  constructor(
    public subscription: Subscription,
    public friends: Friend[],
    public id: string
  ) {}
}
export class Friend {
  constructor(
    public name: string,
    public image: string,
    public email?: string,
    public group_id?: string,
    public isowner?: boolean,
    public accepted?: boolean,
    public accepted_date?: Date,
    public balance?: number
  ) {}
}
