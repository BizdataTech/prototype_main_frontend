import FormHead from "../components/FormHead";
import SignInForm from "./SignInForm";

const SignIn = () => {
  return (
    <div>
      <FormHead text="Log in before further action!" />
      <SignInForm />
    </div>
  );
};
export default SignIn;
