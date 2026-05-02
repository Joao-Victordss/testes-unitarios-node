import request from 'supertest';
import { App } from '../../../src/app';
import { IUser } from '../../../src/interfaces/IUser';
import { IUserResponse } from '../../../src/interfaces/IUserResponse';
import { UserRepository } from '../../../src/endpoints/users/userRepository';

// Cria uma instância da aplicação para executar os testes
const app = new App().server;

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Deve retornar a lista de usuários corretamente', async () => {
    console.log('Testando GET /users - listagem de usuários');

    const mockUsers: IUser[] = [
      {
        id: 1,
        name: 'Naruto',
        age: 10,
      },
      {
        id: 2,
        name: 'Sasuke',
        age: 18,
      },
      {
        id: 3,
        name: 'Kakashi',
        age: 50,
      },
    ];

    const expectedUsers: IUserResponse[] = [
      {
        id: 1,
        name: 'Naruto',
        age: 10,
        isOfAge: false,
      },
      {
        id: 2,
        name: 'Sasuke',
        age: 18,
        isOfAge: true,
      },
      {
        id: 3,
        name: 'Kakashi',
        age: 50,
        isOfAge: true,
      },
    ];

    jest.spyOn(UserRepository.prototype, 'list').mockReturnValueOnce(mockUsers);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUsers);
  });

  it('Deve retornar um usuário específico corretamente', async () => {
    console.log('Testando GET /users/:id - visualização de usuário');

    const mockUser: IUser = {
      id: 1,
      name: 'Naruto',
      age: 10,
    };

    const expectedUser: IUserResponse = {
      ...mockUser,
      isOfAge: false,
    };

    const findOneSpy = jest.spyOn(UserRepository.prototype, 'findOne').mockReturnValueOnce(mockUser);

    const response = await request(app).get('/users/1');

    expect(findOneSpy).toHaveBeenCalledWith(1);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUser);
  });

  it('Deve criar um usuário corretamente', async () => {
    console.log('Testando POST /users - criação de usuário');

    const mockUser: IUser = {
      id: 4,
      name: 'Sakura',
      age: 18,
    };

    const saveSpy = jest.spyOn(UserRepository.prototype, 'save').mockReturnValueOnce(true);

    const response = await request(app).post('/users').send(mockUser);

    expect(saveSpy).toHaveBeenCalledWith(mockUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: 'Usuário criado com sucesso',
    });
  });

  it('Deve excluir um usuário corretamente', async () => {
    console.log('Testando DELETE /users/:id - exclusão de usuário');

    const deleteSpy = jest.spyOn(UserRepository.prototype, 'delete').mockReturnValueOnce(true);

    const response = await request(app).delete('/users/1');

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: 'Usuário excluído com sucesso',
    });
  });
});
