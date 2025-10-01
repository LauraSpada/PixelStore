import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/config/datasource";

let token: string;
let createdStoreId: number;

// Inicializa o banco e pega token antes dos testes
beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

// Faz login para obter token
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ name: "admin", password: "123456" });

  if (!res.body.token) {
    throw new Error("Token não foi gerado. Verifique AuthController!");
  }

  token = res.body.token;
});

describe("Store API", () => {

  it("não deve permitir criar store sem token", async () => {
    const res = await request(app)
      .post("/api/v1/store")
      .send({ name: "Loja Sem Token", 
              location: "Cidade X" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token não fornecido");
  });

  it("deve criar uma store com token válido", async () => {
    const res = await request(app)
      .post("/api/v1/store")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Loja Teste", 
              location: "Cidade Teste" });

    expect(res.statusCode).toBe(201);
   // expect(res.body.data.name).toBe("Loja Teste");
   // expect(res.body.data.location).toBe("Cidade Teste");
    expect(res.body.message).toBe("Store created!");

    // guarda o id para usar nos próximos testes
    createdStoreId = res.body.data.id;
  });

  it("deve atualizar a store criada", async () => {
    const res = await request(app)
      .put(`/api/v1/store/${createdStoreId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Loja Atualizada", location: "Cidade Atualizada" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Loja Atualizada");
    expect(res.body.data.location).toBe("Cidade Atualizada");
    expect(res.body.message).toBe("Store updated!");
  });

  it("deve buscar todas as stores sem token", async () => {
    const res = await request(app)
      .get("/api/v1/store");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve deletar a store criada", async () => {
    const res = await request(app)
      .delete(`/api/v1/store/${createdStoreId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
