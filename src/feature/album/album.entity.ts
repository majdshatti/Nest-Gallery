// Typeorm
import { Entity, Column, ManyToOne } from 'typeorm';
// Entity
import { User } from '../user';
// Serialization
import { FeatureEntity } from '../feature.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Album extends FeatureEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  isPrivate: boolean;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.albums, { eager: true })
  user: User;

  @Column()
  @Exclude()
  userId: number;
}
