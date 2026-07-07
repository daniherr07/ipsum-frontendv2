export default function isAdmin(roleID) {
  const admins = [1, 2, 7, 9, 10];
  return admins.includes(parseInt(roleID));
}
