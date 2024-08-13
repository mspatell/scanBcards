import { CognitoUserPool } from "amazon-cognito-identity-js";
require('dotenv').config();

const userPoolId = process.env.USER_POOL_ID;
const clientId = process.env.CLIENT_ID;

const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId
};

const userPool = new CognitoUserPool(poolData);

export default userPool;
