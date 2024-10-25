export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Principal;
  const UserProfile = IDL.Record({
    'status' : IDL.Text,
    'name' : IDL.Text,
    'topFriends' : IDL.Vec(UserId),
  });
  return IDL.Service({
    'createProfile' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'getProfile' : IDL.Func([UserId], [IDL.Opt(UserProfile)], ['query']),
    'getTopFriends' : IDL.Func(
        [UserId],
        [IDL.Vec(IDL.Opt(UserProfile))],
        ['query'],
      ),
    'updateTopFriends' : IDL.Func([IDL.Vec(UserId)], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
