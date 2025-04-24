import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let fakeHasher: FakeHasher
let inMemoryStudentRepository: InMemoryStudentRepository
let fakerEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

// sut = system under test
describe('Register student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher()
    fakerEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(inMemoryStudentRepository, fakeHasher, fakerEncrypter)
  })

  it('Should be able to authenticate a student', async () => {
  
    const student = makeStudent({
        email: 'john@example.com',
        password: await fakeHasher.hash('password'),
    })
  
    inMemoryStudentRepository.items.push(student)

    const result = await sut.execute({
      email: 'john@example.com',
      password: 'password',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(expect.objectContaining({
      acessToken: expect.any(String),
    }))
  })
})
