import dotenv from "dotenv";
import puppeteer, { Browser } from "puppeteer";
import { runCommand } from "./test-utils";
import { modifyAuthCollection } from "../dist/utilities/modify-auth-collection";
import { CollectionConfig, Field } from "payload";
jest.mock("../dist/utilities/modify-auth-collection", () => ({
  ...jest.requireActual("../dist/utilities/modify-auth-collection"),
  createAuthStrategy: jest.fn(() => "mockStrategy"),
}));
dotenv.config();

jest.setTimeout(1000 * 60 * 5); // 5 minutes
describe("modifyAuthCollection", () => {
  it("should add subFieldName to fields if it is missing", () => {
    const input = {
      slug: "userAuth",
      fields: [],
    };
    const result = modifyAuthCollection({}, input, "sub");
    expect(result.fields).toContainEqual({
      name: "sub",
      access: {
        create: expect.any(Function),
        read: expect.any(Function),
        update: expect.any(Function),
      },
      index: true,
      type: "text",
    });
  });

  it("should not duplicate subFieldName if it already exists in fields", () => {
    const input: CollectionConfig = {
      slug: "userAuth",
      fields: [
        { name: "subField", type: "text", required: false},
        { name: "Name", type: "text", required: false }
      ],
    };
    const result = modifyAuthCollection({}, input, "subField");
    expect(result.fields.filter((field: any) => field?.name === "subField").length).toBe(1);
  });

  it("should add email field if disableLocalStrategy is true and useEmailAsIdentity is true", () => {
    const input = {
      slug: "userAuth",
      auth: { disableLocalStrategy: true },
      fields: [],
    };
    const result = modifyAuthCollection({
      subFieldName: "subField",
      useEmailAsIdentity: true,
      strategyName: "defaultStrategy",
    }, input, "subField");
    expect(result.fields).toContainEqual({
      index: true,
      name: "email",
      required: true,
      type: "email",
      unique: true,
    });
  });

  it("should not duplicate email field if it already exists", () => {
    const input = {
      slug: "userAuth",
      auth: { disableLocalStrategy: true },
      fields: [{name: "email", type: "email", required: true, unique: true}],
    };
    const result = modifyAuthCollection({
      subFieldName: "subField",
      useEmailAsIdentity: true,
      strategyName: "defaultStrategy",
    }, input, "subField");
    expect(result.fields.filter((field) => field.name === "email").length).toBe(1);
  });

  it("should append createAuthStrategy output under auth.strategies", () => {
    const input = {
      slug: "userAuth",
      auth: {
        strategies: [],
      },
    };
    const result = modifyAuthCollection({
      subFieldName: "subField",
      auth: { disableLocalStrategy: true },
      useEmailAsIdentity: false,
      strategyName: "defaultStrategy",
    }, input, "subField");
    expect(result.auth?.strategies).toContainEqual({authenticate: expect.any(Function), name: "defaultStrategy" })
  });

  it("should initialize auth object if auth is not present", () => {
    const input = {
      slug: "userAuth"
    };
    const result = modifyAuthCollection({
      subFieldName: "subField",
      auth: { disableLocalStrategy: true },
      useEmailAsIdentity: false,
      strategyName: "defaultStrategy",
    }, input, "subField");
    expect(result.auth?.strategies).toContainEqual({authenticate: expect.any(Function), name: "defaultStrategy" })

  });
});
