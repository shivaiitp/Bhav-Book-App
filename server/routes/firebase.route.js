// server/routes/firebaseAuth.routes.js
import express from 'express';
import admin from '../firebase.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/firebase-login', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'ID token is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      user = new User({
        firebaseUID: uid,
        email,
        name,
        avatar: picture,
      });
      await user.save();
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error during Firebase login:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;
