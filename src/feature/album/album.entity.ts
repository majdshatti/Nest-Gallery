// Typeorm
import { Entity, Column, ManyToOne } from 'typeorm';
// Entity
import { User } from '../user';
// Serialization
import { FeatureEntity } from '../feature.entity';

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

  @ManyToOne(() => User, (user) => user.albums)
  user: User;

  @Column()
  userId: number;
}
