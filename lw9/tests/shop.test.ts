import { strict as assert } from 'assert';
import lodash from 'lodash';
import { ProductsController } from "../api/controllers/products.controller";

import RefParser from "@apidevtools/json-schema-ref-parser";
import { CONFIG } from "../config/env";
import { validate } from "../api/validator";

import productData from "./test_cases/product.json";

describe('Магазин', function () {
  this.timeout(10000);

  let productsController: ProductsController;
  let productListSchema: RefParser.JSONSchema;
  let standartResponseSchema: RefParser.JSONSchema;

  let creationResponse: any = null;

  before(async () => {
    productsController = new ProductsController();

    let refParser = new RefParser();
    productListSchema = await refParser.dereference(CONFIG.SCHEMAS_PATH + "product_list.json");
    standartResponseSchema = await refParser.dereference(CONFIG.SCHEMAS_PATH + "standart_response.json");
  });

  afterEach(async () => {
    if (creationResponse) {
      await productsController.deleteById(creationResponse.id);
      creationResponse = null;
    }
  });

  it('успешное получение всех товаров', async () => {
    let products = await productsController.getAll();

    validate(productListSchema, products);
    assert(products.length > 0, "список товаров пуст");
  });

  it('успешное создание нового товара', async () => {
    creationResponse = await productsController.create(productData.valid_product);
    validate(standartResponseSchema, creationResponse);

    let products = await productsController.getAll();
    let product = products.find(item => item.id == creationResponse.id);

    assert(creationResponse.status, "статус ответа сервера 'неудача'");
    assert(product, "созданный товар не обнаружен в списке всех товаров");
    product = lodash.omit(product, ["id", "img", "cat", "alias"]);
    assert(lodash.isEqual(productData.valid_product, product), "исходные данные товара и данные нового товара отличаются");
  });

  it('успешное удаление товара по id', async () => {
    creationResponse = await productsController.create(productData.valid_product);

    let deleteResponse = await productsController.deleteById(creationResponse.id);
    validate(standartResponseSchema, deleteResponse);

    let products = await productsController.getAll();

    assert(deleteResponse.status, "статус ответа сервера 'неудача'");
    assert(!products.find(item => item.id == creationResponse.id), "удаленный товар обнаружен в списке всех товаров");
  });

  it('успешное редактирование существующего товара', async () => {
    creationResponse = await productsController.create(productData.valid_product);
    let products = await productsController.getAll();

    let modifiableProduct = products.find(item => item.id == creationResponse.id);
    modifiableProduct = { ...modifiableProduct, ...productData.valid_product_for_upd };

    let editResponse = await productsController.edit(modifiableProduct);
    validate(standartResponseSchema, editResponse);

    products = await productsController.getAll();
    let modifiedProduct = products.find(item => item.id == creationResponse.id);

    modifiableProduct = lodash.omit(modifiableProduct, ["cat", "alias"]);
    modifiedProduct = lodash.omit(modifiedProduct, ["cat", "alias"]);

    assert(editResponse.status, "статус ответа сервера 'неудача'");
    assert(lodash.isEqual(modifiableProduct, modifiedProduct),
      "исходные данные товара и данные модифицированного товара отличаются");
  });

  it('неуспешное создание товара с невалидными данными', async () => {
    creationResponse = await productsController.create(productData.invalid_product);
    validate(standartResponseSchema, creationResponse);

    let products = await productsController.getAll();
    let product = products.find(item => item.id == creationResponse.id);

    assert(!creationResponse.status, "статус ответа сервера 'успех'");
    assert(!creationResponse.id, "ответ сервера содержит id созданного товара");
    assert(!product, "созданный товар обнаружен в списке всех товаров");
  });

  it('неуспешное создание товара с пустыми данными', async () => {
    creationResponse = await productsController.create(productData.empty_product);
    validate(standartResponseSchema, creationResponse);

    let products = await productsController.getAll();
    let product = products.find(item => item.id == creationResponse.id);

    assert(!creationResponse.status, "статус ответа сервера 'успех'");
    assert(!creationResponse.id, "ответ сервера содержит id созданного товара");
    assert(!product, "созданный товар обнаружен в списке всех товаров");
  });

  it('неуспешное редактирование товара невалидными данными', async () => {
    creationResponse = await productsController.create(productData.valid_product);
    let products = await productsController.getAll();

    let modifiableProduct = products.find(item => item.id == creationResponse.id);
    modifiableProduct = { ...modifiableProduct, ...productData.invalid_product_for_upd };

    let editResponse = await productsController.edit(modifiableProduct);
    validate(standartResponseSchema, editResponse);

    products = await productsController.getAll();
    validate(productListSchema, products);

    assert(!editResponse.status, "статус ответа сервера 'успех'");
  });

  it('неуспешное редактирование товара пустыми данными', async () => {
    let editResponse = await productsController.edit(productData.empty_product);
    validate(standartResponseSchema, editResponse);

    let products = await productsController.getAll();
    validate(productListSchema, products);

    assert(!editResponse.status, "статус ответа сервера 'успех'");
  });

  it('неуспешное редактирование несуществующего товара', async () => {
    let editResponse = await productsController.edit(productData.nonexistent_product);
    validate(standartResponseSchema, editResponse);

    let products = await productsController.getAll();
    validate(productListSchema, products);

    assert(!editResponse.status, "статус ответа сервера 'успех'");
  });

  it('неуспешное удаление несуществующего товара', async () => {
    let deleteResponse = await productsController.deleteById("0");
    validate(standartResponseSchema, deleteResponse);
    assert(!deleteResponse.status, "статус ответа сервера 'успех'");
  });

});