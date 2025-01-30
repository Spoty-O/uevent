import { Event } from 'src/event/entities/event.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  description: string;

  @Column({ default: 'default.jpg' })
  picturePath: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @OneToMany(() => Event, (event) => event.user)
  company: Event[];
}
