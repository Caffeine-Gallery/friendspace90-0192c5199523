import { backend } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';

let authClient;
let principal;

async function init() {
  authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    handleAuthenticated();
  }
}

async function handleAuthenticated() {
  principal = authClient.getIdentity().getPrincipal();
  document.getElementById('profile').style.display = 'block';
  document.getElementById('topFriends').style.display = 'block';
  loadProfile();
  loadTopFriends();
}

async function loadProfile() {
  try {
    const profile = await backend.getProfile(principal);
    if (profile) {
      document.getElementById('name').value = profile.name;
      document.getElementById('status').value = profile.status;
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

async function loadTopFriends() {
  try {
    const topFriends = await backend.getTopFriends(principal);
    const friendsList = document.getElementById('friendsList');
    friendsList.innerHTML = '';
    topFriends.forEach((friend, index) => {
      if (friend) {
        const friendElement = document.createElement('div');
        friendElement.textContent = `${index + 1}. ${friend.name} - ${friend.status}`;
        friendsList.appendChild(friendElement);
      }
    });
  } catch (error) {
    console.error('Error loading top friends:', error);
  }
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const status = document.getElementById('status').value;
  try {
    await backend.createProfile(name, status);
    alert('Profile created successfully!');
    loadProfile();
  } catch (error) {
    console.error('Error creating profile:', error);
    alert('Error creating profile. Please try again.');
  }
});

document.getElementById('topFriendsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const friends = [
    document.getElementById('friend1').value,
    document.getElementById('friend2').value,
    document.getElementById('friend3').value,
    document.getElementById('friend4').value
  ].filter(id => id !== '');

  if (friends.length > 4) {
    alert('You can only have up to 4 top friends. Only the first 4 will be saved.');
    friends.length = 4;
  }

  try {
    await backend.updateTopFriends(friends);
    alert('Top friends updated successfully!');
    loadTopFriends();
  } catch (error) {
    console.error('Error updating top friends:', error);
    alert('Error updating top friends. Please try again.');
  }
});

init();
