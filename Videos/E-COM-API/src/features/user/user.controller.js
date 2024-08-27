import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';

export default class UserController {

  constructor(){
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res, next){
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const userID = req.userID;
    try{
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is updated");
    }catch(err){
      console.log(err);
      next(err);
    }
  }

  async signUp(req, res, next) {
    const { name, email, password, role } = req.body;
    try{
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedPassword, role);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    }catch(err){
      next(err);
    }
  }

  async signIn(req, res, next) {
    try{
      const user = await this.userRepository.findByEmail(req.body.email);
      if(!user){
        return res.status(400).send('Incorrect Credentials');
      }else{
        const result = await bcrypt.compare(req.body.password, user.password);
        if(result){
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
              role: user.role,
            },
            'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz',
            {
              expiresIn: '1h',
            }
          );
          return res.status(200).send({ token, role: user.role });
        }else{
          return res.status(400).send('Incorrect Credentials');
        }
      }
    }catch(err){
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async assignRole(req, res, next) {
    const { userId, role } = req.body;
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).send('User not found.');
      }
      user.role = role;
      await user.save();
      res.status(200).send('Role assigned successfully.');
    } catch (err) {
      console.log('Error assigning role:', err);
      next(err);
    }
  }
}
