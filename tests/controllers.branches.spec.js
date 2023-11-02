import supertest from 'supertest';
import express, { json } from 'express';
import { BranchesRouter } from "../routes/branches.js";
import { branchModel } from "../models/branches.js";
import e from 'express';


const app = express();
app.use(json());
app.use('/branches', BranchesRouter({ branchModel }));


describe('Test branches endpoints', () => {

  let instance;

  beforeEach(async() => {
    await branchModel.destroy({ truncate: {cascade: true} });
    instance = await branchModel.create({
      nombre: 'test sucursal',
      direccion: 'test address'
    });
  });

  it('fetch branch', async () => {
    let response = await supertest(app).get('/branches/' + instance.id_sucursal);
    let data = {
      nombre: instance.nombre,
      direccion: instance.direccion,
      id_sucursal: instance.id_sucursal
    }
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(data);
  });

  it('fetch all branches', async () => {
    let response = await supertest(app).get('/branches');
    let data = {
      nombre: instance.nombre,
      direccion: instance.direccion,
      id_sucursal: instance.id_sucursal
    }
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject(data);

  });

  it.each([
      [{}, 400],
      [{nombre: 'test'}, 400],
      [{direccion: 'test'}, 400],
      [{nombre: 'test sucursal', direccion: 'test address'}, 400],  // ya existe
      [{nombre: 'test sucursal (2)', direccion: 'test address 123'}, 201], // ok
  ])('Creating Branch %p expecting %p', async (payload, expected_status) => {
      let response = await supertest(app)
        .post('/branches')
        .send(payload);

      expect(response.status).toBe(expected_status);

      if (expected_status == 201) {
          expect(response.body.nombre).toBe(payload.nombre);
          expect(response.body.direccion).toBe(payload.direccion);
      }
  });

  it('Updating Branch', async () => {
      let response = await supertest(app)
        .patch('/branches/' + instance.id_sucursal)
        .send({'direccion': 'test address (updated)'});

      expect(response.status).toBe(200);
      expect(response.body.direccion).toBe('test address (updated)');
  });

  it('Deleting Branch', async () => {
      let response = await supertest(app).delete('/branches/99999');
      expect(response.status).toBe(404);

      let response_ok = await supertest(app)
        .delete('/branches/' + instance.id_sucursal);

      expect(response_ok.status).toBe(204);
  });


});