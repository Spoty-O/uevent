import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 50 })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Column({ default: '/public/default_company_img.gif' })
  picturePath: string;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: true })
  visible: boolean;

  @OneToOne(() => Company, (company) => company.user, { cascade: true })
  company?: Company;
}
