import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

/**
 * This file takes care of both model definition AND graphql object type definitions.
 * We still have to create separate type for InputTypes for typegraphql to accept tho.
 */
@Entity()
@ObjectType()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    name!: string;

    @Field(() => String)
    @Column()
    username!: string;

    @Field(() => String)
    @Column()
    password!: string;
}
