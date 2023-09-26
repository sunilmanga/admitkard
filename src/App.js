import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [warn, setWarn] = useState(false);
  const [user, setUser] = useState(null);
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setWarn(true)
      });
  }
  function redirectLogin() {
    setShowOTP(false);
  }
  return (
    <section className="lg:bg-pink-500 flex items-center justify-center bg-white h-screen">
      <div className="bg-pink-500" >
        <Toaster toastOptions={{ duration: 4000 }} />
        <div style={{ display: "none" }} id="recaptcha-container"></div>
        {user ? (
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center my-5">
              <img src="imgs/success.png" alt="success.png" />
            </div>
            <h2 className="text-center font-medium text-2xl lg:text-3xl xl:text-4xl">
              Welcome to AdmitKard
            </h2>
            <p className="text-[#999] w-60 mt-5 text-justify lg:text-2xl xl:3xl">
              In order to provide you with a custom experience, we need to ask
              you a few questions.
            </p>
            <div className="my-20">
              <button
                onChange={redirectLogin}
                className="bg-[#F7B348] px-8 py-2 rounded-3xl my-2 lg:px-10 lg:text-3xl xl:text-4xl lg:py-6 xl:px-12 xl:py-8"
              >
                Get Started
              </button>
              <p className="text-center">*This will only take 5 min.</p>
            </div>
          </div>
        ) : (
          <div className="w-80 flex flex-col items-center justify-center gap-4 rounded-lg p-4">
            {!showOTP && (
              <>
                <img
                  className="mt-[2rem]"
                  src="imgs/4c9a2bf05f0667bf6e8cbb07918363fd.png"
                  alt="admit"
                />
                <div className="mt-[111px] text-center">
                  <h1 className="font-medium text-xl lg:text-3xl xl:text-4xl">Welcome Back</h1>
                  <p className="my-5 text-[#666] text-xs lg:text-3xl lg:font-bold xl:text-4xl">
                    Please sign in to your account
                  </p>
                </div>
              </>
            )}

            {showOTP ? (
              <>
                <img src="imgs/mobilePic.svg" alt="mobilePic" />
                <p className="text-[#333] text-xl lg:text-3xl xl:text-4xl">
                  Please Verify Mobile Number
                </p>
                <p>An OTP is sent to {ph}</p>
                <p className="underline" onClick={redirectLogin}>
                  Change Phone Number
                </p>
           
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container border-2 border-bg-indigo-500"
                ></OtpInput>

               {warn &&(<p className="text-yellow-500">wrong otp please check</p>)} 
                <p>
                  Didn’t receive the code?{" "}
                  <span className="underline" onClick={onSignup}>
                    Resend
                  </span>
                </p>
                <button
                  onClick={onOTPVerify}
                  className="bg-[#F7B348] w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span className="text-base">Verify</span>
                </button>
              </>
            ) : (
              <>
                
                <PhoneInput country={"in"} value={ph} onChange={setPh} />
                <p className="text-center text-[#999] text-xs ">
                  We will send you a one time SMS message. Charges may apply.
                </p>
                <button
                  onClick={onSignup}
                  className="mt-20 bg-[#F7B348] w-full flex gap-1 items-center lg:text-2xl justify-center py-2.5 lg:py-5 lg:px-10 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span className="
                  ">Sign in with otp</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
