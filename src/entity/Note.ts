import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  BaseEntity,
  OneToMany,
  ManyToMany
} from "typeorm";

import { User } from "./User";
import { SharedNote } from "./SharedNote";

@Entity()
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  // join
  @Column()
  ownerId: number;
  @ManyToMany(() => User, (user) => user.notes)
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @OneToMany(() => SharedNote, (sharedNote) => sharedNote.note)
  shares: SharedNote[];
}
