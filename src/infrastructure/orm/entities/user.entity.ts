import { ManyToMany, ManyToOne } from 'typeorm';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from 'src/infrastructure/utilities/enums';
import { organizations } from './organization.entity';
import { companies } from './comapny.entity';
@Entity('users')
export class users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ManyToOne(() => companies, (company) => company.users, {
    onDelete: 'CASCADE',
  })
  company: Partial<companies>;

  @ManyToMany(() => organizations, (organization) => organization.users, {
    nullable: true,
  })
  organizations?: Partial<organizations[]>;

  @Column({ default: false })
  is2faAuthenticated: boolean;
}
