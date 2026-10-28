# JWT Token Practice

> **이전 실습 코드 정리**
>
> 과거 JWT의 구조와 토큰 생성 과정을 확인하기 위해 직접 작성했던 JavaScript 코드를 GitHub에 정리한 Repository다.
>
> 현재 새롭게 학습하여 개발한 프로젝트가 아니며, 실제 인증·인가 시스템 구현을 목적으로 하지 않는다.

README 작성 기준: [Repository README Convention](https://github.com/Sangseon/00-conventions/blob/master/docs/repository-readme.md)

## Overview

JavaScript와 Node.js의 기본 모듈을 이용하여 JWT(JSON Web Token)의 생성 및 디코딩 과정을 직접 구현한 실습 프로젝트.

JWT의 Header, Payload, Signature 구조를 이해하고, Base64URL 인코딩과 HMAC-SHA256을 이용한 토큰 생성 과정을 확인한다.

### Topics

- authentication
- authorization
- jwt
- hmac-sha256

## Focus

- JWT의 Header, Payload, Signature 구조 이해
- Base64URL 인코딩 및 디코딩
- HMAC-SHA256 기반 Signature 생성
- JWT 표준 Claim의 역할과 구성
- JWT 검증 과정 및 고려사항 정리

## Tech Stack

- JavaScript (CommonJS)
- Node.js
  - `node:crypto`
  - `Buffer`
- Mocha
- Node.js Assert (`node:assert/strict`)

## Scope

| 기능        | 설명                                   | 상태   |
| ----------- | -------------------------------------- | ------ |
| `encodeJWT` | JWT 생성 및 HMAC-SHA256 서명           | 구현   |
| `decodeJWT` | JWT 구조 분리 및 Header/Payload 디코딩 | 구현   |
| `verifyJWT` | Signature, Claim, 시간 등 유효성 검증  | 미구현 |

`decodeJWT`는 JWT의 내용을 디코딩하는 기능으로, Signature의 유효성을 검증하지 않는다.

`verifyJWT`는 향후 검증 로직을 작성할 수 있도록 기본 구조와 TODO만 정의한 상태다.

## Implementation

### JWT 생성 (encodeJWT)

- Header에 `typ`, `alg` 설정
- Payload에 `iss`, `sub`, `aud`, `iat`, `exp`, `jti` 및 사용자 정의 `id` 구성
- Header와 Payload를 JSON 직렬화 후 Base64URL 인코딩
- HMAC-SHA256과 Secret을 이용하여 Signature 생성
- `Header.Payload.Signature` 형식의 JWT 반환

별도 만료 시간이 지정되지 않은 경우 기본 유효 시간은 1시간이며, `expiration` 입력값은 초 단위로 처리한다.

### JWT 분석 (decodeJWT)

- JWT를 `.` 기준으로 분리
- Header와 Payload를 Base64URL 디코딩 후 JSON 파싱
- Header, Payload, Signature 및 서명 대상 문자열(`signingInput`) 반환

기본적인 JWT 구간 수와 JSON 파싱을 확인하며, 엄격한 Base64URL 형식 및 JSON Object 형식 검증은 TODO로 남겨 두었다.

### JWT 검증 (verifyJWT)

향후 구현을 고려하여 다음 검증 항목을 정리했다.

1. Signature 검증
2. Header 검증
3. Payload Claim 검증
4. JWT 시간 검증
5. 발급 이력 및 폐기 여부 확인

현재는 검증을 수행하지 않으며, 미구현 메시지와 `result: false`를 반환한다.

## What I Learned

- 이 실습에서는 Header와 Payload를 Base64URL로 인코딩하고 HMAC-SHA256으로 서명하는 JWT를 구현했다.
- Signature 검증은 신뢰하는 서명 키를 이용하여 토큰의 무결성과 서명의 유효성을 확인하는 과정이다.
- Claim 검증은 토큰의 발급자, 대상자 및 사용 조건을 확인하는 과정이다.
- 발급 이력과 폐기 이력을 관리하는 경우 `jti` 기반 유효성 검증이 추가될 수 있다.

## AI Usage

Mode: manual

실습 코드는 AI를 사용하지 않고 직접 구현했다.

이후 기존 코드를 GitHub에 정리하는 과정에서 AI를 기술 개념 확인, 코드 리뷰 및 문서 작성의 참고 도구로 활용했다.

## How to Run

### 의존성 설치

```bash
npm install
```

### 테스트 실행

전체 테스트:

```bash
npm test
```

특정 테스트 파일 실행:

```bash
npm test -- test/jwt.test.js
```

현재 Mocha 테스트는 JWT 생성 결과 및 디코딩 결과를 출력하여 확인하는 형태다.

`verifyJWT` 테스트는 기능 미구현 상태에 따라 `it.skip()`으로 제외했다.

## References

- [RFC 7519 - JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519)
- [RFC 7518 - JSON Web Algorithms (JWA)](https://www.rfc-editor.org/rfc/rfc7518)
- [RFC 4648 - Base Encodings](https://www.rfc-editor.org/rfc/rfc4648)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [Mocha Documentation](https://mochajs.org/)
