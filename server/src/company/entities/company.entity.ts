import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 50 })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ length: 500, default: '' })
  description: string;

  @Column({ default: '/public/default_company_img.gif' })
  picturePath: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude?: number;

  @OneToOne(() => User, (user) => user.company)
  @JoinColumn()
  user: User;
}
