import { Schema, model, Model } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser } from '../interfaces'

interface IUserModel extends Model<IUser> {
  login(username: string, password: string): Promise<IUser>
}
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    // minlength: [6, 'Minimum password length is 6 characters'],
  },
  createdAt: {
    type: Date,
    immutable: false,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  // email: {
  //   type: String,
  //   required: [true, 'Please enter an email'],
  //   unique: true,
  //   lowercase: true,
  // },
})

// --------------
// MONGOOSE HOOKS
// fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
  console.log('new user created', doc)
  next()
})

// fire a function before doc saved to db
// hash password
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  console.log('User about to be created & saved', this)
  next()
})
// --------------

userSchema.statics.login = async function (username: string, password: string) {
  const user = await this.findOne({ username })
  if (user) {
    const correctPassword = await bcrypt.compare(password, user.password)
    if (correctPassword) {
      return user
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect username')
}

//namnet 'User' här kommer mongoose leta efter och pluralizse (users)
const User = model<IUser, IUserModel>('User', userSchema)
export { User }
