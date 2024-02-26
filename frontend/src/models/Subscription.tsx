/**
 * This is a subscription that represents a shared account.
 * For example, Netflix.
 */
export class Subscription {
  constructor(
    public name: string,
    public image: string,
    public cost: number,
    public billing_date: Date
  ) {}
}
