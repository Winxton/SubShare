import { Subscription } from "./Subscription";
import { Friend } from "./Friend";

export class Group {
  constructor(
    public subscription: Subscription,
    public friends: Friend[],
    public id: string | null
  ) {}
}
