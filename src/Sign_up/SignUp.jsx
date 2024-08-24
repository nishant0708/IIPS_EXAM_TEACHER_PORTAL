import React from "react";
import "./Sign_up.css";
import var1 from "../assets/iips_logo2.png";

const SignUp = () => {
  return (
    <div>
      <div className="Sign_up_Box ">
        <img src={var1} alt="" />
        <h3>Teacher : Sign Up</h3>
        <form action="">
          <div>
            <label>
              Name :
              <input
                type="text"
                placeholder="Enter your Name"
                // value={}
                required
              />
            </label>
          </div>

          <div>
            <label>
              Email :
              <input
                type="email"
                placeholder="Enter your Email"
                // value={}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                placeholder="Enter Your Password"
                //   value={password}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Confirm Password:
              <input
                type="password"
                placeholder="Confirm Your Password"
                //   value={password}
                required
              />
            </label>
          </div>
          <div>
            <label>
              OTP:
              <input
                type="text"
                placeholder="Enter OTP"
                // value={otp}
                required
              />
            </label>
          </div>
        </form>
        <button type="submit">Sign up</button>
      </div>
    </div>
  );
};

export default SignUp;
