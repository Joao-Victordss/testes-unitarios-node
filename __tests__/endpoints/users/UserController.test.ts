import request from 'supertest';
import { App } from '../../../src/app';
import { IUser } from '../../../src/interfaces/IUser';
import { IUserResponse } from '../../../src/interfaces/IUserResponse';
import { UserRepository } from '../../../src/endpoints/users/userRepository';
import usersJson from '../../../src/endpoints/users/users.json';

// Cria uma instância da aplicação para executar os testes
const app = new App().server;
const mockUsers = usersJson as IUser[];

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Deve retornar a lista de usuários corretamente', async () => {
    console.log('Testando GET /users - listagem de usuários');

    const expectedUsers: IUserResponse[] = mockUsers.map((user) => ({
      ...user,
      isOfAge: user.age >= 18,
    }));

    jest.spyOn(UserRepository.prototype, 'list').mockReturnValueOnce(mockUsers);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUsers);
  });

  it('Deve retornar um usuário específico corretamente', async () => {
    console.log('Testando GET /users/:id - visualização de usuário');

    const mockUser = mockUsers[0];

    const expectedUser: IUserResponse = {
      ...mockUser,
      isOfAge: mockUser.age >= 18,
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
      id: 7,
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
