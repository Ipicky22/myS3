import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class User {
    @PrimaryColumn('uuid')
    uuid: string

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
