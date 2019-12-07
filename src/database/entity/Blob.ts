import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Bucket } from "./Bucket";

@Entity()
export class Blob {

    @PrimaryColumn('uuid')
    uuid: string;

    @Column('varchar', {
        length: 100,
    })
    name: string;

    @Column('varchar', {
        length: 200,
    })
    path: string;

    @Column('int', {
        width: 255,
    })
    size: number;

    @Column('varchar', {
        length: 100,
    })
    bucket: Bucket;

}
