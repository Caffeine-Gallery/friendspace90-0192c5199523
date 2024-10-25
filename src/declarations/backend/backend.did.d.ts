import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type UserId = Principal;
export interface UserProfile {
  'status' : string,
  'name' : string,
  'topFriends' : Array<UserId>,
}
export interface _SERVICE {
  'createProfile' : ActorMethod<[string, string], undefined>,
  'getProfile' : ActorMethod<[UserId], [] | [UserProfile]>,
  'getTopFriends' : ActorMethod<[UserId], Array<[] | [UserProfile]>>,
  'updateTopFriends' : ActorMethod<[Array<UserId>], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
