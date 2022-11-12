import makeServer from "../api/server";
import cy from "cypress";

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

it("shows the movies", () => {
  // cy.visit("/")
  // cy.get("li.selected").should("have.length", 10)
});
