describe("integration test", () => {
  it("should be able to execute", async () => {
    await expect(import("#index.js")).resolves.toBeDefined();
  });
});
