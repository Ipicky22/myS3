import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { User } from './entity/User'

let createUser = (nickname: string, email: string, password: string): void => {

    createConnection()
        .then(async connection => {
            console.log('Inserting a new user into the database...')
            const user: User = new User()
            user.nickname = nickname
            user.email = email
            user.password = password
            await connection.manager.save(user)

            console.log('Saved a new user with id: ' + user.uuid)
            console.log('Loading users from the database...')
            
            const users = await connection.manager.find(User)

            console.log('Loaded users: ', users)

        })
        .catch(error => console.log(error))
}   

export default createUser