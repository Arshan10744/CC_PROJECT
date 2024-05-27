import { ManyToMany, ManyToOne } from 'typeorm';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from 'src/infrastructure/utilities/enums';
import { organizations } from './organization.entity';
import { companies } from './comapny.entity';
@Entity('sites')
export class sites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => organizations, (organization) => organization.sites, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  organization?: Partial<organizations>;
}
