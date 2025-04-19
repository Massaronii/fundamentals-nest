import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare"
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator"
import * as bcrypt from "bcryptjs"

export class BcryptHasher implements HashGenerator, HashCompare {

  private HASH_SALT_LENGTH = 8

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
  }

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.HASH_SALT_LENGTH)
  }

}
