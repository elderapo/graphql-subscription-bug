import { PubSubEngine } from "graphql-subscriptions";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  PubSub,
  Publisher,
  Subscription,
  Root,
  ResolverFilterData
} from "type-graphql";

import { Notification, NotificationPayload } from "./notification.type";

@Resolver()
export class SampleResolver {
  @Query(returns => Date)
  currentDate() {
    return new Date();
  }

  @Subscription({ topics: "NOTIFICATIONS" })
  normalSubscription(@Root()
  {
    id,
    message
  }: NotificationPayload): Notification {
    return { id, message, date: new Date() };
  }
}
