// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import Model, {Associations} from '@nozbe/watermelondb/Model';
import {children, field, json, lazy} from '@nozbe/watermelondb/decorators';

import {MM_TABLES} from '@constants/database';
import Channel from '@typings/database/channel';
import GroupsInTeam from '@typings/database/groups_in_team';

// import MyTeam from '@typings/database/my_team';
import SlashCommand from '@typings/database/slash_command';
import TeamChannelHistory from '@typings/database/team_channel_history';
import TeamMembership from '@typings/database/team_membership';
import TeamSearchHistory from '@typings/database/team_search_history';

const {
    CHANNEL,
    GROUPS_IN_TEAM,
    TEAM,
    MY_TEAM,
    SLASH_COMMAND,
    TEAM_CHANNEL_HISTORY,
    TEAM_MEMBERSHIP,
    TEAM_SEARCH_HISTORY,
} = MM_TABLES.SERVER;

/**
 * A Team houses and enables communication to happen across channels and users.
 */
export default class Team extends Model {
    /** table (entity name) : Team */
    static table = TEAM;

    /** associations : Describes every relationship to this entity. */
    static associations: Associations = {

        /** A TEAM has a 1:N relationship with CHANNEL. A TEAM can possess multiple channels */
        [CHANNEL]: {type: 'has_many', foreignKey: 'team_id'},

        /** A TEAM has a 1:N relationship with GROUPS_IN_TEAM. A TEAM can possess multiple groups */
        [GROUPS_IN_TEAM]: {type: 'has_many', foreignKey: 'team_id'},

        /** A TEAM has a 1:1 relationship with MY_TEAM. */
        [MY_TEAM]: {type: 'has_many', foreignKey: 'team_id'},

        /** A TEAM has a 1:N relationship with SLASH_COMMAND. A TEAM can possess multiple slash commands */
        [SLASH_COMMAND]: {type: 'has_many', foreignKey: 'team_id'},

        /** A TEAM has a 1:N relationship with TEAM_CHANNEL_HISTORY. A TEAM can possess multiple channels histories*/
        [TEAM_CHANNEL_HISTORY]: {type: 'has_many', foreignKey: 'team_id'},

        /** A TEAM has a 1:N relationship with TEAM_MEMBERSHIP. A TEAM can regroup multiple users */
        [TEAM_MEMBERSHIP]: {type: 'has_many', foreignKey: 'team_id'},

        /** A TEAM has a 1:N relationship with TEAM_SEARCH_HISTORY. A TEAM can possess multiple channels recently visited*/
        [TEAM_SEARCH_HISTORY]: {type: 'has_many', foreignKey: 'team_id'},
    };

    /** allow_open_invite : Boolean flag indicating if this team is open to the public */
    @field('allow_open_invite') allowOpenInvite: boolean | undefined;

    /** description : The description for the team */
    @field('description') description: string | undefined;

    /** display_name : The display name for the team */
    @field('display_name') displayName: string | undefined;

    /** is_group_constrained : Boolean flag indicating if members are managed groups */
    @field('is_group_constrained') isGroupConstrained: boolean | undefined;

    /** last_team_icon_updated_at : Timestamp for when this team's icon has been updated last */
    @field('last_team_icon_updated_at') lastTeamIconUpdatedAt: number | undefined;

    /** name : The name for the team */
    @field('name') name: string | undefined;

    /** type : The type of team ( e.g. open/private ) */
    @field('type') type: string | undefined;

    /** allowed_domains : List of domains that can join this team */
    @json('allowed_domains', (rawJson) => rawJson) allowedDomains: string[] | undefined;

    /** channels : All the channels associated with this team */
    @children(CHANNEL) channels: Channel | undefined;

    /** groupsInTeam : All the groups associated with this team */
    @children(GROUPS_IN_TEAM) groupsInTeam: GroupsInTeam | undefined;

    /** myTeams : Lazy query property returning only the teams that this user is part of  */
    @lazy myTeams = this.collections.get(MY_TEAM).query(Q.on(TEAM, 'id', this.id));

    /** slashCommands : All the slash commands associated with this team */
    @children(SLASH_COMMAND) slashCommands: SlashCommand | undefined;

    /** teamChannelHistories : All the channel history with this team */
    @children(TEAM_CHANNEL_HISTORY) teamChannelHistories: TeamChannelHistory | undefined;

    /** members : All the users associated with this team */
    @children(TEAM_MEMBERSHIP) members: TeamMembership | undefined;

    /** teamSearchHistories : All the searches performed on this team */
    @children(TEAM_SEARCH_HISTORY) teamSearchHistories: TeamSearchHistory | undefined;
}
