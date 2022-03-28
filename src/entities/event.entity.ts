import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { User } from './user.entity';

@Entity()
@ObjectType()
export class Event extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    summary!: string;

    @Field(() => String)
    @Column()
    description!: string;

    @Field(() => String)
    @Column()
    startDateTime!: string;

    @Field(() => String)
    @Column()
    endDateTime!: string;

    @Field(() => String)
    @Column({
        comment: 'confirmed || cancelled',
        default: 'confirmed',
    })
    status!: string;

    @Field(() => Number)
    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => User, (user) => user.events, {
        onDelete: 'SET NULL',
    })
    user: User;
}
