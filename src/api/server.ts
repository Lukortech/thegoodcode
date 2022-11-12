import { Factory, Model, Registry, createServer } from "miragejs";
import { FactoryDefinition, ModelDefinition } from "miragejs/-types";

import { getComparator, stableSort } from "../helpers";

import { API_URL } from "../index";
import Schema from "miragejs/orm/schema";
import { Order, UserI } from "../types";
import faker from "faker/locale/en";

const UserModel: ModelDefinition<UserI> = Model.extend({});
const UserFactory: FactoryDefinition<UserI> = Factory.extend({
  firstName() {
    return faker.name.firstName();
  },
  lastName() {
    return faker.name.lastName();
  },
  userName() {
    return faker.internet.userName();
  },
  password() {
    return faker.internet.password(
      faker.random.number({ min: 8, max: 18 }),
      faker.random.boolean()
    );
  },
  dateOfBirth() {
    return faker.date.past(30);
  },
  isAdmin() {
    return faker.random.boolean();
  },
  id(n) {
    return String(n);
  },
});

type AppRegistry = Registry<
  {
    user: typeof UserModel;
  },
  {
    user: typeof UserFactory;
  }
>;
type AppSchema = Schema<AppRegistry>;

export default function makeServer(urlPrefix: string = API_URL) {
  const NUM_OF_USERS = faker.random.number({ min: 25, max: 102 });
  createServer({
    models: {
      user: UserModel,
    },
    factories: {
      user: UserFactory,
    },
    seeds(server) {
      server.createList("user", NUM_OF_USERS);
    },

    logging: true,

    routes() {
      this.namespace = "api";
      // Broken currently (mirage error)
      this.timing = process.env.NODE_ENV === "development" ? 9999999 : 400;
      this.get("/users", (schema: AppSchema, req) => {
        return {
          users: schema.all("user"),
          totalEntries: schema.all("user").length,
        };
      });

      this.get("/users/:page/:limit", (schema: AppSchema, req) => {
        const { page, limit } = req.params;
        if (page || limit) {
          const start = Number(page) * Number(limit);
          const stop = Number(page) * Number(limit) + Number(limit);

          return {
            users: schema.all("user").slice(start, stop),
            totalEntries: schema.all("user").length,
          };
        }

        return {
          users: schema.all("user"),
          totalEntries: schema.all("user").length,
        };
      });

      this.get(
        "/users/:page/:limit/:sortKey/:sortDirection",
        (schema: AppSchema, req) => {
          const { page, limit, sortKey, sortDirection } = req.params;
          let sortedData = schema.all("user").models;

          if (sortKey && sortDirection) {
            sortedData = stableSort(
              sortedData as any,
              getComparator(sortDirection as Order, sortKey)
            ) as any;
          }

          if (page || limit) {
            const start = Number(page) * Number(limit);
            const stop = Number(page) * Number(limit) + Number(limit);

            return {
              users: sortedData.slice(start, stop),
              totalEntries: sortedData.length,
            };
          }

          return {
            users: schema.all("user"),
            totalEntries: schema.all("user").length,
          };
        }
      );

      this.get("/user/:id", (schema: AppSchema, req) => {
        return schema.where("user", { id: req.params.id });
      });

      // TODO: auth protect this route
      this.post("/user", (schema: AppSchema, req) => {
        schema.create("user", JSON.parse(req.requestBody));
        return {
          users: schema.all("user"),
          totalEntries: schema.all("user").length,
        };
      });
      // TODO: auth protect this route
      this.delete("/user/:id", (schema: AppSchema, req) => {
        return schema.where("user", { id: req.params.id }).destroy();
      });

      this.timing = 400;
      this.passthrough();
      // AUTH
      this.get("/auth", () => {
        return true;
      });

      // this.get('/**', this.passthrough);
      // this.post('/**', this.passthrough);
      // this.put('/**', this.passthrough);
      // this.delete('/**', this.passthrough);
    },
  });
}
