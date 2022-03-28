import { Field, InputType } from 'type-graphql';

@InputType()
export class EventInput {
    @Field({ nullable: false })
    summary!: string;

    @Field({ nullable: false })
    description!: string;

    @Field({ nullable: false })
    startDateTime!: string;

    @Field({ nullable: false })
    endDateTime!: string;

    @Field({ nullable: true })
    userId!: number;
}
