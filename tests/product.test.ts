import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/config/datasource";

let token: string;
let createdProductId: number;

// Inicializa o banco e pega token antes dos testes
beforeAll(async () => {
     if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

// Faz login para obter o token
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ name: "admin", password: "123456" });

  if (!res.body.token) {
    throw new Error("Token não foi gerado. Verifique AuthController!");
  }

  token = res.body.token;
});

describe("Product API", () => {

  it("não deve permitir criar produto sem token", async () => {
    const res = await request(app)
      .post("/api/v1/product/store/2/category/2")
      .send({
        name: "Produto Sem Token",
        price: 1000,
        stock: 5
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token não fornecido");
  });

  it("deve criar um produto com token válido e capturar ID", async () => {
    const res = await request(app)
      .post("/api/v1/product/store/2/category/2")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Notebook Teste Dinâmico",
        price: 2500,
        stock: 15
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Product created!");

    // Busca o produto criado no GET para capturar o ID real
    const getRes = await request(app)
      .get("/api/v1/product");

    const product = getRes.body.find((p: any) => p.name === "Notebook Teste Dinâmico");
    if (!product) throw new Error("Produto criado não encontrado no GET");

    createdProductId = product.id;
  });

  it("deve atualizar o stock do produto criado", async () => {
    const res = await request(app)
      .put(`/api/v1/product/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ stock: 99 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product updated!");
  });

  it("deve buscar lista de produtos sem precisar de token", async () => {
    const res = await request(app)
      .get("/api/v1/store");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve deletar o produto criado dinamicamente", async () => {
    const res = await request(app)
      .delete(`/api/v1/product/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

});
