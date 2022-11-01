import { createServer, Model, Factory, Registry } from "miragejs"
import faker from "faker"
import { UserI } from "../types"
import Schema from "miragejs/orm/schema"
import { FactoryDefinition, ModelDefinition } from "miragejs/-types"
import { API_URL } from "../index"

const UserModel: ModelDefinition<UserI> = Model.extend({})
const UserFactory: FactoryDefinition<UserI> = Factory.extend({
  firstName() {
    return faker.name.firstName()
  },
  lastName() {
    return faker.name.lastName()
  },
  dateOfBirth() {
    return faker.date.past(30)
  },
  isAdmin() {
    return faker.random.boolean()
  },
  id(n) {
      return String(n)
  },
})

type AppRegistry = Registry<
  {
    user: typeof UserModel
  },
  {
    user: typeof UserFactory
  }
>
type AppSchema = Schema<AppRegistry>

export default function makeServer(urlPrefix:string = API_URL) {
  createServer({
    models: {
      user: UserModel,
    },
    factories: {
      user: UserFactory,
    },
    seeds(server) {
      server.createList("user", 102)
    },

    logging: true,

    routes() {
      // AUTH
      // this.get('/auth', () => {
      //   return true
      // });

      // NOT PREFIXED WITH API
      // this.urlPrefix = urlPrefix
      // this.namespace = "api"

      this.get("/users", (schema: AppSchema, req) => {
        return {
          users: schema.all("user"),
          totalEntries: schema.all("user").length,
        }
      })

      this.get("/users/:page/:limit", (schema: AppSchema, req) => {
        const { page, limit } = req.params
        if (page || limit) {
          const start = Number(page) * Number(limit)
          const stop = Number(page) * Number(limit) + Number(limit)

          return {
            users: schema.all("user").slice(start, stop),
            totalEntries: schema.all("user").length,
          }
        }

        return {
          users: schema.all("user"),
          totalEntries: schema.all("user").length,
        }
      })

      this.get("/user/:id", (schema: AppSchema, req) =>
        schema.where("user", { id: req.params.id })
      )

      // TODO: auth protect this route
      this.post("/user", (schema: AppSchema, req) => {
        console.log(req.requestBody)
        return schema.create("user")
      }
      )
      // TODO: auth protect this route
      this.delete("/user/:id", (schema: AppSchema, req) =>
        schema.where("user", { id: req.params.id }).destroy()
      )
    },
  })
}