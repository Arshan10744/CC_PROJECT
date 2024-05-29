import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { users } from './user.entity';
import { sites } from './site.entity';
import { companies } from './comapny.entity';

@Entity('organizations')
export class organizations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => sites, (site) => site.organization, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  sites?: sites[];

  @ManyToOne(() => companies, (company) => company.organizations, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  company?: Partial<companies>;

  @ManyToMany(() => users, (user) => user.organizations, {
    nullable: true,
  })
  @JoinTable()
  users?: users[];
}
