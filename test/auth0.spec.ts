import dotenv from "dotenv";
import puppeteer, { Browser } from "puppeteer";
import { runCommand } from "./test-utils";
import { modifyAuthCollection } from "../dist/utilities/modify-auth-collection";
jest.mock("../dist/utilities/modify-auth-collection", () => ({
  ...jest.requireActual("../dist/utilities/modify-auth-collection"),
  createAuthStrategy: jest.fn(() => "mockStrategy"),
}));
dotenv.config();

jest.setTimeout(1000 * 60 * 5); // 5 minutes
describe("modifyAuthCollection", () => {
  it("should add subFieldName to fields if it is missing", () => {
    const input = {
      fields: [],
    };
    const result = modifyAuthCollection(input, {
      subFieldName: "subField",
      auth: {},
    }, {});
    expect(result.fields).toContainEqual({ name: "subField" });
  });

  it("should not duplicate subFieldName if it already exists in fields", () => {
    const input = {
      fields: [{ name: "subField" }],
    };
    const result = modifyAuthCollection(input, {
      subFieldName: "subField",
      auth: {},
    });
    expect(result.fields.filter((field) => field.name === "subField").length).toBe(1);
  });

  it("should add email field if disableLocalStrategy is true and useEmailAsIdentity is true", () => {
    const input = {
      fields: [],
    };
    const result = modifyAuthCollection(input, {
      subFieldName: "subField",
      auth: { disableLocalStrategy: true },
      useEmailAsIdentity: true,
      strategyName: "defaultStrategy",
    }, {});
    expect(result.fields).toContainEqual({ name: "email" });
  });

  it("should not duplicate email field if it already exists", () => {
    const input = {
      fields: [{ name: "email" }],
    };
    const result = modifyAuthCollection(input, {
      subFieldName: "subField",
      auth: { disableLocalStrategy: true },
      useEmailAsIdentity: true,
    });
    expect(result.fields.filter((field) => field.name === "email").length).toBe(1);
  });

  it("should append createAuthStrategy output under auth.strategies", () => {
    const input = {
      auth: {
        strategies: [],
      },
    };
    const result = modifyAuthCollection(input, {
      subFieldName: "subField",
      auth: { disableLocalStrategy: true },
      useEmailAsIdentity: false,
      strategyName: "defaultStrategy",
    }, {});
    expect(result.auth?.strategies).toContain("mockStrategy");
  });

  it("should initialize auth object if auth is not present", () => {
    const input = {};
    const result = modifyAuthCollection(input, {
      subFieldName: "subField",
      auth: { disableLocalStrategy: true },
      useEmailAsIdentity: false,
      strategyName: "defaultStrategy",
    }, {});
    expect(result.auth?.strategies).toContain("mockStrategy");
  });
});
