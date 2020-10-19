import axios from "axios";
import regeneratorRuntime from "regenerator-runtime";
import { sequelize } from "../sequelize";

describe("user resolvers", () => {
  afterAll(async (done) => {
    sequelize.sync({force: true, logging: false}).then(() => {
      sequelize.close();
    });
  });

  test("allUsers", async () => {
    const response = await axios.post("http://localhost:8080/graphql", {
      query: `
            query {
                allUsers {
                  id
                  username
                }
              }
            `,
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        allUsers: [],
      },
    });
  });

  test("create user", async () => {
    const response = await axios.post("http://localhost:8080/graphql", {
      query: `
      mutation {
        register(username: "testuser2",email: "test2@test.com", password: "testpassword") {
          ok,
          errors {
            path
            message
          }
          user {
            username,
            email
          }
        }
      }`,
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          errors: null,
          user: {
            username: "testuser2",
            email: "test2@test.com",
          },
        },
      },
    });
  });
});
