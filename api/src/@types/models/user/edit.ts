import UserInput from "./input";
import ROLES from "./roles";

type EditUserInput = Pick<UserInput, "firstName" | "lastName"> & {
    role?: typeof ROLES.admin | typeof ROLES.user;
};

export default EditUserInput;
