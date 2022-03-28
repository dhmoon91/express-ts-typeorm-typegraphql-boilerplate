import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { User } from './user.entity';

@Entity()
@ObjectType()
export class GoogleToken extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    calendarId: string;

    @Field(() => String)
    @Column()
    refreshToken: string;

    @Field(() => Number)
    @Column({ nullable: true })
    userId: number;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}
