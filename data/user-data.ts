import type { User } from '../interfaces/user';
import { Constants } from '../utilities/constants';
import { JsonReader } from '../utilities/json-reader';

export const user: Readonly<User> = Object.freeze({
    username: 'John Doe',
    password: 'ThisIsNotAPassword',
});

export const getLoginData = (): User =>
    JsonReader.read<User>(Constants.TEST_DATA.LOGIN_JSON);
