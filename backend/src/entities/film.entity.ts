import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn()
  id: string;

  @Column('decimal', { precision: 3, scale: 1 })
  rating: number;

  @Column()
  director: string;

  @Column('text', { array: true })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
