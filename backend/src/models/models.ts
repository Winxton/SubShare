export class Subscription {
  constructor(public name: string, public image: string, public cost: number) {}
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
    public subscription_cost?: number,
    public isowner?: boolean,
    public group_id?: string,
    public accepted?: boolean,
    public accepted_date?: Date,
    public balance?: number
  ) {}
}
