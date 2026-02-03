import { echo } from "./echo.js";

it("should success response", async () => {
  const response = await echo(
    { apiKey: "fad95131d5a138f160240f19f66ac0f8" },
    { hello: "world" },
  );

  console.log({ response });

  expect(response).toEqual({ foo: "bar", method: "flickr.test.echo" });
});
