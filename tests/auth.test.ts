import request from "supertest";
import app from "../src/app";

describe("Auth API", () => {
  it("deve retornar um token válido ao logar com credenciais corretas", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ name: "admin", password: "123456" }); // use credenciais válidas

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("deve falhar com credenciais inválidas", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ name: "usererrado", password: "senhaerrada" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Usuário ou senha inválidos");
  });
});
