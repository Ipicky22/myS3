import { Entity, PrimaryColumn, Column } from 'typeorm';
import { User } from './User'

@Entity()
export class Bucket {

    @PrimaryColumn('uuid')
    uuid: string;

    @Column('varchar', {
        length: 100,
    })
    name: string;

    @Column('varchar', {
        length: 100,
    })
    user: User;

}
