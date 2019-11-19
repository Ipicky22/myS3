import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    uuid: number

    @Column('varchar', {
        length: 100,
    })
    nickname: string

    @Column('varchar', {
        length: 100,
    })
    email: string

    @Column('varchar', {
        length: 100,
    })
    password: string
}
