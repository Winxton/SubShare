export class Subscription {
  constructor(public name: string, public image: string, public cost: number) {}
}
export class Group {
  constructor(public subscription: Subscription, public friends: Friend[]) {}
}
export class Friend {
  constructor(public name: string, public image: string) {}
}
