import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "ca-central-1_KgTjaXQJq",
    ClientId: "7c7u2tg8fon7jppism68b2npu4"
};

const userPool = new CognitoUserPool(poolData);

export default userPool;
