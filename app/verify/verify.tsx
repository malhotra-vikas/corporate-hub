import { Input } from "@/components/ui/input";
import { VerifyUserDto } from "@/dto/verifyUser.dto";
import UserApi from "@/lib/api/user.api";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "react-day-picker";
import { toast } from "react-toastify";
import AiirHubIcon from "@public/airhub-logo.png";
import bgImg from "@assets/VerifyBg.png";
import { useFormik } from "formik";
import { useRouter } from "next/router"; // Use Next.js Router for navigation
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { useMutation } from "react-query"; // Import useMutation

interface VerifyUser {
  userId: string;
  password: string;
}

const VerifyPage = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPass, setIsShowConfirmPass] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const userApi = new UserApi();

  const form = useFormik({
    initialValues: new VerifyUserDto(),
    validationSchema: VerifyUserDto.yupSchema(),
    onSubmit: async (values: { password: any }) => {
      const { password } = values;

      if (!password) {
        toast.error("Password is required");
        return;
      }

      if (!id) {
        toast.error("User ID is missing");
        return;
      }

      const payload: VerifyUser = {
        userId: id,
        password: password,
      };

      await mutateAsync(payload); // Trigger the mutation when the form is submitted
    },
  });

  const verifyUser = async (values: VerifyUser) => {
    return await userApi.verifyUser(values);
  };

  // React Query's useMutation hook
  const { mutateAsync } = useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      toast.success("Password Created Successfully!");
      router.push("/login");
    },
    onError: (error: any) => {
      if (error?.response?.data?.message.includes("Cast to ObjectId failed")) {
        toast.error("User ID is invalid!");
        router.push("/login");
      } else if (error?.response?.data?.message === "User not found") {
        toast.error("User ID is invalid!");
        router.push("/login");
      } else {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const handlePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleConfirmPass = () => {
    setIsShowConfirmPass(!isShowConfirmPass);
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-contain bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="w-[35%] p-4 backdrop-blur-lg flex flex-col px-3 rounded-3xl border-2 border-solid border-white ">
        <div className="flex justify-center items-center ">
          <img src={AiirHubIcon} alt="hippo icon" className="h-32 w-32 " />
        </div>
        <h2 className="text-[#1B2559] font-bold text-3xl pb-4 text-center font-PlusJakartaSans">
          Set Your Password
        </h2>
        <form onSubmit={form.handleSubmit}>
          <div className="w-full p-2">
            <div className="flex w-full flex-col">
              <Input
                labelText="Password"
                name="password"
                type={isShowPassword ? "" : "password"}
                formik={form}
                placeholder="Atleast 8 Characters"
                labelClass="text-[#1D275B] text-base font-PlusJakartaSans select-none"
                icon={
                  isShowPassword ? (
                    <IoEyeOutline
                      color=""
                      className="w-8 h-8 font-Arimo cursor-pointer"
                      onClick={handlePassword}
                    />
                  ) : (
                    <FaRegEyeSlash
                      color=""
                      className="w-8 h-8 font-Arimo cursor-pointer"
                      onClick={handlePassword}
                    />
                  )
                }
              />
              <Input
                labelText="Confirm Password"
                name="confirm_password"
                type={isShowConfirmPass ? "" : "password"}
                formik={form}
                icon={
                  isShowConfirmPass ? (
                    <IoEyeOutline
                      color=""
                      className="w-8 h-8 font-Arimo cursor-pointer"
                      onClick={handleConfirmPass}
                    />
                  ) : (
                    <FaRegEyeSlash
                      color=""
                      className="w-8 h-8 font-Arimo cursor-pointer"
                      onClick={handleConfirmPass}
                    />
                  )
                }
                placeholder="Confirm Password"
                labelClass="text-[#1D275B] text-base font-PlusJakartaSans select-none"
              />
            </div>
            <Button
              className="bg-[#1B2559] w-full hover:bg-[#1B2559] rounded-xl mt-2 cursor-pointer font-PlusJakartaSans text-lg select-none "
              type="submit"
            >
              Verify
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
