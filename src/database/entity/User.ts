import { Entity, PrimaryColumn, Column } from 'typeorm';
import { hashSync, compareSync } from "bcryptjs";

@Entity()
export class User {

    @PrimaryColumn('uuid')
    uuid: string;

    @Column('varchar', {
        length: 100,
    })
    nickname: string;

    @Column('varchar', {
        length: 100,
    })
    email: string;

    @Column('varchar', {
        length: 100,
    })
    password: string;

<<<<<<< HEAD
    private hashPassword() {
      this.password = hashSync(this.password, 8);
    }

    private checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return compareSync(unencryptedPassword, this.password);
=======
    hashPassword() {
        this.password = hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        console.log("pass",this.password)
        console.log("unencryptedPassword",unencryptedPassword)
        return compareSync(unencryptedPassword, this.password);
>>>>>>> 50e3d7bd036653139f45c7d6cbacf7fff9fec64f
    }

}
