import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { hashSync, compareSync } from "bcryptjs";
import Bucket from './Bucket'

@Entity()
export default class User {

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

    @OneToMany(type => Bucket, bucket => bucket.user)
    bucket: Bucket[];

    hashPassword() {
      this.password = hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return compareSync(unencryptedPassword, this.password);
    }

}
