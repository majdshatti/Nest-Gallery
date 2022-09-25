// Typeorm
import { Entity, Column, Unique, OneToMany } from 'typeorm';
// Utility
import * as bcrypt from 'bcrypt';
// Entity
import { Album } from '../album';
import { FeatureEntity } from '../feature.entity';
// Serialization
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Unique(['username', 'email'])
export class User extends FeatureEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Album, (album) => album.user)
  albums: Album[];

  async matchPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
