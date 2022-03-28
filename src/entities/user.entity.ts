import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { GoogleToken } from './googleToken.entity';
import { Event } from './event.entity';

/**
 * This file takes care of both model definition AND graphql object type definitions.
 * We still have to create separate type for InputTypes for typegraphql to accept tho.
 */
@Entity()
@ObjectType()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    email!: string;

    @Field(() => String)
    @Column()
    firstName!: string;

    @Field(() => String)
    @Column()
    lastName!: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    picture?: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    password: string;

    @Field(() => Boolean)
    @Column({
        comment: 'Has the user synchronized Google or Apple calendar ?',
        default: false,
    })
    isSync!: boolean;

    @Field(() => Number, { nullable: true })
    @Column({ nullable: true })
    googleTokenId: number;

    @Field({ nullable: true })
    @OneToOne(() => GoogleToken, {
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    googleToken: GoogleToken;

    @OneToMany(() => Event, (event) => event.user, { cascade: true })
    @Field(() => [Event], { nullable: true })
    events: Event[];
}
