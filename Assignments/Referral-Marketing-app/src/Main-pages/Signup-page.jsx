import React from "react";
import { Link } from "react-router-dom";

const SignupPage = () => {
    return (
        <div className="Signup/Login_base_container">
            <p className="Signup/Login_top_heading">
                Register for ReferralHub
            </p>
            <form>
                <label>
                    <p>Email id</p>
                    <input type="email" required placeholder="abc@gmail.com"/>
                </label>
                <label>
                    <p>Create Password</p>
                    <input type="password" required placeholder="Enter password"/>
                </label>
                <label>
                    <p>Confrim Password</p>
                    <input type="password" required placeholder="Re-enter password"/>
                </label>
            </form>
        </div>
    )
}

export default SignupPage;