import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import User from './User';
import Blob from './Blob';

@Entity()
export default class Bucket {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        length: 100,
    })
    name: string;

    @ManyToOne(type => User, user => user.bucket, { cascade: true })
    user: User;

    @OneToMany(type => Blob, blob => blob.bucket)
    blob: Blob

}
