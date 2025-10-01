import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/config/datasource";

let token: string;
let createdCategoryId: number;

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

describe("Category API", () => {
  
  it("não deve permitir criar category sem token", async () => {
    const res = await request(app)
      .post("/api/v1/category")
      .send({ name: "Teste Sem Token", 
              description: "Descrição da categoria" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token não fornecido");
  });

  it("deve criar uma category com token válido", async () => {
    const res = await request(app)
      .post("/api/v1/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Categoria Teste",
              description: "Descrição da categoria" });

    expect(res.statusCode).toBe(201);
   //expect(res.body.data.name).toBe("Categoria Teste");
   // expect(res.body.data.description).toBe("Descrição Teste");
    expect(res.body.message).toBe("Category created!");

    // guarda o id para usar nos próximos testes
    createdCategoryId = res.body.data.id;
  });

  /*
  it("deve atualizar a category criada", async () => {
    const res = await request(app)
      .put(`/api/v1/category/${createdCategoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Categoria Atualizada" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Categoria Atualizada");
  });
  */

  it("deve buscar todas as categories sem token", async () => {
    const res = await request(app)
        .get("/api/v1/category");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve deletar a category criada", async () => {
    const res = await request(app)
        .delete(`/api/v1/category/${createdCategoryId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);

  });
});
