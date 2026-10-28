const assert = require("node:assert/strict");
const { handler } = require("../index");

describe("jwt.test.js", () => {
  let result;

  afterEach(() => {
    if (result) {
      console.log(result, "\n");
    }
  });

  it("JWT 토큰 생성", async () => {
    const encodeJWT = await handler({
      action: "encodeJWT",
      secret: "test-secret",
    });
    result = encodeJWT;

    assert.equal(result.token.split(".").length, 3);
  });

  it("Header 및 Payload 구성 확인", async () => {
    if (result) {
      const token = result.token;

      const decodeJWT = await handler({
        action: "decodeJWT",
        jwt: token,
      });
      result = decodeJWT;
    }
  });

  it.skip("JWT Signature 검증", async () => {});
});
