import FormHead from "../components/FormHead";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  return (
    <div className="h-full">
      <FormHead text="let's register first" />
      <SignUpForm />
    </div>
  );
};
export default SignUp;
