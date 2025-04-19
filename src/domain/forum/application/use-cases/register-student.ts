import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string 
password: string
}

type RegisterStudentUseCaseReponse = Either<StudentAlreadyExistsError, { student: Student }>

@Injectable()
export class RegisterStudentUseCase {
  constructor(private studentsRepository: StudentsRepository,
    private hashGenarator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseReponse> {
   
    const studentWithSameEmail = await this.studentsRepository.findByEmail(email)
    
    if (studentWithSameEmail) {
        return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenarator.hash(password)

    const student = Student.create({
      name,
      email,      
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}
