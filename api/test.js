export default async function handler(req, res) {
  console.log('Starting test handler');
  res.status(200).json({ message: 'Test endpoint working' });
}
