import { strict as assert } from 'assert';
import lodash from 'lodash';
import { slug } from "slug-gen";
import { ProductsController } from "../api/controllers/products.controller";

import RefParser from "@apidevtools/json-schema-ref-parser";
import { CONFIG } from "../config/env";
import { validate } from "../api/validator";

import productData from "./test_cases/product.json";

describe('Магазин', function () {
  this.timeout(15000);

  let productsController: ProductsController;
  let productListSchema: RefParser.JSONSchema;
  let standartResponseSchema: RefParser.JSONSchema;

  let creationResponse: any[] = [];

  before(async () => {
    productsController = new ProductsController();

    let refParser = new RefParser();
    productListSchema = await refParser.dereference(CONFIG.SCHEMAS_PATH + "product_list.json");
    standartResponseSchema = await refParser.dereference(CONFIG.SCHEMAS_PATH + "standart_response.json");
  });

  afterEach(() => {
    if (creationResponse.length > 0) {
      creationResponse.forEach(async element => {
        await productsController.deleteById(element.id);
      });
      creationResponse = [];
    }
  });

  it('успешное получение всех товаров', async () => {
    let products = await productsController.getAll();

    validate(productListSchema, products);
    assert(products.length > 0, "список товаров пуст");
  });

  it('успешное создание нового товара', async () => {
    creationResponse.push(await productsController.create(productData.valid_product));
    validate(standartResponseSchema, creationResponse[0]);

    let products = await productsController.getAll();
    let product = products.find(item => item.id == creationResponse[0].id);

    assert(creationResponse[0].status, "статус ответа сервера 'неудача'");
    assert(product, "созданный товар не обнаружен в списке всех товаров");
    product = lodash.omit(product, ["id", "img", "cat", "alias"]);
    assert(lodash.isEqual(productData.valid_product, product), "исходные данные товара и данные нового товара отличаются");
  });

  it('успешное удаление товара по id', async () => {
    creationResponse.push(await productsController.create(productData.valid_product));

    let deleteResponse = await productsController.deleteById(creationResponse[0].id);
    validate(standartResponseSchema, deleteResponse);

    let products = await productsController.getAll();

    assert(deleteResponse.status, "статус ответа сервера 'неудача'");
    assert(!products.find(item => item.id == creationResponse[0].id), "удаленный товар обнаружен в списке всех товаров");
  });

  it('успешное редактирование существующего товара', async () => {
    creationResponse.push(await productsController.create(productData.valid_product));
    let products = await productsController.getAll();

    let modifiableProduct = products.find(item => item.id == creationResponse[0].id);
    modifiableProduct = { ...modifiableProduct, ...productData.valid_product_for_upd };

    let editResponse = await productsController.edit(modifiableProduct);
    validate(standartResponseSchema, editResponse);

    products = await productsController.getAll();
    let modifiedProduct = products.find(item => item.id == creationResponse[0].id);

    modifiableProduct = lodash.omit(modifiableProduct, ["cat", "alias"]);
    modifiedProduct = lodash.omit(modifiedProduct, ["cat", "alias"]);

    assert(editResponse.status, "статус ответа сервера 'неудача'");
    assert(lodash.isEqual(modifiableProduct, modifiedProduct),
      "исходные данные товара и данные модифицированного товара отличаются");
  });

  it('неуспешное создание товара с невалидными данными', async () => {
    creationResponse.push(await productsController.create(productData.invalid_product));
    validate(standartResponseSchema, creationResponse);

    let products = await productsController.getAll();
    let product = products.find(item => item.id == creationResponse[0].id);

    assert(!creationResponse[0].status, "статус ответа сервера 'успех'");
    assert(!creationResponse[0].id, "ответ сервера содержит id созданного товара");
    assert(!product, "созданный товар обнаружен в списке всех товаров");
  });

  it('неуспешное создание товара с пустыми данными', async () => {
    creationResponse.push(await productsController.create(productData.empty_product));
    validate(standartResponseSchema, creationResponse);

    let products = await productsController.getAll();
    let product = products.find(item => item.id == creationResponse[0].id);

    assert(!creationResponse[0].status, "статус ответа сервера 'успех'");
    assert(!creationResponse[0].id, "ответ сервера содержит id созданного товара");
    assert(!product, "созданный товар обнаружен в списке всех товаров");
  });

  it('неуспешное редактирование товара невалидными данными', async () => {
    creationResponse.push(await productsController.create(productData.valid_product));
    let products = await productsController.getAll();

    let modifiableProduct = products.find(item => item.id == creationResponse[0].id);
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

  it('успешная генерация поля alias у создаваемых товаров', async () => {
    creationResponse.push(await productsController.create(productData.valid_product));
    creationResponse.push(await productsController.create(productData.valid_product));
    creationResponse.push(await productsController.create(productData.valid_product));

    let products = await productsController.getAll();

    let product1 = products.find(item => item.id == creationResponse[0].id);
    let product2 = products.find(item => item.id == creationResponse[1].id);
    let product3 = products.find(item => item.id == creationResponse[2].id);

    assert(product1.alias == slug(productData.valid_product.title),
      "поле alias не соответствует формату 'заголовок-товара'");

    assert(product2.alias == slug(productData.valid_product.title) + "-0",
      "поле alias не соответствует формату 'заголовок-товара-0'");

    assert(product3.alias == slug(productData.valid_product.title) + "-0-0",
      "поле alias не соответствует формату 'заголовок-товара-0-0'");
  });

  it('успешная генерация поля alias у редактируемых товаров', async () => {
    creationResponse.push(await productsController.create(productData.valid_product));
    creationResponse.push(await productsController.create(productData.valid_product));
    creationResponse.push(await productsController.create(productData.valid_product));

    let products = await productsController.getAll();

    let product1 = products.find(item => item.id == creationResponse[0].id);
    await productsController.edit({ ...product1, ...productData.valid_product_for_upd });

    let product2 = products.find(item => item.id == creationResponse[1].id);
    await productsController.edit({ ...product2, ...productData.valid_product_for_upd });
    
    let product3 = products.find(item => item.id == creationResponse[2].id);
    await productsController.edit({ ...product3, ...productData.valid_product_for_upd });

    products = await productsController.getAll();
    product1 = products.find(item => item.id == creationResponse[0].id);
    product2 = products.find(item => item.id == creationResponse[1].id);
    product3 = products.find(item => item.id == creationResponse[2].id);

    assert(product1.alias == slug(productData.valid_product_for_upd.title),
      "поле alias не соответствует формату 'заголовок-товара'");

    assert(product2.alias == slug(productData.valid_product_for_upd.title) + "-" + product2.id,
      "поле alias не соответствует формату 'заголовок-товара-id'");

    assert(product3.alias == slug(productData.valid_product_for_upd.title) + "-" + product3.id,
      "поле alias не соответствует формату 'заголовок-товара-id'");
  });

});