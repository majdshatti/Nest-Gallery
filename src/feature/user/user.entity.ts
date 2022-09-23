// Typeorm
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
// Utility
import * as bcrypt from 'bcrypt';
// Entity
import { Album } from '../album';

@Entity()
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Album, (album) => album.user)
  albums: Album[];

  async matchPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
