import { Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    let user = await prismaClient.user.findFirst({ where: { email } });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = hashSync(password, 10);

    user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const passwordMatch = compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
