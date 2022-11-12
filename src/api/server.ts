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
  const NUM_OF_USERS = faker.random.number({ min: 25, max: 76 });
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

      // GET USERS
      this.get("/users", (schema: AppSchema, req) => {
        const data = schema.all("user").models;
        return {
          users: data,
          totalEntries: data.length,
        };
      });

      this.get("/users/:page/:limit", (schema: AppSchema, req) => {
        const { page, limit } = req.params;
        const start = Number(page) * Number(limit);
        const stop = Number(page) * Number(limit) + Number(limit);

        const data = schema.all("user").models;

        return {
          users: start || stop ? data.slice(start, stop) : data,
          totalEntries: schema.all("user").length,
        };
      });

      this.get(
        "/users/:page/:limit/:sortKey/:sortDirection",
        (schema: AppSchema, req) => {
          const { page, limit, sortKey, sortDirection } = req.params;

          let data = schema.all("user").models;

          if (sortKey && sortDirection) {
            data = stableSort(
              data as any,
              getComparator(sortDirection as Order, sortKey)
            ) as any;
          }

          const start = Number(page) * Number(limit);
          const stop = Number(page) * Number(limit) + Number(limit);

          return {
            users: page || limit ? data.slice(start, stop) : data,
            totalEntries: data.length,
          };
        }
      );

      // GET SPECIFIC USER
      this.get("/user/:id", (schema: AppSchema, req) => {
        return schema.where("user", { id: req.params.id }).models;
      });

      // POST USER
      // TODO: auth protect this route
      this.post("/user/:page/:limit", (schema: AppSchema, req) => {
        schema.create("user", JSON.parse(req.requestBody));

        const data = schema.all("user").models;

        const { page, limit } = req.params;

        const start = Number(page) * Number(limit);
        const stop = Number(page) * Number(limit) + Number(limit);

        return {
          users: page || limit ? data.slice(start, stop) : data,
          totalEntries: data.length,
        };
      });

      this.post(
        "/user/:page/:limit/:sortKey/:sortDirection",
        (schema: AppSchema, req) => {
          const { page, limit, sortKey, sortDirection } = req.params;

          schema.create("user", JSON.parse(req.requestBody));

          let data = schema.all("user").models;

          if (sortKey && sortDirection) {
            data = stableSort(
              data as any,
              getComparator(sortDirection as Order, sortKey)
            ) as any;
          }

          const start = Number(page) * Number(limit);
          const stop = Number(page) * Number(limit) + Number(limit);

          return {
            users: page || limit ? data.slice(start, stop) : data,
            totalEntries: data.length,
          };
        }
      );

      // TODO: auth protect this route
      // DELETE USER
      this.delete("/user/:id", (schema: AppSchema, req) => {
        schema.where("user", { id: req.params.id }).destroy();

        const data = schema.all("user").models;

        return {
          users: data,
          totalEntries: data.length,
        };
      });

      this.delete("/user/:id/:page/:limit", (schema: AppSchema, req) => {
        schema.where("user", { id: req.params.id }).destroy();
        const data = schema.all("user").models;
        const { page, limit } = req.params;

        const start = Number(page) * Number(limit);
        const stop = Number(page) * Number(limit) + Number(limit);

        return {
          users: page || limit ? data.slice(start, stop) : data,
          totalEntries: data.length,
        };
      });

      this.delete(
        "/user/:id/:page/:limit/:sortKey/:sortDirection",
        (schema: AppSchema, req) => {
          const { page, limit, sortKey, sortDirection } = req.params;

          let data = schema.all("user").models;

          if (sortKey && sortDirection) {
            data = stableSort(
              data as any,
              getComparator(sortDirection as Order, sortKey)
            ) as any;
          }

          const start = Number(page) * Number(limit);
          const stop = Number(page) * Number(limit) + Number(limit);

          return {
            users: page || limit ? data.slice(start, stop) : data,
            totalEntries: data.length,
          };
        }
      );

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
