const request = require('supertest');
const { v4} = require('uuid');
const { products, productsWithImage, urls404, categories} = require('./consts.js');
const { getIndexedArray } = require('./utils');
const jwt = require('jsonwebtoken');

const args = process.argv.slice(2);
const BASE_URL = (args.length === 0) ? 'http://localhost:3000' : args[0];
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';


describe(`HW3 Tests, base url: <${BASE_URL}> `, () => {
    let adminJwt;
    let username;
    let password;
    let userJwt;
    let productIds = [];
    let productsWithImagesIds = [];
    let allProductsCount = 0;

    describe('Signup & Login', function () {
        test('Base segel test', async () => {
            let user = v4().substring(0, 8);
            let pass = '1234'
            let reqBody = JSON.stringify({ username: user, password: pass })

            let response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(201)

            response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)

            expect(response.status).toBe(200);
            let jwt = JSON.parse(response.res.text).token
            expect(jwt).toBeDefined()
        })

        test('POST /api/signup - 400 - empty username or password', async () => {
            let user = v4().substring(0, 16);
            let pass = '1234'

            let reqBody = JSON.stringify({ password: pass })
            let response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ username: user })
            response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ username: '', password: pass })
            response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ username: user, password: '' })
            response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ UsErnamE: user, password: pass })
            response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ username: user, PaSsworD: pass })
            response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(400)

        })
        test('POST /api/signup - 400 - invalid json body', async () => {
            let user = v4().substring(0, 16);
            let pass = '1234'

            let reqBody = JSON.stringify({ username: user, password: pass })

            // To malform the body
            reqBody = reqBody.substring(0, reqBody.length - 1)

            let response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(400)
        })

        test('POST /api/signup - 201', async () => {
            username = v4().substring(0, 16).toUpperCase();
            password = '123A';
            let reqBody = JSON.stringify({ username, password })
            let response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(201);

            // Case sensitivity
            let lowerUsername = username.toLowerCase();
            reqBody = JSON.stringify({ username: lowerUsername, password })
            response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).toBe(201);
        })

        test('POST /api/signup - 400 - existing username', async () => {
            let reqBody = JSON.stringify({ username, password })
            let response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).not.toBe(201);
            expect(response.status).not.toBe(200);

            // Case sensitivity
            let lowerUsername = username.toLowerCase();
            reqBody = JSON.stringify({ username: lowerUsername, password })
            response = await request(BASE_URL)
                .post('/api/signup')
                .send(reqBody)
            expect(response.status).not.toBe(201);
            expect(response.status).not.toBe(200);
        })

        test('POST /api/login - 400 - empty username or password', async () => {
            let reqBody = JSON.stringify({ password })
            let response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ username })
            response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ username: '', password })
            response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ username, password: '' })
            response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ UsErnamE: username, password })
            response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(400)

            reqBody = JSON.stringify({ username, PaSsworD: password })
            response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(400)
        })

        test('POST /api/login - 400 - invalid json body', async () => {
            let reqBody = JSON.stringify({ username, password })

            // To malform the body
            reqBody = reqBody.substring(0, reqBody.length - 1)

            let response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(400)
        })

        test('POST /api/login - 401 - wrong password', async () => {
            const wrongPassword = '12345';
            let reqBody = JSON.stringify({ username, password: wrongPassword })

            let response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(401)

            const lowerPassword = password.toLowerCase();
            reqBody = JSON.stringify({username, password: lowerPassword});
            response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(401)
        })

        test('POST /api/login - 401 - not existing username', async () => {
            const notExistingUsername = v4().substring(0, 16);
            let reqBody = JSON.stringify({ username: notExistingUsername, password })

            let response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(401)
        })

        test('POST /api/login - 200 - admin & end user', async () => {
            let reqBody = JSON.stringify({ username, password })
            let response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(200);
            userJwt = JSON.parse(response.res.text).token
            expect(typeof userJwt).toBe('string')

            reqBody = JSON.stringify({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD })
            response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(200);
            adminJwt = JSON.parse(response.res.text).token
            expect(typeof adminJwt).toBe('string')
        })
    });

    describe('Product CRUD', () => {
        test('POST /api/product - 400 - fields validation', async () => {
            for (const attribute of Object.keys(products[0])) {
                const missingAttributeProduct = Object.assign({}, products[0]);
                delete missingAttributeProduct[attribute]
                const reqBody = JSON.stringify(missingAttributeProduct);
                const response = await request(BASE_URL)
                    .post('/api/product')
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send(reqBody)
                expect(response.status).toBe(400)
            }

            const badPrices = ["5", -5, 1005, null]
            for (const badPrice of badPrices) {
                let productWithBadPrice = Object.assign({}, products[0], {price: badPrice})
                const reqBody = JSON.stringify(productWithBadPrice);
                const response = await request(BASE_URL)
                    .post('/api/product')
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send(reqBody)
                expect(response.status).toBe(400)
            }

            const badCategories = ["T-sHIrt", null, 5, "5", "    t-shirt"];
            for (const badCategory of badCategories) {
                let productWithBadCategory = Object.assign({}, products[0], {category: badCategory})
                const reqBody = JSON.stringify(productWithBadCategory);
                const response = await request(BASE_URL)
                    .post('/api/product')
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send(reqBody)
                expect(response.status).toBe(400)
            }
        })

        test('POST /api/product - 400 - invalid json body', async () => {
            const productWithId = Object.assign({}, products[0], {id: '123'});
            let reqBody = JSON.stringify(productWithId);

            // To malform the body
            reqBody = reqBody.substring(0, reqBody.length - 1);
            const response = await request(BASE_URL)
                .post('/api/product')
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody)
            expect(response.status).toBe(400)
        })

        test('POST /api/product - 400 - request with id param', async () => {
            const productWithId = Object.assign({}, products[0], {id: '123'});
            const reqBody = JSON.stringify(productWithId);
            const response = await request(BASE_URL)
                .post('/api/product')
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody)
            expect(response.status).toBe(400)
        })

        test('POST /api/product - 400 - not existing category', async () => {
            const productWithBadType = Object.assign({}, products[0], {category: 'bad_category'});
            const reqBody = JSON.stringify(productWithBadType);
            const response = await request(BASE_URL)
                .post('/api/product')
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody)
            expect(response.status).toBe(400)
        })

        test('POST /api/product - 201', async () => {
            for (const product of products) {
                reqBody = JSON.stringify(product);
                response = await request(BASE_URL)
                    .post('/api/product')
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send(reqBody)
                expect(response.status).toBe(201);
                const productResponse = JSON.parse(response.res.text)
                expect(Object.keys(productResponse).length).toBe(1);
                expect(productResponse.id).toBeDefined();
                productIds.push(productResponse.id)
            }

            for (const product of productsWithImage) {
                reqBody = JSON.stringify(product);
                response = await request(BASE_URL)
                    .post('/api/product')
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send(reqBody)
                expect(response.status).toBe(201);
                const productResponse = JSON.parse(response.res.text)
                expect(Object.keys(productResponse).length).toBe(1);
                expect(productResponse.id).toBeDefined();
                productsWithImagesIds.push(productResponse.id)
            }
        })

        test('GET /api/product/{id} - 200', async () => {
            expect(productsWithImage.length).toBe(productsWithImagesIds.length);
            expect(products.length).toBe(productIds.length);
            for (let i=0; i<productIds.length; i++) {
                const response = await request(BASE_URL)
                    .get(`/api/product/${productIds[i]}`)
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send()
                expect(response.status).toBe(200);
                let responseBody = JSON.parse(response.res.text);
                expect(responseBody.id).toEqual(productIds[i]);
                delete responseBody.id;
                expect(responseBody).toEqual(products[i]);
            }
        })

        test('GET /api/product/{id} - 200 - by id, extra attributes', async () => {
            expect(productsWithImage.length).toBe(productsWithImagesIds.length);
            expect(products.length).toBe(productIds.length);
            for (let i=0; i< productsWithImagesIds.length; i++) {
                const response = await request(BASE_URL)
                    .get(`/api/product/${productsWithImagesIds[i]}`)
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send()
                expect(response.status).toBe(200);
                let responseBody = JSON.parse(response.res.text);
                expect(responseBody.id).toEqual(productsWithImagesIds[i]);
                delete responseBody.id;
                expect(responseBody).toEqual(productsWithImage[i]);
            }
        }, 50000)

        test.each(getIndexedArray(categories))('GET /api/product/%s - 200 - by category', async (category, i) => {
            const response = await request(BASE_URL)
                .get(`/api/product/${category}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send()
            expect(response.status).toBe(200);
            let responseBody = JSON.parse(response.res.text);
            allProductsCount+= responseBody.length;

            // Remove id field
            responseBody = responseBody.map(p => {
                const pRet = JSON.parse(JSON.stringify(p));
                delete pRet.id;
                return pRet;
            })
            expect(responseBody.length).toBeDefined();
            expect(responseBody.length).toBeGreaterThanOrEqual(2);
            expect(responseBody).toContainEqual(productsWithImage[i])
            expect(responseBody).toContainEqual(products[i])
        })

        test('PUT /api/product - 400 - request with id param in body', async () => {
            const productWithId = Object.assign({}, products[0], {id: '123'});
            const reqBody = JSON.stringify(productWithId);
            const response = await request(BASE_URL)
                .put(`/api/product/${productWithId.id}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody)
            expect(response.status).toBe(400)
        })

        // https://moodle2223.technion.ac.il/mod/forum/discuss.php?d=11954#p15516
        test('PUT /api/product - 400 - item not exist', async () => {
            const notExistingId = v4().substring(0,20);
            const reqBody = JSON.stringify(products[0]);
            let response = await request(BASE_URL)
                .put(`/api/product/${notExistingId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody)
            expect(response.status).toBe(400);

            response = await request(BASE_URL)
                .put(`/api/product/${notExistingId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody)
            expect(response.status).toBe(400);
        })

        test('PUT /api/product - 200 - item did update', async () => {
            const updateId = productIds[0]
            let updatedBody = products[1];
            let reqBody = JSON.stringify(updatedBody);
            let response = await request(BASE_URL)
                .put(`/api/product/${updateId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody)
            expect(response.status).toBe(200);
            let updateResponse = JSON.parse(response.res.text);
            expect(Object.keys(updateResponse).length).toBe(1);
            expect(updateResponse.id).toBe(updateId);

            response = await request(BASE_URL)
                .get(`/api/product/${updateId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send()
            expect(response.status).toBe(200);
            let responseBody = JSON.parse(response.res.text);
            expect(responseBody.id).toEqual(updateId);
            delete responseBody.id;
            expect(responseBody).toEqual(updatedBody);

            // Update back to the previous fields
            updatedBody = products[0];
            reqBody = JSON.stringify(updatedBody);
            response = await request(BASE_URL)
                .put(`/api/product/${updateId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody)
            expect(response.status).toBe(200);
            updateResponse = JSON.parse(response.res.text);
            expect(Object.keys(updateResponse).length).toBe(1);
            expect(updateResponse.id).toBe(updateId);

            response = await request(BASE_URL)
                .get(`/api/product/${updateId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send()
            expect(response.status).toBe(200);
            responseBody = JSON.parse(response.res.text);
            expect(responseBody.id).toEqual(updateId);
            delete responseBody.id;
            expect(responseBody).toEqual(updatedBody);

        })

        test('DELETE /api/product - 200 - not existed id', async () => {
            const notExistingId = v4().substring(0, 16);
            let response = await request(BASE_URL)
                .delete(`/api/product/${notExistingId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send()
            expect(response.status).toBe(200)
            expect(response.res.text).toEqual('');

            let allProductsCountAfterDelete = 0;
            for (const category of categories) {
                response = await request(BASE_URL)
                    .get(`/api/product/${category}`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                expect(response.status).toBe(200);
                let responseBody = JSON.parse(response.res.text);
                allProductsCountAfterDelete+= responseBody.length;
            }
            expect(allProductsCount).toBe(allProductsCountAfterDelete);

        })

        test('DELETE /api/product', async () => {
            for (let i=0;i<productIds.length;i++){
                let response = await request(BASE_URL)
                    .get(`/api/product/${products[i].category}`)
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send()
                expect(response.status).toBe(200);
                let productsBeforeDelete = JSON.parse(response.res.text);
                expect(productsBeforeDelete).toBeTruthy();
                expect(productsBeforeDelete.length).toBeGreaterThanOrEqual(1);
                expect(productsBeforeDelete.find(p => p.id === productIds[i])).toBeDefined();

                response = await request(BASE_URL)
                    .delete(`/api/product/${productIds[i]}`)
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send()
                expect(response.status).toBe(200);
                expect(response.res.text).toEqual('');


                response = await request(BASE_URL)
                    .get(`/api/product/${products[i].category}`)
                    .set('Authorization', `Bearer ${adminJwt}`)
                    .send()
                expect(response.status).toBe(200);
                let productsAfterDelete = JSON.parse(response.res.text);
                expect(productsAfterDelete.length).toBe(productsBeforeDelete.length - 1);
                expect(productsAfterDelete.find(p => p.id === productIds[i] )).not.toBeDefined()
            }

        })
    });

    describe('Permissions', () => {
        test('PUT /api/permission - 403 - not admin', async () => {
            let reqBody = JSON.stringify({username, permission: 'W'});
            let response = await request(BASE_URL)
                .put('/api/permission')
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);

            reqBody = JSON.stringify({username, permission: 'M'});
            response = await request(BASE_URL)
                .put('/api/permission')
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);
        })
        test('PUT /api/permission - 400 - not M or W', async () => {
            let reqBody = JSON.stringify({username, permission: 'A'});
            let response = await request(BASE_URL)
                .put('/api/permission')
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody);
            expect(response.status).toBe(400);

            // validate that the permission indeed haven't changed
            response = await request(BASE_URL)
                .delete(`/api/product/${productIds[0]}`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send()
            expect(response.status).toBe(403)

            reqBody = JSON.stringify({username, permission: 'B'});
            response = await request(BASE_URL)
                .put('/api/permission')
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody);
            expect(response.status).toBe(400);

        })

        test('PUT /api/permission - 200 - validate permissions with old token', async () => {
            let reqBody = JSON.stringify(products[0]);
            let response = await request(BASE_URL)
                .post('/api/product')
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);

            reqBody = JSON.stringify({username, permission: 'M'});
            response = await request(BASE_URL)
                .put('/api/permission')
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody);
            expect(response.status).toBe(200);

            reqBody = JSON.stringify(products[0]);
            response = await request(BASE_URL)
                .post('/api/product')
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(201);
            const id = JSON.parse(response.res.text).id;
            expect(id).toBeDefined();

            response = await request(BASE_URL)
                .delete(`/api/product/${id}`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send()
            expect(response.status).toBe(403);

            reqBody = JSON.stringify({username, permission: 'W'});
            response = await request(BASE_URL)
                .put('/api/permission')
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody);
            expect(response.status).toBe(200);

            reqBody = JSON.stringify(products[0]);
            response = await request(BASE_URL)
                .post('/api/product')
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);
        })

        test('Validate permission W', async () => {
            let reqBody = 'bad_body';
            let notExistedId = v4().substring(0,25);
            let response = await request(BASE_URL)
                .get(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send();
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .post(`/api/product`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);

            response = await request(BASE_URL)
                .put(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);

            response = await request(BASE_URL)
                .put(`/api/product/${productIds[0]}`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);

            response = await request(BASE_URL)
                .delete(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send();
            expect(response.status).toBe(403);

            response = await request(BASE_URL)
                .delete(`/api/product/${productIds[0]}`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send();
            expect(response.status).toBe(403);

            response = await request(BASE_URL)
                .put(`/api/permission`)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);
        })

        test('Validate permission M', async () => {
            const MUsername = v4().substring(0,25);
            const MPassword = '1234';
            let authReqBody = JSON.stringify({username: MUsername, password: MPassword});
            let response = await request(BASE_URL)
                .post('/api/signup')
                .send(authReqBody)
            expect(response.status).toBe(201);

            let updatePermissionBody = JSON.stringify({username: MUsername, permission: 'M'});
            response = await request(BASE_URL)
                .put('/api/permission')
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(updatePermissionBody)
            expect(response.status).toBe(200)

            response = await request(BASE_URL)
                .post('/api/login')
                .send(authReqBody)
            expect(response.status).toBe(200);
            let MJwt = JSON.parse(response.res.text).token
            expect(MJwt).toBeDefined()

            let reqBody = 'bad_body';
            let notExistedId = v4().substring(0,25);
            response = await request(BASE_URL)
                .get(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${MJwt}`)
                .send();
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .post(`/api/product`)
                .set('Authorization', `Bearer ${MJwt}`)
                .send(reqBody);
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .put(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${MJwt}`)
                .send(reqBody);
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .put(`/api/product/${productIds[0]}`)
                .set('Authorization', `Bearer ${MJwt}`)
                .send(reqBody);
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .delete(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${MJwt}`)
                .send();
            expect(response.status).toBe(403);

            response = await request(BASE_URL)
                .delete(`/api/product/${productIds[0]}`)
                .set('Authorization', `Bearer ${MJwt}`)
                .send();
            expect(response.status).toBe(403);

            response = await request(BASE_URL)
                .put(`/api/permission`)
                .set('Authorization', `Bearer ${MJwt}`)
                .send(reqBody);
            expect(response.status).toBe(403);
        })

        test('Validate permission A', async () => {
            let reqBody = 'bad_body';
            let notExistedId = v4().substring(0,25);
            let response = await request(BASE_URL)
                .get(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send();
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .post(`/api/product`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody);
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .put(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody);
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .put(`/api/product/${productIds[0]}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody);
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .delete(`/api/product/${notExistedId}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send();
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .delete(`/api/product/${productIds[0]}`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send();
            expect(response.status).not.toBe(403);

            response = await request(BASE_URL)
                .put(`/api/permission`)
                .set('Authorization', `Bearer ${adminJwt}`)
                .send(reqBody);
            expect(response.status).not.toBe(403);
        })
    });



    describe('Jwt token', () => {
        test('Bad authorization header', async () => {
            const notExistingId = v4().substring(0, 16);
            const badAuthorizationHeaders = [
                `Bearer Bearer ${adminJwt}`,
                `NotBearer ${adminJwt}`,
                `Bearer     ${adminJwt}`,
                `${adminJwt}`,
                `Bearer ${adminJwt.substring(0,adminJwt.length - 1)}`
            ]
            for (const header of badAuthorizationHeaders) {
                let response = await request(BASE_URL)
                    .delete(`/api/product/${notExistingId}`)
                    .set('Authorization', header)
                    .send()
                expect(response.status).toBe(401)
            }

        })
        test('Empty or default secret', async () => {
            const reqBody = JSON.stringify({username: ADMIN_USERNAME, password: ADMIN_PASSWORD});
            const response = await request(BASE_URL)
                .post('/api/login')
                .send(reqBody)
            expect(response.status).toBe(200);
            let token = JSON.parse(response.res.text).token
            expect(token).toBeDefined()
            const defaultSecret = 'your_secret_key'
            await expect(async () => {jwt.verify(token, defaultSecret)}).rejects.toThrow();
            await expect(async () => {jwt.verify(token, '')}).rejects.toThrow();

        })

    })

    describe('Bad methods, 404', () => {
        test.each(urls404.GET)('GET %s - 404', async url => {
            let response = await request(BASE_URL)
                .get(url)
                .set('Authorization', `Bearer ${userJwt}`)
                .send()
            expect(response.status).toBe(404)

            response = await request(BASE_URL)
                .get(url)
                .send()
            expect(response.status).toBe(404)
        })

        test.each(urls404.POST)('POST %s - 404', async url => {
            let reqBody = JSON.stringify({key: 'value'});
            let response = await request(BASE_URL)
                .post(url)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody)
            expect(response.status).toBe(404)

            response = await request(BASE_URL)
                .post(url)
                .send(reqBody)
            expect(response.status).toBe(404)

            // To malform the body
            reqBody = reqBody.substring(0, reqBody.length - 1);
            response = await request(BASE_URL)
                .post(url)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody)
            expect(response.status).toBe(404)
        })

        test.each(urls404.PUT)('PUT %s - 404', async url => {
            let reqBody = JSON.stringify({key: 'value'});
            let response = await request(BASE_URL)
                .put(url)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody)
            expect(response.status).toBe(404)

            response = await request(BASE_URL)
                .put(url)
                .send(reqBody)
            expect(response.status).toBe(404)

            // To malform the body
            reqBody = reqBody.substring(0, reqBody.length - 1);
            response = await request(BASE_URL)
                .put(url)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody)
            expect(response.status).toBe(404)
        })

        test.each(urls404.DELETE)('DELETE %s - 404', async url => {
            let response = await request(BASE_URL)
                .delete(url)
                .set('Authorization', `Bearer ${userJwt}`)
                .send()
            expect(response.status).toBe(404)

            response = await request(BASE_URL)
                .delete(url)
                .send()
            expect(response.status).toBe(404)
        })
        test.each(urls404.PATCH)('PATCH %s - 404', async url => {
            let reqBody = JSON.stringify({key: 'value'});
            let response = await request(BASE_URL)
                .patch(url)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody)
            expect(response.status).toBe(404)

            response = await request(BASE_URL)
                .patch(url)
                .send(reqBody)
            expect(response.status).toBe(404)

            // To malform the body
            reqBody = reqBody.substring(0, reqBody.length - 1);
            response = await request(BASE_URL)
                .patch(url)
                .set('Authorization', `Bearer ${userJwt}`)
                .send(reqBody)
            expect(response.status).toBe(404)
        })
    })


})

