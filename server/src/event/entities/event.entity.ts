import { Company } from 'src/company/entities/company.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  date: Date;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @ManyToOne(() => Company, (company) => company.events, {
    onDelete: 'CASCADE',
  })
  company: Company;
}
