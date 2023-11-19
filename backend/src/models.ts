export class Subscription {
  constructor(public name: string, public image: string, public cost: number) {}
}
export class Group {
  public groupId: string | null; // Add this line

  constructor(public subscription: Subscription, public friends: Friend[]) {
    this.groupId = null; // Initialize groupId
  }
}
export class Friend {
  constructor(public name: string, public image: string) {}
}
