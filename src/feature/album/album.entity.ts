// Typeorm
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
// Entity
import { User } from '../user';

@Entity()
export class Album extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  isPrivate: boolean;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.albums)
  user: User;
}
