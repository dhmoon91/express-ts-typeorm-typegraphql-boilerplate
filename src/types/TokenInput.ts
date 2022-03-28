import { Field, InputType } from 'type-graphql';

/**
 * input type for apple and google token
 */

@InputType()
export class GoogleTokenInput {
    @Field({ nullable: true })
    refreshToken: string;
}
