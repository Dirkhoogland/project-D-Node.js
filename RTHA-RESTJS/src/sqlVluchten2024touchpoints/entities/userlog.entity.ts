import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('Userlogs')
export class UserLogEntity {

    @PrimaryGeneratedColumn()
    requestNo: bigint

    @Column()
    username: string;

    @CreateDateColumn()
    loggedAt: Date;

    @Column()
    database: string;

    @Column({ nullable: true })
    query?: string

    @Column({ nullable: true })
    requestUrl?: string

    @Column()
    resultFound: boolean;

}
