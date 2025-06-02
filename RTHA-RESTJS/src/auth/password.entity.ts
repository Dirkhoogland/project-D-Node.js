// filepath: c:\Users\samla\OneDrive\Bureaublad\HR-1048748\Project D\project-D-Node.js\RTHA-RESTJS\src\auth\password-username.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { Role } from './Roles/role.enum';

@Entity('Password_Username')
export class PasswordUsername {
  @PrimaryColumn()
  Username: string;

  @Column()
  Password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
    name: "Role"
  })
  Role: Role;
}