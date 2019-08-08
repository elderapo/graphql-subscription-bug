import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const resolvers = {
  Query: {
    currentDate: {
      resolve: () => {
        return new Date();
      }
    }
  },
  Subscription: {
    normalSubscription: {
      resolve: (root: any) => {
        return {
          id: root.id,
          message: root.message,
          date: new Date()
        };
      },
      subscribe: () => pubsub.asyncIterator("NOTIFICATION")
    }
  }
};

const typeDefs = `scalar DateTime

type Notification {
  id: ID!
  message: String
  date: DateTime!
}

type Query {
  currentDate: DateTime!
}

type Subscription {
  normalSubscription: Notification!
}`;

async function bootstrap() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true
  });

  let notificationID: number = 0;
  setInterval(() => {
    pubsub.publish("NOTIFICATION", {
      id: notificationID++,
      message: "Some message..."
    });
  }, 500);

  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
