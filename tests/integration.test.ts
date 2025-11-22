/**
 * tests/integration.test.ts
 *
 * Fluxo correto conforme suas rotas:
 *
 * 1) criar store (sem token)
 * 2) criar user via POST /user/store/:storeId (sem token)
 * 3) login -> token
 * 4) criar category via POST /category/store/:storeId (com token)
 * 5) criar product via POST /product/category/:categoryId (com token)
 * 6) listar products (aberto)
 * 7) atualizar product (com token)
 * 8) deletar product (com token)
 * 9) deletar category (com token)
 * 10) deletar user (com token)
 * 11) deletar store (com token)
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
  console.error("=== DEBUG RESPONSE ===", note, {
    status: res?.status,
    body: res?.body,
    text: res?.text,
  });
  throw new Error(`Erro no teste. Veja log acima. ${note}`);
}

describe("Fluxo completo (store → user → auth → category → product)", () => {

  it("1) cria store", async () => {
    const res = await request(app)
      .post("/api/v1/store")
      .send({
        name: "Loja CI",
        location: "Cidade Teste"
      });

    if (res.status !== 201) logAndThrow(res, "erro criar store");

    storeId = res.body.data.id;
    expect(typeof storeId).toBe("number");
  });

  it("2) cria user vinculado à store", async () => {
    const res = await request(app)
      .post(`/api/v1/user/store/${storeId}`)
      .send({
        name: "ci_admin",
        password: "123456"
      });

    if (res.status !== 201) logAndThrow(res, "erro criar user");

    userId = res.body.data.id;
    expect(typeof userId).toBe("number");
  });

  it("3) login e recebe token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        name: "ci_admin",
        password: "123456"
      });

    if (res.status !== 200) logAndThrow(res, "erro login");

    token = res.body.token;
    expect(typeof token).toBe("string");
  });

  it("4) cria category vinculada à store", async () => {
    const res = await request(app)
      .post(`/api/v1/category/store/${storeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Eletronicos",
        description: "Categoria CI"
      });

    if (res.status !== 201) logAndThrow(res, "erro criar category");

    categoryId = res.body.data.id;
    expect(typeof categoryId).toBe("number");
  });

  it("5) cria product vinculado à category", async () => {
    const res = await request(app)
      .post(`/api/v1/product/category/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Produto CI",
        price: 99.9,
        stock: 10
      });

    if (res.status !== 201) logAndThrow(res, "erro criar product");

    productId = res.body.data.id;
    expect(typeof productId).toBe("number");
  });

  it("6) lista products", async () => {
    const res = await request(app).get("/api/v1/product");

    if (res.status !== 200) logAndThrow(res, "erro listar products");

    expect(Array.isArray(res.body)).toBe(true);
  });

  it("7) atualiza product", async () => {
    const res = await request(app)
      .put(`/api/v1/product/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        stock: 50
      });

    if (res.status !== 200) logAndThrow(res, "erro atualizar product");
  });

  it("8) deleta product", async () => {
    const res = await request(app)
      .delete(`/api/v1/product/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    if (![200, 204].includes(res.status)) logAndThrow(res, "erro deletar product");
  });

  it("9) deleta category", async () => {
    const res = await request(app)
      .delete(`/api/v1/category/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    if (![200, 204].includes(res.status)) logAndThrow(res, "erro deletar category");
  });

  it("10) deleta user", async () => {
    const res = await request(app)
      .delete(`/api/v1/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    if (![200, 204].includes(res.status)) logAndThrow(res, "erro deletar user");
  });

  it("11) deleta store", async () => {
    const res = await request(app)
      .delete(`/api/v1/store/${storeId}`)
      .set("Authorization", `Bearer ${token}`);

    if (![200, 204].includes(res.status)) logAndThrow(res, "erro deletar store");
  });

});
