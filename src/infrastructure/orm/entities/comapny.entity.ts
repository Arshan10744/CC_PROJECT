import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { users } from './user.entity';
import { organizations } from './organization.entity';

@Entity('companies')
export class companies {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => users, (user) => user.company, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  users?: users[];

  @OneToMany(() => organizations, (organization) => organization.company, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  organizations?: organizations[];
}
