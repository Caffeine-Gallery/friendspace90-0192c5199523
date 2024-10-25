import Hash "mo:base/Hash";
import Text "mo:base/Text";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Int "mo:base/Int";

actor {
  type UserId = Principal;

  type UserProfile = {
    name: Text;
    status: Text;
    topFriends: [UserId];
  };

  let userProfiles = HashMap.HashMap<UserId, UserProfile>(10, Principal.equal, Principal.hash);

  public shared(msg) func createProfile(name: Text, status: Text) : async () {
    let caller = msg.caller;
    let newProfile : UserProfile = {
      name = name;
      status = status;
      topFriends = [];
    };
    userProfiles.put(caller, newProfile);
  };

  public shared(msg) func updateTopFriends(newTopFriends: [UserId]) : async () {
    let caller = msg.caller;
    switch (userProfiles.get(caller)) {
      case (null) {
        // Profile doesn't exist, do nothing
      };
      case (?profile) {
        var topFriends = Array.init<UserId>(4, Principal.fromText("2vxsx-fae"));
        for (i in Iter.range(0, Int.min(3, newTopFriends.size() - 1))) {
          topFriends[i] := newTopFriends[i];
        };
        let updatedProfile : UserProfile = {
          name = profile.name;
          status = profile.status;
          topFriends = Array.freeze(topFriends);
        };
        userProfiles.put(caller, updatedProfile);
      };
    };
  };

  public query func getProfile(userId: UserId) : async ?UserProfile {
    userProfiles.get(userId)
  };

  public query func getTopFriends(userId: UserId) : async [?UserProfile] {
    switch (userProfiles.get(userId)) {
      case (null) { 
        Array.tabulate<?UserProfile>(4, func(_) { null })
      };
      case (?profile) {
        Array.map<UserId, ?UserProfile>(
          profile.topFriends,
          func(friendId) { userProfiles.get(friendId) }
        )
      };
    };
  };
}
