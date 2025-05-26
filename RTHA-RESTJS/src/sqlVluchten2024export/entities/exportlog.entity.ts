import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('Exportlogs')
export class ExportLogEntity {

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