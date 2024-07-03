import ActiveAccountForm from "@/features/common/auth/components/presentational/ActiveAccountForm";
import { RegisterForm } from "@/features/common/auth/components/presentational/RegisterForm";

const ActiveAccountPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
      <ActiveAccountForm />
    </div>
  );
};

export default ActiveAccountPage;
