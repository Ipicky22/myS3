import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { Bucket } from "./Bucket";

@Entity()
export class Blob {

    @PrimaryGeneratedColumn()
    id: number;

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

    @ManyToOne(type => Bucket, bucket => bucket.blob, { cascade: true })
    bucket:  Bucket;
}
