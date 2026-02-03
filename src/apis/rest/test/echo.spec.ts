import { echo } from "./echo.js";

it("should success response", async () => {
  const response = await echo(
    { apiKey: "fad95131d5a138f160240f19f66ac0f8" },
    { hello: "world" },
  );

  expect(response).toEqual({
    api_key: "fad95131d5a138f160240f19f66ac0f8",
    hello: "world",
    method: "flickr.test.echo",
    stat: "ok",
  });
});
