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

    hashPassword() {
      this.password = hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      console.log("unencrypted : " + unencryptedPassword)
      console.log("this.password : " + this.password)
      return compareSync(unencryptedPassword, this.password);
    }

}
