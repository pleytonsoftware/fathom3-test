import UserInput from "./input";

type EditUserInput = Pick<UserInput, "firstName" | "lastName">;

export default EditUserInput;
