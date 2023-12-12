import { Exclude } from 'class-transformer';
import { Car } from 'src/car/entities/car.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  hash: string;

  @Column()
  name: string;

  @Exclude({ toPlainOnly: true })
  @Column('text', { array: true, default: [] })
  refresh_tokens: string[];

  @OneToMany(() => Car, (car) => car.author)
  cars: Car[];
}
