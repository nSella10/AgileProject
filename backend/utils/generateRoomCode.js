export const generateRoomCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit string
};
