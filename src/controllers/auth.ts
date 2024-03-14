import { Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync } from 'bcrypt';

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
