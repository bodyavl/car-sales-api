import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.cars)
  author: User;

  @Column()
  carManufacturer: string;

  @Column()
  carModel: string;

  @Column()
  year: number;

  @CreateDateColumn()
  publishDate: Date;

  @OneToMany(() => Image, (image) => image.car)
  images: Image[];

  @Column({ nullable: true })
  description: string;

  @Column()
  VIN: string;
}
