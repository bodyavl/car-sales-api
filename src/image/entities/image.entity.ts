import { Car } from 'src/car/entities/car.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @ManyToOne(() => Car, (car) => car.images, { onDelete: 'CASCADE' })
  car: Car;
}
