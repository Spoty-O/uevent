import { Company } from 'src/company/entities/company.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  private tempPassword;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false, length: 50 })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @AfterLoad()
  private loadTempPassword() {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.password && this.password !== this.tempPassword) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

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
