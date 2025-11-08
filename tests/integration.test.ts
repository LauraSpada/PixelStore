/**
 * tests/integration.test.ts
 *
 * Teste de integração único, executa fluxo:
 * 1) criar store (sem token)
 * 2) criar user vinculado à store (sem token)
 * 3) login -> obter token
 * 4) criar category (com token)
 * 5) criar product (com token) enviando storeId e categoryId no body
 * 6) operações de leitura/atualização/deleção
 *
 * Observações:
 * - Ajuste os valores (nome/senha) se já existirem no DB.
 * - Testa respostas e imprime corpo em caso de falha para debug.
 */

import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/config/datasource";

jest.setTimeout(30000);

let token: string;
let storeId: number;
let userId: number;
let categoryId: number;
let productId: number;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

function logAndThrow(res: any, note = "") {
  // imprime objeto útil para debugging e lança erro para falhar o teste
  // res pode ser Response do supertest
  // eslint-disable-next-line no-console
  console.error("=== DEBUG RESPONSE ===", note, {
    status: res && res.status,
    body: res && res.body,
    text: res && res.text,
  });
  throw new Error(`Erro durante o fluxo de teste. Veja o log acima. ${note}`);
}

describe("Fluxo integrado (store -> user -> auth -> category -> product)", () => {
  it("1) cria uma store (sem token)", async () => {
    const res = await request(app)
      .post("/api/v1/store")
      .send({ name: "Loja Teste CI", location: "Cidade Teste" });

    if (res.status !== 201) logAndThrow(res, "falha ao criar store");
    expect(res.body).toHaveProperty("data");
    storeId = res.body.data.id;
    expect(typeof storeId).toBe("number");
  });

  it("2) cria um user vinculado à store (sem token)", async () => {
    const res = await request(app)
      .post("/api/v1/user")
      .send({ name: "ci_admin", password: "123456", storeId });

    if (res.status !== 201) logAndThrow(res, "falha ao criar user");
    expect(res.body).toHaveProperty("data");
    userId = res.body.data.id;
  });

  it("3) faz login e obtém token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ name: "ci_admin", password: "123456" });

    if (res.status !== 200) logAndThrow(res, "falha no login");
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
    expect(typeof token).toBe("string");
  });

  it("4) cria uma category (com token)", async () => {
    const res = await request(app)
      .post("/api/v1/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "CI Eletronicos", description: "desc" });

    if (res.status !== 201) logAndThrow(res, "falha ao criar category");
    categoryId = res.body.data.id;
    expect(typeof categoryId).toBe("number");
  });

  it("5) cria um product vinculado a store e category (com token)", async () => {
    const res = await request(app)
      .post("/api/v1/product")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Produto CI",
        price: 999,
        stock: 5,
        storeId,
        categoryId
      });

    if (res.status !== 201) logAndThrow(res, "falha ao criar product");
    productId = res.body.data.id;
    expect(typeof productId).toBe("number");
  });

  it("6) lista products (aberto)", async () => {
    const res = await request(app).get("/api/v1/product");
    if (res.status !== 200) logAndThrow(res, "falha ao listar products");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("7) atualiza product (com token)", async () => {
    const res = await request(app)
      .put(`/api/v1/product/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ stock: 42 });

    if (res.status !== 200) logAndThrow(res, "falha ao atualizar product");
    // pode retornar data ou texto — tente checar ambos
    if (res.body && res.body.data) expect(res.body.data.stock).toBe(42);
  });

  it("8) deleta product (com token)", async () => {
    const res = await request(app)
      .delete(`/api/v1/product/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    if (![200, 204].includes(res.status)) logAndThrow(res, "falha ao deletar product");
  });

  it("9) deleta category (com token)", async () => {
    const res = await request(app)
      .delete(`/api/v1/category/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    if (![200, 204].includes(res.status)) logAndThrow(res, "falha ao deletar category");
  });

  it("10) deleta user (com token)", async () => {
    const res = await request(app)
      .delete(`/api/v1/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    if (![200, 204].includes(res.status)) logAndThrow(res, "falha ao deletar user");
  });

  it("11) deleta store (com token)", async () => {
    const res = await request(app)
      .delete(`/api/v1/store/${storeId}`)
      .set("Authorization", `Bearer ${token}`);

    if (![200, 204].includes(res.status)) logAndThrow(res, "falha ao deletar store");
  });
});
