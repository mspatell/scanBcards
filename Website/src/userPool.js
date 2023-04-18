import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_VoVFHARQL",
    ClientId: "50235nhlbtvr2f0ef4dqs187ir"
}

export default new CognitoUserPool(poolData);