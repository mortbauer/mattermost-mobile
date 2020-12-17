// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Model, {Associations} from '@nozbe/watermelondb/Model';
import {field, immutableRelation} from '@nozbe/watermelondb/decorators';

import {MM_TABLES} from '@constants/database';
import Channel from '@typings/database/channel';

const {CHANNEL, POSTS_IN_CHANNEL} = MM_TABLES.SERVER;

/**
 * PostsInChannel model helps us to combine adjacent posts together without leaving
 * gaps in between for an efficient user reading experience of posts.
 */
export default class PostsInChannel extends Model {
    /** table (entity name) : PostsInChannel */
    static table = POSTS_IN_CHANNEL;

    /** associations : Describes every relationship to this entity. */
    static associations: Associations = {

        /** A CHANNEL has a 1:N relationship with  POSTS_IN_CHANNEL*/
        [CHANNEL]: {type: 'belongs_to', key: 'channel_id'},
    };

    /** channel_id : The foreign key of the related parent channel */
    @field('channel_id') channelId: string | undefined;

    /** earliest : The earliest timestamp of the post in that channel  */
    @field('earliest') earliest: number | undefined;

    /** latest : The latest timestamp of the post in that channel  */
    @field('latest') latest: number | undefined;

    /** channel : The parent record of the channel for those posts */
    @immutableRelation(CHANNEL, 'channel_id') channel: Channel | undefined;
}
