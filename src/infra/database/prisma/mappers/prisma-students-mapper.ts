import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { User as PrismaStudent, Prisma} from "@prisma/client";

export class PrismaStudentMapper {
    static toDomain(raw: PrismaStudent): Student {
        return Student.create({
            name: raw.name,
            email: raw.email,
            password: raw.password,
        }, 
        new UniqueEntityId(raw.id),)
    }

    static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
        return {
            id: student.id.toString(),
            name: student.name,
            email: student.email,
            password: student.password,
        }
    }
}

