import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";
import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

@Module({
    providers: [
        {
            provide: HashCompare,
            useClass: BcryptHasher,
        },
        {
            provide: HashGenerator,
            useClass: BcryptHasher,
        },
        {
            provide: Encrypter,
            useClass: JwtEncrypter,
        },
    ],
    exports: [
        Encrypter,
        HashCompare,
        HashGenerator
    ],
})
export class CryptographyModule { }