const crypto = require("node:crypto");

exports.handler = async (event) => {
  class header {
    constructor() {
      //  토큰 타입
      this.typ = "JWT";
      //  해싱 알고리즘
      this.alg = "HS256";
    }
  }

  class payload {
    constructor() {
      //  토큰 발급자 (issuer)
      this.iss = event.issuer ?? "발급자";
      //  토큰 제목 (subject)
      this.sub = event.subject ?? "제목";
      //  토큰 대상자 (audience)
      this.aud = event.audience ?? "대상자";
      //  토큰이 발급된 시간 (issued at)
      this.iat = Math.floor(d / 1000);

      //  TODO: 토큰 사용이 가능한 시작 시간 (Not Before)
      //  this.nbf = 이 시각 이전에는 사용 불가

      //  토큰의 만료시간 (expiration), NumericDate 형식
      this.exp = event.expiration
        ? Math.floor(d / 1000) + Number(event.expiration)
        : Math.floor(d / 1000) + 3600;
      //  고유 식별자
      this.jti = crypto.randomUUID();
      //  custom (userId)
      this.id = event.id ?? "ID";
    }
  }

  const d = Date.now();

  const encodeBase64 = (_str) =>
    Buffer.from(JSON.stringify(_str), "utf8").toString("base64url");

  const decodeBase64 = (_str) =>
    Buffer.from(_str, "base64url").toString("utf8");

  const encodeSignature = (_header, _payload, _secret) =>
    crypto
      .createHmac("sha256", _secret)
      .update(`${_header}.${_payload}`)
      .digest("base64url");

  const parseJWT = (_jwt) => {
    const jwtArr = String(_jwt).split(".");

    if (jwtArr.length !== 3) {
      throw new Error("Invalid JWT structure");
    }

    // TODO: Base64URL 인코딩 형식 검증
    // TODO: Header / Payload - JSON Object 형식 검증

    const header = JSON.parse(decodeBase64(jwtArr[0]));
    const payload = JSON.parse(decodeBase64(jwtArr[1]));
    const signature = jwtArr[2];
    const signingInput = `${jwtArr[0]}.${jwtArr[1]}`;

    return {
      header,
      payload,
      signature,
      signingInput,
    };
  };

  //

  const helpMessage = {
    message: "다음 형식으로 입력값을 전달해주세요.",
    examples: {
      encodeJWT: JSON.stringify({
        action: "encodeJWT",
        issuer: "발급자",
        subject: "사용자 ID",
        audience: "대상자",
        secret: "비밀키",
        expiration: 7200,
      }),
      decodeJWT: JSON.stringify({
        action: "decodeJWT",
        jwt: "생성된 JWT 토큰",
      }),
      verifyJWT: JSON.stringify({
        action: "verifyJWT",
        jwt: "생성된 JWT 토큰",
        secret: "비밀키",
      }),
    },
  };

  if (event?.action === "encodeJWT") {
    const secret = event.secret ?? "secret";
    const h = new header();
    const p = new payload();
    const enH = encodeBase64(h);
    const enP = encodeBase64(p);
    const sgnr = encodeSignature(enH, enP, secret);
    const jwt = [enH, enP, sgnr].join(".");

    return {
      token: jwt,
    };
  }

  if (event?.action === "decodeJWT") {
    if (!event.jwt) return helpMessage;

    return parseJWT(event.jwt);
  }

  if (event?.action === "verifyJWT") {
    const jwt = parseJWT(event.jwt);

    //  TODO: Step1. Signature 검증
    //  TODO: Step2. Header 검증
    //  TODO: Step3. Payload의 Claim 검증
    //  TODO: Step4. JWT 시간 검증
    //  TODO: Step5. 발급 이력·폐기 여부 확인

    return {
      message: "JWT verification is not implemented.",
      result: false,
    };
  }

  return helpMessage;
};
